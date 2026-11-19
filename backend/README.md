# Loop & Lane Crochet API (FastAPI)

## Local setup (Windows)

```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
```

Set `JWT_SECRET` to a random value of at least 32 characters, and configure `ADMIN_EMAIL` and `ADMIN_PASSWORD`. The first startup creates the database tables, default categories, site settings and initial admin account. Local development uses SQLite when `DATABASE_URL` is unset. Configure `CLOUDINARY_URL` to enable product photo uploads.

```powershell
uvicorn app.main:app --reload
```

Interactive API docs: http://localhost:8000/docs

## API endpoints (under `/api`)

| Method | Path | Access |
|---|---|---|
| POST | `/auth/login` | Public |
| GET | `/auth/me` | Admin |
| GET | `/products`, `/products/{id}` | Public |
| POST, PUT, PATCH, DELETE | `/products` and `/products/{id}` | Admin |
| GET | `/categories` | Public |
| POST, PUT, DELETE | `/categories` and `/categories/{id}` | Admin |
| GET | `/settings` | Public |
| PUT | `/settings` | Admin |

Product creation and updates use multipart form data; attach one or more `images` files. JPG, PNG and WebP are supported, max 5 MB each and up to 8 images per product. Images are stored in Cloudinary.
