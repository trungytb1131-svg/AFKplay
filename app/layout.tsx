import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Import Builder Registry (Quan trọng)
import "../builder-registry";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Poki Clone | Play Free Online Games - No Downloads Required",
  description: "Play the best free online games on Poki Clone. Discover action, racing, puzzle, and more. Instant play on PC and mobile with no downloads!",
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
    >
      <body className="min-h-full flex flex-col bg-[#adecf5]">
        {children}
      </body>
    </html>
  );
}