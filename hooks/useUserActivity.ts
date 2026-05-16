"use client";

import { useActivity } from "@/contexts/ActivityContext";

/** API tương thích với các component cũ, đảm bảo luôn trả về mảng an toàn */
export function useUserActivity() {
  const ctx = useActivity();

  return {
    // FIX 5: Đảm bảo activities/favorites luôn là mảng, hỗ trợ optimistic UI
    activities: ctx.favorites || [],
    favorites: ctx.favorites || [],
    loading: ctx.loading,
    trackActivity: ctx.trackActivity,
    toggleFavorite: ctx.toggleFavorite,
    trackPlay: ctx.trackPlay,
  };
}
