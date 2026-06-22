from io import BytesIO
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas


def generate_gst_invoice_pdf(order: dict, company: str, gst_number: str, phone: str) -> bytes:
    buffer = BytesIO()
    pdf = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4

    pdf.setFont("Helvetica-Bold", 18)
    pdf.drawString(40, height - 40, company)
    pdf.setFont("Helvetica-Bold", 14)
    pdf.drawRightString(width - 40, height - 40, "GST INVOICE")

    pdf.setFont("Helvetica", 10)
    pdf.drawString(40, height - 60, f"GSTIN: {gst_number}")
    pdf.drawString(40, height - 75, f"Phone: {phone}")

    pdf.drawString(40, height - 95, f"Invoice No: {order.get('order_id', '-')}")
    pdf.drawString(40, height - 110, f"Date: {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')}")

    customer = order.get("customer", {})
    pdf.drawString(40, height - 135, f"Customer: {customer.get('name', '-')}")
    pdf.drawString(40, height - 150, f"Phone: {customer.get('phone', '-')}")
    pdf.drawString(40, height - 165, f"Address: {customer.get('address', '-')}")

    y = height - 200
    pdf.setFont("Helvetica-Bold", 10)
    pdf.drawString(40, y, "Item")
    pdf.drawRightString(360, y, "Qty")
    pdf.drawRightString(440, y, "Unit")
    pdf.drawRightString(width - 40, y, "Total")
    y -= 16

    subtotal = 0.0
    pdf.setFont("Helvetica", 10)
    for item in order.get("items", []):
        qty = float(item.get("qty", 0))
        unit = float(item.get("unit_price", 0))
        total = qty * unit
        subtotal += total
        pdf.drawString(40, y, str(item.get("name", "-"))[:45])
        pdf.drawRightString(360, y, f"{qty:.0f}")
        pdf.drawRightString(440, y, f"{unit:.2f}")
        pdf.drawRightString(width - 40, y, f"{total:.2f}")
        y -= 14
        if y < 120:
            pdf.showPage()
            y = height - 60

    gst = 0.0
    delivery = float(order.get("delivery_charge", 0))
    grand_total = subtotal + gst + delivery

    y -= 10
    pdf.setFont("Helvetica-Bold", 10)
    pdf.drawRightString(width - 40, y, f"Subtotal: {subtotal:.2f}")
    y -= 14
    pdf.drawRightString(width - 40, y, f"GST (0%): {gst:.2f}")
    y -= 14
    pdf.drawRightString(width - 40, y, f"Delivery: {delivery:.2f}")
    y -= 16
    pdf.setFont("Helvetica-Bold", 12)
    pdf.drawRightString(width - 40, y, f"Grand Total: {grand_total:.2f}")

    pdf.setFont("Helvetica", 9)
    pdf.drawString(40, 50, "Composition scheme: tax collected as per applicable local rules.")

    pdf.save()
    return buffer.getvalue()
