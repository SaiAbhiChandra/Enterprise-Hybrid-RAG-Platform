from app.embeddings.base import EmbeddingProvider


class EmbeddingService:

    def __init__(
        self,
        provider: EmbeddingProvider,
    ):
        self.provider = provider

    def generate_embedding(
        self,
        text: str,
    ) -> list[float]:

        return self.provider.embed_text(text)

    def generate_embeddings(
        self,
        texts: list[str],
    ) -> list[list[float]]:

        return self.provider.embed_batch(texts)