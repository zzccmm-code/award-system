"""Simple in-memory progress tracker for long-running tasks."""

import threading
import uuid
from datetime import datetime

_store: dict[str, dict] = {}
_lock = threading.Lock()


def create_task() -> str:
    tid = str(uuid.uuid4())[:8]
    with _lock:
        _store[tid] = {"status": "pending", "current": 0, "total": 0, "message": "", "result": None, "created_at": datetime.now().isoformat()}
    return tid


def update(tid: str, current: int, total: int, message: str = ""):
    with _lock:
        if tid in _store:
            _store[tid].update({"status": "processing", "current": current, "total": total, "message": message})


def complete(tid: str, result: dict | None = None):
    with _lock:
        if tid in _store:
            _store[tid].update({"status": "completed", "message": "完成", "result": result})


def fail(tid: str, error: str):
    with _lock:
        if tid in _store:
            _store[tid].update({"status": "failed", "message": error})


def get(tid: str) -> dict:
    with _lock:
        return _store.get(tid, {"status": "not_found"})


def cleanup(tid: str):
    with _lock:
        _store.pop(tid, None)
