from abc import ABC, abstractmethod


class EmbeddingProvider(ABC):
    """
    Base interface for embedding providers.
    """

    @abstractmethod
    def embed_text(self, text: str) -> list[float]:
        """
        Generate an embedding for a single text.
        """
        pass

    @abstractmethod
    def embed_batch(
        self,
        texts: list[str],
    ) -> list[list[float]]:
        """
        Generate embeddings for multiple texts.
        """
        pass