"use client";
import React, { useEffect, useMemo, useState } from "react";
import GameCard from "./GameCard";
import { useFavorites } from "@/hooks/useFavorites";
import { useGames } from "@/hooks/useGames";
import { Heart } from "lucide-react";

export default function FavoritesSidebar() {
  const { favorites } = useFavorites();
  const { games } = useGames();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lọc lấy dữ liệu game từ danh sách yêu thích
  const favoriteGames = useMemo(
    () =>
      (favorites || []).length > 0
        ? games.filter((game) => favorites.includes(game.slug))
        : [],
    [favorites, games],
  );

  // Tránh hydration mismatch: luôn ẩn cho đến khi client mount
  if (!mounted || favoriteGames.length === 0) return null;

  return (
    <div className="w-full lg:w-[320px] lg:flex-none animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="w-full bg-white/50 backdrop-blur-sm p-4 rounded-3xl border border-black/5 shadow-inner">
        {/* Tiêu đề mục Game yêu thích */}
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-red-500 p-2 rounded-xl shadow-lg">
            <Heart size={18} fill="white" color="white" />
          </div>
          <h2 className="text-sm lg:text-xl font-black uppercase italic tracking-tighter text-slate-800 leading-tight">
            RECENTLY PLAYED/FAVORITE GAME
          </h2>
        </div>

        {/* HỆ LƯỚI 2 HOẶC 3 CỘT CHO FAVORITES */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-[10px]">
          {favoriteGames.map((game) => (
            <div key={game.id} className="col-span-1 row-span-1 aspect-square">
              <GameCard game={game} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
