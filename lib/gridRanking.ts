import type { Game } from "@/types/game";
import { GRID_SLOTS, PIN_MAP, BATCH3_MOBILE_2X2, type GridSlot } from "@/data/grid-slots";

export interface RankedSlot {
  slot: GridSlot;
  game: Game | null;
}

/** Sắp xếp game theo play_count ↓, play_time ↓ */
function sortByPopularity(games: Game[]): Game[] {
  return [...games].sort((a, b) => {
    const ac = (a as any).play_count ?? 0;
    const bc = (b as any).play_count ?? 0;
    if (bc !== ac) return bc - ac;
    const at = (a as any).play_time ?? 0;
    const bt = (b as any).play_time ?? 0;
    return bt - at;
  });
}

export function rankGamesIntoLots(
  allGames: Game[],
  sidebarSlugs: Set<string>,
): RankedSlot[] {
  const mainGames = allGames.filter((g) => !sidebarSlugs.has(g.slug));
  const ranked = sortByPopularity(mainGames);

  // Build pin map
  const pinnedGames = new Map<number, Game>();
  const used = new Set<string>();
  for (const [sn, slug] of Object.entries(PIN_MAP)) {
    const g = ranked.find((x) => x.slug === slug);
    if (g) { pinnedGames.set(Number(sn), g); used.add(slug); }
  }

  const remaining = ranked.filter((g) => !used.has(g.slug));
  let ri = 0;
  const result: RankedSlot[] = [];

  for (const slot of GRID_SLOTS) {
    const pinned = pinnedGames.get(slot.num);
    if (pinned) {
      result.push({
        slot: { ...slot, mSize: BATCH3_MOBILE_2X2.has(pinned.slug) ? "2x2" : "1x1" },
        game: pinned,
      });
      continue;
    }
    if (ri < remaining.length) {
      const g = remaining[ri++];
      result.push({
        slot: { ...slot, mSize: BATCH3_MOBILE_2X2.has(g.slug) ? "2x2" : "1x1" },
        game: g,
      });
    } else {
      result.push({ slot, game: null });
    }
  }
  return result;
}
