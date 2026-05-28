import type { Metadata } from "next";
import Link from "next/link";
import PortalLogo from "@/components/PortalLogo";
import { fixedSidebarWrapperClass, fixedLogoSlotClass } from "@/lib/portalLayout";

interface Post {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  image_url: string;
  source_url: string;
}

/** Biến base64 thuần thành data URI, tự nhận diện PNG/JPEG */
function imageSrc(raw: string): string {
  if (!raw) return "";
  if (raw.startsWith("http") || raw.startsWith("data:")) return raw;
  if (raw.startsWith("iVBORw0KGgo")) return `data:image/png;base64,${raw}`;
  return `data:image/jpeg;base64,${raw}`;
}

async function fetchPost(id: string): Promise<Post | null> {
  const apiKey = process.env.NEXT_PUBLIC_API_KEY || "";
  const res = await fetch(
    `https://blog-vercel-api-orpin.vercel.app/api/posts/${id}`,
    {
      headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : {},
      next: { revalidate: 300 },
    },
  );
  if (!res.ok) return null;
  return res.json();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const post = await fetchPost(id);
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
  const post = await fetchPost(id);

  if (!post) {
    return (
      <main className="min-h-screen bg-[#0a0a1a] text-white py-16 px-4">
        <div className={`${fixedSidebarWrapperClass} !fixed !top-4 !left-4`}>
          <div className={fixedLogoSlotClass}>
            <PortalLogo />
          </div>
        </div>
        <div className="max-w-3xl mx-auto text-center py-20">
          <p className="text-lg text-red-300">⚠️ Article not found</p>
          <Link href="/game-news" className="text-[#ff3b30] text-sm mt-4 inline-block hover:underline">
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
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to GAME NEWS
        </Link>

        {/* Featured image */}
        {post.image_url && (
          <div className="aspect-video relative rounded-2xl overflow-hidden mb-8 bg-slate-800">
            <img
              src={imageSrc(post.image_url)}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Category badge */}
        <span className="inline-block bg-[#ff3b30] text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-widest mb-4">
          GAME NEWS
        </span>

        {/* Title */}
        <h1 className="text-3xl lg:text-4xl font-black text-white leading-tight mb-4">
          {post.title}
        </h1>

        {/* Date + Source */}
        <div className="flex items-center gap-4 text-sm text-slate-500 mb-8">
          <time className="font-mono">
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          {post.source_url && (
            <a
              href={post.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#ff3b30] hover:underline"
            >
              View Source
            </a>
          )}
        </div>

        {/* Content */}
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

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-white/10 flex items-center justify-between">
          <Link
            href="/game-news"
            className="text-sm text-[#ff3b30] hover:underline font-bold"
          >
            ← More News
          </Link>
          {post.source_url && (
            <a
              href={post.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl transition-colors font-bold"
            >
              Read Original →
            </a>
          )}
        </div>
      </article>
    </main>
  );
}
