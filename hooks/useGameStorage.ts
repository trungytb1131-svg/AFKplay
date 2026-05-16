"use client";

import { useActivity } from "@/contexts/ActivityContext";

export function useGameStorage() {
  const { favorites, toggleFavorite, trackPlay } = useActivity();

  return {
    favorites,
    recentGames: favorites,
    toggleFavorite,
    addRecent: trackPlay,
  };
}
