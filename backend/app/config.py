# pyrefly: ignore [missing-import]
from dotenv import load_dotenv
import os 

load_dotenv()
DATABASE_URL = os.environ["DATABASE_URL"]
if DATABASE_URL is None:
    raise ValueError("DATABASE_URL is not set in .env file")

SECRET_KEY = os.environ["SECRET_KEY"]
ALGORITHM = os.environ["ALGORITHM"]
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.environ["ACCESS_TOKEN_EXPIRE_MINUTES"])

def _clean_env_val(val: str | None) -> str:
    if val is None:
        return ""
    return val.strip().strip('\'"')

# Email Configurations
SMTP_SERVER = _clean_env_val(os.getenv("SMTP_SERVER", "smtp.gmail.com"))
SMTP_PORT = _clean_env_val(os.getenv("SMTP_PORT", "587"))
SMTP_EMAIL = _clean_env_val(os.getenv("SMTP_EMAIL", ""))
SMTP_PASSWORD = _clean_env_val(os.getenv("SMTP_PASSWORD", ""))
EMAIL_FROM = _clean_env_val(os.getenv("EMAIL_FROM", ""))

# Cloudinary Configurations
CLOUDINARY_CLOUD_NAME = _clean_env_val(os.getenv("CLOUDINARY_CLOUD_NAME", ""))
CLOUDINARY_API_KEY = _clean_env_val(os.getenv("CLOUDINARY_API_KEY", ""))
CLOUDINARY_API_SECRET = _clean_env_val(os.getenv("CLOUDINARY_API_SECRET", ""))