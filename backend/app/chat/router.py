import json

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
        owner_id=current_user.id,
    )


@router.post("/stream")
def stream_chat(
    request: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    service: ChatService = Depends(get_chat_service),
):
    """
    Server-Sent Events stream with three event types:

      meta  -- sent once, immediately: {conversation_id, sources}
      token -- sent per generated token: {text}
      done  -- sent once, at the end (empty payload)

    Sending `meta` first (rather than only returning it in the
    non-streaming /chat response) lets the frontend show citations
    and update the conversation sidebar as soon as retrieval
    finishes, without waiting for the full answer to be generated.
    """

    conversation, user_message, sources, token_generator = service.stream_chat(
        db=db,
        request=request,
        owner_id=current_user.id,
    )

    def event_stream():

        meta = {
            "conversation_id": conversation.id,
            "conversation_title": conversation.title,
            "user_message_id": user_message.id,
            "sources": [source.model_dump() for source in sources],
        }

        yield f"event: meta\ndata: {json.dumps(meta)}\n\n"

        for token in token_generator:
            payload = json.dumps({"text": token})
            yield f"event: token\ndata: {payload}\n\n"

        yield "event: done\ndata: {}\n\n"

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )
