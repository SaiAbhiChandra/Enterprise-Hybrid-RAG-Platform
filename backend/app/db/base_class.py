from app.db.base import Base

# Import all models here so Alembic can discover them.
from app.models.user import User  # noqa: F401