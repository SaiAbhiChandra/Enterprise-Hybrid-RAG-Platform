from app.repositories.document_repository import (
    DocumentRepository,
)


class DocumentService:
    def __init__(
        self,
        repository: DocumentRepository,
    ):
        self.repository = repository