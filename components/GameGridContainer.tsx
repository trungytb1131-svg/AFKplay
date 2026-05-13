"use client";
import React, { useState } from "react";
import GameCard from "./GameCard";
import FixedHeader from "./FixedHeader";

// DỮ LIỆU GAME: Đã bổ sung 'slug' để khớp với Route /play/[slug]
const GAME_DATA = [
  { 
    id: "subway-surfers-main", 
    slug: "subway-surfers", 
    image: "https://static.pokicdn.com/cdn-cgi/image/quality=85,width=272,height=272,fit=cover,f=auto/spr/btns/subway-surfers.png",
    videoUrl: "https://static.pokicdn.com/cdn-cgi/image/quality=85,width=200,height=200,fit=cover,f=auto/spr/previews/200x200/subway-surfers.mp4",
    dSize: "2x2", 
    mSize: "2x2" 
  },
  { 
    id: "monkey-mart-main", 
    slug: "monkey-mart", 
    image: "https://static.pokicdn.com/cdn-cgi/image/quality=85,width=272,height=272,fit=cover,f=auto/spr/btns/monkey-mart.png",
    dSize: "1x1", 
    mSize: "1x1" 
  },
  { id: "fill-1", slug: "drive-mad", dSize: "1x1", mSize: "1x1" },
  { id: "fill-2", slug: "temple-run-2", dSize: "1x1", mSize: "1x1" },

  // Tự động tạo dữ liệu mẫu cho các ô còn lại
  ...Array.from({ length: 90 }, (_, i) => ({
    id: `game-${i}`,
    slug: `game-${i}`, // Tạo slug tạm theo ID
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
        auto-rows-[calc((100vw-40px)/3)] 
        lg:auto-rows-[calc((100vw-180px)/18)]
      ">
        
        {!expandedCardId && (
          <div className="invisible col-span-1 lg:col-span-2 lg:row-span-1" />
        )}

        {/* CÁC Ô CỐ ĐỊNH TRÊN PC: Đã cập nhật slug để không bị lỗi 404 */}
        <div className="hidden lg:block lg:col-start-1 lg:row-start-2">
          <GameCard game={{id:"sub1", slug: "subway-surfers"}} />
        </div>
        <div className="hidden lg:block lg:col-start-2 lg:row-start-2">
          <GameCard game={{id:"sub2", slug: "monkey-mart"}} />
        </div>
        <div className="hidden lg:block lg:col-start-1 lg:row-start-3">
          <GameCard game={{id:"sub3", slug: "drive-mad"}} />
        </div>
        <div className="hidden lg:block lg:col-start-2 lg:row-start-3">
          <GameCard game={{id:"sub4", slug: "temple-run-2"}} />
        </div>
        <div className="hidden lg:block lg:col-start-3 lg:col-span-3 lg:row-start-1 lg:row-span-3">
          <GameCard game={{id:"feat", slug: "subway-surfers"}} />
        </div>

        {/* RENDER DANH SÁCH GAME */}
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