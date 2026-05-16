"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";
import {
  accrueIdleCoins,
  buildProfilePatch,
  COIN_IDLE_INTERVAL_MS,
  COINS_PER_IDLE_TICK,
  DEFAULT_COINS,
  DEFAULT_STARS,
  normalizeProfile,
  type ProfileRow,
} from "@/lib/profileEconomy";
import { getRankDefinition, type RankId } from "@/lib/ranks";

// --- Play-time star earning ---
const PLAY_TIME_STORAGE_KEY = "afkplay_play_time_ms";
const PLAY_DATE_STORAGE_KEY = "afkplay_play_date";
const STARS_EARNED_KEY = "afkplay_stars_earned_today";
const PLAY_TIME_PER_STAR_MS = 60 * 60 * 1000; // 1 giờ
const MAX_STARS_PER_DAY = 3;

function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function readPlayTimeData(): {
  playTimeMs: number;
  date: string;
  starsEarned: number;
} {
  if (typeof window === "undefined")
    return { playTimeMs: 0, date: "", starsEarned: 0 };
  const today = getTodayKey();
  const storedDate = localStorage.getItem(PLAY_DATE_STORAGE_KEY);
  if (storedDate !== today) {
    // Ngày mới → reset
    localStorage.setItem(PLAY_DATE_STORAGE_KEY, today);
    localStorage.setItem(PLAY_TIME_STORAGE_KEY, "0");
    localStorage.setItem(STARS_EARNED_KEY, "0");
    return { playTimeMs: 0, date: today, starsEarned: 0 };
  }
  const playTimeMs = parseInt(
    localStorage.getItem(PLAY_TIME_STORAGE_KEY) || "0",
    10,
  );
  const starsEarned = parseInt(
    localStorage.getItem(STARS_EARNED_KEY) || "0",
    10,
  );
  return { playTimeMs, date: today, starsEarned };
}

function savePlayTimeData(playTimeMs: number, starsEarned: number) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PLAY_DATE_STORAGE_KEY, getTodayKey());
  localStorage.setItem(PLAY_TIME_STORAGE_KEY, String(playTimeMs));
  localStorage.setItem(STARS_EARNED_KEY, String(starsEarned));
}

export type VaultProfile = {
  id: string;
  username: string;
  coins: number;
  stars: number;
  rank: RankId;
  last_coin_at: string;
  avatar_url?: string | null;
};

type ProfileContextValue = {
  profile: VaultProfile | null;
  loading: boolean;
  isGuest: boolean;
  rankLabel: string;
  rankIcon: string;
  awardStars: (amount?: number) => Promise<void>;
  trackPlayTime: (ms: number) => void;
  refreshProfile: () => Promise<void>;
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

function rowToVault(row: ProfileRow): VaultProfile {
  const norm = normalizeProfile(row);
  return {
    id: row.id,
    username: row.username || "Player",
    coins: norm.coins,
    stars: norm.stars,
    rank: norm.rank,
    last_coin_at: norm.last_coin_at,
    avatar_url: row.avatar_url,
  };
}

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<VaultProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const profileRef = useRef<VaultProfile | null>(null);
  const mountedRef = useRef(true);
  const playTimeRef = useRef(readPlayTimeData());

  useEffect(() => {
    profileRef.current = profile;
  }, [profile]);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, []);

  const persistProfile = useCallback(async (next: VaultProfile) => {
    const patch = buildProfilePatch(next.coins, next.stars, next.last_coin_at);
    const { error } = await supabase
      .from("profiles")
      .update({
        coins: patch.coins,
        stars: patch.stars,
        rank: patch.rank,
        last_coin_at: patch.last_coin_at,
      })
      .eq("id", next.id);

    if (error) {
      console.error("Profile sync error:", error.message);
      return false;
    }
    const merged = { ...next, ...patch };
    if (mountedRef.current) {
      setProfile(merged);
      profileRef.current = merged;
    }
    return true;
  }, []);

  const applyRow = useCallback((row: ProfileRow | null) => {
    if (!mountedRef.current) return;
    if (!row) {
      setProfile(null);
      profileRef.current = null;
      return;
    }
    const vault = rowToVault(row);
    setProfile(vault);
    profileRef.current = vault;
  }, []);

  const syncIdleCoins = useCallback(
    async (base?: VaultProfile) => {
      const current = base ?? profileRef.current;
      if (!current) return;

      const { coins, last_coin_at, ticks } = accrueIdleCoins(
        current.coins,
        current.last_coin_at,
      );
      if (ticks === 0) return;

      await persistProfile({ ...current, coins, last_coin_at });
    },
    [persistProfile],
  );

  const subscribeRealtime = useCallback(
    async (userId: string) => {
      if (channelRef.current) {
        await supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      if (!mountedRef.current) return;

      channelRef.current = supabase
        .channel(`profile_${userId.slice(0, 8)}`)
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "profiles",
            filter: `id=eq.${userId}`,
          },
          (payload) => {
            if (mountedRef.current) {
              applyRow(payload.new as ProfileRow);
            }
          },
        )
        .subscribe();
    },
    [applyRow],
  );

  const loadProfile = useCallback(async () => {
    if (!mountedRef.current) return;
    setLoading(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        applyRow(null);
        return;
      }

      let { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error || !data) {
        applyRow(null);
        return;
      }

      const norm = normalizeProfile(data as ProfileRow);
      if (data.coins == null || data.stars == null || !data.last_coin_at) {
        const patch = buildProfilePatch(
          norm.coins,
          norm.stars,
          norm.last_coin_at,
        );
        await supabase.from("profiles").update(patch).eq("id", session.user.id);
        data = { ...data, ...patch };
      }

      applyRow(data as ProfileRow);
      const vault = rowToVault(data as ProfileRow);
      await syncIdleCoins(vault);
      await subscribeRealtime(session.user.id);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [applyRow, syncIdleCoins, subscribeRealtime]);

  useEffect(() => {
    let initial = true;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadProfile();
      } else {
        if (channelRef.current) {
          supabase.removeChannel(channelRef.current);
          channelRef.current = null;
        }
        if (!initial) {
          applyRow(null);
          setLoading(false);
        }
      }
      initial = false;
    });

    return () => {
      subscription.unsubscribe();
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [loadProfile, applyRow]);

  useEffect(() => {
    if (!profile) return;

    const tick = async () => {
      const current = profileRef.current;
      if (!current) return;
      const nextCoins = current.coins + COINS_PER_IDLE_TICK;
      const next = {
        ...current,
        coins: nextCoins,
        last_coin_at: new Date().toISOString(),
      };
      await persistProfile(next);
    };

    const interval = window.setInterval(tick, COIN_IDLE_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, [profile?.id, persistProfile]);

  const awardStars = useCallback(
    async (amount = 1) => {
      const current = profileRef.current;
      if (!current) return;
      await persistProfile({
        ...current,
        stars: current.stars + amount,
      });
    },
    [persistProfile],
  );

  // Theo dõi thời gian chơi game → thưởng sao
  const trackPlayTime = useCallback(
    (ms: number) => {
      // Reset nếu ngày mới
      const today = getTodayKey();
      let { playTimeMs, starsEarned } = playTimeRef.current;
      if (playTimeRef.current.date !== today) {
        playTimeMs = 0;
        starsEarned = 0;
      }

      playTimeMs += ms;
      let newStars = starsEarned;

      // Kiểm tra xem đạt mốc 1 giờ chưa
      while (
        playTimeMs >= PLAY_TIME_PER_STAR_MS &&
        newStars < MAX_STARS_PER_DAY
      ) {
        newStars += 1;
        playTimeMs -= PLAY_TIME_PER_STAR_MS;
        // Thưởng sao
        awardStars(1);
      }

      // Giới hạn playTimeMs không vượt quá ngưỡng chưa dùng
      if (newStars >= MAX_STARS_PER_DAY) {
        playTimeMs = 0;
      }

      playTimeRef.current = { playTimeMs, date: today, starsEarned: newStars };
      savePlayTimeData(playTimeMs, newStars);
    },
    [awardStars],
  );

  const rankDef = profile
    ? getRankDefinition(profile.rank)
    : getRankDefinition("bronze");

  const value = useMemo<ProfileContextValue>(
    () => ({
      profile,
      loading,
      isGuest: !profile && !loading,
      rankLabel: rankDef.label,
      rankIcon: rankDef.icon,
      awardStars,
      trackPlayTime,
      refreshProfile: loadProfile,
    }),
    [profile, loading, rankDef, awardStars, trackPlayTime, loadProfile],
  );

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within ProfileProvider");
  return ctx;
}

export { DEFAULT_COINS, DEFAULT_STARS };
