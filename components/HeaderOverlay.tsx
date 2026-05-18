"use client";

import PortalLogo from "./PortalLogo";
import PlayerHubWidget from "./PlayerHubWidget";

export default function HeaderOverlay() {
  return (
    <>
      {/* ===== DESKTOP: 17 cột, Logo 2×1 + Widget 2×2 ===== */}
      <div className="hidden lg:block fixed z-[200] top-[16px] left-[16px] right-[16px] pointer-events-none">
        <div className="grid grid-cols-17 gap-[10px] w-full auto-rows-[calc((100vw-180px)/17)]">
          <div className="col-span-2 row-span-1 pointer-events-auto">
            <PortalLogo />
          </div>
          <div className="col-span-2 row-span-2 col-start-1 row-start-2 pointer-events-auto">
            <PlayerHubWidget />
          </div>
        </div>
      </div>

      {/* ===== MOBILE: Logo 1×0.5 + Widget 1×0.5 = combo 1×1 cố định ===== */}
      <div
        className="lg:hidden fixed z-[200] top-[10px] left-[10px] pointer-events-auto"
        style={{ width: "calc((100vw - 40px) / 3)" }}
      >
        <div className="flex flex-col gap-[10px]">
          <div
            className="w-full rounded-[24px] overflow-hidden bg-white shadow-lg border border-white/50"
            style={{ height: "calc((100vw - 40px) / 6)" }}
          >
            <PortalLogo />
          </div>
          <div
            className="w-full rounded-[24px] overflow-hidden bg-white shadow-lg border border-white/50"
            style={{ height: "calc((100vw - 40px) / 6)" }}
          >
            <PlayerHubWidget />
          </div>
        </div>
      </div>
    </>
  );
}
