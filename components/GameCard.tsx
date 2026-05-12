// components/GameCard.tsx
"use client"
import React from "react"

interface GameCardProps {
  title?: string;
  image?: string;
  link?: string;
  className?: string; // Đây là nơi Builder.io sẽ truyền col-span/row-span vào
}

export default function GameCard({ 
  title = "New Game", 
  image = "https://via.placeholder.com/150", 
  className = "col-span-1 row-span-1" 
}: GameCardProps) {
  return (
    <div className={`${className} aspect-square bg-white rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:ring-4 hover:ring-[#ff4757] transition-all relative group h-full w-full`}>
      <img src={image} className="w-full h-full object-cover group-hover:scale-110 transition-all" alt={title} />
      {/* Overlay tên game khi hover */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <span className="text-white font-bold text-xs px-2 text-center">{title}</span>
      </div>
    </div>
  )
}