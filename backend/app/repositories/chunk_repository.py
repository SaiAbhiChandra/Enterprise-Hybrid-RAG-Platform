from sqlalchemy import desc, func, select
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

    def search_fulltext(
        self,
        db: Session,
        query: str,
        limit: int = 5,
    ) -> list[tuple[Chunk, float]]:
        """
        Keyword/lexical search over chunk text using Postgres full-text
        search. Backs the sparse half of hybrid retrieval.

        `websearch_to_tsquery` is used (rather than `plainto_tsquery`)
        because it tolerates raw, unsanitized user input -- quotes,
        "OR", "-exclude" -- the same way a search engine query box
        does, instead of raising on malformed syntax.

        Returns (Chunk, rank) tuples so the caller can decide how to
        use the rank -- we deliberately don't attach it to the Chunk
        model, since rank is a property of *this query*, not of the
        chunk itself.
        """

        ts_query = func.websearch_to_tsquery("english", query)
        rank = func.ts_rank_cd(Chunk.search_vector, ts_query).label(
            "rank"
        )

        statement = (
            select(Chunk, rank)
            .where(Chunk.search_vector.op("@@")(ts_query))
            .order_by(desc(rank))
            .limit(limit)
        )

        return list(db.execute(statement).all())