const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const CDN_ROOT = "https://pub-24930f19e0c3402fa466727b45e82627.r2.dev/sticker-catalog";
const ALT_CDN_ROOT = "https://cdn.fanlink.lat/sticker-catalog";
const APP_FILE = path.join(__dirname, "..", "app.js");
const STICKERS_ROOT = path.join(__dirname, "..", "stickers");
const TMP_ROOT = path.join(__dirname, "..", "tmp", "fanlink-extract");
const ALBUM_SIZE = 20;

const TEAMS = [
  ["Argelia", "argelia", "ALG"],
  ["Argentina", "argentina", "ARG"],
  ["Australia", "australia", "AUS"],
  ["Austria", "austria", "AUT"],
  ["Bélgica", "belgica", "BEL"],
  ["Bosnia", "bosnia", "BIH"],
  ["Brasil", "brasil", "BRA"],
  ["Canadá", "canada", "CAN"],
  ["Cabo Verde", "cabo-verde", "CPV"],
  ["Colombia", "colombia", "COL"],
  ["Congo", "congo", "COD"],
  ["Costa de Marfil", "costa-de-marfil", "CIV"],
  ["Croacia", "croacia", "CRO"],
  ["Curazao", "curazao", "CUW"],
  ["Chequia", "chequia", "CZE"],
  ["Ecuador", "ecuador", "ECU"],
  ["Egipto", "egipto", "EGY"],
  ["Inglaterra", "inglaterra", "ENG"],
  ["Francia", "francia", "FRA"],
  ["Alemania", "alemania", "GER"],
  ["Ghana", "ghana", "GHA"],
  ["Haití", "haiti", "HAI"],
  ["Irán", "iran", "IRN"],
  ["Iraq", "iraq", "IRQ"],
  ["Japón", "japon", "JPN"],
  ["Jordania", "jordania", "JOR"],
  ["México", "mexico", "MEX"],
  ["Marruecos", "marruecos", "MAR"],
  ["Holanda", "holanda", "NED"],
  ["Nueva Zelanda", "nueva-zelanda", "NZL"],
  ["Noruega", "noruega", "NOR"],
  ["Panamá", "panama", "PAN"],
  ["Paraguay", "paraguay", "PAR"],
  ["Portugal", "portugal", "POR"],
  ["Catar", "catar", "QAT"],
  ["Arabia", "arabia", "KSA"],
  ["Escocia", "escocia", "SCO"],
  ["Senegal", "senegal", "SEN"],
  ["Sudáfrica", "sudafrica", "RSA"],
  ["Corea", "corea", "KOR"],
  ["España", "espana", "ESP"],
  ["Suecia", "suecia", "SWE"],
  ["Suiza", "suiza", "SUI"],
  ["Túnez", "tunez", "TUN"],
  ["Turquía", "turquia", "TUR"],
  ["Uruguay", "uruguay", "URU"],
  ["USA", "usa", "USA"],
  ["Uzbekistán", "uzbekistan", "UZB"],
];

const SPECIAL = ["Especial FIFA", "especial-fifa"];

function codeFor(teamCode, number) {
  return `${teamCode}${String(number).padStart(2, "0")}`;
}

function specialCodeFor(number) {
  return number === 20 ? "00" : `FWC${String(number).padStart(2, "0")}`;
}

function urlCandidates(code) {
  const urls = [
    `${CDN_ROOT}/panini2026-by-code/${code}.webp?v=6`,
    `${CDN_ROOT}/panini2026-by-code/${code}.webp`,
    `${ALT_CDN_ROOT}/panini2026-by-code/${code}.webp`,
    `${ALT_CDN_ROOT}/${code}.webp`,
  ];
  if (code === "KSA20") {
    urls.push("https://www.worldtradingcards.com/cdn/shop/files/31_FWC_KSA_020.webp?v=1777744526");
  }
  return urls;
}

function localPath(folder, number) {
  return path.join(STICKERS_ROOT, folder, `${number}.webp`);
}

function webPath(folder, number) {
  return `stickers/${folder}/${number}.webp`;
}

function isWebp(buffer) {
  return buffer.length > 12 && buffer.subarray(0, 4).toString("ascii") === "RIFF" && buffer.subarray(8, 12).toString("ascii") === "WEBP";
}

function convertToWebp(buffer, code) {
  fs.mkdirSync(TMP_ROOT, { recursive: true });
  const input = path.join(TMP_ROOT, `${code}.input`);
  const output = path.join(TMP_ROOT, `${code}.webp`);
  fs.writeFileSync(input, buffer);
  execFileSync("magick", [input, "-quality", "90", output], { stdio: "ignore" });
  const converted = fs.readFileSync(output);
  fs.rmSync(input, { force: true });
  fs.rmSync(output, { force: true });
  return isWebp(converted) ? converted : null;
}

async function fetchBuffer(url, code) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) return null;
    const buffer = Buffer.from(await response.arrayBuffer());
    if (isWebp(buffer)) return buffer;
    const type = response.headers.get("content-type") || "";
    return type.startsWith("image/") ? convertToWebp(buffer, code) : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function downloadTarget(target, force) {
  const output = localPath(target.folder, target.number);
  if (!force && fs.existsSync(output) && isWebp(fs.readFileSync(output))) {
    return { status: "kept", target };
  }

  for (const url of urlCandidates(target.code)) {
    const buffer = await fetchBuffer(url, target.code);
    if (!buffer) continue;
    fs.mkdirSync(path.dirname(output), { recursive: true });
    fs.writeFileSync(output, buffer);
    return { status: "downloaded", target, url, bytes: buffer.length };
  }

  return { status: "missing", target };
}

async function runLimited(items, limit, worker) {
  const results = [];
  let next = 0;
  async function loop() {
    for (;;) {
      const index = next;
      next += 1;
      if (index >= items.length) return;
      results[index] = await worker(items[index]);
    }
  }
  await Promise.all(Array.from({ length: limit }, loop));
  return results;
}

function buildTargets() {
  const targets = [];
  for (const [country, folder, teamCode] of TEAMS) {
    for (let number = 1; number <= ALBUM_SIZE; number += 1) {
      targets.push({ country, folder, number, code: codeFor(teamCode, number) });
    }
  }
  for (let number = 1; number <= ALBUM_SIZE; number += 1) {
    targets.push({ country: SPECIAL[0], folder: SPECIAL[1], number, code: specialCodeFor(number) });
  }
  return targets;
}

function writeManifest(targets) {
  const byCountry = new Map();
  for (const target of targets) {
    if (!byCountry.has(target.country)) byCountry.set(target.country, []);
    byCountry.get(target.country).push(target);
  }

  const quote = (value) => JSON.stringify(value);
  const lines = ["const STICKER_PHOTO_MANIFEST = {"];
  for (const [country, items] of Array.from(byCountry.entries()).sort(([a], [b]) => a.localeCompare(b, "es"))) {
    lines.push(`  ${quote(country)}: {`);
    for (const target of items.sort((a, b) => a.number - b.number)) {
      lines.push(`    ${target.number}: ${quote(webPath(target.folder, target.number))},`);
    }
    lines.push("  },");
  }
  lines.push("};");
  lines.push("");
  lines.push("const STICKER_PHOTO_MAP = new Map(");
  lines.push("  Object.entries(STICKER_PHOTO_MANIFEST).map(([country, photos]) => [normalize(country), photos]),");
  lines.push(");");
  lines.push("");

  const app = fs.readFileSync(APP_FILE, "utf8");
  const start = app.indexOf("const STICKER_PHOTO_MANIFEST = {");
  const end = app.indexOf("const USERS = [");
  if (start < 0 || end < 0 || end <= start) {
    throw new Error("No se pudo encontrar el bloque de manifiesto en app.js");
  }
  fs.writeFileSync(APP_FILE, app.slice(0, start) + lines.join("\n") + app.slice(end), "utf8");
}

async function main() {
  const force = process.argv.includes("--force");
  const targets = buildTargets();
  const results = await runLimited(targets, 24, (target) => downloadTarget(target, force));
  const missing = results.filter((result) => result.status === "missing");
  const downloaded = results.filter((result) => result.status === "downloaded").length;
  const kept = results.filter((result) => result.status === "kept").length;

  if (missing.length) {
    console.error("Faltan imagenes:");
    missing.forEach(({ target }) => console.error(`${target.country} ${target.number} (${target.code})`));
    process.exitCode = 1;
    return;
  }

  writeManifest(targets);
  console.log(JSON.stringify({ total: targets.length, downloaded, kept, countries: TEAMS.length + 1 }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
