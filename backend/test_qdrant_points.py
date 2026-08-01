from app.vectorstores.qdrant_client import get_qdrant_client
from app.core.config import settings

client = get_qdrant_client()

collection = client.get_collection(
    settings.QDRANT_COLLECTION
)

print(collection)