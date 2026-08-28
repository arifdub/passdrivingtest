/*
  ===========================================================================
  LOGIN / SIGN UP  — screen 2 in the blueprint

  Shown whenever nobody is signed in. One screen, toggling between logging in
  and creating an account, so there's no extra navigation to get wrong.
  ===========================================================================
*/

import React, { useState } from "react";
import { CheckCircle2, Loader2, Mail, Lock, User as UserIcon, AlertCircle } from "lucide-react";
import { useAuth } from "./appAuth";

export default function AuthScreen() {
  const { signIn, signUp, resetPassword, mode } = useAuth();

  const [tab, setTab] = useState("login"); // login | signup
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null); // { type, text }

  const isSignup = tab === "signup";

  async function handleSubmit() {
    setMessage(null);

    if (!email.trim() || !password) {
      setMessage({ type: "error", text: "Enter your email and password." });
      return;
    }
    if (isSignup && password.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters." });
      return;
    }

    setBusy(true);
    const result = isSignup
      ? await signUp({ email, password, fullName })
      : await signIn({ email, password });
    setBusy(false);

    if (!result.ok) {
      setMessage({ type: "error", text: result.error });
      return;
    }
    if (result.needsConfirmation) {
      setMessage({
        type: "info",
        text: "Account created. Check your email for the confirmation link, then sign in.",
      });
      setTab("login");
    }
    // On success the auth provider swaps this screen out automatically.
  }

  async function handleForgot() {
    if (!email.trim()) {
      setMessage({ type: "error", text: "Enter your email first, then tap Forgot." });
      return;
    }
    setBusy(true);
    const result = await resetPassword(email);
    setBusy(false);
    setMessage(
      result.ok
        ? { type: "info", text: "Reset link sent — check your email." }
        : { type: "error", text: result.error }
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-5 py-10">
      {/* Logo */}
      <div className="flex items-center gap-2.5 mb-2">
        <div className="w-11 h-11 rounded-xl bg-emerald-500 flex items-center justify-center">
          <CheckCircle2 size={24} className="text-white" strokeWidth={2.5} />
        </div>
        <span className="font-black tracking-tight text-2xl text-white leading-none">
          Pass<span className="text-emerald-400">DrivingTest</span>
          <span className="text-slate-500">.ie</span>
        </span>
      </div>
      <p className="text-slate-400 text-sm mb-8">Learn. Practice. Pass.</p>

      {/* Card */}
      <div className="w-full max-w-sm bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl">
        <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
          {isSignup ? "Create your account" : "Welcome back"}
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {isSignup
            ? "Your progress is saved and follows you to any device."
            : "Sign in to pick up where you left off."}
        </p>

        <div className="mt-5 space-y-3">
          {isSignup && (
            <Field
              icon={UserIcon}
              label="Full name"
              value={fullName}
              onChange={setFullName}
              placeholder="Alex Smith"
              autoComplete="name"
            />
          )}

          <Field
            icon={Mail}
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="you@email.com"
            autoComplete="email"
          />

          <div>
            <div className="flex items-baseline justify-between">
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5">
                Password
              </label>
              {!isSignup && (
                <button
                  type="button"
                  onClick={handleForgot}
                  className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  Forgot?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder={isSignup ? "At least 6 characters" : "Enter your password"}
                autoComplete={isSignup ? "new-password" : "current-password"}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          {message && (
            <div
              className={`flex items-start gap-2 text-sm rounded-xl px-3 py-2.5 ${
                message.type === "error"
                  ? "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300"
                  : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300"
              }`}
            >
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{message.text}</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={busy}
            className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-slate-900 font-bold py-3 rounded-xl transition"
          >
            {busy && <Loader2 size={16} className="animate-spin" />}
            {isSignup ? "Create account" : "Login"}
          </button>
        </div>

        <p className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            type="button"
            onClick={() => { setTab(isSignup ? "login" : "signup"); setMessage(null); }}
            className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            {isSignup ? "Sign in" : "Sign up"}
          </button>
        </p>
      </div>

      <p className="mt-6 text-xs text-slate-500 text-center max-w-sm">
        Full access to all study material — no payment required.
      </p>

      {mode === "local" && (
        <p className="mt-3 text-[11px] text-amber-400/80 text-center max-w-sm">
          Running without a database connection — accounts are stored on this
          device only. Set the Supabase environment variables to enable real accounts.
        </p>
      )}
    </div>
  );
}

function Field({ icon: Icon, label, value, onChange, placeholder, type = "text", autoComplete }) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
        />
      </div>
    </div>
  );
}
