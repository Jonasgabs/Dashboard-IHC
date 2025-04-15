from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.api.db.database import get_db
from src.api.db.models import Produto
from pydantic import BaseModel, HttpUrl
from typing import List, Optional
import uuid
from datetime import datetime

router = APIRouter()


class ProdutoCreate(BaseModel):
    nome: str
    descricao: Optional[str] = None
    publico_alvo: Optional[str] = None
    dores: Optional[List[str]] = None
    beneficios: Optional[List[str]] = None
    palavras_chave: Optional[List[str]] = None
    link_compra: Optional[HttpUrl] = None
    ativo: Optional[bool] = True

class ProdutoOut(ProdutoCreate):
    id: uuid.UUID
    criado_em: datetime

    class Config:
        orm_mode = True

# ----------------------------
# CRUD Produtos
# ----------------------------

@router.post("/create", response_model=ProdutoOut)
def criar_produto(produto: ProdutoCreate, db: Session = Depends(get_db)):
    dados = produto.model_dump()
    if dados.get("link_compra"):
        dados["link_compra"] = str(dados["link_compra"])
    novo_produto = Produto(**dados)
    db.add(novo_produto)
    db.commit()  
    db.refresh(novo_produto)  
    return novo_produto  

@router.get("/list", response_model=List[ProdutoOut])
def listar_produtos(db: Session = Depends(get_db)):
    return db.query(Produto).all()

@router.get("/get/{produto_id}", response_model=ProdutoOut)
def obter_produto(produto_id: uuid.UUID, db: Session = Depends(get_db)):
    produto = db.query(Produto).filter(Produto.id == produto_id).first()
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    return produto

@router.put("/update/{produto_id}", response_model=ProdutoOut)
def atualizar_produto(produto_id: uuid.UUID, dados: ProdutoCreate, db: Session = Depends(get_db)):
    produto = db.query(Produto).filter(Produto.id == produto_id).first()
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")

    atualizados = dados.model_dump(exclude_unset=True)
    if atualizados.get("link_compra"):
        atualizados["link_compra"] = str(atualizados["link_compra"])

    for key, value in atualizados.items():
        setattr(produto, key, value)

    db.commit()
    db.refresh(produto)
    return produto

@router.delete("/delete/{produto_id}")
def deletar_produto(produto_id: uuid.UUID, db: Session = Depends(get_db)):
    produto = db.query(Produto).filter(Produto.id == produto_id).first()
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    db.delete(produto)
    db.commit()
    return {"message": "Produto deletado com sucesso."}
