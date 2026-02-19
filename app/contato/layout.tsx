import type { Metadata } from "next";
import { config } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contato",
  description: `Telefone, WhatsApp e endereço da ${config.nome}. Atendimento em Pinheiral, Volta Redonda e região.`,
};

export default function ContatoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
