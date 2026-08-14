from sqlalchemy.orm import Session

from app.models.message import Message
from app.repositories.base_repository import BaseRepository


class MessageRepository(BaseRepository[Message]):
    def __init__(self):
        super().__init__(Message)

    def get_by_conversation_id(
        self,
        db: Session,
        conversation_id: int,
    ) -> list[Message]:

        return (
            db.query(Message)
            .filter(Message.conversation_id == conversation_id)
            .order_by(Message.created_at)
            .all()
        )

    def delete_from(
        self,
        db: Session,
        conversation_id: int,
        from_message_id: int,
    ) -> None:
        """
        Deletes a message and every message after it (by id) within a
        conversation. Backs the "edit message" flow: editing a past
        message should discard everything that followed it -- the
        old answer and any messages after it no longer make sense
        once the question they were responding to has changed.
        """

        db.query(Message).filter(
            Message.conversation_id == conversation_id,
            Message.id >= from_message_id,
        ).delete(synchronize_session=False)
