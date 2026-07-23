from sqlalchemy.orm import Session

from app.models import (Application,Internship,Company,Student)

# Student apply internship
def create_application(
    db: Session,
    student_id: int,
    internship_id: int
):

    application = Application(

        student_id=student_id,

        internship_id=internship_id

    )

    db.add(application)

    db.commit()

    db.refresh(application)

    return application

# Check whether student already applied
def get_existing_application(
    db: Session,
    student_id: int,
    internship_id: int
):

    return (

        db.query(Application)

        .filter(

            Application.student_id == student_id,

            Application.internship_id == internship_id

        )

        .first()

    )

# Current student applications fetch pannrom
def get_student_applications(
    db: Session,
    student_id: int
):

    return (

        db.query(

            Application.id,

            Application.internship_id,

            Application.status,

            Application.applied_at,

            Internship.title.label("internship_title"),

            Company.company_name.label("company_name")

        )

        .join(
            Internship,
            Internship.id == Application.internship_id
        )

        .join(
            Company,
            Company.id == Internship.company_id
        )

        .filter(
            Application.student_id == student_id
        )

        .all()

    )

# Current company applicants fetch pannrom
def get_company_applications(
    db: Session,
    company_id: int
):
    applications = (
        db.query(Application)
        .join(Internship, Internship.id == Application.internship_id)
        .join(Student, Student.id == Application.student_id)
        .filter(Internship.company_id == company_id)
        .all()
    )

    result = []
    for app in applications:
        skill_names = [s.skill_name for s in app.student.skills]
        result.append({
            "id": app.id,
            "student_id": app.student_id,
            "student_name": f"{app.student.first_name} {app.student.last_name}",
            "student_email": app.student.email,
            "student_phone": app.student.phone,
            "department": app.student.department,
            "year": app.student.year,
            "skills": skill_names,
            "linkedin": app.student.linkedin,
            "github": app.student.github,
            "portfolio": app.student.portfolio,
            "resume_url": app.student.resume_url,
            "resume_filename": app.student.resume_filename,
            "resume_file_size": app.student.resume_file_size,
            "resume_uploaded_at": app.student.resume_uploaded_at,
            "internship_id": app.internship_id,
            "internship_title": app.internship.title,
            "status": app.status,
            "applied_at": app.applied_at
        })
    return result

# Fetch single application by ID
def get_application_by_id(db: Session, application_id: int):
    return db.query(Application).filter(Application.id == application_id).first()

# Commit status update to database
def update_application_status(db: Session, application: Application, status: str):
    application.status = status
    db.commit()
    db.refresh(application)
    return application

# Fetch application count statistics for a company
def get_company_stats(db: Session, company_id: int):
    apps = (
        db.query(Application.status)
        .join(Internship, Internship.id == Application.internship_id)
        .filter(Internship.company_id == company_id)
        .all()
    )

    stats = {
        "total": len(apps),
        "applied": 0,
        "under_review": 0,
        "shortlisted": 0,
        "rejected": 0,
        "selected": 0
    }

    for (status,) in apps:
        status_key = status.lower().replace(" ", "_")
        if status_key in stats:
            stats[status_key] += 1

    return stats