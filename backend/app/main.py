from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import app.db.models  # noqa: F401

from app.api.home import router as home_router
from app.api.v1.api import api_router

from app.core.config import settings

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Enterprise Hybrid RAG Platform",
)

# ---------------------------------------
# CORS
# ---------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------
# Routes
# ---------------------------------------

app.include_router(home_router)

app.include_router(
    api_router,
    prefix="/api/v1",
)