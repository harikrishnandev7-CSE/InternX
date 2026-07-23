# Database session use pannrom
from sqlalchemy.orm import Session

# Internship model import pannrom
from app.models import Internship


# Internship create pannrom
def create_internship(
    db: Session,
    internship,
    company_id
):

    db_internship = Internship(

        title=internship.title,

        description=internship.description,

        skills=internship.skills,

        location=internship.location,

        duration=internship.duration,

        stipend=internship.stipend,

        type = internship.type,
        deadline = internship.deadline,
        is_active = True,
        company_id=company_id
    )

    # Database-la add pannrom
    db.add(db_internship)

    # Save pannrom
    db.commit()

    # Latest values load pannrom
    db.refresh(db_internship)

    return db_internship

# Company oda internships fetch panna use pannrom
def get_company_internships(
    db: Session,
    company_id: int
):

    return (
        db.query(Internship)
        .filter(
            Internship.company_id == company_id
        )
        .all()
    )

# All internships fetch panna use pannrom
def get_all_internships(
    db: Session
):

    return (
        db.query(Internship)
        .all()
    )


# Internship id use pannitu single internship fetch pannrom
def get_internship_by_id(
    db: Session,
    internship_id: int
):

    return (
        db.query(Internship)
        .filter(
            Internship.id == internship_id
        )
        .first()
    )

# Internship update pannrom
def update_internship(
    db: Session,
    db_internship: Internship,
    internship_update
):
    db_internship.title = internship_update.title
    db_internship.description = internship_update.description
    db_internship.skills = internship_update.skills
    db_internship.location = internship_update.location
    db_internship.duration = internship_update.duration
    db_internship.stipend = internship_update.stipend
    db_internship.type = internship_update.type
    db_internship.deadline = internship_update.deadline

    db.commit()
    db.refresh(db_internship)
    return db_internship

# Internship delete pannrom
def delete_internship(
    db: Session,
    db_internship: Internship
):
    db.delete(db_internship)
    db.commit()

# Internship status toggle/update pannrom
def update_internship_status(
    db: Session,
    db_internship: Internship,
    is_active: bool
):
    db_internship.is_active = is_active
    db.commit()
    db.refresh(db_internship)
    return db_internship