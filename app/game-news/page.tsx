import type { Metadata } from "next";
import PortalLogo from "@/components/PortalLogo";
import GameNewsContent from "./GameNewsContent";

export const metadata: Metadata = {
  title: "GAME NEWS — AFKplay",
  description:
    "Latest gaming news, updates, and announcements. Stay tuned for new game releases on AFKplay.",
  openGraph: {
    title: "GAME NEWS — AFKplay",
    description:
      "Latest gaming news, updates, and announcements. Stay tuned for new game releases on AFKplay.",
    type: "website",
  },
};

interface Post {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  source_url: string;
}

export type { Post };

async function fetchPosts(): Promise<Post[]> {
  const apiKey = process.env.NEXT_PUBLIC_API_KEY || "";
  const res = await fetch(
    "https://blog-vercel-api-orpin.vercel.app/api/posts",
    {
      headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : {},
      next: { revalidate: 60 },
    },
  );
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export default async function GameNewsPage() {
  let posts: Post[] = [];
  let error: string | null = null;

  try {
    posts = await fetchPosts();
  } catch (e: any) {
    error = e.message || "Failed to load news";
  }

  return (
    <>
      {/* ── HEADER ── */}
      <header className="bg-[#0a0a1a] border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="w-24 h-12">
            <PortalLogo />
          </div>
          <nav className="flex items-center gap-6 text-sm font-bold text-slate-400">
            <a href="/" className="hover:text-white transition-colors">
              Home
            </a>
            <a href="/game-news" className="text-[#ff3b30]">
              News
            </a>
          </nav>
        </div>
      </header>

      {/* ── EDITORIAL STRIP ── */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto py-16 lg:py-24 px-4">
          <div className="border-l-8 border-[#ff3b30] pl-6 lg:pl-10">
            <p className="text-[#ff3b30] text-sm font-black uppercase tracking-[0.2em] mb-4">
              Level Up Your Feed
            </p>
            <h1 className="text-5xl lg:text-7xl font-black uppercase italic tracking-tighter text-[#07d1f7] leading-none">
              The Daily
              <br />
              AFK
            </h1>
            <p className="text-slate-500 mt-6 max-w-md font-light text-lg leading-relaxed">
              Don&apos;t miss a beat. From patch notes to industry shifts,
              we&apos;ve got the intel you need to stay ahead.
            </p>
          </div>
        </div>
      </section>

      {/* ── GRID ── */}
      <section className="bg-[#0a0a1a] py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-12 text-center">
              <p className="text-lg text-red-300 mb-2">Failed to load news</p>
              <p className="text-sm text-red-400/70">{error}</p>
            </div>
          )}

          {!error && posts.length === 0 && (
            <div className="text-center py-20 text-slate-500">
              <p className="text-lg">No news articles yet.</p>
              <p className="text-sm mt-1">Check back soon for updates!</p>
            </div>
          )}

          <GameNewsContent initialPosts={posts} />
        </div>
      </section>
    </>
  );
}
