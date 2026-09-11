from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from config import get_settings

settings = get_settings()

app = FastAPI(title="Onboarding Portal API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok", "app_env": settings.app_env}

@app.get("/health/supabase")
def supabase_health():
    return {"status": "ok", "type":"supabase"}

@app.get("/test")
def test():
    return {"status":"ok", "type":"test"}