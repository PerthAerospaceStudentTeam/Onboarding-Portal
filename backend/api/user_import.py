from fastapi import APIRouter, File, UploadFile

router = APIRouter()

@router.post("/users/import")
async def import_users(file: UploadFile = File(...)):
    return {
        "filename": file.filename,
        "content_type": file.content_type
    }