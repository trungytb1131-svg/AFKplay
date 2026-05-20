/**
 * Tải toàn bộ game "1,000,000 Shrimp" từ Itch.io về public/shrimp/
 * Cách chạy: node scripts/download-shrimp.js
 */
const fs = require("fs");
const path = require("path");
const https = require("https");

const BASE = "https://html-classic.itch.zone/html/16050565/1000000shrimp/";
const OUT = path.join(__dirname, "..", "public", "shrimp");

if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (
        res.statusCode >= 300 &&
        res.statusCode < 400 &&
        res.headers.location
      ) {
        return fetch(
          res.headers.location.startsWith("http")
            ? res.headers.location
            : new URL(res.headers.location, url).href,
        )
          .then(resolve)
          .catch(reject);
      }
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => resolve(Buffer.concat(chunks)));
      res.on("error", reject);
    });
  });
}

async function download(url, filepath) {
  const dir = path.dirname(filepath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  console.log(`  ⬇ ${url}`);
  const data = await fetch(url);
  fs.writeFileSync(filepath, data);
  return data.toString("utf-8");
}

(async () => {
  console.log("🦐 Downloading 1,000,000 Shrimp...\n");

  // 1. index.html
  await download(BASE + "index.html", path.join(OUT, "index.html"));

  // 2. Assets cùng cấp
  await download(BASE + "game.js", path.join(OUT, "game.js"));
  await download(BASE + "love.js", path.join(OUT, "love.js"));
  await download(BASE + "game.love", path.join(OUT, "game.love"));
  await download(BASE + "love.wasm", path.join(OUT, "love.wasm"));
  await download(BASE + "bg.png", path.join(OUT, "bg.png"));
  await download(BASE + "game.data", path.join(OUT, "game.data"));

  // 3. Thư mục theme/
  await download(BASE + "theme/love.css", path.join(OUT, "theme", "love.css"));

  console.log("\n✅ Done! Game at: public/shrimp/index.html");
})();
