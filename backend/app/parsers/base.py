from abc import ABC, abstractmethod
from pathlib import Path

from app.schemas.parser import DocumentContent


class BaseParser(ABC):
    """
    Base interface for all document parsers.
    """

    @abstractmethod
    def parse(self, file_path: Path) -> DocumentContent:
        """
        Extract text and metadata from a document.

        Args:
            file_path: Path to the document.

        Returns:
            DocumentContent containing extracted text and metadata.
        """
        raise NotImplementedError