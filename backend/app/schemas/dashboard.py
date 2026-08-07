from datetime import datetime

from pydantic import BaseModel


# -----------------------------------------
# Statistics
# -----------------------------------------

class DashboardStats(BaseModel):

    documents: int

    chunks: int

    conversations: int

    accuracy: float


# -----------------------------------------
# Recent Upload
# -----------------------------------------

class RecentUpload(BaseModel):

    id: int

    filename: str

    status: str

    size: int

    created_at: datetime

    class Config:

        from_attributes = True


# -----------------------------------------
# Recent Activity
# -----------------------------------------

class RecentActivity(BaseModel):

    title: str

    description: str

    created_at: datetime

    type: str


# -----------------------------------------
# Health
# -----------------------------------------

class HealthItem(BaseModel):

    name: str

    status: str


# -----------------------------------------
# Response
# -----------------------------------------

class DashboardResponse(BaseModel):

    stats: DashboardStats

    recent_uploads: list[RecentUpload]

    recent_activity: list[RecentActivity]

    system_health: list[HealthItem]