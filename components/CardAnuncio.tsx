"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { getWhatsAppUrl, buildWhatsAppMessage } from "@/lib/data";
import type { Anuncio } from "@/lib/data";

function getImagens(a: Anuncio): string[] {
  if (a.imagens && a.imagens.length > 0) return a.imagens;
  return a.imagem ? [a.imagem] : [];
}

export default function CardAnuncio({ anuncio }: { anuncio: Anuncio }) {
  const msg = buildWhatsAppMessage("produto", {
    titulo: anuncio.titulo,
    preco: anuncio.preco,
  });
  const url = getWhatsAppUrl(msg);
  const imagens = getImagens(anuncio);
  const primeiraImg = imagens[0];
  const isPlaceholder = !primeiraImg || primeiraImg.includes("placeholder");
  const condicao = anuncio.condicao === "novo" ? "Novo" : "Usado";

  return (
    <motion.article
      className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md hover:border-teal-200 transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <Link href={`/produtos/${anuncio.id}`} className="block">
        <div className="aspect-[4/3] bg-slate-100 relative flex items-center justify-center overflow-hidden group">
          {isPlaceholder ? (
            <span className="text-5xl text-slate-300" aria-hidden>📦</span>
          ) : primeiraImg.startsWith("http") ? (
            <img
              src={primeiraImg}
              alt={anuncio.titulo}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <Image
              src={primeiraImg}
              alt={anuncio.titulo}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          )}
          {imagens.length > 1 && (
            <span className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
              {imagens.length} fotos
            </span>
          )}
          <span className="absolute top-2 left-2 bg-teal-600 text-white text-xs font-medium px-2 py-1 rounded-md">
            {condicao}
          </span>
        </div>
      </Link>
      <div className="p-5">
        <h3 className="font-bold text-slate-900">{anuncio.titulo}</h3>
        <p className="text-slate-600 text-sm mt-1 line-clamp-2">{anuncio.descricao}</p>
        <p className="text-brand-primary font-bold mt-3">{anuncio.preco || "Preço no WhatsApp"}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href={`/produtos/${anuncio.id}`}
            className="inline-flex items-center gap-2 text-teal-600 font-medium text-sm hover:underline"
          >
            Ver fotos e detalhes
          </Link>
          <motion.a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#20bd5a] transition"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Compre pelo WhatsApp
          </motion.a>
        </div>
      </div>
    </motion.article>
  );
}
