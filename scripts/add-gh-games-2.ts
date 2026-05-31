/**
 * Script: Tạo route + thêm vào DB cho 16 game GitHub batch 2.
 * Chạy: npx tsx scripts/add-gh-games-2.ts
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
  {
    id: "isocity",
    slug: "isocity",
    title: "IsoCity",
    description:
      "A beautiful isometric city builder with no rules. Just place buildings and create your own tiny city!",
    instructions:
      "Click to place buildings. Create your dream city with no budget or goals!",
    url: "/isocity/index.html",
    category_id: "simulation",
    tags: ["city", "builder", "isometric", "creative", "simulation"],
    thumb: "/images/games/isocity.png",
    width: 960,
    height: 640,
    source: "self-hosted",
    featured: false,
  },
  {
    id: "server-survival",
    slug: "server-survival",
    title: "Server Survival",
    description:
      "A 3D tower defense game where you play as a Cloud Architect building infrastructure to handle traffic and fight DDoS attacks!",
    instructions:
      "Build servers and defenses to handle traffic waves and survive DDoS attacks!",
    url: "/server-survival/index.html",
    category_id: "strategy",
    tags: ["tower-defense", "3d", "cloud", "educational", "servers"],
    thumb: "/images/games/server-survival.png",
    width: 960,
    height: 640,
    source: "self-hosted",
    featured: false,
  },
  {
    id: "radius-raid",
    slug: "radius-raid",
    title: "Radius Raid",
    description:
      "A full space-themed shoot-em-up in just 13KB! 13 enemy types, 5 power-ups, parallax backgrounds, and retro sound effects.",
    instructions:
      "Arrow keys/WASD to move, Space to shoot. Survive waves of enemies!",
    url: "/radius-raid/index.html",
    category_id: "shooting",
    tags: ["shmup", "space", "js13k", "arcade", "retro"],
    thumb: "/images/games/radius-raid.png",
    width: 640,
    height: 480,
    source: "self-hosted",
    featured: false,
  },
  {
    id: "sleeping-beauty",
    slug: "sleeping-beauty",
    title: "Sleeping Beauty",
    description:
      "A polished coffee-break roguelike — winnable, losable, beautiful. Created for the 7-Day Roguelike challenge.",
    instructions:
      "Click to move and interact. Explore the dungeon, find the princess! 15-30 min per run.",
    url: "/sleeping-beauty/index.html",
    category_id: "adventure",
    tags: ["roguelike", "dungeon", "7drl", "fantasy", "coffee-break"],
    thumb: "/images/games/sleeping-beauty.png",
    width: 800,
    height: 600,
    source: "self-hosted",
    featured: false,
  },
  {
    id: "level13",
    slug: "level13",
    title: "Level 13",
    description:
      "A text-based incremental sci-fi survival adventure. Explore a dark, decayed city, build your base, and survive!",
    instructions:
      "Click buttons to explore, gather resources, and build. Inspired by A Dark Room.",
    url: "/level13/index.html",
    category_id: "adventure",
    tags: ["survival", "text", "sci-fi", "incremental", "dark"],
    thumb: "/images/games/level13.png",
    width: 800,
    height: 600,
    source: "self-hosted",
    featured: false,
  },
  {
    id: "evolve",
    slug: "evolve",
    title: "Evolve",
    description:
      "Evolve a civilization from primordial ooze into a space-faring empire! Deep incremental with tech tree, maps, and hero management.",
    instructions:
      "Click to gather resources. Research tech, build cities, explore maps, and evolve your civilization!",
    url: "/evolve/index.html",
    category_id: "clicker",
    tags: ["idle", "civilization", "incremental", "evolution", "deep"],
    thumb: "/images/games/evolve.png",
    width: 960,
    height: 640,
    source: "self-hosted",
    featured: false,
  },
  {
    id: "synthblast",
    slug: "synthblast",
    title: "SYNTHBLAST",
    description:
      "A synthwave-themed 3D tank combat game with neon aesthetics. Shoot tanks, collect ether, and survive zombie mode!",
    instructions:
      "WASD to move, mouse to aim and shoot. Survive waves of tanks in a neon retro world!",
    url: "/synthblast/index.html",
    category_id: "action",
    tags: ["3d", "tank", "synthwave", "retro", "shooter"],
    thumb: "/images/games/synthblast.png",
    width: 960,
    height: 640,
    source: "self-hosted",
    featured: false,
  },
  {
    id: "canvas-td",
    slug: "canvas-td",
    title: "Canvas Tower Defense",
    description:
      "A complete, polished tower defense game built entirely with HTML5 Canvas. Multiple tower types and enemy waves!",
    instructions:
      "Click to place towers along the path. Stop enemies from reaching the end!",
    url: "/canvas-td/index.html",
    category_id: "strategy",
    tags: ["tower-defense", "strategy", "canvas", "classic"],
    thumb: "/images/games/canvas-td.png",
    width: 800,
    height: 600,
    source: "self-hosted",
    featured: false,
  },
  {
    id: "drunken-viking",
    slug: "drunken-viking",
    title: "Drunken Viking",
    description:
      "A charming pixel-art top-down puzzle game. Navigate a drunken Viking through tricky levels!",
    instructions:
      "Arrow keys to move. Solve puzzles and navigate through levels as a drunken Viking!",
    url: "/drunken-viking/index.html",
    category_id: "puzzle",
    tags: ["puzzle", "viking", "pixel-art", "top-down", "funny"],
    thumb: "/images/games/drunken-viking.png",
    width: 800,
    height: 600,
    source: "self-hosted",
    featured: false,
  },
  {
    id: "k8s-games",
    slug: "k8s-games",
    title: "K8s Games",
    description:
      "A 3D Kubernetes simulator — deploy pods, fix CrashLoopBackOff, and type real kubectl commands!",
    instructions:
      "Type kubectl commands to deploy and manage pods. Learn Kubernetes while having fun!",
    url: "/k8s-games/index.html",
    category_id: "simulation",
    tags: ["kubernetes", "devops", "educational", "3d", "simulator"],
    thumb: "/images/games/k8s-games.png",
    width: 960,
    height: 640,
    source: "self-hosted",
    featured: false,
  },
  {
    id: "guitar-bro",
    slug: "guitar-bro",
    title: "Guitar Bro",
    description:
      "Learn guitar notes in your browser using Web Audio API! Like Guitar Hero but for real guitar learning.",
    instructions:
      "Pluck strings on your real guitar and match the notes! Works with Chrome.",
    url: "/guitar-bro/index.html",
    category_id: "simulation",
    tags: ["music", "guitar", "educational", "audio", "learning"],
    thumb: "/images/games/guitar-bro.png",
    width: 800,
    height: 600,
    source: "self-hosted",
    featured: false,
  },
  {
    id: "match3-html5",
    slug: "match3-html5",
    title: "Match-3 HTML5",
    description:
      "A Bejeweled-style match-3 puzzle game built with pure HTML5 Canvas and JavaScript.",
    instructions:
      "Click and drag to swap gems. Match 3 or more of the same color to score!",
    url: "/match3-html5/match3.html",
    category_id: "puzzle",
    tags: ["match3", "puzzle", "gems", "casual", "addictive"],
    thumb: "/images/games/match3-html5.png",
    width: 600,
    height: 500,
    source: "self-hosted",
    featured: false,
  },
  {
    id: "wordpluck",
    slug: "wordpluck",
    title: "Wordpluck",
    description:
      "A typing game where words float down and you type them before they hit the ground. Fast-paced word action!",
    instructions:
      "Type the falling words before they reach the bottom. Test your typing speed!",
    url: "/wordpluck/index.html",
    category_id: "puzzle",
    tags: ["typing", "words", "arcade", "fast", "educational"],
    thumb: "/images/games/wordpluck.png",
    width: 800,
    height: 600,
    source: "self-hosted",
    featured: false,
  },
  // ═══ BUILD-STEP GAMES (cần build trước khi chạy) ═══
  {
    id: "q1k3",
    slug: "q1k3",
    title: "Q1K3",
    description:
      "A fully 3D Quake-style FPS in the browser — 2 levels, 5 enemy types, 3 weapons, all in 13KB! By phoboslab.",
    instructions:
      "WASD to move, mouse to aim and shoot. Pure 3D FPS action in your browser!",
    url: "/q1k3/index.html",
    category_id: "action",
    tags: ["fps", "3d", "quake", "js13k", "impressive"],
    thumb: "/images/games/q1k3.png",
    width: 960,
    height: 640,
    source: "self-hosted",
    featured: false,
  },
  {
    id: "black-hole-square",
    slug: "black-hole-square",
    title: "Black Hole Square",
    description:
      "A clever abstract puzzle game for js13k 2021. Tap squares to clean up the universe — simple mechanic, deep puzzles!",
    instructions:
      "Click/tap squares to make them collapse into black holes. Clean up the universe!",
    url: "/black-hole-square/index.html",
    category_id: "puzzle",
    tags: ["puzzle", "abstract", "js13k", "space", "minimalist"],
    thumb: "/images/games/black-hole-square.png",
    width: 500,
    height: 500,
    source: "self-hosted",
    featured: false,
  },
  {
    id: "stolen-sword",
    slug: "stolen-sword",
    title: "Stolen Sword",
    description:
      "A js13k 2020 one-finger action platformer. Tap to attack, swipe to move. Evolved into the published mobile game 'Wild Wind'!",
    instructions:
      "Tap to attack, swipe to move. One-finger controls — tight and responsive!",
    url: "/stolen-sword/index.html",
    category_id: "action",
    tags: ["platformer", "js13k", "mobile", "one-finger", "action"],
    thumb: "/images/games/stolen-sword.png",
    width: 500,
    height: 500,
    source: "self-hosted",
    featured: false,
  },
];

const ROUTE_MAP: Record<string, { dataDir: string; entry: string }> = {
  isocity: { dataDir: "isocity", entry: "index.html" },
  "server-survival": { dataDir: "server-survival", entry: "index.html" },
  "radius-raid": { dataDir: "radius-raid", entry: "index.html" },
  "sleeping-beauty": { dataDir: "sleeping-beauty", entry: "index.html" },
  level13: { dataDir: "level13", entry: "index.html" },
  evolve: { dataDir: "evolve", entry: "index.html" },
  synthblast: { dataDir: "synthblast", entry: "index.html" },
  "canvas-td": { dataDir: "canvas-td", entry: "index.html" },
  "drunken-viking": { dataDir: "drunken-viking", entry: "index.html" },
  "k8s-games": { dataDir: "k8s-games", entry: "index.html" },
  "guitar-bro": { dataDir: "guitar-bro", entry: "index.html" },
  "match3-html5": { dataDir: "match3-html5", entry: "match3.html" },
  wordpluck: { dataDir: "wordpluck", entry: "index.html" },
  q1k3: { dataDir: "q1k3", entry: "index.html" },
  "black-hole-square": { dataDir: "black-hole-square", entry: "index.html" },
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

  console.log(`\n🎮 Setting up ${GAMES.length} games (batch 2)...\n`);

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
}

main();
