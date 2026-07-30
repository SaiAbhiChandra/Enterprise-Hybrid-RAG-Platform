from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


# Import models AFTER Base is defined
from app.models.user import User  # noqa: E402,F401
from app.models.document import Document  # noqa: E402,F401