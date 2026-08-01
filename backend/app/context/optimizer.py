from app.retrieval.models import RetrievalResult


class ContextOptimizer:
    """
    Optimizes retrieved chunks before prompt creation.
    """

    def optimize(
        self,
        retrieval: RetrievalResult,
    ) -> RetrievalResult:

        optimized = []

        seen = set()

        for chunk in retrieval.chunks:

            text = chunk.text.strip()

            if text in seen:
                continue

            seen.add(text)

            optimized.append(chunk)

        retrieval.chunks = optimized

        return retrieval