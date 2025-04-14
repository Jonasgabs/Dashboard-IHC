import openai
import os
import re
import json
import uuid
from typing import Optional

from dotenv import load_dotenv
from sqlalchemy.orm import Session

from src.api.db.database import get_db


load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Inicializa o cliente da OpenAI
client = openai.OpenAI(api_key=OPENAI_API_KEY)

# Estrutura na memória para armazenar o histórico da conversa e dados do lead
# Formato:
# {
#   "session_id": {
#       "history": [
#           {"role": "assistant", "content": "..."},
#           {"role": "user", "content": "..."},
#       ],
#       "lead_data": {
#           "nome": None,
#           "email": None,
#           "telefone": None,
#           "empresa": None,
#           "setor": None,
#           "interesse": None,
#           "mensagem": None,
#           "origem": "website"
#       },
#       "state": "INICIANTE"  # Exemplo de máquina de estados simples
#   }
# }
conversation_sessions = {}

def get_stateful_system_prompt(current_state: str, lead_data: dict) -> str:
    """
    Exemplo de função para gerar o system_prompt dinamicamente 
    de acordo com o 'estado' do usuário e/ou dados do lead.
    Para manter simples, vamos usar apenas variações leves. 
    Se quiser algo mais avançado, pode expandir as condições.
    """
    # Este é o prompt principal do 'Ricardo Nogueira', personalizado.
    # Podemos fazer pequenas variações se o estado for, por exemplo, 'INICIANTE', 'AVANCADO', etc.

    base_prompt = (
        "Você é **Ricardo Nogueira**, um assistente virtual da **People Change AI Consulting**, "
        "com um **tom natural e conversacional**, que fala com proximidade e empatia, sem parecer um robô.\n\n"

        "Sua missão é:\n"
        "1. **Entender as dores do cliente** e o contexto da empresa, criando conexão humana e demonstrando real interesse.\n"
        "2. **Explicar como a IA pode ajudar**, focando nos benefícios e nos ganhos práticos, porém sem revelar todos os detalhes técnicos. "
        "Manter a conversa no nível de 'café', informal, mas respeitoso e sem parecer amador.\n"
        "3. **Destacar a filosofia** da People Change AI Consulting — a IA existe para **complementar** e **potencializar** o trabalho humano, e não para substituí-lo. "
        "É uma tecnologia acessível, humanizada, ética e transparente.\n"
        "4. **Gerar curiosidade** e desejo de saber mais, sem entregar toda a solução. "
        "No máximo, sugerir alguns exemplos gerais e cases, mas sempre sem aprofundar em produtos específicos.\n"
        "5. **Manter o tom humano, acolhedor, com humor leve** quando oportuno, validando as preocupações e reconhecendo que cada negócio é único.\n"
        "6. **Coletar dados de contato** (nome, e-mail, telefone), mas **discretamente**, convidando o cliente a receber mais informações ou agendar uma conversa. "
        "Se algum dado já tiver sido coletado, não pedir novamente. Se o cliente recusar, respeitar e continuar a conversa, mas tentar novamente depois.\n"
        "7. **Retornar, ao final de cada resposta**, um bloco JSON (de forma invisível ao usuário) com a estrutura:\n"
        "```\n"
        "{\n"
        "  \"nome\": <string ou null>,\n"
        "  \"email\": <string ou null>,\n"
        "  \"telefone\": <string ou null>,\n"
        "  \"empresa\": <string ou null>,\n"
        "  \"setor\": <string ou null>,\n"
        "  \"interesse\": <string ou null>,\n"
        "  \"mensagem\": <string ou null>,\n"
        "  \"origem\": <string ou null>\n"
        "}\n"
        "```\n"
        "   - Caso ainda não tenha algum campo, use `null`.\n"
        "   - **Não** mostre esse JSON ao usuário e **não** comente que está coletando dados.\n"
        "   - Se o usuário **explicitamente** pedir para falar com um atendente humano, responda **apenas**:\n"
        "     `Entendido, um de nossos assistentes irá falar com você o mais breve possível!`\n"
        "\n"
        "## Estilo de Comunicação (Ricardo Nogueira)\n"
        "- **Tom de Voz**: Próximo, envolvente, **natural e conversacional** — como se estivesse realmente presente em um bate-papo.\n"
        "- **Pausas Naturais**: Use recursos como '(pausa breve)' para humanizar o ritmo e indicar reflexão.\n"
        "- **Empatia e Calor Humano**: Conecte-se às dúvidas e inseguranças do visitante, validando-as sem soar condescendente. "
        "Demonstre leveza e humor sutil quando couber.\n"
        "- **Nunca Parecer Um Script**: Evitar repetições mecânicas e transições bruscas. Variar expressões e reações.\n"
        "\n"
        "## Mindset de IA Humanizada — People Change AI Consulting\n"
        "1. **A IA liberta as pessoas** de tarefas repetitivas, não substitui o talento humano.\n"
        "2. **Qualquer empresa pode se beneficiar** da IA, sem grandes investimentos iniciais.\n"
        "3. **A tecnologia deve ser transparente e confiável**, garantindo a ética e a segurança dos dados.\n"
        "4. **A inovação é um meio**, não um fim — o foco é resolver problemas e melhorar processos, trazendo ganhos tangíveis ao dia a dia.\n"
        "\n"
        "## Estratégia de Conversa\n"
        "1. **Começar pelas dores** do visitante\n"
        "   - Perguntar: “Qual a maior dificuldade no dia a dia?”, “Em que área a equipe perde mais tempo?”, "
        "“Qual a principal prioridade do momento?”\n"
        "   - Validar com empatia: “Entendo perfeitamente... faz sentido estar preocupado com isso.”\n"
        "\n"
        "2. **Focar nos Benefícios**\n"
        "   - Mostrar como a IA **pode resolver problemas**, mas sem entrar em detalhes profundos de como funciona tecnicamente.\n"
        "   - Ressaltar: a IA **não substitui** pessoas, **otimiza** tarefas manuais.\n"
        "\n"
        "3. **Criar Curiosidade**\n"
        "   - Não entregar uma solução definitiva; sugerir que há diversos caminhos possíveis.\n"
        "   - Convidar o usuário para avançar em uma conversa mais detalhada.\n"
        "\n"
        "4. **Pedir Contato**\n"
        "   - De forma cordial e discreta: 'Posso enviar algumas ideias por e-mail?', 'Tem algum número para conversarmos quando for mais conveniente?'\n"
        "   - Se o usuário não fornecer, não forçar — mas tentar novamente em outro momento.\n"
        "\n"
        "5. **Humano Até o Fim**\n"
        "   - Em caso de objeções, responder de forma tranquilizadora e realista, enfatizando a abordagem humanizada.\n"
        "   - Reforçar que a IA é uma ferramenta para liberar tempo, não para eliminar pessoas.\n"
        "\n"
        "## Coleta de Dados e Retorno em JSON\n"
        "- **A cada resposta**, inclua **internamente** no final um JSON com as chaves:\n"
        "  - 'nome', 'email', 'telefone', 'empresa', 'setor', 'interesse', 'mensagem', 'origem'.\n"
        "- Se o chatbot não tiver algumas dessas informações, use `null`.\n"
        "- **Não** exibir nem mencionar esse JSON ao usuário.\n"
        "- Se ainda faltarem dados importantes (ex.: e-mail ou telefone), pergunte de forma **natural**.\n"
        "- Se o usuário disser que **quer falar diretamente com um atendente**, responder **exclusivamente**:\n"
        "  `Entendido, um de nossos assistentes irá falar com você o mais breve possível!`\n"
        "\n"
        "Boa conversa, Ricardo Nogueira!"
    )

    # Aqui poderíamos condicionar variações, se quiséssemos (ex.: INICIANTE, AVANCADO, etc.)
    # Exemplo bem simples (pode personalizar):
    if current_state == "INICIANTE":
        base_prompt += "\n\nObservação: O usuário parece iniciante, explique de forma ainda mais simples.\n"
    elif current_state == "AVANCADO":
        base_prompt += "\n\nObservação: O usuário já conhece um pouco de IA, pode ir mais direto ao ponto.\n"
    # Se quiser mais estados, basta adicionar.

    # Se quisermos usar o setor da empresa (caso conhecido), poderíamos inserir:
    setor = lead_data.get("setor")
    if setor and setor.lower() == "contabilidade":
        base_prompt += "\n\nObservação adicional: O usuário atua em contabilidade. Cite exemplos de IA nessa área quando pertinente.\n"

    return base_prompt


def chat_with_openai(
    user_message: str,
    db: Session,
    session_id: Optional[str] = None
) -> dict:
    """
    Conversa com a OpenAI, mantendo um histórico no backend, indexado por `session_id`.
    Se `session_id` for None, gera um novo. Se já existir, carrega o histórico e continua a conversa.
    
    Retorna um dicionário:
    {
      "response": <string da resposta da IA (sem JSON)>,
      "session_id": <string do id da sessão>
    }
    """
    global conversation_sessions

    # 1) Se o caller não fornecer um session_id, criamos um novo
    if not session_id:
        session_id = str(uuid.uuid4())  # Cria um UUID para identificar a conversa
        conversation_sessions[session_id] = {
            "history": [],
            "lead_data": {
                "nome": None,
                "email": None,
                "telefone": None,
                "empresa": None,
                "setor": None,
                "interesse": None,
                "mensagem": None,
                "origem": "website"
            },
            "state": "INICIANTE"  # Estado inicial
        }
    else:
        # Se não existir ainda, inicia vazio com default
        if session_id not in conversation_sessions:
            conversation_sessions[session_id] = {
                "history": [],
                "lead_data": {
                    "nome": None,
                    "email": None,
                    "telefone": None,
                    "empresa": None,
                    "setor": None,
                    "interesse": None,
                    "mensagem": None,
                    "origem": "website"
                },
                "state": "INICIANTE"
            }

    # 2) Obter o histórico e dados atuais
    conversation_history = conversation_sessions[session_id]["history"]
    current_lead_data = conversation_sessions[session_id]["lead_data"]
    current_state = conversation_sessions[session_id]["state"]

    # 3) Definir o system_prompt com base no estado e possíveis dados do lead
    system_prompt = get_stateful_system_prompt(current_state, current_lead_data)

    # 4) Montar a lista de mensagens para a OpenAI (system_prompt + histórico + nova mensagem)
    messages_for_openai = [{"role": "system", "content": system_prompt}] + conversation_history
    messages_for_openai.append({"role": "user", "content": user_message})

    try:
        # 5) Chamar GPT
        response = client.chat.completions.create(
            model="gpt-4",
            messages=messages_for_openai,
            temperature=0.7,
            max_tokens=1000  # aumentado para evitar cortes
        )
        ai_full_response = response.choices[0].message.content

        # 6) Guardar no histórico: usuário e resposta do assistente
        conversation_history.append({"role": "user", "content": user_message})
        conversation_history.append({"role": "assistant", "content": ai_full_response})

        # 7) Se o usuário quer falar com atendente, retorna imediatamente
        if "Entendido, um de nossos assistentes irá falar com você o mais breve possível!" in ai_full_response:
            return {
                "response": "Entendido, um de nossos assistentes irá falar com você o mais breve possível!",
                "session_id": session_id
            }

        # 8) Extrair e remover o bloco JSON (com ou sem backticks) e limpar a resposta
        extracted_json = None
        ai_response_without_json = ai_full_response

        # Regex para pegar bloco em triple backticks
        pattern = re.compile(r"```(?:json)?\s*(\{.*?\})\s*```", re.DOTALL | re.IGNORECASE)
        match = pattern.search(ai_full_response)
        if match:
            extracted_json = match.group(1).strip()
            ai_response_without_json = ai_full_response.replace(match.group(0), "")
        else:
            # Padrão alternativo, caso não esteja formatado em bloco
            pattern_alt = re.compile(r"\{\s*\"nome\".*?\}", re.DOTALL)
            match_alt = pattern_alt.search(ai_full_response)
            if match_alt:
                extracted_json = match_alt.group(0)
                ai_response_without_json = ai_full_response.replace(extracted_json, "")

        # Remover ocorrências isoladas da palavra "json"
        ai_response_without_json = re.sub(r"\bjson\b", "", ai_response_without_json, flags=re.IGNORECASE)

        # 9) Armazenar toda a conversa no campo "mensagem" do lead
        conversation_text = "\n".join([f"{msg['role']}: {msg['content']}" for msg in conversation_history])

        # Tentar parsear o JSON extraído
        if extracted_json:
            parsed_lead_data = parse_lead_json(extracted_json)
            if parsed_lead_data:
                # Atualizar somente os campos que não sejam None
                for field, value in parsed_lead_data.items():
                    if value is not None:
                        current_lead_data[field] = value

        # Atualizar o campo "mensagem" no lead_data
        current_lead_data["mensagem"] = conversation_text

        # -------------- Exemplo de mudança de estado (opcional) --------------
        # Pode analisar a mensagem do usuário para definir transição de estado:
        # Se o user_message contiver algo como "Já uso IA", podemos avançar o estado:
        if "já uso IA" in user_message.lower():
            conversation_sessions[session_id]["state"] = "AVANCADO"
        # Aqui podemos implementar outras lógicas para trocar estados.

        # 10) Salvar ou atualizar o lead no banco de dados
        lead, msg = save_or_update_lead(db, current_lead_data)

        # Não mostrar nada sobre JSON pro usuário
        conversation_history[-1]["content"] = ai_response_without_json.strip()

        # 11) Retornar a resposta limpa (sem JSON e sem backticks)
        return {
            "response": ai_response_without_json.strip(),
            "session_id": session_id
        }

    except Exception as e:
        # Em caso de exceção, logar ou retornar algo genérico
        return {
            "response": f"Desculpe, ocorreu um erro interno. Poderia tentar novamente mais tarde?\nDetalhes: {str(e)}",
            "session_id": session_id
        }


def parse_lead_json(json_block: Optional[str]) -> Optional[dict]:
    """
    Converte o bloco JSON para dicionário. Se não houver ou falhar, retorna None.
    """
    if not json_block:
        return None

    try:
        data = json.loads(json_block)
        return {
            "nome": data.get("nome"),
            "email": data.get("email"),
            "telefone": data.get("telefone"),
            "empresa": data.get("empresa"),
            "setor": data.get("setor"),
            "interesse": data.get("interesse"),
            "mensagem": data.get("mensagem"),
            "origem": data.get("origem"),
        }
    except json.JSONDecodeError:
        return None
