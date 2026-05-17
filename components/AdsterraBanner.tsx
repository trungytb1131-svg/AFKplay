"use client";

import { useEffect, useRef } from "react";

const AD_KEYS = [
  "de3d6ef07e4dc6d6fa76a1ec4ff58cee", // #1 Sidebar trái
  "095ecf12a009b99b23c856b9660ec634", // #2 Dưới game
  "28299c72f3e06229efd2c2c51c4099dd", // #3 Sidebar phải vuông
  "41bad0c21e02b4e3d7f0dc2fa01c6dcd", // #4 Sidebar phải ngang
  "d463125d90d4981adef5657e45434d93", // #5 Mobile
];

// ── Queue toàn cục: đảm bảo mỗi key chỉ load 1 lần, tuần tự ──
const loadedKeys = new Set<string>();
let loading = false;

function loadAd(key: string, container: HTMLElement) {
  if (loadedKeys.has(key)) return;
  loadedKeys.add(key);

  const tryLoad = () => {
    if (loading) {
      setTimeout(tryLoad, 200);
      return;
    }
    loading = true;

    (window as any).atOptions = {
      key,
      format: "iframe",
      height: 600,
      width: 160,
      params: {},
    };

    const script = document.createElement("script");
    script.src = `https://www.highperformanceformat.com/${key}/invoke.js`;
    script.async = true;
    script.onload = () => {
      loading = false;
    };
    script.onerror = () => {
      loading = false;
    };

    container.appendChild(script);
  };

  tryLoad();
}

// ── Component đặt trong layout (giữ lại để clear cache nếu cần) ──
export default function AdsterraBanner() {
  return null;
}

// ── Component đặt trong từng ô quảng cáo ──
export function AdSlot({ index }: { index: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;

    const key = AD_KEYS[index - 1];
    if (!key) return;

    // Đợi DOM sẵn sàng rồi load
    const start = () => {
      if (containerRef.current) {
        loadAd(key, containerRef.current);
      } else {
        setTimeout(start, 100);
      }
    };
    start();
  }, [index]);

  return <div ref={containerRef} className="w-full h-full" />;
}
