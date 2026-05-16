"use client";

import { useState, useEffect, useMemo } from "react";
import { Sparkles, Star, LogIn, User as UserIcon } from "lucide-react";
import { useProfile } from "@/contexts/ProfileContext";
import { useLeaderboard, getRankProgress } from "@/hooks/useLeaderboard";
import AnimatedCounter from "./AnimatedCounter";
import AfkCoinIcon from "./AfkCoinIcon";
import AvatarUpload from "./AvatarUpload";

const RANK_COLORS: Record<string, string> = {
  bronze: "from-amber-600 to-orange-400",
  silver: "from-slate-400 to-slate-200",
  gold: "from-yellow-400 to-amber-300",
  platinum: "from-cyan-400 to-blue-400",
  diamond: "from-violet-500 to-cyan-400",
  master: "from-red-500 to-pink-500",
};

const CROWN_ICONS = ["👑", "🥈", "🥉", "⭐"];

export default function PlayerHubWidget() {
  const { profile, isGuest, rankLabel, rankIcon } = useProfile();
  const [mounted, setMounted] = useState(false);
  const [fireworks, setFireworks] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [prevStars, setPrevStars] = useState(0);

  const rk = profile?.rank || "bronze";
  const rankColor = RANK_COLORS[rk] || RANK_COLORS.bronze;

  // ── Leaderboard thực từ Supabase ──
  const {
    rank,
    totalPlayers,
    topPlayers,
    refresh: refreshLeaderboard,
  } = useLeaderboard(profile?.stars ?? 0, profile?.coins ?? 0, !!profile);

  // ── Progress bar dựa trên rank tier ──
  const progress = useMemo(
    () => getRankProgress(rk, profile?.stars ?? 0),
    [rk, profile?.stars],
  );

  useEffect(() => {
    setMounted(true);
    if (profile?.avatar_url) setAvatarUrl(profile.avatar_url);
  }, [profile?.avatar_url]);

  // Fireworks + refresh leaderboard khi stars tăng
  useEffect(() => {
    if (profile?.stars && profile.stars > prevStars) {
      setFireworks(true);
      refreshLeaderboard();
      const t = setTimeout(() => setFireworks(false), 2000);
      setPrevStars(profile.stars);
      return () => clearTimeout(t);
    }
  }, [profile?.stars, prevStars, refreshLeaderboard]);

  // ── Loading ──
  if (!mounted) {
    return (
      <div className="w-full h-full bg-white/90 border-2 border-slate-100 rounded-[28px] flex items-center justify-center animate-pulse">
        <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ── Guest ──
  if (isGuest || !profile) {
    return (
      <div className="w-full h-full bg-white border-2 border-slate-100 rounded-[28px] shadow-lg flex items-center justify-center gap-3 px-4">
        <UserIcon size={20} className="text-slate-400" />
        <span className="text-[11px] font-black uppercase text-slate-500">
          Guest
        </span>
        <button
          onClick={() => window.dispatchEvent(new Event("open-login"))}
          className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-full text-[9px] font-black uppercase hover:bg-blue-700"
        >
          <LogIn size={12} /> Login
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full rounded-[28px] overflow-hidden">
      {/* Viền gradient rank */}
      <div
        className={`absolute inset-0 rounded-[28px] bg-gradient-to-r ${rankColor} animate-gradient-x`}
        style={{ padding: "2px" }}
      >
        <div className="w-full h-full rounded-[26px] bg-white" />
      </div>

      {/* Fireworks */}
      {fireworks && (
        <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
          <Sparkles
            size={48}
            className="text-yellow-400 animate-spin-slow opacity-60"
          />
        </div>
      )}

      <div className="relative z-10 h-full grid grid-cols-2 gap-4 px-5 py-3">
        {/* ===== LEFT ===== */}
        <div className="flex flex-col justify-between min-w-0">
          {/* Avatar + Name (dọc) */}
          <div className="flex flex-col items-start gap-1">
            <AvatarUpload
              currentUrl={avatarUrl}
              userId={profile.id}
              onUploaded={setAvatarUrl}
              size={34}
            />
            <span className="text-[10px] font-black uppercase text-slate-900 leading-tight w-full break-words">
              {profile.username}
            </span>
          </div>

          {/* Rank badge */}
          <span className="text-[9px] font-black px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 uppercase w-fit tracking-wide">
            {rankIcon} {rankLabel}
          </span>

          {/* Stars + Coins */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Star
                size={14}
                className="text-yellow-400"
                fill="#facc15"
                strokeWidth={0}
              />
              <AnimatedCounter
                value={profile.stars}
                className="font-black text-slate-800 text-[11px] tabular-nums"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <AfkCoinIcon size={14} />
              <AnimatedCounter
                value={profile.coins}
                className="font-black text-slate-800 text-[11px] tabular-nums"
              />
            </div>
          </div>

          {/* Rank # + Progress bar */}
          <div className="space-y-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[10px] font-black text-slate-800 tabular-nums">
                #{rank ?? "--"}
              </span>
              <span className="text-[8px] text-slate-400 font-semibold uppercase tracking-wide">
                of {totalPlayers}
              </span>
              {fireworks && (
                <span className="text-[10px] text-green-500 animate-bounce">
                  ▲
                </span>
              )}
            </div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${rankColor} transition-all duration-1000`}
                style={{ width: `${progress.progressPct}%` }}
              />
            </div>
            <span className="text-[7px] text-slate-400 font-semibold uppercase tracking-wide">
              {progress.progressPct < 100
                ? `${Math.round(progress.progressPct)}% to ${progress.nextLabel}`
                : "Max Rank"}
            </span>
          </div>
        </div>

        {/* ===== RIGHT: Top Zone ===== */}
        <div className="flex flex-col justify-between border-l-2 border-slate-100 pl-4 min-w-0">
          <span className="text-[10px] font-black uppercase text-slate-700 tracking-widest">
            Top Zone
          </span>
          {topPlayers.map((p, i) => (
            <div key={i} className="flex items-center gap-2 group relative">
              <span className="text-[13px] shrink-0">
                {CROWN_ICONS[i] ?? "⭐"}
              </span>
              <span className="text-[9px] font-bold text-slate-700 truncate flex-1">
                {p.username}
              </span>
              <span className="text-[8px] font-bold text-slate-400 tabular-nums shrink-0">
                {p.stars}
              </span>
              {/* Tooltip */}
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 -translate-y-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                <div className="bg-slate-900 text-white rounded-lg px-2.5 py-1.5 text-[9px] whitespace-nowrap shadow-xl">
                  <div className="font-bold">
                    {CROWN_ICONS[i] ?? "⭐"} {p.username}
                  </div>
                  <div className="text-white/70">
                    ⭐ {p.stars.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {topPlayers.length === 0 && (
            <span className="text-[8px] text-slate-400 italic">Loading...</span>
          )}
        </div>
      </div>
    </div>
  );
}
