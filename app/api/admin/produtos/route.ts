import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getAnuncios, setAnuncios } from "@/lib/admin-data";
import { nanoid } from "nanoid";

type Anuncio = {
  id: string;
  titulo: string;
  descricao: string;
  preco: string;
  imagem: string;
  imagens?: string[];
  condicao?: "novo" | "usado";
  destaque?: boolean;
};

function normalizeAnuncio(body: Record<string, unknown>): Partial<Anuncio> {
  const imagens = Array.isArray(body.imagens) ? (body.imagens as string[]).filter(Boolean) : undefined;
  const imagem = typeof body.imagem === "string" ? body.imagem : (imagens?.[0] ?? "/placeholder-geladeira.jpg");
  return {
    titulo: (body.titulo as string) ?? "",
    descricao: (body.descricao as string) ?? "",
    preco: (body.preco as string) ?? "",
    imagem,
    imagens: imagens?.length ? imagens : [imagem],
    condicao: body.condicao === "novo" || body.condicao === "usado" ? body.condicao : "usado",
    destaque: !!body.destaque,
  };
}

export async function GET(request: Request) {
  const err = await requireAdmin(request);
  if (err) return err;
  const list = await getAnuncios();
  return NextResponse.json(list);
}

export async function POST(request: Request) {
  const err = await requireAdmin(request);
  if (err) return err;
  const body = await request.json();
  const list = (await getAnuncios()) as Anuncio[];
  const norm = normalizeAnuncio(body);
  const newItem: Anuncio = {
    id: nanoid(8),
    titulo: norm.titulo ?? "",
    descricao: norm.descricao ?? "",
    preco: norm.preco ?? "",
    imagem: norm.imagem ?? "/placeholder-geladeira.jpg",
    imagens: norm.imagens ?? [norm.imagem ?? "/placeholder-geladeira.jpg"],
    condicao: norm.condicao ?? "usado",
    destaque: !!norm.destaque,
  };
  list.push(newItem);
  try {
    await setAnuncios(list);
  } catch {
    return NextResponse.json(
      { error: "Não foi possível salvar (na Vercel os dados não são gravados). Edite o repositório: altere data/anuncios.json e faça um novo deploy, ou use o site em um servidor com disco gravável." },
      { status: 503 }
    );
  }
  return NextResponse.json(newItem);
}

export async function PUT(request: Request) {
  const err = await requireAdmin(request);
  if (err) return err;
  const body = await request.json();
  const { id, ...rest } = body;
  if (!id) return NextResponse.json({ error: "id obrigatório" }, { status: 400 });
  const list = (await getAnuncios()) as Anuncio[];
  const idx = list.findIndex((x) => x.id === id);
  if (idx === -1) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  const norm = normalizeAnuncio(rest);
  list[idx] = { ...list[idx], ...norm };
  try {
    await setAnuncios(list);
  } catch {
    return NextResponse.json(
      { error: "Não foi possível salvar (na Vercel os dados não são gravados). Edite data/anuncios.json no repositório e faça um novo deploy." },
      { status: 503 }
    );
  }
  return NextResponse.json(list[idx]);
}

export async function DELETE(request: Request) {
  const err = await requireAdmin(request);
  if (err) return err;
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id obrigatório" }, { status: 400 });
  const list = (await getAnuncios()) as Anuncio[];
  const filtered = list.filter((x) => x.id !== id);
  if (filtered.length === list.length) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  try {
    await setAnuncios(filtered);
  } catch {
    return NextResponse.json(
      { error: "Não foi possível excluir (na Vercel os dados não são gravados). Edite data/anuncios.json e faça um novo deploy." },
      { status: 503 }
    );
  }
  return NextResponse.json({ ok: true });
}
