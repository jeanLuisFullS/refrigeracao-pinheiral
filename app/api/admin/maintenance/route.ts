import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getMaintenance, setMaintenance } from "@/lib/admin-data";

export async function GET(request: Request) {
  const err = await requireAdmin(request);
  if (err) return err;
  const state = await getMaintenance();
  return NextResponse.json(state);
}

export async function PUT(request: Request) {
  const err = await requireAdmin(request);
  if (err) return err;
  const body = await request.json();
  const state = await setMaintenance({
    enabled: !!body.enabled,
    message: body.message ?? "",
  });
  return NextResponse.json(state);
}
