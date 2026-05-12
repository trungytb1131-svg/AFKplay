"use client"
import React from "react"

const categories = [
  { title: "Action", icon: "⚔️", color: "bg-[#ff4757]" },
  { title: "Racing", icon: "🏎️", color: "bg-[#3742fa]" },
  { title: "Office", icon: "🏢", color: "bg-[#2ed573]" },
  { title: "Puzzle", icon: "🧠", color: "bg-[#ffa502]" },
  { title: "Girls", icon: "👗", color: "bg-[#ef5777]" },
  { title: "Sports", icon: "⚽", color: "bg-[#1e90ff]" },
  { title: "Adventure", icon: "🗺️", color: "bg-[#05c46b]" },
  { title: "Strategy", icon: "🏰", color: "bg-[#575fcf]" },
]

export default function CategoryTiles() {
  return (
    <section className="max-w-7xl mx-auto my-10 px-4">
      <h2 className="text-xl font-black text-[#1f1f1f] mb-6 italic uppercase tracking-wider">
        POPULAR CATEGORIES
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {categories.map((cat, i) => (
          <div key={i} className={`${cat.color} aspect-[4/3] rounded-3xl flex flex-col items-center justify-center cursor-pointer shadow-lg hover:scale-105 transition-transform group`}>
            <span className="text-3xl mb-2 group-hover:animate-bounce">{cat.icon}</span>
            <span className="text-white font-bold text-sm">{cat.title}</span>
          </div>
        ))}
      </div>
    </section>
  )
}