from sqlalchemy.orm import Session

from app.repositories.user_repository import UserRepository
from app.security.jwt import create_access_token
from app.security.password import verify_password


class AuthenticationService:
    def __init__(
        self,
        repository: UserRepository,
    ):
        self.repository = repository

    def authenticate_user(
        self,
        db: Session,
        email: str,
        password: str,
    ):

        user = self.repository.get_by_email(
            db,
            email,
        )

        if not user:
            return None

        if not verify_password(
            password,
            user.hashed_password,
        ):
            return None

        access_token = create_access_token(
            {
                "sub": str(user.id),
                "email": user.email,
            }
        )

        return access_token