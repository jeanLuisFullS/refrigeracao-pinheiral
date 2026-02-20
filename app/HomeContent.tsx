"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import FormOrcamento from "@/components/FormOrcamento";
import CardAnuncio from "@/components/CardAnuncio";
import SecaoDepoimentos from "@/components/SecaoDepoimentos";
import LogoPinheiros from "@/components/LogoPinheiros";
import type { Config, Anuncio, Depoimento } from "@/lib/data";

const servicos = [
  { titulo: "Geladeiras e Freezers", descricao: "Conserto, manutenção e instalação.", icon: "🧊" },
  { titulo: "Lavadoras", descricao: "Reparo e manutenção de máquinas de lavar.", icon: "🧺" },
  { titulo: "Ar Condicionado", descricao: "Instalação, limpeza e assistência técnica.", icon: "❄️" },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

type Props = { config: Config; anuncios: Anuncio[]; depoimentos: Depoimento[] };

export default function HomeContent({ config, anuncios, depoimentos }: Props) {
  const destaques = anuncios.filter((a) => a.destaque);

  return (
    <>
      <section className="relative min-h-[85vh] flex items-center justify-center px-4 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(13,148,136,0.25),transparent)]" />
        <motion.div className="relative text-center max-w-2xl" initial="hidden" animate="show" variants={container}>
          <motion.div variants={item} className="flex justify-center mb-6">
            <LogoPinheiros width={80} height={56} treeColor="#5eead4" />
          </motion.div>
          <motion.h1 variants={item} className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            {config.nome}
          </motion.h1>
          <motion.p variants={item} className="text-teal-300 text-lg md:text-xl mt-2 font-medium">
            {config.slogan}
          </motion.p>
          <motion.p variants={item} className="text-slate-300 mt-4 text-sm md:text-base">
            Atendimento em Pinheiral, Volta Redonda e região
          </motion.p>
          <motion.div variants={item} className="mt-10 flex flex-wrap gap-3 justify-center">
            <motion.a
              href={`https://wa.me/${config.whatsappPrincipal}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#20bd5a] transition-all shadow-lg"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Fale no WhatsApp
            </motion.a>
            <Link href="/#orcamento">
              <motion.span
                className="inline-flex items-center gap-2 bg-teal-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-teal-600 transition-all"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                Peça orçamento
              </motion.span>
            </Link>
            <a href={`https://wa.me/${config.whatsappPrincipal}?text=${encodeURIComponent("Olá! Gostaria de agendar uma visita.")}`}>
              <motion.span
                className="inline-flex items-center border-2 border-teal-400 text-teal-300 px-6 py-3 rounded-xl font-semibold hover:bg-teal-500/10 transition-all"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                Agende uma visita
              </motion.span>
            </a>
          </motion.div>
        </motion.div>
      </section>

      <section id="servicos" className="py-20 px-4 scroll-mt-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Nossos serviços</h2>
            <p className="text-slate-600 mt-2 max-w-xl mx-auto">Geladeiras, freezers, lavadoras e ar condicionado. Atendemos em domicílio.</p>
          </motion.div>
          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8" initial="hidden" whileInView="show" viewport={{ once: true, margin: "-40px" }} variants={container}>
            {servicos.map((s) => (
              <motion.div key={s.titulo} variants={item} transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }} className="bg-slate-50 rounded-2xl p-8 text-center border border-slate-100 hover:border-teal-200 hover:shadow-lg hover:shadow-teal-500/5 transition-all duration-300">
                <span className="text-4xl" aria-hidden>{s.icon}</span>
                <h3 className="font-bold text-slate-900 mt-4">{s.titulo}</h3>
                <p className="text-slate-600 text-sm mt-2">{s.descricao}</p>
              </motion.div>
            ))}
          </motion.div>
          <motion.div className="text-center mt-10" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <Link href="/servicos" className="text-brand-primary font-semibold hover:underline">Ver todos os serviços →</Link>
          </motion.div>
        </div>
      </section>

      <section id="produtos" className="py-20 px-4 scroll-mt-20 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Produtos à venda</h2>
            <p className="text-slate-600 mt-2">Geladeiras e freezers novos e usados. Compre pelo WhatsApp.</p>
          </motion.div>
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" initial="hidden" whileInView="show" viewport={{ once: true, margin: "-40px" }} variants={container}>
            {destaques.length > 0 ? destaques.map((a) => <CardAnuncio key={a.id} anuncio={a} config={config} />) : <p className="text-slate-500 col-span-full text-center py-8">Em breve novos itens.</p>}
          </motion.div>
          <motion.div className="text-center mt-10" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <Link href="/produtos" className="text-brand-primary font-semibold hover:underline">Ver todos os produtos →</Link>
          </motion.div>
        </div>
      </section>

      <SecaoDepoimentos depoimentos={depoimentos} />

      <section id="orcamento" className="py-20 px-4 scroll-mt-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Peça seu orçamento</h2>
            <p className="text-slate-600 mt-2">Preencha e seja redirecionado ao WhatsApp.</p>
          </motion.div>
          <motion.div className="flex justify-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <FormOrcamento variant="compact" config={config} />
          </motion.div>
        </div>
      </section>

      <section id="contato" className="py-20 px-4 scroll-mt-20 bg-slate-50">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>Contato</motion.h2>
          <motion.p className="text-slate-600 mb-8" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>{config.horario}</motion.p>
          <div className="flex flex-wrap justify-center gap-3">
            {(config.telefones ?? []).map((t) => (
              <a key={t.numero} href={`https://wa.me/${t.numero}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#25D366] text-white px-5 py-2.5 rounded-xl font-medium hover:bg-[#20bd5a] transition">
                {t.label}
              </a>
            ))}
          </div>
          <Link href="/contato" className="inline-block mt-6 text-brand-primary font-semibold hover:underline">Ver endereço e mapa →</Link>
        </div>
      </section>

      <section id="quem-somos" className="py-20 px-4 scroll-mt-20 bg-white border-t border-slate-100">
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">Quem somos</h2>
            <div className="text-slate-600 space-y-4 leading-relaxed">
              <p>
                A <strong className="text-slate-800">{config.nome}</strong> é uma empresa de assistência técnica especializada em refrigeração e eletrodomésticos, atendendo <strong className="text-slate-800">Pinheiral</strong>, <strong className="text-slate-800">Volta Redonda</strong> e toda a região.
              </p>
              <p>
                Oferecemos conserto e manutenção de <strong className="text-slate-800">geladeiras</strong>, <strong className="text-slate-800">freezers</strong>, <strong className="text-slate-800">máquinas de lavar</strong> e <strong className="text-slate-800">ar condicionado</strong>, com atendimento ágil e preço justo. Também trabalhamos com a venda de equipamentos novos e usados.
              </p>
              <p>Nossa missão é resolver o seu problema com transparência e qualidade. Entre em contato pelo WhatsApp ou peça um orçamento sem compromisso.</p>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
