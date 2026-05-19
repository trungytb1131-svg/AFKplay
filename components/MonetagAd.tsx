"use client";

import { useEffect, useRef } from "react";

const STORAGE_KEY = "monetag_last_shown";
const COOLDOWN_MS = 60 * 60 * 1000; // 1 giờ

export default function MonetagAd() {
  const injected = useRef(false);

  useEffect(() => {
    if (injected.current || typeof window === "undefined") return;

    const now = Date.now();
    const last = parseInt(localStorage.getItem(STORAGE_KEY) || "0", 10);

    if (now - last < COOLDOWN_MS) return; // Chưa đủ 1 giờ

    injected.current = true;
    localStorage.setItem(STORAGE_KEY, String(now));

    const script = document.createElement("script");
    script.dataset.zone = "11016341";
    script.src = "https://nap5k.com/tag.min.js";
    script.async = true;

    (document.body || document.documentElement).appendChild(script);
  }, []);

  return null;
}
