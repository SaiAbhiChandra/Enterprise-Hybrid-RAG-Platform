from app.models.document import Document
from app.repositories.base_repository import BaseRepository


class DocumentRepository(
    BaseRepository[Document]
):
    def __init__(self):
        super().__init__(Document)