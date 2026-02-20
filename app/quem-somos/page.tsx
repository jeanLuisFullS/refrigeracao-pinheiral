import { getConfig } from "@/lib/admin-data";
import type { Config } from "@/lib/data";
import { config as staticConfig } from "@/lib/data";
import QuemSomosContent from "./QuemSomosContent";

export default async function QuemSomosPage() {
  const configRaw = await getConfig();
  const config = (configRaw?.nome ? configRaw : staticConfig) as Config;
  return <QuemSomosContent config={config} />;
}
