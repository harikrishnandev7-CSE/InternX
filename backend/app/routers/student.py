from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas import StudentCreate,StudentLogin,ChangePassword
from app.services.student_service import (
    register_student_service,
    login_student_service,
    update_student_service,
    change_password_service,
    add_skill_service,
    get_student_skills_service,
    delete_skill_service
)
from app.utils.security import get_current_student
# Student response schema import pannrom
from app.schemas import (
    StudentResponse,
    StudentUpdate,
    SkillCreate,
    SkillResponse
)
router = APIRouter(prefix="/student", tags=["Student"])


@router.post("/register")
def register(student: StudentCreate, db: Session = Depends(get_db)):
    return register_student_service(db, student)

@router.post("/login")
def login(student: StudentLogin,db:Session = Depends(get_db)):
    return login_student_service(db, student)

# Login student profile return pannrom
@router.get(
    "/profile",
    response_model=StudentResponse
)
def get_profile(

    # Current login student automatic-a varum
    current_student = Depends(get_current_student)

):

    # Password field response-la varaadhu
    return current_student


# Login student profile update pannrom
@router.put(
    "/profile",
    response_model=StudentResponse
)
def update_profile(

    # Frontend-la irundhu update data receive pannrom
    student: StudentUpdate,

    # Database session edukkrom
    db: Session = Depends(get_db),

    # Current login student edukkrom
    current_student = Depends(get_current_student)

):

    # Service layer call pannrom
    return update_student_service(
        db,
        current_student,
        student
    )


# Login student password change pannrom
@router.put("/change-password")
def change_password(

    # Frontend-la irundhu old & new password receive pannrom
    password_data: ChangePassword,

    # Database session edukkrom
    db: Session = Depends(get_db),

    # Current login student edukkrom
    current_student = Depends(get_current_student)

):

    # Service layer call pannrom
    return change_password_service(
        db,
        current_student,
        password_data
    )

# Login student-ku new skill add pannrom
@router.post(
    "/skills",
    response_model=SkillResponse
)
def add_skill(

    # Frontend-la irundhu skill receive pannrom
    skill: SkillCreate,

    # Database session
    db: Session = Depends(get_db),

    # Current login student
    current_student = Depends(get_current_student)

):

    return add_skill_service(
        db,
        current_student,
        skill
    )
# Login student skills fetch pannrom
@router.get(
    "/skills",
    response_model=list[SkillResponse]
)
def get_skills(

    db: Session = Depends(get_db),

    current_student = Depends(get_current_student)

):

    return get_student_skills_service(
        db,
        current_student
    )


# Login student skill delete pannrom
@router.delete("/skills/{skill_id}")
def remove_skill(

    skill_id: int,

    db: Session = Depends(get_db),

    current_student = Depends(get_current_student)

):

    return delete_skill_service(
        db,
        current_student,
        skill_id
    )

# Resume endpoints
from app.services.resume_service import upload_resume_service, delete_resume_service

@router.post("/upload-resume")
def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_student = Depends(get_current_student)
):
    return upload_resume_service(db, current_student, file)

@router.delete("/resume")
def delete_resume(
    db: Session = Depends(get_db),
    current_student = Depends(get_current_student)
):
    return delete_resume_service(db, current_student)

@router.get("/resume")
def get_resume(
    current_student = Depends(get_current_student)
):
    return {
        "resume_url": current_student.resume_url,
        "resume_filename": current_student.resume_filename,
        "resume_file_size": current_student.resume_file_size,
        "resume_uploaded_at": current_student.resume_uploaded_at
    }