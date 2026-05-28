import type { Metadata } from "next";

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

function SkeletonCard() {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden animate-pulse">
      <div className="aspect-video bg-slate-800" />
      <div className="p-5 space-y-3">
        <div className="h-3 w-24 bg-slate-700 rounded" />
        <div className="h-5 bg-slate-700 rounded w-3/4" />
        <div className="h-5 bg-slate-700 rounded w-1/2" />
        <div className="h-4 bg-slate-700 rounded w-full" />
        <div className="h-4 bg-slate-700 rounded w-2/3" />
      </div>
    </div>
  );
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

        {/* Error state */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-12 text-center">
            <p className="text-lg text-red-300 mb-2">⚠️ Failed to load news</p>
            <p className="text-sm text-red-400/70">{error}</p>
          </div>
        )}

        {/* Empty state */}
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
                <div className="aspect-video relative overflow-hidden bg-slate-800">
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1a] via-transparent to-transparent" />
                </div>
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
                  <a
                    href={post.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
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
    </main>
  );
}
