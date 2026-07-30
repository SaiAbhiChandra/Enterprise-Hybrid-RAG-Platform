from fastapi import Depends, HTTPException, status
from jose import JWTError
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User
from app.repositories.user_repository import user_repository
from app.schemas.token import TokenPayload
from app.security.jwt import verify_token
from app.security.oauth2 import oauth2_scheme


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
    )

    try:

        payload = verify_token(token)

        user_id = payload.get("sub")
        email = payload.get("email")

        if user_id is None:
            raise credentials_exception

        token_data = TokenPayload(
            sub=user_id,
            email=email,
        )

    except JWTError:
        raise credentials_exception

    user = user_repository.get_by_id(
        db,
        int(token_data.sub),
    )

    if user is None:
        raise credentials_exception

    return user