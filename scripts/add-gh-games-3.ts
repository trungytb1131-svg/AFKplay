/**
 * Script: Tạo route + thêm vào DB cho 17 game mới clone (batch 3).
 * Chạy: npx tsx scripts/add-gh-games-3.ts
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

function createRoute(dirName: string, dataDir: string, entryFile: string) {
  const routeDir = path.join(process.cwd(), "app", dirName, "[...path]");
  fs.mkdirSync(routeDir, { recursive: true });

  const routeContent = `import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript",
  ".mjs": "application/javascript",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".css": "text/css",
  ".json": "application/json",
  ".mp3": "audio/mpeg",
  ".ogg": "audio/ogg",
  ".wav": "audio/wav",
  ".opus": "audio/opus",
  ".m4a": "audio/mp4",
  ".ttf": "font/ttf",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".xml": "application/xml",
  ".wasm": "application/wasm",
  ".data": "application/octet-stream",
  ".bin": "application/octet-stream",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const filePath = path?.length ? path.join("/") : "${entryFile}";
  const fullPath = join(process.cwd(), "game-data", "${dataDir}", filePath);

  try {
    const data = await readFile(fullPath);
    const ext = "." + (filePath.split(".").pop() || "html");
    const contentType = MIME[ext] || "application/octet-stream";

    return new NextResponse(data, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "X-Frame-Options": "SAMEORIGIN",
        "Cache-Control": "public, max-age=3600, must-revalidate",
      },
    });
  } catch {
    return new NextResponse("Not Found", { status: 404 });
  }
}
`;

  fs.writeFileSync(path.join(routeDir, "route.ts"), routeContent);
  console.log(`  ✅ Route: app/${dirName}/[...path]/route.ts`);
}

interface GameEntry {
  id: string;
  slug: string;
  title: string;
  description: string;
  instructions: string;
  url: string;
  category_id: string;
  tags: string[];
  thumb: string;
  width: number;
  height: number;
  source: string;
  featured: boolean;
}

const GAMES: GameEntry[] = [
  // ═══ READY TO SERVE (có index.html) ═══
  {
    id: "blueprint-idle",
    slug: "blueprint-idle",
    title: "Blueprint Idle",
    description:
      "An idle/incremental strategy game where you build and manage a factory using blueprint designs. Optimize production chains!",
    instructions:
      "Click to build and upgrade. Design efficient production chains and watch your factory grow!",
    url: "/blueprint-idle/index.html",
    category_id: "clicker",
    tags: ["idle", "incremental", "factory", "strategy", "management"],
    thumb: "/images/games/blueprint-idle.png",
    width: 800,
    height: 600,
    source: "self-hosted",
    featured: false,
  },
  {
    id: "chrome-dino",
    slug: "chrome-dino",
    title: "Chrome Dino",
    description:
      "The classic Chrome offline dinosaur game recreated as an open-source web game. Jump over cacti and dodge pterodactyls!",
    instructions:
      "Press Space or Up Arrow to jump. Dodge obstacles and survive as long as you can!",
    url: "/chrome-dino/www/index.html",
    category_id: "action",
    tags: ["runner", "dinosaur", "endless", "arcade", "classic"],
    thumb: "/images/games/chrome-dino.png",
    width: 800,
    height: 300,
    source: "self-hosted",
    featured: false,
  },
  {
    id: "feed-the-flames",
    slug: "feed-the-flames",
    title: "Feed the Flames",
    description:
      "A fast-paced arcade game where you feed a growing flame while dodging obstacles. Keep the fire alive!",
    instructions:
      "Move with arrow keys or touch. Collect fuel to keep the flame burning, avoid obstacles!",
    url: "/feed-the-flames/index.html",
    category_id: "action",
    tags: ["arcade", "fire", "fast", "casual", "endless"],
    thumb: "/images/games/feed-the-flames.png",
    width: 800,
    height: 600,
    source: "self-hosted",
    featured: false,
  },
  {
    id: "google-the-game",
    slug: "google-the-game",
    title: "Google The Game",
    description:
      "A creative puzzle simulation where you play as Google itself! Manage search results, handle queries, and grow the internet.",
    instructions:
      "Click and interact to manage search results. Balance relevance and popularity!",
    url: "/google-the-game/build/index.html",
    category_id: "simulation",
    tags: ["simulation", "google", "puzzle", "management", "creative"],
    thumb: "/images/games/google-the-game.png",
    width: 800,
    height: 600,
    source: "self-hosted",
    featured: false,
  },
  {
    id: "island-not-found",
    slug: "island-not-found",
    title: "Island Not Found",
    description:
      "A survival/resource management game where you're stranded on a mysterious island. Explore, gather, craft, and find your way home!",
    instructions:
      "Click to explore, gather resources, and craft items. Survive and find your way off the island!",
    url: "/island-not-found/dist/index.html",
    category_id: "adventure",
    tags: [
      "survival",
      "island",
      "crafting",
      "exploration",
      "resource-management",
    ],
    thumb: "/images/games/island-not-found.png",
    width: 800,
    height: 600,
    source: "self-hosted",
    featured: false,
  },
  {
    id: "offline-paradise",
    slug: "offline-paradise",
    title: "Offline Paradise",
    description:
      "A js13k 2019 entry — a pixel-art adventure game about finding paradise in a disconnected world. Retro aesthetics!",
    instructions:
      "Arrow keys to move, interact with objects. Explore the offline world!",
    url: "/offline-paradise/index.html",
    category_id: "adventure",
    tags: ["adventure", "js13k", "pixel-art", "retro", "exploration"],
    thumb: "/images/games/offline-paradise.png",
    width: 800,
    height: 600,
    source: "self-hosted",
    featured: false,
  },
  {
    id: "point-generation",
    slug: "point-generation",
    title: "Point Generation",
    description:
      "An incremental clicker game about generating increasingly larger numbers. Watch your points explode into astronomical figures!",
    instructions:
      "Click to generate points. Upgrade generators and watch your numbers grow exponentially!",
    url: "/point-generation/index.html",
    category_id: "clicker",
    tags: ["clicker", "incremental", "numbers", "exponential", "idle"],
    thumb: "/images/games/point-generation.png",
    width: 800,
    height: 600,
    source: "self-hosted",
    featured: false,
  },
  {
    id: "quickclick",
    slug: "quickclick",
    title: "QuickClick",
    description:
      "A reflex-testing click speed game. How fast can you click? Test your CPS (clicks per second) and compete with friends!",
    instructions:
      "Click as fast as you can! Test your clicking speed and beat high scores!",
    url: "/quickclick/index.html",
    category_id: "action",
    tags: ["clicker", "speed", "reflex", "competitive", "casual"],
    thumb: "/images/games/quickclick.png",
    width: 600,
    height: 400,
    source: "self-hosted",
    featured: false,
  },
  {
    id: "rs-clicker",
    slug: "rs-clicker",
    title: "RS Clicker",
    description:
      "A RuneScape-themed incremental clicker game. Train skills, level up, and relive the MMORPG grind in idle form!",
    instructions:
      "Click to train skills. Level up your RuneScape character and unlock new abilities!",
    url: "/rs-clicker/index.html",
    category_id: "clicker",
    tags: ["clicker", "runescape", "mmorpg", "idle", "skills"],
    thumb: "/images/games/rs-clicker.png",
    width: 800,
    height: 600,
    source: "self-hosted",
    featured: false,
  },
  {
    id: "society-fail",
    slug: "society-fail",
    title: "Society Fail",
    description:
      "A thought-provoking simulation game about societal systems. Make decisions that shape society and see the consequences unfold!",
    instructions:
      "Click to make decisions. Watch how your choices ripple through society!",
    url: "/society-fail/index.html",
    category_id: "simulation",
    tags: ["simulation", "society", "choices", "thought-provoking", "strategy"],
    thumb: "/images/games/society-fail.png",
    width: 800,
    height: 600,
    source: "self-hosted",
    featured: false,
  },
  {
    id: "tower-defense",
    slug: "tower-defense",
    title: "Tower Defense",
    description:
      "A classic tower defense game built with HTML5 Canvas. Place towers, upgrade them, and stop waves of enemies from reaching the end!",
    instructions:
      "Click to place towers along the path. Upgrade towers and stop enemy waves!",
    url: "/tower-defense/index.html",
    category_id: "strategy",
    tags: ["tower-defense", "strategy", "classic", "waves", "upgrades"],
    thumb: "/images/games/tower-defense.png",
    width: 800,
    height: 600,
    source: "self-hosted",
    featured: false,
  },
  {
    id: "slotjs",
    slug: "slotjs",
    title: "SlotJS",
    description:
      "A slot machine game built with JavaScript. Spin the reels and try your luck at this classic casino game!",
    instructions:
      "Click to spin the reels. Match symbols to win! ⚠️ Needs build: npm install && npm run build",
    url: "/slotjs/dist/index.html",
    category_id: "simulation",
    tags: ["casino", "slots", "gambling", "luck", "casual"],
    thumb: "/images/games/slotjs.png",
    width: 600,
    height: 500,
    source: "self-hosted",
    featured: false,
  },
];

// Route map: slug → { dataDir, entry }
const ROUTE_MAP: Record<string, { dataDir: string; entry: string }> = {
  "blueprint-idle": { dataDir: "blueprint-idle", entry: "index.html" },
  "chrome-dino": { dataDir: "chrome-dino", entry: "www/index.html" },
  "feed-the-flames": { dataDir: "feed-the-flames", entry: "index.html" },
  "google-the-game": { dataDir: "google-the-game", entry: "build/index.html" },
  "island-not-found": { dataDir: "island-not-found", entry: "dist/index.html" },
  "offline-paradise": { dataDir: "offline-paradise", entry: "index.html" },
  "point-generation": { dataDir: "point-generation", entry: "index.html" },
  quickclick: { dataDir: "quickclick", entry: "index.html" },
  "rs-clicker": { dataDir: "rs-clicker", entry: "index.html" },
  "society-fail": { dataDir: "society-fail", entry: "index.html" },
  "tower-defense": { dataDir: "tower-defense", entry: "index.html" },
  slotjs: { dataDir: "slotjs", entry: "dist/index.html" },
};

async function main() {
  const env = loadEnvLocal();
  const supabaseUrl = env["NEXT_PUBLIC_SUPABASE_URL"] || "";
  const serviceRoleKey = env["SUPABASE_SERVICE_ROLE_KEY"] || "";

  if (!supabaseUrl || !serviceRoleKey) {
    console.error("Missing Supabase env vars");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  console.log(`\n🎮 Setting up ${GAMES.length} games (batch 3)...\n`);

  // 1. Create routes
  console.log("📁 Creating routes...");
  for (const [slug, info] of Object.entries(ROUTE_MAP)) {
    createRoute(slug, info.dataDir, info.entry);
  }

  // 2. Upsert vào DB
  console.log("\n📤 Upserting to Supabase...");
  let inserted = 0;
  let errors = 0;

  for (const game of GAMES) {
    const { error } = await supabase
      .from("games")
      .upsert(game, { onConflict: "id" });

    if (error) {
      console.error(`  ❌ ${game.title}: ${error.message}`);
      errors++;
    } else {
      console.log(`  ✅ ${game.title}`);
      inserted++;
    }
  }

  console.log(`\n🎉 Done! Inserted: ${inserted}, Errors: ${errors}`);
  console.log(`
🎉 Done! Inserted: ${inserted}, Errors: ${errors}`);
}

main();
