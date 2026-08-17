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

    def get_preceding_user_message(
        self,
        db: Session,
        conversation_id: int,
        before_message_id: int,
    ) -> Message | None:
        """
        Finds the most recent user message before a given message id
        within a conversation. Backs "regenerate": regenerating an
        assistant reply needs the original question it was answering,
        without creating a duplicate user message the way a naive
        "just resend the question" approach would.
        """

        return (
            db.query(Message)
            .filter(
                Message.conversation_id == conversation_id,
                Message.role == "user",
                Message.id < before_message_id,
            )
            .order_by(Message.id.desc())
            .first()
        )
