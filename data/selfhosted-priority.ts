/**
 * Danh sách 44 game từ thư mục game-data, theo đúng thứ tự thư mục.
 * Dùng để ưu tiên các game này lên các ô đầu tiên trên lưới trang chủ.
 */
import type { Game } from "@/types/game";

export const GAME_DATA_PRIORITY_SLUGS: string[] = [
  // 1-10
  "adventures-with-anxiety", // ⭐ ô đầu tiên (cột 3, hàng 1)
  "10k-arcade-cabinet",
  "2048",
  "a-dark-room",
  "audio-dash",
  "bounceback",
  "browserquest",
  "chronos",
  "clippy-jump",
  "coming-out-simulator-2014",
  // 11-20
  "diablo-js",
  "drive13k",
  "eggtime-rewind-13k",
  "galaxian-canvas-game",
  "gamedev-canvas-workshop", // ⚠️ thư mục rỗng
  "hexgl",
  "hextris",
  "huejumper2k",
  "javascript-boulderdash",
  "javascript-breakout",
  // 21-30
  "javascript-delta",
  "javascript-gauntlet",
  "javascript-pong",
  "javascript-racer",
  "javascript-snakes",
  "javascript-starfield",
  "javascript-tetris",
  "javascript-tiny-platformer",
  "javascript-tower-platformer",
  "js13k-2018",
  // 31-40
  "js13k-2022",
  "js13k-2024",
  "js13k2025-little-paws",
  "ludum-dare-44",
  "notecraft",
  "onslaught-arena",
  "onspacestart",
  "particle-clicker",
  "shrimp", // DB có slug "1m-shrimp" → alias bên dưới
  "spacehuggers",
  // 41-44
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
  for (const [gdSlug, dbSlug] of Object.entries(GAME_DATA_SLUG_ALIASES)) {
    if (dbSlug === slug && GAME_DATA_PRIORITY_SLUGS.includes(gdSlug))
      return true;
  }
  return false;
}

/**
 * Trả về thứ hạng ưu tiên (0-43) của một game trong danh sách game-data.
 * Trả về -1 nếu không thuộc game-data.
 */
export function getGameDataPriority(slug: string): number {
  const directIdx = GAME_DATA_PRIORITY_SLUGS.indexOf(slug);
  if (directIdx >= 0) return directIdx;

  for (const [gdSlug, dbSlug] of Object.entries(GAME_DATA_SLUG_ALIASES)) {
    if (dbSlug === slug) {
      return GAME_DATA_PRIORITY_SLUGS.indexOf(gdSlug);
    }
  }

  return -1;
}
