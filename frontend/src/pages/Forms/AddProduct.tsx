import { useState } from "react";
import axios from "axios";

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";

import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import TextArea from "../../components/form/input/TextArea";
import Switch from "../../components/form/switch/Switch";

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
    } catch (error) {
      console.error("Erro ao criar produto:", error);
      alert("Produto criado com sucesso!");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <PageMeta title="Cadastrar Produto" description="Formulário de Cadastro de Produto" />
      <PageBreadcrumb pageTitle="Novo Produto" />
      <div className="space-y-6">
        <ComponentCard title="Informações Gerais">
          <Label>Nome do Produto</Label>
          <Input value={nome} onChange={(e) => setNome(e.target.value)} />

          <Label>Descrição</Label>
          <TextArea value={descricao} onChange={setDescricao} rows={4} />

          <Label>Público Alvo</Label>
          <TextArea value={publicoAlvo} onChange={setPublicoAlvo} rows={4} />

          <Label>Link de Compra</Label>
          <Input
            type="url"
            value={linkCompra}
            onChange={(e) => setLinkCompra(e.target.value)}
            placeholder="https://"
          />

          <Label>Ativo</Label>
          <Switch label="Produto ativo?" defaultChecked={ativo} onChange={setAtivo} />
        </ComponentCard>

        <ComponentCard title="Conteúdo Estratégico">
          <Label>Dores</Label>
          <div className="flex gap-2 mb-2">
            <Input
              value={novaDor}
              onChange={(e) => setNovaDor(e.target.value)}
              placeholder="Digite uma dor"
            />
            <button
              onClick={() => adicionarItem("dor", setDores, novaDor, () => setNovaDor(""))}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Adicionar
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {dores.map((dor, index) => (
              <span key={index} className="px-3 py-1 bg-red-100 rounded-full flex items-center">
                {dor}
                <button
                  onClick={() => removerItem(index, setDores)}
                  className="ml-2 text-red-600 hover:text-red-800"
                >×</button>
              </span>
            ))}
          </div>

          <Label>Benefícios</Label>
          <div className="flex gap-2 mb-2">
            <Input
              value={novoBeneficio}
              onChange={(e) => setNovoBeneficio(e.target.value)}
              placeholder="Digite um benefício"
            />
            <button
              onClick={() => adicionarItem("beneficio", setBeneficios, novoBeneficio, () => setNovoBeneficio(""))}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Adicionar
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {beneficios.map((b, index) => (
              <span key={index} className="px-3 py-1 bg-green-100 rounded-full flex items-center">
                {b}
                <button
                  onClick={() => removerItem(index, setBeneficios)}
                  className="ml-2 text-green-600 hover:text-green-800"
                >×</button>
              </span>
            ))}
          </div>

          <Label>Palavras-chave</Label>
          <div className="flex gap-2 items-center">
            <Input
              value={palavraChaveAtual}
              onChange={(e) => setPalavraChaveAtual(e.target.value)}
              placeholder="Digite uma palavra-chave"
            />
            <button
              onClick={() => adicionarItem("palavra", setPalavrasChave, palavraChaveAtual, () => setPalavraChaveAtual(""))}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Adicionar
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {palavrasChave.map((tag, index) => (
              <span
                key={index}
                className="flex items-center gap-1 px-3 py-1 bg-gray-200 text-sm rounded-full dark:bg-white/10 dark:text-white"
              >
                {tag}
                <button
                  onClick={() => removerItem(index, setPalavrasChave)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </ComponentCard>

        <div className="text-center">
          <button
            onClick={handleSubmit}
            className="px-6 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Criar Produto
          </button>
        </div>
      </div>
    </div>
  );
}
