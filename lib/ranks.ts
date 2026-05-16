export type RankId = "bronze" | "silver" | "gold" | "platinum" | "diamond";

export type RankDefinition = {
  id: RankId;
  label: string;
  icon: string;
  minCoins: number;
  minStars: number;
};

export const RANK_TIERS: RankDefinition[] = [
  { id: "bronze", label: "Bronze", icon: "🥉", minCoins: 100, minStars: 5 },
  { id: "silver", label: "Silver", icon: "🥈", minCoins: 500, minStars: 20 },
  { id: "gold", label: "Gold", icon: "🥇", minCoins: 2000, minStars: 50 },
  { id: "platinum", label: "Platinum", icon: "💎", minCoins: 5000, minStars: 100 },
  { id: "diamond", label: "Diamond", icon: "👑", minCoins: 10000, minStars: 250 },
];

export function computeRankId(coins: number, stars: number): RankId {
  let rank: RankId = "bronze";
  for (const tier of RANK_TIERS) {
    if (coins >= tier.minCoins && stars >= tier.minStars) {
      rank = tier.id;
    }
  }
  return rank;
}

export function getRankDefinition(rankId: RankId): RankDefinition {
  return RANK_TIERS.find((t) => t.id === rankId) ?? RANK_TIERS[0];
}
