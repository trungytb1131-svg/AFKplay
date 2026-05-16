"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { use } from "react";
import Footer from "@/components/Footer";
import GameCard from "@/components/GameCard";
import CategoryCard from "@/components/CategoryCard";
import PortalLogo from "@/components/PortalLogo";
import UserHeader from "@/components/UserHeader";
import FixedPortalSidebar from "@/components/FixedPortalSidebar";
import UserActivityBar from "@/components/UserActivityBar";
import { CATEGORIES_28 } from "@/data/categories";
import { useGames } from "@/hooks/useGames";
import { ChevronLeft } from "lucide-react";
import type { Game } from "@/types/game";

export default function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { games } = useGames();
  const category = CATEGORIES_28.find((c) => c.slug === slug);
  const catIndex = CATEGORIES_28.findIndex((c) => c.slug === slug);

  // Filter games by category_id (real data from Supabase)
  const categoryGames = useMemo(
    () => games.filter((g) => g.category_id === slug),
    [games, slug],
  );

  const otherCategories = useMemo(() => {
    const others = CATEGORIES_28.filter((c) => c.slug !== slug);
    return [...others].sort(() => Math.random() - 0.5).slice(0, 10);
  }, [slug]);

  // Xen kẽ category block (2x2 cat + 1x1 game) sau mỗi 6 game
  const mobileItems = useMemo(() => {
    type Item =
      | { type: "game"; game: Game }
      | {
          type: "categoryBlock";
          cat: (typeof CATEGORIES_28)[number];
          game: Game;
        };

    const items: Item[] = [];
    let catIdx = 0;
    let gameIdx = 0;

    for (const game of categoryGames) {
      items.push({ type: "game", game });
      gameIdx++;

      // Sau mỗi 6 game, chèn 1 khối danh mục
      if (gameIdx % 6 === 0 && catIdx < otherCategories.length) {
        const nextGame = categoryGames[gameIdx] || categoryGames[0];
        items.push({
          type: "categoryBlock",
          cat: otherCategories[catIdx],
          game: nextGame,
        });
        catIdx++;
      }
    }

    return items;
  }, [categoryGames, otherCategories]);

  return (
    <main className="min-h-screen bg-[#adecf5] p-[10px] lg:p-[16px] flex flex-col gap-[10px]">
      {/* ========== DESKTOP ========== */}
      <div className="hidden lg:contents">
        <FixedPortalSidebar />
        <UserActivityBar />

        <div className="grid grid-cols-17 gap-[10px] w-full">
          <div className="col-span-2 invisible" aria-hidden />
          <div className="col-span-5 aspect-[5/1]">
            <CategoryCard category={category!} isSquare={false} />
          </div>
          {otherCategories.slice(0, 5).map((cat) => (
            <div key={cat.slug} className="col-span-2 aspect-[2/1]">
              <CategoryCard category={cat} isSquare={false} />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-17 gap-[10px] w-full">
          {/* Cột 1-2 luôn trống trên mọi hàng */}
          <div className="col-span-2 [grid-row:1/span_999]" aria-hidden />
          {categoryGames.map((game) => (
            <div key={game.id} className="col-span-2 aspect-square">
              <GameCard game={game} />
            </div>
          ))}
        </div>

        <div className="w-full bg-white rounded-[2rem] lg:rounded-[3rem] p-6 lg:p-10 shadow-sm border border-slate-100">
          <h2
            className="text-2xl lg:text-3xl font-black mb-4 uppercase italic"
            style={{ color: category?.color ?? "#334155" }}
          >
            {category?.icon} {category?.name ?? slug} Games
          </h2>
          <p className="text-slate-600 leading-relaxed text-sm lg:text-base">
            Discover the best <strong>{category?.name ?? slug}</strong> games on
            AFKplay. Play thousands of free online {category?.name ?? slug}{" "}
            games directly in your browser — no downloads, no logins, just
            instant fun.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {otherCategories.slice(0, 4).map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="px-4 py-2 rounded-full text-xs font-black uppercase text-white hover:scale-105 transition-transform"
                style={{ backgroundColor: cat.color }}
              >
                {cat.icon} {cat.name}
              </Link>
            ))}
          </div>
        </div>

        <Footer />
      </div>

      {/* ========== MOBILE ========== */}
      <div className="lg:hidden flex flex-col gap-[10px]">
        {/* Logo(1x1) + UserHeader(2x1) */}
        <div className="flex gap-[10px] w-full">
          <div className="w-[calc((100vw-40px)/3)] shrink-0">
            <PortalLogo />
          </div>
          <div className="flex-1 min-w-0">
            <UserHeader />
          </div>
        </div>

        <UserActivityBar />

        {/* Danh mục hiện tại 3x1 */}
        <div className="aspect-[3/1]">
          <CategoryCard category={category!} isSquare={false} />
        </div>

        {/* Lưới game xen kẽ danh mục */}
        <div className="grid grid-cols-3 gap-[10px] w-full grid-flow-row-dense">
          {mobileItems.map((item, i) => {
            if (item.type === "game") {
              return (
                <div key={item.game.id} className="col-span-1 aspect-square">
                  <GameCard game={item.game} />
                </div>
              );
            }
            // categoryBlock: 2x2 cat + 1x1 game
            return (
              <React.Fragment key={`block-${i}`}>
                <div className="col-span-2 row-span-2">
                  <CategoryCard category={item.cat} isSquare />
                </div>
                <div className="col-span-1 aspect-square">
                  <GameCard game={item.game} />
                </div>
              </React.Fragment>
            );
          })}
        </div>

        {/* About */}
        <div className="w-full bg-white rounded-[2rem] p-5 shadow-sm border border-slate-100">
          <h2
            className="text-lg font-black mb-3 uppercase italic"
            style={{ color: category?.color ?? "#334155" }}
          >
            {category?.icon} {category?.name ?? slug} Games
          </h2>
          <p className="text-slate-600 leading-relaxed text-xs">
            Discover the best <strong>{category?.name ?? slug}</strong> games on
            AFKplay. Play thousands of free online {category?.name ?? slug}{" "}
            games directly in your browser.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {otherCategories.slice(0, 4).map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="px-3 py-1.5 rounded-full text-[10px] font-black uppercase text-white active:scale-95 transition-transform"
                style={{ backgroundColor: cat.color }}
              >
                {cat.icon} {cat.name}
              </Link>
            ))}
          </div>
        </div>

        <Footer />
      </div>
    </main>
  );
}
