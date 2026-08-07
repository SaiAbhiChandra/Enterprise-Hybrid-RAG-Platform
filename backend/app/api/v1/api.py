from fastapi import APIRouter

from app.api.v1.auth import router as auth_router
from app.api.v1.users import router as users_router
from app.api.v1.documents import router as documents_router

from app.chat.router import router as chat_router

from app.dashboard.router import (
    router as dashboard_router,
)

from app.api.v1.dashboard import router as dashboard_router

api_router = APIRouter()


# -----------------------------
# Authentication
# -----------------------------

api_router.include_router(auth_router)


# -----------------------------
# Users
# -----------------------------

api_router.include_router(users_router)


# -----------------------------
# Documents
# -----------------------------

api_router.include_router(
    documents_router,
)


# -----------------------------
# Chat
# -----------------------------

api_router.include_router(
    chat_router,
)


# -----------------------------
# Dashboard
# -----------------------------

api_router.include_router(
    dashboard_router,
)