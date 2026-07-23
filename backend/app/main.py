from fastapi import FastAPI
# React frontend-ku access allow panna CORS middleware import pannrom
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base,engine
import app.models
from app.routers.student import router as student_router
# Company router import pannrom
from app.routers.company import router as company_router
# Internship router import pannrom
from app.routers.internship import router as internship_router
from app.routers.application import router as application_router
from app.routers.admin import router as admin_router
from app.routers.auth import router as auth_router

app = FastAPI()
# React frontend FastAPI-a access panna allow pannrom
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth_router)
app.include_router(student_router)
# Company router register pannrom
app.include_router(company_router)
# Internship router register pannrom
app.include_router(internship_router)
app.include_router(application_router)
app.include_router(admin_router)
Base.metadata.create_all(bind = engine)
@app.get("/")
def home():
    return{"message":"backend is running "}


