import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import VisitorTracker from "@/components/VisitorTracker";
import ErrorReporter from "@/components/ErrorReporter";
import MaintenanceGate from "@/components/MaintenanceGate";
import { getConfig } from "@/lib/admin-data";
import type { Config } from "@/lib/data";
import { config as staticConfig } from "@/lib/data";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://refrigeracaopinheiral.com.br";

export async function generateMetadata(): Promise<Metadata> {
  const configRaw = await getConfig();
  const c = (configRaw?.nome ? configRaw : staticConfig) as Config;
  return {
    icons: { icon: "/icon.svg", apple: "/icon.svg" },
    title: { default: `${c.nome} | Assistência Técnica em Pinheiral e Volta Redonda`, template: `%s | ${c.nome}` },
    description: c.descricao,
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
    openGraph: { title: c.nome, description: c.descricao, url: baseUrl, siteName: c.nome, locale: "pt_BR" },
  };
}

function LocalBusinessJsonLd({ config }: { config: Config }) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: config.nome,
    description: config.descricao,
    url: baseUrl,
    telephone: config.telefones?.map((t) => `+${t.numero}`).join(", ") ?? "",
    areaServed: (config.areasAtendimento ?? []).map((city) => ({ "@type": "City", name: city })),
    openingHours: config.horario ?? "",
    priceRange: "$$",
  };
  if (config.endereco?.rua) {
    schema.address = {
      "@type": "PostalAddress",
      streetAddress: config.endereco.rua,
      addressLocality: config.endereco.cidade,
      addressRegion: config.endereco.estado,
      postalCode: config.endereco.cep || undefined,
    };
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const configRaw = await getConfig();
  const c = (configRaw?.nome ? configRaw : staticConfig) as Config;
  return (
    <html lang="pt-BR" className={plusJakarta.variable}>
      <head>
        <LocalBusinessJsonLd config={c} />
      </head>
      <body className="font-sans min-h-screen flex flex-col bg-slate-50">
        <VisitorTracker />
        <ErrorReporter />
        <MaintenanceGate>
          <Header config={c} />
          <main className="flex-1 pt-16">{children}</main>
          <Footer config={c} />
          <WhatsAppButton config={c} />
        </MaintenanceGate>
      </body>
    </html>
  );
}
