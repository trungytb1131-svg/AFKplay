"use client";

import { logoSpacerClass, rankSpacerClass } from "@/lib/portalLayout";

/** Chừa chỗ cho Logo + UserHeader cố định (trang play) */
export default function PlaySidebarSpacer() {
  return (
    <>
      <div className={`${logoSpacerClass} invisible shrink-0`} aria-hidden />
      <div className={`${rankSpacerClass} invisible shrink-0`} aria-hidden />
    </>
  );
}
