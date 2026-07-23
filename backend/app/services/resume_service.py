# Resume Management Service
# Handles validation and Cloudinary interaction for resumes

import os
import datetime
from fastapi import HTTPException, UploadFile

import cloudinary

import cloudinary.uploader
# Ensure Cloudinary settings are loaded
import app.utils.cloudinary_config

MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB in bytes

def validate_pdf_file(file: UploadFile):
    # 1. Reject empty file
    file.file.seek(0, os.SEEK_END)
    file_size = file.file.tell()
    file.file.seek(0)
    
    if file_size == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")
        
    # 2. Maximum size check (5 MB)
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File size exceeds the maximum limit of 5 MB.")
        
    # 3. Extension and MIME type check
    filename = file.filename or ""
    extension = os.path.splitext(filename)[1].lower()
    if extension != ".pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")
        
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Invalid file type. Only application/pdf is supported.")
        
    # 4. Reject corrupted PDF (Check magic number %PDF signature)
    magic_bytes = file.file.read(4)
    file.file.seek(0)
    if magic_bytes != b"%PDF":
        raise HTTPException(status_code=400, detail="The file is not a valid PDF or is corrupted.")

    return file_size

def upload_resume_to_cloudinary(file: UploadFile, file_size: int) -> dict:
    try:
        # Perform upload
        upload_result = cloudinary.uploader.upload(
            file.file,
            folder="internx/resumes",
            resource_type="raw",  # PDFs are uploaded as raw resources in Cloudinary to retain original extension
            access_mode="public"
        )
        
        # Extract metadata
        secure_url = upload_result.get("secure_url")
        public_id = upload_result.get("public_id")
        
        if not secure_url or not public_id:
            raise HTTPException(status_code=500, detail="Cloudinary upload failed to return url/public_id.")
            
        return {
            "secure_url": secure_url,
            "public_id": public_id,
            "filename": file.filename,
            "filesize": file_size,
            "upload_time": datetime.datetime.utcnow()
        }
    except Exception as e:
        # Check if it's already an HTTPException
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(
            status_code=500,
            detail=f"Cloudinary upload failed: {str(e)}"
        )

def delete_resume_from_cloudinary(public_id: str) -> bool:
    if not public_id:
        return False
    try:
        # Since it is uploaded as a raw resource, we must specify resource_type='raw' to delete it
        result = cloudinary.uploader.destroy(public_id, resource_type="raw")
        return result.get("result") == "ok"
    except Exception as e:
        # Log error or raise warning, but don't crash delete flow to avoid inconsistent DB state
        print(f"Failed to delete file from Cloudinary (public_id: {public_id}): {str(e)}")
        return False

# High-level services coordinating CRUD and Cloudinary operations
from sqlalchemy.orm import Session
from app.crud.student_crud import update_student_resume_info, clear_student_resume_info

def upload_resume_service(db: Session, current_student, file: UploadFile) -> dict:
    # 1. Validate PDF file
    file_size = validate_pdf_file(file)
    
    # 2. If student has an existing resume, delete the old file from Cloudinary
    old_public_id = current_student.resume_public_id
    if old_public_id:
        delete_resume_from_cloudinary(old_public_id)
        
    # 3. Upload the new file to Cloudinary
    upload_metadata = upload_resume_to_cloudinary(file, file_size)
    
    # 4. Save metadata to database via CRUD
    try:
        update_student_resume_info(
            db=db,
            db_student=current_student,
            url=upload_metadata["secure_url"],
            public_id=upload_metadata["public_id"],
            filename=upload_metadata["filename"],
            file_size=upload_metadata["filesize"],
            upload_time=upload_metadata["upload_time"]
        )
    except Exception as db_err:
        # Rollback and clean up uploaded file in Cloudinary if DB save fails
        db.rollback()
        delete_resume_from_cloudinary(upload_metadata["public_id"])
        raise HTTPException(
            status_code=500,
            detail=f"Database save failed, resume upload rolled back. Error: {str(db_err)}"
        )
        
    return {
        "message": "Resume uploaded successfully.",
        "resume_url": current_student.resume_url,
        "resume_filename": current_student.resume_filename,
        "resume_file_size": current_student.resume_file_size,
        "resume_uploaded_at": current_student.resume_uploaded_at
    }

def delete_resume_service(db: Session, current_student) -> dict:
    if not current_student.resume_url:
        raise HTTPException(status_code=404, detail="No resume found to delete.")
        
    # 1. Delete file from Cloudinary
    public_id = current_student.resume_public_id
    if public_id:
        delete_success = delete_resume_from_cloudinary(public_id)
        if not delete_success:
            # We can print warning, but we still clear DB so state remains consistent
            print(f"Warning: Cloudinary deletion returned non-ok status for public_id: {public_id}")
            
    # 2. Clear database resume fields via CRUD
    try:
        clear_student_resume_info(db, current_student)
    except Exception as db_err:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Database update failed while clearing resume. Error: {str(db_err)}"
        )
        
    return {"message": "Resume deleted successfully."}

