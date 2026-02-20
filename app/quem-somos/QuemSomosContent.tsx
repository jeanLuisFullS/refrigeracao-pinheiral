"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Config } from "@/lib/data";

export default function QuemSomosContent({ config }: { config: Config }) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <motion.h1 className="text-3xl font-bold text-slate-900 mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        Quem somos
      </motion.h1>
      <motion.div className="text-slate-600 space-y-4 leading-relaxed" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}>
        <p>
          A <strong className="text-slate-800">{config.nome}</strong> é uma empresa de assistência técnica especializada em refrigeração e eletrodomésticos, atendendo <strong className="text-slate-800">Pinheiral</strong>, <strong className="text-slate-800">Volta Redonda</strong> e toda a região.
        </p>
        <p>
          Oferecemos conserto e manutenção de <strong className="text-slate-800">geladeiras</strong>, <strong className="text-slate-800">freezers</strong>, <strong className="text-slate-800">máquinas de lavar</strong> e <strong className="text-slate-800">ar condicionado</strong>, com atendimento ágil e preço justo. Também trabalhamos com a venda de equipamentos novos e usados.
        </p>
        <p>Nossa missão é resolver o seu problema com transparência e qualidade. Entre em contato pelo WhatsApp ou peça um orçamento sem compromisso.</p>
      </motion.div>
      <motion.div className="mt-10 flex flex-wrap gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
        <a href={`https://wa.me/${config.whatsappPrincipal}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#25D366] text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-[#20bd5a] transition">
          Fale no WhatsApp
        </a>
        <Link href="/orcamento" className="inline-flex items-center gap-2 bg-teal-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-teal-500 transition">
          Peça orçamento
        </Link>
      </motion.div>
    </div>
  );
}
