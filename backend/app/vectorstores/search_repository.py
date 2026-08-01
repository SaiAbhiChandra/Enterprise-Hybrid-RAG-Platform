from app.vectorstores.qdrant_service import QdrantService


class SearchRepository:
    """
    Repository responsible for
    vector similarity search.
    """

    def __init__(
        self,
        service: QdrantService,
    ):
        self.service = service

    def search(
        self,
        vector,
        limit=5,
    ):
        return self.service.search(
            vector=vector,
            limit=limit,
        )