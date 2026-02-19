import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getVisitors } from "@/lib/admin-data";

export async function GET(request: Request) {
  const err = await requireAdmin(request);
  if (err) return err;
  const list = await getVisitors();
  const total = list.length;
  const byPath: Record<string, number> = {};
  for (const v of list) {
    byPath[v.path] = (byPath[v.path] || 0) + 1;
  }
  const recent = list.slice(-100).reverse();
  return NextResponse.json({ total, byPath, recent });
}
