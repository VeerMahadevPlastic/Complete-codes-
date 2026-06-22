from datetime import datetime
from typing import List, Dict


def stock_insights(inventory_rows: List[dict]) -> List[Dict]:
    insights = []
    for row in inventory_rows:
        stock = int(row.get("current_stock", row.get("stock", 0)))
        sku = row.get("id") or row.get("sku") or "unknown"
        if stock <= 20:
            status = "Critical"
            restock = max(100 - stock, 50)
        elif stock <= 75:
            status = "Low"
            restock = max(150 - stock, 60)
        else:
            status = "Healthy"
            restock = 0
        insights.append({
            "sku": sku,
            "current_stock": stock,
            "status": status,
            "suggested_restock_qty": restock,
        })
    return insights


def urgency_alerts(orders: List[dict]) -> List[Dict]:
    now = datetime.utcnow()
    alerts = []
    for order in orders:
        status = str(order.get("status", "Pending")).lower()
        if status != "pending":
            continue
        created_raw = order.get("created_at") or order.get("updated_at")
        try:
            created_at = datetime.fromisoformat(str(created_raw).replace("Z", "+00:00"))
        except Exception:
            continue
        delta_hours = (now - created_at.replace(tzinfo=None)).total_seconds() / 3600
        if delta_hours > 24:
            customer = order.get("customer", {})
            alerts.append({
                "order_id": order.get("order_id", order.get("id", "-")),
                "customer_name": customer.get("name", "Unknown"),
                "pending_hours": round(delta_hours, 2),
            })
    return alerts
