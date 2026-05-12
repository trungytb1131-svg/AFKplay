"use client"
import React from "react"
import Link from "next/link"
import { User, Search } from "lucide-react"

export default function AdaptiveHeader() {
  return (
    // Sticky top-0 giúp logo luôn ghim ở đầu trang khi cuộn
    <div className="col-span-3 md:col-span-4 row-span-2 sticky top-0 z-50 bg-white rounded-[2rem] shadow-md flex border border-gray-100 overflow-hidden h-full">
      {/* Phần Logo */}
      <Link href="/" className="flex-[2] flex items-center justify-center border-r border-gray-50 hover:bg-gray-50 transition-colors">
         <img src="https://upload.wikimedia.org/wikipedia/commons/4/42/Poki_logo_2018.png" className="w-20 md:w-28 object-contain" alt="Poki" />
      </Link>
      
      {/* Phần Nút bấm */}
      <div className="flex-1 flex flex-col">
        <button className="flex-1 flex items-center justify-center border-b border-gray-50 hover:bg-gray-50"><User size={20} className="text-[#008cff]" /></button>
        <button className="flex-1 flex items-center justify-center hover:bg-gray-50"><Search size={20} className="text-[#008cff]" /></button>
      </div>
    </div>
  )
}