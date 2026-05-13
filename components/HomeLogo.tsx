"use client"
import React from "react"

export default function AboutSection() {
  return (
    <div className="w-full my-10 p-6 lg:p-10 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl text-slate-800">
      <h2 className="text-3xl font-black mb-6">Free Online Games on AFKplay</h2>
      <p className="mb-4 leading-relaxed">Play thousands of free online games directly in your browser at AFKplay. We offer instant access to all our titles without the need for downloads, logins, or annoying pop-ups.</p>
      
      <h3 className="text-xl font-bold mt-6 mb-2">Our Game Selection</h3>
      <p className="mb-4 leading-relaxed">AFKplay is home to a curated collection of high-quality browser games. Every title is carefully selected to ensure it's fun, creative, and performs perfectly on mobile, tablet, or desktop.</p>
      
      <h3 className="text-xl font-bold mt-6 mb-2">Who We Are</h3>
      <p className="leading-relaxed text-sm opacity-80">We are a dedicated team of gaming enthusiasts building the ultimate online playground. Our mission is simple: to make great games free and accessible to everyone, everywhere.</p>
      
      <div className="mt-8 flex gap-4 text-blue-600 font-bold text-sm">
        <a href="#" className="hover:underline">Contact Us</a>
        <a href="#" className="hover:underline">Privacy Policy</a>
        <a href="#" className="hover:underline">Terms of Service</a>
      </div>
    </div>
  )
}