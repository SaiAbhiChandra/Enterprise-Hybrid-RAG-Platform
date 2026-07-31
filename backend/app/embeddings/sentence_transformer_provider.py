from sentence_transformers import SentenceTransformer

from app.embeddings.base import EmbeddingProvider


class SentenceTransformerProvider(EmbeddingProvider):
    """
    Sentence Transformer implementation.
    """

    def __init__(
        self,
        model_name: str = "BAAI/bge-small-en-v1.5",
    ):
        self.model = SentenceTransformer(model_name)

    def embed_text(
        self,
        text: str,
    ) -> list[float]:

        return self.model.encode(
            text,
            normalize_embeddings=True,
        ).tolist()

    def embed_batch(
        self,
        texts: list[str],
    ) -> list[list[float]]:

        return self.model.encode(
            texts,
            normalize_embeddings=True,
        ).tolist()