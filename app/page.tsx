import { getConfig, getAnuncios, getDepoimentos } from "@/lib/admin-data";
import type { Config, Anuncio, Depoimento } from "@/lib/data";
import { config as staticConfig } from "@/lib/data";
import HomeContent from "./HomeContent";

export const revalidate = 0;

export default async function Page() {
  const [configRaw, anunciosRaw, depoimentosRaw] = await Promise.all([
    getConfig(),
    getAnuncios(),
    getDepoimentos(),
  ]);
  const config = (configRaw?.nome ? configRaw : staticConfig) as Config;
  const anuncios = (Array.isArray(anunciosRaw) ? anunciosRaw : []) as Anuncio[];
  const depoimentos = (Array.isArray(depoimentosRaw) ? depoimentosRaw : []) as Depoimento[];
  return <HomeContent config={config} anuncios={anuncios} depoimentos={depoimentos} />;
}
