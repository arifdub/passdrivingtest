/*
  ===========================================================================
  SCREENS

  Everything that isn't a quiz or a flashcard deck. All of it reads from
  appStructure.js, so adding a section there makes it appear here with no
  changes to this file.
  ===========================================================================
*/

import React from "react";
import {
  Car, GraduationCap, BookOpen, Layers, ListChecks, ClipboardCheck,
  TrendingUp, User, LogOut, Shield, ChevronRight, Sparkles, Trash2,
} from "lucide-react";
import {
  APP_PATHS, PATH_BY_ID, SECTION_BY_ID, ALL_MODULES, isScored,
} from "./appStructure";
import { hasContent } from "./contentSources";
import { useAuth } from "./appAuth";
import { useProgress } from "./progressStore";
import {
  Logo, Screen, ScreenHeader, ProgressBar, ProgressRing, Tile, EmptyState,
  SecondaryButton, PrimaryButton,
} from "./ui";

/* Icons by module kind — the blueprint's four tile types. */
const KIND_ICON = {
  learning: BookOpen,
  flashcards: Layers,
  mcq: ListChecks,
  mock: ClipboardCheck,
};

const PATH_ICON = { driving: Car, adi: GraduationCap };

/* ===========================================================================
   HOME — screen 3 in the blueprint
   =========================================================================== */
export function HomeScreen({ go }) {
  const { displayName, subscription, isGuest, exitGuest } = useAuth();
  const { getPath, overall, weakest } = useProgress();

  return (
    <>
      <div className="bg-slate-900 text-white">
        <div className="max-w-2xl mx-auto px-5 pt-5 pb-8">
          <Logo />
          <p className="mt-5 text-slate-400 text-sm">Hi {displayName} 👋</p>
          <h1 className="mt-0.5 text-2xl font-black tracking-tight">
            Ready to pass your test?
          </h1>
        </div>
      </div>

      <Screen>
        {/* Overall */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 flex items-center gap-5 -mt-12 shadow-lg">
          <ProgressRing pct={overall.averagePct} size={84} stroke={7} />
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
              Overall progress
            </p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 leading-snug">
              {overall.testsTaken === 0
                ? "Take your first test and your progress starts building here."
                : overall.averagePct >= 85
                  ? "You're doing great. Keep it up and ace your test."
                  : "Good start — keep practising to bring your average up."}
            </p>
          </div>
        </div>

        {/* The two paths */}
        <p className="mt-7 mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">
          Choose your path
        </p>

        <div className="space-y-3">
          {APP_PATHS.map(path => {
            const Icon = PATH_ICON[path.id] || Car;
            const p = getPath(path.id);
            const dark = path.accent === "blue";
            return (
              <button
                key={path.id}
                onClick={() => go({ screen: "path", pathId: path.id })}
                className={`w-full text-left rounded-2xl p-5 transition active:scale-[0.99] ${
                  dark ? "bg-blue-600 hover:bg-blue-500" : "bg-emerald-600 hover:bg-emerald-500"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                    <Icon size={24} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-white/70">
                      {path.tagline}
                    </p>
                    <h2 className="text-xl font-black tracking-tight text-white">
                      {path.label}
                    </h2>
                    <p className="mt-1 text-sm text-white/80 leading-snug">
                      {path.blurb}
                    </p>
                    {p.started && (
                      <div className="mt-3">
                        <div className="flex justify-between text-[11px] font-bold text-white/70 mb-1">
                          <span>Your progress</span>
                          <span>{p.pct}%</span>
                        </div>
                        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                          <div className="h-2 bg-white rounded-full transition-all duration-500"
                               style={{ width: `${p.pct}%` }} />
                        </div>
                      </div>
                    )}
                  </div>
                  <ChevronRight size={20} className="text-white/60 shrink-0 mt-3" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Weakest topics */}
        {weakest.length > 0 && (
          <>
            <p className="mt-7 mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">
              Your weakest topics
            </p>
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl divide-y divide-slate-100 dark:divide-slate-700">
              {weakest.map(w => (
                <button
                  key={w.id}
                  onClick={() => go({ screen: "module", moduleId: w.id })}
                  className="w-full text-left px-4 py-3.5 flex items-center gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                      {w.label}
                    </p>
                    <p className="text-xs text-slate-400 truncate">{w.sectionLabel}</p>
                    <div className="mt-1.5"><ProgressBar pct={w.pct} tone="amber" /></div>
                  </div>
                  <span className="text-sm font-black text-slate-900 dark:text-white shrink-0">
                    {w.pct}%
                  </span>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Only nag once they've actually got something to lose. */}
        {isGuest && overall.testsTaken > 0 && (
          <button
            onClick={exitGuest}
            className="mt-6 w-full text-left bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-2xl p-4 flex items-center gap-3"
          >
            <div className="flex-1">
              <p className="font-bold text-slate-900 dark:text-white text-sm">
                Save your progress
              </p>
              <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-300 leading-snug">
                Create an account and everything you've studied comes with you.
              </p>
            </div>
            <ChevronRight size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
          </button>
        )}

        {!isGuest && (
          <p className="mt-6 text-center text-xs text-slate-400">
            Subscription: <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {subscription.label}
            </span>
          </p>
        )}
      </Screen>
    </>
  );
}

/* ===========================================================================
   PATH — Driving Test (2 sections) or ADI (3 sections)
   =========================================================================== */
export function PathScreen({ pathId, go, onBack }) {
  const path = PATH_BY_ID[pathId];
  const { getSection } = useProgress();
  if (!path) return null;

  return (
    <>
      <ScreenHeader
        title={path.label}
        subtitle={path.blurb}
        onBack={onBack}
        backLabel="Home"
      />
      <Screen>
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">
          Select what you're preparing for
        </p>
        <div className="space-y-3">
          {path.sections.map(section => {
            const s = getSection(section.id);
            const anyReady = section.modules.some(m => m.ready && hasContent(m));
            return (
              <Tile
                key={section.id}
                icon={PATH_ICON[pathId]}
                tone={path.accent}
                label={section.label}
                blurb={section.blurb}
                locked={!anyReady}
                showBar={anyReady && s.scoredCount > 0}
                pct={s.pct}
                meta={s.allPassed ? "All sections passed" : "Section progress"}
                onClick={() => go({ screen: "section", sectionId: section.id })}
              />
            );
          })}
        </div>
      </Screen>
    </>
  );
}

/* ===========================================================================
   SECTION — the module list (learning, flashcards, MCQs, mock test)
   =========================================================================== */
export function SectionScreen({ sectionId, go, onBack }) {
  const section = SECTION_BY_ID[sectionId];
  const { getSection, getModule } = useProgress();
  if (!section) return null;

  const s = getSection(sectionId);
  const path = PATH_BY_ID[section.pathId];

  return (
    <>
      <ScreenHeader
        title={section.label}
        subtitle={section.blurb}
        onBack={onBack}
        backLabel={path?.label}
      />
      <Screen>
        {s.scoredCount > 0 && (
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 mb-5">
            <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
              <span>Section progress</span>
              <span>{s.passedCount} of {s.scoredCount} passed</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-black text-slate-900 dark:text-white">{s.pct}%</span>
              <div className="flex-1"><ProgressBar pct={s.pct} tone={path?.accent} /></div>
            </div>
            <p className={`mt-2 text-sm font-semibold ${
              s.allPassed ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500 dark:text-slate-400"
            }`}>
              {s.allPassed
                ? "Every test in this section is at pass standard."
                : s.started
                  ? "Keep going — practise the tests you haven't passed yet."
                  : "Take a test to start tracking your progress."}
            </p>
          </div>
        )}

        <div className="space-y-2.5">
          {section.modules.map(module => {
            const available = module.ready && hasContent(module);
            const m = getModule(module.id);
            const scored = isScored(module);

            let meta = "Best score";
            if (module.kind === "flashcards") meta = "Cards known";

            let pct = m.bestPct;
            if (module.kind === "flashcards") {
              const total = module.count || 0;
              pct = total ? Math.round((m.completedIds.length / total) * 100) : 0;
            }

            return (
              <Tile
                key={module.id}
                icon={KIND_ICON[module.kind]}
                tone={path?.accent}
                label={module.label}
                blurb={module.blurb}
                locked={!available}
                showBar={available && (scored || module.kind === "flashcards")}
                pct={pct}
                meta={meta}
                onClick={() => go({ screen: "module", moduleId: module.id })}
              />
            );
          })}
        </div>
      </Screen>
    </>
  );
}

/* ===========================================================================
   LEARNING MATERIALS
   =========================================================================== */
export function LearningScreen({ module, learning, onBack }) {
  return (
    <>
      <ScreenHeader
        title={learning.title}
        subtitle={learning.intro}
        onBack={onBack}
        backLabel={module.sectionLabel}
      />
      <Screen>
        <div className="space-y-2.5">
          {learning.topics.map((topic, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4"
            >
              <div className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-black text-slate-500 dark:text-slate-300 shrink-0">
                  {i + 1}
                </span>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{topic.label}</p>
                  <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400 leading-snug">
                    {topic.blurb}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 flex items-start gap-3 bg-slate-100 dark:bg-slate-800 rounded-2xl p-4">
          <Sparkles size={18} className="text-slate-400 mt-0.5 shrink-0" />
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            These are the topics, not the full text. The rewritten Rules of the
            Road already exists as a PDF and ePub — pulling that content into
            these pages is a separate job.
          </p>
        </div>
      </Screen>
    </>
  );
}

/* ===========================================================================
   PROGRESS — every module, grouped by path
   =========================================================================== */
export function ProgressScreen() {
  const { getModule, overall } = useProgress();

  const started = ALL_MODULES.filter(m => {
    const p = getModule(m.id);
    return p.attempts > 0 || p.completedIds.length > 0;
  });

  return (
    <>
      <ScreenHeader title="My Progress" subtitle="Everything you've studied so far" />
      <Screen>
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 flex items-center gap-5">
          <ProgressRing pct={overall.averagePct} size={84} stroke={7} />
          <div className="flex-1 grid grid-cols-2 gap-3">
            <Stat label="Tests taken" value={overall.testsTaken} />
            <Stat label="Best score" value={`${overall.bestPct}%`} />
          </div>
        </div>

        {started.length === 0 ? (
          <EmptyState
            icon={TrendingUp}
            title="Nothing tracked yet"
            message="Take a practice test or work through a flashcard deck, and your scores will show up here."
          />
        ) : (
          APP_PATHS.map(path => {
            const rows = path.sections.flatMap(section =>
              section.modules
                .filter(m => started.some(s => s.id === m.id))
                .map(m => ({ ...m, sectionLabel: section.label }))
            );
            if (rows.length === 0) return null;

            return (
              <div key={path.id} className="mt-6">
                <p className="mb-2.5 text-xs font-bold uppercase tracking-widest text-slate-400">
                  {path.label}
                </p>
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl divide-y divide-slate-100 dark:divide-slate-700">
                  {rows.map(m => {
                    const p = getModule(m.id);
                    const isCards = m.kind === "flashcards";
                    const pct = isCards && m.count
                      ? Math.round((p.completedIds.length / m.count) * 100)
                      : p.bestPct;
                    return (
                      <div key={m.id} className="px-4 py-3.5">
                        <div className="flex items-baseline justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                              {m.label}
                            </p>
                            <p className="text-xs text-slate-400 truncate">{m.sectionLabel}</p>
                          </div>
                          <span className="text-sm font-black text-slate-900 dark:text-white shrink-0">
                            {pct}%
                          </span>
                        </div>
                        <div className="mt-1.5">
                          <ProgressBar
                            pct={pct}
                            tone={isCards ? "slate" : p.passed ? "emerald" : "amber"}
                          />
                        </div>
                        {!isCards && p.attempts > 0 && (
                          <p className={`mt-1.5 text-xs font-semibold ${
                            p.passed ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"
                          }`}>
                            {p.passed ? "Passed" : `Keep practising — ${p.passMark}% needed`}
                            <span className="text-slate-400 font-normal">
                              {" "}· {p.attempts} attempt{p.attempts === 1 ? "" : "s"}
                            </span>
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </Screen>
    </>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
      <p className="mt-0.5 text-xl font-black text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}

/* ===========================================================================
   PROFILE & SETTINGS
   =========================================================================== */
export function ProfileScreen({ theme, toggleTheme }) {
  const { profile, displayName, subscription, signOut, mode, isGuest, exitGuest } = useAuth();
  const { resetAll, overall } = useProgress();

  async function handleReset() {
    const ok = window.confirm(
      "Clear all your progress? Every score and flashcard mark will be deleted. This can't be undone."
    );
    if (ok) await resetAll();
  }

  return (
    <>
      <ScreenHeader title="Profile" />
      <Screen>
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0">
            <User size={24} className="text-slate-500 dark:text-slate-300" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-slate-900 dark:text-white truncate">
              {isGuest ? "Studying as a guest" : displayName}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
              {isGuest ? "No account yet" : profile?.email}
            </p>
          </div>
        </div>

        {/* Guests get the pitch for an account instead of a subscription card.
            Their progress is already saved locally, so signing up keeps it
            rather than starting them over. */}
        {isGuest ? (
          <div className="mt-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-2xl p-5">
            <h2 className="font-bold text-slate-900 dark:text-white">
              Keep your progress safe
            </h2>
            <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Right now your scores live on this device only — clear your
              browser or switch phone and they're gone. Create an account and
              everything you've already done comes with you.
            </p>
            <div className="mt-4">
              <PrimaryButton onClick={exitGuest}>Create an account</PrimaryButton>
            </div>
          </div>
        ) : (
          <div className="mt-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield size={18} className="text-emerald-500" />
                <span className="font-semibold text-slate-900 dark:text-white">Subscription</span>
              </div>
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                {subscription.label}
              </span>
            </div>
            {subscription.note && (
              <p className="mt-2.5 text-sm text-slate-500 dark:text-slate-400">
                {subscription.note}
              </p>
            )}
          </div>
        )}

        {/* Settings */}
        <div className="mt-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl divide-y divide-slate-100 dark:divide-slate-700">
          <button
            onClick={toggleTheme}
            className="w-full px-4 py-3.5 flex items-center justify-between"
          >
            <span className="font-semibold text-slate-900 dark:text-white">Dark mode</span>
            <span className="text-sm font-semibold text-slate-400">
              {theme === "dark" ? "On" : "Off"}
            </span>
          </button>

          <button
            onClick={handleReset}
            className="w-full px-4 py-3.5 flex items-center justify-between"
          >
            <span className="font-semibold text-slate-900 dark:text-white">Reset my progress</span>
            <Trash2 size={16} className="text-slate-400" />
          </button>
        </div>

        {!isGuest && (
          <div className="mt-4">
            <SecondaryButton onClick={signOut}>
              <span className="inline-flex items-center gap-2 text-red-600 dark:text-red-400">
                <LogOut size={16} /> Log out
              </span>
            </SecondaryButton>
          </div>
        )}

        <p className="mt-6 text-center text-xs text-slate-400">
          {overall.testsTaken} test{overall.testsTaken === 1 ? "" : "s"} taken
          {mode === "local" && " · progress saved on this device only"}
        </p>
      </Screen>
    </>
  );
}
