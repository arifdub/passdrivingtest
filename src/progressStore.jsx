/*
  ===========================================================================
  PROGRESS

  Every quiz, mock test and flashcard deck reports its result here. Every
  progress bar in the app reads from here. Nothing else touches storage.

  How it stores things:
    - Always written to localStorage first, so a result is never lost if the
      network drops mid-test.
    - Also written to Supabase when the learner is signed in with the database
      connected, so progress follows them to another phone or laptop.
    - On sign-in, anything studied before signing in is merged upward — best
      score wins, attempts add together. Nobody loses work by making an
      account late.

  Progress model:
    module   — best %, last %, attempts, passed
    section  — average of its SCORED modules (MCQs and mock tests). Learning
               materials and flashcards don't have a score, so they don't drag
               a section's percentage down.
    path     — average of its sections that have been started.
  ===========================================================================
*/

import React, {
  createContext, useContext, useState, useEffect, useCallback, useMemo, useRef,
} from "react";
import { supabase, HAS_SUPABASE } from "./supabaseClient";
import { useAuth } from "./appAuth";
import {
  APP_PATHS, ALL_SECTIONS, MODULE_BY_ID, isScored, passMarkFor, verdictFor,
} from "./appStructure";

const LOCAL_KEY = "pdt-progress-v1";

const ProgressContext = createContext(null);

const emptyEntry = () => ({
  bestPct: 0,
  lastPct: 0,
  lastScore: 0,
  lastTotal: 0,
  attempts: 0,
  passed: false,
  completedIds: [],
  updatedAt: null,
});

/* ------------------------------------------------------------------------- */
function readLocal() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY)) || {};
  } catch {
    return {};
  }
}

function writeLocal(data) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(data));
  } catch {
    /* out of quota or private mode — in-memory progress still works */
  }
}

/* Merge two entries for the same module. Best score wins, attempts add. */
function mergeEntry(a, b) {
  if (!a) return b;
  if (!b) return a;
  const newer = (b.updatedAt || "") > (a.updatedAt || "") ? b : a;
  return {
    bestPct: Math.max(a.bestPct || 0, b.bestPct || 0),
    lastPct: newer.lastPct || 0,
    lastScore: newer.lastScore || 0,
    lastTotal: newer.lastTotal || 0,
    attempts: (a.attempts || 0) + (b.attempts || 0),
    passed: Boolean(a.passed || b.passed),
    completedIds: Array.from(new Set([...(a.completedIds || []), ...(b.completedIds || [])])),
    updatedAt: newer.updatedAt || null,
  };
}

/* ------------------------------------------------------------------------- */
export function ProgressProvider({ children }) {
  const { user, isSignedIn } = useAuth();
  const [entries, setEntries] = useState(() => readLocal());
  const [syncing, setSyncing] = useState(false);
  const mergedFor = useRef(null);

  /* ---- pull from the database on sign-in, merging local work upward ---- */
  useEffect(() => {
    if (!isSignedIn || !HAS_SUPABASE || !user?.id) return;
    if (mergedFor.current === user.id) return;
    mergedFor.current = user.id;

    let cancelled = false;

    (async () => {
      setSyncing(true);
      const { data, error } = await supabase
        .from("progress")
        .select("*")
        .eq("user_id", user.id);

      if (cancelled) return;

      if (error) {
        console.warn("Could not load progress:", error.message);
        setSyncing(false);
        return;
      }

      const remote = {};
      for (const row of data || []) {
        remote[row.module_id] = {
          bestPct: row.best_pct,
          lastPct: row.last_pct,
          lastScore: row.last_score,
          lastTotal: row.last_total,
          attempts: row.attempts,
          passed: row.passed,
          completedIds: row.completed_ids || [],
          updatedAt: row.updated_at,
        };
      }

      const local = readLocal();
      const merged = { ...remote };
      const needsPush = [];

      for (const [moduleId, localEntry] of Object.entries(local)) {
        const combined = mergeEntry(remote[moduleId], localEntry);
        merged[moduleId] = combined;
        // Local knew something the database didn't — push it up.
        if (
          !remote[moduleId] ||
          combined.bestPct > (remote[moduleId].bestPct || 0) ||
          combined.attempts > (remote[moduleId].attempts || 0)
        ) {
          needsPush.push([moduleId, combined]);
        }
      }

      setEntries(merged);
      writeLocal(merged);

      for (const [moduleId, entry] of needsPush) {
        await supabase.from("progress").upsert(
          {
            user_id: user.id,
            module_id: moduleId,
            best_pct: entry.bestPct,
            last_pct: entry.lastPct,
            last_score: entry.lastScore,
            last_total: entry.lastTotal,
            attempts: entry.attempts,
            passed: entry.passed,
            completed_ids: entry.completedIds,
          },
          { onConflict: "user_id,module_id" }
        );
      }

      setSyncing(false);
    })();

    return () => { cancelled = true; };
  }, [isSignedIn, user?.id]);

  /* Signing out shouldn't wipe the device — but it also shouldn't leave one
     learner's scores showing for the next person on a shared phone. */
  useEffect(() => {
    if (!isSignedIn) mergedFor.current = null;
  }, [isSignedIn]);

  /* ---- record a finished quiz or mock test ---- */
  const recordResult = useCallback(async (moduleId, score, total) => {
    if (!total || total <= 0) return null;

    const pct = Math.round((score / total) * 100);
    const passMark = passMarkFor(moduleId);
    const verdict = verdictFor(pct, passMark);

    let updatedEntry;
    setEntries(prev => {
      const before = prev[moduleId] || emptyEntry();
      updatedEntry = {
        ...before,
        bestPct: Math.max(before.bestPct, pct),
        lastPct: pct,
        lastScore: score,
        lastTotal: total,
        attempts: before.attempts + 1,
        passed: before.passed || pct >= passMark,
        updatedAt: new Date().toISOString(),
      };
      const next = { ...prev, [moduleId]: updatedEntry };
      writeLocal(next);
      return next;
    });

    if (isSignedIn && HAS_SUPABASE && user?.id) {
      const { error } = await supabase.rpc("record_result", {
        p_module_id: moduleId,
        p_score: score,
        p_total: total,
        p_pass_mark: passMark,
      });
      if (error) console.warn("Progress not synced:", error.message);
    }

    return { pct, passMark, verdict, entry: updatedEntry };
  }, [isSignedIn, user?.id]);

  /* ---- mark a flashcard known / unknown ---- */
  const toggleCardKnown = useCallback(async (moduleId, cardId) => {
    let nextIds;
    setEntries(prev => {
      const before = prev[moduleId] || emptyEntry();
      const has = before.completedIds.includes(cardId);
      nextIds = has
        ? before.completedIds.filter(id => id !== cardId)
        : [...before.completedIds, cardId];
      const next = {
        ...prev,
        [moduleId]: { ...before, completedIds: nextIds, updatedAt: new Date().toISOString() },
      };
      writeLocal(next);
      return next;
    });

    if (isSignedIn && HAS_SUPABASE && user?.id) {
      await supabase.from("progress").upsert(
        { user_id: user.id, module_id: moduleId, completed_ids: nextIds },
        { onConflict: "user_id,module_id" }
      );
    }
  }, [isSignedIn, user?.id]);

  /* ---- reset one module, or everything ---- */
  const resetModule = useCallback(async (moduleId) => {
    setEntries(prev => {
      const next = { ...prev };
      delete next[moduleId];
      writeLocal(next);
      return next;
    });
    if (isSignedIn && HAS_SUPABASE && user?.id) {
      await supabase.from("progress").delete()
        .eq("user_id", user.id).eq("module_id", moduleId);
    }
  }, [isSignedIn, user?.id]);

  const resetAll = useCallback(async () => {
    setEntries({});
    writeLocal({});
    if (isSignedIn && HAS_SUPABASE && user?.id) {
      await supabase.from("progress").delete().eq("user_id", user.id);
    }
  }, [isSignedIn, user?.id]);

  /* ---- readers used by the progress bars ---- */
  const getModule = useCallback((moduleId) => {
    // Spread over a fresh empty entry so anything saved by an older version of
    // the app — from before a field existed — still reads back with every key set.
    const entry = { ...emptyEntry(), ...(entries[moduleId] || {}) };
    const passMark = passMarkFor(moduleId);
    return {
      ...entry,
      passMark,
      started: entry.attempts > 0 || entry.completedIds.length > 0,
      verdict: entry.attempts > 0 ? verdictFor(entry.bestPct, passMark) : null,
    };
  }, [entries]);

  /* A section's percentage: the average best score across its scored
     modules. Modules never attempted count as 0, so the bar reflects how much
     of the section is actually at test standard — not just the bits tried. */
  const getSection = useCallback((sectionId) => {
    const section = ALL_SECTIONS.find(s => s.id === sectionId);
    if (!section) return { pct: 0, started: false, ready: false };

    const scored = section.modules.filter(m => isScored(m) && m.ready);
    const readyModules = section.modules.filter(m => m.ready);
    const startedAny = readyModules.some(m => (entries[m.id]?.attempts || 0) > 0
      || (entries[m.id]?.completedIds?.length || 0) > 0);

    if (scored.length === 0) {
      return {
        pct: 0,
        started: startedAny,
        ready: readyModules.length > 0,
        scoredCount: 0,
        passedCount: 0,
      };
    }

    const total = scored.reduce((sum, m) => sum + (entries[m.id]?.bestPct || 0), 0);
    const passedCount = scored.filter(m => entries[m.id]?.passed).length;

    return {
      pct: Math.round(total / scored.length),
      started: startedAny,
      ready: true,
      scoredCount: scored.length,
      passedCount,
      allPassed: passedCount === scored.length,
    };
  }, [entries]);

  const getPath = useCallback((pathId) => {
    const path = APP_PATHS.find(p => p.id === pathId);
    if (!path) return { pct: 0, started: false };
    const sections = path.sections.map(s => getSection(s.id)).filter(s => s.ready);
    if (sections.length === 0) return { pct: 0, started: false };
    const pct = Math.round(sections.reduce((sum, s) => sum + s.pct, 0) / sections.length);
    return { pct, started: sections.some(s => s.started) };
  }, [getSection]);

  /* Headline numbers for the home screen and the profile page. */
  const overall = useMemo(() => {
    const scored = Object.entries(entries).filter(([id]) => {
      const m = MODULE_BY_ID[id];
      return m && isScored(m);
    });
    const attempts = scored.reduce((sum, [, e]) => sum + e.attempts, 0);
    const avg = scored.length
      ? Math.round(scored.reduce((sum, [, e]) => sum + e.bestPct, 0) / scored.length)
      : 0;
    const best = scored.length
      ? Math.max(...scored.map(([, e]) => e.bestPct))
      : 0;
    return {
      averagePct: avg,
      bestPct: best,
      testsTaken: attempts,
      modulesStarted: scored.length,
    };
  }, [entries]);

  /* The three weakest started modules — feeds the "Your weakest topics" card. */
  const weakest = useMemo(() => {
    return Object.entries(entries)
      .filter(([id, e]) => MODULE_BY_ID[id] && isScored(MODULE_BY_ID[id]) && e.attempts > 0)
      .sort((a, b) => a[1].bestPct - b[1].bestPct)
      .slice(0, 3)
      .map(([id, e]) => ({
        id,
        label: MODULE_BY_ID[id].label,
        sectionLabel: MODULE_BY_ID[id].sectionLabel,
        pct: e.bestPct,
      }));
  }, [entries]);

  const value = useMemo(() => ({
    entries,
    syncing,
    recordResult,
    toggleCardKnown,
    resetModule,
    resetAll,
    getModule,
    getSection,
    getPath,
    overall,
    weakest,
  }), [entries, syncing, recordResult, toggleCardKnown, resetModule, resetAll,
       getModule, getSection, getPath, overall, weakest]);

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used inside <ProgressProvider>");
  return ctx;
}

export default ProgressProvider;
