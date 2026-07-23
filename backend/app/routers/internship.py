# APIRouter use pannrom
from fastapi import APIRouter, Depends

# Database session use pannrom
from sqlalchemy.orm import Session

# Database dependency
from app.database import get_db

# Internship schemas import pannrom
from app.schemas import InternshipCreate, InternshipResponse, InternshipUpdate

# Internship service import pannrom
from app.services.internship_service import (
    create_internship_service,
    get_company_internships_service,
    get_all_internships_service,
    get_internship_by_id_service,
    update_internship_service,
    delete_internship_service,
    update_internship_status_service,
)

# Current company dependency
from app.utils.security import get_current_company

# Router create pannrom
router = APIRouter(
    prefix="/internship",
    tags=["Internship"]
)

# Company internship post pannrom
@router.post(
    "/create",
    response_model=InternshipResponse
)
def create_internship_api(

    # Internship details receive pannrom
    internship: InternshipCreate,

    # Database session
    db: Session = Depends(get_db),

    # Current login company
    current_company = Depends(get_current_company)

):

    return create_internship_service(
        db,
        internship,
        current_company
    )

# Current company internships fetch pannrom
@router.get(
    "/company",
    response_model=list[InternshipResponse]
)
def get_my_internships(

    # Database session
    db: Session = Depends(get_db),

    # Current login company
    current_company = Depends(get_current_company)

):

    # Service layer call pannrom
    return get_company_internships_service(
        db,
        current_company
    )

# All internships fetch pannrom
@router.get(
    "/all",
    response_model=list[InternshipResponse]
)
def get_all_internships_api(

    # Database session
    db: Session = Depends(get_db)

):

    return get_all_internships_service(db)
# Single internship fetch pannrom
@router.get(
    "/{internship_id}",
    response_model=InternshipResponse
)
def get_internship_api(

    internship_id: int,

    db: Session = Depends(get_db)

):

    return get_internship_by_id_service(
        db,
        internship_id
    )

# Internship update pannrom
@router.put(
    "/{internship_id}",
    response_model=InternshipResponse
)
def update_internship_api(
    internship_id: int,
    internship: InternshipUpdate,
    db: Session = Depends(get_db),
    current_company = Depends(get_current_company)
):
    return update_internship_service(
        db=db,
        internship_id=internship_id,
        internship_update=internship,
        current_company=current_company
    )

# Internship delete pannrom
@router.delete(
    "/{internship_id}"
)
def delete_internship_api(
    internship_id: int,
    db: Session = Depends(get_db),
    current_company = Depends(get_current_company)
):
    return delete_internship_service(
        db=db,
        internship_id=internship_id,
        current_company=current_company
    )

# Internship status toggle/update pannrom
@router.patch(
    "/{internship_id}/status",
    response_model=InternshipResponse
)
def update_internship_status_api(
    internship_id: int,
    db: Session = Depends(get_db),
    current_company = Depends(get_current_company)
):
    return update_internship_status_service(
        db=db,
        internship_id=internship_id,
        current_company=current_company
    )