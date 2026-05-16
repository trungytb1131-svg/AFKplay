"use client";

import { useEffect, useState } from "react";
import { LogOut, Star, User as UserIcon, Loader2, LogIn } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useProfile } from "@/contexts/ProfileContext";
import AnimatedCounter from "./AnimatedCounter";
import AfkCoinIcon from "./AfkCoinIcon";

const shellClass =
  "w-full h-full min-h-[calc((100vw-40px)/3)] lg:min-h-[calc((100vw-180px)/17)]";

export default function UserHeader() {
  const { profile, isGuest, rankLabel, rankIcon } = useProfile();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Chưa mount → Skeleton
  if (!mounted) {
    return (
      <div
        className={`${shellClass} bg-white/90 border-2 border-slate-100 rounded-[24px] lg:rounded-[28px] flex items-center justify-center animate-pulse p-3`}
      >
        <Loader2 className="animate-spin text-blue-400" size={16} />
      </div>
    );
  }

  // Guest Mode
  if (isGuest || !profile) {
    return (
      <div
        className={`${shellClass} bg-white border-2 border-slate-100 rounded-[24px] lg:rounded-[28px] shadow-lg flex items-center justify-between px-3`}
      >
        <div className="flex items-center gap-2">
          <div className="bg-slate-100 p-1.5 rounded-xl text-slate-400">
            <UserIcon size={16} />
          </div>
          <span className="text-[9px] font-black text-slate-900 uppercase italic">
            Guest Mode
          </span>
        </div>
        <button
          type="button"
          onClick={() => {
            window.location.href = "/vault";
          }}
          className="flex items-center gap-1 px-2.5 py-1 bg-blue-600 text-white rounded-full text-[8px] font-black uppercase hover:bg-blue-700 transition-all"
        >
          <LogIn size={11} /> Login
        </button>
      </div>
    );
  }

  // Đã đăng nhập: mobile layout ngang 2x1, desktop layout dọc
  return (
    <div
      className={`${shellClass} bg-white border-2 border-slate-100 rounded-[24px] lg:rounded-[28px] shadow-lg overflow-hidden`}
    >
      {/* Mobile: layout ngang gọn */}
      <div className="flex lg:hidden items-center h-full px-3 gap-2">
        {/* Tên + Rank */}
        <div className="flex-1 min-w-0 flex items-center gap-1.5">
          <span className="text-sm leading-none shrink-0" aria-hidden>
            {rankIcon}
          </span>
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase truncate leading-tight text-slate-900">
              {profile.username}
            </p>
            <span className="text-[8px] font-black uppercase tracking-wide text-amber-600">
              {rankLabel}
            </span>
          </div>
        </div>

        {/* Coins + Stars */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1">
            <AfkCoinIcon size={13} />
            <AnimatedCounter
              value={profile.coins}
              className="font-black text-slate-800 text-[9px] tabular-nums"
            />
          </div>
          <div className="flex items-center gap-1">
            <Star
              size={11}
              className="text-yellow-400"
              fill="#facc15"
              strokeWidth={0}
            />
            <AnimatedCounter
              value={profile.stars}
              className="font-black text-slate-800 text-[9px] tabular-nums"
            />
          </div>
        </div>

        {/* Logout */}
        <button
          type="button"
          onClick={() =>
            supabase.auth.signOut().then(() => window.location.reload())
          }
          className="shrink-0 p-1.5 bg-slate-100 hover:bg-red-500 hover:text-white text-slate-400 rounded-xl transition-all"
        >
          <LogOut size={11} />
        </button>
      </div>

      {/* Desktop: layout dọc đầy đủ */}
      <div className="hidden lg:flex flex-col h-full overflow-hidden">
        <div className="flex-1 min-h-0 px-3 pt-2.5 pb-2 border-b border-slate-100 flex flex-col justify-center items-start text-left w-full">
          <p className="text-[11px] lg:text-xs font-black uppercase truncate leading-tight text-slate-900 w-full">
            {profile.username}
          </p>
          <div className="mt-1 flex items-center gap-1">
            <span className="text-sm leading-none" aria-hidden>
              {rankIcon}
            </span>
            <span className="text-[9px] font-black uppercase tracking-wide text-amber-600">
              {rankLabel}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 shrink-0 border-b border-slate-100">
          <div className="flex items-center justify-center gap-1.5 py-2 border-r border-slate-100 bg-amber-50/40">
            <AfkCoinIcon size={16} />
            <AnimatedCounter
              value={profile.coins}
              className="font-black text-slate-800 text-[10px] lg:text-[11px] tabular-nums"
            />
          </div>
          <div className="flex items-center justify-center gap-1.5 py-2 bg-amber-50/20">
            <Star
              size={14}
              className="text-yellow-400 shrink-0 drop-shadow-sm"
              fill="#facc15"
              strokeWidth={0}
            />
            <AnimatedCounter
              value={profile.stars}
              className="font-black text-slate-800 text-[10px] lg:text-[11px] tabular-nums"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            supabase.auth.signOut().then(() => window.location.reload())
          }
          className="shrink-0 py-2 bg-slate-50 hover:bg-red-500 hover:text-white text-slate-400 transition-all flex items-center justify-center gap-1.5"
        >
          <LogOut size={12} />
          <span className="text-[8px] font-black uppercase">Logout</span>
        </button>
      </div>
    </div>
  );
}
