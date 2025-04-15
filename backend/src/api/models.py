from pydantic import BaseModel, EmailStr

class User(BaseModel):
    name: str
    user_name: str
    email: EmailStr
    password: str
    is_admin: bool = False

class UserCreate(User): 
    pass