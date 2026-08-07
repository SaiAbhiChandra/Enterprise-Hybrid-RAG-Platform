from app.llm.service import LLMService
from app.llm.prompt_builder import PromptBuilder
from app.retrieval.context_builder import ContextBuilder
from app.retrieval.retrieval_service import RetrievalService
from app.repositories.document_repository import DocumentRepository
from app.core.config import settings
from sqlalchemy.orm import Session

from app.chat.schemas import (
    ChatRequest,
    ChatResponse,
    Source,
    RetrievalMetadata,
)


class ChatService:
    """
    Main orchestration service for Enterprise RAG.
    """

    def __init__(
        self,
        retrieval_service: RetrievalService,
        prompt_builder,
        context_builder,
        llm,
        document_repository,
    ):
        self.retrieval_service = retrieval_service
        self.prompt_builder = prompt_builder
        self.context_builder = context_builder
        self.llm = llm
        self.document_repository = document_repository

    def chat(
        self,
        db: Session,
        request: ChatRequest,
    ) -> ChatResponse:

        retrieval = self.retrieval_service.retrieve(
            db=db,
            query=request.question,
        )
        
        document_ids = list(
            {
                chunk.document_id
                for chunk in retrieval.chunks
            }
        )

        documents = self.document_repository.get_by_ids(
            db=db,
            ids=document_ids,
        )

        document_map = {
            doc.id: doc.original_filename
            for doc in documents
        }

        context = self.context_builder.build(
            retrieval,
        )

        prompt = self.prompt_builder.build(
            question=request.question,
            context=context,
        )

        answer = self.llm.generate(
            prompt,
        )

        sources = []

        for chunk in retrieval.chunks:

            sources.append(
                Source(
                    document_id=chunk.document_id,
                    document_name=document_map.get(
                        chunk.document_id,
                        "Unknown Document",
                    ),
                    chunk_id=chunk.chunk_id,
                    chunk_index=chunk.chunk_index,
                    score=chunk.score,
                )
            )

        return ChatResponse(
            answer=answer,
            sources=sources,
            metadata=RetrievalMetadata(
                model=settings.OLLAMA_MODEL,
                retrieved_chunks=len(retrieval.chunks),
            ),
        )
    
    def stream_chat(
        self,
        db: Session,
        request: ChatRequest,
    ):
        """
        Stream AI response.
        """

        retrieval = self.retrieval_service.retrieve(
            db=db,
            query=request.question,
        )

        context = self.context_builder.build(
            retrieval,
        )

        prompt = self.prompt_builder.build(
            question=request.question,
            context=context,
        )

        return self.llm.stream(
            prompt,
        )