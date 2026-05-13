"use client"
import React, { useState, useRef } from "react"
import Link from "next/link"

interface Game {
  id: string;
  image?: string;
  videoUrl?: string;
  slug?: string;
}

interface GameCardProps {
  game: Game;
  isExpanded?: boolean;
  onLongPress?: (id: string) => void;
}

export default function GameCard({ game, isExpanded, onLongPress }: GameCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Video mặc định nếu game không có videoUrl riêng
  const videoSrc = game.videoUrl || "https://static.pokicdn.com/cdn-cgi/image/quality=85,width=200,height=200,fit=cover,g=0.5x0.5,f=auto/spr/previews/200x200/subway-surfers.mp4";

  const handleTouchStart = () => {
    if (isExpanded) return;
    timerRef.current = setTimeout(() => onLongPress?.(game.id), 600);
  };

  const handleTouchEnd = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  return (
    <div 
      className={`relative w-full h-full rounded-xl lg:rounded-2xl overflow-hidden bg-white shadow-lg transition-all duration-300
        lg:hover:shadow-2xl lg:hover:-translate-y-1 lg:hover:scale-[1.02]
        ${isExpanded ? "ring-4 ring-white/50 z-50 shadow-2xl" : ""}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ĐƯỜNG DẪN CHUẨN: Luôn trỏ về /play/ để khớp với app/play/[slug] */}
      <Link href={`/play/${game.slug || game.id}`} className="block w-full h-full">
        <div className="w-full h-full relative">
          {((isHovered && !isExpanded) || isExpanded) ? (
            <video 
              src={videoSrc} 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="w-full h-full object-cover" 
            />
          ) : (
            <img 
              src={game.image || `https://picsum.photos/400/400?random=${game.id}`} 
              className="w-full h-full object-cover" 
              alt={game.slug || "game preview"}
            />
          )}
        </div>
      </Link>
    </div>
  );
}