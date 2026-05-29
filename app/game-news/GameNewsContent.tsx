"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { slugify } from "@/lib/slugify";

interface Post {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  source_url: string;
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

export default function GameNewsContent({
  initialPosts,
}: {
  initialPosts: Post[];
}) {
  const [posts, setPosts] = useState<Post[]>(() => {
    if (typeof window === "undefined") return initialPosts;
    try {
      const cached = sessionStorage.getItem("gameNewsCache");
      if (cached) {
        const data = JSON.parse(cached);
        if (data?.length) return data;
      }
    } catch {}
    return initialPosts;
  });

  useEffect(() => {
    if (initialPosts.length && !posts.length) setPosts(initialPosts);
  }, [initialPosts]);

  if (!posts.length) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden animate-pulse"
          >
            <div className="aspect-video bg-slate-800" />
            <div className="p-5 space-y-3">
              <div className="h-3 w-24 bg-slate-700 rounded" />
              <div className="h-5 bg-slate-700 rounded w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <Link
              href={`/game-news/${post.id}/${slugify(post.title)}`}
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
  );
}
