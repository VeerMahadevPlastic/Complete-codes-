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
        },
        "payment": {
            "provider": os.getenv("PAYMENT_PROVIDER", "phonepe"),
            "phonepe": {
                "enabled": os.getenv("PHONEPE_ENABLED", "true").lower() == "true",
                "merchantId": os.getenv("PHONEPE_MERCHANT_ID", "SU2605141715570021348446"),
                "collectEndpoint": os.getenv("PHONEPE_COLLECT_ENDPOINT", "/api/payments/phonepe/create-order")
            }
        }
    })
