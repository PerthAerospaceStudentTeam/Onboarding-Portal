# Onboarding Portal

PAST candidate onboarding portal — React frontend and FastAPI backend.

## Layout

```
frontend/   React (Vite) SPA
backend/    FastAPI API
infra/      Infrastructure as code (later)
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

## Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate          # Windows
# source .venv/bin/activate     # macOS / Linux
pip install -r requirements.txt
uvicorn main:app --reload
```

Health check: [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health)
