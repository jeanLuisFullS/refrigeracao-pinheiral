import { readFile, writeFile } from "fs/promises";
import path from "path";
import { isSupabaseConfigured } from "./supabase";
import {
  getConfigFromSupabase,
  setConfigInSupabase,
  getAnunciosFromSupabase,
  setAnunciosInSupabase,
  getDepoimentosFromSupabase,
  setDepoimentosInSupabase,
  getAdminDataFromSupabase,
  setAdminPasswordHashInSupabase,
} from "./supabase-data";

const DATA_DIR = path.join(process.cwd(), "data");

const files = {
  config: () => path.join(DATA_DIR, "config.json"),
  anuncios: () => path.join(DATA_DIR, "anuncios.json"),
  depoimentos: () => path.join(DATA_DIR, "depoimentos.json"),
  orcamentos: () => path.join(DATA_DIR, "orcamentos.json"),
  visitors: () => path.join(DATA_DIR, "visitors.json"),
  errorLogs: () => path.join(DATA_DIR, "error_logs.json"),
  maintenance: () => path.join(DATA_DIR, "maintenance.json"),
  admin: () => path.join(DATA_DIR, "admin.json"),
};

export type VisitorEntry = {
  path: string;
  timestamp: string;
  ipHash: string;
  ua: string;
};

export type ErrorLogEntry = {
  id: string;
  message: string;
  stack?: string;
  url?: string;
  timestamp: string;
  userAgent?: string;
};

export type MaintenanceState = {
  enabled: boolean;
  message?: string;
  updatedAt?: string;
};

async function readJson<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const content = await readFile(filePath, "utf-8");
    return JSON.parse(content) as T;
  } catch {
    return fallback;
  }
}

async function writeJson(filePath: string, data: unknown) {
  await writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export async function getConfig() {
  if (isSupabaseConfigured()) return getConfigFromSupabase();
  return readJson<Record<string, unknown>>(files.config(), {});
}

export async function setConfig(data: Record<string, unknown>) {
  if (isSupabaseConfigured()) {
    await setConfigInSupabase(data);
    return;
  }
  await writeJson(files.config(), data);
}

export async function getAnuncios() {
  if (isSupabaseConfigured()) return getAnunciosFromSupabase();
  return readJson<unknown[]>(files.anuncios(), []);
}

export async function setAnuncios(data: unknown[]) {
  if (isSupabaseConfigured()) {
    await setAnunciosInSupabase(data);
    return;
  }
  await writeJson(files.anuncios(), data);
}

export async function getDepoimentos() {
  if (isSupabaseConfigured()) return getDepoimentosFromSupabase();
  return readJson<unknown[]>(files.depoimentos(), []);
}

export async function setDepoimentos(data: unknown[]) {
  if (isSupabaseConfigured()) {
    await setDepoimentosInSupabase(data);
    return;
  }
  await writeJson(files.depoimentos(), data);
}

export async function getOrcamentos() {
  return readJson<unknown[]>(files.orcamentos(), []);
}

export async function getVisitors(): Promise<VisitorEntry[]> {
  return readJson<VisitorEntry[]>(files.visitors(), []);
}

export async function appendVisitor(entry: Omit<VisitorEntry, "timestamp">) {
  const list = await getVisitors();
  list.push({ ...entry, timestamp: new Date().toISOString() });
  if (list.length > 5000) list.splice(0, list.length - 4000);
  await writeJson(files.visitors(), list);
}

export async function getErrorLogs(): Promise<ErrorLogEntry[]> {
  return readJson<ErrorLogEntry[]>(files.errorLogs(), []);
}

export async function appendErrorLog(entry: Omit<ErrorLogEntry, "id" | "timestamp">) {
  try {
    const list = await getErrorLogs();
    const newEntry: ErrorLogEntry = {
      ...entry,
      id: `err_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      timestamp: new Date().toISOString(),
    };
    list.unshift(newEntry);
    if (list.length > 500) list.length = 500;
    await writeJson(files.errorLogs(), list);
    return newEntry;
  } catch {
    /* Vercel: sistema somente leitura; ignora falha ao gravar log */
    return { ...entry, id: "", timestamp: new Date().toISOString() } as ErrorLogEntry;
  }
}

export async function getMaintenance(): Promise<MaintenanceState> {
  return readJson<MaintenanceState>(files.maintenance(), { enabled: false });
}

export async function setMaintenance(state: MaintenanceState) {
  const data = { ...state, updatedAt: new Date().toISOString() };
  await writeJson(files.maintenance(), data);
  return data;
}

export type AdminData = { passwordHash?: string };

export async function getAdminData(): Promise<AdminData> {
  if (isSupabaseConfigured()) return getAdminDataFromSupabase();
  return readJson<AdminData>(files.admin(), {});
}

export async function setAdminPasswordHash(hash: string): Promise<void> {
  if (isSupabaseConfigured()) {
    await setAdminPasswordHashInSupabase(hash);
    return;
  }
  await writeJson(files.admin(), { passwordHash: hash });
}

export function hashIp(ip: string): string {
  let h = 0;
  for (let i = 0; i < ip.length; i++) {
    h = (h << 5) - h + ip.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h).toString(36);
}
