import { NextResponse } from "next/server";
import { appendErrorLog } from "@/lib/admin-data";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, stack, url } = body;
    if (!message) {
      return NextResponse.json({ error: "message obrigatório" }, { status: 400 });
    }
    const userAgent = request.headers.get("user-agent") || undefined;
    await appendErrorLog({ message, stack, url, userAgent });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erro ao registrar" }, { status: 500 });
  }
}
