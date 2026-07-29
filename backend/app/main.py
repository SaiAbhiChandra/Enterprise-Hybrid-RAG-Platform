from fastapi import FastAPI

from app.api.home import router as home_router


app = FastAPI(
    title="Enterprise Hybrid RAG Platform",
    version="1.0.0",
    description="AI-powered Enterprise Hybrid RAG Platform"
)

app.include_router(home_router)