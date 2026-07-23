from pydantic import BaseModel
from typing import List
from datetime import datetime
class StudentCreate(BaseModel):
    first_name: str
    last_name: str
    email: str
    phone: str
    password: str
    department: str
    year: int

class StudentLogin(BaseModel):
    email:str
    password:str

# Skill create request-ku use pannrom
class SkillCreate(BaseModel):

    skill_name: str


# Skill response-ku use pannrom
class SkillResponse(BaseModel):

    id: int
    skill_name: str

    class Config:
        from_attributes = True


# Student details response-ku use pannrom
class StudentResponse(BaseModel):

    id: int
    first_name: str
    last_name: str
    email: str
    phone: str
    department: str
    year: int
    #professional links
    linkedin:str |None = None
    github:str |None = None
    portfolio:str |None = None
    
    # Resume metadata fields
    resume_url: str | None = None
    resume_filename: str | None = None
    resume_file_size: int | None = None
    resume_uploaded_at: datetime | None = None

     # Student skills
    skills: List[SkillResponse] = []
    # SQLAlchemy object-ai JSON-a convert pannrom
    class Config:
        from_attributes = True

# Student profile update request-ku use pannrom
class StudentUpdate(BaseModel):
    first_name: str
    last_name: str
    phone: str
    department: str
    year: int
    linkedin:str |None = None
    github:str |None = None
    portfolio:str |None = None

# Student password change request-ku use pannrom
class ChangePassword(BaseModel):

    # Current password
    old_password: str

    # New password
    new_password: str


# Company register request-ku use pannrom
class CompanyCreate(BaseModel):

    company_name: str
    email: str
    phone: str
    password: str
    website: str
    location: str
    description: str

# Company login request-ku use pannrom
class CompanyLogin(BaseModel):

    email: str
    password: str

# Company response schema
class CompanyResponse(BaseModel):

    id: int
    company_name: str
    email: str
    phone: str
    website: str
    location: str
    description: str
    is_approved: bool
    approval_status: str

    class Config:
        from_attributes = True

# Internship create request-ku use pannrom
class InternshipCreate(BaseModel):

    title: str
    description: str
    skills: str
    location: str
    duration: str
    stipend: str
     # Remote / Hybrid / On-site
    type: str

    # Last application date
    deadline: str

# Internship update request-ku use pannrom
class InternshipUpdate(BaseModel):

    title: str
    description: str
    skills: str
    location: str
    duration: str
    stipend: str
    # Remote / Hybrid / On-site
    type: str
    # Last application date
    deadline: str

# Internship response-ku use pannrom
class InternshipResponse(BaseModel):

    id: int
    title: str
    description: str
    skills: str
    location: str
    duration: str
    stipend: str
    type: str
    deadline: str
    is_active: bool
    created_at: datetime
    company_id: int
    company: CompanyResponse | None = None

    # SQLAlchemy object-ai JSON-a convert pannrom
    class Config:
        from_attributes = True

# Student apply internship request
class ApplicationCreate(BaseModel):

    internship_id: int

# Application response
# Used after student clicks Apply
class ApplicationResponse(BaseModel):

    id: int
    student_id: int
    internship_id: int
    status: str
    applied_at: datetime

    class Config:
        from_attributes = True
# Student applications response
class StudentApplicationResponse(BaseModel):

    id: int
    internship_id: int
    internship_title: str
    company_name: str
    status: str
    applied_at: datetime

    class Config:
        from_attributes = True


# Company applicants response
class CompanyApplicationResponse(BaseModel):
    id: int
    student_id: int
    student_name: str
    student_email: str
    student_phone: str
    department: str
    year: int
    skills: List[str]
    linkedin: str | None = None
    github: str | None = None
    portfolio: str | None = None
    
    # Resume metadata fields
    resume_url: str | None = None
    resume_filename: str | None = None
    resume_file_size: int | None = None
    resume_uploaded_at: datetime | None = None

    internship_id: int
    internship_title: str
    status: str
    applied_at: datetime

    class Config:
        from_attributes = True

# Request schema for updating application status
class ApplicationStatusUpdate(BaseModel):
    status: str

# Response schema for company dashboard stats
class CompanyStatsResponse(BaseModel):
    total: int
    applied: int
    under_review: int
    shortlisted: int
    rejected: int
    selected: int

# Schema for the company dashboard statistics
class CompanyDashboardStatsResponse(BaseModel):
    total_internships: int
    active_internships: int
    inactive_internships: int
    total_applicants: int
    under_review: int
    shortlisted: int
    selected: int
    rejected: int


# Admin Schemas
class AdminLogin(BaseModel):
    email: str
    password: str


class AdminResponse(BaseModel):
    id: int
    full_name: str
    email: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class AdminUpdate(BaseModel):
    full_name: str
    email: str


class AdminChangePassword(BaseModel):
    old_password: str
    new_password: str


# Activity Log Schema
class ActivityLogResponse(BaseModel):
    id: int
    action: str
    details: str
    created_at: datetime

    class Config:
        from_attributes = True


# Admin Dashboard Stats Response
class AdminDashboardStatsResponse(BaseModel):
    total_students: int
    total_companies: int
    approved_companies: int
    pending_companies: int
    rejected_companies: int
    total_internships: int
    active_internships: int
    inactive_internships: int
    total_applications: int
    under_review_applications: int
    shortlisted_applications: int
    selected_applications: int
    rejected_applications: int


# Admin Analytics Response
class AdminAnalyticsResponse(BaseModel):
    student_registrations: List[dict]  # List of {"date": str, "count": int}
    company_registrations: List[dict]  # List of {"date": str, "count": int}
    internship_postings: List[dict]    # List of {"date": str, "count": int}
    applications_submitted: List[dict] # List of {"date": str, "count": int}
    selections_count: List[dict]       # List of {"date": str, "count": int}
    rejections_count: List[dict]       # List of {"date": str, "count": int}


# OTP Schemas
class SendOTPRequest(BaseModel):
    email: str

class VerifyOTPRequest(BaseModel):
    email: str
    otp: str

class ResetPasswordRequest(BaseModel):
    email: str
    otp: str
    new_password: str

class ResendOTPRequest(BaseModel):
    email: str


