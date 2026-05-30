"use client";

import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import type { Game } from "@/types/game";
import {
  GAME_DATA_PRIORITY_SLUGS,
  GAME_DATA_SLUG_ALIASES,
  GAME_DATA_FALLBACKS,
  getGameDataPriority,
} from "@/data/selfhosted-priority";

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

/**
 * Sắp xếp game: 48 game từ game-data lên đầu, sau đó mới đến các game khác.
 * Inject fallback Game objects cho các game có trong game-data nhưng chưa có trong DB.
 */
function prioritizeGameData(allGames: Game[]): Game[] {
  const gameDataGames: Game[] = [];
  const otherGames: Game[] = [];
  const seenSlugs = new Set<string>();

  // Phân loại game từ DB
  for (const g of allGames) {
    const priority = getGameDataPriority(g.slug);
    if (priority >= 0) {
      gameDataGames.push(g);
      seenSlugs.add(g.slug);
    } else {
      otherGames.push(g);
    }
  }

  // Thêm fallback cho các game-data chưa có trong DB
  for (const fb of GAME_DATA_FALLBACKS) {
    if (!seenSlugs.has(fb.slug)) {
      gameDataGames.push(fb);
      seenSlugs.add(fb.slug);
    }
  }

  // Sắp xếp game-data games theo đúng thứ tự GAME_DATA_PRIORITY_SLUGS
  gameDataGames.sort((a, b) => {
    const pa = getGameDataPriority(a.slug);
    const pb = getGameDataPriority(b.slug);
    return pa - pb;
  });

  // Featured games khác (không thuộc game-data) lên trước, rồi đến phần còn lại
  const otherFeatured = otherGames.filter((g) => g.featured);
  const otherRest = otherGames.filter((g) => !g.featured);

  return [...gameDataGames, ...otherFeatured, ...otherRest];
}

// ──────────────────────────────────────────────
// Hook chính
// ──────────────────────────────────────────────

export function useGames() {
  const [games, setGames] = useState<Game[]>(globalCache ?? []);
  const [loading, setLoading] = useState(false);
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
 *
 * Quan trọng: 48 game từ game-data được ưu tiên lên đầu lưới,
 * sau đó mới đến các game featured khác từ DB.
 *
 * @param maxGames - Tổng số game tối đa trả về (mặc định 102 = 100 ô chính + 2 sidebar).
 */
export function useGridGames(
  sidebarSlugs: string[] = [],
  featuredOnly = true,
  maxGames = 102,
) {
  const { games: allGames, loading, error } = useGames();

  const sidebarSet = useMemo(() => new Set(sidebarSlugs), [sidebarSlugs]);

  const prioritizedGames = useMemo(() => {
    // Luôn luôn ưu tiên game-data lên đầu
    const sorted = prioritizeGameData(allGames);
    // Nếu featuredOnly, vẫn giữ lại cả game-data (kể cả fallback) + featured khác
    const filtered = featuredOnly
      ? sorted.filter((g) => getGameDataPriority(g.slug) >= 0 || g.featured)
      : sorted;
    // Giới hạn tổng số game
    return filtered.slice(0, maxGames);
  }, [allGames, featuredOnly, maxGames]);

  return { games: prioritizedGames, loading, error };
}

/**
 * Invalid cache (gọi khi cần refresh, vd sau khi import game mới).
 */
export function invalidateGameCache() {
  globalCache = null;
  cacheTime = 0;
  fetchPromise = null;
}

/** Seed cache từ server-side data để tránh loading state */
export function seedGameCache(games: Game[]) {
  if (games.length > 0) {
    globalCache = games;
    cacheTime = Date.now();
  }
}
