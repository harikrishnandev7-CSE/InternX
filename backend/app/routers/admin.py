from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from app.database import get_db
from app.utils.security import get_current_admin
from app.schemas import (
    AdminLogin, 
    AdminResponse, 
    AdminUpdate, 
    AdminChangePassword,
    AdminDashboardStatsResponse,
    ActivityLogResponse,
    CompanyResponse,
    InternshipResponse,
    AdminAnalyticsResponse
)
from app.services.admin_service import (
    admin_login_service,
    get_admin_profile_service,
    update_admin_profile_service,
    change_admin_password_service,
    get_admin_dashboard_stats_service,
    get_activity_logs_service,
    get_recent_activity_service,
    get_platform_analytics_service,
    get_all_students_service,
    delete_student_service,
    delete_student_resume_admin_service,
    get_all_companies_service,
    update_company_status_service,
    toggle_company_active_service,
    delete_company_service,
    get_all_internships_service,
    toggle_internship_active_service,
    delete_internship_service,
    get_all_applications_service
)

router = APIRouter(prefix="/admin", tags=["Admin"])

# Admin login API
@router.post("/login")
def login_admin(login_data: AdminLogin, db: Session = Depends(get_db)):
    return admin_login_service(db, login_data)

# Current Admin Profile API
@router.get("/profile", response_model=AdminResponse)
def get_admin_profile(current_admin = Depends(get_current_admin)):
    return get_admin_profile_service(current_admin)

# Admin profile details update API
@router.put("/profile", response_model=AdminResponse)
def update_admin_profile_api(
    admin_update: AdminUpdate,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    return update_admin_profile_service(db, current_admin, admin_update)

# Admin Password Change API
@router.put("/change-password")
def change_admin_password(
    password_data: AdminChangePassword,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    return change_admin_password_service(db, current_admin, password_data)

# Admin Dashboard statistics counts API
@router.get("/dashboard/stats", response_model=AdminDashboardStatsResponse)
def get_admin_dashboard_stats_api(
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    return get_admin_dashboard_stats_service(db)

# Admin Dashboard recent activity list API
@router.get("/dashboard/recent-activity")
def get_admin_recent_activity_api(
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    return get_recent_activity_service(db)

# Admin Activity Logs API
@router.get("/activity-logs", response_model=List[ActivityLogResponse])
def get_admin_activity_logs_api(
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    return get_activity_logs_service(db)

# Admin Analytics chart values API
@router.get("/analytics", response_model=AdminAnalyticsResponse)
def get_admin_analytics_api(
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    return get_platform_analytics_service(db)

# Student management list query API
@router.get("/students")
def get_all_students_api(
    search: str = Query(None, description="Search by name, email or department"),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    return get_all_students_service(db, search, page, limit)

# Student delete API
@router.delete("/students/{student_id}")
def delete_student_api(
    student_id: int,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    return delete_student_service(db, student_id)

# Company management list query API
@router.get("/companies")
def get_all_companies_api(
    search: str = Query(None, description="Search by company name, email or location"),
    approval_status: str = Query(None, description="Filter by Pending, Approved or Rejected"),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    return get_all_companies_service(db, search, approval_status, page, limit)

# Company status approval/rejection API
@router.put("/companies/{company_id}/status", response_model=CompanyResponse)
def update_company_status_api(
    company_id: int,
    status: str = Query(..., description="Approved or Rejected"),
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    return update_company_status_service(db, company_id, status)

# Company activate/deactivate API
@router.put("/companies/{company_id}/active", response_model=CompanyResponse)
def toggle_company_active_api(
    company_id: int,
    is_active: bool = Query(..., description="True to activate, False to deactivate"),
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    return toggle_company_active_service(db, company_id, is_active)

# Company delete API
@router.delete("/companies/{company_id}")
def delete_company_api(
    company_id: int,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    return delete_company_service(db, company_id)

# Internship management list query API
@router.get("/internships")
def get_all_internships_api(
    search: str = Query(None, description="Search by title, location or skills"),
    is_active: bool = Query(None, description="Filter by active/inactive status"),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    return get_all_internships_service(db, search, is_active, page, limit)

# Internship activate/deactivate API
@router.put("/internships/{internship_id}/active", response_model=InternshipResponse)
def toggle_internship_active_api(
    internship_id: int,
    is_active: bool = Query(..., description="True to activate, False to deactivate"),
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    return toggle_internship_active_service(db, internship_id, is_active)

# Internship delete API
@router.delete("/internships/{internship_id}")
def delete_internship_api(
    internship_id: int,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    return delete_internship_service(db, internship_id)

# Application list query API
@router.get("/applications")
def get_all_applications_api(
    search: str = Query(None, description="Search by student name, email, or internship title"),
    status: str = Query(None, description="Filter by status (Applied, Under Review, Shortlisted, Selected, Rejected)"),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    return get_all_applications_service(db, search, status, page, limit)

# Student resume delete API for admin
@router.delete("/students/{student_id}/resume")
def delete_student_resume_admin_api(
    student_id: int,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    return delete_student_resume_admin_service(db, student_id)

