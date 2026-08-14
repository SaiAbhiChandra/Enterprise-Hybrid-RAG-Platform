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
    # Ollama connection. Defaults to localhost for local/non-Docker
    # use. When the backend runs inside Docker, set this to
    # http://host.docker.internal:11434 so it can reach Ollama
    # running on the host machine (see docker-compose.yml).
    #
    # Deliberately NOT named OLLAMA_HOST: that name collides with
    # Ollama's own environment variable (used to configure which
    # interface the Ollama *server* binds to). Since real OS
    # environment variables always take priority over .env file
    # values, a system-wide OLLAMA_HOST=0.0.0.0 set for the Ollama
    # server (a legitimate, necessary setting on its own) would
    # silently override this app's setting too -- causing this app to
    # try connecting *to* the literal address 0.0.0.0, which isn't a
    # valid connection target. OLLAMA_BASE_URL avoids that collision.
    OLLAMA_BASE_URL: str = "http://localhost:11434"
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

    # Comma-separated list of allowed frontend origins. Defaults cover
    # local Vite dev (5173) and the containerized frontend (3000).
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000"

    @property
    def cors_origins_list(self) -> list[str]:
        return [
            origin.strip()
            for origin in self.CORS_ORIGINS.split(",")
            if origin.strip()
        ]

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
    )


settings = Settings()