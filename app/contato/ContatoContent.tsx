"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Config } from "@/lib/data";

export default function ContatoContent({ config }: { config: Config }) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <motion.h1 className="text-3xl font-bold text-slate-900 mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        Contato
      </motion.h1>
      <motion.div className="space-y-6 text-slate-600" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}>
        <div>
          <h2 className="font-bold text-slate-900 mb-2">Horário de atendimento</h2>
          <p>{config.horario}</p>
        </div>
        <div>
          <h2 className="font-bold text-slate-900 mb-2">WhatsApp e telefone</h2>
          <ul className="space-y-2">
            {(config.telefones ?? []).map((t) => (
              <li key={t.numero}>
                <a href={`https://wa.me/${t.numero}`} target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline">
                  {t.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        {config.endereco?.rua ? (
          <div>
            <h2 className="font-bold text-slate-900 mb-2">Endereço</h2>
            <p>
              {config.endereco.rua}, {config.endereco.cidade} - {config.endereco.estado}
              {config.endereco.cep && `, ${config.endereco.cep}`}
            </p>
          </div>
        ) : (
          <p className="text-slate-600">Atendemos em domicílio em Pinheiral, Volta Redonda e região. Entre em contato para agendar uma visita.</p>
        )}
      </motion.div>
      <motion.div className="mt-10" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
        <Link href={`https://wa.me/${config.whatsappPrincipal}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#20bd5a] transition">
          Fale no WhatsApp
        </Link>
      </motion.div>
    </div>
  );
}
