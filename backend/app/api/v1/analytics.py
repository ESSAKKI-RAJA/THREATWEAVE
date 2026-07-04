from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_analytics():
    return {"status": "success", "data": {"risk_score": 85}}
