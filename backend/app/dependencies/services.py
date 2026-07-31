from app.dependencies.repositories import (
    get_user_repository,
    get_document_repository,
)

from app.services.user_service import UserService
from app.services.auth_service import AuthenticationService
from app.services.document_service import DocumentService

from app.storage.storage_service import StorageService

from app.parsers.parser_service import ParserService
from app.chunking.chunk_generator import ChunkGenerator
from app.services.chunk_service import ChunkService
from app.repositories.chunk_repository import ChunkRepository

def get_user_service() -> UserService:
    return UserService(
        repository=get_user_repository(),
    )


def get_auth_service() -> AuthenticationService:
    return AuthenticationService(
        repository=get_user_repository(),
    )


def get_storage_service() -> StorageService:
    return StorageService()

def get_parser_service() -> ParserService:
    return ParserService()


def get_chunk_generator() -> ChunkGenerator:
    return ChunkGenerator()


def get_chunk_service() -> ChunkService:
    return ChunkService(
        repository=ChunkRepository(),
    )


def get_document_service() -> DocumentService:
    return DocumentService(
        repository=get_document_repository(),
        storage=get_storage_service(),
        parser=get_parser_service(),
        chunk_generator=get_chunk_generator(),
        chunk_service=get_chunk_service(),
    )