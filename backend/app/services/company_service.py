# Database session use pannrom
from sqlalchemy.orm import Session
# HTTP exception use pannrom
from fastapi import HTTPException

# Company CRUD functions import pannrom
from app.crud.company_crud import (
    create_company,
    get_company_by_email,
    get_company_by_phone,
    get_company_dashboard_stats
)
# Password hash panna use pannrom
from app.utils.security import hash_password

# Password verify panna use pannrom
from app.utils.security import verify_password, create_access_token


# Company register panna use pannrom
def register_company_service(db: Session, company):

    # Phone length check pannrom
    if len(company.phone) != 10:
        raise HTTPException(
            status_code=400,
            detail="Phone number must contain exactly 10 digits"
        )

    # Phone digits check pannrom
    if not company.phone.isdigit():
        raise HTTPException(
            status_code=400,
            detail="Phone number must contain only digits"
        )

    # Password length check pannrom
    if len(company.password) < 8:
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 8 characters"
        )

    # Duplicate email check pannrom
    if get_company_by_email(db, company.email):
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    # Duplicate phone check pannrom
    if get_company_by_phone(db, company.phone):
        raise HTTPException(
            status_code=400,
            detail="Phone number already exists"
        )

    # Password hash pannrom
    company.password = hash_password(company.password)

    # CRUD call pannrom
    new_company = create_company(db, company)

    # Send welcome email (safely, won't block the API response)
    from app.services.email_service import EmailService
    EmailService.send_company_welcome(new_company.email, new_company.company_name)

    return new_company

# Company login panna use pannrom
def login_company_service(db: Session, company):

    # Email use panni company edukkrom
    db_company = get_company_by_email(db, company.email)

    # Company irukka check pannrom
    if db_company is None:
        raise HTTPException(
            status_code=404,
            detail="Company not found"
        )

    # Password verify pannrom
    if not verify_password(
        company.password,
        db_company.password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid password"
        )

    # Company approval status check pannrom
    if db_company.approval_status != "Approved":
        if db_company.approval_status == "Rejected":
            raise HTTPException(
                status_code=403,
                detail="Your company registration was rejected. Please contact support."
            )
        else:
            raise HTTPException(
                status_code=403,
                detail="Your company registration is pending approval."
            )

    # JWT token create pannrom
    access_token = create_access_token(
        {
            "sub": db_company.email
        }
    )

    # Login response return pannrom
    return {
        "message": "Company Login Successful",
        "access_token": access_token,
        "token_type": "bearer"
    }

# Login company profile return pannrom
def get_company_profile_service(current_company):

    # Current login company return pannrom
    return current_company

# Fetch company dashboard stats service
def get_company_dashboard_stats_service(db: Session, current_company):
    return get_company_dashboard_stats(db, current_company.id)