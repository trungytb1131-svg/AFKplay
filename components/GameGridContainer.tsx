"use client";

import GameCard from "./GameCard";
import { useGridGames } from "@/hooks/useGames";
import { logoSpacerClass } from "@/lib/portalLayout";
import type { Game } from "@/types/game";

/**
 * 2 game cuối danh sách làm sidebar cố định trên desktop.
 * Mobile: game đầu tiên sau game #0 được dùng làm 2x2.
 */
function getSidebarSlugs(games: Game[]): {
  sidebarSlugs: string[];
  mobile2x2Slug: string | null;
} {
  if (games.length === 0) return { sidebarSlugs: [], mobile2x2Slug: null };

  // 2 game cuối cho sidebar desktop
  const lastTwo = games.slice(-2).map((g) => g.slug);

  // Game ở vị trí index 8 (sau khi bỏ sidebar) làm mobile 2x2
  const mainGames = games.filter((g) => !lastTwo.includes(g.slug));
  const mobile2x2Slug = mainGames.length > 8 ? mainGames[8].slug : null;

  return { sidebarSlugs: lastTwo, mobile2x2Slug };
}

export default function GameGridContainer() {
  const { games, loading, error } = useGridGames();

  const { sidebarSlugs, mobile2x2Slug } = getSidebarSlugs(games);

  // Tách sidebar games và main games
  const sidebarGames = games.filter((g) => sidebarSlugs.includes(g.slug));
  const mainGames = games.filter((g) => !sidebarSlugs.includes(g.slug));

  const mobile2x2Game = mobile2x2Slug
    ? games.find((g) => g.slug === mobile2x2Slug)
    : null;

  const getGridClasses = (index: number, dSize?: string, mSize?: string) => {
    let classes = "relative ";
    if (mSize === "2x2") classes += "col-span-2 row-span-2 ";
    else classes += "col-span-1 row-span-1 ";

    if (index === 0) {
      classes += "lg:col-span-3 lg:row-span-3 lg:col-start-3 lg:row-start-1 ";
    } else {
      if (dSize === "3x3") classes += "lg:col-span-3 lg:row-span-3 ";
      else if (dSize === "2x2") classes += "lg:col-span-2 lg:row-span-2 ";
      else classes += "lg:col-span-1 lg:row-span-1 ";
    }
    return classes;
  };

  // ── Loading state ──
  if (loading) {
    return (
      <div className="relative w-full">
        <div className="grid gap-[10px] grid-cols-3 lg:grid-cols-17 grid-flow-row-dense auto-rows-[calc((100vw-40px)/3)] lg:auto-rows-[calc((100vw-180px)/17)]">
          <div
            className="col-span-1 lg:col-span-2 lg:col-start-1 lg:row-start-1 invisible pointer-events-none"
            aria-hidden
          >
            <div className={logoSpacerClass} />
          </div>
          <div className="col-span-2 col-start-1 row-start-2 lg:col-span-15 lg:col-start-3 flex items-center justify-center">
            <p className="text-slate-500 text-sm font-medium animate-pulse">
              Loading games...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Error / empty state ──
  if (error || games.length === 0) {
    return (
      <div className="relative w-full">
        <div className="grid gap-[10px] grid-cols-3 lg:grid-cols-17 grid-flow-row-dense auto-rows-[calc((100vw-40px)/3)] lg:auto-rows-[calc((100vw-180px)/17)]">
          <div
            className="col-span-1 lg:col-span-2 lg:col-start-1 lg:row-start-1 invisible pointer-events-none"
            aria-hidden
          >
            <div className={logoSpacerClass} />
          </div>
          <div className="col-span-2 col-start-1 row-start-2 lg:col-span-15 lg:col-start-3 flex items-center justify-center">
            <p className="text-slate-500 text-sm font-medium">
              {error
                ? `Error: ${error}`
                : "No games found. Run the import script first."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <div className="grid gap-[10px] grid-cols-3 lg:grid-cols-17 grid-flow-row-dense auto-rows-[calc((100vw-40px)/3)] lg:auto-rows-[calc((100vw-180px)/17)]">
        {/* Logo spacer: 2 cột đầu hàng 1 cho logo + UserHeader overlay */}
        <div
          className="col-span-1 lg:col-span-2 lg:col-start-1 lg:row-start-1 invisible pointer-events-none"
          aria-hidden
        >
          <div className={logoSpacerClass} />
        </div>

        {/* Spacer hàng 2: bỏ trống 2 cột đầu */}
        <div
          className="hidden lg:block col-span-2 row-start-2 col-start-1 invisible pointer-events-none"
          aria-hidden
        />

        {/* Desktop sidebar games (2 game cuối) */}
        {sidebarGames.map((game, i) => (
          <div
            key={game.id}
            className={`hidden lg:block col-span-1 row-start-3 z-10 ${i === 0 ? "col-start-1" : "col-start-2"}`}
          >
            <GameCard game={game} />
          </div>
        ))}

        {/* Mobile 2x2 game */}
        {mobile2x2Game && (
          <div className="lg:hidden col-span-2 row-span-2 row-start-2 col-start-1 z-10">
            <GameCard game={mobile2x2Game} />
          </div>
        )}

        {/* Main grid */}
        {mainGames.map((game, index) => (
          <div
            key={game.id}
            className={getGridClasses(index, game.dSize, game.mSize)}
          >
            <GameCard game={game} />
          </div>
        ))}
      </div>
    </div>
  );
}
