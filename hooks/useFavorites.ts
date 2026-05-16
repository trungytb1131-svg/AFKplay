"use client";

import { useActivity } from "@/contexts/ActivityContext";

export function useFavorites() {
  const { favorites, toggleFavorite, loading } = useActivity();
  return { favorites, toggleFavorite, loading };
}
