import type { Metadata } from "next";
import PortalLogo from "@/components/PortalLogo";
import GameNewsContent from "./GameNewsContent";
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
  image: string;
  source_url: string;
}

export type { Post };

/** Base64 → data URI, tự nhận diện PNG/JPEG */
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

        {/* Grid — dùng cache sessionStorage nếu có */}
        <GameNewsContent initialPosts={posts} />
      </div>
    </main>
  );
}
