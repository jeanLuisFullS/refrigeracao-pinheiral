import bcrypt from "bcryptjs";
import { createHmac, timingSafeEqual } from "crypto";
import { readFile } from "fs/promises";
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

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD_HASH;
  return secret && secret.length > 10 ? secret : "fallback-session-secret";
}

function base64UrlEncode(buf: Buffer): string {
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(str: string): Buffer {
  let b64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (b64.length % 4) b64 += "=";
  return Buffer.from(b64, "base64");
}

/** Sessão em cookie assinado (funciona na Vercel, sem gravar em arquivo). */
function createSignedToken(): string {
  const secret = getSessionSecret();
  const exp = Date.now() + SESSION_DURATION_MS;
  const payload = JSON.stringify({ exp, id: nanoid(16) });
  const payloadB64 = base64UrlEncode(Buffer.from(payload, "utf-8"));
  const sig = createHmac("sha256", secret).update(payloadB64).digest();
  const sigB64 = base64UrlEncode(sig);
  return payloadB64 + "." + sigB64;
}

function verifySignedToken(token: string): boolean {
  if (!token || !token.includes(".")) return false;
  const [payloadB64, sigB64] = token.split(".");
  if (!payloadB64 || !sigB64) return false;
  try {
    const secret = getSessionSecret();
    const expectedSig = createHmac("sha256", secret).update(payloadB64).digest();
    const expectedB64 = base64UrlEncode(expectedSig);
    if (expectedB64.length !== sigB64.length || !timingSafeEqual(Buffer.from(expectedB64, "utf-8"), Buffer.from(sigB64, "utf-8"))) return false;
    const payload = JSON.parse(Buffer.from(base64UrlDecode(payloadB64)).toString("utf-8")) as { exp: number };
    return payload.exp > Date.now();
  } catch {
    return false;
  }
}

/** Verifica se o token parece ser do formato antigo (nanoid só). Tokens antigos não têm ponto. */
function isLegacyToken(token: string): boolean {
  return !!token && token.length > 20 && !token.includes(".");
}

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

function normalizeHash(h: string): string {
  if (!h) return "";
  return h.replace(/^\uFEFF/, "").replace(/\r?\n/g, "").trim();
}

export async function getAdminPasswordHash(): Promise<string | undefined> {
  try {
    const adminData = await getAdminData();
    if (adminData?.passwordHash) {
      const hash = normalizeHash(adminData.passwordHash);
      if (hash && hash.length > 20) return hash;
    }
  } catch {
    /* ignore read errors (e.g. Vercel) */
  }
  const envHash = process.env.ADMIN_PASSWORD_HASH;
  if (envHash) {
    const hash = normalizeHash(envHash);
    if (hash && hash.length > 20) return hash;
  }
  return "$2a$12$k/fGQBkTbwyox12NEsnp0OrotRJ5VGa7bj5CnoQ8aiavfgb.e0RMe";
}

export async function verifyPassword(plain: string): Promise<boolean> {
  if (!plain) return false;
  const trimmed = plain.trim();
  if (!trimmed) return false;
  const hash = await getAdminPasswordHash();
  if (!hash || hash.length < 20) return false;
  try {
    return await bcrypt.compare(trimmed, hash);
  } catch {
    return false;
  }
}

export async function createSession(_ip?: string, _userAgent?: string): Promise<string> {
  return createSignedToken();
}

export async function verifySession(token: string): Promise<boolean> {
  if (!token) return false;
  if (verifySignedToken(token)) return true;
  if (isLegacyToken(token)) {
    try {
      const sessions = await loadSessions();
      const now = new Date().toISOString();
      const valid = sessions.find((s) => s.token === token && s.expiresAt > now);
      return !!valid;
    } catch {
      return false;
    }
  }
  return false;
}

export async function destroySession(_token: string): Promise<void> {
  /* Com cookie assinado não há nada a remover no servidor; logout limpa o cookie no cliente. */
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
