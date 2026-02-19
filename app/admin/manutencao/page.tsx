"use client";

import { useEffect, useState } from "react";

type Maintenance = { enabled: boolean; message?: string };

export default function AdminManutencaoPage() {
  const [state, setState] = useState<Maintenance>({ enabled: false });
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/maintenance", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        setState(d);
        setMessage(d.message || "");
      })
      .catch(() => {});
  }, []);

  const handleToggle = async (enabled: boolean) => {
    setSaving(true);
    const res = await fetch("/api/admin/maintenance", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ enabled, message }),
    });
    const data = await res.json();
    setState(data);
    setSaving(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Manutenção</h1>
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 max-w-lg">
        <p className="text-slate-400 mb-4">Ative para exibir página de manutenção aos visitantes. Admin continua acessível.</p>
        <div className="mb-4">
          <label className="block text-sm text-slate-400 mb-1">Mensagem</label>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Voltamos em breve."
            className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white"
          />
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={() => handleToggle(true)} disabled={saving || state.enabled} className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-500 disabled:opacity-50">
            Ativar
          </button>
          <button type="button" onClick={() => handleToggle(false)} disabled={saving || !state.enabled} className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-500 disabled:opacity-50">
            Desativar
          </button>
        </div>
        <p className="mt-4 text-slate-500 text-sm">Status: {state.enabled ? "Em manutenção" : "Normal"}</p>
      </div>
    </div>
  );
}
