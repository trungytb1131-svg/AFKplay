"use client"
import React from "react"

export default function Footer() {
  return (
    <footer className="bg-white mt-10 p-10 border-t border-gray-200">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-black text-[#ff4757] text-xl mb-4 italic uppercase text-left">POKI CLONE</h3>
          <p className="text-gray-500 text-sm">The world's leading free online gaming platform.</p>
        </div>
        <div>
          <h4 className="font-bold mb-4">About Us</h4>
          <ul className="text-gray-400 text-sm space-y-2 cursor-pointer">
            <li className="hover:text-[#ff4757]">Terms of Use</li>
            <li className="hover:text-[#ff4757]">Privacy Policy</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">Categories</h4>
          <ul className="text-gray-400 text-sm space-y-2 cursor-pointer">
            <li className="hover:text-[#3498db]">Action Games</li>
            <li className="hover:text-[#2ecc71]">Racing Games</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">Contact</h4>
          <p className="text-gray-400 text-sm italic">contact@pokiclone.com</p>
        </div>
      </div>
      <div className="text-center mt-10 text-gray-300 text-[10px]">
        © 2026 Poki Clone Project - All Rights Reserved.
      </div>
    </footer>
  )
}