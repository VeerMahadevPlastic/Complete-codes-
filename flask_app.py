from datetime import datetime, timedelta
from collections import defaultdict
from typing import List, Dict


def _order_total(order: dict) -> float:
    items = order.get("items", [])
    subtotal = sum(float(i.get("qty", 0)) * float(i.get("unit_price", 0)) for i in items)
    return subtotal + float(order.get("delivery_charge", 0))


def business_pulse(orders: List[dict]) -> Dict:
    now = datetime.utcnow()
    today = now.date()
    by_day = defaultdict(float)
    for order in orders:
        created_raw = order.get("created_at") or order.get("updated_at")
        try:
            created_at = datetime.fromisoformat(str(created_raw).replace("Z", "+00:00"))
        except Exception:
            continue
        by_day[created_at.date()] += _order_total(order)

    todays_sales = by_day.get(today, 0.0)
    seven_day_trend = []
    for i in range(6, -1, -1):
        d = today - timedelta(days=i)
        seven_day_trend.append({"date": d.isoformat(), "sales": round(by_day.get(d, 0.0), 2)})

    current_month = today.replace(day=1)
    prev_month_end = current_month - timedelta(days=1)
    prev_month = prev_month_end.replace(day=1)

    current_sales = sum(v for k, v in by_day.items() if k >= current_month)
    prev_sales = sum(v for k, v in by_day.items() if prev_month <= k <= prev_month_end)
    growth = ((current_sales - prev_sales) / prev_sales * 100) if prev_sales > 0 else (100.0 if current_sales > 0 else 0.0)

    return {
        "todays_sales": round(todays_sales, 2),
        "seven_day_trend": seven_day_trend,
        "monthly_growth_percent": round(growth, 2),
    }


def order_status_center(orders: List[dict]) -> Dict:
    status_map = {"pending": 0, "in_dispatch": 0, "delivered": 0}
    for order in orders:
        st = str(order.get("status", "Pending")).strip().lower()
        if st == "pending":
            status_map["pending"] += 1
        elif st in {"in-dispatch", "in dispatch"}:
            status_map["in_dispatch"] += 1
        elif st == "delivered":
            status_map["delivered"] += 1
    return status_map
