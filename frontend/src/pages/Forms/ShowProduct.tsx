import { useEffect, useState, ChangeEvent } from "react";
import axios from "axios";

import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import Badge from "../../components/ui/badge/Badge";
import { PencilIcon, TrashIcon } from "lucide-react";
import Input from "../../components/form/input/InputField";
import TextArea from "../../components/form/input/TextArea";
import Label from "../../components/form/Label";
import Switch from "../../components/form/switch/Switch";

const serverUrl = import.meta.env.VITE_SERVER;

interface Produto {
  id: string;
  nome: string;
  descricao?: string;
  publico_alvo?: string;
  dores?: string[];
  beneficios?: string[];
  palavras_chave?: string[];
  link_compra?: string;
  ativo: boolean;
  criado_em?: string;
}

export default function ListaProdutos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [selecionado, setSelecionado] = useState<Produto | null>(null);
  const [form, setForm] = useState<Partial<Produto>>({});
  const [novaDor, setNovaDor] = useState("");
  const [novoBeneficio, setNovoBeneficio] = useState("");
  const [novaPalavra, setNovaPalavra] = useState("");

  const buscarProdutos = async () => {
    try {
      const response = await axios.get<Produto[]>(`${serverUrl}/products/list`);
      setProdutos(response.data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };

  useEffect(() => {
    buscarProdutos();
  }, []);

  const deletarProduto = async (id: string) => {
    if (confirm("Tem certeza que deseja deletar este produto?")) {
      try {
        await axios.delete(`${serverUrl}/products/delete/${id}`);
        setSelecionado(null);
        buscarProdutos();
      } catch (error) {
        console.error("Erro ao deletar produto:", error);
      }
    }
  };

  const salvarEdicao = async () => {
    if (!selecionado) return;
    try {
      await axios.put(`${serverUrl}/products/update/${selecionado.id}`, form);
      setSelecionado(null);
      buscarProdutos();
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
    }
  };

  const handleChange = (key: keyof Produto, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const adicionarItem = (chave: keyof Produto, valor: string, clear: () => void) => {
    if (!valor.trim()) return;
  
    setForm((prev) => {
      const current = prev[chave];
      if (!Array.isArray(current)) return prev; 
      return {
        ...prev,
        [chave]: [...current, valor.trim()],
      };
    });
  
    clear();
  };
  

  const removerItem = (chave: keyof Produto, index: number) => {
    setForm((prev) => {
      const current = prev[chave];
      if (!Array.isArray(current)) return prev; 
      return {
        ...prev,
        [chave]: current.filter((_, i) => i !== index),
      };
    });
  };
  

  return (
    <div className="max-w-6xl mx-auto">
      <PageMeta title="Produtos" description="Lista de Produtos Cadastrados" />
      <PageBreadcrumb pageTitle="Produtos" />

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
        <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Produtos Cadastrados
          </h3>
        </div>

        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
              <TableRow>
                <TableCell isHeader className="py-3 text-gray-500 font-medium text-start">Nome</TableCell>
                <TableCell isHeader className="py-3 text-gray-500 font-medium text-start">Status</TableCell>
                <TableCell isHeader className="py-3 text-gray-500 font-medium text-start">Criado em</TableCell>
                <TableCell isHeader className="py-3 text-gray-500 font-medium text-start">Ações</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {produtos.map((produto) => (
                <TableRow
                  key={produto.id}
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5"
                  onClick={() => {
                    setSelecionado(produto);
                    setForm(produto);
                  }}
                >
                  <TableCell className="py-3 text-gray-800 dark:text-white font-medium">
                    {produto.nome}
                  </TableCell>
                  <TableCell className="py-3">
                    <Badge size="sm" color={produto.ativo ? "success" : "error"}>
                      {produto.ativo ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-sm">
                    {new Date(produto.criado_em || "").toLocaleDateString()}
                  </TableCell>
                  <TableCell className="py-3 flex items-center gap-2">
                    <button
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.stopPropagation();
                        setSelecionado(produto);
                        setForm(produto);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <PencilIcon size={16} />
                    </button>
                    <button
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.stopPropagation();
                        deletarProduto(produto.id);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <TrashIcon size={16} />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {selecionado && (
          <div className="mt-6 rounded-xl bg-gray-50 dark:bg-white/5 p-6 border border-gray-200 dark:border-gray-700">
            <h4 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
              Editar Produto
            </h4>
            <div className="space-y-4">
              <div>
                <Label>Nome</Label>
                <Input value={form.nome || ""} onChange={(e) => handleChange("nome", e.target.value)} />
              </div>
              <div>
                <Label>Descrição</Label>
                <TextArea value={form.descricao || ""} onChange={(val) => handleChange("descricao", val)} />
              </div>
              <div>
                <Label>Público Alvo</Label>
                <TextArea value={form.publico_alvo || ""} onChange={(val) => handleChange("publico_alvo", val)} />
              </div>
              <div>
                <Label>Link de Compra</Label>
                <Input value={form.link_compra || ""} onChange={(e) => handleChange("link_compra", e.target.value)} />
              </div>
              <div>
                <Label>Status</Label>
                <Switch
                  label={form.ativo ? "Ativo" : "Inativo"}
                  defaultChecked={form.ativo}
                  onChange={(val) => handleChange("ativo", val)}
                />
              </div>

              {/* Edição de dores, benefícios e palavras-chave */}
              {[
                { key: "dores", label: "Dores", value: novaDor, setValue: setNovaDor },
                { key: "beneficios", label: "Benefícios", value: novoBeneficio, setValue: setNovoBeneficio },
                { key: "palavras_chave", label: "Palavras-chave", value: novaPalavra, setValue: setNovaPalavra },
              ].map(({ key, label, value, setValue }) => (
                <div key={key}>
                  <Label>{label}</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      placeholder={`Adicionar ${label.toLowerCase()}`}
                    />
                    <button
                      onClick={() => adicionarItem(key as keyof Produto, value, () => setValue(""))}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Adicionar
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(form[key as keyof Produto]) &&
                    (form[key as keyof Produto] as string[]).map((item, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-200 rounded-full flex items-center">
                        {item}
                        <button
                            onClick={() => removerItem(key as keyof Produto, index)}
                            className="ml-2 text-red-600 hover:text-red-800"
                        >
                            ×
                        </button>
                        </span>
                    ))}
                  </div>
                </div>
              ))}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setSelecionado(null)}
                  className="px-4 py-2 rounded text-gray-600 hover:text-gray-900 border border-gray-300"
                >
                  Cancelar
                </button>
                <button
                  onClick={salvarEdicao}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
