"use client";

import { useEffect, useState } from "react";

type Depoimento = { id: string; nome: string; cidade: string; texto: string };

const emptyDepoimento = (): Depoimento => ({ id: "", nome: "", cidade: "", texto: "" });

export default function AdminDepoimentosPage() {
  const [list, setList] = useState<Depoimento[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Depoimento | null>(null);
  const [form, setForm] = useState<Depoimento>(emptyDepoimento());
  const [showForm, setShowForm] = useState(false);

  const load = () => {
    fetch("/api/admin/depoimentos", { credentials: "include" })
      .then((r) => r.json())
      .then(setList)
      .catch(() => setList([]));
  };

  useEffect(() => load(), []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyDepoimento());
    setShowForm(true);
  };

  const openEdit = (d: Depoimento) => {
    setEditing(d);
    setForm({ ...d });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
    setForm(emptyDepoimento());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editing) {
        await fetch("/api/admin/depoimentos", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(form),
        });
      } else {
        await fetch("/api/admin/depoimentos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ nome: form.nome, cidade: form.cidade, texto: form.texto }),
        });
      }
      load();
      closeForm();
    } catch {
      alert("Erro ao salvar.");
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir este depoimento?")) return;
    setLoading(true);
    await fetch("/api/admin/depoimentos?id=" + id, { method: "DELETE", credentials: "include" });
    load();
    setLoading(false);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-white">Depoimentos</h1>
        <button
          type="button"
          onClick={openCreate}
          className="px-5 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-500 font-medium min-h-[44px] touch-manipulation"
        >
          Novo depoimento
        </button>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left p-3 text-slate-400">Nome</th>
              <th className="text-left p-3 text-slate-400">Cidade</th>
              <th className="text-left p-3 text-slate-400">Texto</th>
              <th className="text-right p-3 text-slate-400">Ações</th>
            </tr>
          </thead>
          <tbody>
            {list.map((d) => (
              <tr key={d.id} className="border-b border-slate-700/50">
                <td className="p-3 text-white">{d.nome}</td>
                <td className="p-3 text-slate-300">{d.cidade}</td>
                <td className="p-3 text-slate-400 max-w-md truncate">{d.texto}</td>
                <td className="p-3 text-right">
                  <span className="inline-flex gap-2">
                    <button type="button" onClick={() => openEdit(d)} className="px-3 py-2 text-teal-400 hover:bg-slate-700 rounded-lg min-h-[44px] touch-manipulation">
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(d.id)}
                      disabled={loading}
                      className="px-3 py-2 text-red-400 hover:bg-slate-700 rounded-lg min-h-[44px] touch-manipulation disabled:opacity-50"
                    >
                      Excluir
                    </button>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.length === 0 && !showForm && (
          <p className="p-6 text-slate-500 text-center">Nenhum depoimento. Clique em &quot;Novo depoimento&quot; para criar.</p>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60">
          <div className="bg-slate-800 rounded-t-2xl sm:rounded-xl border border-slate-700 w-full sm:max-w-lg max-h-[95vh] overflow-auto">
            <div className="p-4 sm:p-6 pb-8">
              <h2 className="text-lg font-bold text-white mb-4">
                {editing ? "Editar depoimento" : "Novo depoimento"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Nome *</label>
                  <input
                    type="text"
                    value={form.nome}
                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                    required
                    className="w-full px-3 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white text-base"
                    placeholder="Ex: Maria S."
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Cidade *</label>
                  <input
                    type="text"
                    value={form.cidade}
                    onChange={(e) => setForm({ ...form, cidade: e.target.value })}
                    required
                    className="w-full px-3 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white text-base"
                    placeholder="Ex: Volta Redonda"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Texto do depoimento *</label>
                  <textarea
                    value={form.texto}
                    onChange={(e) => setForm({ ...form, texto: e.target.value })}
                    required
                    rows={4}
                    className="w-full px-3 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white resize-none text-base"
                    placeholder="O que a pessoa disse..."
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-500 disabled:opacity-50 font-medium min-h-[48px] touch-manipulation"
                  >
                    {loading ? "Salvando..." : editing ? "Salvar" : "Criar"}
                  </button>
                  <button type="button" onClick={closeForm} className="px-4 py-3 bg-slate-600 text-white rounded-xl hover:bg-slate-500 min-h-[48px] touch-manipulation">
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
