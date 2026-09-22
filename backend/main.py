import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from config import get_settings
from api.user_import import router as user_import_router
from pydantic import BaseModel
from enum import Enum
from database import supabase

settings = get_settings()

app = FastAPI(title="Onboarding Portal API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Stage(str, Enum):
    applied = "Applied"
    onboarding = "Onboarding"
    logbook_submission = "Logbook Submission"
    interview = "Interview"
    accepted = "Accepted"
    rejected = "Rejected"

class RecruitBase(BaseModel):
    id: int
    name: str
    team: str | None = None
    stage: Stage
    attendance: int | None = None

class NotesUpdate(BaseModel):
    id: int
    notes: str
    
class StageUpdate(BaseModel):
    id: int
    stage: Stage
    
class GradesUpdate(BaseModel):
    id: int
    onboarding_score: int | None = None
    project_score: int | None = None
    interview_score: int | None = None

@app.get("/health")
def health():
    return {"status": "ok", "app_env": settings.app_env}

# Supabase connection check
@app.get("/health/supabase")
def supabase_health():
    try:
        settings.require_supabase()
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))
    
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
    
# GET dashboard recruit information for quick display
@app.get("/dashboard_recruits", response_model=list[RecruitBase])
def get_dashboard_recruits():
    response = (
        supabase.table("candidates")
        .select("""
            id,
            status,
            users:user_id (
                first_name,
                last_name
            ),
            applications (
                department
            ),
            internal_candidate_data (
                onboarding_score
            )
        """).execute()
    )
    
    recruits = []
    for row in response.data:
        user = row.get("users") or {}
        applications = row.get("applications") or []
        scores = row.get("internal_candidate_data") or []

        recruits.append({
            "id": row["id"],
            "name": f"{user.get('first_name', '')} {user.get('last_name', '')}".strip(),
            "team": applications[0]["department"].capitalize() if applications else None,
            "stage": (row.get("status") or "").capitalize(),
            "attendance": scores[0]["onboarding_score"] if scores else None,
        })
    
    return recruits

# GET profile view data
@app.get("/candidate_profile")
def get_candidate_profile(id: int):
    
    response = (
        supabase.table("candidates")
        .select("""
            id,
            status,
            email,
            phone_num,
            course,
            expected_grad_date,
            users:user_id (
                first_name,
                last_name
            ),
            applications(
                department,
                reason_for_application,
                cv_link
            ),
            internal_candidate_data(
                notes,
                onboarding_score,
                project_score,
                interview_score
            )
        """)
        .eq("id", id)
        .execute()
    )
    
    row = response.data[0]
    user = row.get("users") or {}
    applications = row.get("applications") or []
    internal_data = row.get("internal_candidate_data") or []
    
    candidate = {
        "id": row["id"],
        "name": f"{user.get('first_name', '')} {user.get('last_name', '')}".strip(),
        "email": row["email"],
        "phone_number": row["phone_num"],
        "course": row["course"],
        "expected_grad_date": row["expected_grad_date"],
        "team": applications[0]["department"].capitalize() if applications else None,
        "reason_4_application": applications[0]["reason_for_application"] if applications else None,
        "cv_link": applications[0]["cv_link"] if applications else None,
        "stage": (row.get("status") or "").capitalize(),
        "onboarding_score": internal_data[0]["onboarding_score"] if internal_data else None,
        "interview_score": internal_data[0]["interview_score"] if internal_data else None,
        "project_score": internal_data[0]["project_score"] if internal_data else None,
        "notes": internal_data[0]["notes"] if internal_data else None,
    }
    
    return candidate

# PUT onboarding notes
@app.put("/update/onboarding_notes")
def update_onboarding_notes(body: NotesUpdate):
    response = (
        supabase.table("internal_candidate_data")
        .update({"notes": body.notes})
        .eq("candidate_id", body.id)
        .execute()
    )
    
    if not response.data:
        raise HTTPException(status_code=404, detail="Candidate not found.")
    return response.data[0]

# PUT Interview Notes

# PUT Logbook Submission Notes

# PUT Grades
@app.put("/update/candidate_grades")
def update_candidate_grades(body: GradesUpdate):
    
    update_data = body.model_dump(exclude={"id"}, exclude_unset=True)
    
    if not update_data:
        raise HTTPException(status_code=400, detail="No scores provided to update.")
    
    response = (
                supabase.table("internal_candidate_data")
                .update(update_data)
                .eq("candidate_id", body.id)
                .execute()
            )
            
    if not response.data:
        raise HTTPException(status_code=404, detail="Candidate not found.")
    return response.data[0]

# PUT Stage
@app.put("/update/candidate_stage")
def update_candidate_stage(body: StageUpdate):
    response = (
            supabase.table("candidates")
            .update({"status": body.stage.value.lower()})
            .eq("id", body.id)
            .execute()
        )
        
    if not response.data:
        raise HTTPException(status_code=404, detail="Candidate not found.")
    return response.data[0]