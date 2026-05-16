/**
 * DEPRECATED: `ALL_GAMES` mock data đã được thay thế bởi `useGames()` hook.
 *
 * File này được giữ lại để tránh lỗi import ở những component chưa migrate.
 * Các component mới nên dùng:
 *   import { useGames } from "@/hooks/useGames";
 *
 * Mock data giữ lại làm fallback khi Supabase chưa có dữ liệu.
 */

export interface MockGame {
  id: string;
  slug: string;
  title: string;
  image: string;
  videoUrl: string;
  dSize: string;
  mSize: string;
}

export const ALL_GAMES: MockGame[] = Array.from({ length: 100 }).map((_, i) => {
  let dSize = "1x1";
  let mSize = "1x1";

  if (i % 15 === 0 && i < 90) dSize = "3x3";
  else if (i % 4 === 0 && i < 60) dSize = "2x2";
  if (i > 0 && i % 8 === 0) mSize = "2x2";

  return {
    id: `game-${i}`,
    slug: `game-${i}`,
    title: `Game ${i}`,
    image: `/images/games/game-${i}.jpg`,
    videoUrl: `/videos/previews/game-${i}.mp4`,
    dSize,
    mSize,
  };
});
