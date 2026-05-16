"use client";

import React, {
  use,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Maximize,
  Minimize,
  ChevronLeft,
  Play,
  Volume2,
  Heart,
  Share2,
  MonitorPlay,
  X,
  RotateCcw,
} from "lucide-react";
import { useActivity } from "@/contexts/ActivityContext";
import { useProfile } from "@/contexts/ProfileContext";
import UserActivityBar from "@/components/UserActivityBar";
import PortalLogo from "@/components/PortalLogo";
import UserHeader from "@/components/UserHeader";
import PlayerHubWidget from "@/components/PlayerHubWidget";
import FixedPortalSidebar from "@/components/FixedPortalSidebar";
import GameCard from "@/components/GameCard";
import CategoryCard from "@/components/CategoryCard";
import AboutGame from "@/components/AboutGame";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";
import PlaySidebarSpacer from "@/components/PlaySidebarSpacer";
import { useGames } from "@/hooks/useGames";
import { CATEGORIES_28 } from "@/data/categories";

export default function PlayPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [isPlaying] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [volume, setVolume] = useState(50);
  const { favorites, toggleFavorite, trackPlay, isHearted } = useActivity();
  const { trackPlayTime } = useProfile();
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const mobileContainerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { games } = useGames();
  const currentGame = useMemo(
    () => games.find((g) => g.slug === slug),
    [games, slug],
  );
  const gameUrl = currentGame?.url || "";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    trackPlay(slug);
  }, [slug, trackPlay]);

  const favorited = mounted && isHearted(slug);

  // Theo dõi thời gian chơi game → thưởng sao (mỗi 10s báo cáo)
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      trackPlayTime(10000);
    }, 10000);
    return () => clearInterval(interval);
  }, [isPlaying, trackPlayTime]);

  // Theo dõi fullscreen change
  useEffect(() => {
    const handler = () => {
      const fs = !!document.fullscreenElement;
      setIsFullScreen(fs);
      if (!fs) {
        setShowControls(true);
        try {
          screen.orientation.unlock();
        } catch {}
      }
    };
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const handleInteraction = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (isFullScreen) {
      controlsTimeoutRef.current = setTimeout(
        () => setShowControls(false),
        3000,
      );
    }
  };

  const toggleFullScreen = useCallback(async () => {
    const target = containerRef.current || mobileContainerRef.current;
    if (!document.fullscreenElement) {
      try {
        await target?.requestFullscreen();
        try {
          await (screen.orientation as any).lock("landscape");
        } catch {}
      } catch {}
    } else {
      try {
        await document.exitFullscreen();
        try {
          screen.orientation.unlock();
        } catch {}
      } catch {}
    }
  }, []);

  const handleReload = () => {
    const iframe = document.getElementById("game-iframe") as HTMLIFrameElement;
    if (iframe) iframe.src = iframe.src;
  };

  // Game cùng danh mục, trừ game hiện tại, lấy 15 game
  const relatedGames = useMemo(
    () =>
      games
        .filter((g) => {
          if (g.slug === slug) return false;
          return g.category_id === currentGame?.category_id;
        })
        .slice(0, 15),
    [slug, games, currentGame],
  );

  return (
    <main
      onMouseMove={handleInteraction}
      className={`min-h-screen bg-[#adecf5] p-[10px] lg:p-[16px] w-full flex flex-col gap-[10px] ${
        !showControls && isFullScreen ? "cursor-none" : ""
      }`}
    >
      {/* ========== DESKTOP: giữ nguyên layout cũ ========== */}
      <div className="hidden lg:contents">
        <FixedPortalSidebar hidden={isFullScreen} />
      </div>

      <div className="z-30 w-full">
        <UserActivityBar />
      </div>

      {/* --- GIAO DIỆN PC (17 CỘT) --- */}
      <div className="hidden lg:grid grid-cols-17 gap-[10px] w-full">
        <div
          className={`transition-all duration-700 ${
            isTheaterMode ? "col-span-17" : "col-span-12"
          } flex flex-col gap-[10px]`}
        >
          <div className="grid grid-cols-12 gap-[10px]">
            {!isTheaterMode && (
              <aside className="col-span-2 flex flex-col gap-[10px] shrink-0">
                <PlaySidebarSpacer />
                <div className="flex-1 min-h-[100px] w-full bg-white/30 flex items-center justify-center text-slate-400 font-bold italic text-[10px] uppercase rounded-2xl">
                  ADS
                </div>
              </aside>
            )}

            <section
              className={`${
                isTheaterMode ? "col-span-12" : "col-span-10"
              } flex flex-col gap-[10px]`}
            >
              {/* KHUNG GAME */}
              <div
                ref={containerRef}
                className={`relative bg-black border-white shadow-2xl overflow-hidden transition-all duration-500
                ${
                  isFullScreen
                    ? "border-none rounded-none w-full h-full"
                    : "border-[6px] rounded-[2.5rem] aspect-video"
                }`}
              >
                <iframe
                  id="game-iframe"
                  src={gameUrl}
                  className="w-full h-full border-none"
                  allowFullScreen
                  sandbox="allow-scripts allow-popups allow-forms"
                  allow="autoplay; fullscreen"
                />

                {/* THANH ĐIỀU KHIỂN KHI FULL SCREEN */}
                {isFullScreen && isPlaying && (
                  <div
                    className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-500 flex items-center gap-6 px-8 py-4 bg-black/40 backdrop-blur-xl border border-white/20 rounded-full z-[9999] shadow-2xl ${
                      showControls
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-10"
                    }`}
                  >
                    <span className="text-white font-black italic uppercase tracking-tighter text-lg border-r border-white/20 pr-6">
                      {slug}
                    </span>
                    <div className="flex items-center gap-3">
                      <Volume2 size={20} className="text-white/70" />
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={volume}
                        onChange={(e) => setVolume(parseInt(e.target.value))}
                        className="w-24 h-1.5 accent-[#ff4757] bg-white/20 rounded-full appearance-none cursor-pointer"
                      />
                    </div>
                    <button
                      onClick={handleReload}
                      className="text-white/70 hover:text-white"
                    >
                      <RotateCcw size={20} />
                    </button>
                    <button
                      onClick={toggleFullScreen}
                      className="bg-white/10 hover:bg-[#ff4757] text-white p-2 rounded-full"
                    >
                      <X size={24} />
                    </button>
                  </div>
                )}
              </div>

              {/* THANH ĐIỀU KHIỂN CHẾ ĐỘ THƯỜNG */}
              <div className="bg-white rounded-2xl p-4 flex justify-between items-center shadow-md">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleFavorite(slug)}
                    className={`p-2 rounded-xl ${
                      favorited
                        ? "bg-red-50 text-red-500"
                        : "bg-slate-50 text-slate-400"
                    }`}
                  >
                    <Heart
                      size={24}
                      fill={favorited ? "currentColor" : "none"}
                    />
                  </button>
                  <h1 className="text-xl font-black italic uppercase text-slate-800 tracking-tighter">
                    {slug.replace(/-/g, " ")}
                  </h1>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIsTheaterMode(!isTheaterMode)}
                    className={`p-2.5 rounded-xl ${
                      isTheaterMode
                        ? "bg-blue-500 text-white"
                        : "bg-slate-50 text-slate-400"
                    }`}
                  >
                    <MonitorPlay size={20} />
                  </button>
                  <button
                    onClick={() => {
                      if (navigator.share)
                        navigator.share({
                          title: slug,
                          url: window.location.href,
                        });
                    }}
                    className="p-2.5 bg-slate-50 text-slate-400 rounded-xl"
                  >
                    <Share2 size={20} />
                  </button>
                  <div className="h-8 w-[1px] bg-slate-100 mx-2" />
                  <Volume2 size={20} className="text-slate-400" />
                  <input type="range" className="w-24 accent-[#ff4757]" />
                  <button
                    onClick={toggleFullScreen}
                    className="bg-slate-800 text-white p-2.5 rounded-xl shadow-lg hover:bg-[#ff4757] transition-colors"
                  >
                    <Maximize size={20} />
                  </button>
                </div>
              </div>
              <div className="w-full aspect-[10/1] bg-white/50 border border-white/20 flex items-center justify-center text-slate-400 font-bold italic uppercase text-[10px]">
                ADS 10x1
              </div>
            </section>
          </div>
          <div className="grid grid-cols-12 gap-[10px] mt-2">
            {relatedGames.slice(0, 24).map((game) => (
              <div key={game.id} className="aspect-square">
                <GameCard game={game} />
              </div>
            ))}
          </div>
        </div>

        {/* SIDEBAR (5 CỘT) */}
        {!isTheaterMode && (
          <div className="col-span-5 flex flex-col gap-[10px]">
            <aside className="grid grid-cols-5 gap-[10px] auto-rows-min">
              {games.slice(0, 2).map((game) => (
                <div
                  key={game.id}
                  className="col-span-2 row-span-2 aspect-square"
                >
                  <GameCard game={game} />
                </div>
              ))}
              <div className="col-span-3 row-span-3 col-start-3 row-start-1 bg-white/40 border border-white/10 flex items-center justify-center text-xs font-bold text-slate-400 uppercase italic shadow-sm">
                ADS 3x3
              </div>
              {games.slice(2, 23).map((game) => (
                <div key={game.id} className="aspect-square">
                  <GameCard game={game} />
                </div>
              ))}
            </aside>
            <div className="w-full aspect-[4/1] bg-white/40 border border-white/10 flex items-center justify-center text-[10px] font-bold text-slate-400 uppercase italic shadow-sm">
              ADS 5x1.25
            </div>
          </div>
        )}
      </div>

      {/* Desktop: Categories, About, Footer — full 17 cột */}
      <div className="hidden lg:block mt-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-[10px] w-full">
          {CATEGORIES_28.map((cat) => (
            <div key={cat.slug} className="aspect-[2/1]">
              <CategoryCard category={cat} isSquare={false} />
            </div>
          ))}
        </div>
      </div>

      <div className="hidden lg:block w-full">
        <AboutGame />
      </div>

      <div className="hidden lg:block w-full">
        <Footer />
      </div>

      {/* ========== MOBILE ========== */}
      <div className="lg:hidden">
        {/* TOP BAR */}
        <div className="flex items-center justify-between px-3 py-2 bg-white/60 backdrop-blur-md border-b border-white/40 sticky top-0 z-50 -mx-[10px] -mt-[10px]">
          <Link
            href="/"
            className="flex items-center gap-1 p-1.5 -ml-1 rounded-xl hover:bg-white/60 transition-colors"
          >
            <ChevronLeft size={20} className="text-slate-700" />
          </Link>

          <h1 className="text-sm font-black uppercase italic tracking-tighter text-slate-800 truncate mx-2 flex-1 text-center">
            {slug.replace(/-/g, " ")}
          </h1>

          <button
            onClick={toggleFullScreen}
            className="p-1.5 -mr-1 rounded-xl hover:bg-white/60 transition-colors text-slate-700"
            aria-label={isFullScreen ? "Thu nhỏ" : "Toàn màn hình"}
          >
            {isFullScreen ? <Minimize size={20} /> : <Maximize size={20} />}
          </button>
        </div>

        {/* KHU VỰC GAME */}
        <div
          ref={mobileContainerRef}
          className={`relative bg-black w-full overflow-hidden ${
            isFullScreen ? "h-screen fixed inset-0 z-[300]" : "aspect-video"
          }`}
        >
          <iframe
            id="game-iframe-mobile"
            src={gameUrl}
            className="w-full h-full border-none"
            allowFullScreen
            sandbox="allow-scripts allow-popups allow-forms"
            allow="autoplay; fullscreen"
          />

          {/* Nút thu nhỏ trong suốt khi fullscreen */}
          {isFullScreen && (
            <button
              onClick={toggleFullScreen}
              className="absolute top-4 left-4 z-50 p-3 rounded-full bg-white/10 backdrop-blur-sm text-white/60 hover:bg-white/20 hover:text-white/90 transition-all active:scale-90"
              aria-label="Thu nhỏ"
            >
              <Minimize size={22} />
            </button>
          )}
        </div>

        {/* LOGO + USERHEADER */}
        <div className="mt-[10px]">
          <div className="flex gap-[10px] w-full">
            <div className="w-[calc((100vw-40px)/3)] shrink-0">
              <PortalLogo />
            </div>
            <div className="flex-1 min-w-0">
              <PlayerHubWidget />
            </div>
          </div>
        </div>

        {/* USER ACTIVITY BAR */}
        <div className="mt-[10px]">
          <UserActivityBar />
        </div>

        {/* QUẢNG CÁO 3x0.5 */}
        <div className="mt-[10px]">
          <div className="w-full bg-white/40 border border-white/20 flex items-center justify-center text-slate-400 font-bold italic uppercase text-[10px] aspect-[6/1] rounded-none">
            ADS
          </div>
        </div>

        {/* RELATED GAMES */}
        {relatedGames.length > 0 && (
          <div className="mt-4">
            <h2 className="text-xs font-black uppercase italic tracking-tighter text-slate-800 mb-2 px-1">
              More Like This
            </h2>
            <div className="grid grid-cols-3 gap-[10px] w-full">
              {relatedGames.map((game) => (
                <div key={game.id} className="aspect-square">
                  <GameCard game={game} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TOP CATEGORIES */}
        <div className="mt-6">
          <h2 className="text-xs font-black uppercase italic tracking-tighter text-slate-800 mb-2 px-1">
            Categories
          </h2>
          <div className="grid grid-cols-7 gap-[6px] w-full">
            {CATEGORIES_28.map((cat) => (
              <div key={cat.slug} className="aspect-[2/1]">
                <CategoryCard category={cat} isSquare={false} />
              </div>
            ))}
          </div>
        </div>

        {/* ABOUT */}
        <div className="mt-6">
          <AboutSection />
        </div>

        {/* FOOTER */}
        <div className="mt-4">
          <Footer />
        </div>
      </div>
    </main>
  );
}
