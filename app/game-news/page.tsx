import type { Metadata } from "next";
import PortalLogo from "@/components/PortalLogo";
import { AdSlot } from "@/components/AdsterraBanner";

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

function imageSrc(raw: string): string {
  if (!raw) return "";
  if (raw.startsWith("http") || raw.startsWith("data:")) return raw;
  if (raw.startsWith("iVBORw0KGgo")) return `data:image/png;base64,${raw}`;
  return `data:image/jpeg;base64,${raw}`;
}

function formatDate(dateString: string): string {
  if (!dateString) return "Recently";
  const date = new Date(dateString.replace(" ", "T"));
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export const revalidate = 300;

async function fetchPosts(): Promise<Post[]> {
  const apiKey = process.env.NEXT_PUBLIC_API_KEY || "";
  const res = await fetch(
    "https://blog-vercel-api-orpin.vercel.app/api/posts",
    { headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : {} },
  );
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return (res.json() as Promise<Post[]>).then((p) => p.slice(0, 12));
}

export default async function GameNewsPage() {
  const posts = await fetchPosts().catch(() => [] as Post[]);

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

      {/* Ad banner — nền tối đồng bộ grid */}
      <section className="bg-[#0a0a1a]">
        <div className="max-w-7xl mx-auto px-4 pb-8">
          <div className="w-full max-w-[728px] h-[90px] mx-auto rounded-xl flex items-center justify-center">
            <AdSlot index={2} />
          </div>
        </div>
      </section>

      {/* ── GRID ── */}
      <section className="bg-[#0a0a1a] py-16 px-4">
        <div className="max-w-7xl mx-auto flex gap-6">
          {/* Sidebar ad trái */}
          <div className="hidden lg:block w-[160px] shrink-0">
            <div className="sticky top-20 w-[160px] h-[600px] bg-white/5 rounded-xl overflow-hidden flex items-center justify-center">
              <AdSlot index={4} />
            </div>
          </div>

          {/* Grid chính */}
          <div className="flex-1 min-w-0">
            {posts.length === 0 ? (
              <div className="text-center py-20 text-slate-500">
                <p className="text-lg">No news articles yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {posts.map((post) => (
                  <article
                    key={post.id}
                    className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-[#ff3b30]/30 transition-all group"
                  >
                    {post.image && (
                      <div className="aspect-video relative overflow-hidden bg-slate-800">
                        <img
                          src={imageSrc(post.image)}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                          decoding="async"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1a] via-transparent to-transparent" />
                      </div>
                    )}
                    <div className="p-5">
                      <time className="text-xs text-slate-500 font-mono">
                        {formatDate(post.date)}
                      </time>
                      <h3 className="text-lg font-bold text-white mt-2 line-clamp-2 leading-snug">
                        {post.title}
                      </h3>
                      <p className="text-sm text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>
                      <a
                        href={`/game-news/${post.id}/${post.title
                          .toLowerCase()
                          .replace(/[^\w\s-]/g, "")
                          .replace(/[\s_]+/g, "-")
                          .replace(/-+/g, "-")
                          .replace(/^-|-$/g, "")
                          .slice(0, 80)}`}
                        className="inline-flex items-center gap-1.5 mt-4 text-sm font-bold text-[#ff3b30] hover:text-red-400 transition-colors"
                      >
                        Read More
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar ad phải */}
          <div className="hidden lg:block w-[160px] shrink-0">
            <div className="sticky top-20 w-[160px] h-[600px] bg-white/5 rounded-xl flex items-center justify-center">
              <AdSlot index={5} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
