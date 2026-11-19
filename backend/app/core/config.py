import os
from dotenv import load_dotenv
load_dotenv()

def _db_url() -> str:
    u = os.getenv("DATABASE_URL", "sqlite:///./dev.db")
    if u.startswith("postgres://"):
        return u.replace("postgres://", "postgresql+psycopg2://", 1)
    if u.startswith("postgresql://"):
        return u.replace("postgresql://", "postgresql+psycopg2://", 1)
    return u

class Settings:
    DATABASE_URL = _db_url()
    JWT_SECRET = os.getenv("JWT_SECRET", "")
    TOKEN_MINUTES = int(os.getenv("TOKEN_MINUTES", "720"))
    ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "").strip().lower()
    ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "")
    CORS_ORIGINS = [o.strip() for o in os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",") if o.strip()]
    MAX_IMAGE_MB = 5
    MAX_IMAGES = 8

settings = Settings()
