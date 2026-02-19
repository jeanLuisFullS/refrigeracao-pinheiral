import { NextResponse } from "next/server";
import { destroySession, getTokenFromCookie } from "@/lib/auth";

export async function POST(request: Request) {
  const token = getTokenFromCookie(request.headers.get("cookie"));
  if (token) await destroySession(token);
  const res = NextResponse.json({ ok: true });
  res.headers.set("Set-Cookie", "admin_session=; Path=/; HttpOnly; Max-Age=0");
  return res;
}
