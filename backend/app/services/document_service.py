import os
from pathlib import Path

from fastapi import UploadFile
from sqlalchemy.orm import Session

from app.models.document import Document
from app.repositories.document_repository import (
    DocumentRepository,
)
from app.storage.storage_service import (
    StorageService,
)


class DocumentService:

    def __init__(
        self,
        repository: DocumentRepository,
        storage: StorageService,
    ):
        self.repository = repository
        self.storage = storage

    async def upload_document(
        self,
        db: Session,
        file: UploadFile,
        owner_id: int,
    ) -> Document:

        stored_path = await self.storage.save_upload(
            file=file
        )

        document = Document(
            filename=Path(stored_path).name,
            original_filename=file.filename,
            file_path=stored_path,
            mime_type=file.content_type,
            file_size = os.path.getsize(stored_path),
            status="UPLOADED",
            owner_id=owner_id,
        )

        document = self.repository.create_document(
            db=db,
            document=document,
        )

        db.commit()
        db.refresh(document)

        return document