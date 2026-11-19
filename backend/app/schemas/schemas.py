import datetime as dt
from typing import Literal
from pydantic import BaseModel, ConfigDict, Field

class LoginIn(BaseModel):
    email: str = Field(min_length=3, max_length=255)
    password: str = Field(min_length=1, max_length=200)

class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    email: str

class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

class ImageOut(BaseModel):
    id: int
    url: str

class ProductOut(BaseModel):
    id: int
    name: str
    description: str
    price: int
    status: Literal["available", "sold"]
    featured: bool
    best: bool
    specs: list[str]
    category: str
    category_id: int
    images: list[ImageOut]
    created_at: dt.datetime

class StatusIn(BaseModel):
    status: Literal["available", "sold"]

class CategoryIn(BaseModel):
    name: str = Field(min_length=1, max_length=80)

class CategoryOut(BaseModel):
    id: int
    name: str
    product_count: int

class SettingsIn(BaseModel):
    model_config = ConfigDict(populate_by_name=True, from_attributes=True)
    business_name: str = Field(alias="businessName", min_length=1, max_length=120)
    whatsapp: str = Field(min_length=10, max_length=20, pattern=r"^\d+$")  # digits only, with country code
    email: str = Field(default="", max_length=255)
    phone: str = Field(default="", max_length=40)

class SettingsOut(SettingsIn):
    pass
