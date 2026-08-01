from app.dependencies.repositories import (
    get_user_repository,
    get_document_repository,
)

from app.repositories.chunk_repository import ChunkRepository

from app.services.user_service import UserService
from app.services.auth_service import AuthenticationService
from app.services.document_service import DocumentService
from app.services.chunk_service import ChunkService
from app.services.embedding_pipeline_service import EmbeddingPipelineService

from app.storage.storage_service import StorageService

from app.parsers.parser_service import ParserService

from app.chunking.chunk_generator import ChunkGenerator

from app.embeddings.embedding_service import EmbeddingService
from app.embeddings.sentence_transformer_provider import SentenceTransformerProvider

from app.vectorstores.qdrant_provider import QdrantProvider
from app.vectorstores.qdrant_service import QdrantService
from app.vectorstores.search_repository import SearchRepository

from app.retrieval.retriever import Retriever

from app.chat.service import ChatService
from app.llm.prompt_builder import PromptBuilder
from app.retrieval.context_builder import ContextBuilder

from app.llm.service import LLMService
from app.llm.providers.ollama_provider import OllamaProvider


# -----------------------------
# Core Services
# -----------------------------

def get_storage_service() -> StorageService:
    return StorageService()


def get_parser_service() -> ParserService:
    return ParserService()


def get_chunk_generator() -> ChunkGenerator:
    return ChunkGenerator()


# -----------------------------
# Repositories
# -----------------------------

def get_chunk_repository() -> ChunkRepository:
    return ChunkRepository()


# -----------------------------
# Chunk Service
# -----------------------------

def get_chunk_service() -> ChunkService:
    return ChunkService(
        repository=get_chunk_repository(),
    )


# -----------------------------
# Embeddings
# -----------------------------

def get_embedding_service() -> EmbeddingService:
    return EmbeddingService(
        provider=SentenceTransformerProvider(),
    )


# -----------------------------
# Vector Store
# -----------------------------

def get_vector_store_service() -> QdrantService:
    service = QdrantService(
        provider=QdrantProvider(),
    )

    service.initialize()

    return service


# -----------------------------
# Embedding Pipeline
# -----------------------------

def get_embedding_pipeline_service() -> EmbeddingPipelineService:
    return EmbeddingPipelineService(
        chunk_repository=get_chunk_repository(),
        embedding_service=get_embedding_service(),
        vector_store=get_vector_store_service(),
    )


# -----------------------------
# Retrieval
# -----------------------------

def get_search_repository() -> SearchRepository:
    return SearchRepository(
        service=get_vector_store_service(),
    )


def get_retriever() -> Retriever:
    return Retriever(
        embedding_service=get_embedding_service(),
        search_repository=get_search_repository(),
    )


# -----------------------------
# User/Auth
# -----------------------------

def get_user_service() -> UserService:
    return UserService(
        repository=get_user_repository(),
    )


def get_auth_service() -> AuthenticationService:
    return AuthenticationService(
        repository=get_user_repository(),
    )


# -----------------------------
# Document
# -----------------------------

def get_document_service() -> DocumentService:
    return DocumentService(
        repository=get_document_repository(),
        storage=get_storage_service(),
        parser=get_parser_service(),
        chunk_generator=get_chunk_generator(),
        chunk_service=get_chunk_service(),
        embedding_pipeline=get_embedding_pipeline_service(),
    )
    
def get_llm_service() -> LLMService:
    """
    Returns the configured LLM service.
    """
    return LLMService(
        provider=OllamaProvider(),
    )
    
def get_chat_service() -> ChatService:

    return ChatService(
        retriever=get_retriever(),
        prompt_builder=PromptBuilder(),
        context_builder=ContextBuilder(),
        llm=get_llm_service(),
        document_repository=get_document_repository(),
    )
    
