from fastapi import APIRouter
from fastapi import Depends
from fastapi import status

from sqlalchemy.orm import Session

from app.db.session import get_db
from app.dependencies.auth import get_current_user
from app.dependencies.services import get_conversation_service
from app.models.user import User
from app.chat.conversation_service import ConversationService
from app.chat.schemas import (
    ConversationSummary,
    ConversationDetail,
    ConversationRename,
)

router = APIRouter(
    prefix="/conversations",
    tags=["Conversations"],
)


@router.get(
    "",
    response_model=list[ConversationSummary],
)
def list_conversations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    service: ConversationService = Depends(
        get_conversation_service,
    ),
):

    return service.list_conversations(
        db=db,
        owner_id=current_user.id,
    )


@router.get(
    "/{conversation_id}",
    response_model=ConversationDetail,
)
def get_conversation(
    conversation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    service: ConversationService = Depends(
        get_conversation_service,
    ),
):

    return service.get_conversation_with_messages(
        db=db,
        conversation_id=conversation_id,
        owner_id=current_user.id,
    )


@router.patch(
    "/{conversation_id}",
    response_model=ConversationSummary,
)
def rename_conversation(
    conversation_id: int,
    payload: ConversationRename,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    service: ConversationService = Depends(
        get_conversation_service,
    ),
):

    return service.rename_conversation(
        db=db,
        conversation_id=conversation_id,
        owner_id=current_user.id,
        title=payload.title,
    )


@router.delete(
    "/{conversation_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_conversation(
    conversation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    service: ConversationService = Depends(
        get_conversation_service,
    ),
):

    service.delete_conversation(
        db=db,
        conversation_id=conversation_id,
        owner_id=current_user.id,
    )
