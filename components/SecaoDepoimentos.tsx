"use client";

import { motion } from "framer-motion";
import { depoimentos as staticDepoimentos } from "@/lib/data";
import type { Depoimento } from "@/lib/data";

const useLoop = (list: Depoimento[]) => list.length >= 4;

function Card({ d }: { d: Depoimento }) {
  return (
    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex-shrink-0 w-[280px] sm:w-[300px]">
      <p className="text-slate-700 italic text-sm line-clamp-3">&ldquo;{d.texto}&rdquo;</p>
      <p className="mt-3 text-brand-primary font-semibold text-sm">{d.nome}</p>
      <p className="text-slate-500 text-xs">{d.cidade}</p>
    </div>
  );
}

export default function SecaoDepoimentos({ depoimentos: depoimentosProp }: { depoimentos?: Depoimento[] } = {}) {
  const depoimentos = depoimentosProp ?? staticDepoimentos;
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          className="text-2xl md:text-3xl font-bold text-center text-slate-900 mb-2"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          O que dizem nossos clientes
        </motion.h2>
        <motion.p
          className="text-slate-600 text-center mb-10"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Atendemos Pinheiral, Volta Redonda e região com compromisso e qualidade.
        </motion.p>

        {useLoop(depoimentos) ? (
          <div className="overflow-hidden -mx-4">
            <div
              className="flex gap-4 py-2"
              style={{ animation: "depoimentosScrollHorizontal 35s linear infinite" }}
            >
              {[...depoimentos, ...depoimentos].map((d, i) => (
                <Card key={`${d.id}-${i}`} d={d} />
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {depoimentos.map((d, i) => (
              <motion.div
                key={d.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ delay: i * 0.1, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <Card d={d} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
