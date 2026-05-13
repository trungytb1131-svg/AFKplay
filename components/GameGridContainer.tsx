"use client";
import React, { useState } from "react";
import GameCard from "./GameCard";
import FixedHeader from "./FixedHeader";

const GAME_DATA = [
  // Đảm bảo các ô 1x1 xuất hiện sớm để lấp đầy khoảng trống dưới Header và quanh Featured
  { id: "m-big-top", dSize: "2x2", mSize: "2x2" },
  { id: "s-home-sub", dSize: "1x1", mSize: "1x1" },
  { id: "fill-start-1", dSize: "1x1", mSize: "1x1" },
  { id: "fill-start-2", dSize: "1x1", mSize: "1x1" },
  ...Array.from({ length: 96 }, (_, i) => ({
    id: `game-${i}`,
    dSize: i < 3 ? "3x3" : i < 15 ? "2x2" : "1x1",
    mSize: i % 10 === 0 ? "2x2" : "1x1"
  }))
];

export default function GameGridContainer() {
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  return (
    <div className="bg-[#adecf5] min-h-screen p-[10px] pt-[16px] relative" onClick={() => setExpandedCardId(null)}>
      <FixedHeader isHidden={!!expandedCardId} />

      {expandedCardId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-all duration-300" />
      )}

      <div className="
        grid gap-[10px] grid-cols-3 lg:grid-cols-17 grid-flow-row-dense relative z-10
        /* FIX BIẾN DẠNG: Ép chiều cao hàng bằng chiều rộng cột */
        auto-rows-[calc((100vw-40px)/3)] 
        lg:auto-rows-[calc((100vw-180px)/17)]
      ">
        
        {!expandedCardId && (
          <div className="invisible col-span-1 lg:col-span-2 lg:row-span-1" />
        )}

        {/* Các ô cố định PC */}
        <div className="hidden lg:block lg:col-start-1 lg:row-start-2"><GameCard game={{id:"sub1"}} /></div>
        <div className="hidden lg:block lg:col-start-2 lg:row-start-2"><GameCard game={{id:"sub2"}} /></div>
        <div className="hidden lg:block lg:col-start-1 lg:row-start-3"><GameCard game={{id:"sub3"}} /></div>
        <div className="hidden lg:block lg:col-start-2 lg:row-start-3"><GameCard game={{id:"sub4"}} /></div>
        <div className="hidden lg:block lg:col-start-3 lg:col-span-3 lg:row-start-1 lg:row-span-3"><GameCard game={{id:"feat"}} /></div>

        {GAME_DATA.map((game) => {
          const isSelected = expandedCardId === game.id;
          const isDimmed = expandedCardId !== null && !isSelected;

          return (
            <div 
              key={game.id}
              className={`transition-all duration-500 ease-in-out
                ${isSelected ? "col-span-2 row-span-2 order-first z-50 scale-105" : ""}
                ${isDimmed ? "opacity-30 blur-[2px] scale-95 pointer-events-none" : ""}
                ${!expandedCardId ? (game.mSize === "2x2" ? "col-span-2 row-span-2" : "col-span-1 row-span-1") : (isSelected ? "" : "col-span-1 row-span-1")}
                
                lg:order-none
                lg:col-span-${game.dSize === "3x3" ? "3" : game.dSize === "2x2" ? "2" : "1"}
                lg:row-span-${game.dSize === "3x3" ? "3" : game.dSize === "2x2" ? "2" : "1"}
              `}
            >
              <GameCard 
                game={game} 
                isExpanded={isSelected} 
                onLongPress={(id) => setExpandedCardId(id)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}