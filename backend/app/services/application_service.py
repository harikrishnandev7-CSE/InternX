from sqlalchemy.orm import Session
from fastapi import HTTPException
from datetime import datetime

from app.crud.application_crud import (
    create_application,
    get_existing_application,
    get_student_applications,
    get_company_applications,
    get_application_by_id,
    update_application_status,
    get_company_stats
)

from app.crud.internship_crud import get_internship_by_id


# Student apply internship
def apply_internship_service(
    db: Session,
    internship_id: int,
    current_student
):

    internship = get_internship_by_id(
        db,
        internship_id
    )

    if not internship:
        raise HTTPException(
            status_code=404,
            detail="Internship not found"
        )

    # Prevent applying to inactive internships
    if not internship.is_active:
        raise HTTPException(
            status_code=400,
            detail="This internship is inactive and not accepting applications"
        )

    # Prevent applying after deadline
    if internship.deadline:
        try:
            deadline_date = datetime.strptime(internship.deadline.strip(), "%Y-%m-%d").date()
            current_date = datetime.utcnow().date()
            if current_date > deadline_date:
                raise HTTPException(
                    status_code=400,
                    detail="The application deadline for this internship has passed"
                )
        except ValueError:
            # If the format does not match, ignore and proceed
            pass

    existing = get_existing_application(
        db,
        current_student.id,
        internship_id
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="You have already applied for this internship"
        )

    new_app = create_application(
        db,
        current_student.id,
        internship_id
    )

    # Send application submitted email safely
    from app.services.email_service import EmailService
    EmailService.send_application_submitted(current_student.email, f"{current_student.first_name} {current_student.last_name}", internship.title)

    return new_app


# Current student applications fetch pannrom
def get_student_applications_service(
    db: Session,
    current_student
):

    return get_student_applications(
        db,
        current_student.id
    )

# Current company applicants fetch pannrom
def get_company_applications_service(
    db: Session,
    current_company
):

    return get_company_applications(
        db,
        current_company.id
    )

# Company status update for student application
def update_application_status_service(
    db: Session,
    application_id: int,
    status: str,
    current_company
):
    application = get_application_by_id(db, application_id)
    if not application:
        raise HTTPException(
            status_code=404,
            detail="Application not found"
        )

    # Allowed statuses validation
    allowed_statuses = ["Applied", "Under Review", "Shortlisted", "Rejected", "Selected"]
    if status not in allowed_statuses:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status. Must be one of {allowed_statuses}"
        )

    # Ensure only the internship owner can change application status
    if application.internship.company_id != current_company.id:
        raise HTTPException(
            status_code=403,
            detail="You are not authorized to update this application's status"
        )

    updated_app = update_application_status(db, application, status)

    # Send application status changed email safely
    from app.services.email_service import EmailService
    EmailService.send_application_status_changed(
        application.student.email,
        f"{application.student.first_name} {application.student.last_name}",
        application.internship.title,
        status
    )

    return updated_app

# Fetch company applications statistics
def get_company_stats_service(
    db: Session,
    current_company
):
    return get_company_stats(db, current_company.id)