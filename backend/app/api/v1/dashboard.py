from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User

from app.services.dashboard_service import DashboardService
from app.schemas.dashboard import DashboardResponse

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)

service = DashboardService()


@router.get(
    "",
    response_model=DashboardResponse,
)
def get_dashboard(

    db: Session = Depends(get_db),

    current_user: User = Depends(get_current_user),

):

    return service.get_dashboard(

        db=db,

        user_id=current_user.id,

    )