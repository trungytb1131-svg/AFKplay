"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";

const STORAGE_KEY = "afkplay_favorites";
const HEARTED_KEY = "afkplay_hearted";
const EVENT_NAME = "afkplay_favorite_updated";
const MAX_ITEMS = 15;

type ActivityContextValue = {
  favorites: string[];
  loading: boolean;
  /** GameCard: chỉ sáng khi bấm tim */
  isHearted: (slug: string) => boolean;
  /** UserActivityBar: game nào trong bar cũng hiện tim đỏ */
  isFavorite: (slug: string) => boolean;
  toggleFavorite: (slug: string) => void;
  /** Xóa khỏi bar, không toggle hearted */
  removeFromBar: (slug: string) => void;
  trackPlay: (slug: string) => void;
  trackActivity: (slug: string, type: "play" | "heart") => void;
};

const ActivityContext = createContext<ActivityContextValue | null>(null);

function readStorage(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as string[];
  } catch {
    /* */
  }
  return [];
}

function readHearted(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HEARTED_KEY);
    if (raw) return JSON.parse(raw) as string[];
  } catch {
    /* */
  }
  return [];
}

function writeHearted(val: string[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(HEARTED_KEY, JSON.stringify(val));
}

function migrateLegacyKeys() {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(STORAGE_KEY)) return;
  const merged: string[] = [];
  for (const key of [
    "fav_games",
    "afkplay_favorites",
    "afkplay_activity_cache",
  ]) {
    try {
      const raw = localStorage.getItem(key);
      if (raw) merged.push(...(JSON.parse(raw) as string[]));
    } catch {
      /* */
    }
  }
  const unique = [...new Set(merged)].slice(0, MAX_ITEMS);
  if (unique.length) localStorage.setItem(STORAGE_KEY, JSON.stringify(unique));
}

export function ActivityProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>(() => {
    migrateLegacyKeys();
    return readStorage();
  });
  const [hearted, setHearted] = useState<string[]>(() => readHearted());
  const [loading, setLoading] = useState(true);

  const persist = useCallback((next: string[]) => {
    const trimmed = next.slice(0, MAX_ITEMS);
    setFavorites(trimmed);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    window.dispatchEvent(new Event(EVENT_NAME));
    return trimmed;
  }, []);

  const reload = useCallback(() => {
    setFavorites(readStorage());
    setHearted(readHearted());
  }, []);

  useEffect(() => {
    migrateLegacyKeys();
    reload();
    setLoading(false);
    const onUpdate = () => reload();
    window.addEventListener(EVENT_NAME, onUpdate);
    window.addEventListener("storage", onUpdate);
    return () => {
      window.removeEventListener(EVENT_NAME, onUpdate);
      window.removeEventListener("storage", onUpdate);
    };
  }, [reload]);

  useEffect(() => {
    let cancelled = false;
    const sync = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user || cancelled) return;
      const { data } = await supabase
        .from("profiles")
        .select("recent_activities")
        .eq("id", session.user.id)
        .single();
      if (cancelled || !data?.recent_activities?.length) return;
      const merged = [
        ...new Set([...data.recent_activities, ...readStorage()]),
      ].slice(0, MAX_ITEMS);
      persist(merged);
      await supabase
        .from("profiles")
        .update({ recent_activities: merged })
        .eq("id", session.user.id);
    };
    sync().catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [persist]);

  const pushToSupabase = useCallback(async (next: string[]) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user) return;
    await supabase
      .from("profiles")
      .update({ recent_activities: next })
      .eq("id", session.user.id);
  }, []);

  // GameCard: bấm tim → toggle cả 2 danh sách
  const toggleFavorite = useCallback(
    (slug: string) => {
      const cur = readStorage();
      const curH = readHearted();
      // Nếu đã hearted → bỏ tim (xóa khỏi hearted, giữ nguyên favorites nếu đã chơi)
      // Nếu chưa hearted → thêm tim (thêm vào cả hearted lẫn favorites)
      const isHeartedNow = curH.includes(slug);
      const nextH = isHeartedNow
        ? curH.filter((s) => s !== slug)
        : [slug, ...curH].slice(0, MAX_ITEMS);
      const next = isHeartedNow
        ? cur // giữ nguyên favorites khi bỏ tim
        : cur.includes(slug)
          ? cur // đã có trong favorites (do đã chơi) → giữ nguyên
          : [slug, ...cur].slice(0, MAX_ITEMS);
      persist(next);
      writeHearted(nextH);
      setHearted(nextH);
      pushToSupabase(next);
    },
    [persist, pushToSupabase],
  );

  // Chơi game → vào favorites, KHÔNG vào hearted
  const trackPlay = useCallback(
    (slug: string) => {
      const cur = readStorage();
      const next = [slug, ...cur.filter((s) => s !== slug)].slice(0, MAX_ITEMS);
      persist(next);
      pushToSupabase(next);
    },
    [persist, pushToSupabase],
  );

  const removeFromBar = useCallback(
    (slug: string) => {
      const cur = readStorage();
      const curH = readHearted();
      persist(cur.filter((s) => s !== slug));
      const nextH = curH.filter((s) => s !== slug);
      writeHearted(nextH);
      setHearted(nextH);
      pushToSupabase(cur.filter((s) => s !== slug));
    },
    [persist, pushToSupabase],
  );

  const trackActivity = useCallback(
    (slug: string, type: "play" | "heart") => {
      if (type === "heart") toggleFavorite(slug);
      else trackPlay(slug);
    },
    [toggleFavorite, trackPlay],
  );

  const value = useMemo<ActivityContextValue>(
    () => ({
      favorites,
      loading,
      isHearted: (slug) => hearted.includes(slug),
      isFavorite: (slug) => favorites.includes(slug),
      toggleFavorite,
      removeFromBar,
      trackPlay,
      trackActivity,
    }),
    [
      favorites,
      hearted,
      loading,
      toggleFavorite,
      removeFromBar,
      trackPlay,
      trackActivity,
    ],
  );

  return (
    <ActivityContext.Provider value={value}>
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivity() {
  const ctx = useContext(ActivityContext);
  if (!ctx) throw new Error("useActivity must be used within ActivityProvider");
  return ctx;
}
