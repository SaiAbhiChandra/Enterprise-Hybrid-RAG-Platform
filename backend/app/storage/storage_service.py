from pathlib import Path

from fastapi import HTTPException
from fastapi import UploadFile

from app.storage.local_storage import LocalStorage


class StorageService:

    MAX_FILE_SIZE = 50 * 1024 * 1024  # 50 MB

    ALLOWED_EXTENSIONS = {
        ".pdf": "pdf",
        ".docx": "docx",
        ".txt": "txt",
    }

    def __init__(self):
        self.storage = LocalStorage()

    async def save_upload(
        self,
        file: UploadFile,
    ) -> str:
        """
        Validate and store an uploaded file.
        """

        extension = Path(
            file.filename
        ).suffix.lower()

        if extension not in self.ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail="Unsupported file type.",
            )

        content = await file.read()

        file_size = len(content)

        await file.seek(0)

        if file_size > self.MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400,
                detail="File exceeds maximum allowed size.",
            )

        folder = self.ALLOWED_EXTENSIONS[
            extension
        ]

        return await self.storage.save_file(
            file=file,
            folder=folder,
        )

    async def delete_upload(
        self,
        file_path: str,
    ):
        await self.storage.delete_file(
            file_path
        )