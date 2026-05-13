"use client"
import React from "react"
import { Search, User } from "lucide-react"
import Link from "next/link"

interface FixedHeaderProps {
  isHidden?: boolean;
}

export default function FixedHeader({ isHidden = false }: FixedHeaderProps) {
  if (isHidden) return null;

  return (
    <div className="
      fixed z-[999] transition-all duration-300
      top-[16px] left-[10px]

      /* PC: KÍCH THƯỚC 2x1 TRÊN LƯỚI 17 CỘT */
      lg:w-[calc((100vw-180px)/17*2+10px)]
      lg:h-[calc((100vw-180px)/17)]

      /* MOBILE: KÍCH THƯỚC 1x1 CHUẨN (Khớp lưới 3 cột) */
      w-[calc((100vw-40px)/3)]
      h-[calc((100vw-40px)/3)]

      bg-white rounded-xl lg:rounded-2xl shadow-xl overflow-hidden flex border border-slate-100
      lg:hover:shadow-2xl lg:hover:-translate-y-1 lg:hover:scale-[1.01]
    ">
      <Link href="/" className="flex w-full h-full">
        {/* VÙNG LOGO: ĐÃ LOẠI BỎ PADDING VÀ ĐỔI SANG OBJECT-COVER ĐỂ FULL ẢNH */}
        <div className="flex-[3] lg:flex-grow h-full bg-white relative overflow-hidden">
           <img 
              src="https://i.postimg.cc/90jcyNBT/Thiet-ke-chua-co-ten-(1).png" 
              alt="AFKplay" 
              className="w-full h-full object-cover block" 
           />
        </div>

        {/* VÙNG ICON: GIỮ NGUYÊN CẤU TRÚC */}
        <div className="flex-1 lg:w-[48px] flex flex-col h-full border-l border-slate-100 bg-white">
          <div className="h-1/2 flex items-center justify-center transition-colors duration-200 hover:bg-slate-100 group cursor-pointer">
            <User className="text-blue-600 w-4 h-4 lg:w-5 lg:h-5 transition-transform group-hover:scale-110" />
          </div>

          <div className="h-1/2 flex items-center justify-center transition-colors duration-200 hover:bg-slate-100 border-t border-slate-100 group cursor-pointer">
            <Search className="text-blue-600 w-4 h-4 lg:w-5 lg:h-5 transition-transform group-hover:scale-110" />
          </div>
        </div>
      </Link>
    </div>
  )
}