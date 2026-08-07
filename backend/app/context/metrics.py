import logging
import time
from dataclasses import dataclass, field

from app.schemas.retrieval import RetrievalResponse

logger = logging.getLogger("ehrp.retrieval")


@dataclass
class RetrievalMetrics:
    """
    Observability snapshot for a single retrieval call.

    This is deliberately a plain dataclass (not a Pydantic schema) --
    it's an internal, in-process measurement, not an API response
    contract. Once this project is running for real users, this is
    the object you plug into Prometheus/structured logging to answer
    "why did retrieval feel slow/bad for this query" after the fact.
    """

    query: str
    chunk_count: int
    latency_ms: float
    avg_score: float
    max_score: float
    min_score: float
    stages: dict[str, float] = field(default_factory=dict)

    def log(self) -> None:
        logger.info(
            "retrieval query=%r chunks=%d latency_ms=%.1f "
            "avg_score=%.4f max_score=%.4f min_score=%.4f stages=%s",
            self.query,
            self.chunk_count,
            self.latency_ms,
            self.avg_score,
            self.max_score,
            self.min_score,
            self.stages,
        )


class RetrievalTimer:
    """
    Small helper for timing named stages of the retrieval pipeline
    (retrieve / dedupe / merge / optimize) without littering the
    service code with manual time.perf_counter() bookkeeping.

    Usage:
        timer = RetrievalTimer()
        with timer.stage("retrieve"):
            ...
        with timer.stage("dedupe"):
            ...
        metrics = timer.build_metrics(response, query)
    """

    def __init__(self):
        self._stages: dict[str, float] = {}
        self._start = time.perf_counter()

    def stage(self, name: str) -> "_StageContext":
        return _StageContext(self, name)

    def _record(self, name: str, elapsed_ms: float) -> None:
        self._stages[name] = elapsed_ms

    def build_metrics(
        self,
        response: RetrievalResponse,
        query: str,
    ) -> RetrievalMetrics:

        scores = [chunk.score for chunk in response.chunks]

        total_latency_ms = (
            time.perf_counter() - self._start
        ) * 1000

        return RetrievalMetrics(
            query=query,
            chunk_count=len(response.chunks),
            latency_ms=total_latency_ms,
            avg_score=(sum(scores) / len(scores)) if scores else 0.0,
            max_score=max(scores) if scores else 0.0,
            min_score=min(scores) if scores else 0.0,
            stages=self._stages,
        )


class _StageContext:
    def __init__(self, timer: RetrievalTimer, name: str):
        self.timer = timer
        self.name = name
        self._start = 0.0

    def __enter__(self):
        self._start = time.perf_counter()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        elapsed_ms = (time.perf_counter() - self._start) * 1000
        self.timer._record(self.name, elapsed_ms)
        return False
