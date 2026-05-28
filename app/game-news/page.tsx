import type { Metadata } from "next";
import Link from "next/link";
import PortalLogo from "@/components/PortalLogo";
import {
  fixedSidebarWrapperClass,
  fixedLogoSlotClass,
} from "@/lib/portalLayout";

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
  image_url: string;
  source_url: string;
}

/** Base64 → data URI, tự nhận diện PNG/JPEG */
function imageSrc(raw: string): string {
  if (!raw) return "";
  if (raw.startsWith("http") || raw.startsWith("data:")) return raw;
  if (raw.startsWith("iVBORw0KGgo")) return `data:image/png;base64,${raw}`;
  return `data:image/jpeg;base64,${raw}`;
}

async function fetchPosts(): Promise<Post[]> {
  const apiKey = process.env.NEXT_PUBLIC_API_KEY || "";
  const res = await fetch(
    "https://blog-vercel-api-orpin.vercel.app/api/posts",
    {
      headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : {},
      next: { revalidate: 300 },
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
    <main className="min-h-screen bg-[#0a0a1a] text-white py-16 px-4">
      {/* Logo */}
      <div className={`${fixedSidebarWrapperClass} !fixed !top-4 !left-4`}>
        <div className={fixedLogoSlotClass}>
          <PortalLogo />
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block bg-[#ff3b30] text-white text-sm font-black uppercase px-4 py-1.5 rounded-full tracking-widest mb-4">
            GAME NEWS
          </span>
          <h2 className="text-3xl lg:text-5xl font-black uppercase italic text-white">
            Latest Updates
          </h2>
          <p className="text-slate-400 mt-3 text-sm">
            Stay tuned for new game releases and announcements on AFKplay
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-12 text-center">
            <p className="text-lg text-red-300 mb-2">Failed to load news</p>
            <p className="text-sm text-red-400/70">{error}</p>
          </div>
        )}

        {/* Empty */}
        {!error && posts.length === 0 && (
          <div className="text-center py-20 text-slate-500">
            <p className="text-lg">No news articles yet.</p>
            <p className="text-sm mt-1">Check back soon for updates!</p>
          </div>
        )}

        {/* Grid */}
        {posts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-[#ff3b30]/30 transition-all group"
              >
                {post.image_url && (
                  <div className="aspect-video relative overflow-hidden bg-slate-800">
                    <img
                      src={imageSrc(post.image_url)}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1a] via-transparent to-transparent" />
                  </div>
                )}
                <div className="p-5">
                  <time className="text-xs text-slate-500 font-mono">
                    {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                  <h3 className="text-lg font-bold text-white mt-2 line-clamp-2 leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-sm text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <Link
                    href={`/game-news/${post.id}`}
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
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
