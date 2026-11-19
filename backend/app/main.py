from contextlib import asynccontextmanager
from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, categories, products, settings as settings_api
from app.core.config import settings
from app.database.session import Base, SessionLocal, engine
from app.models import models  # noqa: F401  (registers tables)
from app.utils.seed import seed

@asynccontextmanager
async def lifespan(_: FastAPI):
    if len(settings.JWT_SECRET) < 32:
        raise RuntimeError("Set JWT_SECRET to a random string of at least 32 characters (see .env.example)")
    Base.metadata.create_all(engine)
    with SessionLocal() as db:
        seed(db)
    yield

app = FastAPI(title="Loop & Lane Crochet API", version="1.0.0", lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=settings.CORS_ORIGINS, allow_methods=["*"], allow_headers=["*"])

api = APIRouter(prefix="/api")
for r in (auth.router, products.router, categories.router, settings_api.router):
    api.include_router(r)

@api.get("/health", tags=["meta"])
def health():
    return {"status": "ok"}

app.include_router(api)
