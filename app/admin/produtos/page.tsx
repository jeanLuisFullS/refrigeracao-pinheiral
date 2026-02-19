"use client";

import { useEffect, useState } from "react";

type Produto = {
  id: string;
  titulo: string;
  descricao: string;
  preco: string;
  imagem: string;
  imagens?: string[];
  condicao?: "novo" | "usado";
  destaque?: boolean;
};

const emptyForm = (): Partial<Produto> & { precoNoWhatsapp?: boolean } => ({
  titulo: "",
  descricao: "",
  preco: "",
  imagem: "/placeholder-geladeira.jpg",
  imagens: [],
  condicao: "usado",
  destaque: false,
});

function resolveImgUrl(src: string): string {
  if (typeof window === "undefined") return src;
  if (src.startsWith("http")) return src;
  return src ? window.location.origin + src : "";
}

export default function AdminProdutosPage() {
  const [list, setList] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState<Produto | null>(null);
  const [form, setForm] = useState<Partial<Produto> & { precoNoWhatsapp?: boolean }>(emptyForm());
  const [showForm, setShowForm] = useState(false);
  const [urlInput, setUrlInput] = useState("");

  const load = () => {
    fetch("/api/admin/produtos", { credentials: "include" })
      .then((r) => r.json())
      .then(setList)
      .catch(() => setList([]));
  };

  useEffect(() => load(), []);

  const imagens = form.imagens && form.imagens.length > 0 ? form.imagens : (form.imagem ? [form.imagem] : []);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm(), precoNoWhatsapp: false });
    setShowForm(true);
  };

  const openEdit = (p: Produto) => {
    setEditing(p);
    const imgs = p.imagens?.length ? p.imagens : (p.imagem ? [p.imagem] : []);
    setForm({
      ...p,
      imagens: imgs,
      condicao: p.condicao ?? "usado",
      precoNoWhatsapp: p.preco === "Preço no WhatsApp" || !p.preco,
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
    setForm(emptyForm());
    setUrlInput("");
  };

  const addImage = (url: string) => {
    const u = url.trim();
    if (!u) return;
    setForm((f) => ({
      ...f,
      imagens: [...(f.imagens || []), u],
      imagem: (f.imagens?.length ? f.imagem : u) || u,
    }));
    setUrlInput("");
  };

  const removeImage = (index: number) => {
    setForm((f) => {
      const next = (f.imagens || []).filter((_, i) => i !== index);
      return { ...f, imagens: next, imagem: next[0] || "/placeholder-geladeira.jpg" };
    });
  };

  const moveImage = (index: number, dir: "up" | "down") => {
    setForm((f) => {
      const arr = [...(f.imagens || [])];
      const j = dir === "up" ? index - 1 : index + 1;
      if (j < 0 || j >= arr.length) return f;
      [arr[index], arr[j]] = [arr[j], arr[index]];
      return { ...f, imagens: arr, imagem: arr[0] };
    });
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        credentials: "include",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao enviar");
      addImage(data.url);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao enviar foto.");
    }
    setUploading(false);
    e.target.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const preco = form.precoNoWhatsapp ? "Preço no WhatsApp" : (form.preco || "").trim();
    const imgList = imagens.length ? imagens : ["/placeholder-geladeira.jpg"];
    const payload = {
      id: editing?.id,
      titulo: (form.titulo || "").trim(),
      descricao: (form.descricao || "").trim(),
      preco,
      imagem: imgList[0],
      imagens: imgList,
      condicao: form.condicao === "novo" ? "novo" : "usado",
      destaque: !!form.destaque,
    };

    setLoading(true);
    try {
      if (editing) {
        await fetch("/api/admin/produtos", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        });
      } else {
        await fetch("/api/admin/produtos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ ...payload, id: undefined }),
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
    if (!confirm("Excluir este produto?")) return;
    setLoading(true);
    await fetch("/api/admin/produtos?id=" + id, { method: "DELETE", credentials: "include" });
    load();
    setLoading(false);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-white">Produtos (anúncios)</h1>
        <button
          type="button"
          onClick={openCreate}
          className="px-5 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-500 font-medium min-h-[44px] touch-manipulation"
        >
          Novo anúncio
        </button>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-x-auto">
        <table className="w-full text-sm min-w-[400px]">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left p-3 text-slate-400 font-medium">Título</th>
              <th className="text-left p-3 text-slate-400 font-medium">Condição</th>
              <th className="text-left p-3 text-slate-400 font-medium">Preço</th>
              <th className="text-left p-3 text-slate-400 font-medium">Destaque</th>
              <th className="text-right p-3 text-slate-400 font-medium">Ações</th>
            </tr>
          </thead>
          <tbody>
            {list.map((p) => (
              <tr key={p.id} className="border-b border-slate-700/50">
                <td className="p-3 text-white">{p.titulo}</td>
                <td className="p-3 text-slate-300">{p.condicao === "novo" ? "Novo" : "Usado"}</td>
                <td className="p-3 text-slate-300">{p.preco || "—"}</td>
                <td className="p-3 text-slate-300">{p.destaque ? "Sim" : "Não"}</td>
                <td className="p-3 text-right">
                  <span className="inline-flex gap-2">
                    <button type="button" onClick={() => openEdit(p)} className="px-3 py-2 text-teal-400 hover:bg-slate-700 rounded-lg min-h-[44px] touch-manipulation">
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(p.id)}
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
          <p className="p-6 text-slate-500 text-center">Nenhum produto. Clique em &quot;Novo anúncio&quot; para criar.</p>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60">
          <div className="bg-slate-800 rounded-t-2xl sm:rounded-xl border border-slate-700 w-full sm:max-w-lg max-h-[95vh] overflow-auto">
            <div className="p-4 sm:p-6 pb-8">
              <h2 className="text-lg font-bold text-white mb-4">
                {editing ? "Editar anúncio" : "Novo anúncio"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Título *</label>
                  <input
                    type="text"
                    value={form.titulo || ""}
                    onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                    required
                    className="w-full px-3 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white text-base"
                    placeholder="Ex: Geladeira Consul 2 portas"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Descrição</label>
                  <textarea
                    value={form.descricao || ""}
                    onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white resize-none text-base"
                    placeholder="Estado, detalhes..."
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">Condição</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer min-h-[44px]">
                      <input
                        type="radio"
                        name="condicao"
                        checked={form.condicao === "novo"}
                        onChange={() => setForm({ ...form, condicao: "novo" })}
                        className="w-5 h-5"
                      />
                      <span className="text-slate-300">Novo</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer min-h-[44px]">
                      <input
                        type="radio"
                        name="condicao"
                        checked={form.condicao !== "novo"}
                        onChange={() => setForm({ ...form, condicao: "usado" })}
                        className="w-5 h-5"
                      />
                      <span className="text-slate-300">Usado</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-1">Fotos (ordem = ordem no site)</label>
                  <p className="text-xs text-slate-500 mb-2">Primeira foto = capa. Arraste ou use setas para reordenar.</p>
                  <div className="space-y-2">
                    {imagens.map((url, i) => (
                      <div key={i} className="flex items-center gap-2 bg-slate-700 rounded-lg p-2">
                        <span className="text-slate-500 text-sm w-6">{i + 1}.</span>
                        <div className="w-14 h-14 rounded overflow-hidden bg-slate-600 flex-shrink-0">
                          <img src={resolveImgUrl(url)} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-slate-400 text-xs truncate block">{url}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button type="button" onClick={() => moveImage(i, "up")} disabled={i === 0} className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30" aria-label="Subir">↑</button>
                          <button type="button" onClick={() => moveImage(i, "down")} disabled={i === imagens.length - 1} className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30" aria-label="Descer">↓</button>
                          <button type="button" onClick={() => removeImage(i)} className="p-1.5 text-red-400 hover:text-red-300" aria-label="Remover">✕</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 mt-2">
                    <label className="flex-shrink-0 cursor-pointer">
                      <input type="file" accept="image/*" capture="environment" onChange={handleImageSelect} disabled={uploading} className="hidden" />
                      <span className="inline-flex items-center gap-2 px-4 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-500 min-h-[44px] touch-manipulation text-sm">
                        {uploading ? "Enviando..." : "Adicionar foto"}
                      </span>
                    </label>
                    <div className="flex gap-2 flex-1">
                      <input
                        type="text"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addImage(urlInput))}
                        className="flex-1 px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white text-sm"
                        placeholder="Colar URL da imagem"
                      />
                      <button type="button" onClick={() => addImage(urlInput)} className="px-3 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500 text-sm">
                        OK
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 cursor-pointer min-h-[44px]">
                    <input
                      type="checkbox"
                      checked={!!form.precoNoWhatsapp}
                      onChange={(e) => setForm({ ...form, precoNoWhatsapp: e.target.checked })}
                      className="rounded w-5 h-5"
                    />
                    <span className="text-sm text-slate-300">Preço no WhatsApp</span>
                  </label>
                  <p className="text-xs text-slate-500 mt-0.5">Se marcado, o card mostra &quot;Preço no WhatsApp&quot;.</p>
                </div>
                {!form.precoNoWhatsapp && (
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Preço</label>
                    <input
                      type="text"
                      value={form.preco === "Preço no WhatsApp" ? "" : (form.preco || "")}
                      onChange={(e) => setForm({ ...form, preco: e.target.value })}
                      className="w-full px-3 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white text-base"
                      placeholder="Ex: R$ 1.200"
                    />
                  </div>
                )}
                <div>
                  <label className="flex items-center gap-2 cursor-pointer min-h-[44px]">
                    <input
                      type="checkbox"
                      checked={!!form.destaque}
                      onChange={(e) => setForm({ ...form, destaque: e.target.checked })}
                      className="rounded w-5 h-5"
                    />
                    <span className="text-sm text-slate-300">Destaque na home</span>
                  </label>
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
