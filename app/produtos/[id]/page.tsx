import { notFound } from "next/navigation";
import { getAnuncios, getConfig } from "@/lib/admin-data";
import type { Anuncio, Config } from "@/lib/data";
import { config as staticConfig } from "@/lib/data";
import PaginaAnuncio from "./PaginaAnuncio";

type Params = { id: string };

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const list = (await getAnuncios()) as { id: string; titulo: string }[];
  const item = list.find((a) => a.id === id);
  if (!item) return { title: "Produto" };
  return { title: `${item.titulo} | Produtos` };
}

export default async function ProdutoPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const [list, configRaw] = await Promise.all([getAnuncios(), getConfig()]);
  const anuncios = (Array.isArray(list) ? list : []) as Anuncio[];
  const anuncio = anuncios.find((a) => a.id === id);
  if (!anuncio) notFound();
  const config = (configRaw?.nome ? configRaw : staticConfig) as Config;
  return <PaginaAnuncio anuncio={anuncio} config={config} />;
}
