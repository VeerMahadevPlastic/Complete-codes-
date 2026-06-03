from fastapi import FastAPI
from app.api.routes import router
from app.api.config_routes import router as config_router
from app.config import settings

app = FastAPI(title=settings.app_name, version="1.0.0")
app.include_router(router, prefix="/api")
app.include_router(config_router)


@app.get("/")
def root():
    return {
        "service": settings.app_name,
        "docs": "/docs",
        "api_base": "/api",
        "modules": [
            "Daily Business Pulse",
            "Order Status Center",
            "AI Stock Insights",
            "Urgency Alerts",
            "Automated GST Billing",
            "Cash/Purchase/Bank Entry APIs",
        ],
    }
