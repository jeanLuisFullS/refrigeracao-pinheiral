import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminPasswordHash, verifyPassword } from "@/lib/auth";
import { setAdminPasswordHash } from "@/lib/admin-data";

export async function POST(request: Request) {
  const err = await requireAdmin(request);
  if (err) return err;

  let body: { currentPassword?: string; newPassword?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  const currentPassword = body.currentPassword?.trim();
  const newPassword = body.newPassword?.trim();

  if (!currentPassword || !newPassword) {
    return NextResponse.json(
      { error: "Senha atual e nova senha são obrigatórias." },
      { status: 400 }
    );
  }

  if (newPassword.length < 6) {
    return NextResponse.json(
      { error: "A nova senha deve ter no mínimo 6 caracteres." },
      { status: 400 }
    );
  }

  const valid = await verifyPassword(currentPassword);
  if (!valid) {
    return NextResponse.json(
      { error: "Senha atual incorreta." },
      { status: 401 }
    );
  }

  const hash = await getAdminPasswordHash();
  if (!hash) {
    return NextResponse.json(
      { error: "Configuração do painel indisponível." },
      { status: 503 }
    );
  }

  const newHash = await bcrypt.hash(newPassword, 12);
  await setAdminPasswordHash(newHash);

  return NextResponse.json({ ok: true });
}
