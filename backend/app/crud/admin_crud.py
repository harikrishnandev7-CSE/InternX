from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from app.models import Student, Company, Internship, Application, Admin, ActivityLog, Skill
from datetime import datetime

# Email use panni admin profile edukkrom
def get_admin_by_email(db: Session, email: str):
    return db.query(Admin).filter(Admin.email == email).first()

# ID use panni admin profile edukkrom
def get_admin_by_id(db: Session, admin_id: int):
    return db.query(Admin).filter(Admin.id == admin_id).first()

# Admin profile details update pannrom
def update_admin_profile(db: Session, admin: Admin, full_name: str, email: str):
    admin.full_name = full_name
    admin.email = email
    admin.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(admin)
    return admin

# Admin password change/update pannrom
def update_admin_password(db: Session, admin: Admin, hashed_password: str):
    admin.hashed_password = hashed_password
    admin.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(admin)
    return admin

# Admin perform panna action activity_logs-la save pannrom
def create_activity_log(db: Session, action: str, details: str):
    log = ActivityLog(
        action=action,
        details=details,
        created_at=datetime.utcnow()
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    return log

# Full activity logs list sort panni edukkrom
def get_all_activity_logs(db: Session, limit: int = 100):
    return db.query(ActivityLog).order_by(ActivityLog.created_at.desc()).limit(limit).all()

# Admin dashboard aggregated counts and statistics queries
def get_admin_dashboard_stats(db: Session):
    total_students = db.query(func.count(Student.id)).scalar() or 0
    total_companies = db.query(func.count(Company.id)).scalar() or 0
    
    approved_companies = db.query(func.count(Company.id)).filter(Company.approval_status == "Approved").scalar() or 0
    pending_companies = db.query(func.count(Company.id)).filter(Company.approval_status == "Pending").scalar() or 0
    rejected_companies = db.query(func.count(Company.id)).filter(Company.approval_status == "Rejected").scalar() or 0
    
    total_internships = db.query(func.count(Internship.id)).scalar() or 0
    active_internships = db.query(func.count(Internship.id)).filter(Internship.is_active == True).scalar() or 0
    inactive_internships = total_internships - active_internships
    
    total_applications = db.query(func.count(Application.id)).scalar() or 0
    under_review = db.query(func.count(Application.id)).filter(Application.status.ilike("under review")).scalar() or 0
    shortlisted = db.query(func.count(Application.id)).filter(Application.status.ilike("shortlisted")).scalar() or 0
    selected = db.query(func.count(Application.id)).filter(Application.status.ilike("selected")).scalar() or 0
    rejected = db.query(func.count(Application.id)).filter(Application.status.ilike("rejected")).scalar() or 0

    return {
        "total_students": total_students,
        "total_companies": total_companies,
        "approved_companies": approved_companies,
        "pending_companies": pending_companies,
        "rejected_companies": rejected_companies,
        "total_internships": total_internships,
        "active_internships": active_internships,
        "inactive_internships": inactive_internships,
        "total_applications": total_applications,
        "under_review_applications": under_review,
        "shortlisted_applications": shortlisted,
        "selected_applications": selected,
        "rejected_applications": rejected
    }

# Student list search context and pagination logic
def get_all_students_admin(db: Session, search: str = None, page: int = 1, limit: int = 10):
    query = db.query(Student)
    if search:
        query = query.filter(
            or_(
                Student.first_name.ilike(f"%{search}%"),
                Student.last_name.ilike(f"%{search}%"),
                Student.email.ilike(f"%{search}%"),
                Student.department.ilike(f"%{search}%")
            )
        )
    
    total = query.count()
    offset = (page - 1) * limit
    items = query.order_by(Student.id.desc()).offset(offset).limit(limit).all()
    return items, total

# Student and cascaded items deletion operation
def delete_student_admin(db: Session, student_id: int):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        return False
    db.delete(student)
    db.commit()
    return True

# Company list filtering/search/pagination
def get_all_companies_admin(db: Session, search: str = None, approval_status: str = None, page: int = 1, limit: int = 10):
    query = db.query(Company)
    if search:
        query = query.filter(
            or_(
                Company.company_name.ilike(f"%{search}%"),
                Company.email.ilike(f"%{search}%"),
                Company.location.ilike(f"%{search}%")
            )
        )
    if approval_status:
        query = query.filter(Company.approval_status == approval_status)
        
    total = query.count()
    offset = (page - 1) * limit
    items = query.order_by(Company.id.desc()).offset(offset).limit(limit).all()
    return items, total

# Company approval/rejection state update
def update_company_status_admin(db: Session, company_id: int, approval_status: str):
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        return None
    company.approval_status = approval_status
    if approval_status == "Approved":
        company.is_approved = True
    else:
        company.is_approved = False
    db.commit()
    db.refresh(company)
    return company

# Company active boolean update (Activate/Deactivate)
def update_company_active_admin(db: Session, company_id: int, is_active: bool):
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        return None
    company.is_approved = is_active
    db.commit()
    db.refresh(company)
    return company

# Company delete
def delete_company_admin(db: Session, company_id: int):
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        return False
    # Cascade deletes: internships and applications cascade can be handled here
    # 1. Delete all applications related to this company's internships
    db.query(Application).filter(Application.internship_id.in_(
        db.query(Internship.id).filter(Internship.company_id == company_id)
    )).delete(synchronize_session=False)
    # 2. Delete all company internships
    db.query(Internship).filter(Internship.company_id == company_id).delete(synchronize_session=False)
    db.delete(company)
    db.commit()
    return True

# Internship list search, filter, pagination
def get_all_internships_admin(db: Session, search: str = None, is_active: bool = None, page: int = 1, limit: int = 10):
    query = db.query(Internship)
    if search:
        query = query.filter(
            or_(
                Internship.title.ilike(f"%{search}%"),
                Internship.location.ilike(f"%{search}%"),
                Internship.skills.ilike(f"%{search}%")
            )
        )
    if is_active is not None:
        query = query.filter(Internship.is_active == is_active)
        
    total = query.count()
    offset = (page - 1) * limit
    items = query.order_by(Internship.created_at.desc()).offset(offset).limit(limit).all()
    return items, total

# Internship status toggle
def update_internship_active_admin(db: Session, internship_id: int, is_active: bool):
    internship = db.query(Internship).filter(Internship.id == internship_id).first()
    if not internship:
        return None
    internship.is_active = is_active
    db.commit()
    db.refresh(internship)
    return internship

# Internship delete
def delete_internship_admin(db: Session, internship_id: int):
    internship = db.query(Internship).filter(Internship.id == internship_id).first()
    if not internship:
        return False
    db.delete(internship)
    db.commit()
    return True

# Applications management search and pagination
def get_all_applications_admin(db: Session, search: str = None, status: str = None, page: int = 1, limit: int = 10):
    query = db.query(Application)
    
    if search:
        query = query.join(Student).join(Internship).filter(
            or_(
                Student.first_name.ilike(f"%{search}%"),
                Student.last_name.ilike(f"%{search}%"),
                Student.email.ilike(f"%{search}%"),
                Internship.title.ilike(f"%{search}%")
            )
        )
    if status:
        query = query.filter(Application.status == status)
        
    total = query.count()
    offset = (page - 1) * limit
    items = query.order_by(Application.applied_at.desc()).offset(offset).limit(limit).all()
    return items, total
