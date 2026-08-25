import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from config import get_settings
from api.user_import import router as user_import_router

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
    try:
        settings.require_supabase()
    except RuntimeError as e:
        raise HTTPException(status_code=500, details=str(e))
    
    url = f"{settings.supabase_url}/rest/v1/"
    try:
        response = httpx.get(
            url,
            headers={
                "apikey": settings.supabase_service_role_key,
                "Authorization": f"Bearer {settings.supabase_service_role_key}",
            },
            timeout=5.0,
        )
    except httpx.RequestError as e:
        raise HTTPException(status_code=502, detail=f"Could not reach Supabase: {e}")

    if response.status_code >= 500:
        raise HTTPException(
            status_code=502,
            detail=f"Supabase responded with {response.status_code}",
        )

    return {
        "status": "ok",
        "supabase_reachable": response.status_code < 500
    }
