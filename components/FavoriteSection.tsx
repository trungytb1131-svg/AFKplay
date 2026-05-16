"use client";

import React, { useEffect, useMemo, useState } from "react";
import GameCard from "./GameCard";
import { useActivity } from "@/contexts/ActivityContext";
import { useGames } from "@/hooks/useGames";
import { Heart } from "lucide-react";

export default function FavoriteSection() {
  const { favorites } = useActivity();
  const { games } = useGames();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const favoriteGames = useMemo(
    () =>
      (favorites || []).length > 0
        ? games.filter((game) => favorites.includes(game.slug)).slice(0, 15)
        : [],
    [favorites, games],
  );

  // Tránh hydration mismatch: luôn ẩn cho đến khi client mount
  if (!mounted || favoriteGames.length === 0) return null;

  return (
    <div className="w-full relative z-30 mb-2 transition-all duration-500 ease-in-out">
      <div className="grid grid-cols-17 gap-[10px] w-full items-start">
        <div className="col-span-2 invisible lg:col-span-2" />
        <div className="col-span-15 lg:col-span-15 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 p-2 min-h-[100px]">
          <div className="flex items-center gap-3 mb-2 px-1">
            <Heart size={14} className="text-red-500 fill-red-500" />
            <h2 className="text-xs font-black uppercase italic tracking-tighter text-slate-800 leading-tight">
              RECENTLY PLAYED/FAVORITE GAME
            </h2>
          </div>
          <div className="grid grid-cols-15 gap-[10px] w-full items-start">
            {Array.from({ length: 15 - favoriteGames.length }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="col-span-1 aspect-square invisible"
              />
            ))}
            {favoriteGames.map((game) => (
              <div key={game.slug} className="col-span-1 aspect-square">
                <GameCard game={game} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
