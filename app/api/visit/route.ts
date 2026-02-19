import { NextResponse } from "next/server";
import { appendVisitor, hashIp } from "@/lib/admin-data";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const path = typeof body.path === "string" ? body.path : "/";
    if (path.startsWith("/admin")) return NextResponse.json({ ok: true });
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      || request.headers.get("x-real-ip")
      || "unknown";
    const ua = request.headers.get("user-agent") || "";
    await appendVisitor({ path, ipHash: hashIp(ip), ua });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
