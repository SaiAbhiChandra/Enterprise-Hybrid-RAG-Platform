from typing import Any

from pydantic import BaseModel, Field


class DocumentContent(BaseModel):
    """
    Standard output returned by every document parser.
    """

    text: str = Field(
        ...,
        description="Complete extracted text from the document.",
    )

    page_count: int = Field(
        default=1,
        description="Number of pages in the document.",
    )
    
    source: str = Field(
    default="",
    description="Original document path or filename.",
    )

    metadata: dict[str, Any] = Field(
        default_factory=dict,
        description="Additional parser metadata.",
    )