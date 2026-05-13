import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AFKplay | Chơi Game Online Miễn Phí - Không Cần Tải Về",
  description: "Khám phá thế giới game hành động, đua xe, câu đố và nhiều hơn nữa trên AFKplay. Chơi ngay tức thì trên PC và điện thoại!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="vi" 
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      /* Chặn lỗi Hydration từ lớp ngoài cùng */
      suppressHydrationWarning
    >
      <body 
        className="min-h-full flex flex-col bg-[#adecf5] overflow-x-hidden"
        /* Chặn lỗi do Builder.io tự ý chèn thêm class vào body trên trình duyệt */
        suppressHydrationWarning
      >
        <main className="flex-1 relative">
          {children}
        </main>
      </body>
    </html>
  );
}