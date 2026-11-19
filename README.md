# Loop & Lane Crochet

React/Vite storefront with a FastAPI backend. Customers browse products and enquire through WhatsApp; there is no online payment flow. Admin product, category and business settings are stored in the API database.

## Run locally (Windows)

### 1. Backend

```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
```

Edit `backend/.env`: set a random `JWT_SECRET` (at least 32 characters), a strong `ADMIN_EMAIL` and `ADMIN_PASSWORD`. For local testing leave `DATABASE_URL` unset to use SQLite. Add `CLOUDINARY_URL` to enable real image uploads.

```powershell
uvicorn app.main:app --reload
```

API docs: http://localhost:8000/docs

### 2. Frontend (new terminal)

```powershell
cd frontend
npm install
copy .env.example .env
npm run dev
```

Storefront: http://localhost:5173 · Admin: http://localhost:5173/admin/login

The frontend uses `VITE_API_URL` (default `http://localhost:8000/api`). Do not put backend secrets in frontend environment variables.

## Production deployment

- Frontend: Vercel, root directory `frontend`, build `npm run build`, output `dist`. Set `VITE_API_URL` to the deployed API base URL ending in `/api`.
- Backend: Render web service, root directory `backend`, start command `uvicorn app.main:app --host 0.0.0.0 --port $PORT`. Configure `DATABASE_URL`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `CORS_ORIGINS` and `CLOUDINARY_URL` as Render environment variables.
- Set `CORS_ORIGINS` to the exact Vercel production origin (comma-separated if more than one).
- Use a persistent PostgreSQL database for production; do not rely on the local SQLite file on ephemeral hosting.

Never commit `.env` files or real credentials. If a credential has ever been committed, rotate it even after removing it from the repository.
