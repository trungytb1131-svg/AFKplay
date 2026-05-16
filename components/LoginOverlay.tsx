"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useProfile } from "@/contexts/ProfileContext";
import TabbedAuthForm from "./TabbedAuthForm";

export default function LoginOverlay() {
  const { profile } = useProfile();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("open-login", handler);
    return () => window.removeEventListener("open-login", handler);
  }, []);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = useCallback(() => setOpen(false), []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    close();
    window.location.reload();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[300] flex">
      <div className="w-1/3 min-w-[340px] bg-[#adecf5] flex flex-col items-center justify-center p-6 lg:p-10 relative z-10">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="text-3xl lg:text-4xl font-black italic tracking-tighter text-slate-900 uppercase">
              AFK<span className="text-blue-600">PLAY</span>
            </div>
            <p className="text-[10px] text-slate-600 font-semibold mt-2 leading-relaxed px-2">
              VAULT YOUR PROGRESS: Create an account to secure your loot
              forever.
            </p>
          </div>

          <div className="bg-white rounded-[32px] p-6 lg:p-8 shadow-xl border border-slate-100">
            <TabbedAuthForm onSuccess={close} />
          </div>

          {profile && (
            <button
              onClick={handleLogout}
              className="mt-3 w-full py-2.5 bg-red-500 hover:bg-red-600 text-white font-black uppercase rounded-2xl transition-all text-xs flex items-center justify-center gap-2"
            >
              <LogOut size={14} /> Logout
            </button>
          )}
        </div>
      </div>

      <button
        onClick={close}
        className="absolute left-1/3 -translate-x-1/2 top-1/2 -translate-y-1/2 z-20 w-12 h-12 lg:w-14 lg:h-14 bg-white rounded-full shadow-2xl border-2 border-slate-100 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
        aria-label="Close"
      >
        <ChevronLeft size={24} className="text-slate-600" />
      </button>

      <div
        className="flex-1 bg-slate-900/40 backdrop-blur-md"
        onClick={close}
      />
    </div>
  );
}

export function useLoginOverlay() {
  return () => {
    window.dispatchEvent(new Event("open-login"));
  };
}
