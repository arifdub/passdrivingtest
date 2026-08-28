/*
  ===========================================================================
  SHARED UI

  Small pieces used across every screen. Keeping them here means the progress
  bar on the home screen and the one on a section screen can't drift apart.
  ===========================================================================
*/

import React from "react";
import { ChevronLeft, ChevronRight, Lock, CheckCircle2 } from "lucide-react";

/* ------------------------------------------------------------------------- */
export function Logo({ size = "md" }) {
  const box = size === "sm" ? "w-8 h-8" : "w-10 h-10";
  const icon = size === "sm" ? 18 : 22;
  const text = size === "sm" ? "text-base" : "text-xl";
  return (
    <div className="flex items-center gap-2">
      <div className={`${box} rounded-xl bg-emerald-500 flex items-center justify-center shrink-0`}>
        <CheckCircle2 size={icon} className="text-white" strokeWidth={2.5} />
      </div>
      <span className={`font-black tracking-tight ${text} text-white leading-none`}>
        Pass<span className="text-emerald-400">DrivingTest</span>
        <span className="text-slate-500">.ie</span>
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------------- */
export function ProgressBar({ pct, tone = "emerald", height = "h-2" }) {
  const tones = {
    emerald: "bg-emerald-500",
    blue: "bg-blue-500",
    amber: "bg-amber-500",
    slate: "bg-slate-400",
  };
  return (
    <div className={`${height} w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden`}>
      <div
        className={`${height} ${tones[tone] || tones.emerald} rounded-full transition-all duration-500`}
        style={{ width: `${Math.max(0, Math.min(100, pct))}%` }}
      />
    </div>
  );
}

/* Circular percentage ring — the big number on the home and result screens. */
export function ProgressRing({ pct, size = 96, stroke = 8, tone = "emerald", label }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.max(0, Math.min(100, pct)) / 100) * circumference;

  const colors = {
    emerald: "#10b981",
    blue: "#3b82f6",
    amber: "#f59e0b",
    red: "#ef4444",
    slate: "#94a3b8",
  };

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" strokeWidth={stroke}
          className="stroke-slate-200 dark:stroke-slate-700"
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" strokeWidth={stroke} strokeLinecap="round"
          stroke={colors[tone] || colors.emerald}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 700ms ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-black tracking-tight text-slate-900 dark:text-white"
              style={{ fontSize: size / 4 }}>
          {Math.round(pct)}%
        </span>
        {label && (
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------- */
export function ScreenHeader({ title, subtitle, onBack, backLabel = "Back", right }) {
  return (
    <div className="bg-slate-900 text-white">
      <div className="max-w-2xl mx-auto px-5 pt-5 pb-7">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-slate-400 hover:text-emerald-400 mb-3"
              >
                <ChevronLeft size={14} /> {backLabel}
              </button>
            )}
            <h1 className="text-2xl font-black tracking-tight leading-tight">{title}</h1>
            {subtitle && <p className="mt-1.5 text-sm text-slate-300">{subtitle}</p>}
          </div>
          {right}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------- */
export function Screen({ children }) {
  return (
    <div className="max-w-2xl mx-auto px-5 py-6 pb-28">
      {children}
    </div>
  );
}

/* A tappable row with an icon, a label and an optional progress bar.
   Used for sections and for modules — the blueprint's list rows. */
export function Tile({
  icon: Icon, label, blurb, onClick, locked, pct, showBar,
  meta, tone = "emerald",
}) {
  const toneBg = {
    emerald: "bg-emerald-500",
    blue: "bg-blue-500",
    amber: "bg-amber-500",
    slate: "bg-slate-400",
  }[tone] || "bg-emerald-500";

  return (
    <button
      onClick={locked ? undefined : onClick}
      disabled={locked}
      className={`w-full text-left bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 flex items-start gap-3.5 transition
        ${locked
          ? "opacity-55 cursor-not-allowed"
          : "hover:border-emerald-400 dark:hover:border-emerald-500 active:scale-[0.99]"}`}
    >
      {Icon && (
        <div className={`w-10 h-10 rounded-xl ${locked ? "bg-slate-300 dark:bg-slate-600" : toneBg} flex items-center justify-center shrink-0`}>
          {locked ? <Lock size={18} className="text-white" /> : <Icon size={18} className="text-white" />}
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-900 dark:text-white truncate">{label}</span>
          {locked && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 shrink-0">
              Coming soon
            </span>
          )}
        </div>

        {blurb && (
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400 leading-snug">{blurb}</p>
        )}

        {showBar && !locked && (
          <div className="mt-2.5">
            <div className="flex justify-between text-[11px] font-bold text-slate-400 mb-1">
              <span>{meta || "Best score"}</span>
              <span>{pct > 0 ? `${pct}%` : "Not started"}</span>
            </div>
            <ProgressBar pct={pct} tone={pct > 0 ? tone : "slate"} />
          </div>
        )}
      </div>

      {!locked && (
        <ChevronRight size={18} className="text-slate-300 dark:text-slate-600 shrink-0 mt-2.5" />
      )}
    </button>
  );
}

/* ------------------------------------------------------------------------- */
export function EmptyState({ icon: Icon, title, message }) {
  return (
    <div className="text-center py-12 px-6">
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
          <Icon size={24} className="text-slate-400" />
        </div>
      )}
      <h2 className="font-bold text-slate-900 dark:text-white">{title}</h2>
      <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
        {message}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------------- */
export function PrimaryButton({ children, onClick, disabled, full = true }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${full ? "w-full" : ""} bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:hover:bg-emerald-500 text-slate-900 font-bold py-3 px-6 rounded-xl transition`}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({ children, onClick, full = true }) {
  return (
    <button
      onClick={onClick}
      className={`${full ? "w-full" : ""} bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-700 dark:text-slate-200 font-bold py-3 px-6 rounded-xl transition`}
    >
      {children}
    </button>
  );
}
