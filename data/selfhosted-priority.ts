/**
 * Danh sách 48 game từ thư mục game-data, theo đúng thứ tự thư mục.
 * Dùng để ưu tiên các game này lên 48 ô đầu tiên trên lưới trang chủ.
 */
import type { Game } from "@/types/game";

export const GAME_DATA_PRIORITY_SLUGS: string[] = [
  // 1-10
  "adventures-with-anxiety", // ⭐ ô đầu tiên (cột 3, hàng 1)
  "10k-arcade-cabinet",
  "2048",
  "a-dark-room",
  "0hh1", // ⚠️ thư mục rỗng
  "audio-dash",
  "bounceback",
  "breakout-end3r",
  "browserquest",
  "chronos",
  // 11-20
  "clippy-jump",
  "coming-out-simulator-2014",
  "diablo-js",
  "drive13k",
  "eggtime-rewind", // EggTimeRewind — chưa có trong DB, dùng hardcoded fallback
  "eggtime-rewind-13k", // EggTimeRewind13k
  "fullscreenmario", // ⚠️ thư mục rỗng
  "galaxian-canvas-game",
  "gamedev-canvas-workshop", // ⚠️ thư mục rỗng
  "hexgl",
  // 21-30
  "hextris",
  "huejumper2k",
  "javascript-boulderdash",
  "javascript-breakout",
  "javascript-delta",
  "javascript-gauntlet",
  "javascript-pong",
  "javascript-racer",
  "javascript-snakes",
  "javascript-starfield",
  // 31-40
  "javascript-tetris",
  "javascript-tiny-platformer",
  "javascript-tower-platformer",
  "js13k-2018",
  "js13k-2022",
  "js13k-2024",
  "js13k2025-little-paws",
  "ludum-dare-44",
  "notecraft",
  "onslaught-arena",
  // 41-48
  "onspacestart",
  "particle-clicker",
  "shrimp", // DB có slug "1m-shrimp" → alias bên dưới
  "spacehuggers",
  "terraform",
  "the-evolution-of-trust",
  "untrusted",
  "we-become-what-we-behold",
];

/**
 * Alias map: game-data folder name → database slug (khi khác nhau).
 */
export const GAME_DATA_SLUG_ALIASES: Record<string, string> = {
  shrimp: "1m-shrimp", // DB dùng slug "1m-shrimp", game-data là "shrimp"
};

/**
 * Hardcoded fallback Game objects cho các game có trong game-data nhưng
 * chưa có trong database. Các game này vẫn hiển thị trên lưới.
 */
export const GAME_DATA_FALLBACKS: Game[] = [
  {
    id: "eggtime-rewind",
    slug: "eggtime-rewind",
    title: "EggTime Rewind",
    description:
      "Egg Cracking Lo-Fi Sci-Fi Shooter With Time Travel. Made for Nokia 3310 Jam 2 by Frank Force.",
    instructions:
      "WASD/Arrow keys to move, Space/Shift to shoot. Crack space eggs!",
    url: "/game-data/EggTimeRewind/index.html",
    category_id: "shooting",
    tags: ["shooter", "sci-fi", "arcade", "nokia-jam", "lo-fi"],
    thumb: "/images/games/eggtime-rewind.png",
    width: 640,
    height: 480,
    source: "self-hosted",
    featured: true,
  },
  {
    id: "0hh1",
    slug: "0hh1",
    title: "0hh1",
    description: "A minimalist puzzle game — binary Sudoku style. Coming soon!",
    instructions: "Fill the grid according to binary Sudoku rules.",
    url: "#",
    category_id: "puzzle",
    tags: ["puzzle", "minimalist", "logic"],
    thumb: "/images/games/placeholder.png",
    width: 500,
    height: 500,
    source: "self-hosted",
    featured: true,
  },
  {
    id: "fullscreenmario",
    slug: "fullscreenmario",
    title: "FullScreen Mario",
    description:
      "Full-screen Super Mario Bros. experience in the browser. Coming soon!",
    instructions: "Arrow keys to move, Space to jump. Classic Mario gameplay.",
    url: "#",
    category_id: "action",
    tags: ["mario", "platformer", "retro", "classic"],
    thumb: "/images/games/placeholder.png",
    width: 800,
    height: 600,
    source: "self-hosted",
    featured: true,
  },
  {
    id: "gamedev-canvas-workshop",
    slug: "gamedev-canvas-workshop",
    title: "Canvas Workshop",
    description:
      "HTML5 Canvas game development workshop projects. Coming soon!",
    instructions: "Various Canvas experiments and mini-games.",
    url: "#",
    category_id: "simulation",
    tags: ["canvas", "workshop", "educational", "html5"],
    thumb: "/images/games/placeholder.png",
    width: 800,
    height: 600,
    source: "self-hosted",
    featured: true,
  },
];

/**
 * Kiểm tra một slug có thuộc danh sách game-data không (tính cả alias).
 */
export function isGameDataGame(slug: string): boolean {
  if (GAME_DATA_PRIORITY_SLUGS.includes(slug)) return true;
  // Kiểm tra alias ngược: DB slug → game-data slug
  for (const [gdSlug, dbSlug] of Object.entries(GAME_DATA_SLUG_ALIASES)) {
    if (dbSlug === slug && GAME_DATA_PRIORITY_SLUGS.includes(gdSlug))
      return true;
  }
  return false;
}

/**
 * Trả về thứ hạng ưu tiên (0-47) của một game trong danh sách game-data.
 * Trả về -1 nếu không thuộc game-data.
 */
export function getGameDataPriority(slug: string): number {
  // Kiểm tra trực tiếp
  const directIdx = GAME_DATA_PRIORITY_SLUGS.indexOf(slug);
  if (directIdx >= 0) return directIdx;

  // Kiểm tra alias ngược
  for (const [gdSlug, dbSlug] of Object.entries(GAME_DATA_SLUG_ALIASES)) {
    if (dbSlug === slug) {
      return GAME_DATA_PRIORITY_SLUGS.indexOf(gdSlug);
    }
  }

  return -1;
}
