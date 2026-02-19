import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getConfig, setConfig } from "@/lib/admin-data";

export async function GET(request: Request) {
  const err = await requireAdmin(request);
  if (err) return err;
  const config = await getConfig();
  return NextResponse.json(config);
}

export async function PUT(request: Request) {
  const err = await requireAdmin(request);
  if (err) return err;
  const body = await request.json();
  await setConfig(body);
  return NextResponse.json({ ok: true });
}
