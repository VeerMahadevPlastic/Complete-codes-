from __future__ import annotations

from datetime import datetime, timezone
from typing import Any
from uuid import uuid4

from fastapi import APIRouter, BackgroundTasks
from pydantic import BaseModel, Field

router = APIRouter(prefix="/api/v1", tags=["mobile-b2b"])

PRODUCTS: list[dict[str, Any]] = [
    {"id": "7041", "sku": "7041", "title": "3CP Meal Tray with Lid", "category": "Cornstarch Meal Trays", "stock": 1200, "moq": 50, "base": 4400},
    {"id": "7043", "sku": "7043", "title": "4CP Meal Tray with Lid", "category": "Cornstarch Meal Trays", "stock": 980, "moq": 50, "base": 4890},
    {"id": "7045", "sku": "7045", "title": "5CP Meal Tray with Lid", "category": "Cornstarch Meal Trays", "stock": 640, "moq": 100, "base": 5055},
    {"id": "7063", "sku": "7063", "title": "350ML Round Container with Lid", "category": "Cornstarch Containers", "stock": 2200, "moq": 50, "base": 3760},
]
CHECKOUTS: list[dict[str, Any]] = []
SUBSCRIPTIONS: list[dict[str, Any]] = []


class CheckoutCustomer(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    phone: str = Field(min_length=8, max_length=24)
    address: str = Field(min_length=5, max_length=500)
    gstin: str | None = Field(default=None, max_length=32)


class CheckoutItem(BaseModel):
    sku: str
    title: str
    qty: int = Field(gt=0)
    base: float = Field(ge=0)


class CheckoutRequest(BaseModel):
    customer: CheckoutCustomer
    items: list[CheckoutItem] = Field(min_length=1)
    payment_method: str = "UPI"
    notification_permission: str | None = None


class PushSubscription(BaseModel):
    endpoint: str | None = None
    permission: str
    user_agent: str | None = None
    pincode: str | None = None


def compute_totals(items: list[CheckoutItem]) -> dict[str, float]:
    subtotal = sum(item.base * item.qty / 100 for item in items)
    gst = round(subtotal * 0.18, 2)
    return {"subtotal": round(subtotal, 2), "gst": gst, "total": round(subtotal + gst, 2)}


def notify_admin(record: dict[str, Any]) -> None:
    lines = [
        "VMP FASTAPI ADMIN CHECKOUT",
        f"Order: {record['order_id']}",
        f"Customer: {record['customer']['name']} {record['customer']['phone']}",
        f"Address: {record['customer']['address']}",
        f"Total: ₹{record['totals']['total']}",
        "Items:",
        *[f"- {item['sku']} {item['title']} x {item['qty']}" for item in record["items"]],
    ]
    print("\n".join(lines))


@router.get("/products")
async def list_products() -> dict[str, Any]:
    return {"ok": True, "products": PRODUCTS, "cached_at": datetime.now(timezone.utc).isoformat()}


@router.post("/checkout")
async def checkout(payload: CheckoutRequest, background_tasks: BackgroundTasks) -> dict[str, Any]:
    totals = compute_totals(payload.items)
    record = {
        "order_id": f"VMP-{uuid4().hex[:10].upper()}",
        "customer": payload.customer.model_dump(),
        "items": [item.model_dump() for item in payload.items],
        "totals": totals,
        "payment_method": payload.payment_method,
        "status": "Pending",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    CHECKOUTS.insert(0, record)
    background_tasks.add_task(notify_admin, record)
    return {"ok": True, "order": record}


@router.post("/subscribe-notifications")
async def subscribe_notifications(payload: PushSubscription) -> dict[str, Any]:
    record = {**payload.model_dump(), "id": uuid4().hex, "created_at": datetime.now(timezone.utc).isoformat()}
    SUBSCRIPTIONS.insert(0, record)
    return {"ok": True, "subscription": record, "message": "Wholesale price alerts subscription saved"}


@router.get("/admin/summary")
async def admin_summary() -> dict[str, Any]:
    revenue = sum(order["totals"]["total"] for order in CHECKOUTS)
    low_stock = sum(1 for product in PRODUCTS if product["stock"] < 700)
    return {
        "ok": True,
        "metrics": {
            "revenue": revenue,
            "pending_orders": sum(1 for order in CHECKOUTS if order["status"] == "Pending"),
            "active_enquiries": len(CHECKOUTS),
            "low_stock_alerts": low_stock,
            "notification_subscribers": len(SUBSCRIPTIONS),
        },
        "orders": CHECKOUTS,
        "products": PRODUCTS,
    }
