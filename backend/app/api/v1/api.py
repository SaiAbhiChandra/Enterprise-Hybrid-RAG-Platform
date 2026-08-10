from fastapi import APIRouter

from app.api.v1.auth import router as auth_router
from app.api.v1.users import router as users_router
from app.api.v1.documents import (
    router as documents_router,
)
from app.chat.router import router as chat_router
from app.api.v1.conversations import (
    router as conversations_router,
)

api_router = APIRouter()

api_router.include_router(auth_router)
api_router.include_router(users_router)
api_router.include_router(
    documents_router
)
api_router.include_router(chat_router)
api_router.include_router(conversations_router)