from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.conversation import Conversation
from app.repositories.conversation_repository import (
    ConversationRepository,
)
from app.repositories.message_repository import (
    MessageRepository,
)


class ConversationService:
    """
    CRUD for conversation threads -- the "sidebar" half of the chat
    experience, separate from ChatService (which handles the actual
    retrieve-and-generate turn).
    """

    def __init__(
        self,
        conversation_repository: ConversationRepository,
        message_repository: MessageRepository,
    ):
        self.conversation_repository = conversation_repository
        self.message_repository = message_repository

    def list_conversations(
        self,
        db: Session,
        owner_id: int,
    ) -> list[Conversation]:

        return self.conversation_repository.get_user_conversations(
            db=db,
            owner_id=owner_id,
        )

    def get_owned_conversation(
        self,
        db: Session,
        conversation_id: int,
        owner_id: int,
    ) -> Conversation:

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

    def get_conversation_with_messages(
        self,
        db: Session,
        conversation_id: int,
        owner_id: int,
    ) -> Conversation:

        conversation = self.get_owned_conversation(
            db=db,
            conversation_id=conversation_id,
            owner_id=owner_id,
        )

        # Access via the relationship so ordering (created_at) from
        # the model definition is respected.
        _ = conversation.messages

        return conversation

    def rename_conversation(
        self,
        db: Session,
        conversation_id: int,
        owner_id: int,
        title: str,
    ) -> Conversation:

        conversation = self.get_owned_conversation(
            db=db,
            conversation_id=conversation_id,
            owner_id=owner_id,
        )

        conversation.title = title.strip()[:255] or "New conversation"

        db.commit()
        db.refresh(conversation)

        return conversation

    def delete_conversation(
        self,
        db: Session,
        conversation_id: int,
        owner_id: int,
    ) -> None:

        conversation = self.get_owned_conversation(
            db=db,
            conversation_id=conversation_id,
            owner_id=owner_id,
        )

        self.conversation_repository.delete(
            db=db,
            obj=conversation,
        )

        db.commit()

    def truncate_from(
        self,
        db: Session,
        conversation_id: int,
        owner_id: int,
        message_id: int,
    ) -> None:
        """
        Deletes a message and everything after it in the
        conversation. Used when a user edits a past message -- the
        edited question gets resent as a fresh message afterward, so
        the stale message and its stale answer need to go first.
        """

        conversation = self.get_owned_conversation(
            db=db,
            conversation_id=conversation_id,
            owner_id=owner_id,
        )

        self.message_repository.delete_from(
            db=db,
            conversation_id=conversation.id,
            from_message_id=message_id,
        )

        db.commit()

    @staticmethod
    def derive_title(question: str) -> str:
        """
        Auto-title a new conversation from its first message, the
        same way ChatGPT/Claude do -- trimmed to a sidebar-friendly
        length.
        """

        title = " ".join(question.strip().split())

        if len(title) <= 60:
            return title or "New conversation"

        return title[:57].rstrip() + "..."
