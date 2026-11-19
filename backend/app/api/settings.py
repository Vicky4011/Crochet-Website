from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import require_admin
from app.database.session import get_db
from app.models.models import SiteSettings, ProductImage
from app.schemas.schemas import SettingsIn, SettingsOut
from app.services import images as imgs


router = APIRouter(prefix="/settings", tags=["settings"])


def serialize_settings(
    settings: SiteSettings,
    db: Session
) -> SettingsOut:

    homepage_image = (
        db.get(ProductImage, settings.homepage_image_id)
        if settings.homepage_image_id
        else None
    )

    about_image = (
        db.get(ProductImage, settings.about_image_id)
        if settings.about_image_id
        else None
    )

    return SettingsOut(
        businessName=settings.business_name,
        whatsapp=settings.whatsapp,
        email=settings.email,
        phone=settings.phone,
        homepageImageId=settings.homepage_image_id,
        aboutImageId=settings.about_image_id,
        homepageImageUrl=(
            imgs.optimized(homepage_image.url)
            if homepage_image else None
        ),
        aboutImageUrl=(
            imgs.optimized(about_image.url)
            if about_image else None
        )
    )


@router.get("", response_model=SettingsOut)
def get_settings(db: Session = Depends(get_db)):
    settings = db.get(SiteSettings, 1)

    if not settings:
        raise HTTPException(404, "Website settings not found")

    return serialize_settings(settings, db)


@router.put(
    "",
    response_model=SettingsOut,
    dependencies=[Depends(require_admin)]
)
def update_settings(
    body: SettingsIn,
    db: Session = Depends(get_db)
):
    settings = db.get(SiteSettings, 1)

    if not settings:
        raise HTTPException(404, "Website settings not found")

    for image_id in (
        body.homepage_image_id,
        body.about_image_id
    ):
        if image_id is not None and not db.get(ProductImage, image_id):
            raise HTTPException(
                422,
                "One of the selected images does not exist"
            )

    settings.business_name = body.business_name
    settings.whatsapp = body.whatsapp
    settings.email = body.email
    settings.phone = body.phone

    settings.homepage_image_id = body.homepage_image_id
    settings.about_image_id = body.about_image_id

    db.commit()
    db.refresh(settings)

    return serialize_settings(settings, db)