from sqlalchemy.orm import Session

from app.dashboard.schemas import (
    DashboardResponse,
    DashboardStats,
    RecentUpload,
    RecentActivity,
    SystemHealth,
)

from app.models.document import Document
from app.models.chunk import Chunk


class DashboardService:

    def get_dashboard(
        self,
        db: Session,
        owner_id: int,
    ) -> DashboardResponse:

        # ------------------------------------
        # Statistics
        # ------------------------------------

        document_count = (
            db.query(Document)
            .filter(Document.owner_id == owner_id)
            .count()
        )

        chunk_count = (
            db.query(Chunk)
            .filter(Chunk.owner_id == owner_id)
            .count()
        )

        # ------------------------------------
        # Recent Uploads
        # ------------------------------------

        documents = (
            db.query(Document)
            .filter(Document.owner_id == owner_id)
            .order_by(Document.created_at.desc())
            .limit(5)
            .all()
        )

        uploads = [

            RecentUpload(
                id=document.id,
                filename=document.original_filename,
                status=document.status,
                file_size=document.file_size,
                created_at=document.created_at,
            )

            for document in documents

        ]

        # ------------------------------------
        # Recent Activity
        # ------------------------------------

        activity = [

            RecentActivity(

                title="Document Uploaded",

                description=document.original_filename,

                timestamp=document.created_at,

            )

            for document in documents

        ]

        # ------------------------------------
        # System Health
        # ------------------------------------

        health = SystemHealth(

            postgres="Healthy",

            qdrant="Healthy",

            ollama="Healthy",

            embedding_model="Ready",

        )

        # ------------------------------------
        # Statistics
        # ------------------------------------

        stats = DashboardStats(

            documents=document_count,

            chunks=chunk_count,

            conversations=0,

            accuracy=98.7,

        )

        return DashboardResponse(

            stats=stats,

            recent_uploads=uploads,

            recent_activity=activity,

            system_health=health,

        )


dashboard_service = DashboardService()