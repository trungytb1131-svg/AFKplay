import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://afkplay.vercel.app";

const CATEGORY_NAMES: Record<string, string> = {
  action: "Action Games", racing: "Racing Games", puzzle: "Puzzle Games",
  shooting: "Shooting Games", adventure: "Adventure Games", sports: "Sports Games",
  cooking: "Cooking Games", zombie: "Zombie Games", "2-player": "2 Player Games",
  "dress-up": "Dress Up Games", driving: "Driving Games", skill: "Skill Games",
  horror: "Horror Games", board: "Board Games", simulation: "Simulation Games",
  strategy: "Strategy Games", funny: "Funny Games", multiplayer: "Multiplayer Games",
  girls: "Games for Girls", car: "Car Games", io: ".io Games", logic: "Logic Games",
  escape: "Escape Games", idle: "Idle Games", classic: "Classic Games",
  clicker: "Clicker Games", physics: "Physics Games", "world-war": "War Games",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const name = CATEGORY_NAMES[slug] || `${slug} Games`;
  const desc = `Play the best free ${name.toLowerCase()} online on AFKplay. No downloads, no login — instant play on desktop and mobile.`;

  return {
    title: `${name} — Play Free Online`,
    description: desc,
    openGraph: {
      title: `${name} — Free Online Games`,
      description: desc,
      url: `${SITE_URL}/category/${slug}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} — Free Online Games`,
      description: desc,
    },
    alternates: { canonical: `${SITE_URL}/category/${slug}` },
  };
}

export default function CategoryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
