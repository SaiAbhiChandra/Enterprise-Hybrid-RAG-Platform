from sqlalchemy.orm import Session

from app.models.conversation import Conversation
from app.repositories.base_repository import BaseRepository


class ConversationRepository(BaseRepository[Conversation]):
    def __init__(self):
        super().__init__(Conversation)

    def get_user_conversations(
        self,
        db: Session,
        owner_id: int,
    ) -> list[Conversation]:

        return (
            db.query(Conversation)
            .filter(Conversation.owner_id == owner_id)
            .order_by(Conversation.updated_at.desc())
            .all()
        )

    def get_conversation(
        self,
        db: Session,
        conversation_id: int,
    ) -> Conversation | None:

        return (
            db.query(Conversation)
            .filter(Conversation.id == conversation_id)
            .first()
        )
