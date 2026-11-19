# Loop & Lane Crochet: backend (FastAPI)

## Run locally (Windows)
```
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
```
Edit `.env`: set `JWT_SECRET` (run `python -c "import secrets;print(secrets.token_urlsafe(48))"`), `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `CLOUDINARY_URL`.
Leave `DATABASE_URL` as it is to try the API on a local SQLite file first, or point it at PostgreSQL.
```
uvicorn app.main:app --reload
```
Interactive docs: http://localhost:8000/docs

## What happens on first start
Tables are created, the 7 default categories and the settings row are added, and the admin account from `ADMIN_EMAIL` / `ADMIN_PASSWORD` is created. The password is stored hashed (bcrypt).

## Endpoints (all under /api)
| Method | Path | Access |
|---|---|---|
| POST | /auth/login, /auth/logout | public |
| GET | /auth/me | admin |
| GET | /products, /products/{id} | public (filters: category, status, q) |
| POST, PUT | /products, /products/{id} | admin, multipart form with `images` |
| PATCH | /products/{id}/status | admin |
| DELETE | /products/{id} | admin |
| GET | /categories, /settings | public |
| POST, PUT, DELETE | /categories, /categories/{id}; PUT /settings | admin |

Images: JPG, PNG or WebP, max 5 MB each, up to 8 per product, checked by file signature, stored on Cloudinary and served resized (`f_auto,q_auto,w_1200`).
