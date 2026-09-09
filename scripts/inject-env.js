/**
 * Lee .env y genera js/config.js (Gemini, tracking, panel papá, Firebase).
 * Uso: node scripts/inject-env.js
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const envPath = path.join(root, ".env");
const configPath = path.join(root, "js", "config.js");

const vars = {
  GEMINI_API_KEY: "",
  PARENT_PIN: "",
  TRACKING_URL: "",
  FIREBASE_API_KEY: "",
  FIREBASE_AUTH_DOMAIN: "",
  FIREBASE_PROJECT_ID: "",
  FIREBASE_STORAGE_BUCKET: "",
  FIREBASE_MESSAGING_SENDER_ID: "",
  FIREBASE_APP_ID: ""
};

if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    for (const key of Object.keys(vars)) {
      const match = line.match(new RegExp("^\\s*" + key + "\\s*=\\s*(.*)$"));
      if (match) {
        vars[key] = match[1].trim().replace(/^["']|["']$/g, "");
      }
    }
  }
}

function esc(s) {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

const hasFirebase = !!vars.FIREBASE_PROJECT_ID;
const firebaseBlock = hasFirebase
  ? `,
  firebase: {
    apiKey: "${esc(vars.FIREBASE_API_KEY)}",
    authDomain: "${esc(vars.FIREBASE_AUTH_DOMAIN)}",
    projectId: "${esc(vars.FIREBASE_PROJECT_ID)}",
    storageBucket: "${esc(vars.FIREBASE_STORAGE_BUCKET)}",
    messagingSenderId: "${esc(vars.FIREBASE_MESSAGING_SENDER_ID)}",
    appId: "${esc(vars.FIREBASE_APP_ID)}"
  }`
  : "";

const trackingLine = vars.TRACKING_URL
  ? ',\n  trackingUrl: "' + esc(vars.TRACKING_URL) + '"'
  : "";

const configJs =
  "/**\n * Generado por scripts/inject-env.js desde .env (no editar a mano)\n */\n" +
  "window.CuadernoMagicoConfig = {\n" +
  '  apiKey: "' + esc(vars.GEMINI_API_KEY) + '",\n' +
  '  parentPin: "' + esc(vars.PARENT_PIN) + '"' +
  trackingLine +
  firebaseBlock +
  "\n};\n";

fs.writeFileSync(configPath, configJs, "utf8");
console.log(
  "js/config.js generado — Gemini: " + (vars.GEMINI_API_KEY ? "ok" : "vacío") +
  ", Firebase: " + (hasFirebase ? vars.FIREBASE_PROJECT_ID : "no")
);
