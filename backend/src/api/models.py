from pydantic import BaseModel, EmailStr

class User(BaseModel):
    name: str  # Nome completo do usuário
    email: EmailStr  # Email do usuário
    password: str  # Senha do usuário

class UserCreate(User): 
    pass