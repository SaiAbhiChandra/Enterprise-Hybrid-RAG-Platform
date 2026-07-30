from app.security.jwt import (
    create_access_token,
    verify_token,
)

token = create_access_token(
    {
        "sub": "1",
        "email": "sai@example.com",
    }
)

print("TOKEN:\n")
print(token)

print("\nPAYLOAD:\n")

print(
    verify_token(token)
)