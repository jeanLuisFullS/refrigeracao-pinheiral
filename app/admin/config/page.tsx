"use client";

import { useEffect, useState } from "react";

export default function AdminConfigPage() {
  const [config, setConfig] = useState<Record<string, unknown> | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/config", { credentials: "include" })
      .then((r) => r.json())
      .then(setConfig)
      .catch(() => setConfig(null));
  }, []);

  const handleSave = async () => {
    if (!config) return;
    setSaving(true);
    await fetch("/api/admin/config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(config),
    });
    setSaving(false);
  };

  if (!config) return <p className="text-slate-400">Carregando...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Configuração</h1>
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 max-w-2xl">
        <pre className="text-slate-300 text-sm overflow-auto whitespace-pre-wrap">{JSON.stringify(config, null, 2)}</pre>
        <button type="button" onClick={handleSave} disabled={saving} className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-500 disabled:opacity-50">
          {saving ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </div>
  );
}
