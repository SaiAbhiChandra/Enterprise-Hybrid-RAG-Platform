from pathlib import Path

from app.parsers.parser_factory import ParserFactory
from app.schemas.parser import DocumentContent


class ParserService:
    """
    High-level service responsible for document parsing.
    """

    def parse_document(
        self,
        file_path: str,
    ) -> DocumentContent:

        path = Path(file_path)

        parser = ParserFactory.get_parser(path)

        return parser.parse(path)