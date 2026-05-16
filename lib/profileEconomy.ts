import { computeRankId, type RankId } from "./ranks";

export const DEFAULT_COINS = 100;
export const DEFAULT_STARS = 5;
export const COIN_IDLE_INTERVAL_MS = 6 * 60 * 1000;
export const COINS_PER_IDLE_TICK = 1;

export type ProfileRow = {
  id: string;
  username?: string | null;
  email?: string | null;
  coins?: number | null;
  stars?: number | null;
  rank?: string | null;
  last_coin_at?: string | null;
  recent_activities?: string[] | null;
  created_at?: string | null;
  avatar_url?: string | null;
};

export function normalizeProfile(row: ProfileRow): {
  coins: number;
  stars: number;
  rank: RankId;
  last_coin_at: string;
} {
  const coins = row.coins ?? DEFAULT_COINS;
  const stars = row.stars ?? DEFAULT_STARS;
  const rank = (row.rank as RankId) || computeRankId(coins, stars);
  const last_coin_at =
    row.last_coin_at ?? row.created_at ?? new Date().toISOString();
  return { coins, stars, rank, last_coin_at };
}

/** Tính coin nhận được khi quay lại sau khi idle */
export function accrueIdleCoins(
  coins: number,
  lastCoinAtIso: string,
  nowMs = Date.now(),
): { coins: number; last_coin_at: string; ticks: number } {
  const lastMs = new Date(lastCoinAtIso).getTime();
  if (Number.isNaN(lastMs)) {
    return { coins, last_coin_at: new Date(nowMs).toISOString(), ticks: 0 };
  }

  const elapsed = Math.max(0, nowMs - lastMs);
  const ticks = Math.floor(elapsed / COIN_IDLE_INTERVAL_MS);
  if (ticks <= 0) {
    return { coins, last_coin_at: lastCoinAtIso, ticks: 0 };
  }

  return {
    coins: coins + ticks * COINS_PER_IDLE_TICK,
    last_coin_at: new Date(
      lastMs + ticks * COIN_IDLE_INTERVAL_MS,
    ).toISOString(),
    ticks,
  };
}

export function buildProfilePatch(
  coins: number,
  stars: number,
  last_coin_at: string,
): { coins: number; stars: number; rank: RankId; last_coin_at: string } {
  return {
    coins,
    stars,
    rank: computeRankId(coins, stars),
    last_coin_at,
  };
}
