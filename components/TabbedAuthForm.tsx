"use client";

import { useState, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Tab = "register" | "login";

export default function TabbedAuthForm({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const [tab, setTab] = useState<Tab>("register");

  // Register
  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regUsernameStatus, setRegUsernameStatus] = useState<
    "idle" | "valid" | "exists" | "short"
  >("idle");
  const [regEmailStatus, setRegEmailStatus] = useState<
    "idle" | "valid" | "exists" | "invalid"
  >("idle");

  // Login
  const [loginId, setLoginId] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState(false);

  // Check username availability (register only)
  const checkUsername = useCallback(async (name: string) => {
    if (!name) return setRegUsernameStatus("idle");
    if (name.length < 3) return setRegUsernameStatus("short");
    const { data } = await supabase
      .from("profiles")
      .select("username")
      .eq("username", name)
      .maybeSingle();
    if (data) setRegUsernameStatus("exists");
    else setRegUsernameStatus("valid");
  }, []);

  // Check email availability (register only)
  const checkEmail = useCallback(async (email: string) => {
    if (!email) return setRegEmailStatus("idle");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return setRegEmailStatus("invalid");
    setRegEmailStatus("valid");
    const { data } = await supabase
      .from("profiles")
      .select("email")
      .eq("email", email)
      .maybeSingle();
    if (data) setRegEmailStatus("exists");
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: regEmail,
      password: regPassword,
      options: { data: { username: regUsername } },
    });
    if (!error) onSuccess();
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoginError(false);

    let email = loginId;
    // Nếu không phải email → tra cứu email từ username
    if (!loginId.includes("@")) {
      const { data } = await supabase
        .from("profiles")
        .select("email")
        .eq("username", loginId)
        .maybeSingle();
      if (data?.email) email = data.email;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: loginPassword,
    });

    if (error) {
      setLoginError(true);
    } else {
      onSuccess();
    }
    setLoading(false);
  };

  const inputClass = (status: string) =>
    `w-full p-3 bg-slate-50 rounded-xl border-2 outline-none transition-all text-sm ${
      status === "valid"
        ? "border-green-500 bg-green-50"
        : status === "exists" || status === "short" || status === "invalid"
          ? "border-red-500 bg-red-50"
          : "border-transparent focus:border-blue-500"
    }`;

  const plainInputClass =
    "w-full p-3 bg-slate-50 rounded-xl border-2 border-transparent focus:border-blue-500 outline-none transition-all text-sm";

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="flex bg-slate-100 rounded-2xl p-1 mb-6">
        <button
          type="button"
          onClick={() => {
            setTab("register");
            setLoginError(false);
          }}
          className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase transition-all ${
            tab === "register"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-400"
          }`}
        >
          Register
        </button>
        <button
          type="button"
          onClick={() => {
            setTab("login");
            setLoginError(false);
          }}
          className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase transition-all ${
            tab === "login"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-400"
          }`}
        >
          Login
        </button>
      </div>

      {/* REGISTER */}
      {tab === "register" && (
        <form onSubmit={handleRegister} className="space-y-3">
          <div>
            <label className="block text-[10px] font-black uppercase text-slate-500 mb-1 ml-1">
              Username
            </label>
            <input
              type="text"
              required
              value={regUsername}
              onChange={(e) => {
                const v = e.target.value.toLowerCase().replace(/\s/g, "");
                setRegUsername(v);
                setTimeout(() => checkUsername(v), 500);
              }}
              placeholder="shadow_stalker"
              className={inputClass(regUsernameStatus)}
            />
            {regUsernameStatus === "exists" && (
              <p className="text-red-500 text-[9px] font-bold mt-1 ml-1">
                Already taken!
              </p>
            )}
            {regUsernameStatus === "short" && (
              <p className="text-red-500 text-[9px] font-bold mt-1 ml-1">
                At least 3 characters.
              </p>
            )}
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-slate-500 mb-1 ml-1">
              Email
            </label>
            <input
              type="email"
              required
              value={regEmail}
              onChange={(e) => {
                setRegEmail(e.target.value);
                setTimeout(() => checkEmail(e.target.value), 500);
              }}
              placeholder="you@email.com"
              className={inputClass(regEmailStatus)}
            />
            <p className="text-[8px] text-slate-400 font-medium mt-1 ml-1">
              * Make sure this is your email, we will send a confirmation email.
            </p>
          </div>

          {regUsernameStatus === "valid" && regEmailStatus === "valid" && (
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-500 mb-1 ml-1">
                Password
              </label>
              <input
                type="password"
                required
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                className={plainInputClass}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={
              regUsernameStatus !== "valid" ||
              regEmailStatus !== "valid" ||
              regPassword.length < 6 ||
              loading
            }
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white font-black uppercase rounded-xl transition-all text-sm flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              "Create Account"
            )}
          </button>
        </form>
      )}

      {/* LOGIN */}
      {tab === "login" && (
        <form onSubmit={handleLogin} className="space-y-3">
          <div>
            <label className="block text-[10px] font-black uppercase text-slate-500 mb-1 ml-1">
              Username / Email
            </label>
            <input
              type="text"
              required
              value={loginId}
              onChange={(e) => {
                setLoginId(e.target.value);
                setLoginError(false);
              }}
              placeholder="shadow_stalker or you@email.com"
              className={plainInputClass}
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase text-slate-500 mb-1 ml-1">
              Password
            </label>
            <input
              type="password"
              required
              value={loginPassword}
              onChange={(e) => {
                setLoginPassword(e.target.value);
                setLoginError(false);
              }}
              className={plainInputClass}
            />
          </div>

          {loginError && (
            <div className="p-3 rounded-xl text-[11px] font-bold bg-red-100 text-red-700">
              Wrong username or password
            </div>
          )}

          {!loginError && (
            <button
              type="submit"
              disabled={!loginId || !loginPassword || loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white font-black uppercase rounded-xl transition-all text-sm flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                "Login"
              )}
            </button>
          )}
        </form>
      )}
    </div>
  );
}
