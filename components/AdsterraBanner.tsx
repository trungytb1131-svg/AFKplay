"use client";

import { useEffect, useRef } from "react";

const AD_KEYS = [
  "de3d6ef07e4dc6d6fa76a1ec4ff58cee",
  "095ecf12a009b99b23c856b9660ec634",
  "28299c72f3e06229efd2c2c51c4099dd",
  "de3d6ef07e4dc6d6fa76a1ec4ff58cee",
  "de3d6ef07e4dc6d6fa76a1ec4ff58cee",
];

// Format riêng cho từng vị trí
const AD_FORMATS: Record<
  number,
  { width: number; height: number; format: string }
> = {
  1: { width: 160, height: 600, format: "iframe" },
  2: { width: 728, height: 90, format: "iframe" },
  3: { width: 300, height: 250, format: "iframe" },
  4: { width: 160, height: 600, format: "iframe" },
  5: { width: 160, height: 600, format: "iframe" },
};

let loading = false;

function loadAd(
  key: string,
  container: HTMLElement,
  width: number,
  height: number,
  format: string,
) {
  const tryLoad = () => {
    if (loading) {
      setTimeout(tryLoad, 200);
      return;
    }
    loading = true;
    (window as any).atOptions = {
      key,
      format,
      height,
      width,
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

export default function AdsterraBanner() {
  return null;
}

export function AdSlot({ index }: { index: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fired = useRef(false);

  useEffect(() => {
    return () => {
      fired.current = false;
    };
  }, []);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    const key = AD_KEYS[index - 1];
    const fmt = AD_FORMATS[index] || {
      width: 728,
      height: 90,
      format: "iframe",
    };
    if (!key) return;
    const start = () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
        loadAd(key, containerRef.current, fmt.width, fmt.height, fmt.format);
      } else {
        setTimeout(start, 100);
      }
    };
    start();
  }, [index]);

  return <div ref={containerRef} className="w-full h-full" />;
}
