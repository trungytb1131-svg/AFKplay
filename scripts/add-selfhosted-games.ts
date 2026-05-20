/**
 * Quick script: Add 3 self-hosted games to Supabase games table.
 * Run: npx tsx scripts/add-selfhosted-games.ts
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

const env = loadEnvLocal();
const supabaseUrl = env["NEXT_PUBLIC_SUPABASE_URL"] || "";
const serviceRoleKey = env["SUPABASE_SERVICE_ROLE_KEY"] || "";

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing Supabase env vars");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

const GAMES = [
  {
    id: "adventures-with-anxiety",
    slug: "adventures-with-anxiety",
    title: "Adventures With Anxiety!",
    description:
      "A narrative game where you play as anxiety itself — a wolf living inside a human's brain. Make choices that shape the story and explore what anxiety feels like from the inside.",
    instructions: "Click to advance dialogue and make choices when prompted.",
    url: "/adventures-with-anxiety/index.html",
    category_id: "adventure",
    tags: ["narrative", "interactive fiction", "anxiety", "story", "choices"],
    thumb: "/images/games/adventures-with-anxiety.png",
    width: 960,
    height: 540,
    source: "self-hosted",
    featured: true,
  },
  {
    id: "coming-out-simulator-2014",
    slug: "coming-out-simulator-2014",
    title: "Coming Out Simulator 2014",
    description:
      "A semi-autobiographical narrative game about coming out to your parents. Navigate a tense dinner conversation where every word matters.",
    instructions:
      "Choose your dialogue options carefully. Your real-life story is shaped by your choices.",
    url: "/coming-out-simulator-2014/index.html",
    category_id: "simulation",
    tags: ["narrative", "lgbtq", "choices", "story", "interactive fiction"],
    thumb: "/images/games/coming-out-simulator-2014.png",
    width: 960,
    height: 540,
    source: "self-hosted",
    featured: true,
  },
  {
    id: "we-become-what-we-behold",
    slug: "we-become-what-we-behold",
    title: "We Become What We Behold",
    description:
      "A short 5-minute game about news cycles, vicious cycles, and how media shapes public opinion. Capture moments with your camera and watch society react.",
    instructions:
      "Click to take photos of interesting moments. Observe how media coverage changes people's behavior.",
    url: "/we-become-what-we-behold/index.html?v=4",
    category_id: "simulation",
    tags: ["news", "media", "society", "short", "thought-provoking"],
    thumb: "/images/games/we-become-what-we-behold.png",
    width: 960,
    height: 540,
    source: "self-hosted",
    featured: true,
  },
];

async function main() {
  console.log("Adding 3 self-hosted games to Supabase...\n");

  for (const game of GAMES) {
    console.log(`  📤 Upserting: ${game.title}...`);
    const { error } = await supabase
      .from("games")
      .upsert(game, { onConflict: "id" });

    if (error) {
      console.error(`  ❌ Failed: ${error.message}`);
    } else {
      console.log(`  ✅ Done: ${game.title}`);
    }
  }

  console.log("\nDone! All 3 games added.");
}

main();
