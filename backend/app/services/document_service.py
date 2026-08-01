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
from app.parsers.parser_service import ParserService
from app.chunking.chunk_generator import ChunkGenerator
from app.services.chunk_service import ChunkService
from app.services.embedding_pipeline_service import (
    EmbeddingPipelineService,
)

class DocumentService:

    def __init__(
        self,
        repository: DocumentRepository,
        storage: StorageService,
        parser: ParserService,
        chunk_generator: ChunkGenerator,
        chunk_service: ChunkService,
        embedding_pipeline: EmbeddingPipelineService,
    ):
        self.repository = repository
        self.storage = storage
        self.parser = parser
        self.chunk_generator = chunk_generator
        self.chunk_service = chunk_service
        self.embedding_pipeline = embedding_pipeline

    async def upload_document(
        self,
        db: Session,
        file: UploadFile,
        owner_id: int,
    ) -> Document:

        stored_path = None

        try:

            # ----------------------------------------------------
            # 1. Save uploaded file
            # ----------------------------------------------------
            stored_path = await self.storage.save_upload(
                file=file,
            )

            # ----------------------------------------------------
            # 2. Create document metadata
            # ----------------------------------------------------
            document = Document(
                filename=Path(stored_path).name,
                original_filename=file.filename,
                file_path=stored_path,
                mime_type=file.content_type,
                file_size=os.path.getsize(stored_path),
                status="UPLOADED",
                owner_id=owner_id,
            )

            document = self.repository.create_document(
                db=db,
                document=document,
            )

            # ----------------------------------------------------
            # 3. Parse document
            # ----------------------------------------------------
            parsed_document = self.parser.parse_document(
                stored_path,
            )

            # ----------------------------------------------------
            # 4. Generate chunks
            # ----------------------------------------------------
            chunks = self.chunk_generator.create_chunks(
                parsed_document,
            )

            # ----------------------------------------------------
            # 5. Persist chunks
            # ----------------------------------------------------
            self.chunk_service.save_chunks(
                db=db,
                chunks=chunks,
                document_id=document.id,
                owner_id=owner_id,
            )

            # ----------------------------------------------------
            # 6. Generate embeddings
            # ----------------------------------------------------
            self.embedding_pipeline.index_document(
                db=db,
                document_id=document.id,
            )

            # ----------------------------------------------------
            # 7. Commit database transaction
            # ----------------------------------------------------
            db.commit()

            db.refresh(document)

            return document

        except Exception:

            # Rollback all pending database changes
            db.rollback()

            # Remove uploaded file if it exists
            if stored_path:

                try:
                    await self.storage.delete_upload(
                        stored_path,
                    )
                except Exception:
                    pass

            raise