import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript",
  ".wasm": "application/wasm",
  ".data": "application/octet-stream",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".css": "text/css",
  ".json": "application/json",
  ".mp3": "audio/mpeg",
  ".ogg": "audio/ogg",
  ".wav": "audio/wav",
  ".opus": "audio/opus",
  ".m4a": "audio/mp4",
  ".ttf": "font/ttf",
  ".xml": "application/xml",
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const filePath = path?.length ? path.join("/") : "index.html";
  const fullPath = join(
    process.cwd(),
    "game-data",
    "We Become What We Behold",
    filePath,
  );

  try {
    const data = await readFile(fullPath);
    const ext = "." + (filePath.split(".").pop() || "html");
    const contentType = MIME[ext] || "application/octet-stream";

    return new NextResponse(data, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "X-Frame-Options": "SAMEORIGIN",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return new NextResponse("Not Found", { status: 404 });
  }
}
