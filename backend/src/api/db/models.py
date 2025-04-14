from sqlalchemy import (
    Column, String, DateTime, func, Integer, Boolean, Float, ForeignKey, Text, ARRAY
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from src.api.db.database import Base
import uuid

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    user_name = Column(String(255), nullable=False, unique= True)  
    email = Column(String(255), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)  
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    is_key_user = Column(Boolean, default=False)
    created_at = Column(DateTime, default=func.now())  


class Lead(Base):
    __tablename__ = "leads"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nome = Column(String(255), nullable=True)
    instagram_id = Column(String(255), nullable=True)
    facebook_id = Column(String(255), nullable=True)
    telefone = Column(String(20), nullable=True)
    canal_origem = Column(String(50), nullable=True)  # instagram, facebook, pesquisa_ativa
    status = Column(String(50), nullable=False, default="interagido")  # interagido, qualificado, convertido, ignorado, chamado
    produto_sugerido = Column(String(255), nullable=True)
    respondeu = Column(Boolean, default=False)
    tentou_chamada = Column(Boolean, default=False)
    ativo = Column(Boolean, default=True)
    criado_em = Column(DateTime, default=func.now())

    mensagens = relationship("Mensagem", back_populates="lead", cascade="all, delete-orphan")
    chamadas = relationship("Chamada", back_populates="lead", cascade="all, delete-orphan")
    interacoes = relationship("Interacao", back_populates="lead", cascade="all, delete-orphan")


class Mensagem(Base):
    __tablename__ = "mensagens"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    lead_id = Column(UUID(as_uuid=True), ForeignKey("leads.id", ondelete="CASCADE"), nullable=False)
    canal = Column(String(20))  # instagram, facebook
    origem = Column(String(20))  # bot, usuario
    conteudo = Column(Text)
    data_envio = Column(DateTime, default=func.now())

    lead = relationship("Lead", back_populates="mensagens")


class Chamada(Base):
    __tablename__ = "chamadas"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    lead_id = Column(UUID(as_uuid=True), ForeignKey("leads.id", ondelete="CASCADE"), nullable=False)
    numero = Column(String(20))
    status = Column(String(50))  # agendada, realizada, falha
    data_chamada = Column(DateTime, default=func.now())

    lead = relationship("Lead", back_populates="chamadas")


class Interacao(Base):
    __tablename__ = "interacoes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    lead_id = Column(UUID(as_uuid=True), ForeignKey("leads.id", ondelete="CASCADE"), nullable=False)
    tipo = Column(String(50))  # comentario, story_reply, dm, like, contato_externo
    canal = Column(String(20))  # instagram, facebook
    conteudo = Column(Text)
    data_interacao = Column(DateTime, default=func.now())

    lead = relationship("Lead", back_populates="interacoes")


class Produto(Base):
    __tablename__ = "produtos"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nome = Column(String(255), nullable=False)
    descricao = Column(Text, nullable=True)
    publico_alvo = Column(Text, nullable=True)
    dores = Column(ARRAY(Text), nullable=True)
    beneficios = Column(ARRAY(Text), nullable=True)
    palavras_chave = Column(ARRAY(String), nullable=True)
    link_compra = Column(String(500), nullable=True)
    ativo = Column(Boolean, default=True)
    criado_em = Column(DateTime, default=func.now())


class SistemaMetricas(Base):
    __tablename__ = "sistema_metricas"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    ano = Column(Integer, nullable=False)
    mes = Column(Integer, nullable=False)
    mensagens_enviadas = Column(Integer, default=0)
    interacoes_chatbot = Column(Integer, default=0)
    chamadas_realizadas = Column(Integer, default=0)
    leads_qualificados = Column(Integer, default=0)
    armazenamento_mb = Column(Float, default=0.0)
    atualizado_em = Column(DateTime, default=func.now(), onupdate=func.now())
