from sqlalchemy.orm import Session

from fastapi import HTTPException, status

from app.llm.service import LLMService
from app.llm.prompt_builder import PromptBuilder
from app.retrieval.context_builder import ContextBuilder
from app.retrieval.retrieval_service import RetrievalService
from app.repositories.document_repository import DocumentRepository
from app.repositories.conversation_repository import ConversationRepository
from app.repositories.message_repository import MessageRepository
from app.models.conversation import Conversation
from app.models.message import Message
from app.chat.conversation_service import ConversationService
from app.core.config import settings

from app.chat.schemas import (
    ChatRequest,
    ChatResponse,
    Source,
    RetrievalMetadata,
)


class ChatService:
    """
    Main orchestration service for Enterprise RAG.

    Every turn -- whether a new conversation or a continuation of an
    existing one -- goes through the same path: resolve/create the
    conversation, persist the user's message, run retrieval +
    generation, persist the assistant's message (with its sources),
    return the response. Streaming mirrors this exactly, just with
    the assistant message persisted after the last token is yielded
    instead of all at once.
    """

    def __init__(
        self,
        retrieval_service: RetrievalService,
        prompt_builder,
        context_builder,
        llm,
        document_repository: DocumentRepository,
        conversation_repository: ConversationRepository,
        message_repository: MessageRepository,
    ):
        self.retrieval_service = retrieval_service
        self.prompt_builder = prompt_builder
        self.context_builder = context_builder
        self.llm = llm
        self.document_repository = document_repository
        self.conversation_repository = conversation_repository
        self.message_repository = message_repository

    def _resolve_conversation(
        self,
        db: Session,
        conversation_id: int | None,
        owner_id: int,
        question: str,
    ) -> Conversation:
        """
        Returns the target conversation, creating a new one (titled
        from the first question) if none was specified. Also enforces
        ownership on an existing conversation_id -- a user can't post
        into someone else's thread by guessing an ID.
        """

        if conversation_id is None:
            conversation = Conversation(
                owner_id=owner_id,
                title=ConversationService.derive_title(question),
            )

            return self.conversation_repository.create(
                db=db,
                obj=conversation,
            )

        conversation = self.conversation_repository.get_conversation(
            db=db,
            conversation_id=conversation_id,
        )

        if conversation is None or conversation.owner_id != owner_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversation not found.",
            )

        return conversation

    def _save_message(
        self,
        db: Session,
        conversation_id: int,
        role: str,
        content: str,
        sources: list[dict] | None = None,
    ) -> Message:

        message = Message(
            conversation_id=conversation_id,
            role=role,
            content=content,
            sources=sources,
        )

        return self.message_repository.create(
            db=db,
            obj=message,
        )

    def _build_sources(
        self,
        db: Session,
        retrieval,
    ) -> list[Source]:

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

        return [
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
            for chunk in retrieval.chunks
        ]

    def _build_context(self, retrieval) -> str:
        """
        Only hands the LLM retrieved context if it's actually
        relevant. Without this, an empty document set (or a question
        unrelated to any uploaded document) would still inject the
        "best available" chunks -- which might score near zero -- and
        the model would end up reasoning over noise instead of
        answering from its own general knowledge.
        """

        if not retrieval.chunks:
            return ""

        if retrieval.chunks[0].score < settings.RAG_RELEVANCE_THRESHOLD:
            return ""

        return self.context_builder.build(retrieval)

    def chat(
        self,
        db: Session,
        request: ChatRequest,
        owner_id: int,
    ) -> ChatResponse:

        conversation = self._resolve_conversation(
            db=db,
            conversation_id=request.conversation_id,
            owner_id=owner_id,
            question=request.question,
        )

        self._save_message(
            db=db,
            conversation_id=conversation.id,
            role="user",
            content=request.question,
        )

        retrieval = self.retrieval_service.retrieve(
            db=db,
            query=request.question,
        )

        sources = self._build_sources(db=db, retrieval=retrieval)

        context = self._build_context(retrieval)

        prompt = self.prompt_builder.build(
            question=request.question,
            context=context,
        )

        answer = self.llm.generate(
            prompt,
        )

        self._save_message(
            db=db,
            conversation_id=conversation.id,
            role="assistant",
            content=answer,
            sources=[source.model_dump() for source in sources],
        )

        db.commit()

        return ChatResponse(
            conversation_id=conversation.id,
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
        owner_id: int,
    ):
        """
        Prepares a streaming chat turn.

        Returns (conversation, sources, token_generator) rather than a
        single generator: conversation_id and sources are both known
        *before* the first token is generated (they come out of
        retrieval, which runs before the LLM call), so the router can
        send them to the client immediately as a "meta" event instead
        of making the frontend wait for the full answer to find out
        which conversation it's in or what was cited.
        """

        conversation = self._resolve_conversation(
            db=db,
            conversation_id=request.conversation_id,
            owner_id=owner_id,
            question=request.question,
        )

        self._save_message(
            db=db,
            conversation_id=conversation.id,
            role="user",
            content=request.question,
        )

        db.commit()

        retrieval = self.retrieval_service.retrieve(
            db=db,
            query=request.question,
        )

        sources = self._build_sources(db=db, retrieval=retrieval)

        context = self._build_context(retrieval)

        prompt = self.prompt_builder.build(
            question=request.question,
            context=context,
        )

        def token_generator():
            collected = []

            for token in self.llm.stream(prompt):
                collected.append(token)
                yield token

            full_answer = "".join(collected)

            self._save_message(
                db=db,
                conversation_id=conversation.id,
                role="assistant",
                content=full_answer,
                sources=[source.model_dump() for source in sources],
            )

            db.commit()

        return conversation, sources, token_generator()
