from pydantic import BaseModel


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenPayload(BaseModel):
    sub: str
    email: str
    
class LoginRequest(BaseModel):
    email: str
    password: str