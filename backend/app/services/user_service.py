from sqlalchemy.orm import Session

from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.user import UserCreate
from app.security.password import hash_password


class UserService:
    def __init__(
        self,
        repository: UserRepository,
    ):
        self.repository = repository

    def register_user(
        self,
        db: Session,
        user: UserCreate,
    ) -> User:

        existing_user = self.repository.get_by_email(
            db,
            user.email,
        )

        if existing_user:
            raise ValueError(
                "User with this email already exists."
            )

        db_user = User(
            full_name=user.full_name,
            email=user.email,
            hashed_password=hash_password(
                user.password
            ),
            is_active=True,
        )

        try:
            user = self.repository.create(
                db,
                db_user,
            )
            db.commit()
            return user
        except Exception:
            db.rollback()
            raise