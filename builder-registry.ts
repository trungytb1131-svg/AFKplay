"use client";

import { Builder, withChildren } from "@builder.io/react";

// Import các component từ v0.dev
import GameCard from "./components/GameCard";
import GameGridContainer from "./components/GameGridContainer";
import LogoBrickSquare from "./components/LogoBrickSquare";
import CategoryTiles from "./components/CategoryTiles";
import Footer from "./components/Footer";

// ==================== REGISTER COMPONENTS ====================

// 1. GameCard
Builder.registerComponent(GameCard, {
  name: "GameCard",
  inputs: [
    {
      name: "title",
      type: "string",
      defaultValue: "New Game Title",
    },
    {
      name: "image",
      type: "file",
      allowedFileTypes: ["jpeg", "jpg", "png", "webp"],
      defaultValue: "https://via.placeholder.com/400x225",
    },
    {
      name: "className",
      type: "string",
      defaultValue: "",
      helperText: "Thêm className tùy chỉnh (ví dụ: col-span-2)",
    },
  ],
});

// 2. GameGridContainer (Container quan trọng)
Builder.registerComponent(withChildren(GameGridContainer), {
  name: "GameGridContainer",
  canHaveChildren: true,
  inputs: [],
});

// 3. LogoBrickSquare
Builder.registerComponent(LogoBrickSquare, {
  name: "LogoBrickSquare",
});

// 4. CategoryTiles
Builder.registerComponent(CategoryTiles, {
  name: "CategoryTiles",
});

// 5. Footer
Builder.registerComponent(Footer, {
  name: "Footer",
});

Builder.registerComponent(GameCard, {
  name: "GameCard",
  inputs: [
    { name: "title", type: "string", defaultValue: "Tên Game" },
    { name: "image", type: "file", allowedFileTypes: ["jpeg", "jpg", "png", "webp"] },
    { name: "link", type: "url" },
    { 
      name: "className", 
      type: "string", 
      defaultValue: "col-span-1 row-span-1",
      helperText: "Dùng col-span-2 để làm ô to, row-span-2 để làm ô đứng" 
    },
  ],
});