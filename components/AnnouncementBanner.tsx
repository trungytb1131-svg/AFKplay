"use client";

export default function AnnouncementBanner() {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 overflow-hidden"
      style={{
        background: "rgba(8, 30, 60, 0.92)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        borderTop: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div className="marquee-wrapper relative h-8 flex items-center">
        <div className="marquee-track flex items-center animate-marquee whitespace-nowrap">
          <span className="inline-block px-4 text-sm font-medium text-white">
            🎮 Welcome to AFKplay! Our vision is to build a truly high-quality,
            ad-free web gaming platform. While we currently only have a few
            ad-free titles and most games still contain ads, please bear with
            us—we are working hard to bring you top-tier, unique, and strictly
            NO-AD games to play directly in your browser very soon! 🚀 To all
            game developers: we&apos;d love to partner with you to bring your
            amazing games to a wider audience. 🤝 Got feedback or want to
            collaborate? Contact us at{" "}
            <a
              href="mailto:support@afkplay.net"
              className="underline hover:opacity-80 transition-opacity"
              style={{ color: "#fff" }}
            >
              support@afkplay.net
            </a>{" "}
            or drop a message in the purple chat bubble at the bottom right
            corner! 💬
          </span>
          {/* Duplicate for seamless loop */}
          <span className="inline-block px-4 text-sm font-medium text-white">
            🎮 Welcome to AFKplay! Our vision is to build a truly high-quality,
            ad-free web gaming platform. While we currently only have a few
            ad-free titles and most games still contain ads, please bear with
            us—we are working hard to bring you top-tier, unique, and strictly
            NO-AD games to play directly in your browser very soon! 🚀 To all
            game developers: we&apos;d love to partner with you to bring your
            amazing games to a wider audience. 🤝 Got feedback or want to
            collaborate? Contact us at{" "}
            <a
              href="mailto:support@afkplay.net"
              className="underline hover:opacity-80 transition-opacity"
              style={{ color: "#fff" }}
            >
              support@afkplay.net
            </a>{" "}
            or drop a message in the purple chat bubble at the bottom right
            corner! 💬
          </span>
        </div>
      </div>
    </div>
  );
}
