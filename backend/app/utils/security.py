# pyrefly: ignore [missing-import]
from passlib.context import CryptContext
from typing import Any
from jose import jwt 
#jwt token create pana use panrom 
from datetime import datetime,timedelta 
#token expiry calculate pana use pana porom
from app.config import SECRET_KEY,ALGORITHM,ACCESS_TOKEN_EXPIRE_MINUTES
# jwt configure pana config.py ah import panrom

#-------------------------------------
# JWT exception handle panna use pannrom
from jose import JWTError

# OAuth2 authentication use pannrom
from fastapi.security import OAuth2PasswordBearer

# FastAPI dependencies and exceptions
from fastapi import Depends, HTTPException

# Database session use pannrom
from sqlalchemy.orm import Session

# Database connection import pannrom
from app.database import get_db

# Student CRUD function import pannrom
from app.crud.student_crud import get_student_by_email

# Company CRUD function import pannrom
from app.crud.company_crud import get_company_by_email



pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: Any):
    return pwd_context.verify(plain_password, hashed_password)

# Login success aana JWT Token generate pannum
def create_access_token(data: dict):

    # User data copy pannrom
    to_encode = data.copy()

    # Token expiry time set pannrom
    expire = datetime.utcnow() + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    # Expiry time token-la add pannrom
    to_encode.update({"exp": expire})

    # JWT Token generate pannrom
    encoded_jwt = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    # Generated token return pannrom
    return encoded_jwt

# Authorization header-la irundhu JWT token edukkum object
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/student/login"
)


#jwt token use panni current student pannrom
def get_current_student(

    # Swagger/Header-la irundhu token edukkrom
    token: str = Depends(oauth2_scheme),

    # Database session edukkrom
    db: Session = Depends(get_db)

):
    

    # Token invalid-na common exception
    credentials_exception = HTTPException(
        status_code=401,
        detail="Invalid Token"
    )

    try:

        # JWT token decode pannrom
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )
        print("payload = ",payload)
        email = payload.get("sub")
        print("email = ",email)

        # Token-la save pannirundha email edukkrom
        email = payload.get("sub")

        # Email illa-na token invalid
        if email is None:
            raise credentials_exception

    # JWT decode error handle pannrom
    except JWTError:
        raise credentials_exception

    # Database-la student iruka check pannrom
    student = get_student_by_email(db, email)
    print("student =",student)
    # Student illa-na invalid token
    if student is None:
        raise credentials_exception

    # Current login student return pannrom
    return student

# JWT token use panni current company edukkrom
def get_current_company(

    # Swagger/Header-la irundhu token edukkrom
    token: str = Depends(oauth2_scheme),

    # Database session edukkrom
    db: Session = Depends(get_db)

):

    # Token invalid-na common exception
    credentials_exception = HTTPException(
        status_code=401,
        detail="Invalid Token"
    )

    try:

        # JWT token decode pannrom
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        # Token-la save pannirundha email edukkrom
        email = payload.get("sub")

        # Email illa-na token invalid
        if email is None:
            raise credentials_exception

    # JWT decode error handle pannrom
    except JWTError:
        raise credentials_exception

    # Database-la company iruka check pannrom
    company = get_company_by_email(db, email)

    # Company illa-na invalid token
    if company is None:
        raise credentials_exception

    # Current login company return pannrom
    return company


# JWT token use panni current admin edukkrom
def get_current_admin(

    # Header-la irundhu token edukkrom
    token: str = Depends(oauth2_scheme),

    # Database session edukkrom
    db: Session = Depends(get_db)

):

    # Token invalid-na common exception
    credentials_exception = HTTPException(
        status_code=401,
        detail="Invalid Token"
    )

    try:

        # JWT token decode pannrom
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        # Token-la save pannirundha email and role edukkrom
        email = payload.get("sub")
        role = payload.get("role")

        # Email and role check pannrom
        if email is None or role != "admin":
            raise credentials_exception

    # JWT decode error handle pannrom
    except JWTError:
        raise credentials_exception

    # Database-la admin iruka check pannrom
    from app.models import Admin
    admin = db.query(Admin).filter(Admin.email == email).first()

    # Admin profile check pannrom
    if admin is None:
        raise credentials_exception

    if not admin.is_active:
        raise HTTPException(
            status_code=403,
            detail="Admin account is inactive"
        )

    # Current login admin return pannrom
    return admin
