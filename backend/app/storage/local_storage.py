from pathlib import Path
from uuid import uuid4

import aiofiles
from fastapi import UploadFile


class LocalStorage:

    def __init__(self):
        self.upload_root = Path("uploads")

    async def save_file(
        self,
        file: UploadFile,
        folder: str,
    ) -> str:
        """
        Save an uploaded file locally.

        Returns:
            Relative file path.
        """

        upload_dir = self.upload_root / folder
        upload_dir.mkdir(
            parents=True,
            exist_ok=True,
        )

        extension = Path(
            file.filename
        ).suffix.lower()

        filename = (
            f"{uuid4()}{extension}"
        )

        destination = (
            upload_dir / filename
        )

        async with aiofiles.open(
            destination,
            "wb",
        ) as out_file:

            while True:
                chunk = await file.read(
                    1024 * 1024
                )

                if not chunk:
                    break

                await out_file.write(
                    chunk
                )

        await file.seek(0)

        return str(destination)

    async def delete_file(
        self,
        file_path: str,
    ) -> None:

        path = Path(file_path)

        if path.exists():
            path.unlink()