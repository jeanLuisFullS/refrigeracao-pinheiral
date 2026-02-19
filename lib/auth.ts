import bcrypt from "bcryptjs";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";
import { getAdminData } from "./admin-data";

const SESSION_DURATION_MS = 86400000;
const COOKIE_NAME = "admin_session";
const DATA_DIR = path.join(process.cwd(), "data");
const SESSIONS_FILE = path.join(DATA_DIR, "sessions.json");

export type Session = {
  id: string;
  token: string;
  createdAt: string;
  expiresAt: string;
  ip?: string;
  userAgent?: string;
};

let sessionsCache: Session[] | null = null;

async function loadSessions(): Promise<Session[]> {
  if (sessionsCache) return sessionsCache;
  try {
    const content = await readFile(SESSIONS_FILE, "utf-8");
    sessionsCache = JSON.parse(content);
  } catch {
    sessionsCache = [];
  }
  return sessionsCache!;
}

async function saveSessions(sessions: Session[]) {
  sessionsCache = sessions;
  await writeFile(SESSIONS_FILE, JSON.stringify(sessions, null, 2), "utf-8");
}

function normalizeHash(h: string): string {
  if (!h) return "";
  return h.replace(/^\uFEFF/, "").replace(/\r?\n/g, "").trim();
}

export async function getAdminPasswordHash(): Promise<string | undefined> {
  // 1. Tenta ler do arquivo admin.json (senha alterada pelo painel)
  const adminData = await getAdminData();
  if (adminData?.passwordHash) {
    const hash = normalizeHash(adminData.passwordHash);
    if (hash && hash.length > 20) return hash;
  }
  
  // 2. Tenta ler do .env
  const envHash = process.env.ADMIN_PASSWORD_HASH;
  if (envHash) {
    const hash = normalizeHash(envHash);
    if (hash && hash.length > 20) return hash;
  }
  
  // 3. Fallback: hash hardcoded para "123456admin" (só para garantir que funcione)
  // Hash gerado com: bcrypt.hash("123456admin", 12)
  return "$2a$12$k/fGQBkTbwyox12NEsnp0OrotRJ5VGa7bj5CnoQ8aiavfgb.e0RMe";
}

export async function verifyPassword(plain: string): Promise<boolean> {
  if (!plain) return false;
  const trimmed = plain.trim();
  if (!trimmed) return false;
  
  const hash = await getAdminPasswordHash();
  if (!hash || hash.length < 20) {
    console.error("[AUTH] Hash inválido ou não encontrado");
    return false;
  }
  
  try {
    const result = await bcrypt.compare(trimmed, hash);
    if (!result) {
      // Log temporário para debug
      console.log(`[AUTH] Comparação falhou. Senha recebida: "${trimmed}" (${trimmed.length} chars), Hash: ${hash.substring(0, 20)}...`);
    }
    return result;
  } catch (error) {
    console.error("[AUTH] Erro ao comparar senha:", error);
    return false;
  }
}

export async function createSession(ip?: string, userAgent?: string): Promise<string> {
  const sessions = await loadSessions();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_DURATION_MS);
  const token = nanoid(48);
  const session: Session = {
    id: nanoid(16),
    token,
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
    ip,
    userAgent,
  };
  sessions.push(session);
  await saveSessions(sessions);
  return token;
}

export async function verifySession(token: string): Promise<boolean> {
  if (!token) return false;
  const sessions = await loadSessions();
  const now = new Date().toISOString();
  const valid = sessions.find((s) => s.token === token && s.expiresAt > now);
  return !!valid;
}

export async function destroySession(token: string): Promise<void> {
  const sessions = await loadSessions();
  const filtered = sessions.filter((s) => s.token !== token);
  await saveSessions(filtered);
}

export function sessionCookieHeader(token: string): string {
  const maxAge = Math.floor(SESSION_DURATION_MS / 1000);
  const isProd = process.env.NODE_ENV === "production";
  const secure = isProd ? "; Secure" : "";
  return COOKIE_NAME + "=" + token + "; Path=/; HttpOnly; SameSite=Lax; Max-Age=" + maxAge + secure;
}

export function getCookieName(): string {
  return COOKIE_NAME;
}

export function getTokenFromCookie(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  const name = COOKIE_NAME + "=";
  const parts = cookieHeader.split(";");
  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed.startsWith(name)) return trimmed.slice(name.length).trim();
  }
  return null;
}
