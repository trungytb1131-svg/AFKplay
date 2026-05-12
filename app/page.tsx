"use client";
import { useEffect, useState } from "react";
import { BuilderComponent, builder, useIsPreviewing } from "@builder.io/react";
import "../builder-registry";

builder.init("036b47464eae4b0db4017daca87b8339");

const MODEL = "figma-imports";

export default function Home() {
  const isPreviewing = useIsPreviewing();
  const [content, setContent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    builder
      .get(MODEL, {
        includeUnpublished: true,
        cachebust: true,
        userAttributes: {
          urlPath: window.location.pathname,
          host: window.location.hostname,
        },
      })
      .promise()
      .then((data) => setContent(data ?? null))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return (
    <div className="min-h-screen bg-[#adecf5] flex items-center justify-center">
      <p className="text-gray-500">Đang tải...</p>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#adecf5]">
      <BuilderComponent model={MODEL} content={content ?? undefined} />
      {!content && !isPreviewing && (
        <div className="p-10 text-center">
          <p className="text-gray-500">Chưa có nội dung.</p>
        </div>
      )}
    </main>
  );
}