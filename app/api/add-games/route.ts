import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const GAMES = [
  "https://html5.gamemonetize.co/og2m74ho3ajggl47n4gtsj9hhq1pjj79/",
  "https://html5.gamemonetize.co/gloktyrzqjdo2aw3u584w72gofte4mvf/",
  "https://html5.gamemonetize.co/05bfuojgaft6zuwsju9eo7a6zb2kyfly/",
  "https://html5.gamemonetize.co/z5n072q7gj0w969r5ul4ignnxe0fzsun/",
];

function extractHash(url: string) {
  return url.replace("https://html5.gamemonetize.co/", "").replace("/", "");
}

export async function GET(req: Request) {
  return POST(req);
}

export async function POST(req?: Request) {
  const secret = new URL(req?.url || "http://x").searchParams.get("key");
  const valid = process.env.ADMIN_SECRET_KEY || "afkplay-admin-2026";
  if (secret !== valid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  );

  const results: any[] = [];
  const feed = await fetch(
    "https://rss.gamemonetize.com/rssfeed.php?format=json&type=html5&popularity=newest&amount=1500",
  );
  const data: any[] = await feed.json();

  for (const url of GAMES) {
    const hash = extractHash(url);
    const match = data.find((g: any) => g.url.includes(hash));

    const game = match
      ? {
          id: match.id,
          slug:
            match.title
              .toLowerCase()
              .replace(/[^\w\s-]/g, "")
              .replace(/[\s_]+/g, "-")
              .replace(/-+/g, "-")
              .replace(/^-+|-+$/g, "") +
            "-" +
            match.id,
          title: match.title,
          description: match.description || "",
          instructions: match.instructions || "",
          url: match.url,
          category_id: "action",
          tags:
            match.tags
              ?.split(",")
              .map((t: string) => t.trim())
              .filter(Boolean) || [],
          thumb: match.thumb || "",
          width: parseInt(match.width, 10) || 800,
          height: parseInt(match.height, 10) || 600,
          source: "gamemonetize",
          featured: true,
        }
      : {
          id: hash.slice(0, 16),
          slug: "game-" + hash.slice(0, 8),
          title: "Game " + hash.slice(0, 8),
          description: "",
          instructions: "",
          url,
          category_id: "action",
          tags: [],
          thumb: `https://img.gamemonetize.com/${hash}/512x384.jpg`,
          width: 800,
          height: 600,
          source: "gamemonetize",
          featured: true,
        };

    const { error } = await admin
      .from("games")
      .upsert(game, { onConflict: "id" });
    results.push({ title: game.title, error: error?.message || null });
  }

  return NextResponse.json({ success: true, results });
}
