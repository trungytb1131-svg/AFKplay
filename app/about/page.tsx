import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us — AFKplay",
  description:
    "AFKplay is a free online gaming platform with thousands of browser games. No downloads, no login — just instant fun.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#adecf5] p-4 lg:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">›</span>
          <span className="text-slate-800 font-semibold">About Us</span>
        </nav>

        <div className="bg-white rounded-[2rem] lg:rounded-[3rem] p-6 lg:p-10 shadow-sm">
          <h1 className="text-2xl lg:text-4xl font-black uppercase italic text-slate-900 mb-6">
            About <span className="text-blue-600">AFKplay</span>
          </h1>

          <div className="prose prose-slate max-w-none space-y-6 text-sm lg:text-base leading-relaxed">
            <p>
              Welcome to <strong>AFKplay</strong> — your ultimate destination for free online gaming.
              We believe that great games should be accessible to everyone, everywhere, without barriers.
            </p>

            <h2 className="text-lg lg:text-xl font-black uppercase text-slate-800 mt-8">Our Mission</h2>
            <p>
              Our mission is simple: to create the world&apos;s most enjoyable free gaming platform.
              We curate thousands of high-quality browser games across every genre — from action and
              puzzle to racing, strategy, and clicker games. No downloads, no logins required. Just
              open your browser and play.
            </p>

            <h2 className="text-lg lg:text-xl font-black uppercase text-slate-800 mt-8">What We Offer</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>1,000+ Free Games</strong> — Carefully selected HTML5 games that work on desktop, tablet, and mobile.</li>
              <li><strong>28 Categories</strong> — From Action to Puzzle, Racing to Clicker — find exactly what you love.</li>
              <li><strong>Instant Play</strong> — No downloads, no installations. Click and play immediately.</li>
              <li><strong>Player Profiles</strong> — Track your favorites, earn stars, and climb the leaderboard.</li>
              <li><strong>Fresh Content</strong> — New games added regularly to keep the fun going.</li>
            </ul>

            <h2 className="text-lg lg:text-xl font-black uppercase text-slate-800 mt-8">Our Team</h2>
            <p>
              We are a passionate team of gamers, developers, and designers who love what we do.
              Based globally, we work around the clock to bring you the best gaming experience possible.
              Every game on AFKplay is hand-picked and tested to ensure it meets our quality standards.
            </p>

            <h2 className="text-lg lg:text-xl font-black uppercase text-slate-800 mt-8">Contact</h2>
            <p>
              Have questions or feedback? We&apos;d love to hear from you! Visit our{" "}
              <Link href="/contact" className="text-blue-600 underline">Contact page</Link> or
              email us at <a href="mailto:support@afkplay.net" className="text-blue-600 underline">support@afkplay.net</a>.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
