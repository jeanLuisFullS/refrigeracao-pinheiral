import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Produtos à venda",
  description: "Geladeiras, freezers e eletrodomésticos novos e usados. Refrigeração Pinheiral - Pinheiral e Volta Redonda. Compre pelo WhatsApp.",
};

export default function ProdutosLayout({ children }: { children: React.ReactNode }) {
  return children;
}
