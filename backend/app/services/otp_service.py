import logging
import secrets
from datetime import datetime, timedelta
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models import Student, Company, Admin, OTP
from app.crud.otp_crud import (
    save_otp,
    get_active_otp,
    increment_retry_count,
    delete_otp,
    get_last_otp_time
)
from app.services.email_service import EmailService
from app.utils.security import hash_password

logger = logging.getLogger(__name__)

def generate_secure_otp() -> str:
    # Generates a cryptographically secure 6-digit numeric OTP
    return "".join(secrets.choice("0123456789") for _ in range(6))

def check_email_exists(db: Session, email: str):
    # Check in Admin first
    admin = db.query(Admin).filter(Admin.email == email).first()
    if admin:
        return admin, "admin", admin.full_name

    # Check in Student
    student = db.query(Student).filter(Student.email == email).first()
    if student:
        return student, "student", f"{student.first_name} {student.last_name}"

    # Check in Company
    company = db.query(Company).filter(Company.email == email).first()
    if company:
        return company, "company", company.company_name

    return None, None, None

def send_otp_service(db: Session, email: str):
    user_record, role, name = check_email_exists(db, email)
    if not user_record:
        logger.warning(f"OTP Request failed: Email {email} is not registered")
        raise HTTPException(
            status_code=404,
            detail="Email address not registered"
        )

    # Cooldown check: 60 seconds
    last_created = get_last_otp_time(db, email)
    if last_created:
        time_elapsed = datetime.utcnow() - last_created
        if time_elapsed < timedelta(seconds=60):
            wait_seconds = 60 - int(time_elapsed.total_seconds())
            logger.warning(f"OTP Request rate limited for {email}. Wait {wait_seconds}s")
            raise HTTPException(
                status_code=400,
                detail=f"Please wait {wait_seconds} seconds before requesting a new code"
            )

    otp = generate_secure_otp()
    save_otp(db, email, otp, expiry_minutes=5)
    logger.info(f"OTP code generated and stored for {email} (role: {role})")

    # Send the email. This is non-blocking to the transaction.
    EmailService.send_otp_email(email, otp)

    return {"message": "Verification code has been sent to your email"}

def verify_otp_service(db: Session, email: str, otp: str):
    user_record, role, name = check_email_exists(db, email)
    if not user_record:
        raise HTTPException(
            status_code=404,
            detail="Email address not registered"
        )

    db_otp = db.query(OTP).filter(
        OTP.email == email,
        OTP.verified_status == False
    ).first()

    if not db_otp:
        raise HTTPException(
            status_code=400,
            detail="No active OTP found. Please request a new code"
        )

    # Check if expired
    if db_otp.expiry_time < datetime.utcnow():
        delete_otp(db, email)
        logger.warning(f"OTP verification failed for {email}: Code expired")
        raise HTTPException(
            status_code=400,
            detail="Verification code has expired. Please request a new code"
        )

    # Verify input OTP
    if db_otp.otp == otp:
        db_otp.verified_status = True
        db.commit()
        logger.info(f"OTP verified successfully for {email}")
        return {"message": "OTP verified successfully"}
    else:
        increment_retry_count(db, db_otp)
        attempts_remaining = 5 - db_otp.retry_count
        logger.warning(f"Invalid OTP entered for {email}. Attempts remaining: {attempts_remaining}")
        if db_otp.retry_count >= 5:
            delete_otp(db, email)
            raise HTTPException(
                status_code=400,
                detail="Maximum retry attempts exceeded. This OTP has been invalidated"
            )
        raise HTTPException(
            status_code=400,
            detail=f"Invalid verification code. {attempts_remaining} attempts remaining"
        )

def reset_password_service(db: Session, email: str, otp: str, new_password: str):
    user_record, role, name = check_email_exists(db, email)
    if not user_record:
        raise HTTPException(
            status_code=404,
            detail="Email address not registered"
        )

    # Verify OTP context is correct and verified
    db_otp = db.query(OTP).filter(
        OTP.email == email,
        OTP.otp == otp,
        OTP.verified_status == True,
        OTP.expiry_time > datetime.utcnow()
    ).first()

    if not db_otp:
        logger.warning(f"Unauthorized password reset attempt for {email} with OTP {otp}")
        raise HTTPException(
            status_code=400,
            detail="Invalid or unverified verification code. Please verify the code first"
        )

    # Password validation
    if len(new_password) < 8:
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 8 characters long"
        )

    # Update password for respective role
    hashed_pwd = hash_password(new_password)
    if role == "student":
        user_record.password = hashed_pwd
    elif role == "company":
        user_record.password = hashed_pwd
    elif role == "admin":
        user_record.hashed_password = hashed_pwd

    # Save update
    db.commit()
    logger.info(f"Password reset successfully for {email} (role: {role})")

    # Delete the OTP record immediately
    delete_otp(db, email)

    # Trigger password change confirmation email
    EmailService.send_password_changed(email, name)

    return {"message": "Password has been reset successfully"}
