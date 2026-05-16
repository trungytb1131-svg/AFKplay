"use client";

import { ActivityProvider } from "@/contexts/ActivityContext";
import { ProfileProvider } from "@/contexts/ProfileContext";
import LoginOverlay from "./LoginOverlay";
import SearchOverlay from "./SearchOverlay";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ActivityProvider>
      <ProfileProvider>
        {children}
        <LoginOverlay />
        <SearchOverlay />
      </ProfileProvider>
    </ActivityProvider>
  );
}
