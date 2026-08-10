from sqlalchemy import ForeignKey, Integer, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.mixins import TimestampMixin


class Message(Base, TimestampMixin):
    __tablename__ = "messages"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    conversation_id: Mapped[int] = mapped_column(
        ForeignKey("conversations.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # "user" or "assistant". Plain string rather than a DB enum --
    # matches this project's existing convention (see Document.status)
    # of keeping status/role fields as simple strings.
    role: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
    )

    content: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    # Retrieval sources for assistant messages (document/chunk/score),
    # stored as JSON so past conversations still show their citations
    # when reopened -- null for user messages.
    sources: Mapped[list | None] = mapped_column(
        JSON,
        nullable=True,
    )

    conversation = relationship(
        "Conversation",
        back_populates="messages",
    )
