import { NextResponse } from "next/server";
import { verifySession, getTokenFromCookie } from "@/lib/auth";

export async function GET(request: Request) {
  const token = getTokenFromCookie(request.headers.get("cookie"));
  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  const valid = await verifySession(token);
  if (!valid) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true });
}
