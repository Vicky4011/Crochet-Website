from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select
from sqlalchemy.orm import Session
from app.api.deps import require_admin
from app.database.session import get_db
from app.models.models import Category, Product
from app.schemas.schemas import CategoryIn, CategoryOut

router = APIRouter(prefix="/categories", tags=["categories"])

def out(db: Session, c: Category) -> CategoryOut:
    n = db.scalar(select(func.count(Product.id)).where(Product.category_id == c.id)) or 0
    return CategoryOut(id=c.id, name=c.name, product_count=n)

def unique(db: Session, name: str, skip: int | None = None) -> str:
    name = name.strip()
    other = db.scalar(select(Category).where(func.lower(Category.name) == name.lower()))
    if not name or (other and other.id != skip):
        raise HTTPException(409 if name else 422, "That category already exists" if name else "Enter a category name")
    return name

@router.get("", response_model=list[CategoryOut])
def list_categories(db: Session = Depends(get_db)):
    return [out(db, c) for c in db.scalars(select(Category).order_by(Category.id))]

@router.post("", response_model=CategoryOut, status_code=201, dependencies=[Depends(require_admin)])
def create_category(body: CategoryIn, db: Session = Depends(get_db)):
    c = Category(name=unique(db, body.name))
    db.add(c)
    db.commit()
    return out(db, c)

@router.put("/{cid}", response_model=CategoryOut, dependencies=[Depends(require_admin)])
def rename_category(cid: int, body: CategoryIn, db: Session = Depends(get_db)):
    c = db.get(Category, cid)
    if not c:
        raise HTTPException(404, "Category not found")
    c.name = unique(db, body.name, skip=cid)
    db.commit()
    return out(db, c)

@router.delete("/{cid}", status_code=204, dependencies=[Depends(require_admin)])
def delete_category(cid: int, db: Session = Depends(get_db)):
    c = db.get(Category, cid)
    if not c:
        raise HTTPException(404, "Category not found")
    if out(db, c).product_count:
        raise HTTPException(409, "Move or delete this category's products first")
    db.delete(c)
    db.commit()
