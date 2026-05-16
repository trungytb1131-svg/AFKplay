"use client"
import React from "react"

// 1. Skeleton cho ô Game (GameCard)
export const GameCardSkeleton = () => (
  <div className="w-full h-full rounded-2xl bg-slate-200 animate-pulse border-4 border-white/20" />
)

// 2. Skeleton cho ô Danh mục (CategoryCard)
export const CategoryCardSkeleton = ({ isSquare }: { isSquare?: boolean }) => (
  <div className={`
    w-full h-full animate-pulse shadow-sm border-b-4 border-black/5
    ${isSquare ? 'rounded-[2rem] bg-slate-200' : 'rounded-2xl bg-slate-200'}
  `} />
)

// 3. Skeleton cho toàn bộ lưới Game (Dùng ở Trang chủ)
export const GameGridSkeleton = () => {
  return (
    <div className="grid gap-[10px] grid-cols-3 lg:grid-cols-17 auto-rows-[calc((100vw-40px)/3)] lg:auto-rows-[calc((100vw-180px)/18)]">
      {/* Chừa chỗ cho Logo y hệt giao diện thật */}
      <div className="invisible col-span-1 lg:col-span-2 lg:row-span-1" />
      
      {/* Mô phỏng các ô game 1x1, 2x2, 3x3 như thật */}
      <div className="hidden lg:block lg:col-span-3 lg:row-span-3"><GameCardSkeleton /></div>
      <div className="lg:col-span-2 lg:row-span-2"><GameCardSkeleton /></div>
      {Array.from({ length: 40 }).map((_, i) => (
        <div key={i} className="col-span-1 row-span-1">
          <GameCardSkeleton />
        </div>
      ))}
    </div>
  )
}