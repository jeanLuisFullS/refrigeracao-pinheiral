import { getSupabase } from "./supabase";

const CONFIG_ID = 1;
const ADMIN_SETTINGS_ID = 1;

export async function getConfigFromSupabase(): Promise<Record<string, unknown>> {
  const sb = getSupabase();
  if (!sb) return {};
  const { data, error } = await sb.from("config").select("data").eq("id", CONFIG_ID).single();
  if (error || !data?.data) return {};
  return (data.data as Record<string, unknown>) || {};
}

export async function setConfigInSupabase(payload: Record<string, unknown>): Promise<void> {
  const sb = getSupabase();
  if (!sb) return;
  await sb.from("config").upsert({ id: CONFIG_ID, data: payload, updated_at: new Date().toISOString() }, { onConflict: "id" });
}

export async function getAnunciosFromSupabase(): Promise<unknown[]> {
  const sb = getSupabase();
  if (!sb) return [];
  const { data, error } = await sb.from("anuncios").select("data").order("updated_at", { ascending: false });
  if (error || !Array.isArray(data)) return [];
  return data.map((r) => r.data).filter(Boolean);
}

export async function setAnunciosInSupabase(items: unknown[]): Promise<void> {
  const sb = getSupabase();
  if (!sb) return;
  const rows = items.map((item) => {
    const o = item as Record<string, unknown>;
    const id = String(o?.id ?? "");
    return { id, data: item, updated_at: new Date().toISOString() };
  });
  const ids = rows.map((r) => r.id);
  const existing = await sb.from("anuncios").select("id");
  const toDelete = (existing.data ?? []).filter((r: { id: string }) => !ids.includes(r.id)).map((r: { id: string }) => r.id);
  if (toDelete.length) await sb.from("anuncios").delete().in("id", toDelete);
  if (rows.length) await sb.from("anuncios").upsert(rows, { onConflict: "id" });
}

export async function getDepoimentosFromSupabase(): Promise<unknown[]> {
  const sb = getSupabase();
  if (!sb) return [];
  const { data, error } = await sb.from("depoimentos").select("data").order("updated_at", { ascending: false });
  if (error || !Array.isArray(data)) return [];
  return data.map((r) => r.data).filter(Boolean);
}

export async function setDepoimentosInSupabase(items: unknown[]): Promise<void> {
  const sb = getSupabase();
  if (!sb) return;
  const rows = items.map((item) => {
    const o = item as Record<string, unknown>;
    const id = String(o?.id ?? "");
    return { id, data: item, updated_at: new Date().toISOString() };
  });
  const ids = rows.map((r) => r.id);
  const existing = await sb.from("depoimentos").select("id");
  const toDelete = (existing.data ?? []).filter((r: { id: string }) => !ids.includes(r.id)).map((r: { id: string }) => r.id);
  if (toDelete.length) await sb.from("depoimentos").delete().in("id", toDelete);
  if (rows.length) await sb.from("depoimentos").upsert(rows, { onConflict: "id" });
}

export async function getAdminDataFromSupabase(): Promise<{ passwordHash?: string }> {
  const sb = getSupabase();
  if (!sb) return {};
  const { data, error } = await sb.from("admin_settings").select("password_hash").eq("id", ADMIN_SETTINGS_ID).single();
  if (error || !data) return {};
  const hash = data.password_hash as string | null;
  return hash ? { passwordHash: hash } : {};
}

export async function setAdminPasswordHashInSupabase(hash: string): Promise<void> {
  const sb = getSupabase();
  if (!sb) return;
  await sb.from("admin_settings").upsert(
    { id: ADMIN_SETTINGS_ID, password_hash: hash, updated_at: new Date().toISOString() },
    { onConflict: "id" }
  );
}
