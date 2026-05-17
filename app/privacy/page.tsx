import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — AFKplay",
  description: "AFKplay Privacy Policy. Learn how we collect, use, and protect your data.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#adecf5] p-4 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <nav className="text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">›</span>
          <span className="text-slate-800 font-semibold">Privacy Policy</span>
        </nav>

        <div className="bg-white rounded-[2rem] lg:rounded-[3rem] p-6 lg:p-10 shadow-sm">
          <h1 className="text-2xl lg:text-4xl font-black uppercase italic text-slate-900 mb-2">
            Privacy <span className="text-blue-600">Policy</span>
          </h1>
          <p className="text-xs text-slate-400 mb-8">Last updated: January 2026</p>

          <div className="prose prose-slate max-w-none space-y-6 text-sm lg:text-base leading-relaxed">
            <h2 className="text-lg lg:text-xl font-black uppercase text-slate-800">1. Introduction</h2>
            <p>
              AFKplay (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) respects your privacy.
              This Privacy Policy explains how we collect, use, and protect your information when
              you visit our website and play games on our platform.
            </p>

            <h2 className="text-lg lg:text-xl font-black uppercase text-slate-800">2. Information We Collect</h2>
            <h3 className="text-base font-bold text-slate-700">Automatically Collected</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Usage Data:</strong> Pages visited, games played, time spent.</li>
              <li><strong>Device Data:</strong> Browser type, operating system, screen resolution.</li>
              <li><strong>Cookies:</strong> Small files stored on your device for functionality and analytics.</li>
            </ul>
            <h3 className="text-base font-bold text-slate-700">Information You Provide</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Account Data:</strong> Username and email (if you create an account).</li>
              <li><strong>Contact Form:</strong> Name, email, and message when you contact us.</li>
            </ul>

            <h2 className="text-lg lg:text-xl font-black uppercase text-slate-800">3. How We Use Your Data</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>To provide and improve the Service</li>
              <li>To personalize your gaming experience</li>
              <li>To display relevant advertisements</li>
              <li>To communicate with you (support, updates)</li>
              <li>To analyze usage and optimize performance</li>
            </ul>

            <h2 className="text-lg lg:text-xl font-black uppercase text-slate-800">4. Cookies</h2>
            <p>
              We use cookies and similar technologies to remember your preferences, keep you signed
              in, and understand how you use AFKplay. You can disable cookies in your browser settings,
              but some features may not work properly.
            </p>

            <h2 className="text-lg lg:text-xl font-black uppercase text-slate-800">5. Third-Party Services</h2>
            <p>
              We use third-party services including:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Supabase:</strong> Authentication and database (privacy policy applies).</li>
              <li><strong>GameMonetize:</strong> Game content provider.</li>
              <li><strong>Adsterra &amp; Monetag:</strong> Advertising networks that may use cookies.</li>
            </ul>
            <p>
              These services have their own privacy policies. We encourage you to review them.
            </p>

            <h2 className="text-lg lg:text-xl font-black uppercase text-slate-800">6. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your data. However, no method
              of transmission over the internet is 100% secure. We cannot guarantee absolute security.
            </p>

            <h2 className="text-lg lg:text-xl font-black uppercase text-slate-800">7. Children&apos;s Privacy</h2>
            <p>
              AFKplay is intended for general audiences. We do not knowingly collect personal
              information from children under 13. If you believe we have collected such data,
              please contact us immediately.
            </p>

            <h2 className="text-lg lg:text-xl font-black uppercase text-slate-800">8. Your Rights (GDPR)</h2>
            <p>
              If you are in the European Union, you have the right to access, rectify, delete,
              and port your personal data. To exercise these rights, contact us at{" "}
              <a href="mailto:support@afkplay.net" className="text-blue-600 underline">support@afkplay.net</a>.
            </p>

            <h2 className="text-lg lg:text-xl font-black uppercase text-slate-800">9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will be posted on this
              page with an updated date. Continued use of the Service constitutes acceptance.
            </p>

            <h2 className="text-lg lg:text-xl font-black uppercase text-slate-800">10. Contact</h2>
            <p>
              For privacy-related inquiries,{" "}
              <Link href="/contact" className="text-blue-600 underline">contact us</Link> or
              email <a href="mailto:support@afkplay.net" className="text-blue-600 underline">support@afkplay.net</a>.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
