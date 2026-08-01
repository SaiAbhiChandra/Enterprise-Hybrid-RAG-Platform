from app.core.config import settings
from app.vectorstores.qdrant_client import get_qdrant_client

client = get_qdrant_client()

points, _ = client.scroll(
    collection_name=settings.QDRANT_COLLECTION,
    limit=5,
    with_payload=True,
    with_vectors=False,
)

for point in points:
    print("=" * 80)
    print("Point ID:", point.id)
    print("Payload:", point.payload)