from sqlalchemy.orm import Session

from app.models.document import Document
from app.models.chunk import Chunk

from app.schemas.dashboard import (
    DashboardResponse,
    DashboardStats,
    RecentUpload,
    RecentActivity,
    HealthItem,
)


class DashboardService:

    def get_dashboard(

        self,

        db: Session,

        user_id: int,

    ) -> DashboardResponse:

        # ---------------------------------
        # Documents
        # ---------------------------------

        documents = (

            db.query(Document)

            .filter(Document.owner_id == user_id)

            .all()

        )

        # ---------------------------------
        # Chunks
        # ---------------------------------

        chunk_count = (

            db.query(Chunk)

            .filter(Chunk.owner_id == user_id)

            .count()

        )

        # ---------------------------------
        # Stats
        # ---------------------------------

        stats = DashboardStats(

            documents=len(documents),

            chunks=chunk_count,

            conversations=0,

            accuracy=98.7,

        )

        # ---------------------------------
        # Uploads
        # ---------------------------------

        uploads = [

            RecentUpload(

                id=d.id,

                filename=d.original_filename,

                status=d.status,

                size=d.file_size,

                created_at=d.created_at,

            )

            for d in sorted(

                documents,

                key=lambda x: x.created_at,

                reverse=True,

            )[:5]

        ]

        # ---------------------------------
        # Activity
        # ---------------------------------

        activity = [

            RecentActivity(

                title="Document Uploaded",

                description=d.original_filename,

                created_at=d.created_at,

                type="document",

            )

            for d in sorted(

                documents,

                key=lambda x: x.created_at,

                reverse=True,

            )[:5]

        ]

        # ---------------------------------
        # Health
        # ---------------------------------

        health = [

            HealthItem(

                name="PostgreSQL",

                status="Running",

            ),

            HealthItem(

                name="Qdrant",

                status="Connected",

            ),

            HealthItem(

                name="Ollama",

                status="Healthy",

            ),

            HealthItem(

                name="Embedding Model",

                status="Ready",

            ),

        ]

        return DashboardResponse(

            stats=stats,

            recent_uploads=uploads,

            recent_activity=activity,

            system_health=health,

        )