"use client"
import React from "react"

const categories = [
  { title: "2 Player", icon: "👬" }, { title: "Adventure", icon: "🏹" }, { title: "Fighting", icon: "🥋" }, { title: "Shooting", icon: "🔫" },
  { title: "Girls", icon: "👗" }, { title: "Mobile", icon: "📱" }, { title: "Kids", icon: "👶" }, { title: "Multiplayer", icon: "👥" },
  { title: "Car", icon: "🏎️" }, { title: "Action", icon: "🔥" }, { title: "3D", icon: "🧊" }, { title: "War", icon: "🎖️" },
  { title: "Animal", icon: "🐶" }, { title: "Puzzle", icon: "🧩" }, { title: "Arcade", icon: "🕹️" }, { title: "Skill", icon: "🎯" },
  { title: "Sports", icon: "⚽" }, { title: "Strategy", icon: "🏰" }, { title: "Racing", icon: "🏁" }, { title: "Zombie", icon: "🧟" },
  { title: "Platform", icon: "🏃" }, { title: "Simulation", icon: "🏗️" }, { title: "Card", icon: "🃏" }, { title: "Board", icon: "🎲" },
  { title: "Music", icon: "🎵" }, { title: "Education", icon: "🎓" }, { title: "Arcade", icon: "🕹️" }, { title: "Tower", icon: "🏹" },
  { title: "Roguelike", icon: "💀" }, { title: "Retro", icon: "📼" }, { title: "Open World", icon: "🌍" }, { title: "Stealth", icon: "👤" },
  { title: "Horror", icon: "👻" }, { title: "Survival", icon: "🌲" }, { title: "Casual", icon: "☕" }, { title: "Indie", icon: "🎸" },
  { title: "PvP", icon: "🎯" }, { title: "Free", icon: "🎁" }, { title: "VR", icon: "👓" }, { title: "Classic", icon: "📜" }
]

export default function CategoryTiles() {
  return (
    <section className="w-full my-10 px-2 lg:px-0">
      {/* HỆ LƯỚI PHẢN HỒI:
          - grid-cols-1: Trên điện thoại, 1 hàng chỉ có 1 ô (Full width).
          - lg:grid-cols-15: Trên PC quay lại hệ 15 cột đồng bộ với Game Grid.
      */}
      <div className="grid grid-cols-1 lg:grid-cols-15 gap-2 grid-flow-row-dense">
        {categories.map((cat, i) => {
          // Quy tắc Big (Square) chỉ áp dụng cho PC
          const isBigOnPC = i < 7; 
          
          return (
            <div 
              key={i} 
              className={`
                /* PC: Chiếm 2 cột. Mobile: Chiếm trọn 1 cột của grid-cols-1 */
                col-span-1 lg:col-span-2 
                
                /* HÌNH DÁNG: 
                   - Mặc định (Mobile): aspect-[2/1] (Chữ nhật ngang), 1 dòng 1 ô.
                   - PC (lg): Nếu là ô lớn thì Square, ô nhỏ thì 2/1.
                */
                aspect-[2/1] 
                ${isBigOnPC ? 'lg:row-span-2 lg:aspect-square' : 'lg:row-span-1 lg:aspect-[2/1]'} 
                
                bg-white/90 rounded-2xl flex flex-col items-center justify-center 
                cursor-pointer shadow-sm hover:scale-105 transition-all duration-300 
                group border border-white/20
              `}
            >
              <div className={`
                ${isBigOnPC ? 'lg:text-4xl text-2xl' : 'text-xl'} 
                mb-1 group-hover:scale-110 transition-transform
              `}>
                {cat.icon}
              </div>
              <span className={`
                text-slate-800 font-extrabold uppercase text-center leading-none
                ${isBigOnPC ? 'lg:text-[10px] text-[12px]' : 'text-[10px]'} 
                tracking-tighter px-2
              `}>
                {cat.title}
              </span>
            </div>
          )
        })}

        {/* Ô All Categories ở cuối - Luôn là chữ nhật ngang */}
        <div className="col-span-1 lg:col-span-2 row-span-1 aspect-[2/1] bg-white rounded-2xl flex flex-col items-center justify-center cursor-pointer shadow-sm hover:scale-105 transition-all border border-white/20 group">
          <div className="text-blue-500 text-xl mb-1">⠿</div>
          <span className="text-slate-800 font-extrabold uppercase text-[10px] tracking-tighter">
            All Categories
          </span>
        </div>
      </div>
    </section>
  )
}