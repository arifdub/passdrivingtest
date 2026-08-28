/*
  ===========================================================================
  APP SHELL

  Holds the navigation stack, the bottom tab bar, and the gate that decides
  whether to show the login screen or the app.

  Navigation is a plain stack of view objects rather than a router. The app is
  a fixed tree — home → path → section → module — and a stack gives a correct
  back button on every screen with no URL handling to get wrong. Swap in a
  router later if deep links are ever needed.
  ===========================================================================
*/

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Home as HomeIcon, BookOpen, TrendingUp, User, Loader2 } from "lucide-react";
import { AuthProvider, useAuth } from "./appAuth";
import { ProgressProvider } from "./progressStore";
import AuthScreen from "./AuthScreen";
import {
  HomeScreen, PathScreen, SectionScreen, LearningScreen, ProgressScreen, ProfileScreen,
} from "./screens";
import QuizPlayer from "./QuizPlayer";
import FlashcardPlayer from "./FlashcardPlayer";
import { MODULE_BY_ID } from "./appStructure";
import { getDeck, getQuiz, getLearning } from "./contentSources";
import { EmptyState } from "./ui";

const TABS = [
  { id: "home", label: "Home", icon: HomeIcon },
  { id: "learn", label: "Learn", icon: BookOpen },
  { id: "progress", label: "Progress", icon: TrendingUp },
  { id: "profile", label: "Profile", icon: User },
];

/* ===========================================================================
   NAVIGATION SHELL
   =========================================================================== */
function AppShell() {
  const [tab, setTab] = useState("home");
  const [stack, setStack] = useState([{ screen: "home" }]);
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("pdt-theme") || "light";
    } catch {
      return "light";
    }
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    try { localStorage.setItem("pdt-theme", theme); } catch { /* ignore */ }
  }, [theme]);

  const toggleTheme = () => setTheme(t => (t === "dark" ? "light" : "dark"));

  const go = useCallback((view) => {
    setStack(s => [...s, view]);
    window.scrollTo(0, 0);
  }, []);

  const back = useCallback(() => {
    setStack(s => (s.length > 1 ? s.slice(0, -1) : s));
    window.scrollTo(0, 0);
  }, []);

  /* Tapping a tab resets that tab to its root — the expected app behaviour. */
  const selectTab = (id) => {
    setTab(id);
    setStack([{ screen: id === "learn" ? "home" : id }]);
    window.scrollTo(0, 0);
  };

  const view = stack[stack.length - 1];
  const canGoBack = stack.length > 1;

  /* ---------------------------------------------------------------------
     SWIPE BACK

     Only counts when the gesture starts within 32px of the left edge, the
     way iOS does it. A swipe starting anywhere else would fight the
     flashcard deck, which uses left/right swipes to change card.
     --------------------------------------------------------------------- */
  const swipe = useRef(null);

  function onPointerDown(e) {
    if (!canGoBack) return;
    if (e.clientX > 32) return;
    swipe.current = { x: e.clientX, y: e.clientY };
  }

  function onPointerMove(e) {
    if (!swipe.current) return;
    const dy = Math.abs(e.clientY - swipe.current.y);
    const dx = e.clientX - swipe.current.x;
    // Drifting vertically means they're scrolling, not going back.
    if (dy > 60 && dy > Math.abs(dx)) swipe.current = null;
  }

  function onPointerUp(e) {
    if (!swipe.current) return;
    const dx = e.clientX - swipe.current.x;
    swipe.current = null;
    if (dx > 70) back();
  }

  return (
    <div
      className="min-h-screen bg-slate-50 dark:bg-slate-900"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={() => { swipe.current = null; }}
    >
      <CurrentScreen view={view} go={go} back={back} theme={theme} toggleTheme={toggleTheme} />
      <TabBar tab={tab} onSelect={selectTab} hidden={isFullScreen(view)} />
    </div>
  );
}

/* Quiz runs and flashcard decks take over the screen — the tab bar would only
   be a way to lose your place mid-test. */
function isFullScreen(view) {
  return view.screen === "module";
}

/* ===========================================================================
   SCREEN SWITCH
   =========================================================================== */
function CurrentScreen({ view, go, back, theme, toggleTheme }) {
  switch (view.screen) {
    case "home":
      return <HomeScreen go={go} />;

    case "path":
      return <PathScreen pathId={view.pathId} go={go} onBack={back} />;

    case "section":
      return <SectionScreen sectionId={view.sectionId} go={go} onBack={back} />;

    case "progress":
      return <ProgressScreen />;

    case "profile":
      return <ProfileScreen theme={theme} toggleTheme={toggleTheme} />;

    case "module": {
      const module = MODULE_BY_ID[view.moduleId];
      if (!module) return <NotReady onBack={back} />;

      if (module.kind === "flashcards") {
        const deck = getDeck(module.id);
        if (!deck) return <NotReady onBack={back} />;
        return <FlashcardPlayer module={module} deck={deck} onExit={back} />;
      }

      if (module.kind === "mcq" || module.kind === "mock") {
        const quiz = getQuiz(module.id);
        if (!quiz) return <NotReady onBack={back} />;
        return <QuizPlayer module={module} quiz={quiz} onExit={back} />;
      }

      if (module.kind === "learning") {
        const learning = getLearning(module.id);
        if (!learning) return <NotReady onBack={back} />;
        return <LearningScreen module={module} learning={learning} onBack={back} />;
      }

      return <NotReady onBack={back} />;
    }

    default:
      return <HomeScreen go={go} />;
  }
}

function NotReady({ onBack }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <EmptyState
        icon={BookOpen}
        title="Not ready yet"
        message="The content for this section is still being written. It'll appear here as soon as it's added."
      />
      <button
        onClick={onBack}
        className="mt-2 text-sm font-bold text-emerald-600 dark:text-emerald-400"
      >
        Go back
      </button>
    </div>
  );
}

/* ===========================================================================
   TAB BAR
   =========================================================================== */
function TabBar({ tab, onSelect, hidden }) {
  if (hidden) return null;
  return (
    <nav className="fixed bottom-0 inset-x-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur border-t border-slate-200 dark:border-slate-700 z-20">
      <div className="max-w-2xl mx-auto flex">
        {TABS.map(({ id, label, icon: Icon }) => {
          const active = tab === id;
          return (
            <button
              key={id}
              onClick={() => onSelect(id)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 transition ${
                active
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-slate-400 dark:text-slate-500"
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 2} />
              <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
            </button>
          );
        })}
      </div>
      {/* iPhone home-indicator clearance */}
      <div style={{ height: "env(safe-area-inset-bottom)" }} />
    </nav>
  );
}

/* ===========================================================================
   GATE
   =========================================================================== */
function Gate() {
  const { loading, hasAccess } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center gap-3">
        <Loader2 size={28} className="text-emerald-400 animate-spin" />
        <p className="text-sm text-slate-400">Loading…</p>
      </div>
    );
  }

  if (!hasAccess) return <AuthScreen />;

  return (
    <ProgressProvider>
      <AppShell />
    </ProgressProvider>
  );
}

/* ===========================================================================
   ROOT
   =========================================================================== */
export default function App() {
  return (
    <AuthProvider>
      <Gate />
    </AuthProvider>
  );
}
