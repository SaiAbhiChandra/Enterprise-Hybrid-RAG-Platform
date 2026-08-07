from app.reranking.base import RerankerProvider
from app.schemas.retrieval import RetrievalResponse


class RerankerService:
    """
    Reorders a retrieval response's chunks by true query-relevance,
    using a cross-encoder.

    Runs after retrieval + fusion + dedup, on the small surviving
    candidate pool -- reranking every chunk in the vector store would
    be far too slow to run per-request.
    """

    def __init__(self, provider: RerankerProvider):
        self.provider = provider

    def rerank(
        self,
        response: RetrievalResponse,
    ) -> RetrievalResponse:

        if not response.chunks:
            return response

        texts = [chunk.text for chunk in response.chunks]

        scores = self.provider.score(
            query=response.query,
            documents=texts,
        )

        rescored = [
            chunk.model_copy(update={"score": score})
            for chunk, score in zip(response.chunks, scores)
        ]

        rescored.sort(key=lambda chunk: chunk.score, reverse=True)

        response.chunks = rescored

        return response
