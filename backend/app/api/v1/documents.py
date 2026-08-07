from fastapi import APIRouter
from fastapi import Depends
from fastapi import File
from fastapi import UploadFile
from fastapi import status

from sqlalchemy.orm import Session

from app.db.session import get_db
from app.dependencies.auth import get_current_user
from app.dependencies.services import get_document_service
from app.models.user import User
from app.schemas.document import DocumentResponse
from app.services.document_service import DocumentService

router = APIRouter(
    prefix="/documents",
    tags=["Documents"],
)


@router.post(
    "/upload",
    response_model=DocumentResponse,
    status_code=status.HTTP_201_CREATED,
)
async def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user,
    ),
    service: DocumentService = Depends(
        get_document_service,
    ),
):

    document = await service.upload_document(
        db=db,
        file=file,
        owner_id=current_user.id,
    )

    return document


@router.get(
    "",
    response_model=list[DocumentResponse],
)
def list_documents(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user,
    ),
    service: DocumentService = Depends(
        get_document_service,
    ),
):

    return service.list_documents(
        db=db,
        owner_id=current_user.id,
    )


@router.get(
    "/{document_id}",
    response_model=DocumentResponse,
)
def get_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user,
    ),
    service: DocumentService = Depends(
        get_document_service,
    ),
):

    return service.get_owned_document(
        db=db,
        document_id=document_id,
        owner_id=current_user.id,
    )


@router.delete(
    "/{document_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user,
    ),
    service: DocumentService = Depends(
        get_document_service,
    ),
):

    await service.delete_document(
        db=db,
        document_id=document_id,
        owner_id=current_user.id,
    )
