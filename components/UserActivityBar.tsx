"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import Link from "next/link";
import GameCard from "./GameCard";
import { useActivity } from "@/contexts/ActivityContext";
import { useGames } from "@/hooks/useGames";
import { Heart, Play } from "lucide-react";

export default function UserActivityBar() {
  const { favorites, removeFromBar, isFavorite } = useActivity();
  const { games } = useGames();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleScroll = useCallback(() => {
    const currentY = window.scrollY;
    const diff = currentY - lastScrollY.current;
    if (Math.abs(diff) < 8) return;
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    if (diff > 0) setVisible(false);
    else setVisible(true);
    lastScrollY.current = currentY;
    scrollTimeout.current = setTimeout(() => setVisible(true), 1500);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, [handleScroll]);

  const displayGames = useMemo(
    () =>
      (favorites || [])
        .map((slug) => games.find((g) => g.slug === slug))
        .filter((g): g is NonNullable<typeof g> => !!g),
    [favorites, games],
  );

  if (!mounted) return null;

  return (
    <>
      {/* DESKTOP: spacer luôn hiện, bar chỉ hiện khi có game */}
      <div className="hidden lg:grid grid-cols-17 gap-[10px] w-full items-start relative z-30">
        <div className="col-span-2 invisible min-h-0" aria-hidden />
        {displayGames.length > 0 ? (
          <div className="col-span-15 bg-white/25 backdrop-blur-md rounded-2xl border border-white/40 shadow-sm flex items-center gap-2 px-3 h-[calc((100vw-180px)/17)]">
            <Heart size={12} className="text-red-500 fill-red-500 shrink-0" />
            <h2 className="text-[9px] font-black uppercase italic tracking-tighter text-slate-800 whitespace-nowrap shrink-0">
              RECENTLY PLAYED/FAVORITE GAME
            </h2>
            <div className="flex gap-[10px] overflow-hidden">
              {displayGames.map((game) => (
                <div
                  key={game.slug}
                  className="h-[calc((100vw-180px)/17-16px)] aspect-square shrink-0"
                >
                  <GameCard
                    game={game}
                    forceHeart
                    onHeartClick={removeFromBar}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="col-span-15 h-[calc((100vw-180px)/17+10px)]" />
        )}
      </div>

      {/* MOBILE: Dynamic Island */}
      {displayGames.length > 0 && (
        <div
          className={`lg:hidden fixed bottom-4 left-3 right-3 z-[250] transition-all duration-400 ease-out ${
            visible
              ? "translate-y-0 opacity-100"
              : "translate-y-28 opacity-0 pointer-events-none"
          }`}
        >
          <div className="bg-white/80 backdrop-blur-xl rounded-full border border-white/60 shadow-2xl shadow-black/10 px-3 py-2.5 flex items-center gap-2.5 overflow-hidden">
            <div className="shrink-0 bg-red-500 rounded-full p-1.5 shadow-md">
              <Heart size={12} fill="white" strokeWidth={0} />
            </div>
            <div className="flex-1 overflow-x-auto no-scrollbar flex gap-2 -mr-1">
              {displayGames.map((game) => {
                const fav = isFavorite(game.slug);
                return (
                  <div key={game.slug} className="shrink-0 relative">
                    <Link
                      href={`/play/${game.slug}`}
                      className="block w-11 h-11 rounded-2xl overflow-hidden bg-slate-200 shadow-sm active:scale-90 transition-transform"
                    >
                      <Image
                        src={game.thumb || `/images/games/${game.slug}.jpg`}
                        alt={game.title || game.slug}
                        fill
                        className="object-cover"
                        sizes="44px"
                        unoptimized={!!game.thumb}
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 active:opacity-100 transition-opacity">
                        <Play size={14} fill="white" strokeWidth={0} />
                      </div>
                    </Link>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeFromBar(game.slug);
                      }}
                      className={`absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center shadow-sm transition-all ${
                        fav
                          ? "bg-red-500 text-white"
                          : "bg-white/80 text-slate-400"
                      }`}
                    >
                      <Heart
                        size={8}
                        fill={fav ? "currentColor" : "none"}
                        strokeWidth={2.5}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="shrink-0 bg-slate-100 rounded-full px-2 py-0.5">
              <span className="text-[10px] font-black text-slate-500 tabular-nums">
                {displayGames.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
