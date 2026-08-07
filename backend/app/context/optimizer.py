from app.schemas.retrieval import RetrievalResponse


class ContextOptimizer:
    """
    Applies final trimming rules to a retrieval response before it is
    handed to the ContextBuilder.

    This stage is intentionally lightweight (no embeddings, no DB
    calls) — near-duplicate detection lives in ChunkDeduplicator, and
    chunk-stitching lives in ContextMerger. Optimizer's only job is
    enforcing hard limits so a runaway retrieval never blows the LLM's
    context window.
    """

    def __init__(
        self,
        max_chunks: int = 8,
        min_score: float = 0.0,
    ):
        self.max_chunks = max_chunks
        self.min_score = min_score

    def optimize(
        self,
        response: RetrievalResponse,
        max_chunks: int | None = None,
    ) -> RetrievalResponse:

        limit = (
            max_chunks
            if max_chunks is not None
            else self.max_chunks
        )

        chunks = [
            chunk
            for chunk in response.chunks
            if chunk.score >= self.min_score
        ]

        chunks.sort(
            key=lambda chunk: chunk.score,
            reverse=True,
        )

        response.chunks = chunks[:limit]

        return response
