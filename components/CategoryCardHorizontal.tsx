"use client"
import React from "react"

// Danh sách 40 danh mục
const categories = [
  { title: "Action", icon: "⚔️" }, { title: "Racing", icon: "🏎️" }, { title: "Office", icon: "🏢" }, { title: "Puzzle", icon: "🧠" },
  { title: "Girls", icon: "👗" }, { title: "Sports", icon: "⚽" }, { title: "Adventure", icon: "🗺️" }, { title: "Strategy", icon: "🏰" },
  { title: "Shooter", icon: "🔫" }, { title: "Fighting", icon: "🥊" }, { title: "Horror", icon: "👻" }, { title: "Survival", icon: "🌲" },
  { title: "Platform", icon: "🏃" }, { title: "Sandbox", icon: "🏖️" }, { title: "MMORPG", icon: "🧙" }, { title: "MOBA", icon: "⚔️" },
  { title: "Card", icon: "🃏" }, { title: "Board", icon: "🎲" }, { title: "Casual", icon: "☕" }, { title: "Indie", icon: "🎸" },
  { title: "Music", icon: "🎵" }, { title: "Party", icon: "🎉" }, { title: "Education", icon: "🎓" }, { title: "Trivia", icon: "❓" },
  { title: "Arcade", icon: "🕹️" }, { title: "Novel", icon: "📖" }, { title: "Tower", icon: "🏹" }, { title: "Royale", icon: "👑" },
  { title: "Roguelike", icon: "💀" }, { title: "Retro", icon: "📼" }, { title: "Open World", icon: "🌍" }, { title: "Stealth", icon: "👤" },
  { title: "Hack/Slash", icon: "🗡️" }, { title: "Turn-based", icon: "⏳" }, { title: "Real-time", icon: "⏱️" }, { title: "Co-op", icon: "🤝" },
  { title: "PvP", icon: "🎯" }, { title: "Free", icon: "🎁" }, { title: "VR", icon: "👓" }, { title: "Classic", icon: "📜" }
]

export default function CategoryTiles() {
  return (
    <section className="w-full my-10 flex justify-start">
      {/* CONTAINER DỒN TRÁI VÀ NGẮN LẠI:
         - max-w-[1000px] để tổng chiều rộng không bị quá dài.
         - mx-0 ml-2 để dồn hẳn sang bên trái giống Poki.
      */}
      <div className="w-full max-w-[1200px] p-6 lg:p-8 rounded-3xl bg-white border border-slate-100 shadow-2xl mx-0 ml-2">
        
        {/* LƯỚI GRID 10 CỘT:
           - Mobile: grid-cols-4 (mỗi ô col-span-2 => 2 ô/hàng).
           - PC: lg:grid-cols-10 (mỗi ô col-span-2 => 5 ô/hàng).
        */}
        <div className="grid grid-cols-4 lg:grid-cols-10 gap-3 grid-flow-row-dense">
          {categories.map((cat, i) => {
            // Quy tắc trộn kích thước: 
            // Cứ mỗi 7 ô thì cho 1 ô vuông (2x2), còn lại là chữ nhật ngang (2x1)
            const isSquare = i % 7 === 0;
            
            return (
              <div 
                key={i} 
                className={`
                  col-span-2 
                  ${isSquare ? 'row-span-2 aspect-square' : 'row-span-1 aspect-[2/1]'} 
                  rounded-2xl bg-slate-50 flex flex-col items-center justify-center 
                  cursor-pointer shadow-sm hover:scale-105 hover:shadow-cyan-400/30 
                  transition-all group border border-slate-100
                `}
              >
                <span className={`
                  ${isSquare ? 'text-4xl' : 'text-2xl'} 
                  mb-1 group-hover:animate-bounce
                `}>
                  {cat.icon}
                </span>
                <span className={`
                  text-slate-800 font-bold uppercase tracking-tighter
                  ${isSquare ? 'text-xs' : 'text-[10px]'}
                `}>
                  {cat.title}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}