from fastapi import APIRouter

router = APIRouter()


@router.get("/")
def home():
    return {
        "message": "Welcome to Enterprise Hybrid RAG Platform 🚀",
        "status": "running",
        "version": "1.0.0"
    }