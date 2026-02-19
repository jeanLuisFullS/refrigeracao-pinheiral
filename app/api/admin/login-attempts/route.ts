import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getAllAttempts } from "@/lib/rate-limit";

export async function GET(request: Request) {
  const err = await requireAdmin(request);
  if (err) return err;
  const list = await getAllAttempts();
  return NextResponse.json(list);
}
