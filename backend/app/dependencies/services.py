from app.dependencies.repositories import (
    get_user_repository,
)
from app.services.user_service import UserService
from app.services.auth_service import AuthenticationService

from app.dependencies.repositories import (
    get_document_repository,
)

from app.services.document_service import (
    DocumentService,
)

def get_user_service() -> UserService:
    return UserService(
        repository=get_user_repository(),
    )
    
def get_auth_service() -> AuthenticationService:
    return AuthenticationService(
        repository=get_user_repository(),
    )
    
def get_document_service(
    repository=Depends(
        get_document_repository,
    ),
):
    return DocumentService(repository)