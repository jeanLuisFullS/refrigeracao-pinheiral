import type { Metadata } from "next";
import { config } from "@/lib/data";

export const metadata: Metadata = {
  title: "Peça orçamento",
  description: `Solicite orçamento para conserto de geladeira, freezer, lavadora ou ar condicionado. ${config.nome} - Pinheiral, Volta Redonda e região.`,
};

export default function OrcamentoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
