import os
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

from .database import init_db
from .api import awards, auth

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Award Management API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(awards.router)
app.include_router(auth.router)


@app.on_event("startup")
def on_startup():
    init_db()
    from .database import SessionLocal
    from .models import User
    from .auth import hash_password
    db = SessionLocal()
    try:
        if db.query(User).count() == 0:
            admin = User(
                username="admin",
                hashed_password=hash_password("admin123"),
                display_name="系统管理员",
                is_active=1,
            )
            db.add(admin)
            db.commit()
            logger.info("Created default admin user (admin / admin123)")
    finally:
        db.close()


@app.get("/health")
def health_check():
    return {"status": "ok"}



# Production: serve built React app from static/
STATIC_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static")
_has_frontend = os.path.isdir(STATIC_DIR) and os.path.isfile(os.path.join(STATIC_DIR, "index.html"))
if _has_frontend:
    @app.get("/")
    async def serve_index():
        return FileResponse(os.path.join(STATIC_DIR, "index.html"))

    @app.get("/{full_path:path}")
    async def serve_static(full_path: str):
        fp = os.path.join(STATIC_DIR, full_path)
        if os.path.isfile(fp):
            return FileResponse(fp)
        return FileResponse(os.path.join(STATIC_DIR, "index.html"))

    logger.info("Production mode: serving frontend from static/")
