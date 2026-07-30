from datetime import datetime

from pydantic import BaseModel
from pydantic import ConfigDict


class DocumentBase(BaseModel):
    filename: str
    original_filename: str
    mime_type: str
    file_size: int
    status: str


class DocumentCreate(DocumentBase):
    file_path: str
    owner_id: int


class DocumentResponse(DocumentBase):
    id: int
    file_path: str
    owner_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )