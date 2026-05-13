import React from "react";
import Link from "next/link";
import { ChevronLeft, Maximize, Share2 } from "lucide-react";

interface PlayPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PlayPage(props: PlayPageProps) {
  const { slug } = await props.params;
  
  // Đây là nơi bạn sẽ dán link nhúng game. 
  // Sau này bạn có thể đưa phần này vào một file data riêng hoặc gọi từ API.
  const gameDatabase: { [key: string]: string } = {
    "subway-surfers": "https://games.poki.com/458741/subway-surfers",
    "monkey-mart": "https://games.poki.com/458741/monkey-mart",
    "drive-mad": "https://games.poki.com/458741/drive-mad",
  };

  const gameUrl = gameDatabase[slug] || `https://games.poki.com/458741/${slug}`; // Link dự phòng

  return (
    <main className="min-h-screen bg-[#adecf5] flex flex-col">
      {/* Thanh điều hướng nhanh trên cùng */}
      <div className="w-full p-4 flex justify-between items-center bg-white/50 backdrop-blur-md sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2 font-black text-[#1f1f1f] hover:text-[#ff4757] transition-colors">
          <ChevronLeft /> TRANG CHỦ
        </Link>
        <div className="flex gap-4">
          <button className="p-2 bg-white rounded-full shadow-sm hover:scale-110 transition-transform">
            <Share2 size={20} className="text-slate-600" />
          </button>
        </div>
      </div>

      <div className="flex-grow flex flex-col items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-5xl group relative">
          {/* Khung chơi game */}
          <div className="aspect-video w-full bg-black rounded-2xl lg:rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden border-[6px] border-white relative">
            <iframe 
              src={gameUrl}
              className="w-full h-full border-none"
              allow="autoplay; gamepad; fullscreen"
            />
          </div>

          {/* Nút bấm chức năng dưới khung game */}
          <div className="mt-6 flex justify-between items-end px-4">
            <div>
              <h1 className="text-3xl lg:text-5xl font-[1000] uppercase italic tracking-tighter text-[#1f1f1f] drop-shadow-sm">
                {slug.replace(/-/g, ' ')}
              </h1>
              <div className="flex gap-2 mt-2">
                <span className="bg-white px-3 py-1 rounded-full text-xs font-bold text-slate-500 shadow-sm">#TRENDING</span>
                <span className="bg-[#ff4757] px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm">HOT GAME</span>
              </div>
            </div>
            
            <button className="bg-[#1f1f1f] text-white p-4 rounded-2xl shadow-xl hover:bg-[#ff4757] transition-all hover:scale-105 active:scale-95 flex items-center gap-2 font-bold">
              <Maximize size={24} /> PHÓNG TO
            </button>
          </div>
        </div>
      </div>

      {/* Phần footer trang game */}
      <div className="w-full p-10 text-center opacity-30 font-bold text-slate-900">
        AFKPLAY.NET - PLAY UNLIMITED GAMES
      </div>
    </main>
  );
}