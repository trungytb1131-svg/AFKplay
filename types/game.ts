/**
 * Game type matching the `games` table in Supabase (supabase/games.sql).
 * Used across all components to ensure consistent data shape.
 */
export interface Game {
  id: string;
  slug: string;
  title: string;
  description: string;
  instructions: string;
  url: string;
  category_id: string;
  tags: string[];
  thumb: string;
  width: number;
  height: number;
  source: string;
  created_at?: string;
  updated_at?: string;

  // Computed fields (added by useGames hook)
  dSize?: string; // desktop grid size: "1x1" | "2x2" | "3x3"
  mSize?: string; // mobile grid size:  "1x1" | "2x2"
}
