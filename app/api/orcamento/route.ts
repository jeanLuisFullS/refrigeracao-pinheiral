import { NextResponse } from "next/server";
import { writeFile, readFile } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nome, telefone, cidade, aparelho, descricao } = body;

    if (!nome || !telefone || !cidade || !aparelho || !descricao) {
      return NextResponse.json(
        { error: "Campos obrigatórios faltando" },
        { status: 400 }
      );
    }

    const dataDir = path.join(process.cwd(), "data");
    const filePath = path.join(dataDir, "orcamentos.json");

    let orcamentos: unknown[] = [];
    try {
      const content = await readFile(filePath, "utf-8");
      orcamentos = JSON.parse(content);
    } catch {
      orcamentos = [];
    }

    orcamentos.push({
      nome,
      telefone,
      cidade,
      aparelho,
      descricao,
      data: new Date().toISOString(),
    });

    await writeFile(filePath, JSON.stringify(orcamentos, null, 2), "utf-8");

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erro ao salvar" }, { status: 500 });
  }
}
