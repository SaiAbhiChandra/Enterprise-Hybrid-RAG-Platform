from pydantic import BaseModel


class ChatRequest(BaseModel):
    question: str


class Source(BaseModel):
    document_id: int
    document_name: str
    chunk_id: int
    chunk_index: int
    score: float


class RetrievalMetadata(BaseModel):
    model: str
    retrieved_chunks: int


class ChatResponse(BaseModel):
    answer: str
    sources: list[Source]
    metadata: RetrievalMetadata