import { NextResponse } from "next/server";
import { verifySession, getTokenFromCookie } from "./auth";

export async function requireAdmin(request: Request): Promise<NextResponse | null> {
  const token = getTokenFromCookie(request.headers.get("cookie"));
  if (!token) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const valid = await verifySession(token);
  if (!valid) return NextResponse.json({ error: "Sessão expirada" }, { status: 401 });
  return null;
}
