import type { Metadata } from "next";
import Link from "next/link";
import { config } from "@/lib/data";

export const metadata: Metadata = {
  title: "Quem somos",
  description: `Conheça a ${config.nome}. Assistência técnica em geladeira, freezer, lavadora e ar condicionado. Atendimento em Pinheiral, Volta Redonda e região.`,
};

export default function QuemSomosPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">
        Quem somos
      </h1>
      <div className="text-slate-600 space-y-6 leading-relaxed">
        <p>
          A <strong className="text-slate-800">{config.nome}</strong> é uma empresa de assistência técnica
          especializada em refrigeração e eletrodomésticos. Atendemos{" "}
          <strong className="text-slate-800">Pinheiral</strong>,{" "}
          <strong className="text-slate-800">Volta Redonda</strong> e toda a região com agilidade e preço justo.
        </p>
        <p>
          Oferecemos conserto e manutenção de <strong className="text-slate-800">geladeiras</strong>,{" "}
          <strong className="text-slate-800">freezers</strong>,{" "}
          <strong className="text-slate-800">máquinas de lavar</strong> e{" "}
          <strong className="text-slate-800">ar condicionado</strong>, além da venda de equipamentos novos e usados.
        </p>
        <p>
          Nossa missão é resolver o seu problema com transparência e qualidade. Entre em contato
          pelo WhatsApp ou peça um orçamento sem compromisso.
        </p>
      </div>
      <p className="mt-8 text-slate-600 font-medium">
        Atendimento em {config.areasAtendimento.join(", ")}.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <a
          href={`https://wa.me/${config.whatsappPrincipal}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#20bd5a] transition"
        >
          Fale no WhatsApp
        </a>
        <Link
          href="/orcamento"
          className="inline-flex items-center gap-2 bg-brand-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-brand-primary-hover transition"
        >
          Peça orçamento
        </Link>
      </div>
    </div>
  );
}
