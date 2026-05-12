"use client";
import { Builder, withChildren } from "@builder.io/react";
import GameCard from "./components/GameCard";
import GameGridContainer from "./components/GameGridContainer";
import LogoBrickSquare from "./components/LogoBrickSquare";

// 1. Đăng ký GameGridContainer (Thùng chứa)
Builder.registerComponent(withChildren(GameGridContainer), {
  name: "GameGridContainer",
  canHaveChildren: true,
  inputs: [
    {
      name: "className",
      type: "string",
      defaultValue: "grid grid-cols-3 md:grid-cols-6 gap-3 p-3",
    },
  ],
});

// 2. Đăng ký GameCard (Ô game lẻ)
Builder.registerComponent(GameCard, {
  name: "GameCard",
  inputs: [
    { name: "title", type: "string", defaultValue: "Tên Game" },
    { name: "image", type: "file", allowedFileTypes: ["jpeg", "jpg", "png", "webp"] },
    { name: "link", type: "url", defaultValue: "#" },
    { 
      name: "className", 
      type: "string", 
      defaultValue: "col-span-1 row-span-1",
      helperText: "Dùng col-span-2 cho ô to" 
    },
  ],
});

// 3. Đăng ký Logo (Nếu cần)
Builder.registerComponent(LogoBrickSquare, {
  name: "LogoBrickSquare",
});