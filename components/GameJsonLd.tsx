import type { Game } from "@/types/game";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://afkplay.vercel.app";

export default function GameJsonLd({ game }: { game: Game | null }) {
  if (!game) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: game.title,
    description: game.description?.slice(0, 300) || game.title,
    url: `${SITE_URL}/play/${game.slug}`,
    image: game.thumb,
    applicationCategory: "Game",
    operatingSystem: "Web Browser",
    playMode: "SinglePlayer",
    genre: game.tags?.slice(0, 3),
    publisher: {
      "@type": "Organization",
      name: "AFKplay",
      url: SITE_URL,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
