import datetime as dt
from sqlalchemy import JSON, Boolean, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.session import Base


def _now():
    return dt.datetime.now(dt.timezone.utc)


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))


class Category(Base):
    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(80), unique=True)

    products: Mapped[list["Product"]] = relationship(back_populates="category")


class Product(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120))
    description: Mapped[str] = mapped_column(Text, default="")
    price: Mapped[int] = mapped_column(Integer)
    status: Mapped[str] = mapped_column(String(10), default="available", index=True)
    featured: Mapped[bool] = mapped_column(Boolean, default=False)
    best: Mapped[bool] = mapped_column(Boolean, default=False)
    specs: Mapped[list] = mapped_column(JSON, default=list)

    category_id: Mapped[int] = mapped_column(
        ForeignKey("categories.id", ondelete="RESTRICT"),
        index=True
    )

    created_at: Mapped[dt.datetime] = mapped_column(
        DateTime(timezone=True),
        default=_now
    )

    category: Mapped["Category"] = relationship(back_populates="products")

    images: Mapped[list["ProductImage"]] = relationship(
        back_populates="product",
        cascade="all, delete-orphan",
        order_by="ProductImage.id"
    )


class ProductImage(Base):
    __tablename__ = "product_images"

    id: Mapped[int] = mapped_column(primary_key=True)

    product_id: Mapped[int] = mapped_column(
        ForeignKey("products.id", ondelete="CASCADE"),
        index=True
    )

    url: Mapped[str] = mapped_column(String(500))
    public_id: Mapped[str] = mapped_column(String(255))

    # Identifies the main image displayed for this product.
    is_primary: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False
    )

    product: Mapped["Product"] = relationship(back_populates="images")


class SiteSettings(Base):
    __tablename__ = "site_settings"

    id: Mapped[int] = mapped_column(primary_key=True)

    business_name: Mapped[str] = mapped_column(
        String(120),
        default="Loop & Lane Crochet"
    )

    whatsapp: Mapped[str] = mapped_column(String(20), default="")
    email: Mapped[str] = mapped_column(String(255), default="")
    phone: Mapped[str] = mapped_column(String(40), default="")

    # Selected images for homepage sections.
    homepage_image_id: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True
    )

    about_image_id: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True
    )