from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_alerts():
    return {"status": "success", "data": [{"id": "AL-1092", "source": "CrowdStrike", "severity": "high"}]}
