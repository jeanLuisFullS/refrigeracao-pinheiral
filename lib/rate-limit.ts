import { readFile, writeFile } from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const ATTEMPTS_FILE = path.join(DATA_DIR, "login_attempts.json");
const MAX_ATTEMPTS = 3;
const LOCK_MINUTES = 15;

export type AttemptRecord = {
  ip: string;
  attempts: number;
  lockedUntil: string;
  lastAttempt: string;
};

let attemptsCache: Record<string, AttemptRecord> | null = null;

async function loadAttempts(): Promise<Record<string, AttemptRecord>> {
  if (attemptsCache) return attemptsCache;
  try {
    const content = await readFile(ATTEMPTS_FILE, "utf-8");
    attemptsCache = JSON.parse(content);
  } catch {
    attemptsCache = {};
  }
  return attemptsCache!;
}

async function saveAttempts(data: Record<string, AttemptRecord>) {
  attemptsCache = data;
  try {
    await writeFile(ATTEMPTS_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch {
    /* Vercel: sistema de arquivos somente leitura; ignora falha de escrita */
  }
}

export function getClientIp(request: Request): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const xri = request.headers.get("x-real-ip");
  if (xri) return xri;
  return "unknown";
}

export type RateLimitResult =
  | { allowed: true }
  | { allowed: false; reason: "locked"; lockedUntil: string }
  | { allowed: false; reason: "max_attempts"; lockedUntil: string };

export async function checkLoginRateLimit(ip: string): Promise<RateLimitResult> {
  const data = await loadAttempts();
  const record = data[ip];
  const now = new Date();

  if (record) {
    if (new Date(record.lockedUntil) > now) {
      return { allowed: false, reason: "locked", lockedUntil: record.lockedUntil };
    }
    if (record.attempts >= MAX_ATTEMPTS) {
      record.attempts = 0;
      await saveAttempts(data);
    }
  }

  return { allowed: true };
}

export async function recordFailedLogin(ip: string): Promise<{ attempts: number; locked: boolean }> {
  const data = await loadAttempts();
  const now = new Date();
  let record = data[ip];

  if (!record) {
    record = { ip, attempts: 0, lockedUntil: now.toISOString(), lastAttempt: now.toISOString() };
    data[ip] = record;
  }

  record.attempts += 1;
  record.lastAttempt = now.toISOString();

  if (record.attempts >= MAX_ATTEMPTS) {
    const lockedUntil = new Date(now.getTime() + LOCK_MINUTES * 60 * 1000);
    record.lockedUntil = lockedUntil.toISOString();
    await saveAttempts(data);
    return { attempts: record.attempts, locked: true };
  }

  await saveAttempts(data);
  return { attempts: record.attempts, locked: false };
}

export async function clearAttempts(ip: string): Promise<void> {
  const data = await loadAttempts();
  delete data[ip];
  await saveAttempts(data);
}

export async function getAllAttempts(): Promise<AttemptRecord[]> {
  const data = await loadAttempts();
  return Object.values(data).filter((r) => r.attempts > 0 || new Date(r.lockedUntil) > new Date());
}
