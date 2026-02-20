"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { getWhatsAppUrl, buildWhatsAppMessage } from "@/lib/data";
import type { Anuncio, Config } from "@/lib/data";
import CarrosselFotos from "@/components/CarrosselFotos";

function getImagens(a: Anuncio): string[] {
  if (a.imagens && a.imagens.length > 0) return a.imagens;
  return a.imagem ? [a.imagem] : [];
}

export default function PaginaAnuncio({ anuncio, config }: { anuncio: Anuncio; config?: Config }) {
  const imagens = getImagens(anuncio);
  const msg = buildWhatsAppMessage("produto", { titulo: anuncio.titulo, preco: anuncio.preco }, config);
  const whatsappUrl = getWhatsAppUrl(msg, config);
  const condicao = anuncio.condicao === "novo" ? "Novo" : "Usado";

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link href="/produtos" className="text-teal-600 font-medium hover:underline mb-6 inline-block">
        ← Voltar aos produtos
      </Link>
      <motion.div
        className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-lg"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="p-4 sm:p-0">
          <CarrosselFotos
            imagens={imagens}
            titulo={anuncio.titulo}
            aspectRatio="4/3"
            autoAdvanceMs={5000}
            hoverZoom
          />
        </div>
        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="bg-teal-600 text-white text-sm font-medium px-2.5 py-1 rounded-md">
              {condicao}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{anuncio.titulo}</h1>
          <p className="text-slate-600 mt-3 leading-relaxed">{anuncio.descricao}</p>
          <p className="text-brand-primary font-bold text-xl mt-4">{anuncio.preco || "Preço no WhatsApp"}</p>
          <motion.a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#20bd5a] transition"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Comprar pelo WhatsApp
          </motion.a>
        </div>
      </motion.div>
    </div>
  );
}
