from flask import Flask, request, jsonify
from datetime import datetime, timedelta
import os
import uuid

try:
    import firebase_admin
    from firebase_admin import credentials, firestore, storage
except Exception:  # pragma: no cover
    firebase_admin = None
    firestore = None
    storage = None

app = Flask(__name__)

MEMORY = {
    "daybook_entries": [],
    "purchase_bills": [],
    "orders": [],
    "inventory": {},
    "live_rates_catalog": {},
    "custom_print_requests": [],
}


def get_db():
    if not firebase_admin or not firestore:
        return None
    try:
        if not firebase_admin._apps:
            firebase_admin.initialize_app()
        return firestore.client()
    except Exception:
        return None


def get_bucket():
    if not firebase_admin or not storage:
        return None
    try:
        if not firebase_admin._apps:
            firebase_admin.initialize_app(options={"storageBucket": os.getenv("FIREBASE_STORAGE_BUCKET", "")})
        return storage.bucket()
    except Exception:
        return None


def _save_entry(payload: dict):
    db = get_db()
    if db:
        db.collection("daybookEntries").add(payload)
    else:
        MEMORY["daybook_entries"].append(payload)


def _save_purchase(payload: dict):
    db = get_db()
    if db:
        db.collection("purchaseBills").add(payload)
    else:
        MEMORY["purchase_bills"].append(payload)


def _list_entries():
    db = get_db()
    if db:
        return [d.to_dict() for d in db.collection("daybookEntries").stream()]
    return list(MEMORY["daybook_entries"])


def _list_orders():
    db = get_db()
    if db:
        return [d.to_dict() for d in db.collection("orders").stream()]
    return list(MEMORY["orders"])


def _list_inventory():
    db = get_db()
    if db:
        rows = []
        for d in db.collection("products").stream():
            data = d.to_dict()
            rows.append({"id": d.id, **(data or {})})
        return rows
    return [{"id": k, **v} for k, v in MEMORY["inventory"].items()]


def _adjust_stock(product_id: str, delta: int):
    db = get_db()
    if db:
        ref = db.collection("products").document(product_id)
        snap = ref.get()
        data = snap.to_dict() or {}
        current = int(data.get("currentStock", data.get("stock", 0)))
        ref.set({"currentStock": max(current + delta, 0), "updatedAt": datetime.utcnow().isoformat()}, merge=True)
        return
    existing = MEMORY["inventory"].setdefault(product_id, {"stock": 0, "currentStock": 0, "name": product_id})
    existing["currentStock"] = max(int(existing.get("currentStock", 0)) + delta, 0)
    existing["stock"] = existing["currentStock"]


def _sync_live_rate_stock(product_id: str):
    row = MEMORY["inventory"].get(product_id)
    if not row:
        return
    entry = MEMORY["live_rates_catalog"].setdefault(product_id, {"id": product_id, "currentStock": 0, "updatedAt": None})
    entry["currentStock"] = int(row.get("currentStock", row.get("stock", 0)))
    entry["updatedAt"] = datetime.utcnow().isoformat()


def _calc_summary():
    entries = _list_entries()
    orders = _list_orders()
    now = datetime.utcnow()
    today = now.date()

    def parse_day(text):
        try:
            return datetime.fromisoformat(str(text).replace("Z", "+00:00")).date()
        except Exception:
            return None

    sales_today = 0.0
    seven = []
    day_map = {}
    for i in range(6, -1, -1):
        d = today - timedelta(days=i)
        day_map[d] = 0.0

    for e in entries:
        d = parse_day(e.get("date"))
        if not d:
            continue
        if d in day_map and e.get("type") == "sale":
            day_map[d] += float(e.get("amount", 0))

    sales_today = day_map.get(today, 0.0)
    for d, val in day_map.items():
        seven.append({"date": d.isoformat(), "sales": round(val, 2)})

    current_month = today.replace(day=1)
    prev_month_end = current_month - timedelta(days=1)
    prev_month = prev_month_end.replace(day=1)
    curr = sum(v for d, v in day_map.items() if d >= current_month)
    prev = 0.0
    for e in entries:
        d = parse_day(e.get("date"))
        if d and prev_month <= d <= prev_month_end and e.get("type") == "sale":
            prev += float(e.get("amount", 0))
    growth = ((curr - prev) / prev * 100) if prev else (100.0 if curr else 0.0)

    status = {"pending": 0, "in_dispatch": 0, "delivered": 0}
    for o in orders:
        st = str(o.get("status", "Pending")).lower()
        if st == "pending":
            status["pending"] += 1
        elif st in ("in-dispatch", "in dispatch"):
            status["in_dispatch"] += 1
        elif st == "delivered":
            status["delivered"] += 1

    return {
        "todays_sales": round(sales_today, 2),
        "seven_day_trend": seven,
        "monthly_growth_percent": round(growth, 2),
        "order_status": status,
    }


@app.post('/add_entry')
def add_entry():
    payload = request.get_json(force=True)
    required = ["date", "mode", "type", "amount", "narration"]
    for key in required:
        if key not in payload:
            return jsonify({"ok": False, "error": f"Missing field: {key}"}), 400

    record = {
        "date": payload["date"],
        "mode": payload["mode"],
        "type": payload["type"],
        "amount": float(payload["amount"]),
        "txnId": payload.get("txn_id", ""),
        "note": payload.get("narration", ""),
        "createdAt": datetime.utcnow().isoformat(),
    }
    _save_entry(record)

    product_id = payload.get("product_id")
    qty = int(payload.get("qty", 0))
    if payload.get("source") == "manual_cash_sale" and product_id and qty > 0:
        _adjust_stock(product_id, -qty)
        _sync_live_rate_stock(product_id)
    if payload.get("source") == "stock_in" and product_id and qty > 0:
        _adjust_stock(product_id, qty)
        _sync_live_rate_stock(product_id)

    return jsonify({"ok": True, "entry": record, "summary": _calc_summary()})


@app.post('/purchase_bill')
def purchase_bill():
    material = request.form.get("material", "")
    supplier = request.form.get("supplier", "")
    amount = float(request.form.get("amount", 0) or 0)
    date_val = request.form.get("date") or datetime.utcnow().date().isoformat()
    bill_file = request.files.get("bill_file")

    bill_url = None
    if bill_file:
        bucket = get_bucket()
        if bucket:
            blob_name = f"purchase-bills/{datetime.utcnow().strftime('%Y%m%d-%H%M%S')}-{uuid.uuid4().hex[:8]}-{bill_file.filename}"
            blob = bucket.blob(blob_name)
            blob.upload_from_file(bill_file.stream, content_type=bill_file.mimetype)
            blob.make_public()
            bill_url = blob.public_url

    payload = {
        "date": date_val,
        "material": material,
        "supplier": supplier,
        "amount": amount,
        "billUrl": bill_url,
        "createdAt": datetime.utcnow().isoformat(),
    }
    _save_purchase(payload)
    return jsonify({"ok": True, "purchase": payload, "summary": _calc_summary()})


@app.get('/get_summary')
def get_summary():
    return jsonify(_calc_summary())


@app.post('/confirm_b2b_order')
def confirm_b2b_order():
    payload = request.get_json(force=True) or {}
    items = payload.get("items") or []
    order_id = payload.get("order_id") or f"B2B-{uuid.uuid4().hex[:8]}"
    for item in items:
        product_id = str(item.get("id", "")).strip()
        qty = int(item.get("qty", 0) or 0)
        if product_id and qty > 0:
            _adjust_stock(product_id, -qty)
            _sync_live_rate_stock(product_id)
    MEMORY["orders"].append({
        "orderId": order_id,
        "status": "Confirmed",
        "items": items,
        "createdAt": datetime.utcnow().isoformat(),
    })
    return jsonify({"ok": True, "order_id": order_id, "inventory": _list_inventory(), "live_rates_catalog": list(MEMORY["live_rates_catalog"].values())})


@app.get('/live_rates_catalog')
def live_rates_catalog():
    return jsonify({"ok": True, "catalog": list(MEMORY["live_rates_catalog"].values())})


@app.post('/stock_adjust')
def stock_adjust():
    payload = request.get_json(force=True)
    product_id = payload.get("product_id")
    delta = int(payload.get("delta", 0))
    if not product_id:
        return jsonify({"ok": False, "error": "product_id is required"}), 400
    _adjust_stock(product_id, delta)
    _sync_live_rate_stock(product_id)
    return jsonify({"ok": True})


if __name__ == '__main__':
    debug_mode = os.getenv('FLASK_DEBUG', '').lower() in ('1', 'true', 'yes', 'on')
    app.run(host='0.0.0.0', port=8000, debug=debug_mode)
