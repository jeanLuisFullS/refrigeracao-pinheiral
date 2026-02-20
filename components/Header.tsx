"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Config } from "@/lib/data";
import { config as defaultConfig } from "@/lib/data";
import LogoPinheiros from "./LogoPinheiros";

const links = [
  { href: "/", label: "Home" },
  { href: "/quem-somos", label: "Quem somos" },
  { href: "/servicos", label: "Serviços" },
  { href: "/produtos", label: "Produtos" },
  { href: "/contato", label: "Contato" },
  { href: "/orcamento", label: "Orçamento" },
];

export default function Header({ config: configProp }: { config?: Config } = {}) {
  const config = configProp ?? defaultConfig;
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 text-slate-800 hover:text-brand-primary transition-colors">
          <LogoPinheiros width={44} height={36} treeColor="#0d9488" className="flex-shrink-0" />
          <span className="font-bold text-lg tracking-tight hidden sm:block">{config.nome}</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-slate-600 hover:text-brand-primary transition-colors text-sm font-medium"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <a
          href={`https://wa.me/${config.whatsappPrincipal}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-flex items-center gap-2 bg-[#25D366] text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-[#20bd5a] transition-all text-sm shadow-sm"
        >
          Fale no WhatsApp
        </a>
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 text-slate-700 rounded-lg hover:bg-slate-100 transition"
          aria-label="Menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden border-t border-slate-200 bg-white"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-slate-700 hover:text-brand-primary hover:bg-slate-50 py-3 px-3 rounded-lg transition text-sm font-medium"
                >
                  {link.label}
                </Link>
              ))}
              <a
                href={`https://wa.me/${config.whatsappPrincipal}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] text-white px-4 py-3 rounded-xl font-semibold text-center mt-2"
              >
                Fale no WhatsApp
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
