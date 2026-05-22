"use client";

import GameCard from "./GameCard";
import { useGridGames } from "@/hooks/useGames";
import { logoSpacerClass } from "@/lib/portalLayout";
import { rankGamesIntoLots } from "@/lib/gridRanking";
import { getSlotClasses } from "@/data/grid-slots";
import type { Game } from "@/types/game";

function getSidebarSlugs(games: Game[]) {
  if (games.length === 0)
    return {
      sidebarSlugs: [] as string[],
      mobile2x2Slug: null as string | null,
    };
  const lastTwo = games.slice(-2).map((g) => g.slug);
  const mainGames = games.filter((g) => !lastTwo.includes(g.slug));
  const mobile2x2Slug = mainGames.length > 8 ? mainGames[8].slug : null;
  return { sidebarSlugs: lastTwo, mobile2x2Slug };
}

export default function GameGridContainer() {
  const { games, loading, error } = useGridGames([], false, 200);
  const { sidebarSlugs, mobile2x2Slug } = getSidebarSlugs(games);
  const sidebarGames = games.filter((g) => sidebarSlugs.includes(g.slug));
  const mobile2x2Game = mobile2x2Slug
    ? games.find((g) => g.slug === mobile2x2Slug)
    : null;
  const rankedSlots = rankGamesIntoLots(games, new Set(sidebarSlugs));

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
              {error ? `Error: ${error}` : "No games found."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <div className="grid gap-[10px] grid-cols-3 lg:grid-cols-17 grid-flow-row-dense auto-rows-[calc((100vw-40px)/3)] lg:auto-rows-[calc((100vw-180px)/17)]">
        <div
          className="col-span-1 lg:col-span-2 lg:col-start-1 lg:row-start-1 invisible pointer-events-none"
          aria-hidden
        >
          <div className={logoSpacerClass} />
        </div>
        <div
          className="hidden lg:block col-span-2 row-start-2 col-start-1 invisible pointer-events-none"
          aria-hidden
        />
        {sidebarGames.map((game, i) => (
          <div
            key={game.id}
            className={`hidden lg:block col-span-1 row-start-3 z-10 ${i === 0 ? "col-start-1" : "col-start-2"}`}
          >
            <GameCard game={game} />
          </div>
        ))}
        {mobile2x2Game && (
          <div className="lg:hidden col-span-2 row-span-2 row-start-2 col-start-1 z-10">
            <GameCard game={mobile2x2Game} />
          </div>
        )}
        {rankedSlots.map(({ slot, game }) =>
          game ? (
            <div key={`slot-${slot.num}`} className={getSlotClasses(slot)}>
              <GameCard game={game} />
            </div>
          ) : null,
        )}
      </div>
    </div>
  );
}
