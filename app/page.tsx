import { createClient } from "@supabase/supabase-js";
import type { Game } from "@/types/game";
import HomePageClient from "./HomePageClient";

export const revalidate = 300;

async function fetchGamesServer(): Promise<Game[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || "";
  if (!url || !key) return [];

  const supabase = createClient(url, key);
  const all: Game[] = [];
  let page = 0;
  const size = 500;

  while (true) {
    const { data, error } = await supabase
      .from("games")
      .select("*")
      .range(page * size, (page + 1) * size - 1)
      .order("created_at", { ascending: false });
    if (error || !data?.length) break;
    all.push(...(data as Game[]));
    if (data.length < size) break;
    page++;
  }
  return all;
}

export default async function HomePage() {
  const initialGames = await fetchGamesServer().catch(() => [] as Game[]);

  return <HomePageClient initialGames={initialGames} />;
}
