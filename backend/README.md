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
  - `POST /api/compute/reconcile` (background compute trigger)

## Flask endpoints for VMP Accounts UI
- `POST /add_entry` → save Daybook entry (Date, Mode, Type, Amount, Narration) and return updated summary.
- `POST /purchase_bill` → save purchase with optional bill image upload to Firebase Storage.
- `POST /stock_adjust` → adjust inventory stock (+/-).
- `GET /get_summary` → Today Sales, 7-Day Trend, Monthly Growth, Order Status counters.

## Run
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Run Flask adapter
```bash
cd backend
flask --app flask_app run --port 8000 --debug
```

## Firebase
If Firebase service account is configured (`GOOGLE_APPLICATION_CREDENTIALS`), data writes to Firestore.
If not configured, APIs use in-memory fallback for development.
