from fastapi import FastAPI, HTTPException, File, UploadFile, Depends
from fastapi.openapi.utils import get_openapi
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response
from dotenv import load_dotenv
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import Optional
import os
import ffmpeg
import tempfile
from google.oauth2 import service_account
# Importando rotas
from src.api.routes.auth import router as auth_router
from src.api.middleware import AuthMiddleware
from src.logger import LogMiddleware
from src.api.db.database import get_db
from src.api.services.openai_service import chat_with_openai
from src.api.routes.routes import router as leads_router
from src.api.routes.routes import router as user_router
# Google Cloud APIs
from google.cloud import speech, texttospeech


#google- API
class TextToSpeechRequest(BaseModel):
    text: str

#histórico da conversa IA
class ChatRequest(BaseModel):
    session_id: Optional[str]
    message: str


load_dotenv()

#Configurar credenciais do Google Cloud
google_credentials = os.getenv("GOOGLE_SPEECH_TO_TEXT")
"""
if not google_credentials:
    raise ValueError("Erro: A variável GOOGLE_SPEECH_TO_TEXT não foi encontrada no .env!")

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = google_credentials

#Inicializar clientes do Google Cloud (depois do carregamento das credenciais)
speech_client = speech.SpeechClient()
tts_client = texttospeech.TextToSpeechClient()

"""

try:
    #Verificar se a variável contém um JSON ou um caminho
    if google_credentials.startswith("{"):
        print("🔍 JSON detectado na variável de ambiente. Criando arquivo temporário...")

        #Criar um arquivo temporário
        temp_cred_path = "/tmp/google_credentials.json"
        with open(temp_cred_path, "w") as f:
            f.write(google_credentials)

        #Atualizar variável para apontar para o arquivo temporário
        os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = temp_cred_path

    else:
        #Se for um caminho, usá-lo diretamente
        print("🔍 Caminho detectado, usando diretamente.")
        os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = google_credentials

    #Inicializar credenciais do Google Cloud
    credentials = service_account.Credentials.from_service_account_file(os.getenv("GOOGLE_APPLICATION_CREDENTIALS"))

    #Inicializar clientes do Google Cloud
    speech_client = speech.SpeechClient(credentials=credentials)
    tts_client = texttospeech.TextToSpeechClient(credentials=credentials)

    print("✅ Google Cloud Clients Inicializados com sucesso!")

except Exception as e:
    raise ValueError(f"❌ ERRO ao configurar as credenciais do Google Cloud: {e}")


app = FastAPI()

#Configuração do OAuth2PasswordBearer para o Swagger
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

#Middlewares
app.add_middleware(AuthMiddleware)
app.add_middleware(LogMiddleware)

#Configuração do CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite requisições de qualquer origem
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos os métodos (GET, POST, OPTIONS, etc.)
    allow_headers=["*"],  # Permite todos os headers
)

#Inclusão das rotas
app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(leads_router, prefix="/leads", tags=["leads"])
app.include_router(user_router, prefix="/users", tags=["users"])

@app.get("/")
def read_root():
    return {"message": "leading prospect API funcionando!"}

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest, db: Session = Depends(get_db)):
    """
    Recebe a mensagem do usuário e um session_id (opcional).
    Retorna a resposta da IA e o session_id usado/gerado.
    """
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Mensagem não pode estar vazia")

    # Chama a função da IA, que recebe user_message, db, e session_id
    result = chat_with_openai(
        user_message=request.message,
        db=db,
        session_id=request.session_id  # pode ser None
    )

    # A função 'chat_with_openai' retornará algo como {"response": "...", "session_id": "..."}
    return {
        "response": result["response"],
        "session_id": result["session_id"]
    }

@app.post("/api/voice-to-text")
async def transcribe_audio(file: UploadFile = File(...)):
    """ Recebe um arquivo de áudio, converte para FLAC e envia para o Google Speech-to-Text """
    try:
        #Criar arquivos temporários para armazenar o áudio original e convertido
        with tempfile.NamedTemporaryFile(delete=False, suffix=f".ogg") as temp_audio:
            temp_audio.write(await file.read())
            temp_audio_path = temp_audio.name  # Caminho do arquivo original

        temp_flac_path = temp_audio_path.replace(".ogg", ".flac")  # Caminho do arquivo convertido

        #Converter para FLAC usando FFmpeg
        try:
            ffmpeg.input(temp_audio_path).output(temp_flac_path, ar=16000, ac=1, format="flac").run(overwrite_output=True)
            print(f"✅ Conversão para FLAC concluída: {temp_flac_path}")
        except Exception as e:
            print(f"❌ Erro ao converter áudio para FLAC: {str(e)}")
            raise HTTPException(status_code=500, detail="Erro ao converter áudio para FLAC")

        #Ler o áudio convertido para enviar ao Google
        with open(temp_flac_path, "rb") as flac_audio:
            audio_content = flac_audio.read()

        #Criar objeto Audio para a API do Google
        audio = speech.RecognitionAudio(content=audio_content)

        #Configuração correta para FLAC (16000 Hz)
        config = speech.RecognitionConfig(
            encoding=speech.RecognitionConfig.AudioEncoding.FLAC,
            sample_rate_hertz=16000,  # 🎤 Frequência de amostragem correta
            language_code="pt-PT"
        )

        print("📢 Enviando áudio para o Google Speech-to-Text...")
        response = speech_client.recognize(config=config, audio=audio)

        if response.results:
            transcript = response.results[0].alternatives[0].transcript
            print(f"✅ Transcrição bem-sucedida: {transcript}")
        else:
            transcript = "Não foi possível reconhecer a fala."
            print("❌ Nenhuma fala reconhecida pelo Google.")

        #Remover arquivos temporários
        os.remove(temp_audio_path)
        os.remove(temp_flac_path)

        return {"transcription": transcript}

    except Exception as e:
        print(f"❌ Erro ao processar o áudio: {str(e)}")
        return JSONResponse(content={"error": str(e)}, status_code=500)

@app.post("/api/text-to-speech")
async def synthesize_speech(request: TextToSpeechRequest):
    """ Converte texto em áudio usando Google Text-to-Speech (voz masculina natural) """
    try:
        synthesis_input = texttospeech.SynthesisInput(text=request.text)

        #Escolher voz masculina mais natural do Google
        voice = texttospeech.VoiceSelectionParams(
            language_code="pt-PT",  # Português do Brasil
            name="pt-PT-Wavenet-B",  
            ssml_gender=texttospeech.SsmlVoiceGender.MALE
        )

        audio_config = texttospeech.AudioConfig(
            audio_encoding=texttospeech.AudioEncoding.MP3,
            speaking_rate=1.0,  # Velocidade normal da fala
            pitch=0.0,  # Tom neutro
            volume_gain_db=0.0  # Sem alteração de volume
        )

        response = tts_client.synthesize_speech(
            input=synthesis_input, voice=voice, audio_config=audio_config
        )

        return Response(content=response.audio_content, media_type="audio/mpeg")

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

#Função para personalizar o OpenAPI e garantir que o Swagger reconheça o OAuth2
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="Leadin Prospect",
        version="1.0.0",
        description="API do Leadin Prospect",
        routes=app.routes,
    )
    openapi_schema["components"]["securitySchemes"] = {
        "OAuth2PasswordBearer": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT"
        }
    }
    app.openapi_schema = openapi_schema
    return app.openapi_schema

#Define a nova configuração OpenAPI
app.openapi = custom_openapi