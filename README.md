# Loop & Lane Crochet – Stage 2 (React frontend)

Run it:
```
cd frontend
npm install
npm run dev
```
- Customer site: `/`, `/shop`, `/product/:id`
- Admin: `/admin/login` (any non-empty email and password for now)

Data lives in `src/services/api.js` (localStorage mock). Stage 3 swaps these functions for FastAPI calls using `VITE_API_URL`, adds real JWT login, PostgreSQL and Cloudinary uploads.
Deploy to Vercel: root directory `frontend`, build `npm run build`, output `dist` (`vercel.json` handles routing).
