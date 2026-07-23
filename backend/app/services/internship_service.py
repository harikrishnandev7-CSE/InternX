# Database session use pannrom
from sqlalchemy.orm import Session

# HTTP exception use pannrom
from fastapi import HTTPException

# Internship CRUD 
from app.crud.internship_crud import (
    create_internship,
    get_company_internships,
    get_all_internships,
    get_internship_by_id,
    update_internship,
    delete_internship,
    update_internship_status,
)

# Company status check helper function
def check_company_approved(company):
    if company.approval_status != "Approved":
        if company.approval_status == "Rejected":
            raise HTTPException(
                status_code=403,
                detail="Your company registration was rejected. You cannot perform this action."
            )
        else:
            raise HTTPException(
                status_code=403,
                detail="Your company registration is pending approval. You cannot perform this action."
            )

# Company internship post panna use pannrom
def create_internship_service(
    db: Session,
    internship,
    current_company
):
    check_company_approved(current_company)

    # Title empty-aa check pannrom
    if not internship.title.strip():
        raise HTTPException(
            status_code=400,
            detail="Title is required"
        )

    # Description empty-aa check pannrom
    if not internship.description.strip():
        raise HTTPException(
            status_code=400,
            detail="Description is required"
        )
    
    if not internship.skills.strip():
        raise HTTPException(
            status_code=400,
            detail="Skills are required"
    )

    if not internship.location.strip():
        raise HTTPException(
            status_code=400,
            detail="Location is required"
    )

    if not internship.duration.strip():
        raise HTTPException(
            status_code=400,
            detail="Duration is required"
    )

    if not internship.stipend.strip():
        raise HTTPException(
            status_code=400,
            detail="Stipend is required"
    )
    if not internship.type.strip():
        raise HTTPException(
            status_code=400,
            detail="Internship type is required"
    )

    if not internship.deadline.strip():
        raise HTTPException(
            status_code=400,
            detail="Application deadline is required"
    )

    # CRUD function call pannrom
    return create_internship(
        db,
        internship,
        current_company.id
    )

# Company internships fetch panna use pannrom
from app.crud.internship_crud import get_company_internships


def get_company_internships_service(
    db: Session,
    current_company
):

    # CRUD function call pannrom
    return get_company_internships(
        db,
        current_company.id
    )

# All internships fetch panna use pannrom
def get_all_internships_service(
    db: Session
):

    return get_all_internships(db)

# Internship id use pannitu single internship fetch pannrom
def get_internship_by_id_service(
    db: Session,
    internship_id: int
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

    return internship

def update_internship_service(
    db: Session,
    internship_id: int,
    internship_update,
    current_company
):
    check_company_approved(current_company)
    # Fetch internship
    db_internship = get_internship_by_id(db, internship_id)
    if not db_internship:
        raise HTTPException(
            status_code=404,
            detail="Internship not found"
        )
    
    # Ownership authorization check
    if db_internship.company_id != current_company.id:
        raise HTTPException(
            status_code=403,
            detail="You are not authorized to update this internship"
        )
    
    # Input validation
    if not internship_update.title.strip():
        raise HTTPException(status_code=400, detail="Title is required")
    if not internship_update.description.strip():
        raise HTTPException(status_code=400, detail="Description is required")
    if not internship_update.skills.strip():
        raise HTTPException(status_code=400, detail="Skills are required")
    if not internship_update.location.strip():
        raise HTTPException(status_code=400, detail="Location is required")
    if not internship_update.duration.strip():
        raise HTTPException(status_code=400, detail="Duration is required")
    if not internship_update.stipend.strip():
        raise HTTPException(status_code=400, detail="Stipend is required")
    if not internship_update.type.strip():
        raise HTTPException(status_code=400, detail="Internship type is required")
    if not internship_update.deadline.strip():
        raise HTTPException(status_code=400, detail="Application deadline is required")

    return update_internship(db, db_internship, internship_update)

def delete_internship_service(
    db: Session,
    internship_id: int,
    current_company
):
    check_company_approved(current_company)
    # Fetch internship
    db_internship = get_internship_by_id(db, internship_id)
    if not db_internship:
        raise HTTPException(
            status_code=404,
            detail="Internship not found"
        )
    
    # Ownership authorization check
    if db_internship.company_id != current_company.id:
        raise HTTPException(
            status_code=403,
            detail="You are not authorized to delete this internship"
        )
    
    delete_internship(db, db_internship)
    return {"message": "Internship deleted successfully"}

def update_internship_status_service(
    db: Session,
    internship_id: int,
    current_company
):
    check_company_approved(current_company)
    # Fetch internship
    db_internship = get_internship_by_id(db, internship_id)
    if not db_internship:
        raise HTTPException(
            status_code=404,
            detail="Internship not found"
        )
    
    # Ownership authorization check
    if db_internship.company_id != current_company.id:
        raise HTTPException(
            status_code=403,
            detail="You are not authorized to change the status of this internship"
        )
    
    # Toggle active status
    new_status = not db_internship.is_active
    return update_internship_status(db, db_internship, new_status)

