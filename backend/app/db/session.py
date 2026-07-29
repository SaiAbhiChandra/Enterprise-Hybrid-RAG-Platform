from collections.abc import Generator

from sqlalchemy.orm import Session
from sqlalchemy.orm import sessionmaker

from app.db.database import engine


SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()