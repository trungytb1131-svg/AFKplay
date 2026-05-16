"use client"
import React from "react";

export default function AboutGame() {
  return (
    <div className="w-full bg-white rounded-[2rem] lg:rounded-[3rem] p-6 lg:p-12 shadow-sm border border-slate-100 flex flex-col gap-10">
      
      {/* 1. PHẦN ĐẦU (Tên game, Rating) */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div className="space-y-2">
          <div className="h-4 w-32 bg-slate-100 rounded-full animate-pulse" /> {/* Breadcrumb placeholder */}
          <div className="h-12 w-64 lg:w-96 bg-slate-200 rounded-2xl animate-pulse" /> {/* Title placeholder */}
          <div className="h-4 w-24 bg-slate-100 rounded-full animate-pulse" /> {/* Author placeholder */}
        </div>
        
        {/* Rating Box Placeholder */}
        <div className="w-32 h-16 bg-slate-50 rounded-2xl border border-slate-100 animate-pulse" />
      </div>

      {/* 2. NỘI DUNG CHÍNH (Văn bản bên trái, Ảnh bên phải) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Cột văn bản */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-3">
            <div className="h-6 w-48 bg-slate-200 rounded-lg animate-pulse" />
            <div className="h-4 w-full bg-slate-100 rounded-lg animate-pulse" />
            <div className="h-4 w-full bg-slate-100 rounded-lg animate-pulse" />
            <div className="h-4 w-2/3 bg-slate-100 rounded-lg animate-pulse" />
          </div>
          <div className="space-y-3">
            <div className="h-6 w-40 bg-slate-200 rounded-lg animate-pulse" />
            <div className="h-4 w-full bg-slate-100 rounded-lg animate-pulse" />
            <div className="h-4 w-5/6 bg-slate-100 rounded-lg animate-pulse" />
          </div>
        </div>
        
        {/* Cột ảnh minh họa */}
        <div className="lg:col-span-5">
          <div className="aspect-square w-full bg-slate-100 rounded-[2rem] border-8 border-slate-50 animate-pulse shadow-inner" />
        </div>
      </div>

      {/* 3. PHẦN ĐIỀU KHIỂN (Controls) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-24 bg-slate-50 rounded-3xl border border-slate-100 animate-pulse" />
        <div className="h-24 bg-slate-50 rounded-3xl border border-slate-100 animate-pulse" />
      </div>

      {/* 4. PHẦN THẺ (Tags) */}
      <div className="flex flex-wrap gap-2 pt-6 border-t border-slate-100">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-8 w-20 bg-slate-100 rounded-full animate-pulse" />
        ))}
      </div>
    </div>
  );
}