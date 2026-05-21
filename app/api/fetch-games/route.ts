import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// ── Rate limiter (in-memory, reset khi server restart) ──
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60_000; // 1 phút
const RATE_LIMIT_MAX = 3; // tối đa 3 lần/phút

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

// ── Category mapping ──
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  clicker: ["clicker", "click", "tap", "idle clicker"],
  puzzle: ["puzzle", "match 3", "match-3", "brain", "jigsaw", "sudoku", "word"],
  action: ["action", "fighting", "fight", "battle", "combat", "arcade"],
  racing: ["racing", "race", "car racing", "bike racing", "motor"],
  shooting: ["shooting", "shooter", "shoot", "gun", "fps", "sniper"],
  adventure: ["adventure", "explore", "quest", "rpg"],
  sports: [
    "sports",
    "sport",
    "soccer",
    "football",
    "basketball",
    "baseball",
    "tennis",
    "golf",
  ],
  cooking: ["cooking", "cook", "food", "kitchen", "bake", "restaurant"],
  zombie: ["zombie", "undead", "apocalypse"],
  "2-player": ["2 player", "2player", "two player", "2-players"],
  "dress-up": [
    "dress up",
    "dress-up",
    "dressup",
    "makeup",
    "make up",
    "fashion",
  ],
  driving: ["driving", "drive", "parking", "park"],
  skill: ["skill", "reflex", "timing"],
  horror: ["horror", "scary", "creepy", "spooky"],
  board: ["board", "chess", "checkers", "card", "domino", "mahjong"],
  simulation: ["simulation", "simulator", "sim", "tycoon", "management"],
  strategy: ["strategy", "tower defense", "td", "defense", "tactics"],
  funny: ["funny", "fun", "humor", "comedy", "joke"],
  multiplayer: ["multiplayer", "multi player", "multi-player", "online", "pvp"],
  girls: ["girls", "girl", "princess", "fashion", "cute", "doll"],
  car: ["car", "cars", "vehicle", "truck", "bus"],
  io: [".io", "io game", "io games", "agar", "slither"],
  logic: ["logic", "brain", "thinking", "math", "quiz", "trivia"],
  escape: ["escape", "escape room", "room escape"],
  idle: ["idle", "incremental", "idle game"],
  classic: ["classic", "retro", "old school", "snake", "tetris"],
  physics: ["physics", "physic", "gravity", "ragdoll"],
  "world-war": ["war", "world war", "military", "army", "soldier", "tank"],
};

const AUTO_FEATURED = ["idle", "clicker", "incremental", "upgrade"];

// ── Helpers ──
function mapCategory(category: string, tags: string): string {
  const cat = category.toLowerCase().trim();
  const tagStr = tags.toLowerCase().trim();

  for (const [slug, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((kw) => cat.includes(kw) || kw.includes(cat)))
      return slug;
  }
  for (const [slug, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((kw) => tagStr.includes(kw))) return slug;
  }
  return "action";
}

function isAutoFeatured(categoryId: string): boolean {
  return AUTO_FEATURED.includes(categoryId.toLowerCase());
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ── Feed item type ──
interface GMItem {
  id: string;
  title: string;
  description: string;
  instructions: string;
  url: string;
  category: string;
  tags: string;
  thumb: string;
  width: string;
  height: string;
}

const FEED_URL =
  "https://rss.gamemonetize.com/rssfeed.php?format=json&type=html5&popularity=newest&amount=1500";

export async function POST(req: Request) {
  // ── Auth check ──
  const secret = new URL(req.url).searchParams.get("key");
  const valid = process.env.ADMIN_SECRET_KEY;
  if (!valid) {
    return NextResponse.json(
      { error: "ADMIN_SECRET_KEY not configured" },
      { status: 500 },
    );
  }
  if (secret !== valid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ── Rate limit: 3 lần/phút ──
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Try again later." },
      { status: 429 },
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json(
      {
        error: "Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL",
      },
      { status: 500 },
    );
  }

  const admin = createClient(supabaseUrl, serviceKey);

  try {
    // 1. Fetch từ GameMonetize
    console.log(`📡 Fetching ${FEED_URL}`);
    const res = await fetch(FEED_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data: GMItem[] = await res.json();
    console.log(`✅ Received ${data.length} games`);

    // 2. Map + deduplicate
    const seen = new Set<string>();
    const games = [];

    for (const item of data) {
      if (seen.has(item.id)) continue;
      seen.add(item.id);

      const categoryId = mapCategory(item.category, item.tags);
      games.push({
        id: item.id,
        slug: slugify(item.title) + "-" + item.id,
        title: item.title,
        description: item.description || "",
        instructions: item.instructions || "",
        url: item.url,
        category_id: categoryId,
        tags: item.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        thumb: item.thumb || "",
        width: parseInt(item.width, 10) || 800,
        height: parseInt(item.height, 10) || 600,
        source: "gamemonetize",
        featured: isAutoFeatured(categoryId),
      });
    }

    const featuredCount = games.filter((g) => g.featured).length;
    console.log(
      `⭐ Featured: ${featuredCount} | Rest: ${games.length - featuredCount}`,
    );

    // 3. Upsert batch 100
    let inserted = 0;
    const BATCH = 100;
    for (let i = 0; i < games.length; i += BATCH) {
      const batch = games.slice(i, i + BATCH);
      const { error } = await admin
        .from("games")
        .upsert(batch, { onConflict: "id" });
      if (error) {
        console.error(`❌ Batch ${i / BATCH + 1} error:`, error.message);
        return NextResponse.json(
          { error: error.message, inserted },
          { status: 500 },
        );
      }
      inserted += batch.length;
    }

    return NextResponse.json({
      success: true,
      total: data.length,
      afterDedup: games.length,
      inserted,
      featured: featuredCount,
    });
  } catch (err: any) {
    console.error("❌ fetch-games error:", err);
    return NextResponse.json(
      { error: err.message || "Unknown error" },
      { status: 500 },
    );
  }
}
