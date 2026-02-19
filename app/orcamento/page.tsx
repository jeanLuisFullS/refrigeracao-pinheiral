"use client";

import { motion } from "framer-motion";
import FormOrcamento from "@/components/FormOrcamento";

export default function OrcamentoPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <motion.h1
        className="text-3xl font-bold text-slate-900 mb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        Peça seu orçamento
      </motion.h1>
      <motion.p
        className="text-slate-600 mb-8"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
      >
        Preencha os dados abaixo e você será redirecionado ao WhatsApp para concluir o contato.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <FormOrcamento variant="full" />
      </motion.div>
    </div>
  );
}
