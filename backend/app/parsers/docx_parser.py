from pathlib import Path

from docx import Document

from app.parsers.base import BaseParser
from app.schemas.parser import DocumentContent


class DOCXParser(BaseParser):
    """
    Parser for Microsoft Word (.docx) documents.
    """

    def parse(self, file_path: Path) -> DocumentContent:
        document = Document(file_path)

        paragraphs = [
            paragraph.text.strip()
            for paragraph in document.paragraphs
            if paragraph.text.strip()
        ]

        text = "\n".join(paragraphs)

        return DocumentContent(
    text=text,
    page_count=document.page_count,
    source=file_path.name,
    metadata={
        "file_type": "docx",
        "filename": file_path.name,
        },
    )