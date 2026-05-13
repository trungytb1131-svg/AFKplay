"use client";
import { Builder, withChildren } from "@builder.io/react"; // Phải có dòng này

// Import tất cả các file component
import AdaptiveHeader from "./components/AdaptiveHeader";
import CategoryCardHorizontal from "./components/CategoryCardHorizontal";
import CategoryTiles from "./components/CategoryTiles";
import FixedHeader from "./components/FixedHeader";
import Footer from "./components/Footer";
import GameCard from "./components/GameCard";
import GameGridContainer from "./components/GameGridContainer";
import AboutSection from "./components/AboutSection";

// Đăng ký các linh kiện bình thường
Builder.registerComponent(AdaptiveHeader, { name: "AdaptiveHeader" });
Builder.registerComponent(CategoryCardHorizontal, { name: "CategoryCardHorizontal" });
Builder.registerComponent(CategoryTiles, { name: "CategoryTiles" });
Builder.registerComponent(FixedHeader, { name: "FixedHeader" });
Builder.registerComponent(Footer, { name: "Footer" });
Builder.registerComponent(GameCard, { name: "GameCard" });
Builder.registerComponent(AboutSection, { name: "AboutSection" });

// Đăng ký GameGridContainer với cấu hình nhập liệu
Builder.registerComponent(withChildren(GameGridContainer), { 
  name: "GameGridContainer", 
  canHaveChildren: true,
  inputs: [
    {
      name: "gamesList",
      type: "list",
      subFields: [
        { name: "title", type: "string", defaultValue: "New Game" },
        { name: "image", type: "file", allowedFileTypes: ["jpeg", "png", "webp"] },
        { name: "videoUrl", type: "file", allowedFileTypes: ["mp4"] },
        { name: "gameUrl", type: "url" },
        { name: "size", type: "string", enum: ["1x1", "2x2", "3x3"], defaultValue: "1x1" },
      ],
    },
  ],
});