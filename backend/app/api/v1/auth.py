from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.dependencies.services import get_user_service
from app.schemas.user import UserCreate, UserResponse
from app.schemas.token import (
    Token,
    LoginRequest,
)
from app.services.user_service import UserService

from app.dependencies.services import (
    get_auth_service,
)

from fastapi.security import OAuth2PasswordRequestForm

from app.services.auth_service import (
    AuthenticationService,
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def register(
    user: UserCreate,
    db: Session = Depends(get_db),
    service: UserService = Depends(get_user_service),
):
    try:
        return service.register_user(db, user)

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
        
@router.post(
    "/login",
    response_model=Token,
)
def login(
    db: Session = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends(),
    service: AuthenticationService = Depends(
        get_auth_service,
    ),
):

    token = service.authenticate_user(
        db,
        form_data.username,   # username contains the email
        form_data.password,
    )

    if token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    return {
        "access_token": token,
        "token_type": "bearer",
    }