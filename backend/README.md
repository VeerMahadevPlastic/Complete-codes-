# VMP Autonomous Business Backend (FastAPI + Firebase)

## What this adds
- Daily Business Pulse (`/api/dashboard/business-pulse`)
- Order Status Center (`/api/dashboard/order-status`)
- AI stock insights (`/api/dashboard/stock-insights`)
- Urgency alerts for orders pending >24h (`/api/alerts/urgency`)
- Automated GST invoice PDF on order create (`POST /api/orders`)
- Data entry APIs:
  - `POST /api/entries/cash-sales`
  - `POST /api/entries/bank`
  - `POST /api/entries/purchase-bills` (with OCR)

## Run
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Firebase
If Firebase service account is configured (`GOOGLE_APPLICATION_CREDENTIALS`), data writes to Firestore.
If not configured, APIs use in-memory fallback for development.
