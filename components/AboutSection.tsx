"use client"
import React from "react"

export default function AboutSection() {
  return (
    /* Thêm font-family dạng tròn (Nunito/Quicksand style) để giống Poki */
    <div className="w-full my-10 p-6 lg:p-10 rounded-3xl bg-white border border-slate-100 shadow-2xl text-slate-800 font-sans tracking-tight">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;900&display=swap');
        .poki-font {
          font-family: 'Nunito', sans-serif;
        }
      `}</style>
      
      <div className="poki-font">
        <h2 className="text-3xl font-black mb-6 text-[#004b6b]">Free Online Games on AFKplay</h2>
        <p className="mb-4 leading-relaxed font-medium text-lg">
          Play thousands of free online games directly in your browser at AFKplay. We offer instant access to all our titles without the need for downloads, logins, or annoying pop-ups.
        </p>

        <h3 className="text-xl font-extrabold mt-6 mb-2 text-[#004b6b]">Our game selection</h3>
        <p className="mb-4 leading-relaxed font-medium">
          Poki is home to a curated collection of the best browser games. Every title is carefully selected to make sure it's fun, creative, and feels great to play on mobile, tablet, or desktop.
        </p>

        <h3 className="text-xl font-extrabold mt-6 mb-2 text-[#004b6b]">Exclusive games only on AFKplay</h3>
        <p className="leading-relaxed font-medium">
          Exclusive games make AFKplay stand out. Alongside global hits, we feature titles you won't find anywhere else on the web.
        </p>

        <div className="mt-8 flex gap-4 text-blue-500 font-bold text-sm">
          <a href="#" className="hover:underline">Contact Us</a>
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Terms of Service</a>
        </div>
      </div>
    </div>
  )
}