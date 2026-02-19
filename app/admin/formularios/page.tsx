"use client";

import { useEffect, useState } from "react";

type Orcamento = {
  nome: string;
  telefone: string;
  cidade: string;
  aparelho: string;
  descricao: string;
  data: string;
};

export default function AdminFormulariosPage() {
  const [list, setList] = useState<Orcamento[]>([]);

  useEffect(() => {
    fetch("/api/admin/orcamentos", { credentials: "include" })
      .then((r) => r.json())
      .then(setList)
      .catch(() => setList([]));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Formulários (Orçamentos)</h1>
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left p-3 text-slate-400">Data</th>
              <th className="text-left p-3 text-slate-400">Nome</th>
              <th className="text-left p-3 text-slate-400">Telefone</th>
              <th className="text-left p-3 text-slate-400">Cidade</th>
              <th className="text-left p-3 text-slate-400">Aparelho</th>
              <th className="text-left p-3 text-slate-400">Problema</th>
            </tr>
          </thead>
          <tbody>
            {[...list].reverse().map((o, i) => (
              <tr key={i} className="border-b border-slate-700/50">
                <td className="p-3 text-slate-300">{new Date(o.data).toLocaleString("pt-BR")}</td>
                <td className="p-3 text-white">{o.nome}</td>
                <td className="p-3">
                  <a href={"https://wa.me/55" + (o.telefone || "").replace(/\D/g, "")} target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:underline">{o.telefone}</a>
                </td>
                <td className="p-3 text-slate-300">{o.cidade}</td>
                <td className="p-3 text-slate-300">{o.aparelho}</td>
                <td className="p-3 text-slate-400 max-w-xs truncate">{o.descricao}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.length === 0 && <p className="p-6 text-slate-500 text-center">Nenhum orçamento.</p>}
      </div>
    </div>
  );
}
