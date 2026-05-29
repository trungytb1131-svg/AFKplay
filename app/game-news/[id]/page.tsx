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

// HÀM MỚI: Chỉ lấy đúng 1 bài viết
async function fetchPostById(id: string): Promise<Post | null> {
  const apiKey = process.env.NEXT_PUBLIC_API_KEY || "";
  try {
    const res = await fetch(
      `https://blog-vercel-api-orpin.vercel.app/api/posts?id=${id}`,
      {
        headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : {},
        cache: "no-store",
      },
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (!data) return null;
    return { ...data, date: data.created_at || data.date };
  } catch (e) {
    return null;
  }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Gọi API lấy duy nhất 1 bài
  const post = await fetchPostById(id);

  if (!post) {
    return (
      <main className="min-h-screen bg-[#0a0a1a] text-white flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">
          Bài viết không tồn tại hoặc đang tải...
        </h1>
        <Link href="/game-news" className="text-[#ff3b30] hover:underline">
          ← Quay lại trang tin
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a1a] text-white py-16 px-4">
      <div className={`${fixedSidebarWrapperClass} !fixed !top-4 !left-4`}>
        <div className={fixedLogoSlotClass}>
          <PortalLogo />
        </div>
      </div>

      <article className="max-w-3xl mx-auto">
        <Link
          href="/game-news"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-[#ff3b30] transition-colors mb-8"
        >
          ← Back to GAME NEWS
        </Link>

        {post.image && (
          <div className="aspect-video relative rounded-2xl overflow-hidden mb-8 bg-slate-800">
            <img
              src={imageSrc(post.image)}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="inline-block bg-[#ff3b30] text-white text-xs font-black uppercase px-3 py-1 rounded-full">
            GAME NEWS
          </span>
        </div>

        <h1 className="text-3xl lg:text-4xl font-black text-white leading-tight mb-4">
          {post.title}
        </h1>

        <div className="flex items-center gap-4 text-sm text-slate-500 mb-8">
          <time className="font-mono">{formatDate(post.date)}</time>
        </div>

        <div
          className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-p:text-slate-300"
          dangerouslySetInnerHTML={{
            __html: post.content || post.excerpt || "",
          }}
        />
      </article>
    </main>
  );
}
