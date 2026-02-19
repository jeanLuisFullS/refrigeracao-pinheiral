import { NextResponse } from "next/server";
import { getMaintenance } from "@/lib/admin-data";

export async function GET() {
  const state = await getMaintenance();
  return NextResponse.json({ enabled: state.enabled, message: state.message });
}
