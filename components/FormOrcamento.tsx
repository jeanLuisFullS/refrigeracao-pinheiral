"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { config as defaultConfig, buildWhatsAppMessage, getWhatsAppUrl } from "@/lib/data";
import type { Config } from "@/lib/data";

const aparelhos = [
  "Geladeira",
  "Freezer",
  "Máquina de lavar",
  "Ar condicionado",
  "Outro",
];

type Props = {
  variant?: "compact" | "full";
  config?: Config;
};

export default function FormOrcamento({ variant = "full", config: configProp }: Props) {
  const config = configProp ?? defaultConfig;
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cidade, setCidade] = useState("");
  const [aparelho, setAparelho] = useState("");
  const [descricao, setDescricao] = useState("");
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    const data = { nome, telefone, cidade, aparelho, descricao };
    try {
      await fetch("/api/orcamento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const msg = buildWhatsAppMessage("orcamento", data, config);
      window.location.href = getWhatsAppUrl(msg, config);
    } catch {
      const msg = buildWhatsAppMessage("orcamento", data, config);
      window.location.href = getWhatsAppUrl(msg, config);
    } finally {
      setEnviando(false);
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition";
  const labelClass = "block text-sm font-medium text-slate-700 mb-1.5";

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="nome" className={labelClass}>Nome</label>
        <input id="nome" type="text" required value={nome} onChange={(e) => setNome(e.target.value)} className={inputClass} placeholder="Seu nome" />
      </div>
      <div>
        <label htmlFor="telefone" className={labelClass}>Telefone / WhatsApp</label>
        <input id="telefone" type="tel" required value={telefone} onChange={(e) => setTelefone(e.target.value)} className={inputClass} placeholder="(24) 99999-9999" />
      </div>
      <div>
        <label htmlFor="cidade" className={labelClass}>Cidade</label>
        <input id="cidade" type="text" required value={cidade} onChange={(e) => setCidade(e.target.value)} className={inputClass} placeholder="Ex: Volta Redonda, Pinheiral" />
      </div>
      <div>
        <label htmlFor="aparelho" className={labelClass}>Aparelho</label>
        <select
          id="aparelho"
          required
          value={aparelho}
          onChange={(e) => setAparelho(e.target.value)}
          className={inputClass}
        >
          <option value="">Selecione</option>
          {aparelhos.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="descricao" className={labelClass}>Descreva o problema</label>
        <textarea
          id="descricao"
          required
          rows={variant === "compact" ? 2 : 4}
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          className={inputClass + " resize-none"}
          placeholder="Ex: Geladeira não está gelando, barulho estranho..."
        />
      </div>
      <motion.button
        type="submit"
        disabled={enviando}
        className="w-full py-3 rounded-xl bg-brand-primary text-white font-semibold hover:bg-brand-primary-hover transition disabled:opacity-70"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        {enviando ? "Enviando..." : "Enviar e falar no WhatsApp"}
      </motion.button>
    </form>
  );

  if (variant === "compact") {
    return (
      <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm max-w-md mx-auto">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Peça seu orçamento</h3>
        {formContent}
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900 mb-2">Solicite um orçamento</h2>
      <p className="text-slate-600 text-sm mb-6">
        Preencha os dados e você será redirecionado ao WhatsApp para fechar o atendimento.
      </p>
      {formContent}
    </div>
  );
}
