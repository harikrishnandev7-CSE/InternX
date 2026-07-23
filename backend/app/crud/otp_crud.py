from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from app.models import OTP

def save_otp(db: Session, email: str, otp: str, expiry_minutes: int = 5):
    # First, clean up any previous OTPs for this email to avoid duplicates
    db.query(OTP).filter(OTP.email == email).delete()
    db.commit()

    expiry_time = datetime.utcnow() + timedelta(minutes=expiry_minutes)
    db_otp = OTP(
        email=email,
        otp=otp,
        expiry_time=expiry_time,
        created_time=datetime.utcnow(),
        verified_status=False,
        retry_count=0
    )
    db.add(db_otp)
    db.commit()
    db.refresh(db_otp)
    return db_otp

def get_active_otp(db: Session, email: str):
    return db.query(OTP).filter(
        OTP.email == email,
        OTP.expiry_time > datetime.utcnow(),
        OTP.verified_status == False
    ).first()

def increment_retry_count(db: Session, otp_record: OTP):
    otp_record.retry_count += 1
    db.commit()
    db.refresh(otp_record)
    return otp_record

def delete_otp(db: Session, email: str):
    db.query(OTP).filter(OTP.email == email).delete()
    db.commit()

def get_last_otp_time(db: Session, email: str):
    # Get the latest OTP created time (including expired or verified ones, to ensure rate-limiting works correctly)
    last_otp = db.query(OTP).filter(OTP.email == email).order_by(OTP.created_time.desc()).first()
    if last_otp:
        return last_otp.created_time
    return None
