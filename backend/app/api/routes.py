from fastapi import APIRouter, UploadFile, File
from fastapi.responses import Response
from datetime import date

from app.schemas import (
    OrderCreate,
    CashSaleEntry,
    PurchaseBillEntry,
    BankEntry,
)
from app.services.firebase_repo import FirebaseRepository
from app.services.analytics import business_pulse, order_status_center
from app.services.ai_engine import stock_insights, urgency_alerts
from app.services.billing import generate_gst_invoice_pdf
from app.services.ocr import extract_bill_text
from app.config import settings

router = APIRouter()
repo = FirebaseRepository()


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


@router.post("/orders")
def create_order(order: OrderCreate):
    payload = order.model_dump()
    payload["created_at"] = order.created_at.isoformat()
    repo.set_doc("orders", order.order_id, payload)

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
