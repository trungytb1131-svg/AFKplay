"use client";

import React, { useMemo } from "react";
import GameGridContainer from "@/components/GameGridContainer";
import GameCard from "@/components/GameCard";
import CategoryCard from "@/components/CategoryCard";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";
import UserActivityBar from "@/components/UserActivityBar";
import FixedPortalSidebar from "@/components/FixedPortalSidebar";
import HeaderOverlay from "@/components/HeaderOverlay";
import { CATEGORIES_28 } from "@/data/categories";
import type { Game } from "@/types/game";
import { seedGameCache } from "@/hooks/useGames";

export default function HomePageClient({
  initialGames,
}: {
  initialGames: Game[];
}) {
  // Seed cache với data từ server → grid hiện ngay không loading
  seedGameCache(initialGames);

  const categoryThumbs = useMemo(() => {
    const map: Record<string, string> = {};
    for (const g of initialGames) {
      if (g.thumb && !map[g.category_id]) map[g.category_id] = g.thumb;
    }
    return map;
  }, [initialGames]);

  return (
    <main className="min-h-screen bg-[#adecf5] p-[10px] lg:p-[16px] w-full overflow-x-hidden flex flex-col gap-[10px]">
      <HeaderOverlay />

      <div className="z-30 w-full">
        <UserActivityBar />
      </div>

      <div className="w-full relative z-20">
        <GameGridContainer />
      </div>

      <div className="w-full mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-[10px] w-full">
          {CATEGORIES_28.map((cat, index) => {
            const isTopRow = index < 7;
            return (
              <div
                key={cat.slug}
                className={
                  isTopRow
                    ? "aspect-[3/1] lg:aspect-square"
                    : "aspect-[3/1] lg:aspect-[2/1]"
                }
              >
                <CategoryCard
                  category={cat}
                  isSquare={isTopRow}
                  thumb={categoryThumbs[cat.slug]}
                />
              </div>
            );
          })}
        </div>
      </div>

      {initialGames.length > 0 && (
        <div className="w-full mt-6">
          <h2 className="text-lg lg:text-2xl font-black uppercase italic text-slate-800 mb-3 px-1">
            🎮 More Games
          </h2>
          <div className="grid grid-cols-3 lg:grid-cols-8 gap-[10px] w-full">
            {initialGames
              .filter((g) => !g.featured)
              .slice(0, 40)
              .map((game) => (
                <div key={game.id} className="aspect-square">
                  <GameCard game={game} />
                </div>
              ))}
          </div>
        </div>
      )}

      <div className="w-full mt-4">
        <AboutSection />
      </div>

      <div className="w-full">
        <Footer />
      </div>
    </main>
  );
}
