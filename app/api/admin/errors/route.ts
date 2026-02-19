import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getErrorLogs } from "@/lib/admin-data";

export async function GET(request: Request) {
  const err = await requireAdmin(request);
  if (err) return err;
  const list = await getErrorLogs();
  return NextResponse.json(list);
}
