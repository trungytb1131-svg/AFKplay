/**
 * Auto-setup script: Create routes + Supabase entries for ALL downloaded games.
 * Run: npx tsx scripts/setup-all-games.ts
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
  routeDir: string; // game-data folder name for route
}

const GAMES: GameEntry[] = [
  // ═══ TOP TIER (featured) ═══
  {
    id: "2048",
    slug: "2048",
    title: "2048",
    description:
      "The legendary sliding number puzzle that took the world by storm. Join the numbers and get to the 2048 tile!",
    instructions: "Use arrow keys to move tiles. When two tiles with the same number touch, they merge into one!",
    url: "/2048/index.html",
    category_id: "puzzle",
    tags: ["puzzle", "numbers", "addictive", "classic", "2048"],
    thumb: "/images/games/2048.png",
    width: 500,
    height: 600,
    source: "self-hosted",
    featured: true,
    routeDir: "2048",
  },
  {
    id: "hextris",
    slug: "hextris",
    title: "Hextris",
    description:
      "A fast-paced HTML5 puzzle game inspired by Tetris, played on a hexagon. Addictive, beautiful, and challenging!",
    instructions: "Use arrow keys to rotate the hexagon. Match colors to clear lines before they reach the center.",
    url: "/hextris/index.html",
    category_id: "puzzle",
    tags: ["puzzle", "tetris", "hexagon", "addictive", "fast-paced"],
    thumb: "/images/games/hextris.png",
    width: 480,
    height: 700,
    source: "self-hosted",
    featured: true,
    routeDir: "hextris",
  },
  {
    id: "a-dark-room",
    slug: "a-dark-room",
    title: "A Dark Room",
    description:
      "A minimalist text adventure that unfolds into an epic survival RPG. Stoke the fire, welcome strangers, and discover a world of mystery.",
    instructions: "Click buttons to take actions. Start by stoking the fire. The game reveals itself slowly.",
    url: "/a-dark-room/index.html",
    category_id: "adventure",
    tags: ["text", "rpg", "minimalist", "survival", "story"],
    thumb: "/images/games/a-dark-room.png",
    width: 800,
    height: 600,
    source: "self-hosted",
    featured: true,
    routeDir: "a-dark-room",
  },
  {
    id: "spacehuggers",
    slug: "spacehuggers",
    title: "SpaceHuggers",
    description:
      "A roguelike platformer with destructible environments — in only 13KB of JavaScript! Run, gun, and hug your way through space.",
    instructions: "Arrow keys to move, Z to jump, X to shoot. Blast through destructible terrain!",
    url: "/SpaceHuggers/index.html",
    category_id: "action",
    tags: ["roguelike", "platformer", "js13k", "action", "destructible"],
    thumb: "/images/games/spacehuggers.png",
    width: 960,
    height: 540,
    source: "self-hosted",
    featured: true,
    routeDir: "SpaceHuggers",
  },
  {
    id: "untrusted",
    slug: "untrusted",
    title: "untrusted",
    description:
      "A meta-JavaScript adventure where you must literally edit the source code of each level to hack your way through. Genius concept!",
    instructions: "Read the code on the left. Modify it to bypass obstacles. Use the API to navigate each level.",
    url: "/untrusted/index.html",
    category_id: "puzzle",
    tags: ["programming", "hacking", "meta", "puzzle", "adventure"],
    thumb: "/images/games/untrusted.png",
    width: 960,
    height: 640,
    source: "self-hosted",
    featured: true,
    routeDir: "untrusted",
  },
  {
    id: "hexgl",
    slug: "hexgl",
    title: "HexGL",
    description:
      "A futuristic Wipeout/F-Zero-style racing game built with WebGL. Stunning visuals for a browser game!",
    instructions: "Arrow keys or WASD to steer. Race through the neon city at breakneck speeds!",
    url: "/HexGL/index.html",
    category_id: "racing",
    tags: ["racing", "webgl", "3D", "futuristic", "fast"],
    thumb: "/images/games/hexgl.png",
    width: 960,
    height: 540,
    source: "self-hosted",
    featured: true,
    routeDir: "HexGL",
  },
  {
    id: "huejumper2k",
    slug: "huejumper2k",
    title: "HueJumper2k",
    description:
      "A 3D racing game in only 2 Kilobytes of JavaScript! Mind-blowing technical achievement.",
    instructions: "Arrow keys to drive. Navigate the colorful 3D track. Pure code-golfing magic!",
    url: "/HueJumper2k/index.html",
    category_id: "racing",
    tags: ["racing", "3D", "js13k", "tiny", "code-golf"],
    thumb: "/images/games/huejumper2k.png",
    width: 960,
    height: 540,
    source: "self-hosted",
    featured: true,
    routeDir: "HueJumper2k",
  },
  {
    id: "bounceback",
    slug: "bounceback",
    title: "BounceBack",
    description:
      "A Boomerang/Zelda homage for JS13k! Throw your boomerang, solve puzzles, and defeat enemies in this compact adventure.",
    instructions: "Arrow keys to move, X to throw boomerang. Catch it on return! Solve puzzles and defeat enemies.",
    url: "/BounceBack/index.html",
    category_id: "adventure",
    tags: ["zelda", "boomerang", "js13k", "puzzle", "action"],
    thumb: "/images/games/bounceback.png",
    width: 960,
    height: 540,
    source: "self-hosted",
    featured: true,
    routeDir: "BounceBack",
  },
  {
    id: "browserquest",
    slug: "browserquest",
    title: "BrowserQuest",
    description:
      "Mozilla's showcase HTML5 multiplayer RPG. Explore a fantasy world with other players in real-time!",
    instructions: "Click to move, click enemies to attack. Talk to NPCs. A landmark in browser gaming history.",
    url: "/BrowserQuest/client/index.html",
    category_id: "adventure",
    tags: ["mmo", "rpg", "multiplayer", "mozilla", "retro"],
    thumb: "/images/games/browserquest.png",
    width: 800,
    height: 500,
    source: "self-hosted",
    featured: true,
    routeDir: "BrowserQuest",
  },
  {
    id: "particle-clicker",
    slug: "particle-clicker",
    title: "Particle Clicker",
    description:
      "An incremental clicker game that teaches the history of particle physics. Created at CERN Webfest. Educational and addictive!",
    instructions: "Click to detect particles. Unlock upgrades and learn about physics as you progress.",
    url: "/particle-clicker/index.html",
    category_id: "clicker",
    tags: ["clicker", "idle", "educational", "physics", "science"],
    thumb: "/images/games/particle-clicker.png",
    width: 800,
    height: 600,
    source: "self-hosted",
    featured: true,
    routeDir: "particle-clicker",
  },

  // ═══ SECOND TIER ═══
  {
    id: "javascript-pong",
    slug: "javascript-pong",
    title: "Pong",
    description: "The classic 1972 arcade game Pong, beautifully recreated in JavaScript Canvas.",
    instructions: "Move mouse up/down to control paddle. First to 11 wins!",
    url: "/javascript-pong/index.html",
    category_id: "classic",
    tags: ["pong", "classic", "arcade", "retro", "2-player"],
    thumb: "/images/games/javascript-pong.png",
    width: 600,
    height: 400,
    source: "self-hosted",
    featured: true,
    routeDir: "javascript-pong",
  },
  {
    id: "javascript-tetris",
    slug: "javascript-tetris",
    title: "Tetris",
    description: "A clean JavaScript implementation of the timeless classic Tetris.",
    instructions: "Arrow keys to move/rotate, space to drop. Clear lines to score!",
    url: "/javascript-tetris/index.html",
    category_id: "classic",
    tags: ["tetris", "classic", "puzzle", "arcade", "retro"],
    thumb: "/images/games/javascript-tetris.png",
    width: 400,
    height: 600,
    source: "self-hosted",
    featured: true,
    routeDir: "javascript-tetris",
  },
  {
    id: "javascript-breakout",
    slug: "javascript-breakout",
    title: "Breakout",
    description: "Classic brick-breaking arcade game. Destroy all bricks with the ball!",
    instructions: "Move mouse to control paddle. Break all bricks to win!",
    url: "/javascript-breakout/index.html",
    category_id: "classic",
    tags: ["breakout", "classic", "arcade", "retro", "brick"],
    thumb: "/images/games/javascript-breakout.png",
    width: 480,
    height: 400,
    source: "self-hosted",
    featured: true,
    routeDir: "javascript-breakout",
  },
  {
    id: "javascript-snakes",
    slug: "javascript-snakes",
    title: "Snake",
    description: "The classic Snake game. Eat food, grow longer, don't hit yourself!",
    instructions: "Arrow keys to change direction. Eat the food to grow. Avoid walls and yourself!",
    url: "/javascript-snakes/index.html",
    category_id: "classic",
    tags: ["snake", "classic", "arcade", "retro"],
    thumb: "/images/games/javascript-snakes.png",
    width: 500,
    height: 500,
    source: "self-hosted",
    featured: true,
    routeDir: "javascript-snakes",
  },
  {
    id: "javascript-racer",
    slug: "javascript-racer",
    title: "OutRun Racer",
    description: "An OutRun-style pseudo-3D racing game built with HTML5 Canvas.",
    instructions: "Arrow keys to drive. Dodge other cars on the road!",
    url: "/javascript-racer/index.html",
    category_id: "racing",
    tags: ["racing", "outrun", "retro", "3D", "arcade"],
    thumb: "/images/games/javascript-racer.png",
    width: 640,
    height: 480,
    source: "self-hosted",
    featured: false,
    routeDir: "javascript-racer",
  },

  // ═══ MORE GAMES ═══
  {
    id: "drive13k",
    slug: "drive13k",
    title: "Drive13K",
    description: "Arcade-style 3D driving game in only 13 kilobytes!",
    instructions: "Arrow keys to drive. Collect coins and avoid obstacles!",
    url: "/Drive13K/index.html",
    category_id: "racing",
    tags: ["racing", "3D", "js13k", "arcade"],
    thumb: "/images/games/drive13k.png",
    width: 960,
    height: 540,
    source: "self-hosted",
    featured: false,
    routeDir: "Drive13K",
  },
  {
    id: "notecraft",
    slug: "notecraft",
    title: "NoteCraft",
    description: "A cellular automata music game. Create music through Conway-like patterns!",
    instructions: "Click cells to toggle them. Watch and listen as patterns evolve into music!",
    url: "/NoteCraft/index.html",
    category_id: "simulation",
    tags: ["music", "cellular-automata", "creative", "simulation"],
    thumb: "/images/games/notecraft.png",
    width: 800,
    height: 600,
    source: "self-hosted",
    featured: false,
    routeDir: "NoteCraft",
  },
  {
    id: "onslaught-arena",
    slug: "onslaught-arena",
    title: "Onslaught Arena",
    description: "Fast-paced medieval horde-fighting arcade shooter. Extremely polished HTML5 action!",
    instructions: "WASD to move, mouse to aim and shoot. Survive waves of enemies!",
    url: "/onslaught-arena/index.html",
    category_id: "action",
    tags: ["shooter", "medieval", "horde", "action", "arcade"],
    thumb: "/images/games/onslaught-arena.png",
    width: 800,
    height: 500,
    source: "self-hosted",
    featured: false,
    routeDir: "onslaught-arena",
  },
  {
    id: "diablo-js",
    slug: "diablo-js",
    title: "Diablo JS",
    description: "Isometric action-RPG in the style of the original Diablo, rendered on HTML5 Canvas!",
    instructions: "Click to move, click enemies to attack. Classic Diablo-style gameplay in your browser!",
    url: "/diablo-js/index.html",
    category_id: "adventure",
    tags: ["rpg", "isometric", "diablo", "action", "retro"],
    thumb: "/images/games/diablo-js.png",
    width: 800,
    height: 600,
    source: "self-hosted",
    featured: false,
    routeDir: "diablo-js",
  },
  {
    id: "javascript-tiny-platformer",
    slug: "javascript-tiny-platformer",
    title: "Tiny Platformer",
    description: "A very minimal JavaScript platform game — jump and run in pure Canvas!",
    instructions: "Arrow keys to move and jump. Reach the end of each level!",
    url: "/javascript-tiny-platformer/index.html",
    category_id: "action",
    tags: ["platformer", "minimal", "canvas", "retro"],
    thumb: "/images/games/javascript-tiny-platformer.png",
    width: 640,
    height: 480,
    source: "self-hosted",
    featured: false,
    routeDir: "javascript-tiny-platformer",
  },
  {
    id: "javascript-gauntlet",
    slug: "javascript-gauntlet",
    title: "Gauntlet",
    description: "An HTML5 Gauntlet-style dungeon crawler. Fight monsters and collect treasure!",
    instructions: "Arrow keys to move, space to attack. Clear dungeons of monsters!",
    url: "/javascript-gauntlet/index.html",
    category_id: "action",
    tags: ["dungeon", "gauntlet", "action", "retro"],
    thumb: "/images/games/javascript-gauntlet.png",
    width: 640,
    height: 480,
    source: "self-hosted",
    featured: false,
    routeDir: "javascript-gauntlet",
  },
  {
    id: "javascript-boulderdash",
    slug: "javascript-boulderdash",
    title: "Boulder Dash",
    description: "HTML5 implementation of the C64 classic Boulder Dash. Dig through caves and dodge boulders!",
    instructions: "Arrow keys to move. Collect diamonds, avoid falling boulders!",
    url: "/javascript-boulderdash/index.html",
    category_id: "classic",
    tags: ["boulderdash", "classic", "c64", "puzzle", "retro"],
    thumb: "/images/games/javascript-boulderdash.png",
    width: 640,
    height: 480,
    source: "self-hosted",
    featured: false,
    routeDir: "javascript-boulderdash",
  },
  {
    id: "javascript-delta",
    slug: "javascript-delta",
    title: "Delta",
    description: "A shoot-em-up in the style of the classic C64 game Delta. Blast alien ships!",
    instructions: "Arrow keys to move, space to shoot. Destroy all enemies!",
    url: "/javascript-delta/index.html",
    category_id: "shooting",
    tags: ["shoot-em-up", "c64", "retro", "space", "arcade"],
    thumb: "/images/games/javascript-delta.png",
    width: 640,
    height: 480,
    source: "self-hosted",
    featured: false,
    routeDir: "javascript-delta",
  },
  {
    id: "javascript-starfield",
    slug: "javascript-starfield",
    title: "Starfield",
    description: "An old-school 2D starfield effect using HTML5 Canvas. Simple, hypnotic, classic.",
    instructions: "Watch the stars fly by. A beautiful demo of Canvas rendering!",
    url: "/javascript-starfield/index.html",
    category_id: "simulation",
    tags: ["starfield", "demo", "canvas", "retro", "space"],
    thumb: "/images/games/javascript-starfield.png",
    width: 640,
    height: 480,
    source: "self-hosted",
    featured: false,
    routeDir: "javascript-starfield",
  },
  {
    id: "javascript-tower-platformer",
    slug: "javascript-tower-platformer",
    title: "Tower Platformer",
    description: "A rotating tower platformer prototype. Climb the rotating tower!",
    instructions: "Arrow keys to move and jump. Navigate the rotating tower!",
    url: "/javascript-tower-platformer/index.html",
    category_id: "action",
    tags: ["platformer", "tower", "rotating", "experimental"],
    thumb: "/images/games/javascript-tower-platformer.png",
    width: 640,
    height: 480,
    source: "self-hosted",
    featured: false,
    routeDir: "javascript-tower-platformer",
  },
];

// ─── Create route files ───
function createRoute(dirName: string, dataDir: string) {
  const routeDir = path.join(process.cwd(), "app", dirName, "[...path]");
  fs.mkdirSync(routeDir, { recursive: true });

  const routeContent = `import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".css": "text/css",
  ".json": "application/json",
  ".mp3": "audio/mpeg",
  ".ogg": "audio/ogg",
  ".wav": "audio/wav",
  ".opus": "audio/opus",
  ".m4a": "audio/mp4",
  ".ttf": "font/ttf",
  ".xml": "application/xml",
  ".wasm": "application/wasm",
  ".data": "application/octet-stream",
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const filePath = path?.length ? path.join("/") : "index.html";
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

// ─── Main ───
async function main() {
  console.log("═══ Creating routes ═══\n");

  for (const game of GAMES) {
    createRoute(game.id, game.routeDir);
  }

  console.log("\n═══ Adding to Supabase ═══\n");

  for (const game of GAMES) {
    const { error } = await supabase.from("games").upsert(
      {
        id: game.id,
        slug: game.slug,
        title: game.title,
        description: game.description,
        instructions: game.instructions,
        url: game.url,
        category_id: game.category_id,
        tags: game.tags,
        thumb: game.thumb,
        width: game.width,
        height: game.height,
        source: game.source,
        featured: game.featured,
      },
      { onConflict: "id" },
    );

    if (error) {
      console.error(`  ❌ ${game.title}: ${error.message}`);
    } else {
      console.log(`  ✅ ${game.title} (featured: ${game.featured})`);
    }
  }

  console.log("\n═══ Done! ═══");
}

main().catch(console.error);
