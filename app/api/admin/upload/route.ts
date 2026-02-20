import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";
import { getSupabase } from "@/lib/supabase";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const BUCKET = "uploads";

export async function POST(request: Request) {
  const err = await requireAdmin(request);
  if (err) return err;

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
  }

  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json({ error: "Tipo não permitido. Use JPEG, PNG, WebP ou GIF." }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Arquivo muito grande. Máximo 5MB." }, { status: 400 });
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const safeExt = ["jpg", "jpeg", "png", "webp", "gif"].includes(ext) ? ext : "jpg";
  const filename = `${nanoid(10)}.${safeExt}`;

  const sb = getSupabase();
  if (sb) {
    try {
      const bytes = await file.arrayBuffer();
      const { error } = await sb.storage.from(BUCKET).upload(filename, Buffer.from(bytes), {
        contentType: file.type,
        upsert: true,
      });
      if (error) {
        console.error(error);
        return NextResponse.json(
          { error: "Não foi possível enviar o arquivo para o storage. Tente novamente ou use uma URL externa." },
          { status: 503 }
        );
      }
      const { data } = sb.storage.from(BUCKET).getPublicUrl(filename);
      return NextResponse.json({ url: data.publicUrl });
    } catch (e) {
      console.error(e);
      return NextResponse.json(
        { error: "Erro ao enviar arquivo. Use uma URL externa (Imgur, link público) no formulário se preferir." },
        { status: 503 }
      );
    }
  }

  const dir = path.join(process.cwd(), "public", "uploads");
  try {
    await mkdir(dir, { recursive: true });
    const bytes = await file.arrayBuffer();
    await writeFile(path.join(dir, filename), Buffer.from(bytes));
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        error:
          "Não foi possível salvar o arquivo (na Vercel o disco é somente leitura). Configure Supabase (Storage) ou use a URL da imagem no formulário.",
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ url: "/uploads/" + filename });
}
