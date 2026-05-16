"use client";

import React from "react";
import Image from "next/image";

type AfkCoinIconProps = {
  size?: number;
  className?: string;
};

/** Custom coin art: add `public/afk-coin.png` or set NEXT_PUBLIC_AFK_COIN_IMAGE_URL */
const COIN_IMAGE =
  process.env.NEXT_PUBLIC_AFK_COIN_IMAGE_URL || "/afk-coin.png";

/** Gold AFK coin — set NEXT_PUBLIC_AFK_COIN_IMAGE_URL when you have the asset */
export default function AfkCoinIcon({ size = 14, className = "" }: AfkCoinIconProps) {
  const [useFallback, setUseFallback] = React.useState(false);

  if (!useFallback) {
    return (
      <Image
        src={COIN_IMAGE}
        alt="AFK Coin"
        width={size}
        height={size}
        className={`shrink-0 object-contain ${className}`}
        onError={() => setUseFallback(true)}
        unoptimized
      />
    );
  }

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-amber-300 via-yellow-400 to-amber-600 shadow-[0_1px_2px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.5)] ring-1 ring-amber-700/40 ${className}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <span
        className="font-black text-amber-950 leading-none select-none"
        style={{ fontSize: Math.max(6, Math.round(size * 0.38)) }}
      >
        AFK
      </span>
    </span>
  );
}
