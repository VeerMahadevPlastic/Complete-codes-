from pydantic import BaseModel
import os


class Settings(BaseModel):
    app_name: str = "VMP Autonomous Business API"
    firebase_project_id: str = os.getenv("FIREBASE_PROJECT_ID", "")
    firebase_credentials_json: str = os.getenv("GOOGLE_APPLICATION_CREDENTIALS", "")
    gst_number: str = os.getenv("VMP_GST_NUMBER", "24BLLPL0402N1Z6")
    company_name: str = os.getenv("VMP_COMPANY_NAME", "Veer Mahadev Plastic")
    company_phone: str = os.getenv("VMP_COMPANY_PHONE", "+91 80503 89261")


settings = Settings()
