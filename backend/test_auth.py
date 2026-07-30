from app.db.session import SessionLocal
from app.dependencies.services import get_auth_service

db = SessionLocal()

service = get_auth_service()

token = service.authenticate_user(
    db,
    "sai@example.com",
    "Password@123",
)

print(token)

db.close()