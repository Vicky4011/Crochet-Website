from sqlalchemy import select
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.security import hash_password
from app.models.models import Category, SiteSettings, User

CATEGORIES = ["Crochet Bags", "Crochet Flowers", "Crochet Toys", "Keychains", "Home Decor", "Accessories", "Customized Gifts"]

def seed(db: Session) -> None:
    if not db.scalar(select(Category.id).limit(1)):
        db.add_all(Category(name=n) for n in CATEGORIES)
    if not db.get(SiteSettings, 1):
        db.add(SiteSettings(
            id=1,
            business_name="Crochet By Balki",
            whatsapp="919444157228",
            email="crochetbybalki@gmail.com",
            phone="+91 94441 57228"
        ))
    if settings.ADMIN_EMAIL and settings.ADMIN_PASSWORD and not db.scalar(select(User).where(User.email == settings.ADMIN_EMAIL)):
        db.add(User(email=settings.ADMIN_EMAIL, password_hash=hash_password(settings.ADMIN_PASSWORD)))
    db.commit()
