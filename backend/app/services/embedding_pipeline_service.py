from sqlalchemy.orm import Session

from app.embeddings.embedding_service import EmbeddingService
from app.models.chunk import Chunk
from app.repositories.chunk_repository import ChunkRepository
from app.vectorstores.qdrant_service import QdrantService


class EmbeddingPipelineService:
    """
    Handles automatic embedding generation and vector indexing.
    """

    def __init__(
        self,
        chunk_repository: ChunkRepository,
        embedding_service: EmbeddingService,
        vector_store: QdrantService,
    ):
        self.chunk_repository = chunk_repository
        self.embedding_service = embedding_service
        self.vector_store = vector_store

    def index_document(
        self,
        db: Session,
        document_id: int,
    ) -> None:

        chunks = self.chunk_repository.get_by_document_id(
            db=db,
            document_id=document_id,
        )

        if not chunks:
            return

        texts = [chunk.text for chunk in chunks]

        vectors = self.embedding_service.generate_embeddings(
            texts,
        )

        ids = []
        payloads = []

        for chunk in chunks:

            ids.append(chunk.id)

            payloads.append(
                {
                    "chunk_id": chunk.id,
                    "document_id": chunk.document_id,
                    "owner_id": chunk.owner_id,
                    "chunk_index": chunk.chunk_index,
                    "text": chunk.text,
                }
            )

        self.vector_store.upsert(
            ids=ids,
            vectors=vectors,
            payloads=payloads,
        )