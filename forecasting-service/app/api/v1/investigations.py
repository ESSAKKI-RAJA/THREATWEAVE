from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_investigations():
    return {"status": "success", "data": [{"id": "INV-2023-01", "title": "Ransomware precursor on DB-SERVER-01"}]}
