from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


# Import models so they are registered with SQLAlchemy metadata.
from app.models.user import User  # noqa: E402,F401