from sqlalchemy.orm import Session

from app.context.deduplicator import ChunkDeduplicator
from app.context.merger import ContextMerger
from app.context.metrics import RetrievalTimer
from app.context.optimizer import ContextOptimizer
from app.reranking.reranker_service import RerankerService
from app.retrieval.retriever import Retriever
from app.retrieval.sparse_retriever import SparseRetriever
from app.schemas.retrieval import RetrievalResponse


class RetrievalService:
    """
    Orchestrates the full hybrid retrieval pipeline:

        1. Retrieve  -- run dense (Qdrant embedding) and sparse
                         (Postgres full-text) retrieval in parallel,
                         each pulling `candidate_k` candidates
        2. Merge     -- fuse both ranked lists via Reciprocal Rank
                         Fusion (RRF)
        3. Deduplicate -- drop exact/near-duplicate chunks
        4. Rerank    -- run a cross-encoder over the surviving
                         candidates for a true relevance score
        5. Optimize  -- trim down to the final `top_k` chunks that
                         actually go into the LLM prompt
        6. Metrics   -- measure and log the whole call

    The candidate pool (`candidate_k`) is intentionally wider than the
    final chunk count (`top_k`): retrieval is cheap and imprecise,
    reranking is expensive and precise, so the pipeline casts a wide
    net first and lets the cross-encoder decide what actually survives
    into the prompt.

    ChatService depends only on this service, never on the individual
    retrievers/reranker -- that's what has let each day's work
    (hybrid retrieval, reranking) slot in here without touching chat
    orchestration, prompt building, or the LLM layer at all.
    """

    def __init__(
        self,
        retriever: Retriever,
        sparse_retriever: SparseRetriever,
        merger: ContextMerger,
        deduplicator: ChunkDeduplicator,
        reranker: RerankerService,
        optimizer: ContextOptimizer,
    ):
        self.retriever = retriever
        self.sparse_retriever = sparse_retriever
        self.merger = merger
        self.deduplicator = deduplicator
        self.reranker = reranker
        self.optimizer = optimizer

    def retrieve(
        self,
        db: Session,
        query: str,
        candidate_k: int = 15,
        top_k: int = 5,
    ) -> RetrievalResponse:

        timer = RetrievalTimer()

        with timer.stage("retrieve_dense"):
            dense_response = self.retriever.retrieve(
                query=query,
                top_k=candidate_k,
            )

        with timer.stage("retrieve_sparse"):
            sparse_response = self.sparse_retriever.retrieve(
                db=db,
                query=query,
                top_k=candidate_k,
            )

        with timer.stage("merge"):
            merged = self.merger.merge(
                [dense_response, sparse_response]
            )

        with timer.stage("deduplicate"):
            deduplicated = self.deduplicator.deduplicate(merged)

        with timer.stage("rerank"):
            reranked = self.reranker.rerank(deduplicated)

        with timer.stage("optimize"):
            optimized = self.optimizer.optimize(
                reranked,
                max_chunks=top_k,
            )

        timer.build_metrics(optimized, query).log()

        return optimized
