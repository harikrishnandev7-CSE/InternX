from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas import (
    ApplicationCreate,
    ApplicationResponse,
    StudentApplicationResponse,
    CompanyApplicationResponse,
    ApplicationStatusUpdate,
    CompanyStatsResponse
)

from app.services.application_service import (
    apply_internship_service,
    get_student_applications_service,
    get_company_applications_service,
    update_application_status_service,
    get_company_stats_service
)

from app.utils.security import (get_current_student,get_current_company)

router = APIRouter(
    prefix="/application",
    tags=["Application"]
)
# Student apply internship
@router.post(
    "/apply",
    response_model=ApplicationResponse
)
def apply_internship(

    application: ApplicationCreate,

    db: Session = Depends(get_db),

    current_student = Depends(get_current_student)

):

    return apply_internship_service(

        db,

        application.internship_id,

        current_student

    )

# Current student applications fetch pannrom
@router.get(
    "/student",
    response_model=list[StudentApplicationResponse]
)
def get_student_applications(

    db: Session = Depends(get_db),

    current_student = Depends(get_current_student)

):

    return get_student_applications_service(
        db,
        current_student
    )

# Current company applicants fetch pannrom
@router.get(
    "/company",
    response_model=list[CompanyApplicationResponse]
)
def get_company_applications(

    db: Session = Depends(get_db),

    current_company = Depends(get_current_company)

):

    return get_company_applications_service(
        db,
        current_company
    )

# Update application status API
@router.patch(
    "/{application_id}/status",
    response_model=ApplicationResponse
)
def update_application_status_api(
    application_id: int,
    status_update: ApplicationStatusUpdate,
    db: Session = Depends(get_db),
    current_company = Depends(get_current_company)
):
    return update_application_status_service(
        db,
        application_id,
        status_update.status,
        current_company
    )

# Fetch company applications stats API
@router.get(
    "/company/stats",
    response_model=CompanyStatsResponse
)
def get_company_stats_api(
    db: Session = Depends(get_db),
    current_company = Depends(get_current_company)
):
    return get_company_stats_service(
        db,
        current_company
    )