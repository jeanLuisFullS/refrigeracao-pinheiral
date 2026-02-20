import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quem somos",
  description: "Conheça a Refrigeração Pinheiral. Assistência técnica em geladeira, freezer, máquina de lavar e ar condicionado em Pinheiral, Volta Redonda e região.",
};

export default function QuemSomosLayout({ children }: { children: React.ReactNode }) {
  return children;
}
