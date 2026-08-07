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
):

    print("\n==============================")
    print("TOKEN RECEIVED:")
    print(token)

    try:
        payload = verify_token(token)

        print("PAYLOAD:")
        print(payload)

        user_id = payload.get("sub")
        email = payload.get("email")

        print("USER ID:", user_id)
        print("EMAIL:", email)

    except Exception as e:
        print("JWT ERROR:", repr(e))
        raise HTTPException(
            status_code=401,
            detail="Could not validate credentials",
        )

    user = user_repository.get_by_id(
        db,
        int(user_id),
    )

    print("DB USER:", user)

    if user is None:
        print("USER NOT FOUND")
        raise HTTPException(
            status_code=401,
            detail="Could not validate credentials",
        )

    print("AUTH SUCCESS")
    print("==============================\n")

    return user