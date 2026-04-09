from datetime import datetime, date
from pydantic import BaseModel, Field
from typing import List, Optional, Literal


class OrderItem(BaseModel):
    id: str
    name: str
    qty: int = Field(ge=1)
    unit_price: float = Field(ge=0)
    hsn: str = "3924"


class CustomerProfile(BaseModel):
    name: str
    phone: str
    address: str
    payment_type: str = "UPI"
    photo_url: Optional[str] = None


class OrderCreate(BaseModel):
    order_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    status: Literal["Pending", "In-Dispatch", "Delivered"] = "Pending"
    customer: CustomerProfile
    items: List[OrderItem]
    delivery_charge: float = 0


class LedgerEntry(BaseModel):
    date: date = Field(default_factory=date.today)
    amount: float = Field(ge=0)
    note: Optional[str] = ""


class CashSaleEntry(LedgerEntry):
    mode: Literal["Cash"] = "Cash"


class PurchaseBillEntry(LedgerEntry):
    supplier: str
    material: str
    ocr_text: Optional[str] = None
    bill_url: Optional[str] = None


class BankEntry(LedgerEntry):
    transaction_id: str
    kind: Literal["credit", "debit"] = "credit"


class BusinessPulse(BaseModel):
    todays_sales: float
    seven_day_trend: List[dict]
    monthly_growth_percent: float


class OrderStatusCenter(BaseModel):
    pending: int
    in_dispatch: int
    delivered: int


class StockInsight(BaseModel):
    sku: str
    current_stock: int
    status: Literal["Healthy", "Low", "Critical"]
    suggested_restock_qty: int


class UrgencyAlert(BaseModel):
    order_id: str
    customer_name: str
    pending_hours: float
