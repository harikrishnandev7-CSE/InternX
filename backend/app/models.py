from sqlalchemy import (Column, Integer, String, Boolean, ForeignKey,DateTime)
#foreign key is used for relationship use 
# SQLAlchemy relationship use pannrom
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    phone = Column(String(10), unique=True, nullable=False)
    password = Column(String, nullable=False)
    department = Column(String, nullable=False)
    year = Column(Integer, nullable=False)
    # One student can have multiple skills
    skills = relationship("Skill",back_populates="student",cascade="all, delete-orphan")
    linkedin = Column(String, nullable=True)
    github = Column(String, nullable=True)
    portfolio = Column(String, nullable=True)
    
    # Resume metadata columns
    resume_url = Column(String, nullable=True)
    resume_public_id = Column(String, nullable=True)
    resume_filename = Column(String, nullable=True)
    resume_file_size = Column(Integer, nullable=True)  # Stored in bytes
    resume_uploaded_at = Column(DateTime, nullable=True)
    
    applications = relationship(
    "Application",
    back_populates="student",
    cascade="all, delete"
)
    
# Skill table
class Skill(Base):
    __tablename__ = "skills"

    # Primary Key
    id = Column(Integer, primary_key=True, index=True)

    # Student Foreign Key
    student_id = Column(
        Integer,
        ForeignKey("students.id"),
        nullable=False
    )

    # Skill Name
    skill_name = Column(String, nullable=False)

    # Each skill belongs to one student
    student = relationship(
        "Student",
        back_populates="skills"
    )


# Company table create pannrom
class Company(Base):

    # Table name
    __tablename__ = "companies"

    # Primary Key
    id = Column(Integer, primary_key=True, index=True)

    # Company name
    company_name = Column(String, nullable=False)

    # Company email (unique)
    email = Column(String, unique=True, nullable=False)

    # Company phone (unique)
    phone = Column(String(10), unique=True, nullable=False)

    # Company password
    password = Column(String, nullable=False)

    # Company website
    website = Column(String, nullable=True)

    # Company location
    location = Column(String, nullable=False)

    # Company description
    description = Column(String, nullable=True)

    # Admin approval status
    is_approved = Column(Boolean, default=False)
    approval_status = Column(String, default="Pending", nullable=False)

    # Oru company-ku multiple internships irukkum
    internships = relationship("Internship",back_populates="company")

# Internship table create pannrom
class Internship(Base):

    # Table name
    __tablename__ = "internships"

    # Primary Key
    id = Column(Integer, primary_key=True, index=True)

    # Internship title
    title = Column(String, nullable=False)

    # Internship description
    description = Column(String, nullable=False)

    # Required skills
    skills = Column(String, nullable=False)

    # Internship location
    location = Column(String, nullable=False)

    # Internship duration
    duration = Column(String, nullable=False)

    # Internship stipend
    stipend = Column(String, nullable=False)

    # Internship type (Remote / Hybrid / On-site)
    type = Column(String, nullable=False)

    # Last date to apply
    deadline = Column(String, nullable=False)

    # Internship status
    is_active = Column(Boolean, default=True)

    # Automatically stores creation time
    created_at = Column(DateTime, default=datetime.utcnow)

    # Company Foreign Key
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)

    # Internship belongs to one company
    company = relationship(
        "Company",
        back_populates="internships"
    )
    applications = relationship(
    "Application",
    back_populates="internship",
    cascade="all, delete"
)

# Application model
class Application(Base):

    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)

    student_id = Column(
        Integer,
        ForeignKey("students.id"),
        nullable=False
    )

    internship_id = Column(
        Integer,
        ForeignKey("internships.id"),
        nullable=False
    )

    status = Column(
        String,
        default="Applied"
    )

    applied_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    # Relationships
    student = relationship(
        "Student",
        back_populates="applications"
    )

    internship = relationship(
        "Internship",
        back_populates="applications"
    )


class Admin(Base):
    __tablename__ = "admins"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)


class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(Integer, primary_key=True, index=True)
    action = Column(String, nullable=False)
    details = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class OTP(Base):
    __tablename__ = "otps"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, index=True, nullable=False)
    otp = Column(String, nullable=False)
    expiry_time = Column(DateTime, nullable=False)
    created_time = Column(DateTime, default=datetime.utcnow, nullable=False)
    verified_status = Column(Boolean, default=False, nullable=False)
    retry_count = Column(Integer, default=0, nullable=False)
