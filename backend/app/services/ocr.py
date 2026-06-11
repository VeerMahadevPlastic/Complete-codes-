from typing import Optional


def extract_bill_text(file_bytes: bytes) -> Optional[str]:
    try:
        import pytesseract
        from PIL import Image
        from io import BytesIO

        image = Image.open(BytesIO(file_bytes))
        text = pytesseract.image_to_string(image)
        return text.strip() or None
    except Exception:
        return None
