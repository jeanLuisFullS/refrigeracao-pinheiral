require('dotenv/config');

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const DATA_DIR = path.join(ROOT, "data");

// Carrega .env (linhas KEY=VALUE)
function loadEnv() {
  const envPath = path.join(ROOT, ".env");
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) {
      const key = m[1].trim();
      const value = m[2].trim().replace(/^["']|["']$/g, "");
      if (key && !process.env[key]) process.env[key] = value;
    }
  }
}

loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key || url.length < 10 || key.length < 20) {
  console.error("Erro: defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env ou no ambiente.");
  process.exit(1);
}

async function main() {
  const { createClient } = require("@supabase/supabase-js");
  const sb = createClient(url, key, { auth: { persistSession: false } });
  const now = new Date().toISOString();

  // Config
  const configPath = path.join(DATA_DIR, "config.json");
  if (fs.existsSync(configPath)) {
    const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    const { error } = await sb.from("config").upsert({ id: 1, data: config, updated_at: now }, { onConflict: "id" });
    if (error) {
      console.error("Erro ao gravar config:", error.message);
      process.exit(1);
    }
    console.log("Config gravado.");
  }

  // Anúncios
  const anunciosPath = path.join(DATA_DIR, "anuncios.json");
  if (fs.existsSync(anunciosPath)) {
    const anuncios = JSON.parse(fs.readFileSync(anunciosPath, "utf-8"));
    if (!Array.isArray(anuncios)) {
      console.error("anuncios.json deve ser um array.");
      process.exit(1);
    }
    const rows = anuncios.map((item) => ({
      id: String(item.id ?? ""),
      data: item,
      updated_at: now,
    }));
    if (rows.length) {
      const { error } = await sb.from("anuncios").upsert(rows, { onConflict: "id" });
      if (error) {
        console.error("Erro ao gravar anuncios:", error.message);
        process.exit(1);
      }
      console.log(rows.length + " anúncios gravados (com imagens nos dados).");
    }
  }

  // Depoimentos
  const depoimentosPath = path.join(DATA_DIR, "depoimentos.json");
  if (fs.existsSync(depoimentosPath)) {
    const depoimentos = JSON.parse(fs.readFileSync(depoimentosPath, "utf-8"));
    if (!Array.isArray(depoimentos)) {
      console.error("depoimentos.json deve ser um array.");
      process.exit(1);
    }
    const rows = depoimentos.map((item) => ({
      id: String(item.id ?? ""),
      data: item,
      updated_at: now,
    }));
    if (rows.length) {
      const { error } = await sb.from("depoimentos").upsert(rows, { onConflict: "id" });
      if (error) {
        console.error("Erro ao gravar depoimentos:", error.message);
        process.exit(1);
      }
      console.log(rows.length + " depoimentos gravados.");
    }
  }

  console.log("Seed concluído. Atualize o site na Vercel ou recarregue para ver os dados.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
