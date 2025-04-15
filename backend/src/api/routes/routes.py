from fastapi import APIRouter, Depends, HTTPException
from src.api.security import create_access_token, verify_password, hash_password

from sqlalchemy.orm import Session
from src.api.models import UserCreate

from src.api.db.database import get_db
from src.api.dependencies import get_current_user

from src.api.db.models import Lead, User
from pydantic import BaseModel, EmailStr
import uuid
from typing import List, Optional

from datetime import datetime


router = APIRouter()
#users 
class UserLogin(BaseModel):
    email: EmailStr  
    password: str

class UpdateStatusRequest(BaseModel):
    is_active: bool

# Modelo para receber os dados do lead
class LeadCreate(BaseModel):
    nome: str
    email: str
    telefone: str
    empresa: str = None
    setor: str = None
    interesse: str
    mensagem: str = None
    origem: str = "website"

class LeadResponse(BaseModel):
    id: uuid.UUID
    nome: str
    email: Optional[str]
    telefone: Optional[str]
    empresa: Optional[str] = None
    setor: Optional[str] = None
    interesse: Optional[str]
    mensagem: str = None
    origem: str
    data_criacao: datetime

    class Config:
        orm_mode = True

@router.post("/leads")
def salvar_lead(lead: LeadCreate, db: Session = Depends(get_db)):
    try:
        novo_lead = Lead(
            id=uuid.uuid4(),
            nome=lead.nome,
            email=lead.email,
            telefone=lead.telefone,
            empresa=lead.empresa,
            setor=lead.setor,
            interesse=lead.interesse,
            mensagem=lead.mensagem,
            origem=lead.origem
        )
        db.add(novo_lead)
        db.commit()
        db.refresh(novo_lead)
        return {"message": "Lead salvo com sucesso!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/leads", response_model=List[LeadResponse])
def listar_leads(db: Session = Depends(get_db)):
    try:
        leads = db.query(Lead).all()
        return leads
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# users

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()

    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=400, detail="Credenciais inválidas")
    
    if not db_user.is_active:
        raise HTTPException(status_code=403, detail="Usuário inativo. Contate um gestor.")

    token = create_access_token({"sub": db_user.email})
    print("📌 Token gerado:", token)  

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {"name": db_user.name, "email": db_user.email}
    }


