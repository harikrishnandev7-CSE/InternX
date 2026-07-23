from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas import (
    SendOTPRequest,
    VerifyOTPRequest,
    ResetPasswordRequest,
    ResendOTPRequest
)
from app.services.otp_service import (
    send_otp_service,
    verify_otp_service,
    reset_password_service
)

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/send-otp")
def send_otp(request: SendOTPRequest, db: Session = Depends(get_db)):
    return send_otp_service(db, request.email)

@router.post("/resend-otp")
def resend_otp(request: ResendOTPRequest, db: Session = Depends(get_db)):
    return send_otp_service(db, request.email)

@router.post("/verify-otp")
def verify_otp(request: VerifyOTPRequest, db: Session = Depends(get_db)):
    return verify_otp_service(db, request.email, request.otp)

@router.post("/reset-password")
def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    return reset_password_service(db, request.email, request.otp, request.new_password)
