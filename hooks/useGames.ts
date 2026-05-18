"use client";

import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import type { Game } from "@/types/game";

// ──────────────────────────────────────────────
// Cache toàn cục: tránh fetch lại khi component re-mount
// ──────────────────────────────────────────────
let globalCache: Game[] | null = null;
let cacheTime = 0;
let fetchPromise: Promise<Game[] | null> | null = null;

async function fetchGamesFromSupabase(force = false): Promise<Game[]> {
  const stale = Date.now() - cacheTime > 60000; // 1 phút TTL
  if (!force && !stale && globalCache) return globalCache;
  if (force || stale) {
    globalCache = null;
    fetchPromise = null;
  }
  if (fetchPromise) {
    const r = await fetchPromise;
    return r ?? [];
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
  cacheTime = Date.now();
  return result ?? [];
}

// ──────────────────────────────────────────────
// Gán kích thước grid (dSize, mSize) dựa trên index
// ──────────────────────────────────────────────

function assignGridSizes(games: Game[], sidebarSlugs: Set<string>): Game[] {
  const mainGames = games.filter((g) => !sidebarSlugs.has(g.slug));

  // Ưu tiên featured game vào ô to: 5 ô 3×3, 10 ô 2×2
  const featured = mainGames.filter((g) => g.featured);
  const rest = mainGames.filter((g) => !g.featured);

  const sized = new Map<string, { dSize: string; mSize: string }>();

  featured.forEach((g, i) => {
    if (i < 5) sized.set(g.id, { dSize: "3x3", mSize: "1x1" });
    else if (i < 15) sized.set(g.id, { dSize: "2x2", mSize: "1x1" });
    else sized.set(g.id, { dSize: "1x1", mSize: "1x1" });
  });

  rest.forEach((g, i) => {
    const dSize = i % 5 === 0 ? "2x2" : "1x1";
    const mSize = i % 8 === 0 ? "2x2" : "1x1";
    sized.set(g.id, { dSize, mSize });
  });

  return games.map((game) => {
    if (sidebarSlugs.has(game.slug)) {
      return { ...game, dSize: "1x1", mSize: "1x1" };
    }
    const s = sized.get(game.id) || { dSize: "1x1", mSize: "1x1" };
    return { ...game, dSize: s.dSize, mSize: s.mSize };
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

    return () => {
      cancelled = true;
    };
  }, []);

  return { games, loading, error };
}

/**
 * Chỉ lấy game featured (cho trang chủ), tối đa 100.
 */
export function useFeaturedGames() {
  const { games, loading, error } = useGames();

  const featured = useMemo(
    () => games.filter((g) => g.featured).slice(0, 100),
    [games],
  );

  return { games: featured, loading, error };
}

/**
 * Trả về games đã gán grid sizes, với sidebar slugs tuỳ chọn.
 * Dùng cho GameGridContainer.
 */
export function useGridGames(sidebarSlugs: string[] = [], featuredOnly = true) {
  const {
    games: allGames,
    loading,
    error,
  } = featuredOnly ? useFeaturedGames() : useGames();

  const sidebarSet = useMemo(() => new Set(sidebarSlugs), [sidebarSlugs]);

  const sizedGames = useMemo(
    () => assignGridSizes(allGames, sidebarSet),
    [allGames, sidebarSet],
  );

  return { games: sizedGames, loading, error };
}

/**
 * Invalid cache (gọi khi cần refresh, vd sau khi import game mới).
 */
export function invalidateGameCache() {
  globalCache = null;
  cacheTime = 0;
  fetchPromise = null;
}
