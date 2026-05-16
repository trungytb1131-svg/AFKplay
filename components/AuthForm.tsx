"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronLeft,
  X,
} from "lucide-react";

export default function AuthForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [usernameStatus, setUsernameStatus] = useState<
    "idle" | "valid" | "exists" | "short"
  >("idle");
  const [emailStatus, setEmailStatus] = useState<
    "idle" | "valid" | "exists" | "invalid"
  >("idle");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const checkUsername = async () => {
      if (!username) {
        setUsernameStatus("idle");
        return;
      }
      if (username.length < 3) {
        setUsernameStatus("short");
        return;
      }
      const { data } = await supabase
        .from("profiles")
        .select("username")
        .eq("username", username)
        .maybeSingle();
      if (data) setUsernameStatus("exists");
      else setUsernameStatus("valid");
    };
    const timer = setTimeout(checkUsername, 500);
    return () => clearTimeout(timer);
  }, [username]);

  useEffect(() => {
    const checkEmail = async () => {
      if (!email) {
        setEmailStatus("idle");
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setEmailStatus("invalid");
        return;
      }
      setEmailStatus("valid");
      const { data } = await supabase
        .from("profiles")
        .select("email")
        .eq("email", email)
        .maybeSingle();
      if (data) setEmailStatus("exists");
    };
    const timer = setTimeout(checkEmail, 500);
    return () => clearTimeout(timer);
  }, [email]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username: username },
      },
    });

    if (authError) {
      setMessage({ type: "error", text: authError.message });
    } else {
      setMessage({
        type: "success",
        text: "Vault created! Check your email to confirm.",
      });
    }
    setLoading(false);
  };

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-xl lg:text-2xl font-black uppercase tracking-tighter text-slate-900">
          Claim Your Identity
        </h2>
        <p className="text-[9px] lg:text-[10px] text-blue-600 font-bold mt-1 italic uppercase">
          Choose an iconic username to start earning AFK-Coins.
        </p>
      </div>

      <form onSubmit={handleSignUp} className="space-y-4">
        {/* USERNAME */}
        <div className="relative">
          <label className="block text-[10px] font-black uppercase text-slate-500 mb-1 ml-1">
            Iconic Username
          </label>
          <div className="relative">
            <input
              type="text"
              required
              value={username}
              onChange={(e) =>
                setUsername(e.target.value.toLowerCase().replace(/\s/g, ""))
              }
              placeholder="e.g. shadow_stalker"
              className={`w-full p-3.5 bg-slate-50 rounded-2xl border-2 outline-none transition-all text-sm
                ${usernameStatus === "valid" ? "border-green-500 bg-green-50" : "border-transparent focus:border-blue-500"}
                ${usernameStatus === "exists" || usernameStatus === "short" ? "border-red-500 bg-red-50" : ""}
              `}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {usernameStatus === "valid" && (
                <CheckCircle2 className="text-green-500" size={18} />
              )}
              {(usernameStatus === "exists" || usernameStatus === "short") && (
                <AlertCircle className="text-red-500" size={18} />
              )}
            </div>
          </div>
          {usernameStatus === "exists" && (
            <p className="text-red-500 text-[9px] font-bold mt-1 ml-1">
              Already taken! Be more original.
            </p>
          )}
          {usernameStatus === "short" && (
            <p className="text-red-500 text-[9px] font-bold mt-1 ml-1">
              At least 3 characters, please.
            </p>
          )}
        </div>

        {/* EMAIL */}
        <div className="relative">
          <label className="block text-[10px] font-black uppercase text-slate-500 mb-1 ml-1">
            Email Address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full p-3.5 bg-slate-50 rounded-2xl border-2 outline-none transition-all text-sm
              ${emailStatus === "exists" ? "border-red-500 bg-red-50" : "border-transparent focus:border-blue-500"}
            `}
          />
        </div>

        {/* PASSWORD */}
        <div
          className={`transition-all duration-500 ${
            usernameStatus === "valid" && emailStatus === "valid"
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4 pointer-events-none h-0"
          }`}
        >
          <label className="block text-[10px] font-black uppercase text-slate-500 mb-1 ml-1">
            Secure Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3.5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-blue-500 outline-none transition-all text-sm"
          />
        </div>

        {message.text && (
          <div
            className={`p-3 rounded-xl text-[11px] font-bold ${
              message.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={
            usernameStatus !== "valid" ||
            emailStatus !== "valid" ||
            password.length < 6 ||
            loading
          }
          className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white font-black uppercase rounded-2xl transition-all flex items-center justify-center gap-2 text-sm"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            "Initialize My Vault"
          )}
        </button>
      </form>
    </div>
  );
}
