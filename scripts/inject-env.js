/**
 * Lee .env y genera js/config.js con la API key de Gemini.
 * Uso: node scripts/inject-env.js
 * Igual que en santiagotracker: la clave va en .env y no se sube al repo.
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const envPath = path.join(root, ".env");
const configPath = path.join(root, "js", "config.js");

let apiKey = "";

if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf8");
  const lines = content.split(/\r?\n/);
  for (const line of lines) {
    const match = line.match(/^\s*GEMINI_API_KEY\s*=\s*(.*)$/);
    if (match) {
      apiKey = match[1].trim().replace(/^["']|["']$/g, "");
      break;
    }
  }
}

const escaped = apiKey.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
const configJs =
  "/**\n * Generado por scripts/inject-env.js desde .env (no editar a mano)\n */\n" +
  "window.CuadernoMagicoConfig = { apiKey: \"" + escaped + "\" };\n";

fs.writeFileSync(configPath, configJs, "utf8");
console.log("js/config.js generado desde .env (API key " + (apiKey ? "configurada" : "vacía") + ").");
