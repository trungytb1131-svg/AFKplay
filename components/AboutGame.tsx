"use client";
import React from "react";
import Image from "next/image";
import type { Game } from "@/types/game";
import { CATEGORIES_28 } from "@/data/categories";

export default function AboutGame({ game }: { game: Game | null }) {
  if (!game) {
    return (
      <div className="w-full bg-white rounded-[2rem] lg:rounded-[3rem] p-6 lg:p-12 shadow-sm flex items-center justify-center">
        <p className="text-slate-400 text-sm">Loading game info...</p>
      </div>
    );
  }

  const category = CATEGORIES_28.find((c) => c.slug === game.category_id);
  const tags = game.tags?.slice(0, 8) ?? [];
  const desc = game.description || "No description available for this game.";
  const instructions = game.instructions || "Use mouse or touch to play.";

  return (
    <div className="w-full bg-white rounded-[2rem] lg:rounded-[3rem] p-6 lg:p-12 shadow-sm border border-slate-100 flex flex-col gap-8">
      {/* 1. Header: Tên game + Category + Rating */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4">
        <div className="space-y-1 min-w-0">
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">
            {category?.icon} {category?.name || game.category_id}
          </p>
          <h2 className="text-xl lg:text-3xl font-black uppercase italic text-slate-900 leading-tight">
            {game.title}
          </h2>
          <p className="text-xs text-slate-500">
            Tags: {tags.length > 0 ? tags.join(", ") : "General"}
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-2 bg-yellow-50 rounded-2xl px-4 py-2 border border-yellow-100">
          <span className="text-yellow-500 text-lg">★</span>
          <span className="text-sm font-bold text-slate-700">4.2</span>
        </div>
      </div>

      {/* 2. Mô tả + Ảnh thumbnail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-5">
          <div>
            <h3 className="text-base font-black uppercase text-slate-800 mb-2">
              Description
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {desc}
            </p>
          </div>
          <div>
            <h3 className="text-base font-black uppercase text-slate-800 mb-2">
              How to Play
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {instructions}
            </p>
          </div>
        </div>
        <div className="lg:col-span-5">
          {game.thumb ? (
            <div className="aspect-video w-full relative rounded-2xl overflow-hidden bg-slate-100 border-4 border-slate-50 shadow-inner">
              <Image
                src={game.thumb}
                alt={game.title}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          ) : (
            <div className="aspect-video w-full bg-slate-100 rounded-2xl border-4 border-slate-50 flex items-center justify-center">
              <span className="text-slate-400 text-xs">No preview</span>
            </div>
          )}
        </div>
      </div>

      {/* 3. Game Info */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-slate-50 rounded-2xl p-4 text-center">
          <p className="text-[10px] font-black uppercase text-slate-400">
            Source
          </p>
          <p className="text-sm font-bold text-slate-700 capitalize">
            {game.source}
          </p>
        </div>
        <div className="bg-slate-50 rounded-2xl p-4 text-center">
          <p className="text-[10px] font-black uppercase text-slate-400">
            Category
          </p>
          <p className="text-sm font-bold text-slate-700">
            {category?.name || game.category_id}
          </p>
        </div>
        <div className="bg-slate-50 rounded-2xl p-4 text-center">
          <p className="text-[10px] font-black uppercase text-slate-400">
            Resolution
          </p>
          <p className="text-sm font-bold text-slate-700">
            {game.width}×{game.height}
          </p>
        </div>
        <div className="bg-slate-50 rounded-2xl p-4 text-center">
          <p className="text-[10px] font-black uppercase text-slate-400">
            Platform
          </p>
          <p className="text-sm font-bold text-slate-700">Browser</p>
        </div>
      </div>

      {/* 4. Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold uppercase tracking-wide"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
