from app.schemas.retrieval import RetrievalResponse, RetrievedChunk


class ContextMerger:
    """
    Merges multiple ranked retrieval result sets into a single ranked
    list using Reciprocal Rank Fusion (RRF).

    RRF is used (instead of normalizing and summing raw scores)
    because dense similarity scores and sparse/keyword scores live on
    completely different scales and are not directly comparable. RRF
    only looks at each chunk's *rank* within its own result set, which
    makes it robust to that mismatch -- this is the standard technique
    used to fuse dense + sparse retrieval in production hybrid search
    systems.

    Currently only the dense retriever feeds this merger, so it is
    called with a single result set (a no-op fusion). It is wired this
    way from the start so that adding the sparse/BM25 retriever later
    is a one-line change in RetrievalService, not a rewrite of the
    merge logic.
    """

    def __init__(self, rrf_k: int = 60):
        self.rrf_k = rrf_k

    def merge(
        self,
        responses: list[RetrievalResponse],
    ) -> RetrievalResponse:

        if not responses:
            return RetrievalResponse(query="", chunks=[])

        if len(responses) == 1:
            return responses[0]

        query = responses[0].query

        fused_scores: dict[int, float] = {}
        chunk_lookup: dict[int, RetrievedChunk] = {}

        for response in responses:

            for rank, chunk in enumerate(response.chunks):

                rrf_contribution = 1.0 / (self.rrf_k + rank + 1)

                fused_scores[chunk.chunk_id] = (
                    fused_scores.get(chunk.chunk_id, 0.0)
                    + rrf_contribution
                )

                # Keep the highest-confidence copy of the chunk's
                # own metadata/text if it appears in multiple sets.
                existing = chunk_lookup.get(chunk.chunk_id)

                if existing is None or chunk.score > existing.score:
                    chunk_lookup[chunk.chunk_id] = chunk

        merged_chunks = sorted(
            chunk_lookup.values(),
            key=lambda chunk: fused_scores[chunk.chunk_id],
            reverse=True,
        )

        # Replace each chunk's score with its fused RRF score so
        # downstream stages (optimizer, context builder) see a score
        # that reflects the *combined* ranking, not just one source.
        rescored_chunks = [
            chunk.model_copy(
                update={"score": fused_scores[chunk.chunk_id]}
            )
            for chunk in merged_chunks
        ]

        return RetrievalResponse(query=query, chunks=rescored_chunks)
