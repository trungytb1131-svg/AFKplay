"use client"
import React from "react"

export default function GameGridContainer({ children }: { children: React.ReactNode }) {
  return (
    // md:grid-cols-18: Desktop giữ nguyên 18 cột (như ảnh image_88a9ec.png bạn gửi trước đó)
    // grid-cols-3: Mobile là 3 cột
    // bg-[#adecf5]: Màu nền xanh nước biển Poki
    <div className="grid grid-cols-3 md:grid-cols-18 grid-flow-dense gap-3 p-3 bg-[#adecf5] min-h-screen">
      {children}
    </div>
  )
}