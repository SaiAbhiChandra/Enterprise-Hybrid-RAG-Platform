from app.embeddings.embedding_service import EmbeddingService
from app.embeddings.sentence_transformer_provider import (
    SentenceTransformerProvider,
)

provider = SentenceTransformerProvider()

service = EmbeddingService(provider)

vector = service.generate_embedding(
    "Enterprise Hybrid RAG Platform"
)

print(len(vector))

print(vector[:10])