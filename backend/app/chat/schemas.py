from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ChatRequest(BaseModel):
    question: str
    conversation_id: int | None = None


class RegenerateRequest(BaseModel):
    conversation_id: int
    message_id: int


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
    conversation_id: int
    answer: str
    sources: list[Source]
    metadata: RetrievalMetadata


class MessageResponse(BaseModel):
    id: int
    role: str
    content: str
    sources: list[Source] | None = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ConversationSummary(BaseModel):
    """Lightweight shape for the sidebar conversation list."""

    id: int
    title: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ConversationDetail(ConversationSummary):
    """Full conversation including message history, for opening a thread."""

    messages: list[MessageResponse]


class ConversationRename(BaseModel):
    title: str