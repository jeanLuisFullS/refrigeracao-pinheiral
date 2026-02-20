import { getConfig } from "@/lib/admin-data";
import type { Config } from "@/lib/data";
import { config as staticConfig } from "@/lib/data";
import ContatoContent from "./ContatoContent";

export default async function ContatoPage() {
  const configRaw = await getConfig();
  const config = (configRaw?.nome ? configRaw : staticConfig) as Config;
  return <ContatoContent config={config} />;
}
