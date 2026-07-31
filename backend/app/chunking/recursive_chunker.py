from langchain_text_splitters import RecursiveCharacterTextSplitter

from app.chunking.base import BaseChunker
from app.schemas.chunk import Chunk
from app.schemas.parser import DocumentContent


class RecursiveChunker(BaseChunker):
    """
    Enterprise recursive text chunker.
    """

    def __init__(
        self,
        chunk_size: int = 500,
        chunk_overlap: int = 100,
    ):
        self.splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            separators=[
                "\n\n",
                "\n",
                ". ",
                " ",
                "",
            ],
        )

    def split(
        self,
        document: DocumentContent,
    ) -> list[Chunk]:

        texts = self.splitter.split_text(document.text)

        chunks: list[Chunk] = []

        cursor = 0

        for index, text in enumerate(texts):

            start = document.text.find(text, cursor)

            if start == -1:
                start = cursor

            end = start + len(text)

            cursor = end

            chunks.append(
                Chunk(
                    chunk_index=index,
                    text=text,
                    start_char=start,
                    end_char=end,
                    metadata={
                        **document.metadata,
                        "source": document.source,
                    },
                )
            )

        return chunks