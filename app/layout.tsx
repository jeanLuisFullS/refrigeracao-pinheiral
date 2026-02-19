import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import VisitorTracker from "@/components/VisitorTracker";
import ErrorReporter from "@/components/ErrorReporter";
import MaintenanceGate from "@/components/MaintenanceGate";
import { config } from "@/lib/data";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://refrigeracaopinheiral.com.br";

export const metadata: Metadata = {
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  title: {
    default: `${config.nome} | Assistência Técnica em Pinheiral e Volta Redonda`,
    template: `%s | ${config.nome}`,
  },
  description: config.descricao,
  keywords: [
    "assistência técnica geladeira",
    "onde consertar geladeira em Volta Redonda",
    "conserto geladeira Volta Redonda",
    "assistência técnica ar condicionado Pinheiral",
    "conserto máquina de lavar",
    "manutenção freezer",
    "refrigeração Pinheiral",
    "Pinheiral",
    "Volta Redonda",
  ],
  openGraph: {
    title: config.nome,
    description: config.descricao,
    url: baseUrl,
    siteName: config.nome,
    locale: "pt_BR",
  },
};

function LocalBusinessJsonLd() {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: config.nome,
    description: config.descricao,
    url: baseUrl,
    telephone: config.telefones.map((t) => `+${t.numero}`).join(", "),
    areaServed: config.areasAtendimento.map((city) => ({
      "@type": "City",
      name: city,
    })),
    openingHours: config.horario,
    priceRange: "$$",
  };
  if (config.endereco.rua) {
    schema.address = {
      "@type": "PostalAddress",
      streetAddress: config.endereco.rua,
      addressLocality: config.endereco.cidade,
      addressRegion: config.endereco.estado,
      postalCode: config.endereco.cep || undefined,
    };
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={plusJakarta.variable}>
      <head>
        <LocalBusinessJsonLd />
      </head>
      <body className="font-sans min-h-screen flex flex-col bg-slate-50">
        <VisitorTracker />
        <ErrorReporter />
        <MaintenanceGate>
          <Header />
          <main className="flex-1 pt-16">{children}</main>
          <Footer />
          <WhatsAppButton />
        </MaintenanceGate>
      </body>
    </html>
  );
}
