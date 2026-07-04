from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_threats():
    return {"status": "success", "data": [{"id": 1, "type": "CVE", "value": "CVE-2023-44487"}]}
