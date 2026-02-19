import { NextResponse } from "next/server";
import {
  verifyPassword,
  createSession,
  sessionCookieHeader,
  getAdminPasswordHash,
} from "@/lib/auth";
import {
  checkLoginRateLimit,
  recordFailedLogin,
  clearAttempts,
  getClientIp,
} from "@/lib/rate-limit";
import { appendErrorLog } from "@/lib/admin-data";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const userAgent = request.headers.get("user-agent") || "";

  if (!(await getAdminPasswordHash())) {
    await appendErrorLog({
      message: "ADMIN_PASSWORD_HASH não configurado. Configure o .env.",
      url: "/api/admin/login",
    });
    return NextResponse.json(
      { error: "Serviço indisponível. Configure o painel." },
      { status: 503 }
    );
  }

  const rate = await checkLoginRateLimit(ip);
  if (!rate.allowed) {
    await appendErrorLog({
      message: `Tentativa de login bloqueada (rate limit). IP: ${ip}`,
      url: "/api/admin/login",
      userAgent,
    });
    return NextResponse.json(
      {
        error: "Muitas tentativas. Aguarde 15 minutos ou contate o suporte.",
        lockedUntil: rate.lockedUntil,
      },
      { status: 429 }
    );
  }

  let body: { password?: string; captcha?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  const password = body.password?.trim();
  if (!password) {
    return NextResponse.json({ error: "Senha obrigatória" }, { status: 400 });
  }

  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (secret && body.captcha) {
    try {
      const r = await fetch("https://www.google.com/recaptcha/api/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ secret, response: body.captcha }),
      });
      const data = await r.json();
      if (!data.success) {
        return NextResponse.json({ error: "CAPTCHA inválido. Tente novamente." }, { status: 400 });
      }
    } catch (e) {
      console.error(e);
      return NextResponse.json({ error: "Erro ao validar CAPTCHA" }, { status: 502 });
    }
  }

  // Log temporário para debug
  const hash = await getAdminPasswordHash();
  console.log(`[LOGIN] Tentativa de login. Hash disponível: ${hash ? "SIM" : "NÃO"}`);
  if (hash) {
    console.log(`[LOGIN] Hash (primeiros 30 chars): ${hash.substring(0, 30)}...`);
  }
  
  const valid = await verifyPassword(password);
  console.log(`[LOGIN] Senha "${password}" verificada: ${valid ? "VÁLIDA" : "INVÁLIDA"}`);
  
  if (!valid) {
    const result = await recordFailedLogin(ip);
    await appendErrorLog({
      message: `Login falhou. IP: ${ip}. Tentativa ${result.attempts}/3.`,
      url: "/api/admin/login",
      userAgent,
    });
    return NextResponse.json(
      {
        error: result.locked
          ? "Muitas tentativas. Acesso bloqueado por 15 minutos. Alerta de possível invasão registrado."
          : `Senha incorreta. ${3 - result.attempts} tentativa(s) restante(s).`,
        attemptsLeft: result.locked ? 0 : 3 - result.attempts,
      },
      { status: 401 }
    );
  }

  await clearAttempts(ip);
  const token = await createSession(ip, userAgent);
  const response = NextResponse.json({ ok: true });
  response.headers.set("Set-Cookie", sessionCookieHeader(token));
  return response;
}
