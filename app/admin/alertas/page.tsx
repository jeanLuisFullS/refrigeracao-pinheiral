"use client";

import { useEffect, useState } from "react";

type ErrorLog = { id: string; message: string; stack?: string; url?: string; timestamp: string };
type Attempt = { ip: string; attempts: number; lockedUntil: string; lastAttempt: string };

export default function AdminAlertasPage() {
  const [errors, setErrors] = useState<ErrorLog[]>([]);
  const [attempts, setAttempts] = useState<Attempt[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/errors", { credentials: "include" }).then((r) => r.json()),
      fetch("/api/admin/login-attempts", { credentials: "include" }).then((r) => r.json()),
    ]).then(([e, a]) => {
      setErrors(e || []);
      setAttempts(a || []);
    });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Alertas e segurança</h1>

      <h2 className="text-lg font-semibold text-white mb-3">Tentativas de login (possível invasão)</h2>
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left p-3 text-slate-400 font-medium">IP</th>
              <th className="text-left p-3 text-slate-400 font-medium">Tentativas</th>
              <th className="text-left p-3 text-slate-400 font-medium">Bloqueado até</th>
              <th className="text-left p-3 text-slate-400 font-medium">Última tentativa</th>
            </tr>
          </thead>
          <tbody>
            {attempts.map((a, i) => (
              <tr key={i} className="border-b border-slate-700/50">
                <td className="p-3 text-amber-400">{a.ip}</td>
                <td className="p-3 text-white">{a.attempts}</td>
                <td className="p-3 text-slate-300">{new Date(a.lockedUntil).toLocaleString("pt-BR")}</td>
                <td className="p-3 text-slate-400">{new Date(a.lastAttempt).toLocaleString("pt-BR")}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {attempts.length === 0 && <p className="p-6 text-slate-500 text-center">Nenhuma tentativa suspeita.</p>}
      </div>

      <h2 className="text-lg font-semibold text-white mb-3">Log de erros e crashes</h2>
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left p-3 text-slate-400 font-medium">Data</th>
              <th className="text-left p-3 text-slate-400 font-medium">Mensagem</th>
              <th className="text-left p-3 text-slate-400 font-medium">URL</th>
            </tr>
          </thead>
          <tbody>
            {errors.map((e) => (
              <tr key={e.id} className="border-b border-slate-700/50">
                <td className="p-3 text-slate-300">{new Date(e.timestamp).toLocaleString("pt-BR")}</td>
                <td className="p-3 text-red-300 max-w-md truncate">{e.message}</td>
                <td className="p-3 text-slate-400 max-w-xs truncate">{e.url}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {errors.length === 0 && <p className="p-6 text-slate-500 text-center">Nenhum erro registrado.</p>}
      </div>
    </div>
  );
}
