import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getVisitors, getOrcamentos, getAnuncios, getErrorLogs } from "@/lib/admin-data";

export async function GET(request: Request) {
  const err = await requireAdmin(request);
  if (err) return err;
  const [visitors, orcamentos, anuncios, errors] = await Promise.all([
    getVisitors(),
    getOrcamentos(),
    getAnuncios(),
    getErrorLogs(),
  ]);
  const totalVisitors = visitors.length;
  const totalOrcamentos = (orcamentos as unknown[]).length;
  const totalProdutos = (anuncios as unknown[]).length;
  const totalErrors = errors.length;
  const last24h = Date.now() - 24 * 60 * 60 * 1000;
  const visitors24h = visitors.filter((v) => new Date(v.timestamp).getTime() > last24h).length;
  return NextResponse.json({
    totalVisitors,
    visitors24h,
    totalOrcamentos,
    totalProdutos,
    totalErrors,
  });
}
