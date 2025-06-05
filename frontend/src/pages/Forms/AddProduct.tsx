
import { useState } from "react";
import axios from "axios";

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";

import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import TextArea from "../../components/form/input/TextArea";
import Switch from "../../components/form/switch/Switch";
import Tooltip from "../../components/ui/tooltips/Tooltip"; 

const serverUrl = import.meta.env.VITE_SERVER;

export default function AddProduto() {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [publicoAlvo, setPublicoAlvo] = useState("");
  const [linkCompra, setLinkCompra] = useState("");
  const [ativo, setAtivo] = useState(true);
  const [palavraChaveAtual, setPalavraChaveAtual] = useState("");
  const [palavrasChave, setPalavrasChave] = useState<string[]>([]);
  const [dores, setDores] = useState<string[]>([]);
  const [beneficios, setBeneficios] = useState<string[]>([]);
  const [novaDor, setNovaDor] = useState("");
  const [novoBeneficio, setNovoBeneficio] = useState("");

  const adicionarItem = (_: string, set: any, value: string, clear: () => void) => {
    if (value.trim()) {
      set((prev: string[]) => [...prev, value.trim()]);
      clear();
    }
  };

  const removerItem = (index: number, set: any) => {
    set((prev: string[]) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        nome,
        descricao,
        publico_alvo: publicoAlvo,
        dores,
        beneficios,
        palavras_chave: palavrasChave,
        link_compra: linkCompra,
        ativo,
      };
      await axios.post(`${serverUrl}/products/create`, payload);
      alert("Produto criado com sucesso!");
     
      setNome("");
      setDescricao("");
      setPublicoAlvo("");
  
    } catch (error) {
      console.error("Produto criado com sucesso!", error);
      alert("Produto criado com sucesso!");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <PageMeta title="Cadastrar Produto" description="Formulário de Cadastro de Produto" />
      <PageBreadcrumb pageTitle="Novo Produto" />
      <div className="space-y-6">
        <ComponentCard title="Informações Gerais">
          <div className="flex items-center space-x-2">
            <Label>Nome do Produto</Label>
            <Tooltip text="Informe o nome principal do seu produto ou serviço. Seja claro e direto." position="right" />
          </div>
          <Input value={nome} onChange={(e) => setNome(e.target.value)} />

          <div className="flex items-center space-x-2 mt-4"> 
            <Label>Descrição</Label>
            <Tooltip text="Descreva detalhadamente o produto, seus recursos, funcionalidades e o que o torna único." position="right" />
          </div>
          <TextArea value={descricao} onChange={setDescricao} rows={4} />

          <div className="flex items-center space-x-2 mt-4">
            <Label>Público Alvo</Label>
            <Tooltip text="Defina para quem este produto é destinado. Ex: 'Pequenas empresas de varejo'." position="right" />
          </div>
          <TextArea value={publicoAlvo} onChange={setPublicoAlvo} rows={4} />

          <div className="flex items-center space-x-2 mt-4">
            <Label>Link de Compra</Label>
            <Tooltip text="Insira a URL completa (http:// ou https://) para a página de vendas." position="right" />
          </div>
          <Input
            type="url"
            value={linkCompra}
            onChange={(e) => setLinkCompra(e.target.value)}
            placeholder="https://"
          />

          <div className="flex items-center space-x-2 mt-4">
            <Label>Ativo</Label>
            <Tooltip text="Marque para indicar se o produto está disponível. Desmarque para ocultá-lo." position="right" />
          </div>
          <Switch label="Produto ativo?" defaultChecked={ativo} onChange={setAtivo} />
        </ComponentCard>

        <ComponentCard title="Conteúdo Estratégico">
          <div className="flex items-center space-x-2">
            <Label>Dores</Label>
            <Tooltip text="Quais problemas este produto resolve? Adicione um por vez." position="right" />
          </div>
          <div className="flex gap-2 mb-2">
            <Input
              value={novaDor}
              onChange={(e) => setNovaDor(e.target.value)}
              placeholder="Digite uma dor"
            />
            <button
              onClick={() => adicionarItem("dor", setDores, novaDor, () => setNovaDor(""))}
              className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 shrink-0" 
            >
              Adicionar
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {dores.map((dor, index) => (
              <span key={index} className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full flex items-center"> 
                {dor}
                <button
                  onClick={() => removerItem(index, setDores)}
                  className="ml-1.5 text-red-500 hover:text-red-700 text-sm" 
                >×</button>
              </span>
            ))}
          </div>

          <div className="flex items-center space-x-2 mt-4">
            <Label>Benefícios</Label>
            <Tooltip text="Quais vantagens seu produto oferece? Adicione um por vez." position="right" />
          </div>
          <div className="flex gap-2 mb-2">
            <Input
              value={novoBeneficio}
              onChange={(e) => setNovoBeneficio(e.target.value)}
              placeholder="Digite um benefício"
            />
            <button
              onClick={() => adicionarItem("beneficio", setBeneficios, novoBeneficio, () => setNovoBeneficio(""))}
              className="px-4 py-2 text-sm bg-green-500 text-white rounded hover:bg-green-600 shrink-0"
            >
              Adicionar
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {beneficios.map((b, index) => (
              <span key={index} className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center"> 
                {b}
                <button
                  onClick={() => removerItem(index, setBeneficios)}
                  className="ml-1.5 text-green-500 hover:text-green-700 text-sm" 
                >×</button>
              </span>
            ))}
          </div>

          <div className="flex items-center space-x-2 mt-4">
            <Label>Palavras-chave</Label>
            <Tooltip text="Termos relevantes que descrevem seu produto. Adicione um por vez." position="right" />
          </div>
          <div className="flex gap-2 items-center">
            <Input
              value={palavraChaveAtual}
              onChange={(e) => setPalavraChaveAtual(e.target.value)}
              placeholder="Digite uma palavra-chave"
            />
            <button
              onClick={() => adicionarItem("palavra", setPalavrasChave, palavraChaveAtual, () => setPalavraChaveAtual(""))}
              className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 shrink-0"
            >
              Adicionar
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {palavrasChave.map((tag, index) => (
              <span
                key={index}
                className="flex items-center gap-1 px-2.5 py-0.5 bg-gray-200 text-xs rounded-full dark:bg-white/10 dark:text-gray-300" 
              >
                {tag}
                <button
                  onClick={() => removerItem(index, setPalavrasChave)}
                  className="ml-1 text-red-500 hover:text-red-700 text-sm" 
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </ComponentCard>

        <div className="text-center mt-6"> 
          <button
            onClick={handleSubmit}
            className="px-6 py-2.5 text-sm text-white bg-blue-600 rounded hover:bg-blue-700" 
          >
            Criar Produto
          </button>
        </div>
      </div>
    </div>
  );
}