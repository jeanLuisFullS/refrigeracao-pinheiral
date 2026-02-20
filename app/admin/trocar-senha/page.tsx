"use client";

import { useState } from "react";

export default function AdminTrocarSenhaPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "A nova senha e a confirmação não coincidem." });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: "error", text: "A nova senha deve ter no mínimo 6 caracteres." });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "Erro ao alterar senha." });
        setLoading(false);
        return;
      }

      setMessage({ type: "ok", text: "Senha alterada com sucesso. Use a nova senha no próximo login." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setMessage({ type: "error", text: "Erro de conexão. Tente novamente." });
    }
    setLoading(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Trocar senha</h1>
      <p className="text-slate-400 mb-4">
        Altere a senha de acesso ao painel admin. Use uma senha forte e guarde-a em local seguro.
      </p>
      <p className="text-amber-400/90 text-sm mb-6">
        Se o site estiver na Vercel, a alteração por aqui não é salva. Nesse caso: gere o hash com <code className="bg-slate-700 px-1 rounded">node scripts/generate-password-hash.js &quot;SuaNovaSenha&quot;</code>, depois em Vercel → Settings → Environment Variables atualize <code className="bg-slate-700 px-1 rounded">ADMIN_PASSWORD_HASH</code> e faça um novo deploy.
      </p>
      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <div>
          <label htmlFor="current" className="block text-sm text-slate-400 mb-1">Senha atual *</label>
          <input
            id="current"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="w-full px-3 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white"
            placeholder="Digite a senha atual"
          />
        </div>
        <div>
          <label htmlFor="new" className="block text-sm text-slate-400 mb-1">Nova senha *</label>
          <input
            id="new"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
            className="w-full px-3 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white"
            placeholder="Mínimo 6 caracteres"
          />
        </div>
        <div>
          <label htmlFor="confirm" className="block text-sm text-slate-400 mb-1">Confirmar nova senha *</label>
          <input
            id="confirm"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
            className="w-full px-3 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white"
            placeholder="Repita a nova senha"
          />
        </div>
        {message && (
          <p className={message.type === "ok" ? "text-green-400 text-sm" : "text-red-400 text-sm"}>
            {message.text}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-500 disabled:opacity-50 font-medium"
        >
          {loading ? "Salvando..." : "Alterar senha"}
        </button>
      </form>
    </div>
  );
}
