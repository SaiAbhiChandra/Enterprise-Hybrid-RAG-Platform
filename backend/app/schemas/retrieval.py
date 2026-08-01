from pydantic import BaseModel


class RetrievedChunk(BaseModel):
    chunk_id: int
    document_id: int
    chunk_index: int
    score: float
    text: str


class RetrievalResponse(BaseModel):
    query: str
    chunks: list[RetrievedChunk]