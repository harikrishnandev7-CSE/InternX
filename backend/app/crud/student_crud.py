from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models import Student,Skill
from app.schemas import StudentCreate


def create_student(db: Session, student: StudentCreate):
    new_student = Student(
        first_name=student.first_name,
        last_name=student.last_name,
        email=student.email,
        phone=student.phone,
        password=student.password,
        department=student.department,
        year=student.year,
    )

    db.add(new_student)
    db.commit()
    db.refresh(new_student)

    return new_student

def get_student_by_email(db: Session, email: str):
    return db.query(Student).filter(Student.email == email).first()


def get_student_by_phone(db: Session, phone: str):
    return db.query(Student).filter(Student.phone == phone).first()

# Student details update panna use pannrom
def update_student(db: Session, db_student, student):

    # Name update pannrom
    db_student.first_name = student.first_name
    db_student.last_name = student.last_name

    # Phone update pannrom
    db_student.phone = student.phone

    # Department update pannrom
    db_student.department = student.department

    # Year update pannrom
    db_student.year = student.year

     # LinkedIn update pannrom
    db_student.linkedin = student.linkedin

    # GitHub update pannrom
    db_student.github = student.github

    # Portfolio update pannrom
    db_student.portfolio = student.portfolio

    # Database-la save pannrom
    db.commit()

    # Latest values reload pannrom
    db.refresh(db_student)

    # Updated student return pannrom
    return db_student

# Student password update panna use pannrom
def update_student_password(
    db: Session,
    student,
    hashed_password
):

    # New hashed password save pannrom
    student.password = hashed_password

    # Database save pannrom
    db.commit()

    # Latest value reload pannrom
    db.refresh(student)

    # Updated student return pannrom
    return student

# Student-ku new skill create panna use pannrom
def create_skill(
    db: Session,
    student_id: int,
    skill_name: str
):

    # New skill object create pannrom
    new_skill = Skill(
        student_id=student_id,
        skill_name=skill_name
    )

    # Database-la save pannrom
    db.add(new_skill)
    db.commit()
    db.refresh(new_skill)

    return new_skill

# Student skills fetch panna use pannrom
def get_student_skills(
    db: Session,
    student_id: int
):

    return (
        db.query(Skill)
        .filter(Skill.student_id == student_id)
        .all()
    )

# Student skill delete panna use pannrom
def delete_skill(
    db: Session,
    student_id: int,
    skill_id: int
):

    skill = (
        db.query(Skill)
        .filter(
            Skill.id == skill_id,
            Skill.student_id == student_id
        )
        .first()
    )

    if not skill:
        return None

    db.delete(skill)
    db.commit()

    return skill

# Student skill already exists-aa check panna use pannrom
def get_skill_by_name(
    db: Session,
    student_id: int,
    skill_name: str
):

    return (
        db.query(Skill)
        .filter(
            Skill.student_id == student_id,
            func.lower(Skill.skill_name) == skill_name.lower()
        )
        .first()
    )

# Save or update student resume metadata
def update_student_resume_info(db: Session, db_student, url: str, public_id: str, filename: str, file_size: int, upload_time):
    db_student.resume_url = url
    db_student.resume_public_id = public_id
    db_student.resume_filename = filename
    db_student.resume_file_size = file_size
    db_student.resume_uploaded_at = upload_time
    
    db.commit()
    db.refresh(db_student)
    return db_student

# Clear student resume metadata
def clear_student_resume_info(db: Session, db_student):
    db_student.resume_url = None
    db_student.resume_public_id = None
    db_student.resume_filename = None
    db_student.resume_file_size = None
    db_student.resume_uploaded_at = None
    
    db.commit()
    db.refresh(db_student)
    return db_student