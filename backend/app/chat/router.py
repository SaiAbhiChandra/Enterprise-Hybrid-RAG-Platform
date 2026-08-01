from fastapi import APIRouter
from fastapi import Depends

from app.chat.schemas import ChatRequest, ChatResponse
from app.chat.service import ChatService
from app.dependencies.auth import get_current_user
from app.dependencies.services import get_chat_service
from app.models.user import User

from sqlalchemy.orm import Session
from app.db.session import get_db

from fastapi.responses import StreamingResponse

router = APIRouter(
    prefix="/chat",
    tags=["Chat"],
)


@router.post(
    "",
    response_model=ChatResponse,
)
def chat(
    request: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    service: ChatService = Depends(get_chat_service),
):

    return service.chat(
        db=db,
        request=request,
    )
    
@router.post("/stream")
def stream_chat(
    request: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    service: ChatService = Depends(get_chat_service),
):

    return StreamingResponse(
        service.stream_chat(
            db=db,
            request=request,
        ),
        media_type="text/plain",
    )