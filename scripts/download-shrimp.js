/**
 * Tải toàn bộ game "1,000,000 Shrimp" từ Itch.io về public/shrimp/
 * Cách chạy: node scripts/download-shrimp.js
 */
const fs = require("fs");
const path = require("path");
const https = require("https");

const BASE = "https://html-classic.itch.zone/html/16050565/1000000shrimp/";
const OUT = path.join(__dirname, "..", "public", "shrimp");
const ASSETS_OUT = path.join(OUT, "shrimp_files");

if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });
if (!fs.existsSync(ASSETS_OUT)) fs.mkdirSync(ASSETS_OUT, { recursive: true });

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetch(res.headers.location.startsWith("http") ? res.headers.location : new URL(res.headers.location, url).href).then(resolve).catch(reject);
      }
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => resolve(Buffer.concat(chunks)));
      res.on("error", reject);
    });
  });
}

async function download(url, filepath) {
  console.log(`  ⬇ ${url}`);
  const data = await fetch(url);
  fs.writeFileSync(filepath, data);
  return data.toString("utf-8");
}

(async () => {
  console.log("🦐 Downloading 1,000,000 Shrimp...\n");

  // 1. Download index.html
  const html = await download(BASE + "index.html", path.join(OUT, "index.html"));

  // 2. Parse asset references
  const patterns = [
    /src\s*=\s*["']([^"']+)["']/g,
    /href\s*=\s*["']([^"']+\.css)["']/g,
    /data-file\s*=\s*["']([^"']+)["']/g,
    /loadPath\s*:\s*["']([^"']+)["']/g,
  ];

  const assets = new Set();
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(html)) !== null) {
      const url = match[1];
      if (url.startsWith("http") || url.startsWith("//") || url.startsWith("data:") || url === "#" || url.startsWith("javascript:")) continue;
      assets.add(url.split("?")[0]);
    }
  }

  // 3. Download all assets into shrimp_files/
  let count = 0;
  for (const asset of assets) {
    const filename = asset.replace(/^.*[\\/]/, "");
    if (!filename) continue;
    try {
      await download(BASE + asset, path.join(ASSETS_OUT, filename));
      count++;
    } catch (e) {
      console.log(`  ⚠ Failed: ${asset}`);
    }
  }

  // 4. Fix paths in index.html - replace old folder name with shrimp_files
  const oldFolder = "1,000,000 shrimp_files";
  let fixed = html.split(oldFolder).join("shrimp_files");
  fixed = fixed.split(encodeURIComponent(oldFolder)).join("shrimp_files");
  fs.writeFileSync(path.join(OUT, "index.html"), fixed);

  console.log(`\n✅ Done! ${count} assets -> shrimp_files/`);
  console.log(`   Game at: public/shrimp/index.html`);
})();
