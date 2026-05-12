"use client";
import React, { useState, useEffect } from "react";
import { BuilderComponent } from "@builder.io/react";
import { builder } from "@builder.io/sdk";
import "../builder-registry"; 

// Khởi tạo đúng API Key của bạn
builder.init("036b47464eae4b0db4017daca87b8339");

export function RenderBuilderContent({ content, model }: any) {
  const [isMounted, setIsMounted] = useState(false);

  // Ép Builder phải chờ Next.js khởi động xong hoàn toàn mới được chạy
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Nếu trình duyệt chưa sẵn sàng -> Hiện chữ Đang tải (Chặn 100% lỗi Router)
  if (!isMounted) {
    return <div className="text-center p-10 font-bold text-gray-500">Đang kết nối Builder...</div>;
  }

  // Khi mọi thứ đã an toàn -> Bung lụa giao diện kéo thả
  return <BuilderComponent content={content} model={model} />;
}