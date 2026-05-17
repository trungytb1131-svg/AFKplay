import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Us — AFKplay",
  description: "Get in touch with AFKplay. Send us your feedback, questions, or report issues.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#adecf5] p-4 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <nav className="text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">›</span>
          <span className="text-slate-800 font-semibold">Contact Us</span>
        </nav>

        <div className="bg-white rounded-[2rem] lg:rounded-[3rem] p-6 lg:p-10 shadow-sm">
          <h1 className="text-2xl lg:text-4xl font-black uppercase italic text-slate-900 mb-6">
            Contact <span className="text-blue-600">Us</span>
          </h1>

          <p className="text-slate-600 text-sm lg:text-base mb-8">
            Have a question, suggestion, or need help? We&apos;re here for you.
            Fill out the form below or reach us directly.
          </p>

          {/* Contact Form */}
          <form className="space-y-5" action="https://formspree.io/f/your-form-id" method="POST">
            <div>
              <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">Your Name</label>
              <input
                type="text"
                name="name"
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 outline-none text-sm"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">Email Address</label>
              <input
                type="email"
                name="email"
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 outline-none text-sm"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">Subject</label>
              <select name="subject" className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 outline-none text-sm">
                <option>General Inquiry</option>
                <option>Report a Bug</option>
                <option>Game Request</option>
                <option>Advertising</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">Message</label>
              <textarea
                name="message"
                required
                rows={5}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 outline-none text-sm resize-none"
                placeholder="Tell us what's on your mind..."
              />
            </div>
            <button
              type="submit"
              className="bg-[#ff4757] text-white px-8 py-3 rounded-xl font-black uppercase text-sm hover:bg-red-600 transition-colors"
            >
              Send Message
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xs font-black uppercase text-slate-700 mb-1">Email</h3>
              <a href="mailto:support@afkplay.net" className="text-sm text-blue-600 underline">support@afkplay.net</a>
            </div>
            <div>
              <h3 className="text-xs font-black uppercase text-slate-700 mb-1">Response Time</h3>
              <p className="text-sm text-slate-600">We typically reply within 24-48 hours.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
