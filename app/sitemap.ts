import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://afkplay.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  );

  // Lấy tất cả game slugs
  const { data: games } = await supabase
    .from("games")
    .select("slug, updated_at");

  const gameUrls: MetadataRoute.Sitemap =
    games?.map((g) => ({
      url: `${BASE}/play/${g.slug}`,
      lastModified: g.updated_at || new Date().toISOString(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })) ?? [];

  // 28 danh mục
  const categories = [
    "action",
    "racing",
    "puzzle",
    "shooting",
    "adventure",
    "sports",
    "cooking",
    "zombie",
    "2-player",
    "dress-up",
    "driving",
    "skill",
    "horror",
    "board",
    "simulation",
    "strategy",
    "funny",
    "multiplayer",
    "girls",
    "car",
    "io",
    "logic",
    "escape",
    "idle",
    "classic",
    "clicker",
    "physics",
    "world-war",
  ];

  const categoryUrls: MetadataRoute.Sitemap = categories.map((slug) => ({
    url: `${BASE}/category/${slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const legalPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE}/about`,
      changeFrequency: "monthly" as const,
      priority: 0.3,
    },
    {
      url: `${BASE}/contact`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: `${BASE}/terms`,
      changeFrequency: "monthly" as const,
      priority: 0.3,
    },
    {
      url: `${BASE}/privacy`,
      changeFrequency: "monthly" as const,
      priority: 0.3,
    },
  ];

  return [
    { url: BASE, changeFrequency: "daily", priority: 1 },
    ...categoryUrls,
    ...gameUrls,
    ...legalPages,
  ];
}
