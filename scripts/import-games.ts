/**
 * scripts/import-games.ts
 *
 * Script gộp 2 nguồn GameMonetize JSON Feed (Clicker + Hypercasual),
 * loại bỏ trùng lặp, ánh xạ danh mục, và đẩy vào bảng `games` trong Supabase.
 *
 * Cách chạy:
 *   npx tsx scripts/import-games.ts
 *
 * Yêu cầu trước khi chạy:
 *   1. File .env.local phải có NEXT_PUBLIC_SUPABASE_URL và NEXT_PUBLIC_SUPABASE_ANON_KEY
 *   2. Bảng `games` phải tồn tại trong Supabase (xem SQL mẫu trong supabase/games.sql)
 */

import { createClient } from "@supabase/supabase-js";
import * as fs from "node:fs";
import * as path from "node:path";

// ──────────────────────────────────────────────
// 0. CẤU HÌNH NGUỒN FEED (SỬA TẠI ĐÂY)
// ──────────────────────────────────────────────

const FEED_URLS: { url: string; label: string }[] = [
  {
    // Link 1: Clicker (category=8)
    url: "https://gamemonetize.com/feed.php?format=0&category=8&num=50&page=1",
    label: "Clicker (category=8)",
  },
  {
    // Link 2: Hypercasual – THAY ĐỔI URL NÀY nếu cần
    // Nếu chưa có link Hypercasual, script vẫn chạy được với 1 link.
    url: "https://gamemonetize.com/feed.php?format=0&category=11&num=50&page=1", // ← DÁN LINK HYPERCASUAL VÀO ĐÂY
    label: "Hypercasual",
  },
];

// ──────────────────────────────────────────────
// 1. LOAD ENV TỪ .env.local
// ──────────────────────────────────────────────

function loadEnvLocal(): Record<string, string> {
  const envPath = path.resolve(__dirname, "..", ".env.local");
  if (!fs.existsSync(envPath)) {
    console.error("❌ Không tìm thấy .env.local tại:", envPath);
    process.exit(1);
  }
  const content = fs.readFileSync(envPath, "utf-8");
  const env: Record<string, string> = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const value = trimmed.slice(eqIdx + 1).trim();
    env[key] = value;
  }
  return env;
}

const env = loadEnvLocal();
const supabaseUrl = env["NEXT_PUBLIC_SUPABASE_URL"] || "";

// Ưu tiên service_role key để bypass RLS khi upsert
const serviceRoleKey = env["SUPABASE_SERVICE_ROLE_KEY"] || "";
const anonKey = env["NEXT_PUBLIC_SUPABASE_ANON_KEY"] || "";

if (!supabaseUrl) {
  console.error("❌ Thiếu NEXT_PUBLIC_SUPABASE_URL trong .env.local");
  process.exit(1);
}

if (!serviceRoleKey) {
  console.warn(
    "⚠️  Không tìm thấy SUPABASE_SERVICE_ROLE_KEY trong .env.local.\n" +
      "   Sẽ dùng anon key — có thể bị RLS chặn INSERT/UPDATE.\n" +
      "   Thêm SUPABASE_SERVICE_ROLE_KEY vào .env.local để script hoạt động.",
  );
  if (!anonKey) {
    console.error(
      "❌ Thiếu cả SUPABASE_SERVICE_ROLE_KEY lẫn NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
    process.exit(1);
  }
}

const supabase = createClient(supabaseUrl, serviceRoleKey || anonKey);

// ──────────────────────────────────────────────
// 2. ĐỊNH NGHĨA KIỂU DỮ LIỆU
// ──────────────────────────────────────────────

interface GameMonetizeItem {
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

interface GameRecord {
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
}

// ──────────────────────────────────────────────
// 3. BẢNG ÁNH XẠ DANH MỤC (CATEGORY MAPPING)
// ──────────────────────────────────────────────

/**
 * Bảng ánh xạ từ category slug của dự án → mảng từ khóa khớp với
 * category / tags từ GameMonetize (so khớp case-insensitive, contains).
 *
 * Thứ tự ưu tiên: khớp chính xác category trước, sau đó đến tags.
 * Nếu không khớp gì → mặc định "action".
 */
const CATEGORY_KEYWORD_MAP: { slug: string; keywords: string[] }[] = [
  { slug: "clicker", keywords: ["clicker", "click", "tap", "idle clicker"] },
  {
    slug: "puzzle",
    keywords: [
      "puzzle",
      "match 3",
      "match-3",
      "brain",
      "jigsaw",
      "sudoku",
      "word",
    ],
  },
  {
    slug: "action",
    keywords: ["action", "fighting", "fight", "battle", "combat"],
  },
  {
    slug: "racing",
    keywords: ["racing", "race", "car racing", "bike racing", "motor"],
  },
  {
    slug: "shooting",
    keywords: ["shooting", "shooter", "shoot", "gun", "fps", "sniper"],
  },
  { slug: "adventure", keywords: ["adventure", "explore", "quest", "rpg"] },
  {
    slug: "sports",
    keywords: [
      "sports",
      "sport",
      "soccer",
      "football",
      "basketball",
      "baseball",
      "tennis",
      "golf",
    ],
  },
  {
    slug: "cooking",
    keywords: ["cooking", "cook", "food", "kitchen", "bake", "restaurant"],
  },
  { slug: "zombie", keywords: ["zombie", "undead", "apocalypse"] },
  {
    slug: "2-player",
    keywords: ["2 player", "2player", "two player", "2-players"],
  },
  {
    slug: "dress-up",
    keywords: [
      "dress up",
      "dress-up",
      "dressup",
      "makeup",
      "make up",
      "fashion",
    ],
  },
  { slug: "driving", keywords: ["driving", "drive", "parking", "park"] },
  { slug: "skill", keywords: ["skill", "arcade", "reflex", "timing"] },
  { slug: "horror", keywords: ["horror", "scary", "creepy", "spooky"] },
  {
    slug: "board",
    keywords: ["board", "chess", "checkers", "card", "domino", "mahjong"],
  },
  {
    slug: "simulation",
    keywords: ["simulation", "simulator", "sim", "tycoon", "management"],
  },
  {
    slug: "strategy",
    keywords: ["strategy", "tower defense", "td", "defense", "tactics"],
  },
  { slug: "funny", keywords: ["funny", "fun", "humor", "comedy", "joke"] },
  {
    slug: "multiplayer",
    keywords: ["multiplayer", "multi player", "multi-player", "online", "pvp"],
  },
  {
    slug: "girls",
    keywords: ["girls", "girl", "princess", "fashion", "cute", "doll"],
  },
  { slug: "car", keywords: ["car", "cars", "vehicle", "truck", "bus"] },
  { slug: "io", keywords: [".io", "io game", "io games", "agar", "slither"] },
  {
    slug: "logic",
    keywords: ["logic", "brain", "thinking", "math", "quiz", "trivia"],
  },
  { slug: "escape", keywords: ["escape", "escape room", "room escape"] },
  { slug: "idle", keywords: ["idle", "incremental", "idle game"] },
  {
    slug: "classic",
    keywords: ["classic", "retro", "arcade", "old school", "snake", "tetris"],
  },
  { slug: "physics", keywords: ["physics", "physic", "gravity", "ragdoll"] },
  {
    slug: "world-war",
    keywords: ["war", "world war", "military", "army", "soldier", "tank"],
  },
];

const DEFAULT_CATEGORY = "action";

/**
 * Ánh xạ 1 game từ GameMonetize → category slug của dự án.
 * Ưu tiên: khớp chính xác category → khớp chứa trong tags → default.
 */
function mapCategory(item: GameMonetizeItem): string {
  const catLower = item.category.toLowerCase().trim();
  const tagsLower = item.tags.toLowerCase().trim();

  for (const mapping of CATEGORY_KEYWORD_MAP) {
    // Khớp category trước
    if (
      mapping.keywords.some(
        (kw) => catLower.includes(kw) || kw.includes(catLower),
      )
    ) {
      return mapping.slug;
    }
  }

  // Sau đó khớp tags
  for (const mapping of CATEGORY_KEYWORD_MAP) {
    if (mapping.keywords.some((kw) => tagsLower.includes(kw))) {
      return mapping.slug;
    }
  }

  return DEFAULT_CATEGORY;
}

// ──────────────────────────────────────────────
// 4. TẠO SLUG TỪ TITLE
// ──────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ──────────────────────────────────────────────
// 5. FETCH JSON FEED
// ──────────────────────────────────────────────

async function fetchFeed(
  url: string,
  label: string,
): Promise<GameMonetizeItem[]> {
  console.log(`📡 Đang fetch: ${label} → ${url}`);
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    console.error(`   ❌ HTTP ${res.status} ${res.statusText} cho ${label}`);
    return [];
  }
  const text = await res.text();
  try {
    const data = JSON.parse(text) as GameMonetizeItem[];
    console.log(`   ✅ Nhận được ${data.length} game từ ${label}`);
    return data;
  } catch {
    console.error(`   ❌ Không parse được JSON từ ${label}`);
    return [];
  }
}

// ──────────────────────────────────────────────
// 6. GỘP, LOẠI TRÙNG, ÁNH XẠ
// ──────────────────────────────────────────────

function mergeAndDeduplicate(
  feeds: { items: GameMonetizeItem[]; label: string }[],
): GameRecord[] {
  const seen = new Map<string, GameRecord>();

  for (const feed of feeds) {
    for (const item of feed.items) {
      if (seen.has(item.id)) {
        console.log(
          `   🔄 Bỏ trùng: "${item.title}" (ID ${item.id}) từ ${feed.label}`,
        );
        continue;
      }

      const categoryId = mapCategory(item);
      const slug = slugify(item.title) + "-" + item.id;

      seen.set(item.id, {
        id: item.id,
        slug,
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
      });
    }
  }

  return Array.from(seen.values());
}

// ──────────────────────────────────────────────
// 7. UPSERT VÀO SUPABASE
// ──────────────────────────────────────────────

async function upsertGames(
  games: GameRecord[],
): Promise<{ inserted: number; errors: number }> {
  let inserted = 0;
  let errors = 0;

  // Chia nhỏ batch 50 game / lần để tránh payload quá lớn
  const BATCH_SIZE = 50;
  const batches: GameRecord[][] = [];
  for (let i = 0; i < games.length; i += BATCH_SIZE) {
    batches.push(games.slice(i, i + BATCH_SIZE));
  }

  console.log(
    `\n📤 Đang upsert ${games.length} game vào Supabase (${batches.length} batch)...`,
  );

  for (let b = 0; b < batches.length; b++) {
    const batch = batches[b];
    console.log(`   Batch ${b + 1}/${batches.length}: ${batch.length} game...`);

    const { error } = await supabase
      .from("games")
      .upsert(batch, { onConflict: "id", ignoreDuplicates: false });

    if (error) {
      console.error(`   ❌ Batch ${b + 1} lỗi:`, error.message);
      errors += batch.length;
    } else {
      inserted += batch.length;
      console.log(`   ✅ Batch ${b + 1} thành công (${batch.length} game)`);
    }
  }

  return { inserted, errors };
}

// ──────────────────────────────────────────────
// 8. MAIN
// ──────────────────────────────────────────────

async function main() {
  console.log("═══════════════════════════════════════════");
  console.log("  🎮 GameMonetize → Supabase Importer");
  console.log("═══════════════════════════════════════════\n");

  // Lọc bỏ URL rỗng
  const activeFeeds = FEED_URLS.filter((f) => f.url.trim() !== "");
  if (activeFeeds.length === 0) {
    console.error(
      "❌ Không có feed URL nào được cấu hình. Hãy dán link vào FEED_URLS.",
    );
    process.exit(1);
  }

  // Bước 1: Fetch tất cả feed song song
  console.log("─── Bước 1: Fetch dữ liệu ───");
  const feedResults = await Promise.all(
    activeFeeds.map(async (f) => ({
      items: await fetchFeed(f.url, f.label),
      label: f.label,
    })),
  );

  const totalRaw = feedResults.reduce((sum, f) => sum + f.items.length, 0);
  console.log(`\n📊 Tổng game thô (trước khi lọc trùng): ${totalRaw}`);

  // Bước 2: Gộp & loại trùng
  console.log("\n─── Bước 2: Gộp & loại trùng + ánh xạ danh mục ───");
  const games = mergeAndDeduplicate(feedResults);
  console.log(`📊 Tổng game sau lọc trùng: ${games.length}`);

  // In thống kê danh mục
  const catStats = new Map<string, number>();
  for (const g of games) {
    catStats.set(g.category_id, (catStats.get(g.category_id) || 0) + 1);
  }
  console.log("\n📊 Phân bố danh mục:");
  for (const [cat, count] of [...catStats.entries()].sort(
    (a, b) => b[1] - a[1],
  )) {
    console.log(`   • ${cat}: ${count} game`);
  }

  if (games.length === 0) {
    console.log("\n⚠️ Không có game nào để import.");
    return;
  }

  // Bước 3: Upsert vào Supabase
  const { inserted, errors } = await upsertGames(games);

  // Tổng kết
  console.log("\n═══════════════════════════════════════════");
  console.log("  📊 KẾT QUẢ CUỐI CÙNG");
  console.log("═══════════════════════════════════════════");
  console.log(`  • Tổng game thô:        ${totalRaw}`);
  console.log(`  • Sau lọc trùng:        ${games.length}`);
  console.log(`  • Upsert thành công:    ${inserted}`);
  console.log(`  • Lỗi:                  ${errors}`);
  console.log("═══════════════════════════════════════════\n");
}

main().catch((err) => {
  console.error("❌ Lỗi không mong đợi:", err);
  process.exit(1);
});
