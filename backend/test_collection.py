from app.vectorstores.qdrant_provider import (
    QdrantProvider,
)
from app.vectorstores.qdrant_service import (
    QdrantService,
)

service = QdrantService(
    QdrantProvider(),
)

service.initialize()

print("Collection Ready")