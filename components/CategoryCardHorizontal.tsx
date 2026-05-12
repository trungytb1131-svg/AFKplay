"use client"
import React from "react"

export default function CategoryCardHorizontal({ title = "Category", icon = "🎮" }) {
  return (
    <div className="col-span-3 md:col-span-2 h-16 bg-white rounded-xl flex items-center p-2 gap-3 cursor-pointer hover:bg-[#ff4757] hover:text-white transition-all shadow-sm group border border-gray-100">
      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl group-hover:bg-white/20">
        {icon}
      </div>
      <span className="font-bold text-sm uppercase tracking-tight">{title}</span>
    </div>
  )
}