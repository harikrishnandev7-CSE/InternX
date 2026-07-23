# APIRouter use pannrom
from fastapi import APIRouter, Depends

# Database session use pannrom
from sqlalchemy.orm import Session

# Database dependency
from app.database import get_db

# Company schema import pannrom
from app.schemas import CompanyCreate

# Company service import pannrom
from app.services.company_service import register_company_service

# Company login schema import pannrom
from app.schemas import CompanyLogin

# Company login service import pannrom
from app.services.company_service import login_company_service

from app.schemas import CompanyResponse, CompanyDashboardStatsResponse
from app.utils.security import get_current_company
from app.services.company_service import get_company_profile_service, get_company_dashboard_stats_service


# Router create pannrom
router = APIRouter(
    prefix="/company",
    tags=["Company"]
)

# Company register API
@router.post("/register")
def register_company(
    company: CompanyCreate,
    db: Session = Depends(get_db)
):

    return register_company_service(db, company)

# Company login API
@router.post("/login")
def login_company(

    # Login data receive pannrom
    company: CompanyLogin,

    # Database session edukkrom
    db: Session = Depends(get_db)

):

    # Service call pannrom
    return login_company_service(
        db,
        company
    )

@router.get(
    "/profile",
    response_model=CompanyResponse
)
def get_company_profile(

    # Current login company edukkrom
    current_company = Depends(get_current_company)

):

    # Service layer call pannrom
    return get_company_profile_service(
        current_company
    )

# Company dashboard stats API
@router.get(
    "/dashboard/stats",
    response_model=CompanyDashboardStatsResponse
)
def get_company_dashboard_stats_api(
    db: Session = Depends(get_db),
    current_company = Depends(get_current_company)
):
    return get_company_dashboard_stats_service(db, current_company)