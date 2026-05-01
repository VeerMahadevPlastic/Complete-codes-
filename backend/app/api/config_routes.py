from fastapi import APIRouter
import os
from fastapi.responses import JSONResponse

router = APIRouter(prefix="/api/config", tags=["config"])

@router.get("/public")
def public_config():
    return JSONResponse({
        "oneSignalAppId": os.getenv("ONESIGNAL_APP_ID", ""),
        "oneSignalSafariWebId": os.getenv("ONESIGNAL_SAFARI_WEB_ID", ""),
        "firebase": {
            "apiKey": os.getenv("FIREBASE_API_KEY", ""),
            "authDomain": os.getenv("FIREBASE_AUTH_DOMAIN", ""),
            "projectId": os.getenv("FIREBASE_PROJECT_ID", ""),
            "storageBucket": os.getenv("FIREBASE_STORAGE_BUCKET", ""),
            "messagingSenderId": os.getenv("FIREBASE_MESSAGING_SENDER_ID", ""),
            "appId": os.getenv("FIREBASE_APP_ID", ""),
        }
    })
