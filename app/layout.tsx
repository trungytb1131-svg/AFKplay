export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import AdsterraBanner from "@/components/AdsterraBanner";
import MonetagAd from "@/components/MonetagAd";
import SupportChat from "@/components/support/SupportChat";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://afkplay.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  title: {
    default: "AFKplay | Free Online Games — No Download Required",
    template: "%s | AFKplay",
  },
  description:
    "Play 1000+ free online games on AFKplay — action, racing, puzzle, shooting, clicker & more. No downloads, no login. Instant play on desktop & mobile.",
  keywords: [
    "free online games",
    "browser games",
    "HTML5 games",
    "no download games",
    "action games",
    "puzzle games",
    "racing games",
    "clicker games",
    "play games online",
    "free gaming",
    "AFKplay",
  ],
  authors: [{ name: "AFKplay" }],
  creator: "AFKplay",
  publisher: "AFKplay",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "AFKplay",
    title: "AFKplay | Free Online Games — No Download Required",
    description:
      "Play 1000+ free online games on AFKplay. No downloads, no login. Instant play.",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "AFKplay | Free Online Games",
    description:
      "Play 1000+ free online games. No downloads, no login. Instant play.",
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://html5.gamemonetize.co" />
        <link rel="preconnect" href="https://img.gamemonetize.com" />
        <link rel="dns-prefetch" href="https://html5.gamemonetize.co" />
        <link rel="dns-prefetch" href="https://img.gamemonetize.com" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5612200195980402"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body className="min-h-full flex flex-col bg-[#adecf5] overflow-x-hidden">
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5612200195980402"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-38V3W5N9NH"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-38V3W5N9NH');
          `}
        </Script>
        <MonetagAd />
        <AdsterraBanner />
        <SupportChat />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
