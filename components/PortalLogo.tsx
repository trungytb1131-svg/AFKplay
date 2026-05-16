"use client";

import Link from "next/link";
import { Search, User } from "lucide-react";
import { useLoginOverlay } from "./LoginOverlay";
import { useSearchOverlay } from "./SearchOverlay";

export default function PortalLogo() {
  const openLogin = useLoginOverlay();
  const openSearch = useSearchOverlay();

  return (
    <div className="w-full h-full bg-white rounded-xl lg:rounded-2xl shadow-xl overflow-hidden flex border border-slate-100 lg:hover:shadow-2xl lg:hover:-translate-y-0.5 transition-all">
      {/* Home: 3/4 */}
      <Link
        href="/"
        className="flex-[3] h-full bg-white relative overflow-hidden"
      >
        <img
          src="https://i.postimg.cc/90jcyNBT/Thiet-ke-chua-co-ten-(1).png"
          alt="AFKplay"
          className="w-full h-full object-cover block"
        />
      </Link>

      {/* Đăng nhập + Tìm kiếm: 1/4 */}
      <div className="flex-1 flex flex-col h-full border-l border-slate-100 bg-white">
        <button
          type="button"
          onClick={openLogin}
          className="h-1/2 flex items-center justify-center transition-colors duration-200 hover:bg-slate-100 group cursor-pointer"
        >
          <User className="text-blue-600 w-4 h-4 lg:w-5 lg:h-5 transition-transform group-hover:scale-110" />
        </button>
        <button
          type="button"
          onClick={openSearch}
          className="h-1/2 flex items-center justify-center transition-colors duration-200 hover:bg-slate-100 border-t border-slate-100 group cursor-pointer"
        >
          <Search className="text-blue-600 w-4 h-4 lg:w-5 lg:h-5 transition-transform group-hover:scale-110" />
        </button>
      </div>
    </div>
  );
}
