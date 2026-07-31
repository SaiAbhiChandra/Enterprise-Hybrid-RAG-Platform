from pathlib import Path

from app.parsers.base import BaseParser
from app.schemas.parser import DocumentContent


class TXTParser(BaseParser):
    """
    Parser for plain text files.
    """

    def parse(self, file_path: Path) -> DocumentContent:
        text = file_path.read_text(
            encoding="utf-8",
            errors="ignore",
        )

        return DocumentContent(
            text=text,
            page_count=document.page_count,
            source=file_path.name,
            metadata={
                "file_type": "txt",
                "filename": file_path.name,
            },
        )