import React from "react";
import { builder } from "@builder.io/sdk";
import { RenderBuilderContent } from "@/components/builder";

// Khởi tạo Builder
builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY!);

interface PlayPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PlayPage(props: PlayPageProps) {
  const { slug } = await props.params;
  const model = "game-pages"; // Bạn nên tạo một model mới tên là game-pages trên Builder.io

  // Lấy dữ liệu game từ Builder.io dựa trên slug
  const content = await builder
    .get(model, {
      userAttributes: {
        urlPath: "/play/" + slug,
      },
    })
    .toPromise();

  return (
    <main className="min-h-screen bg-[#adecf5] p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Khu vực khung chơi game */}
        <div className="aspect-video w-full bg-black rounded-3xl shadow-2xl overflow-hidden border-4 border-white">
          <RenderBuilderContent content={content} model={model} />
          
          {/* Nếu Builder chưa có nội dung, có thể hiện một iframe mẫu ở đây */}
          {!content && (
            <div className="w-full h-full flex items-center justify-center text-white">
              <p>Đang cấu hình trình phát game cho: {slug}</p>
            </div>
          )}
        </div>

        {/* Phần mô tả game bên dưới */}
        <div className="mt-6 bg-white rounded-2xl p-6 shadow-lg">
          <h1 className="text-2xl font-black uppercase text-[#1f1f1f]">
            {slug.replace(/-/g, ' ')}
          </h1>
          <p className="text-gray-600 mt-2">
            Chào mừng bạn đến với thế giới giải trí của AFKplay!
          </p>
        </div>
      </div>
    </main>
  );
}