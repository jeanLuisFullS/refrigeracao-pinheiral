import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getOrcamentos } from "@/lib/admin-data";

export async function GET(request: Request) {
  const err = await requireAdmin(request);
  if (err) return err;
  const list = await getOrcamentos();
  return NextResponse.json(list);
}
