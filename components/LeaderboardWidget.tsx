"use client";

import { useState, useEffect } from "react";
import { Crown, Sparkles } from "lucide-react";
import { useProfile } from "@/contexts/ProfileContext";

const MOCK_LEADERBOARD = [
  { username: "DragonSlayer", stars: 2840, coins: 150000, avatar: "🐉" },
  { username: "ShadowQueen", stars: 2720, coins: 132000, avatar: "👑" },
  { username: "PixelWarrior", stars: 2680, coins: 128000, avatar: "⚔️" },
];

const RANK_COLORS: Record<string, string> = {
  bronze: "from-amber-600 to-orange-400",
  silver: "from-slate-300 to-slate-100",
  gold: "from-yellow-400 to-amber-300",
  platinum: "from-cyan-400 to-blue-400",
  diamond: "from-violet-500 to-cyan-400",
  master: "from-red-500 to-pink-500",
};

export default function LeaderboardWidget() {
  const { profile } = useProfile();
  const rk = profile?.rank || "bronze";
  const rankColor = RANK_COLORS[rk] || RANK_COLORS.bronze;
  const [fireworks, setFireworks] = useState(false);
  const [displayRank, setDisplayRank] = useState(142);
  const nextMilestone = 100;
  const starsNeeded = Math.max(0, nextMilestone - (profile?.stars || 0));

  useEffect(() => {
    if (profile?.stars && profile.stars > 0) {
      setFireworks(true);
      setDisplayRank((p) => Math.max(1, p - Math.floor(Math.random() * 10)));
      const t = setTimeout(() => setFireworks(false), 2000);
      return () => clearTimeout(t);
    }
  }, [profile?.stars]);

  return (
    <div
      onClick={() =>
        window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
      }
      className="relative w-full h-full rounded-[24px] lg:rounded-[28px] overflow-hidden cursor-pointer group"
    >
      {/* LED border */}
      <div
        className={`absolute inset-0 rounded-[24px] lg:rounded-[28px] bg-gradient-to-r ${rankColor} opacity-60 animate-gradient-x`}
        style={{ padding: "2px" }}
      >
        <div className="w-full h-full rounded-[22px] lg:rounded-[26px] bg-white/80 backdrop-blur-xl" />
      </div>

      {/* Fireworks */}
      {fireworks && (
        <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
          <Sparkles
            size={32}
            className="text-yellow-400 animate-spin-slow opacity-80"
          />
        </div>
      )}

      {/* Content: 2 tầng */}
      <div className="relative z-10 h-full flex flex-col justify-center px-4 gap-0.5">
        {/* Tầng trên: Podium + Rank + Progress */}
        <div className="flex items-center gap-3">
          {/* Mini Podium */}
          <div className="flex items-end gap-0.5 shrink-0">
            {[1, 0, 2].map((i) => {
              const p = MOCK_LEADERBOARD[i];
              const isGold = i === 0;
              return (
                <div key={i} className="flex flex-col items-center">
                  <Crown
                    size={8}
                    className={
                      isGold
                        ? "text-yellow-400"
                        : i === 1
                          ? "text-slate-300"
                          : "text-amber-600"
                    }
                  />
                  <div
                    className={`rounded-full bg-slate-200 flex items-center justify-center font-bold ring-1 ring-white ${isGold ? "w-5 h-5 text-[10px]" : "w-4 h-4 text-[7px]"}`}
                  >
                    {p.avatar}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Rank */}
          <div className="flex items-baseline gap-1 shrink-0">
            <span className="text-[8px] font-black uppercase text-slate-400">
              Rank
            </span>
            <span className="text-sm font-black text-slate-800 tabular-nums">
              #{displayRank}
            </span>
            {fireworks && (
              <span className="text-[9px] text-green-500 animate-bounce">
                ▲
              </span>
            )}
          </div>

          {/* Progress bar */}
          <div className="flex-1 min-w-0">
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${rankColor} transition-all duration-1000`}
                style={{
                  width: `${Math.min(100, 100 - (starsNeeded / nextMilestone) * 100)}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Tầng dưới: Text động viên */}
        <p className="text-[7px] text-slate-400 font-medium truncate pl-[52px]">
          {starsNeeded > 0
            ? `Need ${starsNeeded} ⭐ to reach Top ${nextMilestone}`
            : "You're in the Top 100! 🎉"}
        </p>
      </div>
    </div>
  );
}
