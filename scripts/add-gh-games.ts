/**
 * Script: Tạo route + thêm vào DB cho các game clone từ GitHub.
 * Chạy: npx tsx scripts/add-gh-games.ts
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
  console.log(`  ✅ Route: app/${dirName}/[...path]/route.ts → game-data/${dataDir}/${entryFile}`);
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
  // ═══ STANDALONE GAMES ═══
  {
    id: "andromeda-invaders",
    slug: "andromeda-invaders",
    title: "Andromeda Invaders",
    description: "Beautiful Space Invaders homage in a single HTML file. Pure Canvas + Web Audio.",
    instructions: "Arrow keys to move, Space to shoot. Destroy all invaders!",
    url: "/andromeda-invaders/invaders.html",
    category_id: "shooting",
    tags: ["space", "invaders", "arcade", "shooter", "classic"],
    thumb: "/images/games/andromeda-invaders.png",
    width: 800, height: 600, source: "self-hosted", featured: false,
  },
  {
    id: "pacman-html5",
    slug: "pacman-html5",
    title: "Pac-Man HTML5",
    description: "Faithful Pac-Man remake with 12 levels, AI ghost pathfinding, and power-ups.",
    instructions: "Arrow keys to move. Eat all dots, avoid ghosts!",
    url: "/pacman-html5/index.html",
    category_id: "classic",
    tags: ["pacman", "arcade", "classic", "maze", "retro"],
    thumb: "/images/games/pacman-html5.png",
    width: 600, height: 700, source: "self-hosted", featured: false,
  },
  {
    id: "html5-asteroids",
    slug: "html5-asteroids",
    title: "HTML5 Asteroids",
    description: "Vector-style Asteroids clone with touch support and sound effects.",
    instructions: "Arrow keys to rotate/thrust, Space to shoot. Destroy asteroids!",
    url: "/html5-asteroids/index.html",
    category_id: "classic",
    tags: ["asteroids", "arcade", "classic", "space", "retro"],
    thumb: "/images/games/html5-asteroids.png",
    width: 800, height: 600, source: "self-hosted", featured: false,
  },
  {
    id: "star-battle",
    slug: "star-battle",
    title: "Star Battle",
    description: "Polished spaceship shooter with fuel mechanics, particle effects, and multiple enemy types.",
    instructions: "Arrow keys/WASD to move, J/Space to shoot. Survive waves!",
    url: "/star-battle/index.html",
    category_id: "shooting",
    tags: ["shooter", "space", "arcade", "action", "scifi"],
    thumb: "/images/games/star-battle.png",
    width: 480, height: 700, source: "self-hosted", featured: false,
  },
  {
    id: "dungeon-crawler-rpg",
    slug: "dungeon-crawler-rpg",
    title: "Dungeon Crawler RPG",
    description: "Diablo-inspired loot system with random dungeons, stat upgrades, and roguelite progression.",
    instructions: "Click to move and attack. Collect loot and upgrade your hero!",
    url: "/dungeon-crawler-rpg/index.html",
    category_id: "adventure",
    tags: ["rpg", "dungeon", "roguelite", "loot", "fantasy"],
    thumb: "/images/games/dungeon-crawler-rpg.png",
    width: 800, height: 600, source: "self-hosted", featured: false,
  },
  {
    id: "mario-maker",
    slug: "mario-maker",
    title: "Mario Maker",
    description: "Classic Mario-style platformer with built-in level editor. Create, save, and play custom levels!",
    instructions: "Arrow keys to move, Space to jump. Use the editor to create your own levels!",
    url: "/mario-maker/index.html",
    category_id: "action",
    tags: ["mario", "platformer", "editor", "creative", "retro"],
    thumb: "/images/games/mario-maker.png",
    width: 960, height: 540, source: "self-hosted", featured: false,
  },
  {
    id: "lode-runner",
    slug: "lode-runner",
    title: "Lode Runner: Total Recall",
    description: "Massive Lode Runner remake with 434 levels across 5 game versions and a level editor.",
    instructions: "Arrow keys to move, Z to dig holes. Collect all gold and escape!",
    url: "/lode-runner/lodeRunner.html",
    category_id: "action",
    tags: ["platformer", "classic", "puzzle", "retro", "lode-runner"],
    thumb: "/images/games/lode-runner.png",
    width: 800, height: 600, source: "self-hosted", featured: false,
  },
  {
    id: "classic-pool",
    slug: "classic-pool",
    title: "Classic 8-Ball Pool",
    description: "Realistic 8-ball pool with AI opponent, physics collision, and smooth Canvas rendering.",
    instructions: "Mouse to aim and shoot. Pot all your balls, then the 8-ball to win!",
    url: "/classic-pool/index.html",
    category_id: "strategy",
    tags: ["pool", "billiards", "physics", "sports", "casual"],
    thumb: "/images/games/classic-pool.png",
    width: 960, height: 540, source: "self-hosted", featured: false,
  },
  {
    id: "sandboxels",
    slug: "sandboxels",
    title: "Sandboxels",
    description: "Incredibly addictive falling-sand simulation with 500+ elements, chemical reactions, and more.",
    instructions: "Click to place elements. Experiment with fire, water, lava, plants, and humans!",
    url: "/sandboxels/index.html",
    category_id: "simulation",
    tags: ["sandbox", "simulation", "creative", "physics", "science"],
    thumb: "/images/games/sandboxels.png",
    width: 960, height: 640, source: "self-hosted", featured: false,
  },
  {
    id: "mykonos-island",
    slug: "mykonos-island",
    title: "Mykonos Island Voxels",
    description: "Gorgeous isometric island builder with Mediterranean aesthetics. Pure ES modules, no dependencies.",
    instructions: "Click to build and place objects. Create your dream Mediterranean island!",
    url: "/mykonos-island/index.html",
    category_id: "simulation",
    tags: ["island", "builder", "voxel", "creative", "3d"],
    thumb: "/images/games/mykonos-island.png",
    width: 960, height: 640, source: "self-hosted", featured: false,
  },
];

// ═══ 37-GAMES COLLECTION (sau khi lọc trùng) ═══
const COLLECTION_ENTRIES: { dir: string; slug: string; title: string; category: string; tags: string[] }[] = [
  { dir: "01-Candy-Crush-Game", slug: "collection-candy-crush", title: "Candy Crush", category: "puzzle", tags: ["match3", "puzzle", "casual", "candy"] },
  { dir: "03-Chess-Game", slug: "collection-chess", title: "Chess", category: "strategy", tags: ["chess", "board", "strategy", "classic"] },
  { dir: "04-Doodle-Jump-Game", slug: "collection-doodle-jump", title: "Doodle Jump", category: "action", tags: ["jump", "platformer", "doodle", "casual"] },
  { dir: "05-Solitaire-Game", slug: "collection-solitaire", title: "Solitaire", category: "strategy", tags: ["cards", "solitaire", "classic", "casual"] },
  { dir: "06-Sudoku-Game", slug: "collection-sudoku", title: "Sudoku", category: "puzzle", tags: ["sudoku", "numbers", "logic", "puzzle"] },
  { dir: "07-Crossy-Road-Game", slug: "collection-crossy-road", title: "Crossy Road", category: "action", tags: ["arcade", "endless", "frogger", "casual"] },
  { dir: "09-Flappy-Bird-Game", slug: "collection-flappy-bird", title: "Flappy Bird", category: "action", tags: ["flappy", "arcade", "endless", "casual"] },
  { dir: "11-Wordle-Game", slug: "collection-wordle", title: "Wordle", category: "puzzle", tags: ["word", "puzzle", "daily", "brain"] },
  { dir: "12-Hangman-Game", slug: "collection-hangman", title: "Hangman", category: "puzzle", tags: ["word", "puzzle", "classic", "brain"] },
  { dir: "14-Archery-Game", slug: "collection-archery", title: "Archery", category: "action", tags: ["archery", "target", "physics", "casual"] },
  { dir: "16-Minesweeper-Game", slug: "collection-minesweeper", title: "Minesweeper", category: "puzzle", tags: ["minesweeper", "logic", "classic", "brain"] },
  { dir: "17-Speed-Typing-Game", slug: "collection-speed-typing", title: "Speed Typing", category: "puzzle", tags: ["typing", "speed", "words", "educational"] },
  { dir: "21-Tilting-Maze-Game", slug: "collection-tilting-maze", title: "Tilting Maze", category: "puzzle", tags: ["maze", "tilt", "physics", "puzzle"] },
  { dir: "22-Memory-Card-Game", slug: "collection-memory-card", title: "Memory Card Game", category: "puzzle", tags: ["memory", "cards", "brain", "casual"] },
  { dir: "23-Type-Number-Guessing-Game", slug: "collection-number-guess", title: "Number Guessing", category: "puzzle", tags: ["numbers", "guessing", "logic", "casual"] },
  { dir: "26-Insect-Catch-Game", slug: "collection-insect-catch", title: "Insect Catch", category: "action", tags: ["catch", "insect", "arcade", "casual"] },
  { dir: "27-Typing-Game", slug: "collection-typing-1", title: "Typing Game", category: "puzzle", tags: ["typing", "words", "educational", "speed"] },
  { dir: "29-Shape-Clicker-Game", slug: "collection-shape-clicker", title: "Shape Clicker", category: "clicker", tags: ["clicker", "shapes", "casual", "idle"] },
  { dir: "31-Speak-Number-Guessing-Game", slug: "collection-speak-guess", title: "Speak & Guess", category: "puzzle", tags: ["speech", "numbers", "voice", "fun"] },
  { dir: "32-Fruit-Slicer-Game", slug: "collection-fruit-slicer", title: "Fruit Slicer", category: "action", tags: ["fruit", "slice", "ninja", "arcade"] },
  { dir: "33-Quiz-Game", slug: "collection-quiz", title: "Quiz Game", category: "puzzle", tags: ["quiz", "trivia", "brain", "educational"] },
  { dir: "34-Emoji-Catcher-Game", slug: "collection-emoji-catcher", title: "Emoji Catcher", category: "action", tags: ["emoji", "catch", "arcade", "fun"] },
  { dir: "35-Whack-A-Mole-Game", slug: "collection-whack-a-mole", title: "Whack-A-Mole", category: "action", tags: ["whack", "mole", "arcade", "reaction"] },
  { dir: "36-Simon-Says-Game", slug: "collection-simon-says", title: "Simon Says", category: "puzzle", tags: ["memory", "simon", "pattern", "brain"] },
  { dir: "37-Sliding-Puzzle-Game", slug: "collection-sliding-puzzle", title: "Sliding Puzzle", category: "puzzle", tags: ["puzzle", "sliding", "classic", "brain"] },
  // Additional ones from dir listing
  { dir: "08-Rock-Paper-Scissors", slug: "collection-rps", title: "Rock Paper Scissors", category: "strategy", tags: ["rps", "classic", "casual", "fun"] },
  { dir: "13-Tower-Blocks", slug: "collection-tower-blocks", title: "Tower Blocks", category: "puzzle", tags: ["tower", "stacking", "physics", "casual"] },
  { dir: "15-Tic-Tac-Toe", slug: "collection-tic-tac-toe", title: "Tic Tac Toe", category: "strategy", tags: ["tictactoe", "board", "classic", "casual"] },
  { dir: "28-Dice-Roll-Simulator", slug: "collection-dice-roll", title: "Dice Roll", category: "simulation", tags: ["dice", "random", "simulator", "casual"] },
  { dir: "30-Typing-Game", slug: "collection-typing-2", title: "Typing Challenge", category: "puzzle", tags: ["typing", "challenge", "words", "speed"] },
];

// Tạo collection games
COLLECTION_ENTRIES.forEach((e) => {
  GAMES.push({
    id: e.slug,
    slug: e.slug,
    title: e.title,
    description: `${e.title} — from the 37-in-1 HTML5 Games Collection.`,
    instructions: `Play ${e.title}! A fun browser game.`,
    url: `/37-games-collection/${e.dir}/index.html`,
    category_id: e.category,
    tags: e.tags,
    thumb: `/images/games/${e.slug}.png`,
    width: 600, height: 500, source: "self-hosted", featured: false,
  });
});

// ═══ MAIN ═══
async function main() {
  const env = loadEnvLocal();
  const supabaseUrl = env["NEXT_PUBLIC_SUPABASE_URL"] || "";
  const serviceRoleKey = env["SUPABASE_SERVICE_ROLE_KEY"] || "";

  if (!supabaseUrl || !serviceRoleKey) {
    console.error("Missing Supabase env vars");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  console.log(`\n🎮 Setting up ${GAMES.length} games from GitHub...\n`);

  // 1. Create routes
  console.log("📁 Creating routes...");
  const routeMap: Record<string, { dataDir: string; entry: string }> = {
    "andromeda-invaders": { dataDir: "andromeda-invaders", entry: "invaders.html" },
    "pacman-html5": { dataDir: "pacman-html5", entry: "index.html" },
    "html5-asteroids": { dataDir: "html5-asteroids", entry: "index.html" },
    "star-battle": { dataDir: "star-battle", entry: "index.html" },
    "dungeon-crawler-rpg": { dataDir: "dungeon-crawler-rpg", entry: "index.html" },
    "mario-maker": { dataDir: "mario-maker", entry: "index.html" },
    "lode-runner": { dataDir: "lode-runner", entry: "lodeRunner.html" },
    "classic-pool": { dataDir: "classic-pool", entry: "index.html" },
    "sandboxels": { dataDir: "sandboxels", entry: "index.html" },
    "mykonos-island": { dataDir: "mykonos-island", entry: "index.html" },
  };

  // Tạo route cho standalone games
  for (const [slug, info] of Object.entries(routeMap)) {
    createRoute(slug, info.dataDir, info.entry);
  }

  // Tạo route cho collection (dùng chung 1 route cho tất cả sub-games)
  createRoute("37-games-collection", "37-games-collection", "index.html");

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
