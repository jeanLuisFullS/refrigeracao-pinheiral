/**
 * Gere o hash da senha do admin e coloque no .env como ADMIN_PASSWORD_HASH
 * Uso: node scripts/generate-password-hash.js "sua-senha-segura"
 */
const bcrypt = require("bcryptjs");
const password = process.argv[2];
if (!password) {
  console.error("Uso: node scripts/generate-password-hash.js \"sua-senha\"");
  process.exit(1);
}
bcrypt.hash(password, 12).then((hash) => {
  console.log("Adicione ao .env:");
  console.log("ADMIN_PASSWORD_HASH=" + hash);
});
