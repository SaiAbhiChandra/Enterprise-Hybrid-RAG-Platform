from app.repositories.user_repository import (
    UserRepository,
    user_repository,
)


def get_user_repository() -> UserRepository:
    return user_repository

from app.repositories.document_repository import (
    DocumentRepository,
)

def get_document_repository():
    return DocumentRepository()