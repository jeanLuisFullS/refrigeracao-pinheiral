/**
 * Script para testar a autenticação do admin
 * Uso: node scripts/test-login.js "senha"
 */
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs").promises;

const password = process.argv[2] || "123456admin";

async function normalizeHash(h) {
  if (!h) return "";
  return h.replace(/^\uFEFF/, "").replace(/\r?\n/g, "").trim();
}

async function getAdminPasswordHash() {
  // 1. Tenta ler do arquivo admin.json
  try {
    const adminPath = path.join(process.cwd(), "data", "admin.json");
    const adminContent = await fs.readFile(adminPath, "utf-8");
    const adminData = JSON.parse(adminContent);
    if (adminData?.passwordHash) {
      const hash = await normalizeHash(adminData.passwordHash);
      if (hash && hash.length > 20) {
        console.log("✓ Hash encontrado em data/admin.json");
        return hash;
      }
    }
  } catch (e) {
    console.log("✗ data/admin.json não encontrado ou inválido");
  }
  
  // 2. Tenta ler do .env manualmente
  try {
    const envPath = path.join(process.cwd(), ".env");
    const envContent = await fs.readFile(envPath, "utf-8");
    const lines = envContent.split("\n");
    for (const line of lines) {
      if (line.startsWith("ADMIN_PASSWORD_HASH=")) {
        const hash = await normalizeHash(line.split("=")[1]);
        if (hash && hash.length > 20) {
          console.log("✓ Hash encontrado no .env");
          return hash;
        }
      }
    }
  } catch (e) {
    console.log("✗ .env não encontrado ou inválido");
  }
  
  // 3. Fallback
  console.log("⚠ Usando hash fallback");
  return "$2a$12$6eF2YYgvf6qU0jjv5ClycOoIGQwhSbug9fPebdKtgcTt2XTPuknYy";
}

async function test() {
  console.log(`\n🔐 Testando autenticação com senha: "${password}"\n`);
  
  const hash = await getAdminPasswordHash();
  console.log(`Hash (primeiros 30 chars): ${hash.substring(0, 30)}...`);
  console.log(`Hash completo: ${hash}\n`);
  
  try {
    const result = await bcrypt.compare(password, hash);
    console.log(`Resultado: ${result ? "✅ SUCESSO" : "❌ FALHOU"}`);
    if (!result) {
      console.log("\n⚠️  A senha não corresponde ao hash!");
      console.log("Verifique:");
      console.log("  1. Se o .env está correto");
      console.log("  2. Se não há espaços extras no hash");
      console.log("  3. Se o arquivo data/admin.json não está sobrescrevendo o .env");
    }
  } catch (error) {
    console.error("❌ Erro ao comparar:", error.message);
  }
}

test().catch(console.error);
