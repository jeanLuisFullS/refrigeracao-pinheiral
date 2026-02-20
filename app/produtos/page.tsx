import { getAnuncios, getConfig } from "@/lib/admin-data";
import type { Anuncio, Config } from "@/lib/data";
import { config as staticConfig } from "@/lib/data";
import ProdutosContent from "./ProdutosContent";

export const revalidate = 0;

export default async function ProdutosPage() {
  const [anunciosRaw, configRaw] = await Promise.all([getAnuncios(), getConfig()]);
  const anuncios = (Array.isArray(anunciosRaw) ? anunciosRaw : []) as Anuncio[];
  const config = (configRaw?.nome ? configRaw : staticConfig) as Config;
  return <ProdutosContent anuncios={anuncios} config={config} />;
}
