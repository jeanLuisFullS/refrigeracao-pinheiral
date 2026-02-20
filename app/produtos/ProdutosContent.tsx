"use client";

import { motion } from "framer-motion";
import CardAnuncio from "@/components/CardAnuncio";
import type { Anuncio, Config } from "@/lib/data";

export default function ProdutosContent({ anuncios, config }: { anuncios: Anuncio[]; config: Config }) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <motion.h1
        className="text-3xl font-bold text-slate-900 mb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        Produtos à venda
      </motion.h1>
      <motion.p
        className="text-slate-600 mb-10"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
      >
        Geladeiras e freezers em ótimo estado. Entre em contato pelo WhatsApp para mais informações.
      </motion.p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {anuncios.map((a, i) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <CardAnuncio anuncio={a} config={config} />
          </motion.div>
        ))}
      </div>
      {anuncios.length === 0 && (
        <motion.p
          className="text-slate-500 text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          Em breve novos itens.
        </motion.p>
      )}
    </div>
  );
}
