import math

from sentence_transformers import CrossEncoder

from app.reranking.base import RerankerProvider


class CrossEncoderProvider(RerankerProvider):
    """
    Cross-encoder reranker.

    The dense retriever's bi-encoder embeds the query and each chunk
    *independently*, then compares vectors -- fast, but it can only
    ever approximate true relevance. A cross-encoder instead feeds the
    query and a candidate chunk *together* through one model and
    outputs a single relevance score, which is far more accurate at
    judging whether a specific chunk actually answers a specific
    question.

    That accuracy comes at a cost: O(n) full model forward passes
    instead of one vector comparison. That's exactly why this runs
    *after* retrieval + fusion + dedup, against a small surviving
    candidate pool, rather than replacing retrieval outright.
    """

    def __init__(
        self,
        model_name: str = "cross-encoder/ms-marco-MiniLM-L-6-v2",
    ):
        self.model = CrossEncoder(model_name)

    def score(
        self,
        query: str,
        documents: list[str],
    ) -> list[float]:

        if not documents:
            return []

        pairs = [[query, document] for document in documents]

        raw_scores = self.model.predict(pairs)

        # Cross-encoder logits are unbounded (roughly -10 to 10 for
        # ms-marco models). Squash through a sigmoid so scores land
        # in the same [0, 1] "higher is better" range as every other
        # score in the pipeline (dense cosine similarity, RRF fusion
        # score, ts_rank) -- this keeps ContextOptimizer's min_score
        # filtering meaningful no matter which stage produced the
        # score.
        return [
            1.0 / (1.0 + math.exp(-float(raw)))
            for raw in raw_scores
        ]
