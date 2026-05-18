"use client";

import { useState, useCallback } from "react";
import { Loader2, ArrowLeft, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Tab = "register" | "login" | "forgot";

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

  // Forgot Password
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotStep, setForgotStep] = useState<"email" | "otp" | "password">(
    "email",
  );
  const [forgotOtp, setForgotOtp] = useState("");
  const [forgotNewPass, setForgotNewPass] = useState("");
  const [forgotConfirmPass, setForgotConfirmPass] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState("");
  const [otpError, setOtpError] = useState(false);

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

    if (error) setLoginError(true);
    else onSuccess();
    setLoading(false);
  };

  // ── Forgot Password: Step 1 - Send OTP ──
  const handleForgotEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setForgotError("");
    const { error } = await supabase.auth.signInWithOtp({
      email: forgotEmail,
      options: { shouldCreateUser: false },
    });
    if (error) {
      setForgotError(error.message);
    } else {
      setForgotSuccess("We've sent a 6-digit OTP to your registered email.");
      setForgotStep("otp");
    }
    setLoading(false);
  };

  // ── Forgot Password: Step 2 - Verify OTP ──
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setOtpError(false);
    const { error } = await supabase.auth.verifyOtp({
      email: forgotEmail,
      token: forgotOtp,
      type: "email",
    });
    if (error) {
      setOtpError(true);
    } else {
      setForgotStep("password");
    }
    setLoading(false);
  };

  // ── Forgot Password: Step 3 - Set New Password ──
  const handleNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotNewPass !== forgotConfirmPass) {
      setForgotError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setForgotError("");
    const { error } = await supabase.auth.updateUser({
      password: forgotNewPass,
    });
    if (error) {
      setForgotError(error.message);
    } else {
      onSuccess();
    }
    setLoading(false);
  };

  const resetForgot = () => {
    setTab("login");
    setForgotStep("email");
    setForgotEmail("");
    setForgotOtp("");
    setForgotNewPass("");
    setForgotConfirmPass("");
    setForgotError("");
    setForgotSuccess("");
    setOtpError(false);
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

  // ── FORGOT PASSWORD UI ──
  if (tab === "forgot") {
    return (
      <div className="w-full">
        <button
          type="button"
          onClick={resetForgot}
          className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 mb-4"
        >
          <ArrowLeft size={14} /> Back to Login
        </button>

        {forgotStep === "email" && (
          <form onSubmit={handleForgotEmail} className="space-y-3">
            <h3 className="text-sm font-black uppercase text-slate-800">
              Reset Password
            </h3>
            <p className="text-xs text-slate-500">
              Enter your email to receive an OTP.
            </p>
            <input
              type="email"
              required
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              placeholder="you@email.com"
              className={plainInputClass}
            />
            {forgotError && (
              <p className="text-red-500 text-[10px] font-bold">
                {forgotError}
              </p>
            )}
            <button
              type="submit"
              disabled={!forgotEmail || loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white font-black uppercase rounded-xl text-sm flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                "Send OTP"
              )}
            </button>
          </form>
        )}

        {forgotStep === "otp" && (
          <form onSubmit={handleVerifyOtp} className="space-y-3">
            <h3 className="text-sm font-black uppercase text-slate-800">
              Enter OTP
            </h3>
            {forgotSuccess && (
              <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-xl">
                <CheckCircle
                  size={16}
                  className="text-green-500 shrink-0 mt-0.5"
                />
                <p className="text-[10px] text-green-700 font-medium">
                  {forgotSuccess}
                </p>
              </div>
            )}
            <input
              type="text"
              required
              maxLength={6}
              value={forgotOtp}
              onChange={(e) => {
                setForgotOtp(e.target.value);
                setOtpError(false);
              }}
              placeholder="000000"
              className={`${plainInputClass} ${otpError ? "border-red-500 bg-red-50" : ""}`}
            />
            {otpError && (
              <p className="text-red-500 text-[10px] font-bold">
                Invalid OTP. Please try again.
              </p>
            )}
            <button
              type="submit"
              disabled={forgotOtp.length < 6 || loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white font-black uppercase rounded-xl text-sm flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                "Verify OTP"
              )}
            </button>
          </form>
        )}

        {forgotStep === "password" && (
          <form onSubmit={handleNewPassword} className="space-y-3">
            <h3 className="text-sm font-black uppercase text-slate-800">
              New Password
            </h3>
            <input
              type="password"
              required
              minLength={6}
              value={forgotNewPass}
              onChange={(e) => setForgotNewPass(e.target.value)}
              placeholder="New password (min 6 chars)"
              className={plainInputClass}
            />
            <input
              type="password"
              required
              minLength={6}
              value={forgotConfirmPass}
              onChange={(e) => setForgotConfirmPass(e.target.value)}
              placeholder="Confirm new password"
              className={`${plainInputClass} ${
                forgotConfirmPass && forgotNewPass !== forgotConfirmPass
                  ? "border-red-500 bg-red-50"
                  : ""
              }`}
            />
            {forgotError && (
              <p className="text-red-500 text-[10px] font-bold">
                {forgotError}
              </p>
            )}
            <button
              type="submit"
              disabled={
                forgotNewPass.length < 6 ||
                forgotNewPass !== forgotConfirmPass ||
                loading
              }
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white font-black uppercase rounded-xl text-sm flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        )}
      </div>
    );
  }

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

          <button
            type="submit"
            disabled={!loginId || !loginPassword || loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white font-black uppercase rounded-xl text-sm flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : "Login"}
          </button>

          <button
            type="button"
            onClick={() => {
              setTab("forgot");
              setLoginError(false);
            }}
            className="w-full text-center text-[10px] font-bold text-slate-400 hover:text-blue-600 transition-colors"
          >
            Forgot password?
          </button>
        </form>
      )}
    </div>
  );
}
