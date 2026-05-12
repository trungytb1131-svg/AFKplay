"use client"

import React from "react"
import { Search, User, Menu } from "lucide-react"

export default function FixedHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-[#1f1f1f] border-b-2 border-[#ff4757] flex items-center justify-between px-4 z-50 shadow-lg">
      {/* Logo bên trái */}
      <div className="flex items-center gap-2 cursor-pointer group">
        <div className="w-10 h-10 bg-[#ff4757] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(255,71,87,0.5)]">
          <span className="text-white font-bold text-xl italic">P</span>
        </div>
        <span className="text-white font-black text-2xl tracking-tighter hidden md:block">POKI CLONE</span>
      </div>

      {/* Thanh tìm kiếm và nút bấm */}
      <div className="flex items-center gap-3">
        <div className="relative hidden sm:block">
          <input 
            type="text" 
            placeholder="Tìm game..." 
            className="bg-[#2f2f2f] text-white border-none rounded-full py-2 px-10 focus:ring-2 focus:ring-[#ff4757] outline-none w-64"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
        </div>
        <button className="bg-[#2ecc71] hover:bg-[#27ae60] text-white p-2 rounded-full transition-colors">
          <User className="w-6 h-6" />
        </button>
        <button className="text-white p-2 md:hidden">
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </header>
  )
}