from sqlalchemy.orm import Session

from app.repositories.chunk_repository import ChunkRepository
from app.schemas.retrieval import RetrievalResponse, RetrievedChunk


class SparseRetriever:
    """
    Keyword/lexical retriever backed by PostgreSQL full-text search.

    This is the "sparse" half of hybrid retrieval, complementing the
    dense (embedding) Retriever. It exists to catch the classic
    hybrid-search failure mode: a user searches for an exact term --
    an invoice number, an acronym, a rare proper noun -- and dense
    embedding similarity returns documents that are semantically
    *close* but miss the literal match, while full-text search finds
    it directly.

    Deliberately backed by Postgres's tsvector/GIN index rather than
    an in-memory BM25 library (e.g. rank_bm25): it scales with the
    document set without rebuilding an index in application memory on
    every request, and it's already part of this project's existing
    infrastructure.
    """

    def __init__(self, chunk_repository: ChunkRepository):
        self.chunk_repository = chunk_repository

    def retrieve(
        self,
        db: Session,
        query: str,
        top_k: int = 5,
    ) -> RetrievalResponse:

        results = self.chunk_repository.search_fulltext(
            db=db,
            query=query,
            limit=top_k,
        )

        chunks = [
            RetrievedChunk(
                chunk_id=chunk.id,
                document_id=chunk.document_id,
                chunk_index=chunk.chunk_index,
                score=float(rank),
                text=chunk.text,
            )
            for chunk, rank in results
        ]

        return RetrievalResponse(query=query, chunks=chunks)
