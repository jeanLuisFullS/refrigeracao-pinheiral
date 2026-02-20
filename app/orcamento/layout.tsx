import type { Metadata } from "next";
import { getConfig } from "@/lib/admin-data";
import { config as staticConfig } from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  const configRaw = await getConfig();
  const nome = (configRaw as { nome?: string })?.nome ?? staticConfig.nome;
  return {
    title: "Peça orçamento",
    description: `Solicite orçamento para conserto de geladeira, freezer, lavadora ou ar condicionado. ${nome} - Pinheiral, Volta Redonda e região.`,
  };
}

export default function OrcamentoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
