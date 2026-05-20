import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Cho phép tất cả game self-hosted được nhúng trong iframe cùng origin
  // Pattern: any single-segment path that has a game-data folder
  const gameSlugs = [
    "shrimp",
    "adventures-with-anxiety",
    "coming-out-simulator-2014",
    "we-become-what-we-behold",
    "the-evolution-of-trust",
    "2048",
    "hextris",
    "a-dark-room",
    "spacehuggers",
    "untrusted",
    "hexgl",
    "huejumper2k",
    "bounceback",
    "browserquest",
    "particle-clicker",
    "javascript-pong",
    "javascript-tetris",
    "javascript-breakout",
    "javascript-snakes",
    "javascript-racer",
    "drive13k",
    "notecraft",
    "onslaught-arena",
    "diablo-js",
    "javascript-tiny-platformer",
    "javascript-gauntlet",
    "javascript-boulderdash",
    "javascript-delta",
    "javascript-starfield",
    "javascript-tower-platformer",
    "galaxian-canvas-game",
    "audio-dash",
    "terraform",
    "chronos",
    "js13k-2018",
    "js13k-2022",
    "js13k-2024",
    "10k-arcade-cabinet",
    "JS13K2025",
    "EggTimeRewind13k",
    "LudumDare44",
    "breakout-end3r",
    "Clippy-Jump",
    "onSpaceStart",
    "pothonprogramming",
  ];
  if (
    gameSlugs.some((s) => pathname.startsWith("/" + s + "/")) ||
    pathname === "/test-shrimp.html"
  ) {
    const response = NextResponse.next();
    response.headers.set("X-Frame-Options", "SAMEORIGIN");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|favicon|icon).*)"],
};
