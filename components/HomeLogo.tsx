"use client"
import React from "react"
import Link from "next/link"

export default function HomeLogo() {
  return (
    <Link href="/" className="col-span-2 row-span-2 bg-white rounded-2xl flex flex-col items-center justify-center shadow-md hover:scale-105 transition-all group border-b-4 border-[#ff4757]">
      <div className="w-12 h-12 bg-[#ff4757] rounded-xl flex items-center justify-center mb-1 shadow-lg group-hover:rotate-12 transition-transform">
        <span className="text-white font-black text-2xl italic">P</span>
      </div>
      <span className="text-[#1f1f1f] font-black text-[10px] tracking-tighter">POKI CLONE</span>
    </Link>
  )
}