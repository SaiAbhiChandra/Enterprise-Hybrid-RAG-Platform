from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.db.session import get_db

from app.dependencies.auth import get_current_user

from app.dashboard.schemas import DashboardResponse

from app.dashboard.service import dashboard_service

from app.models.user import User


router = APIRouter(

    prefix="/dashboard",

    tags=["Dashboard"],

)


@router.get(

    "",

    response_model=DashboardResponse,

)

def get_dashboard(

    db: Session = Depends(get_db),

    current_user: User = Depends(get_current_user),

):

    return dashboard_service.get_dashboard(

        db=db,

        owner_id=current_user.id,

    )