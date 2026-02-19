import { notFound } from "next/navigation";
import { getAnuncios } from "@/lib/admin-data";
import type { Anuncio } from "@/lib/data";
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
  const list = (await getAnuncios()) as Anuncio[];
  const anuncio = list.find((a) => a.id === id);
  if (!anuncio) notFound();
  return <PaginaAnuncio anuncio={anuncio} />;
}
