from typing import Any

from pydantic import BaseModel, Field


class Chunk(BaseModel):
    """
    Represents a single text chunk extracted from a document.
    """

    chunk_index: int = Field(
        ...,
        description="Sequential index of the chunk.",
    )

    text: str = Field(
        ...,
        description="Chunk text.",
    )

    start_char: int = Field(
        ...,
        description="Starting character position.",
    )

    end_char: int = Field(
        ...,
        description="Ending character position.",
    )

    metadata: dict[str, Any] = Field(
        default_factory=dict,
        description="Additional chunk metadata.",
    )