from sqlalchemy.orm import Session

from app.models.document import Document
from app.repositories.base_repository import BaseRepository


class DocumentRepository(BaseRepository[Document]):
    def __init__(self):
        super().__init__(Document)

    def create_document(
        self,
        db: Session,
        document: Document,
    ) -> Document:
        return self.create(
            db=db,
            obj=document,
        )

    def get_document(
        self,
        db: Session,
        document_id: int,
    ) -> Document | None:
        return (
            db.query(Document)
            .filter(Document.id == document_id)
            .first()
        )

    def get_user_documents(
        self,
        db: Session,
        owner_id: int,
    ):
        return (
            db.query(Document)
            .filter(Document.owner_id == owner_id)
            .all()
        )


document_repository = DocumentRepository()