from app.dependencies.repositories import (
    get_user_repository,
    get_document_repository,
)

from app.services.user_service import UserService
from app.services.auth_service import AuthenticationService
from app.services.document_service import DocumentService

from app.storage.storage_service import StorageService


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


def get_document_service() -> DocumentService:
    return DocumentService(
        repository=get_document_repository(),
        storage=get_storage_service(),
    )