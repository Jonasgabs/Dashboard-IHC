from src.api.db.database import engine, Base
from src.api.db.models import Lead, User

print("Criando tabelas no banco de dados...")
Base.metadata.create_all(bind=engine)
print("Tabelas criadas com sucesso!")
