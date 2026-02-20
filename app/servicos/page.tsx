import { getConfig } from "@/lib/admin-data";
import type { Config } from "@/lib/data";
import { config as staticConfig } from "@/lib/data";
import ServicosContent from "./ServicosContent";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ServicosPage() {
  const configRaw = await getConfig();
  const config = (configRaw?.nome ? configRaw : staticConfig) as Config;
  return <ServicosContent config={config} />;
}
