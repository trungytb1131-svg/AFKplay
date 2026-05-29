import { redirect } from "next/navigation";
import { slugify } from "@/lib/slugify";

async function fetchPostById(id: string) {
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
    return res.json();
  } catch {
    return null;
  }
}

export default async function OldArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await fetchPostById(id);
  const slug = post?.title ? slugify(post.title) : "article";
  redirect(`/game-news/${id}/${slug}`);
}
