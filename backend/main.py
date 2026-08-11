from fastapi import FastAPI
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

app.include_router(user_import_router)

@app.get("/health")
def health():
    return {"status": "ok", "app_env": settings.app_env}