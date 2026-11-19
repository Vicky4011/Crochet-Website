import json
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy import or_, select
from sqlalchemy.orm import Session, selectinload
from app.api.deps import require_admin
from app.database.session import get_db
from app.models.models import Category, Product, ProductImage
from app.schemas.schemas import ProductOut, StatusIn
from app.services import images as imgs

router = APIRouter(prefix="/products", tags=["products"])
_load = (selectinload(Product.images), selectinload(Product.category))

def serialize(p: Product) -> ProductOut:
    return ProductOut(id=p.id, name=p.name, description=p.description, price=p.price, status=p.status,
                      featured=p.featured, best=p.best, specs=p.specs or [], category=p.category.name,
                      category_id=p.category_id, created_at=p.created_at,
                      images=[{"id": i.id, "url": imgs.optimized(i.url)} for i in p.images])

def get_or_404(db: Session, pid: int) -> Product:
    p = db.scalar(select(Product).options(*_load).where(Product.id == pid))
    if not p:
        raise HTTPException(404, "Product not found")
    return p

def parse_list(raw: str | None, what: str, max_items: int, cast=str) -> list:
    try:
        v = json.loads(raw or "[]")
        if not isinstance(v, list) or len(v) > max_items:
            raise ValueError
        return [cast(x) if cast is not str else str(x)[:120] for x in v]
    except (ValueError, TypeError):
        raise HTTPException(422, f"{what} must be a JSON list of up to {max_items} items")

def check_category(db: Session, cid: int) -> None:
    if not db.get(Category, cid):
        raise HTTPException(422, "That category doesn't exist")

@router.get("", response_model=list[ProductOut])
def list_products(category: str | None = None, status: str | None = None, q: str | None = None, db: Session = Depends(get_db)):
    stmt = select(Product).options(*_load).order_by(Product.id.desc())
    if category:
        stmt = stmt.join(Category).where(Category.name == category)
    if status in ("available", "sold"):
        stmt = stmt.where(Product.status == status)
    if q:
        like = f"%{q.strip()}%"
        stmt = stmt.where(or_(Product.name.ilike(like), Product.description.ilike(like)))
    return [serialize(p) for p in db.scalars(stmt)]

@router.get("/{pid}", response_model=ProductOut)
def get_product(pid: int, db: Session = Depends(get_db)):
    return serialize(get_or_404(db, pid))

@router.post("", response_model=ProductOut, status_code=201, dependencies=[Depends(require_admin)])
async def create_product(
    name: str = Form(..., min_length=1, max_length=120), description: str = Form("", max_length=2000),
    price: int = Form(..., gt=0, le=10_000_000), category_id: int = Form(...),
    status: str = Form("available", pattern="^(available|sold)$"),
    featured: bool = Form(False), best: bool = Form(False), specs: str = Form("[]"),
    images: list[UploadFile] = File(default=[]), db: Session = Depends(get_db),
):
    check_category(db, category_id)
    spec_list = parse_list(specs, "specs", 8)
    uploaded = await imgs.upload_all(await imgs.read_and_validate(images))
    p = Product(name=name.strip(), description=description.strip(), price=price, category_id=category_id,
                status=status, featured=featured, best=best, specs=spec_list,
                images=[ProductImage(**u) for u in uploaded])
    try:
        db.add(p)
        db.commit()
    except Exception:
        db.rollback()
        await imgs.delete_all([u["public_id"] for u in uploaded])
        raise HTTPException(500, "Couldn't save the product")
    return serialize(get_or_404(db, p.id))

@router.put("/{pid}", response_model=ProductOut, dependencies=[Depends(require_admin)])
async def update_product(
    pid: int, name: str | None = Form(None, min_length=1, max_length=120), description: str | None = Form(None, max_length=2000),
    price: int | None = Form(None, gt=0, le=10_000_000), category_id: int | None = Form(None),
    status: str | None = Form(None, pattern="^(available|sold)$"), featured: bool | None = Form(None), best: bool | None = Form(None),
    specs: str | None = Form(None), remove_image_ids: str | None = Form(None),
    images: list[UploadFile] = File(default=[]), db: Session = Depends(get_db),
):
    p = get_or_404(db, pid)
    if category_id is not None:
        check_category(db, category_id)
        p.category_id = category_id
    for k, v in (("name", name and name.strip()), ("description", description and description.strip()), ("price", price),
                 ("status", status), ("featured", featured), ("best", best)):
        if v is not None:
            setattr(p, k, v)
    if description == "":
        p.description = ""
    if specs is not None:
        p.specs = parse_list(specs, "specs", 8)
    drop = set(parse_list(remove_image_ids, "remove_image_ids", 20, int))
    gone = [i for i in p.images if i.id in drop]
    uploaded = await imgs.upload_all(await imgs.read_and_validate(images))
    if len(p.images) - len(gone) + len(uploaded) > 8:
        await imgs.delete_all([u["public_id"] for u in uploaded])
        raise HTTPException(422, "A product can have up to 8 images")
    for i in gone:
        p.images.remove(i)
    p.images.extend(ProductImage(**u) for u in uploaded)
    db.commit()
    await imgs.delete_all([i.public_id for i in gone])
    return serialize(get_or_404(db, pid))

@router.patch("/{pid}/status", response_model=ProductOut, dependencies=[Depends(require_admin)])
def set_status(pid: int, body: StatusIn, db: Session = Depends(get_db)):
    p = get_or_404(db, pid)
    p.status = body.status
    db.commit()
    return serialize(p)

@router.delete("/{pid}", status_code=204, dependencies=[Depends(require_admin)])
async def delete_product(pid: int, db: Session = Depends(get_db)):
    p = get_or_404(db, pid)
    ids = [i.public_id for i in p.images]
    db.delete(p)
    db.commit()
    await imgs.delete_all(ids)
