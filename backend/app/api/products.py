import json

from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    HTTPException,
    UploadFile
)

from sqlalchemy import or_, select
from sqlalchemy.orm import Session, selectinload

from app.api.deps import require_admin
from app.database.session import get_db
from app.models.models import Category, Product, ProductImage
from app.schemas.schemas import ProductOut, StatusIn
from app.services import images as imgs


router = APIRouter(prefix="/products", tags=["products"])

_load = (
    selectinload(Product.images),
    selectinload(Product.category)
)


def serialize(p: Product) -> ProductOut:
    ordered_images = sorted(
        p.images,
        key=lambda image: (
            not image.is_primary,
            image.id
        )
    )

    return ProductOut(
        id=p.id,
        name=p.name,
        description=p.description,
        price=p.price,
        status=p.status,
        featured=p.featured,
        best=p.best,
        specs=p.specs or [],
        category=p.category.name,
        category_id=p.category_id,
        created_at=p.created_at,
        images=[
            {
                "id": image.id,
                "url": imgs.optimized(image.url),
                "is_primary": image.is_primary
            }
            for image in ordered_images
        ]
    )


def get_or_404(db: Session, pid: int) -> Product:
    p = db.scalar(
        select(Product)
        .options(*_load)
        .where(Product.id == pid)
    )

    if not p:
        raise HTTPException(404, "Product not found")

    return p


def parse_list(
    raw: str | None,
    what: str,
    max_items: int,
    cast=str
) -> list:
    try:
        value = json.loads(raw or "[]")

        if not isinstance(value, list) or len(value) > max_items:
            raise ValueError

        return [
            cast(item) if cast is not str else str(item)[:120]
            for item in value
        ]

    except (ValueError, TypeError):
        raise HTTPException(
            422,
            f"{what} must be a JSON list of up to {max_items} items"
        )


def check_category(db: Session, cid: int) -> None:
    if not db.get(Category, cid):
        raise HTTPException(422, "That category doesn't exist")


def set_primary_image(
    images: list[ProductImage],
    image_id: int | None = None,
    new_index: int | None = None
):
    if not images:
        return

    selected = None

    if image_id is not None:
        selected = next(
            (image for image in images if image.id == image_id),
            None
        )

        if selected is None:
            raise HTTPException(
                422,
                "Selected main image does not belong to this product"
            )

    elif new_index is not None:
        if new_index < 0 or new_index >= len(images):
            raise HTTPException(422, "Invalid main image selection")

        selected = images[new_index]

    else:
        selected = next(
            (image for image in images if image.is_primary),
            images[0]
        )

    for image in images:
        image.is_primary = image.id == selected.id


@router.get("", response_model=list[ProductOut])
def list_products(
    category: str | None = None,
    status: str | None = None,
    q: str | None = None,
    db: Session = Depends(get_db)
):
    stmt = (
        select(Product)
        .options(*_load)
        .order_by(Product.id.desc())
    )

    if category:
        stmt = stmt.join(Category).where(Category.name == category)

    if status in ("available", "sold"):
        stmt = stmt.where(Product.status == status)

    if q:
        like = f"%{q.strip()}%"
        stmt = stmt.where(
            or_(
                Product.name.ilike(like),
                Product.description.ilike(like)
            )
        )

    return [serialize(p) for p in db.scalars(stmt)]


@router.get("/{pid}", response_model=ProductOut)
def get_product(
    pid: int,
    db: Session = Depends(get_db)
):
    return serialize(get_or_404(db, pid))


@router.post(
    "",
    response_model=ProductOut,
    status_code=201,
    dependencies=[Depends(require_admin)]
)
async def create_product(
    name: str = Form(..., min_length=1, max_length=120),
    description: str = Form("", max_length=2000),
    price: int = Form(..., gt=0, le=10_000_000),
    category_id: int = Form(...),
    status: str = Form("available", pattern="^(available|sold)$"),
    featured: bool = Form(False),
    best: bool = Form(False),
    specs: str = Form("[]"),
    primary_image_index: int | None = Form(None),
    images: list[UploadFile] = File(default=[]),
    db: Session = Depends(get_db)
):
    check_category(db, category_id)

    spec_list = parse_list(specs, "specs", 8)

    uploaded = await imgs.upload_all(
        await imgs.read_and_validate(images)
    )

    if primary_image_index is not None and (
        primary_image_index < 0 or primary_image_index >= len(uploaded)
    ):
        await imgs.delete_all([item["public_id"] for item in uploaded])
        raise HTTPException(422, "Invalid main image selection")

    image_records = [
        ProductImage(
            **item,
            is_primary=(
                index == (
                    primary_image_index
                    if primary_image_index is not None
                    else 0
                )
            )
        )
        for index, item in enumerate(uploaded)
    ]

    p = Product(
        name=name.strip(),
        description=description.strip(),
        price=price,
        category_id=category_id,
        status=status,
        featured=featured,
        best=best,
        specs=spec_list,
        images=image_records
    )

    try:
        db.add(p)
        db.commit()

    except Exception:
        db.rollback()
        await imgs.delete_all([item["public_id"] for item in uploaded])
        raise HTTPException(500, "Couldn't save the product")

    return serialize(get_or_404(db, p.id))


@router.put(
    "/{pid}",
    response_model=ProductOut,
    dependencies=[Depends(require_admin)]
)
async def update_product(
    pid: int,
    name: str | None = Form(None, min_length=1, max_length=120),
    description: str | None = Form(None, max_length=2000),
    price: int | None = Form(None, gt=0, le=10_000_000),
    category_id: int | None = Form(None),
    status: str | None = Form(None, pattern="^(available|sold)$"),
    featured: bool | None = Form(None),
    best: bool | None = Form(None),
    specs: str | None = Form(None),
    remove_image_ids: str | None = Form(None),
    primary_image_id: int | None = Form(None),
    primary_image_new_index: int | None = Form(None),
    images: list[UploadFile] = File(default=[]),
    db: Session = Depends(get_db)
):
    p = get_or_404(db, pid)

    if category_id is not None:
        check_category(db, category_id)
        p.category_id = category_id

    for key, value in (
        ("name", name.strip() if name is not None else None),
        ("description", description.strip() if description is not None else None),
        ("price", price),
        ("status", status),
        ("featured", featured),
        ("best", best)
    ):
        if value is not None:
            setattr(p, key, value)

    if specs is not None:
        p.specs = parse_list(specs, "specs", 8)

    drop = set(
        parse_list(remove_image_ids, "remove_image_ids", 20, int)
    )

    gone = [image for image in p.images if image.id in drop]

    uploaded = await imgs.upload_all(
        await imgs.read_and_validate(images)
    )

    remaining_count = len(p.images) - len(gone) + len(uploaded)

    if remaining_count > 8:
        await imgs.delete_all([item["public_id"] for item in uploaded])
        raise HTTPException(422, "A product can have up to 8 images")

    for image in gone:
        p.images.remove(image)

    new_records = [
        ProductImage(**item, is_primary=False)
        for item in uploaded
    ]

    p.images.extend(new_records)

    if primary_image_new_index is not None:
        if (
            primary_image_new_index < 0
            or primary_image_new_index >= len(new_records)
        ):
            await imgs.delete_all([item["public_id"] for item in uploaded])
            raise HTTPException(422, "Invalid new main image selection")

        selected = new_records[primary_image_new_index]

        for image in p.images:
            image.is_primary = image.id == selected.id

    else:
        set_primary_image(
            p.images,
            image_id=primary_image_id
        )

    try:
        db.commit()

    except Exception:
        db.rollback()
        await imgs.delete_all([item["public_id"] for item in uploaded])
        raise HTTPException(500, "Couldn't update the product")

    await imgs.delete_all([image.public_id for image in gone])

    return serialize(get_or_404(db, pid))


@router.patch(
    "/{pid}/status",
    response_model=ProductOut,
    dependencies=[Depends(require_admin)]
)
def set_status(
    pid: int,
    body: StatusIn,
    db: Session = Depends(get_db)
):
    p = get_or_404(db, pid)
    p.status = body.status

    db.commit()

    return serialize(p)


@router.delete(
    "/{pid}",
    status_code=204,
    dependencies=[Depends(require_admin)]
)
async def delete_product(
    pid: int,
    db: Session = Depends(get_db)
):
    p = get_or_404(db, pid)

    image_ids = [image.public_id for image in p.images]

    db.delete(p)
    db.commit()

    await imgs.delete_all(image_ids)