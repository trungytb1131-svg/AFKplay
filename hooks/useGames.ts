"use client";

import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import type { Game } from "@/types/game";

// ──────────────────────────────────────────────
// Cache toàn cục: tránh fetch lại khi component re-mount
// ──────────────────────────────────────────────
let globalCache: Game[] | null = null;
let fetchPromise: Promise<Game[] | null> | null = null;

async function fetchGamesFromSupabase(): Promise<Game[]> {
  if (globalCache) return globalCache;

  // Tránh nhiều request đồng thời
  if (fetchPromise) {
    const result = await fetchPromise;
    return result ?? [];
  }

  fetchPromise = (async () => {
    const allGames: Game[] = [];
    let page = 0;
    const pageSize = 500;

    while (true) {
      const { data, error } = await supabase
        .from("games")
        .select("*")
        .range(page * pageSize, (page + 1) * pageSize - 1)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("useGames fetch error:", error.message);
        break;
      }

      if (!data || data.length === 0) break;
      allGames.push(...(data as Game[]));

      if (data.length < pageSize) break;
      page++;
    }

    return allGames;
  })();

  const result = await fetchPromise;
  globalCache = result;
  return result ?? [];
}

// ──────────────────────────────────────────────
// Gán kích thước grid (dSize, mSize) dựa trên index
// ──────────────────────────────────────────────

function assignGridSizes(games: Game[], sidebarSlugs: Set<string>): Game[] {
  // Lọc ra các game không nằm trong sidebar
  const mainGames = games.filter((g) => !sidebarSlugs.has(g.slug));

  return games.map((game) => {
    if (sidebarSlugs.has(game.slug)) {
      return { ...game, dSize: "1x1", mSize: "1x1" };
    }
    const idx = mainGames.indexOf(game);
    let dSize = "1x1";
    let mSize = "1x1";

    if (idx === 0) {
      dSize = "3x3";
      mSize = "1x1";
    } else {
      if (idx % 15 === 0 && idx < 90) dSize = "3x3";
      else if (idx % 4 === 0 && idx < 60) dSize = "2x2";
    }
    if (idx > 0 && idx % 8 === 0) mSize = "2x2";

    return { ...game, dSize, mSize };
  });
}

// ──────────────────────────────────────────────
// Hook chính
// ──────────────────────────────────────────────

export function useGames() {
  const [games, setGames] = useState<Game[]>(globalCache ?? []);
  const [loading, setLoading] = useState(!globalCache);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (globalCache) {
      setGames(globalCache);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    fetchGamesFromSupabase()
      .then((data) => {
        if (!cancelled) {
          setGames(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error("useGames error:", err);
          setError(err.message ?? "Unknown error");
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, []);

  return { games, loading, error };
}

/**
 * Trả về games đã gán grid sizes, với sidebar slugs tuỳ chọn.
 * Dùng cho GameGridContainer.
 */
export function useGridGames(sidebarSlugs: string[] = []) {
  const { games, loading, error } = useGames();
  const sidebarSet = useMemo(() => new Set(sidebarSlugs), [sidebarSlugs]);

  const sizedGames = useMemo(
    () => assignGridSizes(games, sidebarSet),
    [games, sidebarSet],
  );

  return { games: sizedGames, loading, error };
}

/**
 * Invalid cache (gọi khi cần refresh, vd sau khi import game mới).
 */
export function invalidateGameCache() {
  globalCache = null;
  fetchPromise = null;
}
