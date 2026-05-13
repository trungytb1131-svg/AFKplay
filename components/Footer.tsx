"use client"
import React from "react"

export default function Footer() {
  return (
    <footer className="w-full bg-[#0f172a] text-slate-400 py-12 px-6 rounded-t-[3rem]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="col-span-1 md:col-span-1">
          <img src="https://i.postimg.cc/90jcyNBT/Thiet-ke-chua-co-ten-(1).png" className="h-10 mb-4 object-contain" alt="AFKplay" />
          <p className="text-sm">Your ultimate gaming destination. Discover, play, and share thousands of games.</p>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">Games</h4>
          <ul className="text-sm space-y-2">
            <li>Action Games</li>
            <li>Strategy Games</li>
            <li>RPG & Adventure</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">Support</h4>
          <ul className="text-sm space-y-2">
            <li>Help Center</li>
            <li>FAQ</li>
            <li>Report Bug</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">Social</h4>
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-500 cursor-pointer transition-colors italic font-serif">f</div>
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-500 cursor-pointer transition-colors italic font-serif">y</div>
          </div>
        </div>
      </div>
      <div className="mt-10 pt-6 border-t border-slate-800 text-center text-xs">
        © 2026 AFKplay.net - All Rights Reserved.
      </div>
    </footer>
  )
}