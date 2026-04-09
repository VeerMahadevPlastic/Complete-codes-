from datetime import datetime
from typing import List, Dict, Any

try:
    import firebase_admin
    from firebase_admin import credentials, firestore
except Exception:  # pragma: no cover
    firebase_admin = None
    credentials = None
    firestore = None


class FirebaseRepository:
    """Firestore repository with in-memory fallback for local/dev usage."""

    def __init__(self) -> None:
        self._db = None
        self._memory: Dict[str, List[dict]] = {
            "orders": [],
            "cash_sales": [],
            "purchase_bills": [],
            "bank_entries": [],
            "inventory": [],
        }
        if firebase_admin and firestore:
            try:
                if not firebase_admin._apps:
                    firebase_admin.initialize_app()
                self._db = firestore.client()
            except Exception:
                self._db = None

    @property
    def using_firestore(self) -> bool:
        return self._db is not None

    def add(self, collection: str, payload: Dict[str, Any]) -> None:
        payload = {**payload, "updated_at": datetime.utcnow().isoformat()}
        if self._db:
            self._db.collection(collection).add(payload)
            return
        self._memory.setdefault(collection, []).append(payload)

    def set_doc(self, collection: str, doc_id: str, payload: Dict[str, Any]) -> None:
        payload = {**payload, "updated_at": datetime.utcnow().isoformat()}
        if self._db:
            self._db.collection(collection).document(doc_id).set(payload, merge=True)
            return
        rows = self._memory.setdefault(collection, [])
        rows[:] = [r for r in rows if r.get("id") != doc_id and r.get("order_id") != doc_id]
        rows.append(payload)

    def list(self, collection: str) -> List[dict]:
        if self._db:
            docs = self._db.collection(collection).stream()
            return [{"id": d.id, **d.to_dict()} for d in docs]
        return list(self._memory.get(collection, []))
