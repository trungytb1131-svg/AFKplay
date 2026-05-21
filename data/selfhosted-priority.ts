/**
 * Danh sách 43 game từ thư mục game-data, theo đúng thứ tự thư mục.
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
  // 45-54: GitHub standalone games
  "andromeda-invaders",
  "pacman-html5",
  "html5-asteroids",
  "star-battle",
  "dungeon-crawler-rpg",
  "classic-pool",
  "sandboxels",
  "mykonos-island",
  // 55-84: 37-games collection (đã lọc trùng)
  "collection-candy-crush",
  "collection-chess",
  "collection-doodle-jump",
  "collection-solitaire",
  "collection-sudoku",
  "collection-crossy-road",
  "collection-flappy-bird",
  "collection-wordle",
  "collection-hangman",
  "collection-archery",
  "collection-minesweeper",
  "collection-speed-typing",
  "collection-tilting-maze",
  "collection-memory-card",
  "collection-number-guess",
  "collection-insect-catch",
  "collection-typing-1",
  "collection-shape-clicker",
  "collection-speak-guess",
  "collection-fruit-slicer",
  "collection-quiz",
  "collection-emoji-catcher",
  "collection-whack-a-mole",
  "collection-simon-says",
  "collection-sliding-puzzle",
  "collection-rps",
  "collection-tower-blocks",
  "collection-tic-tac-toe",
  "collection-dice-roll",
  "collection-typing-2",
  // 85-100: GitHub batch 2
  "isocity",
  "server-survival",
  "radius-raid",
  "sleeping-beauty",
  "level13",
  "evolve",
  "synthblast",
  "canvas-td",
  "drunken-viking",
  "k8s-games",
  "guitar-bro",
  "match3-html5",
  "wordpluck",
  "q1k3",
  "black-hole-square",
  "stolen-sword",
  // 101-117: GitHub batch 3 (clone mới)
  "thirteenth-floor",
  "blueprint-idle",
  "chrome-dino",
  "feed-the-flames",
  "google-the-game",
  "island-not-found",
  "offline-paradise",
  "point-generation",
  "quickclick",
  "rs-clicker",
  "society-fail",
  "tower-defense",
  "captain-callisto",
  "connect-four",
  "exotoaster",
  "raycast-js",
  "slotjs",
];

/**
 * Alias map: game-data folder name → database slug (khi khác nhau).
 */
export const GAME_DATA_SLUG_ALIASES: Record<string, string> = {
  shrimp: "1m-shrimp", // DB dùng slug "1m-shrimp", game-data là "shrimp"
};

/**
 * Hardcoded fallback Game objects cho các game có trong game-data nhưng
 * chưa có trong database. Hiện tại tất cả game-data đều đã có trong DB.
 */
export const GAME_DATA_FALLBACKS: Game[] = [];

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
