"use client";

import PortalLogo from "./PortalLogo";
import PlayerHubWidget from "./PlayerHubWidget";

export default function HeaderOverlay() {
  return (
    <div className="fixed z-[200] top-[16px] left-[16px] right-[16px] pointer-events-none">
      <div className="grid grid-cols-17 gap-[10px] w-full auto-rows-[calc((100vw-180px)/17)]">
        {/* Logo (2x1) */}
        <div className="col-span-2 row-span-1 pointer-events-auto">
          <PortalLogo />
        </div>

        {/* PlayerHubWidget (2x2) dưới logo */}
        <div className="col-span-2 row-span-2 col-start-1 row-start-2 pointer-events-auto">
          <PlayerHubWidget />
        </div>
      </div>
    </div>
  );
}
