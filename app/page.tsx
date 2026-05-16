"use client";

import React from "react";
import GameGridContainer from "@/components/GameGridContainer";
import CategoryCard from "@/components/CategoryCard";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";
import UserActivityBar from "@/components/UserActivityBar";
import FixedPortalSidebar from "@/components/FixedPortalSidebar";
import HeaderOverlay from "@/components/HeaderOverlay";
import { CATEGORIES_28 } from "@/data/categories";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#adecf5] p-[10px] lg:p-[16px] w-full overflow-x-hidden flex flex-col gap-[10px]">
      <HeaderOverlay />

      <div className="z-30 w-full">
        <UserActivityBar />
      </div>

      <div className="w-full relative z-20">
        <GameGridContainer />
      </div>

      {/* ===== DANH MỤC GAME: full-width, PC 7 cột, Mobile 1 cột ===== */}
      <div className="w-full mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-[10px] w-full">
          {CATEGORIES_28.map((cat, index) => {
            // PC: 4 hàng × 7 cột. Hàng 1 (0-6): vuông. Hàng 2-4 (7-27): chữ nhật ngang.
            // Mobile: tất cả 28 ô là chữ nhật ngang 3x1 xếp dọc.
            const isTopRow = index < 7;
            return (
              <div
                key={cat.slug}
                className={
                  isTopRow
                    ? "aspect-[3/1] lg:aspect-square"
                    : "aspect-[3/1] lg:aspect-[2/1]"
                }
              >
                <CategoryCard category={cat} isSquare={isTopRow} />
              </div>
            );
          })}
        </div>
      </div>

      {/* ===== ABOUT: full-width ===== */}
      <div className="w-full mt-4">
        <AboutSection />
      </div>

      {/* ===== FOOTER: full-width ===== */}
      <div className="w-full">
        <Footer />
      </div>
    </main>
  );
}
