# company database operations..
# Database session import pannrom
from sqlalchemy.orm import Session
from sqlalchemy import func
# Company model import pannrom
from app.models import Company, Internship, Application

# Email use panni company edukkrom
def get_company_by_email(db: Session, email: str):
    return db.query(Company).filter(Company.email == email).first()

# Phone use panni company edukkrom
def get_company_by_phone(db: Session, phone: str):
    return db.query(Company).filter(Company.phone == phone).first()


# Company register pannrom
def create_company(db: Session, company):

    db_company = Company(
        company_name=company.company_name,
        email=company.email,
        phone=company.phone,
        password=company.password,
        website=company.website,
        location=company.location,
        description=company.description
    )
    # Database-la save pannrom
    db.add(db_company)
    # Commit pannrom
    db.commit()
    # Latest values reload pannrom
    db.refresh(db_company)
    return db_company

# Fetch company dashboard stats using SQLAlchemy aggregation
def get_company_dashboard_stats(db: Session, company_id: int):
    # Count total and active internships
    total_internships = db.query(func.count(Internship.id)).filter(Internship.company_id == company_id).scalar() or 0
    active_internships = db.query(func.count(Internship.id)).filter(Internship.company_id == company_id, Internship.is_active == True).scalar() or 0
    inactive_internships = total_internships - active_internships

    # Count total applicants/applications
    total_applicants = (
        db.query(func.count(Application.id))
        .join(Internship, Internship.id == Application.internship_id)
        .filter(Internship.company_id == company_id)
        .scalar()
    ) or 0

    # Count status breakdown
    status_counts = (
        db.query(Application.status, func.count(Application.id))
        .join(Internship, Internship.id == Application.internship_id)
        .filter(Internship.company_id == company_id)
        .group_by(Application.status)
        .all()
    )

    status_map = {status.lower().replace(" ", "_"): count for status, count in status_counts}

    return {
        "total_internships": total_internships,
        "active_internships": active_internships,
        "inactive_internships": inactive_internships,
        "total_applicants": total_applicants,
        "under_review": status_map.get("under_review", 0),
        "shortlisted": status_map.get("shortlisted", 0),
        "selected": status_map.get("selected", 0),
        "rejected": status_map.get("rejected", 0)
    }