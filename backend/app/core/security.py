import datetime as dt
import bcrypt
import jwt
from app.core.config import settings

def hash_password(p: str) -> str:
    return bcrypt.hashpw(p.encode()[:72], bcrypt.gensalt()).decode()

def verify_password(p: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(p.encode()[:72], hashed.encode())
    except ValueError:
        return False

_DUMMY = hash_password("not-a-real-password")  # keeps login timing similar when the email is unknown

def fake_verify(p: str) -> None:
    verify_password(p, _DUMMY)

def create_token(user_id: int) -> str:
    exp = dt.datetime.now(dt.timezone.utc) + dt.timedelta(minutes=settings.TOKEN_MINUTES)
    return jwt.encode({"sub": str(user_id), "exp": exp}, settings.JWT_SECRET, algorithm="HS256")

def decode_token(token: str) -> int | None:
    try:
        return int(jwt.decode(token, settings.JWT_SECRET, algorithms=["HS256"])["sub"])
    except (jwt.PyJWTError, KeyError, ValueError):
        return None
