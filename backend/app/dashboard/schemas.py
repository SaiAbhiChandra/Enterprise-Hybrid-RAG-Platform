from datetime import datetime
from pydantic import BaseModel


# ----------------------------------------------------
# Statistics
# ----------------------------------------------------

class DashboardStats(BaseModel):
    documents: int
    chunks: int
    conversations: int
    accuracy: float


# ----------------------------------------------------
# Recent Upload
# ----------------------------------------------------

class RecentUpload(BaseModel):
    id: int
    filename: str
    status: str
    file_size: int
    created_at: datetime


# ----------------------------------------------------
# Recent Activity
# ----------------------------------------------------

class RecentActivity(BaseModel):
    title: str
    description: str
    timestamp: datetime


# ----------------------------------------------------
# System Health
# ----------------------------------------------------

class SystemHealth(BaseModel):
    postgres: str
    qdrant: str
    ollama: str
    embedding_model: str


# ----------------------------------------------------
# Dashboard Response
# ----------------------------------------------------

class DashboardResponse(BaseModel):

    stats: DashboardStats

    recent_uploads: list[RecentUpload]

    recent_activity: list[RecentActivity]

    system_health: SystemHealth