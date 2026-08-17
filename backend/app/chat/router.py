import json

from fastapi import APIRouter
from fastapi import Depends

from app.chat.schemas import ChatRequest, ChatResponse, RegenerateRequest
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


def _sse_stream(conversation, user_message, sources, token_generator, result_holder):
    """
    Shared Server-Sent Events builder for both /chat/stream and
    /chat/regenerate -- they produce identical event shapes, just
    from different service calls that prepare the same pieces.

    Three event types:

      meta  -- sent once, immediately: {conversation_id, sources, ...}
      token -- sent per generated token: {text}
      done  -- sent once, at the end: {assistant_message_id}

    Sending `meta` first (rather than only returning it in the
    non-streaming /chat response) lets the frontend show citations
    and update the conversation sidebar as soon as retrieval
    finishes, without waiting for the full answer to be generated.
    The assistant message's real database id is only known after the
    full answer has been generated and saved -- result_holder is
    populated by token_generator as a side effect once it's fully
    exhausted below, so it's ready by the time `done` is sent. This
    id lets the frontend later regenerate this exact reply without
    a page reload in between.
    """

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

    done_payload = {
        "assistant_message_id": result_holder.get("assistant_message_id"),
    }

    yield f"event: done\ndata: {json.dumps(done_payload)}\n\n"


@router.post("/stream")
def stream_chat(
    request: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    service: ChatService = Depends(get_chat_service),
):

    conversation, user_message, sources, token_generator, result_holder = (
        service.stream_chat(
            db=db,
            request=request,
            owner_id=current_user.id,
        )
    )

    return StreamingResponse(
        _sse_stream(
            conversation, user_message, sources, token_generator, result_holder
        ),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )


@router.post("/regenerate")
def regenerate_chat(
    request: RegenerateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    service: ChatService = Depends(get_chat_service),
):
    """
    Regenerates a specific assistant reply in-place: the stale reply
    is deleted and a fresh one is streamed back for the same
    question, without duplicating the question itself in the
    conversation's history.
    """

    conversation, user_message, sources, token_generator, result_holder = (
        service.regenerate(
            db=db,
            conversation_id=request.conversation_id,
            message_id=request.message_id,
            owner_id=current_user.id,
        )
    )

    return StreamingResponse(
        _sse_stream(
            conversation, user_message, sources, token_generator, result_holder
        ),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )
