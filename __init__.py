# Basic Sales Logic for VMP Accounts
def calculate_daily_summary(sales_list):
    total = sum(item['amount'] for item in sales_list)
    pending = len([s for s in sales_list if s['status'] == 'Pending'])
    return {
        "today_sales": total,
        "pending_orders": pending,
        "msg": "Bhai, aaj ka kaam ekdum set hai!"
    }

# Ye code aapke Daybook (Ref: image_e31b68.png) ka base banega.
