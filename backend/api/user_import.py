from fastapi import APIRouter, File, UploadFile
from services import user_import_service

router = APIRouter()

@router.post("/users/import")
async def import_users(file: UploadFile = File(...)):
    return await user_import_service.import_users_from_file(file)