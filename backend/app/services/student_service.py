from sqlalchemy.orm import Session
from app.schemas import StudentCreate
from app.crud.student_crud import (
    create_student,
    get_student_by_email,
    get_student_by_phone,
    update_student_password,
    create_skill,
    get_student_skills,
    delete_skill,
    get_skill_by_name
)
from fastapi import HTTPException
from app.utils.security import verify_password,hash_password,create_access_token
# Student update CRUD function import pannrom
from app.crud.student_crud import update_student


def register_student_service(db: Session, student: StudentCreate):

    if len(student.phone)!=10:
        raise HTTPException(
            status_code=400,
            detail="phone number must contain 10 digits"
        )
    if not student.phone.isdigit():
        raise HTTPException(
            status_code=400,
            detail="Phone number must contain only digits"
        )
    if len(student.password) < 8:
        raise HTTPException(
            status_code=400,
            detail="Password must contain at least 8 characters"
        )
    if get_student_by_email(db, student.email):
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
    )

    if get_student_by_phone(db, student.phone):
        raise HTTPException(
            status_code=400,
            detail="Phone number already registered"
    )
    
    student.password = hash_password(student.password)
    new_student = create_student(db, student)
    
    # Send welcome email (safely, won't block the API response)
    from app.services.email_service import EmailService
    EmailService.send_student_welcome(new_student.email, f"{new_student.first_name} {new_student.last_name}")
    
    return new_student


#login schema use panurom 
def login_student_service(db: Session, student):
    
    db_student = get_student_by_email(db, student.email)

    if not db_student:
        raise HTTPException(
            status_code=401,
            detail="Invalid Email"
        )

    if not verify_password(student.password, db_student.password):
        raise HTTPException(
            status_code=401,
            detail="Invalid Password"
        )
    access_token = create_access_token(
        {
            "sub":db_student.email
        }
    )

    return {
        "message": "Login Successful",
        "access_token":access_token,
        "token_type":"bearer"
    }


# Student profile update panna use pannrom
def update_student_service(
    db: Session,
    current_student,
    student
):

    # Phone length check pannrom
    if len(student.phone) != 10:
        raise HTTPException(
            status_code=400,
            detail="Phone number must contain exactly 10 digits"
        )

    # Phone digits mattum irukkanum
    if not student.phone.isdigit():
        raise HTTPException(
            status_code=400,
            detail="Phone number must contain only digits"
        )
    # LinkedIn URL validation
    if student.linkedin and not student.linkedin.startswith("https://"):
        raise HTTPException(
            status_code=400,
            detail="LinkedIn URL must start with https://"
    )

    # GitHub URL validation
    if student.github and not student.github.startswith("https://"):
        raise HTTPException(
            status_code=400,
            detail="GitHub URL must start with https://"
    )

    # Portfolio URL validation
    if student.portfolio and not student.portfolio.startswith("https://"):
        raise HTTPException(
            status_code=400,
            detail="Portfolio URL must start with https://"
    )
    # Same phone vera student use pannaraangala check pannrom
    db_student = get_student_by_phone(db, student.phone)

    if db_student and db_student.id != current_student.id:
        raise HTTPException(
            status_code=400,
            detail="Phone number already exists"
        )

    # CRUD function call pannrom
    return update_student(
        db,
        current_student,
        student
    )

# Student password change panna use pannrom
def change_password_service(
    db: Session,
    current_student,
    password_data
):

    # Old password correct-aa check pannrom
    if not verify_password(
        password_data.old_password,
        current_student.password
    ):
        raise HTTPException(
            status_code=400,
            detail="Old password is incorrect"
        )

    # New password minimum 8 characters check pannrom
    if len(password_data.new_password) < 8:
        raise HTTPException(
            status_code=400,
            detail="New password must be at least 8 characters"
        )

    # Old password and new password same-aa irukka check pannrom
    if verify_password(
        password_data.new_password,
        current_student.password
    ):
        raise HTTPException(
            status_code=400,
            detail="New password must be different from old password"
        )

    # New password hash pannrom
    hashed_password = hash_password(
        password_data.new_password
    )

    # CRUD function call pannrom
    update_student_password(
        db,
        current_student,
        hashed_password
    )

    # Send password changed confirmation email
    from app.services.email_service import EmailService
    EmailService.send_password_changed(current_student.email, f"{current_student.first_name} {current_student.last_name}")

    # Success message return pannrom
    return {
        "message": "Password changed successfully"
    }

def add_skill_service(
    db: Session,
    current_student,
    skill
):

    skill_name = skill.skill_name.strip().title()

    if not skill_name:
        raise HTTPException(
            status_code=400,
            detail="Skill cannot be empty"
        )

    existing_skill = get_skill_by_name(
        db,
        current_student.id,
        skill_name
    )

    if existing_skill:
        raise HTTPException(
            status_code=400,
            detail="Skill already exists"
        )

    return create_skill(
        db,
        current_student.id,
        skill_name
    )

def get_student_skills_service(
    db: Session,
    current_student
):

    return get_student_skills(
        db,
        current_student.id
    )

def delete_skill_service(
    db: Session,
    current_student,
    skill_id: int
):

    skill = delete_skill(
        db,
        current_student.id,
        skill_id
    )

    if not skill:
        raise HTTPException(
            status_code=404,
            detail="Skill not found"
        )

    return {
        "message": "Skill deleted successfully"
    }