/**
 * Delete unbuildable games from Supabase.
 * Run: npx tsx scripts/delete-unbuildable-games.ts
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

const DELETE_IDS = [
  "thirteenth-floor",
  "captain-callisto",
  "connect-four",
  "exotoaster",
  "raycast-js",
  "pacman-html5",
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

  console.log("🗑️  Deleting 6 games from Supabase...\n");

  for (const id of DELETE_IDS) {
    const { error } = await supabase.from("games").delete().eq("id", id);

    if (error) {
      console.error(`  ❌ ${id}: ${error.message}`);
    } else {
      console.log(`  ✅ Deleted: ${id}`);
    }
  }

  console.log("\n🎉 Done!");
}

main();
