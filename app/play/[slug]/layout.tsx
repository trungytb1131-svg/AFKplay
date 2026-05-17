import type { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://afkplay.vercel.app";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  );

  const { data: game } = await supabase
    .from("games")
    .select("title, description, thumb, category_id")
    .eq("slug", slug)
    .single();

  const title = game?.title || slug.replace(/-/g, " ");
  const desc = game?.description?.slice(0, 160) || `Play ${title} online for free on AFKplay. No downloads required.`;
  const image = game?.thumb || `${SITE_URL}/images/games/${slug}.jpg`;

  return {
    title: `${title} — Play Online Free`,
    description: desc,
    openGraph: {
      title: `${title} — Free Online Game`,
      description: desc,
      url: `${SITE_URL}/play/${slug}`,
      type: "website",
      images: [{ url: image, width: 512, height: 384 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — Free Online Game`,
      description: desc,
      images: [image],
    },
    alternates: { canonical: `${SITE_URL}/play/${slug}` },
  };
}

export default function PlayLayout({ children }: { children: React.ReactNode }) {
  return children;
}
