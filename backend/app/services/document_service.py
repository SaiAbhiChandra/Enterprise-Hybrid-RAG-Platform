import os
from pathlib import Path

from fastapi import HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.models.document import Document
from app.repositories.document_repository import (
    DocumentRepository,
)
from app.repositories.chunk_repository import (
    ChunkRepository,
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
from app.vectorstores.qdrant_service import QdrantService

class DocumentService:

    def __init__(
        self,
        repository: DocumentRepository,
        storage: StorageService,
        parser: ParserService,
        chunk_generator: ChunkGenerator,
        chunk_service: ChunkService,
        embedding_pipeline: EmbeddingPipelineService,
        chunk_repository: ChunkRepository,
        vector_store: QdrantService,
    ):
        self.repository = repository
        self.storage = storage
        self.parser = parser
        self.chunk_generator = chunk_generator
        self.chunk_service = chunk_service
        self.embedding_pipeline = embedding_pipeline
        self.chunk_repository = chunk_repository
        self.vector_store = vector_store

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

    def list_documents(
        self,
        db: Session,
        owner_id: int,
    ) -> list[Document]:

        return self.repository.get_user_documents(
            db=db,
            owner_id=owner_id,
        )

    def get_owned_document(
        self,
        db: Session,
        document_id: int,
        owner_id: int,
    ) -> Document:
        """
        Fetch a document and enforce ownership. Raises 404 for both
        "doesn't exist" and "exists but belongs to someone else" --
        returning 403 for the latter would let a user distinguish
        which document IDs exist system-wide, leaking information
        about other users' data.
        """

        document = self.repository.get_document(
            db=db,
            document_id=document_id,
        )

        if document is None or document.owner_id != owner_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Document not found.",
            )

        return document

    async def delete_document(
        self,
        db: Session,
        document_id: int,
        owner_id: int,
    ) -> None:
        """
        Fully removes a document: its vectors in Qdrant, its stored
        file on disk, and its database row (which cascades to delete
        its chunks). Deleting only the DB row would leave orphaned
        vectors in Qdrant that keep surfacing in retrieval results for
        a document that appears "deleted" everywhere else.
        """

        document = self.get_owned_document(
            db=db,
            document_id=document_id,
            owner_id=owner_id,
        )

        chunks = self.chunk_repository.get_by_document_id(
            db=db,
            document_id=document_id,
        )

        chunk_ids = [chunk.id for chunk in chunks]

        try:

            if chunk_ids:
                self.vector_store.delete(chunk_ids)

            if document.file_path:
                try:
                    await self.storage.delete_upload(
                        document.file_path,
                    )
                except Exception:
                    # File may already be missing on disk; the DB
                    # record is still the source of truth and should
                    # still be removed.
                    pass

            self.repository.delete(
                db=db,
                obj=document,
            )

            db.commit()

        except Exception:
            db.rollback()
            raise