from qdrant_client.models import (
    Distance,
    PointStruct,
    VectorParams,
)

from app.core.config import settings
from app.vectorstores.base import VectorStoreProvider
from app.vectorstores.qdrant_client import (
    get_qdrant_client,
)


class QdrantProvider(VectorStoreProvider):

    def __init__(self):

        self.client = get_qdrant_client()

        self.collection = settings.QDRANT_COLLECTION

    def create_collection(self):

        collections = self.client.get_collections().collections

        names = [c.name for c in collections]

        if self.collection in names:
            return

        self.client.create_collection(
            collection_name=self.collection,
            vectors_config=VectorParams(
                size=settings.EMBEDDING_DIMENSION,
                distance=Distance.COSINE,
            ),
        )

    def upsert(
        self,
        ids,
        vectors,
        payloads,
    ):

        points = []

        for idx, vector, payload in zip(
            ids,
            vectors,
            payloads,
        ):
            points.append(
                PointStruct(
                    id=idx,
                    vector=vector,
                    payload=payload,
                )
            )

        self.client.upsert(
            collection_name=self.collection,
            points=points,
        )

    def search(
        self,
        vector,
        limit=5,
    ):

        return self.client.search(
            collection_name=self.collection,
            query_vector=vector,
            limit=limit,
        )

    def delete(
        self,
        ids,
    ):

        self.client.delete(
            collection_name=self.collection,
            points_selector=ids,
        )