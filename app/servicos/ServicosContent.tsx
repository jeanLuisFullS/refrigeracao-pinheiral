"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Config } from "@/lib/data";

const servicos = [
  { titulo: "Geladeiras e Freezers", slug: "geladeiras-freezers", texto: "Conserto, manutenção preventiva e instalação de geladeiras e freezers. Atendemos em Pinheiral, Volta Redonda, Barra Mansa e região. Se sua geladeira não está gelando, fazendo barulho ou com vazamento, entre em contato para um orçamento." },
  { titulo: "Máquinas de lavar", slug: "lavadoras", texto: "Assistência técnica em lavadoras de roupas. Reparo de motores, bombas, vazamentos e problemas elétricos. Atendimento em domicílio em Pinheiral e Volta Redonda." },
  { titulo: "Ar condicionado", slug: "ar-condicionado", texto: "Instalação, limpeza, manutenção e conserto de ar condicionado. Atendemos residências e comércios em Pinheiral, Volta Redonda e região. Peça orçamento pelo WhatsApp." },
];

export default function ServicosContent({ config }: { config: Config }) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <motion.h1 className="text-3xl font-bold text-slate-900 mb-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        Nossos serviços
      </motion.h1>
      <motion.p className="text-slate-600 mb-10" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}>
        Assistência técnica em eletrodomésticos. Atendemos {(config.areasAtendimento ?? []).join(", ")}.
      </motion.p>
      <div className="space-y-10">
        {servicos.map((s, i) => (
          <motion.article
            key={s.slug}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <h2 className="text-xl font-bold text-slate-900 mb-3">{s.titulo}</h2>
            <p className="text-slate-600">{s.texto}</p>
          </motion.article>
        ))}
      </div>
      <motion.div className="mt-12 text-center" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
        <Link href="/orcamento" className="inline-flex items-center gap-2 bg-brand-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-brand-primary-hover transition">
          Peça orçamento
        </Link>
      </motion.div>
    </div>
  );
}
