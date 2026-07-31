from app.chunking.recursive_chunker import RecursiveChunker
from app.schemas.chunk import Chunk
from app.schemas.parser import DocumentContent


class ChunkGenerator:
    """
    High-level chunking service.
    """

    def __init__(self):
        self.chunker = RecursiveChunker()

    def create_chunks(
        self,
        document: DocumentContent,
    ) -> list[Chunk]:

        return self.chunker.split(document)