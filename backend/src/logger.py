import logging
from fastapi import Request
from fastapi import HTTPException
from starlette.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

logging.basicConfig(filename="errors.log", level=logging.ERROR)

class LogMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        print(f"📥 Request recebido: {request.method} {request.url}")  # LOG 1
        try:
            response = await call_next(request)
            print(f"✅ Resposta enviada: {response.status_code}")  # LOG 2
            return response
        except HTTPException as e:
            return JSONResponse(status_code=e.status_code, content={"detail": e.detail})  
        except Exception as e:
            print(f"❌ Erro inesperado: {str(e)}")  
            return JSONResponse(status_code=500, content={"detail": "Unexpected error occurred"})
