from fastapi import APIRouter, HTTPException
from service.supabase_client import supabase 

router = APIRouter(prefix="/api/recruits", tags=["Recruits"])

# GET endpoint for AdminPanel (the list view)
# GET /api/recruits
@router.get("/")
def get_recruits_list(): 
    try: 
        # join candidates with users and applications tables 
        response = supabase.table("candidates") \
            .select("id, status, created_at, users(student_id, first_name, last_name, email), applications(department)") \
            .execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# GET endpoint for RecruitsDetails (the detailed view)
# GET /api/recruits/{candidate_id}
@router.get("/{candidate_id}")
def get_recruits_details(candidateId: int):
    try:
        response = supabase.table("candidates") \
            .select("*, users(*), applications(*), internal_candidate_evaluations(*)") \
            .eq("id", candidateId) \
            .single() \
            .execute()
        return response.data
    except Exception as e: 
        raise HTTPException(status_code=404, detail="Candidate not found")

# PATCH endpoints for RecruitsDetails (for updating recruit data by team devs)
# PATCH /api/recruits/{candidate_id}
@router.patch("/{candidate_id}")
def update_recruit_Notes(candidateId: int, data: dict):
    try:
        # Upsert evaluations notes and their grades/info into internal candidate evaluations 
        eval_data = data.get("evaluations", {})
        eval_data["candidate_id"] = candidateId

        supabase.table("internal_candidate_evaluations") \
            .upsert (eval_data, on_conflict="candidate_id") \
            .execute()

        # update candidate status if provided
        if "status" in data:
            supabase.table("candidates") \
                .update({"status":data["status"]}) \
                .eq("id", candidateId) \
                .execute()

        return {"message" : "Recruit details updated successfully!"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
