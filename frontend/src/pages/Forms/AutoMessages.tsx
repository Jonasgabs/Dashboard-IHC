import { useEffect, useState } from "react";
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
import { PencilIcon, TrashIcon, PlusIcon } from "lucide-react";
import Input from "../../components/form/input/InputField";
import TextArea from "../../components/form/input/TextArea";
import Label from "../../components/form/Label";
import Switch from "../../components/form/switch/Switch";

const serverUrl = import.meta.env.VITE_SERVER;

interface MensagemAutomatica {
  id: string;
  nome: string;
  conteudo: string;
  ativo: boolean;
  criado_em?: string;
}

export default function AutoMessagesPage() {
  const [mensagens, setMensagens] = useState<MensagemAutomatica[]>([]);
  const [form, setForm] = useState<Partial<MensagemAutomatica>>({});
  const [selecionado, setSelecionado] = useState<MensagemAutomatica | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);

  const buscarMensagens = async () => {
    try {
      const res = await axios.get(`${serverUrl}/autoMessages/list`);
      setMensagens(res.data);
    } catch (error) {
      console.error("Erro ao buscar mensagens automáticas:", error);
    }
  };

  useEffect(() => {
    buscarMensagens();
  }, []);

  const salvar = async () => {
    try {
      if (form.id || editandoId) {
        await axios.put(`${serverUrl}/autoMessages/update/${form.id || editandoId}`, form);
      } else {
        await axios.post(`${serverUrl}/autoMessages/create`, form);
      }
      setForm({});
      setSelecionado(null);
      setEditandoId(null);
      setMostrarFormulario(false);
      buscarMensagens();
    } catch (error) {
      console.error("Erro ao salvar mensagem:", error);
    }
  };

  const deletar = async (id: string) => {
    if (confirm("Deseja realmente excluir esta mensagem?")) {
      try {
        await axios.delete(`${serverUrl}/autoMessages/delete/${id}`);
        buscarMensagens();
      } catch (error) {
        console.error("Erro ao excluir mensagem:", error);
      }
    }
  };

  const handleChange = (key: keyof MensagemAutomatica, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-6xl mx-auto">
      <PageMeta title="Mensagens Automáticas" description="Lista de Mensagens" />
      <PageBreadcrumb pageTitle="Mensagens Automáticas" />

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
        <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-semibold text-white dark:text-white">
            Mensagens Automáticas
          </h3>
          <button
            onClick={() => {
              setForm({ ativo: true });
              setMostrarFormulario(!mostrarFormulario);
              setSelecionado(null);
              setEditandoId(null);
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            <PlusIcon size={16} /> Nova Mensagem
          </button>
        </div>

        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
              <TableRow>
                <TableCell isHeader className="text-white">Nome</TableCell>
                <TableCell isHeader className="text-white">Conteúdo</TableCell>
                <TableCell isHeader className="text-white">Status</TableCell>
                <TableCell isHeader className="text-white">Criado em</TableCell>
                <TableCell isHeader className="text-white">Ações</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {mensagens.map((msg) => (
                <TableRow
                  key={msg.id}
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5"
                  onClick={() => {
                    setSelecionado(msg);
                  }}
                >
                  <TableCell className="py-3 text-gray-800 dark:text-white font-medium">
                    {editandoId === msg.id ? (
                      <Input value={form.nome || ""} onChange={(e) => handleChange("nome", e.target.value)} />
                    ) : (
                      msg.nome
                    )}
                  </TableCell>
                  <TableCell className="py-3 text-gray-800 dark:text-white">
                    {editandoId === msg.id ? (
                      <TextArea value={form.conteudo || ""} onChange={(val) => handleChange("conteudo", val)} rows={2} />
                    ) : (
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {msg.conteudo ? `${msg.conteudo.slice(0, 50)}...` : "Sem conteúdo"}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="py-3">
                    {editandoId === msg.id ? (
                      <Switch
                        label={form.ativo ? "Ativa" : "Inativa"}
                        defaultChecked={form.ativo}
                        onChange={(val) => handleChange("ativo", val)}
                      />
                    ) : (
                      <Badge size="sm" color={msg.ativo ? "success" : "error"}>
                        {msg.ativo ? "Ativa" : "Inativa"}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 dark:text-gray-400 text-sm">
                    {new Date(msg.criado_em || "").toLocaleDateString()}
                  </TableCell>
                  <TableCell className="py-3 flex items-center gap-2">
                    {editandoId === msg.id ? (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            salvar();
                          }}
                          className="text-green-600 hover:text-green-800"
                        >
                          Salvar
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditandoId(null);
                            setForm({});
                          }}
                          className="text-gray-500 hover:text-gray-800"
                        >
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setForm(msg);
                            setEditandoId(msg.id);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <PencilIcon size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deletar(msg.id);
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <TrashIcon size={16} />
                        </button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {mostrarFormulario && (
          <div className="mt-6 rounded-xl bg-gray-50 dark:bg-white/5 p-6 border border-gray-200 dark:border-gray-700">
            <h4 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
              Nova Mensagem
            </h4>
            <div className="space-y-4">
              <div>
                <Label>Nome</Label>
                <Input value={form.nome || ""} onChange={(e) => handleChange("nome", e.target.value)} />
              </div>
              <div>
                <Label>Conteúdo</Label>
                <TextArea value={form.conteudo || ""} onChange={(val) => handleChange("conteudo", val)} />
              </div>
              <div>
                <Label>Status</Label>
                <Switch
                  label={form.ativo ? "Ativa" : "Inativa"}
                  defaultChecked={form.ativo}
                  onChange={(val) => handleChange("ativo", val)}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setMostrarFormulario(false)}
                  className="px-4 py-2 rounded text-gray-600 hover:text-gray-900 border border-gray-300"
                >
                  Cancelar
                </button>
                <button
                  onClick={salvar}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        )}

        {selecionado && !mostrarFormulario && !editandoId && (
          <div className="mt-6 rounded-xl bg-gray-50 dark:bg-white/5 p-6 border border-gray-200 dark:border-gray-700">
            <h4 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
              Detalhes da Mensagem
            </h4>
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-200">
              <p><strong>Nome:</strong> {selecionado.nome}</p>
              <p><strong>Status:</strong> {selecionado.ativo ? "Ativa" : "Inativa"}</p>
              <p><strong>Conteúdo:</strong></p>
              <div className="text-sm whitespace-pre-line bg-white dark:bg-black/20 px-4 py-2 rounded-md border border-gray-200 dark:border-gray-600">
                {selecionado.conteudo}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Criado em: {new Date(selecionado.criado_em || "").toLocaleString()}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
