"use client";

import { useEffect, useRef } from "react";

/**
 * Monetag In-Page Push Ad — tự động inject script 1 lần duy nhất.
 * Đặt component này trong bất kỳ ô quảng cáo nào trên trang.
 */
export default function MonetagAd() {
  const injected = useRef(false);

  useEffect(() => {
    if (injected.current || typeof window === "undefined") return;
    injected.current = true;

    const script = document.createElement("script");
    script.dataset.zone = "11016341";
    script.src = "https://nap5k.com/tag.min.js";
    script.async = true;

    (document.body || document.documentElement).appendChild(script);
  }, []);

  return null;
}
