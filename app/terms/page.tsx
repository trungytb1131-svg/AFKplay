import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — AFKplay",
  description: "Terms of Service for AFKplay. Read our rules, disclaimers, and user agreements.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#adecf5] p-4 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <nav className="text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">›</span>
          <span className="text-slate-800 font-semibold">Terms of Service</span>
        </nav>

        <div className="bg-white rounded-[2rem] lg:rounded-[3rem] p-6 lg:p-10 shadow-sm">
          <h1 className="text-2xl lg:text-4xl font-black uppercase italic text-slate-900 mb-2">
            Terms of <span className="text-blue-600">Service</span>
          </h1>
          <p className="text-xs text-slate-400 mb-8">Last updated: January 2026</p>

          <div className="prose prose-slate max-w-none space-y-6 text-sm lg:text-base leading-relaxed">
            <h2 className="text-lg lg:text-xl font-black uppercase text-slate-800">1. Acceptance of Terms</h2>
            <p>
              By accessing and using <strong>AFKplay</strong> (&quot;the Service&quot;), you agree to
              be bound by these Terms of Service. If you do not agree, please do not use the Service.
            </p>

            <h2 className="text-lg lg:text-xl font-black uppercase text-slate-800">2. Description of Service</h2>
            <p>
              AFKplay is a free online gaming platform that provides browser-based HTML5 games.
              All games are embedded from third-party providers. We do not host game files directly.
              The Service is provided &quot;as is&quot; without warranties of any kind.
            </p>

            <h2 className="text-lg lg:text-xl font-black uppercase text-slate-800">3. User Accounts</h2>
            <p>
              Creating an account is optional. If you create one, you are responsible for maintaining
              its security. You must provide accurate information. We reserve the right to suspend
              accounts that violate these terms.
            </p>

            <h2 className="text-lg lg:text-xl font-black uppercase text-slate-800">4. Intellectual Property</h2>
            <p>
              All games, trademarks, and content belong to their respective owners. AFKplay does not
              claim ownership of any third-party games. Our logo, branding, and original content are
              protected and may not be used without permission.
            </p>

            <h2 className="text-lg lg:text-xl font-black uppercase text-slate-800">5. User Conduct</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Do not attempt to hack, exploit, or disrupt the Service.</li>
              <li>Do not use bots or automated scripts.</li>
              <li>Do not upload or share malicious content.</li>
              <li>Respect other users and their experience.</li>
            </ul>

            <h2 className="text-lg lg:text-xl font-black uppercase text-slate-800">6. Third-Party Content</h2>
            <p>
              Games on AFKplay are provided by third-party developers and platforms. We are not
              responsible for the content, functionality, or practices of these third parties.
              Playing games from external sources is at your own risk.
            </p>

            <h2 className="text-lg lg:text-xl font-black uppercase text-slate-800">7. Limitation of Liability</h2>
            <p>
              AFKplay shall not be liable for any direct, indirect, incidental, or consequential
              damages arising from the use or inability to use the Service. This includes but is
              not limited to data loss, device damage, or security breaches.
            </p>

            <h2 className="text-lg lg:text-xl font-black uppercase text-slate-800">8. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Changes will be effective
              immediately upon posting. Continued use of the Service constitutes acceptance of
              the revised terms.
            </p>

            <h2 className="text-lg lg:text-xl font-black uppercase text-slate-800">9. Contact</h2>
            <p>
              For questions about these Terms,{" "}
              <Link href="/contact" className="text-blue-600 underline">contact us</Link>.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
