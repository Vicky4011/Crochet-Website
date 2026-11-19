import time
from collections import defaultdict
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.api.deps import require_admin
from app.core.security import create_token, fake_verify, verify_password
from app.database.session import get_db
from app.models.models import User
from app.schemas.schemas import LoginIn, TokenOut, UserOut

router = APIRouter(prefix="/auth", tags=["auth"])
_fails: dict[str, list[float]] = defaultdict(list)  # simple in-memory brute-force guard (per server process)

@router.post("/login", response_model=TokenOut)
def login(body: LoginIn, request: Request, db: Session = Depends(get_db)):
    ip = request.client.host if request.client else "?"
    _fails[ip] = [t for t in _fails[ip] if time.time() - t < 300]
    if len(_fails[ip]) >= 5:
        raise HTTPException(429, "Too many attempts. Try again in a few minutes.")
    user = db.scalar(select(User).where(User.email == body.email.strip().lower()))
    if not user:
        fake_verify(body.password)
    if not user or not verify_password(body.password, user.password_hash):
        _fails[ip].append(time.time())
        raise HTTPException(401, "Incorrect email or password")
    _fails.pop(ip, None)
    return TokenOut(access_token=create_token(user.id), user=UserOut.model_validate(user))

@router.post("/logout")
def logout():
    # Tokens are stateless; the client discards its token. Short expiry limits exposure.
    return {"detail": "Logged out"}

@router.get("/me", response_model=UserOut)
def me(user: User = Depends(require_admin)):
    return user
