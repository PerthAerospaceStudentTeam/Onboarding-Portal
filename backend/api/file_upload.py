from fastapi import APIRouter, File, UploadFile

router = APIRouter()

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    return {
        "filename": file.filename,
        "content_type": file.content_type
    }