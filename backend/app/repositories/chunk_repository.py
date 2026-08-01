from sqlalchemy.orm import Session

from app.models.chunk import Chunk
from app.repositories.base_repository import BaseRepository


class ChunkRepository(BaseRepository[Chunk]):
    """
    Repository for Chunk database operations.
    """

    def __init__(self):
        super().__init__(Chunk)

    def create_chunk(
        self,
        db: Session,
        chunk: Chunk,
    ) -> Chunk:

        db.add(chunk)
        db.flush()
        db.refresh(chunk)

        return chunk

    def create_many(
        self,
        db: Session,
        chunks: list[Chunk],
    ) -> list[Chunk]:

        db.add_all(chunks)
        db.flush()

        for chunk in chunks:
            db.refresh(chunk)

        return chunks
    
    def get_by_document_id(
        self,
        db: Session,
        document_id: int,
    ) -> list[Chunk]:

        return (
            db.query(Chunk)
            .filter(
                Chunk.document_id == document_id
            )
            .order_by(
                Chunk.chunk_index
            )
            .all()
        )