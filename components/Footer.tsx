import Link from "next/link";
import { config } from "@/lib/data";
import LogoPinheiros from "./LogoPinheiros";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-white mb-3">
              <LogoPinheiros width={40} height={32} treeColor="#0d9488" />
              <span className="font-bold text-slate-100">{config.nome}</span>
            </Link>
            <p className="text-slate-400 text-sm">{config.descricao}</p>
            <p className="text-slate-500 text-sm mt-2">Atendemos: {config.areasAtendimento.join(", ")}.</p>
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm uppercase tracking-wider mb-3">Contato</h3>
            <p className="text-slate-400 text-sm">{config.horario}</p>
            <div className="mt-2 space-y-1">
              {config.telefones.map((t) => (
                <a
                  key={t.numero}
                  href={`https://wa.me/${t.numero}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-teal-400 hover:text-teal-300 text-sm"
                >
                  {t.label}
                </a>
              ))}
            </div>
            {config.endereco.rua && (
              <p className="text-slate-500 text-sm mt-2">
                {config.endereco.rua}, {config.endereco.cidade} - {config.endereco.estado}
              </p>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm uppercase tracking-wider mb-3">Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/servicos" className="text-slate-400 hover:text-teal-400 text-sm transition">
                  Serviços
                </Link>
              </li>
              <li>
                <Link href="/produtos" className="text-slate-400 hover:text-teal-400 text-sm transition">
                  Produtos
                </Link>
              </li>
              <li>
                <Link href="/quem-somos" className="text-slate-400 hover:text-teal-400 text-sm transition">
                  Quem somos
                </Link>
              </li>
              <li>
                <Link href="/orcamento" className="text-slate-400 hover:text-teal-400 text-sm transition">
                  Peça orçamento
                </Link>
              </li>
              <li>
                <Link href="/contato" className="text-slate-400 hover:text-teal-400 text-sm transition">
                  Contato
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
          © {new Date().getFullYear()} {config.nome}. Pinheiral, Volta Redonda e região.
        </div>
      </div>
    </footer>
  );
}
