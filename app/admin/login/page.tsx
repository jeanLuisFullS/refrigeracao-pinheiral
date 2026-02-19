"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      let captcha = "";
      if (typeof window !== "undefined" && (window as unknown as { grecaptcha?: { getResponse: () => string } }).grecaptcha) {
        captcha = (window as unknown as { grecaptcha: { getResponse: () => string } }).grecaptcha.getResponse();
      }
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, captcha }),
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Erro ao entrar");
        setLoading(false);
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Erro de conexão");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      {RECAPTCHA_SITE_KEY && (
        <Script src="https://www.google.com/recaptcha/api.js" strategy="lazyOnload" />
      )}
      <div className="w-full max-w-sm bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-700">
        <h1 className="text-xl font-bold text-white text-center mb-2">Painel Admin</h1>
        <p className="text-slate-400 text-sm text-center mb-6">Acesso restrito</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
              className="w-full px-4 py-2.5 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-500 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Senha de administrador"
            />
          </div>
          {RECAPTCHA_SITE_KEY && (
            <div className="flex justify-center" data-sitekey={RECAPTCHA_SITE_KEY}>
              <div className="g-recaptcha" data-sitekey={RECAPTCHA_SITE_KEY} />
            </div>
          )}
          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-500 disabled:opacity-50 transition"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
