import type { Metadata } from "next";
import Link from "next/link";
import PortalLogo from "@/components/PortalLogo";
import {
  fixedSidebarWrapperClass,
  fixedLogoSlotClass,
} from "@/lib/portalLayout";

interface Post {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  image: string;
  source_url: string;
  tags?: string[];
}

function imageSrc(raw: string): string {
  if (!raw) return "";
  if (raw.startsWith("http") || raw.startsWith("data:")) return raw;
  if (raw.startsWith("iVBORw0KGgo")) return `data:image/png;base64,${raw}`;
  return `data:image/jpeg;base64,${raw}`;
}

/** Format date an toàn, xử lý ISO string không chuẩn */
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

function shortDate(dateString: string): string {
  if (!dateString) return "";
  const date = new Date(dateString.replace(" ", "T"));
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

async function fetchAllPosts(): Promise<Post[]> {
  const apiKey = process.env.NEXT_PUBLIC_API_KEY || "";
  const res = await fetch(
    "https://blog-vercel-api-orpin.vercel.app/api/posts",
    {
      headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : {},
      next: { revalidate: 300 },
    },
  );
  if (!res.ok) return [];
  return res.json();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const posts = await fetchAllPosts();
  const post = posts.find((p) => p.id === Number(id));
  if (!post) return { title: "Article Not Found — AFKplay" };
  return {
    title: `${post.title} — AFKplay`,
    description: post.excerpt?.slice(0, 160),
    openGraph: {
      title: `${post.title} — AFKplay`,
      description: post.excerpt?.slice(0, 160),
      type: "article",
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const allPosts = await fetchAllPosts();
  const post = allPosts.find((p) => p.id === Number(id));

  // Related: 3 bài khác, ưu tiên cùng tags
  const relatedPosts = post
    ? allPosts
        .filter((p) => p.id !== post.id)
        .sort((a, b) => {
          const aMatch = post.tags?.some((t) => a.tags?.includes(t)) ? 1 : 0;
          const bMatch = post.tags?.some((t) => b.tags?.includes(t)) ? 1 : 0;
          return bMatch - aMatch;
        })
        .slice(0, 3)
    : [];

  if (!post) {
    return (
      <main className="min-h-screen bg-[#0a0a1a] text-white py-16 px-4">
        <div className={`${fixedSidebarWrapperClass} !fixed !top-4 !left-4`}>
          <div className={fixedLogoSlotClass}>
            <PortalLogo />
          </div>
        </div>
        <div className="max-w-3xl mx-auto text-center py-20">
          <p className="text-lg text-red-300">Article not found</p>
          <Link
            href="/game-news"
            className="text-[#ff3b30] text-sm mt-4 inline-block hover:underline"
          >
            ← Back to GAME NEWS
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a1a] text-white py-16 px-4">
      {/* Logo */}
      <div className={`${fixedSidebarWrapperClass} !fixed !top-4 !left-4`}>
        <div className={fixedLogoSlotClass}>
          <PortalLogo />
        </div>
      </div>

      <article className="max-w-3xl mx-auto">
        {/* Back link */}
        <Link
          href="/game-news"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-[#ff3b30] transition-colors mb-8"
        >
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to GAME NEWS
        </Link>

        {/* Featured image */}
        {post.image && (
          <div className="aspect-video relative rounded-2xl overflow-hidden mb-8 bg-slate-800">
            <img
              src={imageSrc(post.image)}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Badge + Tags */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="inline-block bg-[#ff3b30] text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-widest">
            GAME NEWS
          </span>
          {post.tags?.map((tag) => (
            <span
              key={tag}
              className="text-xs text-slate-500 bg-white/5 px-2 py-0.5 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-3xl lg:text-4xl font-black text-white leading-tight mb-4">
          {post.title}
        </h1>

        {/* Date + Source */}
        <div className="flex items-center gap-4 text-sm text-slate-500 mb-8">
          <time className="font-mono">{formatDate(post.date)}</time>
        </div>

        {/* Full content */}
        <div
          className="prose prose-invert prose-lg max-w-none
            prose-headings:text-white prose-headings:font-black
            prose-p:text-slate-300 prose-p:leading-relaxed
            prose-a:text-[#ff3b30] prose-a:no-underline hover:prose-a:underline
            prose-strong:text-white
            prose-img:rounded-xl prose-img:mx-auto
            prose-li:text-slate-300
            prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10
            prose-code:text-[#ff3b30]"
          dangerouslySetInnerHTML={{
            __html: post.content || post.excerpt || "",
          }}
        />

        {/* Source link */}
        {post.source_url && (
          <div className="mt-8 pt-8 border-t border-white/10">
            <a
              href={post.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm bg-white/5 hover:bg-white/10 text-slate-400 px-4 py-2.5 rounded-xl transition-colors"
            >
              📰 View original source
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        )}
      </article>

      {/* ── RELATED NEWS ── */}
      {relatedPosts.length > 0 && (
        <section className="max-w-6xl mx-auto mt-20">
          <div className="flex items-center gap-3 mb-8">
            <span className="w-8 h-0.5 bg-[#ff3b30]" />
            <h2 className="text-xl font-black uppercase text-white tracking-wider">
              Related News
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((rp) => (
              <Link
                key={rp.id}
                href={`/game-news/${rp.id}`}
                className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-[#ff3b30]/30 transition-all"
              >
                {rp.image && (
                  <div className="aspect-video relative overflow-hidden bg-slate-800">
                    <img
                      src={imageSrc(rp.image)}
                      alt={rp.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="p-4">
                  <time className="text-[10px] text-slate-500 font-mono">
                    {shortDate(rp.date)}
                  </time>
                  <h3 className="text-sm font-bold text-white mt-1 line-clamp-2 leading-snug group-hover:text-[#ff3b30] transition-colors">
                    {rp.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/game-news"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#ff3b30] hover:text-red-400 transition-colors"
            >
              View All News
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
        </section>
      )}
    </main>
  );
}
