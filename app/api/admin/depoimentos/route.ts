import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getDepoimentos, setDepoimentos } from "@/lib/admin-data";
import { nanoid } from "nanoid";

export async function GET(request: Request) {
  const err = await requireAdmin(request);
  if (err) return err;
  const list = await getDepoimentos();
  return NextResponse.json(list);
}

export async function POST(request: Request) {
  const err = await requireAdmin(request);
  if (err) return err;
  const body = await request.json();
  const list = await getDepoimentos();
  const newItem = {
    id: nanoid(8),
    nome: body.nome ?? "",
    cidade: body.cidade ?? "",
    texto: body.texto ?? "",
  };
  list.push(newItem);
  await setDepoimentos(list);
  return NextResponse.json(newItem);
}

export async function PUT(request: Request) {
  const err = await requireAdmin(request);
  if (err) return err;
  const body = await request.json();
  const { id, ...rest } = body;
  if (!id) return NextResponse.json({ error: "id obrigatório" }, { status: 400 });
  const list = await getDepoimentos() as { id: string }[];
  const idx = list.findIndex((x) => (x as { id: string }).id === id);
  if (idx === -1) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  (list[idx] as Record<string, unknown>) = { ...list[idx], ...rest };
  await setDepoimentos(list);
  return NextResponse.json(list[idx]);
}

export async function DELETE(request: Request) {
  const err = await requireAdmin(request);
  if (err) return err;
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id obrigatório" }, { status: 400 });
  const list = await getDepoimentos() as { id: string }[];
  const filtered = list.filter((x) => (x as { id: string }).id !== id);
  if (filtered.length === list.length) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  await setDepoimentos(filtered);
  return NextResponse.json({ ok: true });
}
