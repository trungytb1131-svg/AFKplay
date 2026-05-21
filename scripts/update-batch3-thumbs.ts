/**
 * Update thumbnails for 12 batch-3 games + fix dSize/mSize.
 * Run: npx tsx scripts/update-batch3-thumbs.ts
 */
import { createClient } from "@supabase/supabase-js";
import * as fs from "node:fs";
import * as path from "node:path";

function loadEnvLocal(): Record<string, string> {
  const envPath = path.resolve(__dirname, "..", ".env.local");
  const content = fs.readFileSync(envPath, "utf-8");
  const env: Record<string, string> = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    env[trimmed.slice(0, eqIdx).trim()] = trimmed.slice(eqIdx + 1).trim();
  }
  return env;
}

const UPDATES = [
  { id: "blueprint-idle", thumb: "/images/games/blueprint-idle.png" },
  { id: "chrome-dino", thumb: "/images/games/chrome-dino.png" },
  { id: "feed-the-flames", thumb: "/images/games/feed-the-flames.png" },
  { id: "google-the-game", thumb: "/images/games/google-the-game.png" },
  { id: "island-not-found", thumb: "/images/games/island-not-found.png" },
  { id: "offline-paradise", thumb: "/images/games/offline-paradise.png" },
  { id: "point-generation", thumb: "/images/games/point-generation.png" },
  { id: "quickclick", thumb: "/images/games/quickclick.png" },
  { id: "rs-clicker", thumb: "/images/games/rs-clicker.png" },
  { id: "society-fail", thumb: "/images/games/society-fail.png" },
  { id: "tower-defense", thumb: "/images/games/tower-defense.png" },
];

async function main() {
  const env = loadEnvLocal();
  const supabaseUrl = env["NEXT_PUBLIC_SUPABASE_URL"] || "";
  const serviceRoleKey = env["SUPABASE_SERVICE_ROLE_KEY"] || "";

  if (!supabaseUrl || !serviceRoleKey) {
    console.error("Missing Supabase env vars");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  console.log("📸 Updating thumbnails for 12 batch-3 games...\n");

  for (const u of UPDATES) {
    const { error } = await supabase
      .from("games")
      .update({ thumb: u.thumb })
      .eq("id", u.id);

    if (error) {
      console.error(`  ❌ ${u.id}: ${error.message}`);
    } else {
      console.log(`  ✅ ${u.id} → ${u.thumb}`);
    }
  }

  console.log("\n🎉 Done!");
}

main();
