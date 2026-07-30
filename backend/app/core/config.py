from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "Enterprise Hybrid RAG Platform"
    APP_VERSION: str = "1.0.0"

    DEBUG: bool = True

    HOST: str = "127.0.0.1"
    PORT: int = 8000

    SECRET_KEY: str
    
    ALGORITHM: str
    
    ACCESS_TOKEN_EXPIRE_MINUTES: int

    DATABASE_URL: str = ""

    REDIS_URL: str = ""

    QDRANT_URL: str = ""

    OPENAI_API_KEY: str = ""

    GEMINI_API_KEY: str = ""

    TAVILY_API_KEY: str = ""

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True
    )


settings = Settings()