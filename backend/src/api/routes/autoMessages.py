from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.api.db.database import get_db
from src.api.db.models import MensagemAutomatica
from pydantic import BaseModel
from typing import List, Optional
import uuid
from datetime import datetime

router = APIRouter()


class MensagemCreate(BaseModel):
    nome: str
    conteudo: str
    ativo: Optional[bool] = True

class MensagemOut(MensagemCreate):
    id: uuid.UUID
    criado_em: datetime

    class Config:
        orm_mode = True

# ----------------------------
# CRUD Mensagens Automáticas
# ----------------------------

@router.post("/create", response_model=MensagemOut)
def criar_mensagem(mensagem: MensagemCreate, db: Session = Depends(get_db)):
    nova = MensagemAutomatica(**mensagem.model_dump())
    db.add(nova)
    db.commit()
    db.refresh(nova)
    return nova

@router.get("/list", response_model=List[MensagemOut])
def listar_mensagens(db: Session = Depends(get_db)):
    return db.query(MensagemAutomatica).all()

@router.get("/get/{mensagem_id}", response_model=MensagemOut)
def obter_mensagem(mensagem_id: uuid.UUID, db: Session = Depends(get_db)):
    msg = db.query(MensagemAutomatica).filter(MensagemAutomatica.id == mensagem_id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Mensagem não encontrada")
    return msg

@router.put("/update/{mensagem_id}", response_model=MensagemOut)
def atualizar_mensagem(mensagem_id: uuid.UUID, dados: MensagemCreate, db: Session = Depends(get_db)):
    msg = db.query(MensagemAutomatica).filter(MensagemAutomatica.id == mensagem_id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Mensagem não encontrada")

    atualizados = dados.model_dump(exclude_unset=True)
    for key, value in atualizados.items():
        setattr(msg, key, value)

    db.commit()
    db.refresh(msg)
    return msg

@router.delete("/delete/{mensagem_id}")
def deletar_mensagem(mensagem_id: uuid.UUID, db: Session = Depends(get_db)):
    msg = db.query(MensagemAutomatica).filter(MensagemAutomatica.id == mensagem_id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Mensagem não encontrada")
    db.delete(msg)
    db.commit()
    return {"message": "Mensagem deletada com sucesso."}