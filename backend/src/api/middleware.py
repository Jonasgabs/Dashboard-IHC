from fastapi import Request, HTTPException
from fastapi.security import OAuth2PasswordBearer
from starlette.middleware.base import BaseHTTPMiddleware
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from src.api.security import SECRET_KEY, ALGORITHM
from src.api.db.database import get_db
from src.api.db.models import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# Rotas que não precisam de autenticação
PUBLIC_ROUTES = {"/", "/docs", "/openapi.json", "/auth/login", "/auth/register", "/register"}

class AuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        """
        Middleware de autenticação que protege rotas privadas verificando o token JWT.
        """

        request_path = request.url.path  # Captura a URL sem domínio
        print(f"🔍 Verificando autenticação para: {request_path}")  # Log de depuração

        # Se a rota for pública, continua normalmente
        if any(request_path.startswith(route) for route in PUBLIC_ROUTES):
            return await call_next(request)

        authorization: str = request.headers.get("Authorization")

        if not authorization or not authorization.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Token de autenticação ausente")

        token = authorization.split("Bearer ")[1]

        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            email: str = payload.get("sub")

            if email is None:
                raise HTTPException(status_code=401, detail="Token inválido")

            # Obtém uma sessão do banco de dados
            db: Session = next(get_db())
            user = db.query(User).filter(User.email == email).first()

            if user is None:
                raise HTTPException(status_code=401, detail="Usuário não encontrado")

        except JWTError:
            raise HTTPException(status_code=401, detail="Token inválido ou expirado")

        response = await call_next(request)
        return response

