"use client";

import { useEffect, useRef } from "react";

type AdConfig = {
  key: string;
  containerId: string;
};

const ADS: AdConfig[] = [
  { key: "de3d6ef07e4dc6d6fa76a1ec4ff58cee", containerId: "ad-slot-1" }, // #1 Sidebar trái
  { key: "095ecf12a009b99b23c856b9660ec634", containerId: "ad-slot-2" }, // #2 Dưới game
  { key: "28299c72f3e06229efd2c2c51c4099dd", containerId: "ad-slot-3" }, // #3 Sidebar phải vuông
  { key: "41bad0c21e02b4e3d7f0dc2fa01c6dcd", containerId: "ad-slot-4" }, // #4 Sidebar phải ngang
  { key: "d463125d90d4981adef5657e45434d93", containerId: "ad-slot-5" }, // #5 Mobile
];

/**
 * Adsterra Banner Ads — tuần tự load từng banner để tránh xung đột atOptions.
 * Đặt component này 1 lần trong layout, các slot dùng containerId tương ứng.
 */
export default function AdsterraBanner() {
  const started = useRef(false);

  useEffect(() => {
    if (started.current || typeof window === "undefined") return;
    started.current = true;

    let i = 0;
    function loadNext() {
      if (i >= ADS.length) return;
      const ad = ADS[i];
      i++;

      const container = document.getElementById(ad.containerId);
      if (!container) {
        loadNext();
        return;
      }

      // Gán atOptions cho banner hiện tại
      (window as any).atOptions = {
        key: ad.key,
        format: "iframe",
        height: 600,
        width: 160,
        params: {},
      };

      const script = document.createElement("script");
      script.src = `https://www.highperformanceformat.com/${ad.key}/invoke.js`;
      script.async = true;
      script.onload = () => {
        // Đợi script trước load xong rồi mới load script sau
        setTimeout(loadNext, 300);
      };
      script.onerror = () => {
        setTimeout(loadNext, 300);
      };

      container.appendChild(script);
    }

    loadNext();
  }, []);

  return null;
}

/** Component đặt trong từng ô quảng cáo để tạo container */
export function AdSlot({ id }: { id: string }) {
  return <div id={id} className="w-full h-full" />;
}
