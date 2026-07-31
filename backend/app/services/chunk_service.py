from sqlalchemy.orm import Session

from app.models.chunk import Chunk
from app.repositories.chunk_repository import ChunkRepository
from app.schemas.chunk import Chunk as ChunkSchema


class ChunkService:
    """
    Service responsible for persisting chunks.
    """

    def __init__(self, repository: ChunkRepository):
        self.repository = repository

    def save_chunks(
        self,
        db: Session,
        chunks: list[ChunkSchema],
        document_id: int,
        owner_id: int,
    ) -> list[Chunk]:

        db_chunks: list[Chunk] = []

        for chunk in chunks:
            db_chunks.append(
                Chunk(
                    document_id=document_id,
                    owner_id=owner_id,
                    chunk_index=chunk.chunk_index,
                    text=chunk.text,
                    start_char=chunk.start_char,
                    end_char=chunk.end_char,
                    token_count=len(chunk.text.split()),
                )
            )

        return self.repository.create_many(
            db=db,
            chunks=db_chunks,
        )