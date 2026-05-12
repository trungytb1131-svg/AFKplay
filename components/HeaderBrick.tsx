"use client"
import React from "react"
import Link from "next/link"
import { User, Search } from "lucide-react"

export default function HeaderBrick() {
  return (
    <div className="col-span-4 row-span-2 bg-white rounded-2xl flex shadow-md overflow-hidden border-b-4 border-[#ff4757]">
      {/* Phần 1: Logo (Chiếm diện tích lớn nhất) */}
      <Link href="/" className="flex-[2] flex flex-col items-center justify-center hover:bg-gray-50 transition-colors border-r border-gray-100 group">
        <div className="w-10 h-10 bg-[#ff4757] rounded-lg flex items-center justify-center mb-1 group-hover:rotate-12 transition-transform shadow-md">
          <span className="text-white font-black text-xl italic">P</span>
        </div>
        <span className="text-[#1f1f1f] font-black text-[10px] tracking-tighter uppercase">Poki Clone</span>
      </Link>

      {/* Phần 2: Nút Đăng nhập (Phần nhỏ 1) */}
      <button className="flex-1 flex items-center justify-center hover:bg-gray-50 transition-colors border-r border-gray-100 group">
        <div className="p-2 bg-[#2ecc71] rounded-full text-white group-hover:scale-110 transition-transform">
          <User size={20} />
        </div>
      </button>

      {/* Phần 3: Nút Tìm kiếm (Phần nhỏ 2) */}
      <button className="flex-1 flex items-center justify-center hover:bg-gray-50 transition-colors group">
        <div className="p-2 bg-gray-100 rounded-full text-gray-600 group-hover:scale-110 transition-transform">
          <Search size={20} />
        </div>
      </button>
    </div>
  )
}