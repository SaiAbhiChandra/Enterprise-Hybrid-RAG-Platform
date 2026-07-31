from pathlib import Path

from app.parsers.base import BaseParser
from app.parsers.docx_parser import DOCXParser
from app.parsers.pdf_parser import PDFParser
from app.parsers.txt_parser import TXTParser


class ParserFactory:
    """
    Factory responsible for returning the correct parser
    based on the document extension.
    """

    _parsers = {
        ".pdf": PDFParser,
        ".docx": DOCXParser,
        ".txt": TXTParser,
    }

    @classmethod
    def get_parser(cls, file_path: Path) -> BaseParser:
        extension = file_path.suffix.lower()

        parser_class = cls._parsers.get(extension)

        if parser_class is None:
            raise ValueError(
                f"Unsupported document type: {extension}"
            )

        return parser_class()