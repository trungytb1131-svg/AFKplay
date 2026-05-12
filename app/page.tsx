"use client";
import { BuilderComponent } from "@builder.io/react";
import { builder } from "@builder.io/sdk";
import "../builder-registry"; 

// API Key chuẩn của bạn
builder.init("036b47464eae4b0db4017daca87b8339");

export default function Home() {
  return (
    <main className="min-h-screen bg-[#adecf5] p-10">
      <div className="max-w-6xl mx-auto min-h-[600px] border-4 border-dashed border-red-500 bg-white/30">
        {/* Dòng này nằm ở đây để hứng dữ liệu từ Builder.io đổ xuống */}
        <BuilderComponent model="page" />
      </div>
    </main>
  );
}