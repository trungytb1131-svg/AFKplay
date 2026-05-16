"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { ChevronLeft, Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useGames } from "@/hooks/useGames";

export default function SearchOverlay() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { games } = useGames();

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("open-search", handler);
    return () => window.removeEventListener("open-search", handler);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setQuery("");
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = useCallback(() => setOpen(false), []);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return games
      .filter(
        (g) =>
          g.title?.toLowerCase().includes(q) ||
          g.slug.toLowerCase().includes(q),
      )
      .slice(0, 20);
  }, [query, games]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[300] flex">
      {/* ===== LEFT 1/3: Nền xanh + Search ===== */}
      <div className="w-1/3 min-w-[320px] bg-[#adecf5] flex flex-col p-6 lg:p-10 relative z-10">
        {/* Header */}
        <div className="text-center mb-6 shrink-0">
          <div className="text-3xl lg:text-4xl font-black italic tracking-tighter text-slate-900 uppercase">
            AFK<span className="text-blue-600">PLAY</span>
          </div>
          <p className="text-[9px] text-slate-500 font-bold mt-1 uppercase tracking-wider">
            Find Your Next Game
          </p>
        </div>

        {/* Search Input */}
        <div className="relative mb-4 shrink-0">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search games..."
            className="w-full pl-11 pr-4 py-3.5 bg-white rounded-2xl border-2 border-transparent focus:border-blue-500 outline-none text-sm font-medium text-slate-800 placeholder-slate-400 shadow-sm"
          />
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto no-scrollbar -mx-2 px-2">
          {query.trim() && results.length === 0 && (
            <p className="text-center text-slate-500 text-xs font-medium mt-8">
              No games found for &quot;{query}&quot;
            </p>
          )}
          <div className="grid grid-cols-2 gap-2">
            {results.map((game) => (
              <Link
                key={game.id}
                href={`/play/${game.slug}`}
                onClick={close}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md active:scale-95 transition-all"
              >
                <div className="aspect-square relative bg-slate-200">
                  <Image
                    src={game.thumb || `/images/games/${game.slug}.jpg`}
                    alt={game.title || game.slug}
                    fill
                    className="object-cover"
                    sizes="20vw"
                    unoptimized={!!game.thumb}
                  />
                </div>
                <div className="p-2">
                  <span className="text-[10px] font-black uppercase text-slate-800 leading-tight block truncate">
                    {game.title || game.slug.replace(/-/g, " ")}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ===== CIRCULAR CLOSE BUTTON ===== */}
      <button
        onClick={close}
        className="absolute left-1/3 -translate-x-1/2 top-1/2 -translate-y-1/2 z-20 w-12 h-12 lg:w-14 lg:h-14 bg-white rounded-full shadow-2xl border-2 border-slate-100 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
        aria-label="Close search"
      >
        <ChevronLeft size={24} className="text-slate-600" />
      </button>

      {/* ===== RIGHT 2/3: Kính mờ ===== */}
      <div
        className="flex-1 bg-slate-900/40 backdrop-blur-md"
        onClick={close}
      />
    </div>
  );
}

export function useSearchOverlay() {
  return () => {
    window.dispatchEvent(new Event("open-search"));
  };
}
