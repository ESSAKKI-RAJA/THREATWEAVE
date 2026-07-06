from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
from app.core.settings_store import SettingsStore

router = APIRouter()
settings_store = SettingsStore()

class SettingsUpdate(BaseModel):
    shodan: Optional[str] = None
    virustotal: Optional[str] = None
    greynoise: Optional[str] = None
    security_strict_ip: Optional[bool] = None

class SettingsResponse(BaseModel):
    shodan: str
    virustotal: str
    greynoise: str
    security_strict_ip: bool

@router.get("/", response_model=SettingsResponse)
async def get_organization_settings(org_id: str = "default"):
    """Fetch settings for an organization."""
    try:
        settings = settings_store.get_settings(org_id)
        return SettingsResponse(**settings)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/", response_model=dict)
async def update_organization_settings(update: SettingsUpdate, org_id: str = "default"):
    """Update settings for an organization."""
    try:
        # Fetch existing to merge
        existing = settings_store.get_settings(org_id)
        
        shodan = update.shodan if update.shodan is not None else existing.get("shodan", "")
        virustotal = update.virustotal if update.virustotal is not None else existing.get("virustotal", "")
        greynoise = update.greynoise if update.greynoise is not None else existing.get("greynoise", "")
        security = update.security_strict_ip if update.security_strict_ip is not None else existing.get("security_strict_ip", False)
        
        settings_store.update_settings(
            org_id=org_id,
            shodan=shodan,
            virustotal=virustotal,
            greynoise=greynoise,
            security_strict_ip=security
        )
        return {"status": "success", "message": "Settings updated"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
