"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Heart, Play } from "lucide-react";
import { useActivity } from "@/contexts/ActivityContext";

export default function GameCard({
  game,
  forceHeart,
  onHeartClick,
}: {
  game: {
    slug: string;
    title?: string;
    image?: string;
    id?: string;
    thumb?: string;
  };
  forceHeart?: boolean;
  onHeartClick?: (slug: string) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { isHearted, toggleFavorite, trackPlay } = useActivity();

  useEffect(() => {
    setMounted(true);
  }, []);

  const favorited = mounted ? forceHeart || isHearted(game.slug) : false;

  // Cache-bust: timestamp cố định từ lúc mount, thay đổi mỗi lần refresh trang
  const cacheBuster = useRef(Date.now().toString(36));

  const thumbnailSrc = (() => {
    const base = game.thumb || game.image || `/images/games/${game.slug}.jpg`;
    const sep = base.includes("?") ? "&" : "?";
    return `${base}${sep}t=${cacheBuster.current}`;
  })();

  return (
    <div
      className="relative w-full h-full group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Nút tim */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onHeartClick ? onHeartClick(game.slug) : toggleFavorite(game.slug);
        }}
        className={`absolute top-2 right-2 z-30 p-2 rounded-full backdrop-blur-md transition-all ${
          favorited
            ? "bg-red-500 text-white opacity-100"
            : "bg-black/20 text-white opacity-0 group-hover:opacity-100"
        }`}
        aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
      >
        <Heart
          size={16}
          fill={favorited ? "currentColor" : "none"}
          strokeWidth={2.5}
        />
      </button>

      <Link
        href={`/play/${game.slug}`}
        onClick={() => trackPlay(game.slug)}
        className="relative block w-full h-full overflow-hidden rounded-[24px] bg-slate-200 shadow-sm hover:scale-[1.03] active:scale-95 transition-transform group/link"
      >
        {/* Ảnh nền full — zoom nhẹ khi hover (dùng <img> thường để tránh cache) */}
        <img
          src={thumbnailSrc}
          alt={game.title || game.slug}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover/link:scale-110"
          loading="lazy"
          decoding="async"
        />

        {/* Overlay tối + Play + Title — hiện khi hover */}
        <div
          className={`absolute inset-0 bg-black/50 flex flex-col items-center justify-center p-2 transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <Play size={32} className="text-white opacity-80 mb-2" fill="white" />
          <span className="text-white text-[10px] font-black uppercase text-center italic leading-tight">
            {game.title || game.slug}
          </span>
        </div>
      </Link>
    </div>
  );
}
