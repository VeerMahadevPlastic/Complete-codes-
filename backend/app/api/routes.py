from fastapi import APIRouter, UploadFile, File, BackgroundTasks, Request
from fastapi.responses import Response
from datetime import date, datetime

from app.schemas import (
    OrderCreate,
    CashSaleEntry,
    PurchaseBillEntry,
    BankEntry,
    DispatchSecurityVerification,
)
from app.services.firebase_repo import FirebaseRepository
from app.services.analytics import business_pulse, order_status_center
from app.services.ai_engine import stock_insights, urgency_alerts
from app.services.billing import generate_gst_invoice_pdf
from app.services.ocr import extract_bill_text
from app.config import settings

router = APIRouter()
repo = FirebaseRepository()




def format_admin_notification(payload: dict) -> str:
    customer = payload.get("onboardingCustomer") or payload.get("customerAuthToken") or {}
    delivery = payload.get("deliveryMetadata") or payload.get("fullShippingAddress") or {}
    items = payload.get("itemArray") or []
    currency = (payload.get("currencyTotal") or {}).get("currency", "INR")
    total = (payload.get("currencyTotal") or {}).get("total", 0)
    item_lines = []
    for item in items:
        item_lines.append(
            f"- {item.get('code') or item.get('id')}: {item.get('name')} | "
            f"qty {item.get('qty')} | cartons {item.get('masterCartons', 0)}"
        )
    return "\n".join([
        "VMP SYSTEM ADMIN NOTIFICATION",
        f"Order: {payload.get('orderId', 'UNASSIGNED')}",
        f"Customer: {customer.get('fullName') or customer.get('identity') or customer.get('name') or 'Unknown'}",
        f"Mobile: {customer.get('mobile') or delivery.get('mobile') or 'Not provided'}",
        f"Delivery: {delivery.get('streetAddress', '')}, {delivery.get('districtState', '')} {delivery.get('pinCode', '')}",
        f"Total master cartons: {payload.get('totalCartons', 0)}",
        f"Total: {currency} {total}",
        "Items:",
        *(item_lines or ["- No items provided"]),
    ])

def run_background_reconcile() -> None:
    """Lightweight background compute hook so UI calls return instantly."""
    orders = repo.list("orders")
    inventory = repo.list("inventory")
    _ = business_pulse(orders)
    _ = order_status_center(orders)
    _ = stock_insights(inventory)
    _ = urgency_alerts(orders)


@router.get("/health")
def health():
    return {"ok": True, "firestore": repo.using_firestore}


@router.get("/dashboard/business-pulse")
def get_business_pulse():
    orders = repo.list("orders")
    return business_pulse(orders)


@router.get("/dashboard/order-status")
def get_order_status_center():
    orders = repo.list("orders")
    return order_status_center(orders)


@router.get("/dashboard/stock-insights")
def get_stock_insights():
    inventory = repo.list("inventory")
    return stock_insights(inventory)


@router.get("/alerts/urgency")
def get_urgency_alerts():
    return urgency_alerts(repo.list("orders"))




@router.post("/security/verify-dispatch")
def verify_dispatch_security(payload: DispatchSecurityVerification, request: Request):
    digits = payload.phone.replace(" ", "").replace("-", "")
    if digits.startswith("+91"):
        digits = digits[3:]
    elif digits.startswith("91") and len(digits) == 12:
        digits = digits[2:]
    phone_verified = len(digits) == 10 and digits[0] in "6789" and digits.isdigit()
    return {
        "ok": phone_verified,
        "verified_business_at": date.today().isoformat() if phone_verified else None,
        "client_ip": request.client.host if request.client else None,
        "session_id": payload.session_id,
        "order_id": payload.order_id,
        "message": "Verified Secure Factory Dispatch" if phone_verified else "Invalid Indian mobile number",
    }


@router.post("/orders")
def create_order(order: OrderCreate):
    payload = order.model_dump()
    payload["created_at"] = order.created_at.isoformat()
    repo.set_doc("orders", order.order_id, payload)
    for item in order.items:
        repo.decrement_inventory(item.id, item.qty)

    invoice_bytes = generate_gst_invoice_pdf(
        payload,
        company=settings.company_name,
        gst_number=settings.gst_number,
        phone=settings.company_phone,
    )
    repo.set_doc("invoices", order.order_id, {
        "order_id": order.order_id,
        "generated_on": date.today().isoformat(),
        "status": "generated",
    })

    return Response(
        content=invoice_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"inline; filename=invoice-{order.order_id}.pdf"},
    )


@router.post("/custom-print-requests")
def create_custom_print_request(payload: dict):
    record = {**payload, "status": payload.get("status", "Pending Quote")}
    repo.add("custom_print_requests", record)
    return {"ok": True, "message": "Custom print request saved"}


@router.post("/entries/cash-sales")
def create_cash_sale(entry: CashSaleEntry):
    repo.add("cash_sales", entry.model_dump())
    return {"ok": True, "message": "Cash sale recorded"}


@router.post("/entries/bank")
def create_bank_entry(entry: BankEntry):
    repo.add("bank_entries", entry.model_dump())
    return {"ok": True, "message": "Bank entry recorded"}


@router.post("/entries/purchase-bills")
async def create_purchase_bill(
    material: str,
    supplier: str,
    amount: float,
    bill_file: UploadFile = File(...),
):
    raw = await bill_file.read()
    text = extract_bill_text(raw)
    payload = PurchaseBillEntry(material=material, supplier=supplier, amount=amount, ocr_text=text).model_dump()
    repo.add("purchase_bills", payload)
    return {"ok": True, "ocr_text": text, "message": "Purchase bill recorded"}


@router.get("/enquiries")
def list_enquiries():
    records = repo.list("enquiry_notifications")
    return {"ok": True, "enquiries": records}


@router.post("/enquiries/dispatch-whatsapp")
def dispatch_enquiry_notification(payload: dict):
    """Accept checkout JSON and format a server-managed admin notification.

    This replaces browser `wa.me` checkout redirection with a background
    dispatch contract. Production can swap the repo/log append for a WhatsApp
    Business provider without changing storefront payload shape.
    """
    record = {
        "type": "admin_whatsapp_notification",
        "status": "queued",
        "payload": payload,
        "formatted_message": format_admin_notification(payload),
        "created_at": datetime.utcnow().isoformat(),
    }
    repo.add("enquiry_notifications", record)
    print(record["formatted_message"])
    return {"ok": True, "channel": "admin_notification", "status": "queued", "message": record["formatted_message"]}


@router.post("/orders/notify-whatsapp")
def notify_order_whatsapp(payload: dict):
    return dispatch_enquiry_notification(payload)


@router.post("/compute/reconcile")
def reconcile_in_background(background_tasks: BackgroundTasks):
    background_tasks.add_task(run_background_reconcile)
    return {"ok": True, "message": "Background reconciliation started"}
