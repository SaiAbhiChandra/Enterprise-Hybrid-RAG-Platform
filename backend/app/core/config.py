from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "Enterprise Hybrid RAG Platform"
    APP_VERSION: str = "1.0.0"

    DEBUG: bool = True

    HOST: str = "127.0.0.1"
    PORT: int = 8000

    # Authentication
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int

    # Database
    DATABASE_URL: str

    # Redis
    REDIS_URL: str

    # Qdrant
    QDRANT_HOST: str = "localhost"
    QDRANT_PORT: int = 6333
    QDRANT_URL: str = "http://localhost:6333"
    QDRANT_COLLECTION: str = "documents"

    # Embeddings
    EMBEDDING_MODEL: str = "BAAI/bge-small-en-v1.5"
    EMBEDDING_DIMENSION: int = 384

    # LLM
    LLM_PROVIDER: str = "ollama"
    OLLAMA_MODEL: str = "llama3.1:8b"

    # Minimum cross-encoder relevance score (post-sigmoid, 0-1) for
    # retrieved context to actually be handed to the LLM. Below this,
    # the top retrieved chunk isn't a real match for the question, so
    # the context is dropped and the model answers from general
    # knowledge instead of being confused by irrelevant chunks.
    RAG_RELEVANCE_THRESHOLD: float = 0.5

    OPENAI_API_KEY: str = ""
    GEMINI_API_KEY: str = ""

    # Search
    TAVILY_API_KEY: str = ""

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
    )


settings = Settings()