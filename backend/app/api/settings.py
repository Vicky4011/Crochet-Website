from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import require_admin
from app.database.session import get_db
from app.models.models import SiteSettings
from app.schemas.schemas import SettingsIn, SettingsOut

router = APIRouter(prefix="/settings", tags=["settings"])

@router.get("", response_model=SettingsOut)
def get_settings(db: Session = Depends(get_db)):
    return db.get(SiteSettings, 1)

@router.put("", response_model=SettingsOut, dependencies=[Depends(require_admin)])
def update_settings(body: SettingsIn, db: Session = Depends(get_db)):
    s = db.get(SiteSettings, 1)
    for k, v in body.model_dump().items():
        setattr(s, k, v)
    db.commit()
    return s
