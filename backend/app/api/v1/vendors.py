from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_vendors():
    return {"status": "success", "data": [{"id": "V-001", "name": "Vendor A"}]}
