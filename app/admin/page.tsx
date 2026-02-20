"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Stats = {
  totalVisitors: number;
  visitors24h: number;
  totalOrcamentos: number;
  totalProdutos: number;
  totalErrors: number;
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats", { credentials: "include" })
      .then((r) => r.json())
      .then(setStats)
      .catch(() => setStats(null));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <p className="text-slate-400 text-sm">Visitantes (total)</p>
          <p className="text-2xl font-bold text-white">{stats?.totalVisitors ?? "—"}</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <p className="text-slate-400 text-sm">Visitantes (24h)</p>
          <p className="text-2xl font-bold text-white">{stats?.visitors24h ?? "—"}</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <p className="text-slate-400 text-sm">Orçamentos</p>
          <p className="text-2xl font-bold text-white">{stats?.totalOrcamentos ?? "—"}</p>
          <Link href="/admin/formularios" className="text-teal-400 text-sm hover:underline">Ver todos</Link>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <p className="text-slate-400 text-sm">Produtos</p>
          <p className="text-2xl font-bold text-white">{stats?.totalProdutos ?? "—"}</p>
          <Link href="/admin/produtos" className="text-teal-400 text-sm hover:underline">Gerenciar</Link>
        </div>
      </div>
      {stats && stats.totalErrors > 0 && (
        <div className="bg-amber-900/30 border border-amber-700 rounded-xl p-4 mb-6">
          <p className="text-amber-400 font-medium">Alertas: {stats.totalErrors} erro(s) registrado(s)</p>
          <Link href="/admin/alertas" className="text-amber-300 text-sm hover:underline">Ver alertas</Link>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/admin/visitantes" className="bg-slate-800 rounded-xl p-4 border border-slate-700 hover:border-teal-600 transition">
          <h2 className="font-semibold text-white">Visitantes</h2>
          <p className="text-slate-400 text-sm">Acessos por página e últimos visitantes</p>
        </Link>
        <Link href="/admin/depoimentos" className="bg-slate-800 rounded-xl p-4 border border-slate-700 hover:border-teal-600 transition">
          <h2 className="font-semibold text-white">Depoimentos</h2>
          <p className="text-slate-400 text-sm">Gerenciar depoimentos de clientes</p>
        </Link>
        <Link href="/admin/config" className="bg-slate-800 rounded-xl p-4 border border-slate-700 hover:border-teal-600 transition">
          <h2 className="font-semibold text-white">Configuração</h2>
          <p className="text-slate-400 text-sm">Nome, telefones, endereço, horário</p>
        </Link>
        <Link href="/admin/manutencao" className="bg-slate-800 rounded-xl p-4 border border-slate-700 hover:border-teal-600 transition">
          <h2 className="font-semibold text-white">Manutenção</h2>
          <p className="text-slate-400 text-sm">Ativar modo manutenção do site</p>
        </Link>
        <Link href="/admin/alertas" className="bg-slate-800 rounded-xl p-4 border border-slate-700 hover:border-teal-600 transition">
          <h2 className="font-semibold text-white">Alertas e segurança</h2>
          <p className="text-slate-400 text-sm">Erros, crashes e tentativas de login</p>
        </Link>
      </div>
    </div>
  );
}
