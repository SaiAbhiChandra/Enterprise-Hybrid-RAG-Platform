from abc import ABC, abstractmethod


class RerankerProvider(ABC):
    """
    Base interface for reranking providers.
    """

    @abstractmethod
    def score(
        self,
        query: str,
        documents: list[str],
    ) -> list[float]:
        """
        Return a relevance score for each document, in the same order
        as `documents`. Higher = more relevant.
        """
        pass
