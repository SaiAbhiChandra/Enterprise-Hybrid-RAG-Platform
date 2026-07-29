from fastapi import APIRouter

from app.core.config import settings

router = APIRouter()


@router.get("/")
def home():
    return {
        "application": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "debug": settings.DEBUG,
        "message": "Welcome to Enterprise Hybrid RAG Platform 🚀"
    }