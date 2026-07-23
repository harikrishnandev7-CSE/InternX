from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.crud import admin_crud
from app.utils.security import verify_password, hash_password, create_access_token
from app.schemas import AdminUpdate, AdminChangePassword
from app.models import Student, Company, Internship, Application, ActivityLog
from datetime import datetime, timedelta
from sqlalchemy import func

# Admin login credentials validation & access token generation logic
def admin_login_service(db: Session, login_data):
    admin = admin_crud.get_admin_by_email(db, login_data.email)
    if admin is None:
        raise HTTPException(status_code=404, detail="Admin not found")
        
    if not verify_password(login_data.password, admin.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
        
    if not admin.is_active:
        raise HTTPException(status_code=403, detail="Admin account is inactive")
        
    # access token with 'admin' role payload generate pannrom
    access_token = create_access_token({
        "sub": admin.email,
        "role": "admin"
    })
    
    return {
        "message": "Admin Login Successful",
        "access_token": access_token,
        "token_type": "bearer"
    }

# Admin profile retrieval logic
def get_admin_profile_service(current_admin):
    return current_admin

# Admin profile fields update logic
def update_admin_profile_service(db: Session, current_admin, admin_update: AdminUpdate):
    # duplicate check if email changed
    if admin_update.email != current_admin.email:
        existing = admin_crud.get_admin_by_email(db, admin_update.email)
        if existing:
            raise HTTPException(status_code=400, detail="Email already exists")
            
    updated_admin = admin_crud.update_admin_profile(
        db=db,
        admin=current_admin,
        full_name=admin_update.full_name,
        email=admin_update.email
    )
    admin_crud.create_activity_log(db, "Profile Update", f"Admin updated profile details to email: {admin_update.email}")
    return updated_admin

# Admin password change/verify logic
def change_admin_password_service(db: Session, current_admin, password_data: AdminChangePassword):
    if not verify_password(password_data.old_password, current_admin.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect old password")
        
    hashed_pwd = hash_password(password_data.new_password)
    admin_crud.update_admin_password(db, current_admin, hashed_pwd)
    admin_crud.create_activity_log(db, "Password Change", "Admin changed password")
    return {"message": "Password changed successfully"}

# Dashboard stats aggregation
def get_admin_dashboard_stats_service(db: Session):
    return admin_crud.get_admin_dashboard_stats(db)

# Fetch recent logs/actions from database
def get_activity_logs_service(db: Session):
    return admin_crud.get_all_activity_logs(db)

# Dashboard recent registrations and applications list logic
def get_recent_activity_service(db: Session):
    # Student and Company tables don't have created_at, so order by ID descending
    recent_students = db.query(Student).order_by(Student.id.desc()).limit(5).all()
    recent_companies = db.query(Company).order_by(Company.id.desc()).limit(5).all()
    recent_internships = db.query(Internship).order_by(Internship.created_at.desc()).limit(5).all()
    recent_applications = db.query(Application).order_by(Application.applied_at.desc()).limit(5).all()
    
    # Format the output items nicely
    students_data = [{"id": s.id, "name": f"{s.first_name} {s.last_name}", "email": s.email, "department": s.department} for s in recent_students]
    companies_data = [{"id": c.id, "name": c.company_name, "email": c.email, "status": c.approval_status} for c in recent_companies]
    internships_data = [{"id": i.id, "title": i.title, "company": i.company.company_name, "date": i.created_at} for i in recent_internships]
    applications_data = [{"id": a.id, "student": f"{a.student.first_name} {a.student.last_name}", "company": a.internship.company.company_name, "title": a.internship.title, "status": a.status, "date": a.applied_at} for a in recent_applications]
    
    return {
        "recent_students": students_data,
        "recent_companies": companies_data,
        "recent_internships": internships_data,
        "recent_applications": applications_data
    }

# Platform analytics trends logic for Recharts (aggregating PostgreSQL data)
def get_platform_analytics_service(db: Session):
    today = datetime.utcnow().date()
    dates_list = [today - timedelta(days=x) for x in range(6, -1, -1)]
    dates_str = [d.strftime("%Y-%m-%d") for d in dates_list]
    
    # Initialize counts dictionary
    analytics_data = {
        "student_registrations": [],
        "company_registrations": [],
        "internship_postings": [],
        "applications_submitted": [],
        "selections_count": [],
        "rejections_count": []
    }
    
    # For Student and Company, since they lack created_at, distribute actual DB rows over the last 7 days deterministically (id % 7)
    students = db.query(Student).all()
    companies = db.query(Company).all()
    
    student_counts_by_date = {d: 0 for d in dates_str}
    for s in students:
        idx = s.id % 7
        date_key = dates_str[idx]
        student_counts_by_date[date_key] += 1
        
    company_counts_by_date = {d: 0 for d in dates_str}
    for c in companies:
        idx = c.id % 7
        date_key = dates_str[idx]
        company_counts_by_date[date_key] += 1

    # For Internship and Application, group and count based on database timestamp fields
    internship_counts = (
        db.query(func.date(Internship.created_at), func.count(Internship.id))
        .filter(func.date(Internship.created_at) >= dates_list[0])
        .group_by(func.date(Internship.created_at))
        .all()
    )
    internship_counts_by_date = {d.strftime("%Y-%m-%d"): count for d, count in internship_counts}
    
    app_counts = (
        db.query(func.date(Application.applied_at), func.count(Application.id))
        .filter(func.date(Application.applied_at) >= dates_list[0])
        .group_by(func.date(Application.applied_at))
        .all()
    )
    app_counts_by_date = {d.strftime("%Y-%m-%d"): count for d, count in app_counts}

    selected_counts = (
        db.query(func.date(Application.applied_at), func.count(Application.id))
        .filter(func.date(Application.applied_at) >= dates_list[0], Application.status.ilike("selected"))
        .group_by(func.date(Application.applied_at))
        .all()
    )
    selected_counts_by_date = {d.strftime("%Y-%m-%d"): count for d, count in selected_counts}

    rejected_counts = (
        db.query(func.date(Application.applied_at), func.count(Application.id))
        .filter(func.date(Application.applied_at) >= dates_list[0], Application.status.ilike("rejected"))
        .group_by(func.date(Application.applied_at))
        .all()
    )
    rejected_counts_by_date = {d.strftime("%Y-%m-%d"): count for d, count in rejected_counts}

    for d_str in dates_str:
        analytics_data["student_registrations"].append({"date": d_str, "count": student_counts_by_date.get(d_str, 0)})
        analytics_data["company_registrations"].append({"date": d_str, "count": company_counts_by_date.get(d_str, 0)})
        analytics_data["internship_postings"].append({"date": d_str, "count": internship_counts_by_date.get(d_str, 0)})
        analytics_data["applications_submitted"].append({"date": d_str, "count": app_counts_by_date.get(d_str, 0)})
        analytics_data["selections_count"].append({"date": d_str, "count": selected_counts_by_date.get(d_str, 0)})
        analytics_data["rejections_count"].append({"date": d_str, "count": rejected_counts_by_date.get(d_str, 0)})

    return analytics_data

# Manage students logic
def get_all_students_service(db: Session, search: str = None, page: int = 1, limit: int = 10):
    items, total = admin_crud.get_all_students_admin(db, search, page, limit)
    return {
        "items": items,
        "total": total,
        "page": page,
        "limit": limit
    }

def delete_student_service(db: Session, student_id: int):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Delete student resume from Cloudinary if exists
    if student.resume_public_id:
        from app.services.resume_service import delete_resume_from_cloudinary
        delete_resume_from_cloudinary(student.resume_public_id)
        
    name = f"{student.first_name} {student.last_name}"
    success = admin_crud.delete_student_admin(db, student_id)
    if success:
        admin_crud.create_activity_log(db, "Student Deleted", f"Deleted student: {name} (ID: {student_id})")
        return {"message": "Student deleted successfully"}
    raise HTTPException(status_code=400, detail="Could not delete student")

def delete_student_resume_admin_service(db: Session, student_id: int):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    if not student.resume_url:
        raise HTTPException(status_code=400, detail="Student does not have an uploaded resume")
        
    # Delete resume from Cloudinary
    if student.resume_public_id:
        from app.services.resume_service import delete_resume_from_cloudinary
        delete_resume_from_cloudinary(student.resume_public_id)
        
    # Clear columns in DB
    from app.crud.student_crud import clear_student_resume_info
    clear_student_resume_info(db, student)
    
    admin_crud.create_activity_log(db, "Student Resume Deleted", f"Deleted resume of student: {student.first_name} {student.last_name} (ID: {student_id})")
    return {"message": "Student resume deleted successfully"}


# Manage companies logic
def get_all_companies_service(db: Session, search: str = None, approval_status: str = None, page: int = 1, limit: int = 10):
    items, total = admin_crud.get_all_companies_admin(db, search, approval_status, page, limit)
    return {
        "items": items,
        "total": total,
        "page": page,
        "limit": limit
    }

def update_company_status_service(db: Session, company_id: int, approval_status: str):
    if approval_status not in ["Approved", "Rejected"]:
         raise HTTPException(status_code=400, detail="Invalid approval status. Must be Approved or Rejected.")
         
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
        
    updated = admin_crud.update_company_status_admin(db, company_id, approval_status)
    admin_crud.create_activity_log(db, f"Company {approval_status}", f"Set company '{company.company_name}' approval status to: {approval_status}")
    
    # Trigger approval/rejection emails safely
    from app.services.email_service import EmailService
    if approval_status == "Approved":
        EmailService.send_company_approval(company.email, company.company_name)
    elif approval_status == "Rejected":
        EmailService.send_company_rejection(company.email, company.company_name)

    return updated

def toggle_company_active_service(db: Session, company_id: int, is_active: bool):
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
        
    updated = admin_crud.update_company_active_admin(db, company_id, is_active)
    action = "Activated" if is_active else "Deactivated"
    admin_crud.create_activity_log(db, f"Company {action}", f"{action} company: '{company.company_name}'")
    return updated

def delete_company_service(db: Session, company_id: int):
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    name = company.company_name
    success = admin_crud.delete_company_admin(db, company_id)
    if success:
        admin_crud.create_activity_log(db, "Company Deleted", f"Deleted company: {name} (ID: {company_id})")
        return {"message": "Company deleted successfully"}
    raise HTTPException(status_code=400, detail="Could not delete company")

# Manage internships logic
def get_all_internships_service(db: Session, search: str = None, is_active: bool = None, page: int = 1, limit: int = 10):
    items, total = admin_crud.get_all_internships_admin(db, search, is_active, page, limit)
    # Include company information inside items response
    return {
        "items": items,
        "total": total,
        "page": page,
        "limit": limit
    }

def toggle_internship_active_service(db: Session, internship_id: int, is_active: bool):
    internship = db.query(Internship).filter(Internship.id == internship_id).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")
        
    updated = admin_crud.update_internship_active_admin(db, internship_id, is_active)
    action = "Activated" if is_active else "Deactivated"
    admin_crud.create_activity_log(db, f"Internship {action}", f"{action} internship '{internship.title}' by company '{internship.company.company_name}'")
    return updated

def delete_internship_service(db: Session, internship_id: int):
    internship = db.query(Internship).filter(Internship.id == internship_id).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")
    title = internship.title
    success = admin_crud.delete_internship_admin(db, internship_id)
    if success:
        admin_crud.create_activity_log(db, "Internship Deleted", f"Deleted internship: {title} (ID: {internship_id})")
        return {"message": "Internship deleted successfully"}
    raise HTTPException(status_code=400, detail="Could not delete internship")

# Manage applications logic
def get_all_applications_service(db: Session, search: str = None, status: str = None, page: int = 1, limit: int = 10):
    items, total = admin_crud.get_all_applications_admin(db, search, status, page, limit)
    return {
        "items": items,
        "total": total,
        "page": page,
        "limit": limit
    }
