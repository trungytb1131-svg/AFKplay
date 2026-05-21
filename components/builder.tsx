"use client";
import React, { useState, useEffect } from "react";
import { BuilderComponent } from "@builder.io/react";
import { builder } from "@builder.io/sdk";
import "../builder-registry";

// Dùng Public API Key từ biến môi trường (chỉ đọc, an toàn cho client)
const BUILDER_KEY = process.env.NEXT_PUBLIC_BUILDER_API_KEY || "";
if (!BUILDER_KEY) {
  console.error(
    "⚠️ NEXT_PUBLIC_BUILDER_API_KEY chưa được set trong .env.local",
  );
}
builder.init(BUILDER_KEY);

export function RenderBuilderContent({ content, model }: any) {
  const [isMounted, setIsMounted] = useState(false);

  // Ép Builder phải chờ Next.js khởi động xong hoàn toàn mới được chạy
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Nếu trình duyệt chưa sẵn sàng -> Hiện chữ Đang tải (Chặn 100% lỗi Router)
  if (!isMounted) {
    return (
      <div className="text-center p-10 font-bold text-gray-500">
        Đang kết nối Builder...
      </div>
    );
  }

  // Khi mọi thứ đã an toàn -> Bung lụa giao diện kéo thả
  return <BuilderComponent content={content} model={model} />;
}
