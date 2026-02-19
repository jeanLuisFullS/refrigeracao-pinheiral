"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

type Props = {
  imagens: string[];
  titulo: string;
  alt?: string;
  aspectRatio?: "4/3" | "1/1";
  autoAdvanceMs?: number;
  hoverZoom?: boolean;
};

export default function CarrosselFotos({
  imagens,
  titulo,
  alt,
  aspectRatio = "4/3",
  autoAdvanceMs = 5000,
  hoverZoom = true,
}: Props) {
  const [index, setIndex] = useState(0);
  const list = imagens.length ? imagens : [];

  const go = useCallback(
    (dir: 1 | -1) => {
      setIndex((i) => {
        if (list.length <= 1) return i;
        return (i + dir + list.length) % list.length;
      });
    },
    [list.length]
  );

  useEffect(() => {
    if (list.length <= 1 || !autoAdvanceMs) return;
    const t = setInterval(() => go(1), autoAdvanceMs);
    return () => clearInterval(t);
  }, [list.length, autoAdvanceMs, go]);

  if (list.length === 0) {
    return (
      <div className={`${aspectRatio === "1/1" ? "aspect-square" : "aspect-[4/3]"} bg-slate-200 rounded-xl flex items-center justify-center`}>
        <span className="text-4xl text-slate-400">📦</span>
      </div>
    );
  }

  const single = list.length === 1;
  const src = list[index];
  const isExternal = src.startsWith("http");

  return (
    <div className="relative rounded-xl overflow-hidden bg-slate-100">
      <div
        className={`relative ${aspectRatio === "1/1" ? "aspect-square" : "aspect-[4/3]"}`}
        style={{ overflow: "hidden" }}
      >
        {isExternal ? (
          <img
            src={src}
            alt={alt || titulo}
            className={`w-full h-full object-cover transition-transform duration-300 ${hoverZoom ? "hover:scale-110" : ""}`}
            style={{ transformOrigin: "center" }}
          />
        ) : (
          <Image
            src={src}
            alt={alt || titulo}
            fill
            className={`object-cover transition-transform duration-300 ${hoverZoom ? "hover:scale-110" : ""}`}
            style={{ transformOrigin: "center" }}
            sizes="(max-width: 768px) 100vw, 600px"
          />
        )}
      </div>
      {!single && (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition"
            aria-label="Foto anterior"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition"
            aria-label="Próxima foto"
          >
            ›
          </button>
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
            {list.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                className={`w-2 h-2 rounded-full transition ${i === index ? "bg-white scale-125" : "bg-white/50 hover:bg-white/80"}`}
                aria-label={`Foto ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
