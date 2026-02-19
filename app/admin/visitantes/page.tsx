"use client";

import { useEffect, useState } from "react";

type VisitorsData = {
  total: number;
  byPath: Record<string, number>;
  recent: { path: string; timestamp: string; ua: string }[];
};

export default function AdminVisitantesPage() {
  const [data, setData] = useState<VisitorsData | null>(null);

  useEffect(() => {
    fetch("/api/admin/visitors", { credentials: "include" })
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(null));
  }, []);

  if (!data) return <p className="text-slate-400">Carregando...</p>;

  const paths = Object.entries(data.byPath).sort((a, b) => b[1] - a[1]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Visitantes</h1>
      <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 mb-6">
        <p className="text-slate-400">Total de acessos</p>
        <p className="text-3xl font-bold text-white">{data.total}</p>
      </div>
      <h2 className="text-lg font-semibold text-white mb-3">Por página</h2>
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left p-3 text-slate-400">Página</th>
              <th className="text-right p-3 text-slate-400">Acessos</th>
            </tr>
          </thead>
          <tbody>
            {paths.map(([path, count]) => (
              <tr key={path} className="border-b border-slate-700/50">
                <td className="p-3 text-white">{path}</td>
                <td className="p-3 text-right text-slate-300">{count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h2 className="text-lg font-semibold text-white mb-3">Últimos 100</h2>
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left p-3 text-slate-400">Data</th>
              <th className="text-left p-3 text-slate-400">Página</th>
              <th className="text-left p-3 text-slate-400">UA</th>
            </tr>
          </thead>
          <tbody>
            {data.recent.map((v, i) => (
              <tr key={i} className="border-b border-slate-700/50">
                <td className="p-3 text-slate-300">{new Date(v.timestamp).toLocaleString("pt-BR")}</td>
                <td className="p-3 text-white">{v.path}</td>
                <td className="p-3 text-slate-400 truncate max-w-xs">{v.ua}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
