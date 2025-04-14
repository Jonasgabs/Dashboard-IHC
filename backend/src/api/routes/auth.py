from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.api.db.database import get_db
from src.api.models import UserCreate
from src.api.db.models import User
from src.api.security import hash_password, create_access_token, verify_password
from pydantic import BaseModel, EmailStr
from src.api.dependencies import get_current_user

router = APIRouter(prefix="/auth", tags=["Autenticação"])

class UserLogin(BaseModel):
    identifier: str  
    password: str


@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(
        (User.email == user.identifier) | (User.user_name == user.identifier)
    ).first()

    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=400, detail="Credenciais inválidas")

    if not db_user.is_active:
        raise HTTPException(status_code=403, detail="Usuário inativo")

    token = create_access_token({"sub": db_user.email})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "name": db_user.name,
            "email": db_user.email,
            "user_name": db_user.user_name,
            "is_admin": db_user.is_admin,
            "is_key_user": db_user.is_key_user
        }
    }


@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="E-mail já está em uso.")
    if db.query(User).filter(User.user_name == user.user_name).first():
        raise HTTPException(status_code=400, detail="Nome de usuário já está em uso.")

    is_first_user = db.query(User).count() == 0

    new_user = User(
        name=user.name,
        user_name=user.user_name,  
        email=user.email,
        password=hash_password(user.password),
        is_active=True,
        is_admin=is_first_user,      
        is_key_user=is_first_user    
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    token = create_access_token({"sub": new_user.email})
    return {"access_token": token, "token_type": "bearer"}


@router.get("/me")
def get_current(current_user: User = Depends(get_current_user)):
    return {
        "name": current_user.name,
        "user_name": current_user.user_name,
        "email": current_user.email,
        "is_key_user": current_user.is_key_user,
        "is_admin": current_user.is_admin
    }
