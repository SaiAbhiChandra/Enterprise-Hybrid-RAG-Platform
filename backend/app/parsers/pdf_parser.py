from pathlib import Path

import fitz  # PyMuPDF

from app.parsers.base import BaseParser
from app.schemas.parser import DocumentContent


class PDFParser(BaseParser):
    """
    Parser for PDF documents using PyMuPDF.
    """

    def parse(self, file_path: Path) -> DocumentContent:
        """
        Extract text and metadata from a PDF document.
        """

        with fitz.open(file_path) as document:
            pages = [page.get_text() for page in document]
            text = "\n".join(pages)

            return DocumentContent(
                text=text,
                page_count=document.page_count,
                source=file_path.name,
                metadata={
                    "file_type": "pdf",
                    "filename": file_path.name,
                },
            )