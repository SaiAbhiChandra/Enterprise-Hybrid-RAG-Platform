from app.embeddings.embedding_service import EmbeddingService
from app.vectorstores.search_repository import SearchRepository

from app.schemas.retrieval import (
    RetrievalResponse,
    RetrievedChunk,
)

class Retriever:
    """
    Enterprise semantic retriever.

    Responsibilities:
        1. Embed user query
        2. Search Qdrant
        3. Return most relevant chunks
    """

    def __init__(
        self,
        embedding_service: EmbeddingService,
        search_repository: SearchRepository,
    ):
        self.embedding_service = embedding_service
        self.search_repository = search_repository

    def retrieve(
        self,
        query: str,
        top_k: int = 5,
    ) -> RetrievalResponse:

        query_vector = self.embedding_service.generate_embedding(
            query,
        )

        results = self.search_repository.search(
            vector=query_vector,
            limit=top_k,
        )

        chunks = []

        for result in results:

            payload = result.payload

            chunks.append(

                RetrievedChunk(
                    chunk_id=payload["chunk_id"],
                    document_id=payload["document_id"],
                    chunk_index=payload["chunk_index"],
                    score=result.score,
                    text=payload["text"],
                )

            )

        return RetrievalResponse(
            query=query,
            chunks=chunks,
        )