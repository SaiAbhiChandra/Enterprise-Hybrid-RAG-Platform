from app.db.base import Base
from app.db.database import engine


def create_tables() -> None:
    Base.metadata.create_all(bind=engine)