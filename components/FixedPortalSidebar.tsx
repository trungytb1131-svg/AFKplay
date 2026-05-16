"use client";

import PortalLogo from "./PortalLogo";
import PlayerHubWidget from "./PlayerHubWidget";
import {
  fixedLogoSlotClass,
  fixedRankSlotClass,
  fixedSidebarWrapperClass,
} from "@/lib/portalLayout";

interface FixedPortalSidebarProps {
  hidden?: boolean;
}

export default function FixedPortalSidebar({
  hidden = false,
}: FixedPortalSidebarProps) {
  if (hidden) return null;

  return (
    <div className={fixedSidebarWrapperClass}>
      <div className={fixedLogoSlotClass}>
        <PortalLogo />
      </div>
      <div
        className="hidden lg:block"
        style={{
          height: `calc((100vw - 180px) / 17 * 2 + 10px)`,
          width: `calc((100vw - 180px) / 17 * 2 + 10px)`,
        }}
      >
        <PlayerHubWidget />
      </div>
    </div>
  );
}
