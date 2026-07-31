from abc import ABC, abstractmethod

from app.schemas.chunk import Chunk
from app.schemas.parser import DocumentContent


class BaseChunker(ABC):
    """
    Base interface for all chunking strategies.
    """

    @abstractmethod
    def split(
        self,
        document: DocumentContent,
    ) -> list[Chunk]:
        raise NotImplementedError