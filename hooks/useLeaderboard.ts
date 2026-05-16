"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";

export type TopPlayer = {
  username: string;
  stars: number;
  avatar_url?: string | null;
};

type LeaderboardData = {
  rank: number | null;
  totalPlayers: number;
  topPlayers: TopPlayer[];
  loading: boolean;
  refresh: () => void;
};

export function useLeaderboard(
  stars: number,
  coins: number,
  enabled: boolean,
): LeaderboardData {
  const [rank, setRank] = useState<number | null>(null);
  const [totalPlayers, setTotalPlayers] = useState(0);
  const [topPlayers, setTopPlayers] = useState<TopPlayer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = useCallback(async () => {
    if (!enabled) {
      setRank(null);
      setTotalPlayers(0);
      setTopPlayers([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { count: total } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });
      if (total !== null) setTotalPlayers(total);

      const { count: higherStars } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .gt("stars", stars);

      const { count: sameStarsHigherCoins } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("stars", stars)
        .gt("coins", coins);

      const above = (higherStars ?? 0) + (sameStarsHigherCoins ?? 0);
      setRank(above + 1);

      const { data: top } = await supabase
        .from("profiles")
        .select("username, stars, avatar_url")
        .order("stars", { ascending: false })
        .order("coins", { ascending: false })
        .limit(4);

      if (top) {
        setTopPlayers(
          top.map((p: any) => ({
            username: p.username || "Player",
            stars: p.stars ?? 0,
            avatar_url: p.avatar_url,
          })),
        );
      }
    } catch (err) {
      console.error("useLeaderboard error:", err);
    } finally {
      setLoading(false);
    }
  }, [enabled, stars, coins]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  return { rank, totalPlayers, topPlayers, loading, refresh: fetchLeaderboard };
}

export function getRankProgress(
  currentRank: string,
  stars: number,
): { progressPct: number; nextLabel: string } {
  const TIERS = [
    { id: "bronze", minStars: 5 },
    { id: "silver", minStars: 20 },
    { id: "gold", minStars: 50 },
    { id: "platinum", minStars: 100 },
    { id: "diamond", minStars: 250 },
  ];
  const idx = TIERS.findIndex((t) => t.id === currentRank);
  const cur = TIERS[idx] ?? TIERS[0];
  const nxt = TIERS[idx + 1] ?? null;
  if (!nxt) return { progressPct: 100, nextLabel: "Max" };
  const pct = Math.min(100, Math.max(0,
    ((stars - cur.minStars) / (nxt.minStars - cur.minStars)) * 100,
  ));
  return { progressPct: pct, nextLabel: nxt.id };
}
