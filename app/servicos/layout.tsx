import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Serviços - Assistência técnica",
  description: "Assistência técnica em geladeira, freezer, máquina de lavar e ar condicionado em Pinheiral, Volta Redonda e região. Conserto e manutenção.",
};

export default function ServicosLayout({ children }: { children: React.ReactNode }) {
  return children;
}
