import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { supabase } from "./supabaseClient";
import SITE_CONFIG from "./siteConfig";
import ADI_CATEGORIES from "./adiQuizData";
import ADI_THEORY_PRACTICE_CATEGORIES from "./adiTheoryPracticeData";
import { ADI_FLASHCARD_CATEGORIES, ADI_FLASHCARD_CAT, ADI_FLASHCARDS } from "./adiFlashcardsData";
import {
  Home as HomeIcon, BookOpen, CalendarCheck, Menu as MenuIcon, X as CloseIcon,
  ChevronRight, ChevronLeft, Shuffle, Check, Undo2, ListFilter, ArrowRight,
  GraduationCap, Car, ShieldCheck, Layers, CheckCircle2, Star, Phone, Mail,
  MapPin, Clock, Sparkles, Lock, PlayCircle, X as XIcon,
} from "lucide-react";

/* =========================================================================
   BRAND
   PassDrivingTest.ie — deep ink (slate-900) for structure & trust, a clear
   "go" green (emerald) for progress/CTAs, and the amber/road-sign palette
   reserved for the Learning Materials & Flashcards area, so studying feels
   like its own focused space inside the same site.
   ========================================================================= */
const SITE = {
  name: "PassDrivingTest.ie",
};

/* =========================================================================
   NAVIGATION
   ========================================================================= */
const PRIMARY_NAV = [
  { id: "home", label: "Home" },
  { id: "rules", label: "Rules of the Road" },
  { id: "theory", label: "Theory & Driving Test" },
  { id: "adi", label: "Approved Driving Instructor" },
  { id: "flashcards-hub", label: "Flashcards" },
];

const TAB_BAR = [
  { id: "home", label: "Home", icon: HomeIcon },
  { id: "learning", label: "Learn", icon: BookOpen },
  { id: "booking", label: "Book", icon: CalendarCheck },
  { id: "more", label: "More", icon: MenuIcon },
];

const LEARNING_GROUP = ["rules", "theory", "adi", "adi-quiz", "adi-theory-quiz", "adi-flashcards", "flashcards-hub", "flashcards-deck", "learning"];

function isTabActive(tabId, view) {
  if (tabId === "learning") return LEARNING_GROUP.includes(view);
  if (tabId === "booking") return view === "booking";
  if (tabId === "home") return view === "home";
  return false;
}

/* =========================================================================
   SHARED BITS
   ========================================================================= */
function Logo({ compact }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-9 h-9 rounded-lg bg-emerald-500 flex items-center justify-center shrink-0">
        <CheckCircle2 size={20} className="text-white" strokeWidth={2.5} />
      </div>
      {!compact && (
        <span className="font-black tracking-tight text-lg text-white leading-none">
          Pass<span className="text-emerald-400">DrivingTest</span>
          <span className="text-slate-400">.ie</span>
        </span>
      )}
    </div>
  );
}

function SectionEyebrow({ children, tone = "emerald" }) {
  const tones = {
    emerald: "text-emerald-700 bg-emerald-50",
    amber: "text-amber-800 bg-amber-50",
  };
  return (
    <span className={`inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${tones[tone]}`}>
      {children}
    </span>
  );
}

function ComingSoonBanner({ text }) {
  return (
    <div className="flex items-start gap-3 bg-slate-100 border border-slate-200 rounded-2xl p-4">
      <Sparkles size={18} className="text-slate-500 mt-0.5 shrink-0" />
      <p className="text-sm text-slate-600">{text}</p>
    </div>
  );
}

/* =========================================================================
   HOME PAGE
   ========================================================================= */
function HomePage({ go }) {
  const quickLinks = [
    { id: "rules", label: "Rules of the Road", desc: "Ireland's official rules, explained clearly.", icon: ShieldCheck, tone: "bg-slate-900" },
    { id: "theory", label: "Theory & Driving Test", desc: "Prep for your learner theory test and full driving test.", icon: BookOpen, tone: "bg-slate-900" },
    { id: "adi", label: "Approved Driving Instructor", desc: "ADI Stage 1 mock test, theory practice and flashcards.", icon: GraduationCap, tone: "bg-slate-900" },
    { id: "booking", label: "Book a Lesson", desc: "Reserve your driving lesson online.", icon: CalendarCheck, tone: "bg-emerald-600" },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 pt-12 pb-14 sm:pt-20 sm:pb-20">
          <SectionEyebrow tone="emerald">Ireland &middot; Driving School</SectionEyebrow>
          <h1 className="mt-4 text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Study smart.<br />Pass first time.
          </h1>
          <p className="mt-4 text-slate-300 text-base sm:text-lg max-w-xl">
            Everything you need to prepare for your theory test, driving test, or ADI
            exam — plus a fast way to book your driving lesson online.
          </p>
          <div className="mt-7 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => go("booking")}
              className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold px-6 py-3 rounded-xl transition"
            >
              <CalendarCheck size={18} /> Book a Lesson
            </button>
            <button
              onClick={() => go("flashcards-deck")}
              className="inline-flex items-center justify-center gap-2 bg-transparent border border-slate-600 hover:border-emerald-400 hover:text-emerald-400 text-white font-bold px-6 py-3 rounded-xl transition"
            >
              <PlayCircle size={18} /> Start Flashcards
            </button>
          </div>
        </div>
      </section>

      {/* Quick links */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 -mt-8 sm:-mt-10 relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {quickLinks.map(q => (
            <button
              key={q.id}
              onClick={() => go(q.id)}
              className="text-left bg-white rounded-2xl shadow-lg shadow-slate-900/10 border border-slate-100 p-4 sm:p-5 hover:-translate-y-0.5 hover:shadow-xl transition"
            >
              <div className={`w-9 h-9 rounded-lg ${q.tone} flex items-center justify-center mb-3`}>
                <q.icon size={18} className="text-white" />
              </div>
              <p className="font-bold text-slate-900 text-sm sm:text-base leading-snug">{q.label}</p>
              <p className="text-xs text-slate-500 mt-1 hidden sm:block">{q.desc}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Trust strip */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 mt-10 sm:mt-14">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900">153</p>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Flashcards ready now</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900">20</p>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Topic categories</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900">3</p>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Lesson options available</p>
          </div>
        </div>
      </section>

      {/* Learning Materials + Flashcards feature */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 mt-12 sm:mt-16">
        <SectionEyebrow tone="amber">Learning Materials</SectionEyebrow>
        <h2 className="mt-3 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Study with flashcards
        </h2>
        <p className="mt-2 text-slate-600 max-w-2xl">
          Bite-sized question-and-answer cards you can flip, swipe and shuffle through —
          built to make the Rules of the Road actually stick.
        </p>

        <div className="mt-6 bg-slate-900 rounded-3xl p-5 sm:p-8 relative overflow-hidden">
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="flex-1">
              <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-400 text-slate-900">
                Available now
              </span>
              <h3 className="mt-3 text-xl sm:text-2xl font-black text-white">
                RSA Flashcards: Rules of the Road
              </h3>
              <p className="mt-2 text-slate-400 text-sm sm:text-base max-w-md">
                153 cards across 20 categories — licences, speed limits, junctions,
                signs, motorways, cyclists, pedestrians and more.
              </p>
              <button
                onClick={() => go("flashcards-deck")}
                className="mt-5 inline-flex items-center gap-2 bg-emerald-400 hover:bg-emerald-300 text-slate-900 font-bold px-5 py-2.5 rounded-xl transition"
              >
                Start studying <ArrowRight size={16} />
              </button>
            </div>
            <div className="flex gap-2 shrink-0">
              {["Signs", "Speed", "Junctions"].map((tag, i) => (
                <div
                  key={tag}
                  className="w-20 h-28 sm:w-24 sm:h-32 rounded-xl bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-center px-2"
                  style={{ transform: `rotate(${(i - 1) * 6}deg)` }}
                >
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-wide">{tag}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={() => go("learning")}
          className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-emerald-700"
        >
          Browse all learning materials <ChevronRight size={16} />
        </button>
      </section>

      {/* CTA strip */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 mt-14 sm:mt-20 mb-16">
        <div className="bg-emerald-600 rounded-3xl p-6 sm:p-10 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <div>
            <h3 className="text-xl sm:text-2xl font-black">Ready for your next lesson?</h3>
            <p className="text-emerald-100 mt-1 text-sm sm:text-base">Pick a lesson, date and time in a couple of taps.</p>
          </div>
          <button
            onClick={() => go("booking")}
            className="inline-flex items-center justify-center gap-2 bg-white text-emerald-700 font-bold px-6 py-3 rounded-xl hover:bg-emerald-50 transition shrink-0"
          >
            <CalendarCheck size={18} /> Book a Lesson Appointment
          </button>
        </div>
      </section>
    </div>
  );
}

/* =========================================================================
   LEARNING MATERIALS HUB
   ========================================================================= */
function LearningMaterialsHub({ go }) {
  const items = [
    { id: "rules", label: "Rules of the Road", desc: "The official rules, rewritten in plain English.", icon: ShieldCheck, status: "Overview available" },
    { id: "theory", label: "Theory & Driving Test", desc: "Learner theory test and full driving test prep.", icon: BookOpen, status: "Coming soon" },
    { id: "adi", label: "Approved Driving Instructor", desc: "ADI Stage 1 mock test, theory practice and flashcards.", icon: GraduationCap, status: "126+ practice questions ready" },
    { id: "flashcards-hub", label: "Flashcards", desc: "RSA-style flashcards for quick, active recall.", icon: Layers, status: "153 cards ready" },
  ];
  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
      <SectionEyebrow tone="amber">Learning Materials</SectionEyebrow>
      <h1 className="mt-3 text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Everything to help you pass</h1>
      <p className="mt-2 text-slate-600 max-w-xl">Pick a topic below to start studying.</p>

      <div className="mt-8 grid sm:grid-cols-2 gap-4">
        {items.map(it => (
          <button
            key={it.id}
            onClick={() => go(it.id)}
            className="text-left bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 hover:border-emerald-400 hover:shadow-lg transition"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center">
                <it.icon size={20} className="text-white" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wide text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                {it.status}
              </span>
            </div>
            <p className="mt-4 font-bold text-slate-900 text-lg">{it.label}</p>
            <p className="text-sm text-slate-500 mt-1">{it.desc}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-emerald-700">
              Open <ChevronRight size={15} />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* =========================================================================
   RESOURCE OVERVIEW PAGES (Rules of the Road / Theory / ADI)
   ========================================================================= */
function ResourcePage({ icon: Icon, title, tagline, points, comingSoon, cta, go }) {
  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
      <button
        onClick={() => go("learning")}
        className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-slate-400 hover:text-emerald-700 mb-6"
      >
        <ChevronLeft size={14} /> Learning Materials
      </button>

      <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center mb-5">
        <Icon size={24} className="text-white" />
      </div>
      <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">{title}</h1>
      <p className="mt-2 text-slate-600 text-base sm:text-lg max-w-xl">{tagline}</p>

      <ul className="mt-7 space-y-3">
        {points.map((p, i) => (
          <li key={i} className="flex items-start gap-3">
            <CheckCircle2 size={18} className="text-emerald-600 mt-0.5 shrink-0" />
            <span className="text-slate-700 text-sm sm:text-base">{p}</span>
          </li>
        ))}
      </ul>

      {comingSoon && (
        <div className="mt-7">
          <ComingSoonBanner text={comingSoon} />
        </div>
      )}

      {cta && (
        <button
          onClick={() => go(cta.view)}
          className="mt-7 inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-3 rounded-xl transition"
        >
          {cta.label} <ArrowRight size={16} />
        </button>
      )}
    </div>
  );
}

function RulesOfRoadPage({ go }) {
  return (
    <ResourcePage
      go={go}
      icon={ShieldCheck}
      title="Rules of the Road"
      tagline="Ireland's official rules of the road, rewritten in plain, easy-to-follow English — covering everything from licences to road signs."
      points={[
        "Licences, learner permits and the driving test",
        "Speed limits, junctions, roundabouts and motorways",
        "Traffic signs, road markings, lights and signals",
        "Rules for cyclists, motorcyclists and pedestrians",
        "Penalty points, fixed charges and driving bans",
      ]}
      comingSoon="The full illustrated study guide is being added here next. In the meantime, test yourself with the Rules of the Road flashcards — all 153 cards are ready now."
      cta={{ view: "flashcards-deck", label: "Study Rules of the Road Flashcards" }}
    />
  );
}

function TheoryTestPage({ go }) {
  return (
    <ResourcePage
      go={go}
      icon={BookOpen}
      title="Theory & Driving Test"
      tagline="Prep for both the learner Driver Theory Test and the full driving test — question banks, mock tests and hazard perception practice."
      points={[
        "Learner theory test: practice questions grouped by topic",
        "Full-length mock theory tests with instant scoring",
        "Hazard perception video practice",
        "Full driving test: what's assessed and how to prepare",
        "Progress tracking so you know when you're ready",
      ]}
      comingSoon="Theory test question banks and mock exams are coming soon. Get a head start with the Rules of the Road flashcards, which cover much of the same material."
      cta={{ view: "flashcards-deck", label: "Study Flashcards Instead" }}
    />
  );
}

/* =========================================================================
   ADI STAGE 1 THEORY PRACTICE
   Ported from a standalone practice tool into the site's own theme.
   Best scores persist in the visitor's browser (localStorage) so this is
   safe and works the same once deployed on the live site.
   ========================================================================= */
/* =========================================================================
   ADI STAGE 1 QUIZ ENGINE (generic — powers both the Mock Test and the
   Theory Practice quiz below). Ported from a standalone practice tool into
   the site's own theme.
   Best scores and bookmarks persist in the visitor's browser (localStorage),
   scoped per quiz via a storageKey prefix, so the two quizzes don't clash.
   ========================================================================= */
function loadJson(key, fallback) {
  try {
    const v = JSON.parse(localStorage.getItem(key));
    return v || fallback;
  } catch (e) {
    return fallback;
  }
}
function saveJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    /* ignore — quiz still works without persistence */
  }
}

function loadAdiBest(storageKey) {
  return loadJson(`${storageKey}-best-scores-v1`, {});
}
function saveAdiBest(storageKey, catId, score, total) {
  const data = loadAdiBest(storageKey);
  const pct = Math.round((score / total) * 100);
  if (!data[catId] || pct > data[catId]) {
    data[catId] = pct;
    saveJson(`${storageKey}-best-scores-v1`, data);
  }
  return data;
}

function loadBookmarks(storageKey) {
  return loadJson(`${storageKey}-bookmarks-v1`, []);
}
function saveBookmarks(storageKey, list) {
  saveJson(`${storageKey}-bookmarks-v1`, list);
}

function shuffledIndices(n) {
  const arr = Array.from({ length: n }, (_, i) => i);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Each category's colour family loosely mirrors real sign colours, same
// idea as the Rules of the Road flashcard categories.
const ADI_SIGN_STYLE = {
  regulatory: { bar: "bg-red-600", pill: "bg-red-50 text-red-700" },
  warning: { bar: "bg-amber-500", pill: "bg-amber-50 text-amber-800" },
  info: { bar: "bg-blue-600", pill: "bg-blue-50 text-blue-700" },
  national: { bar: "bg-emerald-600", pill: "bg-emerald-50 text-emerald-700" },
};

function AdiCategoryGrid({ categories, best, onStart }) {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {categories.map((cat, i) => {
        const style = ADI_SIGN_STYLE[cat.signType] || ADI_SIGN_STYLE.info;
        const bestPct = best[cat.id];
        return (
          <button
            key={cat.id}
            onClick={() => onStart(cat)}
            className="text-left bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg hover:border-slate-300 transition flex flex-col"
          >
            <div className={`h-1.5 ${style.bar}`} />
            <div className="p-5">
              <p className="font-mono text-xs font-bold text-slate-400 tracking-widest">
                SECTION {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-2 font-black text-slate-900 text-lg leading-snug">{cat.title}</h3>
              <p className="mt-1.5 text-sm text-slate-500">{cat.blurb}</p>
              <span className={`mt-3 inline-block text-xs font-bold px-2.5 py-1 rounded-full ${style.pill}`}>
                Pass mark: {cat.passMarkPct}%{cat.realExamQuestions ? ` (${cat.realExamQuestions} Qs on the real test)` : ""}
              </span>
              <div className="mt-4 flex items-center justify-between text-xs font-mono font-bold text-slate-500">
                <span>{cat.questions.length} practice questions</span>
                <span className={bestPct !== undefined ? "text-emerald-700" : ""}>
                  {bestPct !== undefined ? `Best: ${bestPct}%` : "Not attempted"}
                </span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function AdiQuizScreen({ cat, bookmarks, onToggleBookmark, onFinish, onExitToCategories }) {
  const [order] = useState(() => shuffledIndices(cat.questions.length));
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [chosenDisplayIndex, setChosenDisplayIndex] = useState(null);
  const [optionOrder, setOptionOrder] = useState(() => shuffledIndices(cat.questions[order[0]].options.length));
  const attemptLog = useRef([]);

  const total = cat.questions.length;
  const qOriginalIndex = order[qIndex];
  const q = cat.questions[qOriginalIndex];
  const qKey = `${cat.id}::${qOriginalIndex}`;
  const isBookmarked = bookmarks.includes(qKey);
  const correctDisplayIndex = optionOrder.indexOf(q.correct);
  const letters = ["A", "B", "C", "D", "E", "F"];

  const selectAnswer = (displayIndex) => {
    if (answered) return;
    setAnswered(true);
    setChosenDisplayIndex(displayIndex);
    const isCorrect = displayIndex === correctDisplayIndex;
    if (isCorrect) setScore(s => s + 1);
    attemptLog.current.push({
      question: q.q,
      chosenText: q.options[optionOrder[displayIndex]],
      correctText: q.options[q.correct],
      correct: isCorrect,
      explain: q.explain,
    });
  };

  const nextQuestion = () => {
    if (!answered) return;
    const nextIndex = qIndex + 1;
    if (nextIndex >= total) {
      onFinish({ score, total, log: attemptLog.current });
    } else {
      setQIndex(nextIndex);
      setAnswered(false);
      setChosenDisplayIndex(null);
      setOptionOrder(shuffledIndices(cat.questions[order[nextIndex]].options.length));
    }
  };

  const pct = Math.round((qIndex / total) * 100);

  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-8 py-8 sm:py-12">
      <button
        onClick={onExitToCategories}
        className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-slate-400 hover:text-emerald-700 mb-5"
      >
        <ChevronLeft size={14} /> All sections
      </button>

      <div className="flex items-baseline justify-between gap-3 flex-wrap mb-3">
        <span className="font-black text-slate-900">{cat.title}</span>
        <span className="font-mono text-xs font-bold text-slate-500">PASS MARK: {cat.passMarkPct}%</span>
      </div>

      {/* progress */}
      <div className="mb-6">
        <div className="h-3 bg-slate-200 rounded-full relative overflow-visible">
          <div className="h-full bg-emerald-500 rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
          <div
            className="absolute top-1/2 -translate-y-1/2 transition-all duration-300 text-lg leading-none"
            style={{ left: `${pct}%`, transform: "translate(-50%, -50%)" }}
          >
            🚗
          </div>
        </div>
        <div className="flex justify-between mt-2 font-mono text-xs font-bold text-slate-500">
          <span>QUESTION {qIndex + 1} / {total}</span>
          <span>SCORE {score}</span>
        </div>
      </div>

      {/* question card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-sm">
        <div className="flex items-start justify-between gap-3 mb-6">
          <p className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">{q.q}</p>
          <button
            onClick={() => onToggleBookmark(qKey)}
            aria-label={isBookmarked ? "Remove bookmark" : "Bookmark this question"}
            className={`shrink-0 p-2 rounded-lg border-2 transition ${isBookmarked ? "border-amber-400 bg-amber-50 text-amber-600" : "border-slate-200 text-slate-300 hover:border-slate-300 hover:text-slate-400"}`}
          >
            <Star size={18} fill={isBookmarked ? "currentColor" : "none"} />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {optionOrder.map((origIndex, displayIndex) => {
            const isChosen = chosenDisplayIndex === displayIndex;
            const isCorrectOpt = displayIndex === correctDisplayIndex;
            let stateClasses = "border-slate-200 hover:border-emerald-400 hover:bg-emerald-50";
            let letterClasses = "border-slate-200 bg-slate-50 text-slate-500";
            if (answered) {
              if (isCorrectOpt) {
                stateClasses = "border-emerald-500 bg-emerald-50";
                letterClasses = "border-emerald-500 bg-emerald-500 text-white";
              } else if (isChosen) {
                stateClasses = "border-red-500 bg-red-50";
                letterClasses = "border-red-500 bg-red-500 text-white";
              } else {
                stateClasses = "border-slate-200 opacity-50";
              }
            }
            return (
              <button
                key={origIndex}
                disabled={answered}
                onClick={() => selectAnswer(displayIndex)}
                className={`flex items-center gap-3.5 text-left border-2 rounded-xl px-4 py-3.5 font-bold text-slate-800 transition ${stateClasses}`}
              >
                <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 font-black text-sm ${letterClasses}`}>
                  {letters[displayIndex]}
                </span>
                <span>{q.options[origIndex]}</span>
              </button>
            );
          })}
        </div>

        {answered && (
          <div className="mt-5 rounded-xl bg-blue-50 border-l-4 border-blue-600 p-4 text-sm text-slate-700 leading-relaxed">
            <b className="text-blue-800">{chosenDisplayIndex === correctDisplayIndex ? "Correct." : "Not quite."}</b> {q.explain}
          </div>
        )}

        <div className="flex justify-end mt-6">
          <button
            disabled={!answered}
            onClick={nextQuestion}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold px-6 py-3 rounded-xl transition"
          >
            {qIndex === total - 1 ? "See results" : "Next question"} <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

function AdiResultsScreen({ cat, result, onRetry, onAllSections }) {
  const { score, total, log } = result;
  const pct = Math.round((score / total) * 100);
  const passed = pct >= cat.passMarkPct;

  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-8 py-8 sm:py-12">
      <div className="bg-white border border-slate-200 rounded-2xl p-7 sm:p-10 text-center shadow-sm">
        <p className={`text-6xl sm:text-7xl font-black ${passed ? "text-emerald-600" : "text-red-600"}`}>{pct}%</p>
        <p className="mt-3 text-slate-600 font-bold">{score} of {total} correct &middot; {cat.title}</p>
        <p className="mt-1 text-xs font-mono font-bold text-slate-400">
          Pass mark for this section: {cat.passMarkPct}%{cat.realExamQuestions ? ` (${cat.realExamQuestions} questions on the actual test)` : ""}
        </p>
        <span className={`inline-block mt-5 px-4 py-2 rounded-full text-sm font-black
          ${passed ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
          {passed ? "Above pass mark" : "Below pass mark — keep practising"}
        </span>
      </div>

      <div className="mt-8">
        <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-3">Review this section</p>
        <div className="space-y-3">
          {log.map((entry, i) => (
            <div key={i} className={`bg-white border rounded-xl p-4 ${entry.correct ? "border-emerald-200 border-l-4 border-l-emerald-500" : "border-red-200 border-l-4 border-l-red-500"}`}>
              <p className="font-bold text-slate-900 text-sm mb-2">{entry.question}</p>
              <p className="text-sm text-slate-600">Your answer: <b className="text-slate-900">{entry.chosenText}</b></p>
              {!entry.correct && (
                <p className="text-sm text-slate-600">Correct answer: <b className="text-slate-900">{entry.correctText}</b></p>
              )}
              <p className="text-sm text-slate-500 mt-2 leading-relaxed">{entry.explain}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mt-7">
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-3 rounded-xl transition"
        >
          Retry this section
        </button>
        <button
          onClick={onAllSections}
          className="inline-flex items-center gap-2 border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-bold px-5 py-3 rounded-xl transition"
        >
          Choose another section
        </button>
      </div>
    </div>
  );
}

function AdiBookmarksScreen({ categories, bookmarks, onToggleBookmark, onBack }) {
  // Look up each bookmarked question across every category.
  const items = [];
  bookmarks.forEach(key => {
    const [catId, idxStr] = key.split("::");
    const cat = categories.find(c => c.id === catId);
    if (!cat) return;
    const q = cat.questions[Number(idxStr)];
    if (!q) return;
    items.push({ key, cat, q });
  });

  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-8 py-8 sm:py-12">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-slate-400 hover:text-emerald-700 mb-5"
      >
        <ChevronLeft size={14} /> All sections
      </button>
      <div className="flex items-center gap-2 mb-2">
        <Star size={20} className="text-amber-500" fill="currentColor" />
        <h2 className="text-2xl font-black text-slate-900">Bookmarked Questions</h2>
      </div>
      <p className="text-slate-500 text-sm mb-6">
        Questions you've starred while practising — a quick way to revisit anything you found tricky.
      </p>

      {items.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center text-slate-500">
          No bookmarks yet. Tap the star on any question during a practice session to save it here.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(({ key, cat, q }) => (
            <div key={key} className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">{cat.title}</p>
                  <p className="font-bold text-slate-900 text-sm">{q.q}</p>
                </div>
                <button
                  onClick={() => onToggleBookmark(key)}
                  aria-label="Remove bookmark"
                  className="shrink-0 p-2 rounded-lg border-2 border-amber-400 bg-amber-50 text-amber-600"
                >
                  <Star size={16} fill="currentColor" />
                </button>
              </div>
              <p className="text-sm text-emerald-700 font-semibold mt-2">Correct answer: {q.options[q.correct]}</p>
              <p className="text-sm text-slate-500 mt-1 leading-relaxed">{q.explain}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AdiOverallResultScreen({ overall, passThreshold, onKeepGoing, onStartOver }) {
  const pct = overall.total > 0 ? Math.round((overall.correct / overall.total) * 100) : 0;
  const passed = pct >= passThreshold;
  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-8 py-8 sm:py-12">
      <div className="bg-white border border-slate-200 rounded-2xl p-7 sm:p-10 text-center shadow-sm">
        <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Overall Practice Result</p>
        <p className={`text-6xl sm:text-7xl font-black ${passed ? "text-emerald-600" : "text-red-600"}`}>{pct}%</p>
        <p className="mt-3 text-slate-600 font-bold">{overall.correct} of {overall.total} correct across this session</p>
        <p className="mt-1 text-xs font-mono font-bold text-slate-400">Pass threshold: {passThreshold}%</p>
        <span className={`inline-block mt-5 px-5 py-2.5 rounded-full text-base font-black
          ${passed ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
          {passed ? "PASS" : "FAIL"}
        </span>
      </div>
      <div className="flex flex-wrap gap-3 mt-7 justify-center">
        <button
          onClick={onKeepGoing}
          className="inline-flex items-center gap-2 border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-bold px-5 py-3 rounded-xl transition"
        >
          Keep practising
        </button>
        <button
          onClick={onStartOver}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-3 rounded-xl transition"
        >
          Start a fresh session
        </button>
      </div>
    </div>
  );
}

function AdiQuizApp({ onBack, categories, storageKey, title, badge, description, note }) {
  const [stage, setStage] = useState("categories"); // categories | quiz | results | bookmarks | overall
  const [currentCat, setCurrentCat] = useState(null);
  const [result, setResult] = useState(null);
  const [best, setBest] = useState(() => loadAdiBest(storageKey));
  const [bookmarks, setBookmarks] = useState(() => loadBookmarks(storageKey));
  const [overall, setOverall] = useState({ correct: 0, total: 0 });
  const [quizKey, setQuizKey] = useState(0); // bump to force a fresh AdiQuizScreen instance

  const toggleBookmark = (key) => {
    setBookmarks(prev => {
      const next = prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key];
      saveBookmarks(storageKey, next);
      return next;
    });
  };

  const startQuiz = (cat) => {
    setCurrentCat(cat);
    setResult(null);
    setQuizKey(k => k + 1);
    setStage("quiz");
  };

  const finishQuiz = ({ score, total, log }) => {
    const updated = saveAdiBest(storageKey, currentCat.id, score, total);
    setBest(updated);
    setResult({ score, total, log });
    setOverall(o => ({ correct: o.correct + score, total: o.total + total }));
    setStage("results");
  };

  const PASS_THRESHOLD = 75;
  const overallPct = overall.total > 0 ? Math.round((overall.correct / overall.total) * 100) : null;

  return (
    <div>
      <div className="bg-slate-900 text-white">
        <div className="max-w-2xl mx-auto px-5 sm:px-8 py-8 sm:py-10">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-slate-400 hover:text-emerald-400 mb-4"
          >
            <ChevronLeft size={14} /> Back to Approved Driving Instructor
          </button>
          <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-400 text-slate-900">
            {badge}
          </span>
          <h1 className="mt-3 text-2xl sm:text-3xl font-black tracking-tight">{title}</h1>
          <p className="mt-2 text-slate-300 text-sm sm:text-base max-w-xl">{description}</p>
          {note && (
            <p className="mt-3 text-xs text-slate-400 max-w-xl leading-relaxed border-t border-slate-800 pt-3">{note}</p>
          )}

          {overall.total > 0 && (
            <div className="mt-4 flex items-center gap-3 bg-slate-800/60 rounded-xl px-4 py-3">
              <div className="flex-1">
                <div className="flex justify-between text-xs font-mono font-bold text-slate-300 mb-1">
                  <span>OVERALL THIS SESSION</span>
                  <span>{overall.correct}/{overall.total} ({overallPct}%)</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${overallPct >= PASS_THRESHOLD ? "bg-emerald-400" : "bg-amber-400"}`}
                    style={{ width: `${Math.min(overallPct, 100)}%` }}
                  />
                </div>
              </div>
              <button
                onClick={() => setStage("overall")}
                className="shrink-0 text-xs font-bold uppercase tracking-wide bg-white text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100"
              >
                Finish &amp; See Result
              </button>
            </div>
          )}
        </div>
      </div>

      {stage === "categories" && (
        <div className="max-w-2xl mx-auto px-5 sm:px-8 py-8 sm:py-12">
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setStage("bookmarks")}
              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-amber-700 bg-amber-50 px-3 py-2 rounded-full hover:bg-amber-100"
            >
              <Star size={14} fill="currentColor" /> Bookmarks ({bookmarks.length})
            </button>
          </div>
          <AdiCategoryGrid categories={categories} best={best} onStart={startQuiz} />
        </div>
      )}

      {stage === "quiz" && currentCat && (
        <AdiQuizScreen
          key={quizKey}
          cat={currentCat}
          bookmarks={bookmarks}
          onToggleBookmark={toggleBookmark}
          onFinish={finishQuiz}
          onExitToCategories={() => setStage("categories")}
        />
      )}

      {stage === "results" && currentCat && result && (
        <AdiResultsScreen
          cat={currentCat}
          result={result}
          onRetry={() => startQuiz(currentCat)}
          onAllSections={() => setStage("categories")}
        />
      )}

      {stage === "bookmarks" && (
        <AdiBookmarksScreen
          categories={categories}
          bookmarks={bookmarks}
          onToggleBookmark={toggleBookmark}
          onBack={() => setStage("categories")}
        />
      )}

      {stage === "overall" && (
        <AdiOverallResultScreen
          overall={overall}
          passThreshold={PASS_THRESHOLD}
          onKeepGoing={() => setStage("categories")}
          onStartOver={() => { setOverall({ correct: 0, total: 0 }); setStage("categories"); }}
        />
      )}

      <div className="max-w-2xl mx-auto px-5 sm:px-8 pb-10 text-center text-xs text-slate-400 leading-relaxed">
        Content grounded in RSA source material — the Driving Instructor's Handbook, official ADI Stage 1
        sample questions, and the Driver Tester Marking Guidelines. This is an independent practice tool,
        not affiliated with the RSA — always confirm current requirements at rsa.ie.
      </div>
    </div>
  );
}



function ADITestPage({ go }) {
  const items = [
    {
      view: "adi-quiz",
      label: "ADI Stage 1 Mock Test",
      desc: "151 questions across the 5 official exam sections, weighted to match the real test's structure and pass marks.",
      icon: ShieldCheck,
      tone: "bg-slate-900",
    },
    {
      view: "adi-theory-quiz",
      label: "ADI Stage 1 Theory Practice",
      desc: "126 additional practice questions sourced from mock papers and the RSA's own official sample questions, with bookmarking and an overall pass/fail score.",
      icon: BookOpen,
      tone: "bg-emerald-600",
    },
    {
      view: "adi-flashcards",
      label: "ADI Flashcards",
      desc: "62 quick-recall flashcards covering test procedure, pedagogy, mechanics, towing and pedestrian crossings.",
      icon: Layers,
      tone: "bg-amber-500",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
      <button
        onClick={() => go("learning")}
        className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-slate-400 hover:text-emerald-700 mb-6"
      >
        <ChevronLeft size={14} /> Learning Materials
      </button>

      <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center mb-5">
        <GraduationCap size={24} className="text-white" />
      </div>
      <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Approved Driving Instructor</h1>
      <p className="mt-2 text-slate-600 text-base sm:text-lg max-w-xl">
        Everything to prepare for the ADI Stage 1 theory test — grounded in RSA source material,
        official sample questions, and real mock papers.
      </p>

      <div className="mt-8 space-y-3">
        {items.map(it => (
          <button
            key={it.view}
            onClick={() => go(it.view)}
            className="w-full text-left flex items-center gap-4 bg-white border border-slate-200 rounded-2xl p-5 hover:border-emerald-400 hover:shadow-lg transition"
          >
            <div className={`w-11 h-11 rounded-xl ${it.tone} flex items-center justify-center shrink-0`}>
              <it.icon size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-slate-900">{it.label}</p>
              <p className="text-sm text-slate-500 mt-0.5">{it.desc}</p>
            </div>
            <ChevronRight size={18} className="text-slate-300 shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
}

/* =========================================================================
   FLASHCARDS HUB (menu of decks)
   ========================================================================= */
function FlashcardsHub({ go }) {
  const decks = [
    { id: "flashcards-deck", label: "Rules of the Road", count: 153, ready: true, desc: "Licences, signs, speed limits, junctions and more." },
    { id: null, label: "Theory Test Flashcards", count: null, ready: false, desc: "Coming soon." },
    { id: null, label: "ADI Flashcards", count: null, ready: false, desc: "Coming soon." },
  ];
  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
      <button
        onClick={() => go("learning")}
        className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-slate-400 hover:text-emerald-700 mb-6"
      >
        <ChevronLeft size={14} /> Learning Materials
      </button>

      <SectionEyebrow tone="amber">Flashcards</SectionEyebrow>
      <h1 className="mt-3 text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">RSA Flashcards</h1>
      <p className="mt-2 text-slate-600 max-w-xl">Quick-fire question-and-answer decks for active recall study.</p>

      <div className="mt-7 space-y-3">
        {decks.map(d => (
          <button
            key={d.label}
            disabled={!d.ready}
            onClick={() => d.ready && go(d.id)}
            className={`w-full text-left flex items-center gap-4 rounded-2xl p-5 border transition
              ${d.ready
                ? "bg-slate-900 border-slate-800 hover:border-emerald-400"
                : "bg-slate-50 border-slate-200 opacity-70 cursor-not-allowed"}`}
          >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${d.ready ? "bg-emerald-400" : "bg-slate-300"}`}>
              {d.ready ? <Layers size={20} className="text-slate-900" /> : <Lock size={18} className="text-slate-500" />}
            </div>
            <div className="flex-1">
              <p className={`font-bold ${d.ready ? "text-white" : "text-slate-600"}`}>{d.label}</p>
              <p className={`text-sm mt-0.5 ${d.ready ? "text-slate-400" : "text-slate-400"}`}>
                {d.ready ? `${d.count} cards \u00b7 20 categories` : d.desc}
              </p>
            </div>
            {d.ready && <ChevronRight size={18} className="text-emerald-400 shrink-0" />}
          </button>
        ))}
      </div>
    </div>
  );
}

/* =========================================================================
   BOOK A TEST APPOINTMENT
   A working prototype booking flow (session-only). Ready to be wired up to
   a real backend/booking API later.
   ========================================================================= */
const LESSON_ICONS = { "1hr": Clock, "2hr": Car, pretest: ShieldCheck };
const LESSON_TYPES = SITE_CONFIG.lessons.map(l => ({ ...l, icon: LESSON_ICONS[l.id] || Car }));

function formatDateStr(dateStr) {
  // dateStr is "YYYY-MM-DD" from the database
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-IE", { weekday: "short", day: "numeric", month: "short" });
}
function formatTimeStr(t) {
  // Postgres time comes back like "09:00:00" — trim to "09:00"
  return t.slice(0, 5);
}

/* =========================================================================
   BOOK A LESSON — reads real availability from Supabase, and atomically
   locks a slot the moment someone books it so two people can never take
   the same time.
   ========================================================================= */
function BookingPage() {
  const [step, setStep] = useState(1);
  const [lessonType, setLessonType] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [contact, setContact] = useState({ name: "", email: "", phone: "" });
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const selectedLesson = LESSON_TYPES.find(t => t.id === lessonType);

  const loadSlots = useCallback(async () => {
    setLoadingSlots(true);
    setLoadError(null);
    const { data, error } = await supabase
      .from("slots")
      .select("id, slot_date, slot_time, is_booked")
      .eq("is_booked", false)
      .order("slot_date", { ascending: true })
      .order("slot_time", { ascending: true });
    if (error) {
      setLoadError("Couldn't load available times right now. Please try again shortly.");
    } else {
      setSlots(data || []);
    }
    setLoadingSlots(false);
  }, []);

  useEffect(() => { loadSlots(); }, [loadSlots]);

  // Group open slots by date
  const dateGroups = useMemo(() => {
    const map = new Map();
    slots.forEach(s => {
      if (!map.has(s.slot_date)) map.set(s.slot_date, []);
      map.get(s.slot_date).push(s);
    });
    return Array.from(map.entries()).map(([date, list]) => ({ date, slots: list }));
  }, [slots]);

  const slotsForSelectedDate = dateGroups.find(g => g.date === selectedDate)?.slots || [];

  const canContinueStep1 = !!lessonType;
  const canContinueStep2 = !!selectedSlot;
  const canSubmit = contact.name.trim() && contact.email.trim() && contact.phone.trim();

  const startOver = () => {
    setStep(1); setLessonType(null); setSelectedDate(null); setSelectedSlot(null);
    setContact({ name: "", email: "", phone: "" }); setConfirmed(false); setSubmitError(null);
    loadSlots();
  };

  const submitBooking = async () => {
    if (!selectedSlot) return;
    setSubmitting(true);
    setSubmitError(null);

    // Atomically claim the slot: this UPDATE only succeeds if it's still open.
    // If someone else grabbed it a second earlier, affected rows = 0.
    const { data: updated, error: updateError } = await supabase
      .from("slots")
      .update({ is_booked: true })
      .eq("id", selectedSlot.id)
      .eq("is_booked", false)
      .select();

    if (updateError || !updated || updated.length === 0) {
      setSubmitError("Sorry — that time was just taken by someone else. Please pick another.");
      setSubmitting(false);
      setSelectedSlot(null);
      loadSlots();
      return;
    }

    const { error: insertError } = await supabase.from("bookings").insert({
      slot_id: selectedSlot.id,
      lesson_type: lessonType,
      full_name: contact.name.trim(),
      email: contact.email.trim(),
      phone: contact.phone.trim(),
    });

    setSubmitting(false);

    if (insertError) {
      setSubmitError("Your time slot was reserved, but saving your details failed. Please contact us directly to confirm.");
      return;
    }

    // Fire off confirmation emails — if this fails, the booking itself has
    // already succeeded, so we still show the confirmation screen either way.
    fetch("/api/send-booking-emails", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: contact.name.trim(),
        email: contact.email.trim(),
        phone: contact.phone.trim(),
        lessonLabel: selectedLesson.label,
        price: selectedLesson.price,
        dateLabel: formatDateStr(selectedSlot.slot_date),
        timeLabel: formatTimeStr(selectedSlot.slot_time),
      }),
    }).catch(() => { /* booking still succeeded even if the email failed */ });

    setConfirmed(true);
  };

  if (confirmed) {
    return (
      <div className="max-w-lg mx-auto px-5 sm:px-8 py-14 sm:py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto">
          <CheckCircle2 size={32} className="text-emerald-600" />
        </div>
        <h1 className="mt-5 text-2xl sm:text-3xl font-black text-slate-900">Lesson booked</h1>
        <p className="mt-2 text-slate-600">
          We've booked your {selectedLesson.label.toLowerCase()} for{" "}
          <span className="font-semibold text-slate-900">{formatDateStr(selectedSlot.slot_date)} at {formatTimeStr(selectedSlot.slot_time)}</span>.
          A confirmation will be sent to <span className="font-semibold text-slate-900">{contact.email}</span>.
        </p>
        <div className="mt-6 bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left text-sm space-y-2">
          <div className="flex justify-between"><span className="text-slate-500">Lesson</span><span className="font-semibold text-slate-900">{selectedLesson.label}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Date</span><span className="font-semibold text-slate-900">{formatDateStr(selectedSlot.slot_date)}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Time</span><span className="font-semibold text-slate-900">{formatTimeStr(selectedSlot.slot_time)}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Fee</span><span className="font-semibold text-slate-900">{selectedLesson.price}</span></div>
        </div>
        <button
          onClick={startOver}
          className="mt-7 inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-3 rounded-xl transition"
        >
          Book another lesson
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
      <SectionEyebrow tone="emerald">Book a Lesson</SectionEyebrow>
      <h1 className="mt-3 text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Book your lesson</h1>
      <p className="mt-2 text-slate-600">Choose a lesson, pick a real available slot, and confirm your details.</p>

      {/* Stepper */}
      <div className="flex items-center gap-2 mt-7 mb-8">
        {[1, 2, 3].map(n => (
          <React.Fragment key={n}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0
              ${step >= n ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-500"}`}>
              {n}
            </div>
            {n < 3 && <div className={`flex-1 h-1 rounded ${step > n ? "bg-emerald-600" : "bg-slate-200"}`} />}
          </React.Fragment>
        ))}
      </div>

      {/* Step 1: lesson type */}
      {step === 1 && (
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-3">Select a lesson</p>
          <div className="space-y-3">
            {LESSON_TYPES.map(t => (
              <button
                key={t.id}
                onClick={() => setLessonType(t.id)}
                className={`w-full flex items-center gap-4 rounded-2xl p-4 border-2 text-left transition
                  ${lessonType === t.id ? "border-emerald-600 bg-emerald-50" : "border-slate-200 hover:border-slate-300"}`}
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${lessonType === t.id ? "bg-emerald-600" : "bg-slate-900"}`}>
                  <t.icon size={20} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-900">{t.label}</p>
                  <p className="text-sm text-slate-500">{t.duration} &middot; {t.price}</p>
                </div>
                {lessonType === t.id && <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />}
              </button>
            ))}
          </div>
          <button
            disabled={!canContinueStep1}
            onClick={() => setStep(2)}
            className="mt-7 w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold px-6 py-3 rounded-xl transition"
          >
            Continue <ArrowRight size={16} />
          </button>
        </div>
      )}

      {/* Step 2: date/time — real availability from Supabase */}
      {step === 2 && (
        <div>
          {loadingSlots && (
            <p className="text-slate-500 text-sm">Loading available times...</p>
          )}
          {loadError && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-4">{loadError}</div>
          )}
          {!loadingSlots && !loadError && dateGroups.length === 0 && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center text-slate-500 text-sm">
              No lesson times are open right now — please check back soon, or contact us directly.
            </div>
          )}

          {!loadingSlots && dateGroups.length > 0 && (
            <>
              <p className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-3">Choose a date</p>
              <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
                {dateGroups.map(g => {
                  const d = new Date(g.date + "T00:00:00");
                  return (
                    <button
                      key={g.date}
                      onClick={() => { setSelectedDate(g.date); setSelectedSlot(null); }}
                      className={`shrink-0 flex flex-col items-center justify-center w-20 h-20 rounded-2xl border-2 transition
                        ${selectedDate === g.date ? "border-emerald-600 bg-emerald-50" : "border-slate-200 hover:border-slate-300"}`}
                    >
                      <span className="text-xs font-semibold text-slate-500">{d.toLocaleDateString("en-IE", { weekday: "short" })}</span>
                      <span className="text-lg font-black text-slate-900">{d.getDate()}</span>
                      <span className="text-xs text-slate-500">{d.toLocaleDateString("en-IE", { month: "short" })}</span>
                    </button>
                  );
                })}
              </div>

              {selectedDate && (
                <>
                  <p className="text-sm font-bold uppercase tracking-widest text-slate-500 mt-6 mb-3">Choose a time</p>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {slotsForSelectedDate.map(s => (
                      <button
                        key={s.id}
                        onClick={() => setSelectedSlot(s)}
                        className={`py-2.5 rounded-xl border-2 text-sm font-bold transition
                          ${selectedSlot?.id === s.id ? "border-emerald-600 bg-emerald-50 text-emerald-700" : "border-slate-200 text-slate-700 hover:border-slate-300"}`}
                      >
                        {formatTimeStr(s.slot_time)}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </>
          )}

          <div className="flex gap-3 mt-7">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-1.5 px-5 py-3 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50"
            >
              <ChevronLeft size={16} /> Back
            </button>
            <button
              disabled={!canContinueStep2}
              onClick={() => setStep(3)}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold px-6 py-3 rounded-xl transition"
            >
              Continue <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: contact details */}
      {step === 3 && (
        <div>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6 flex items-center gap-3 text-sm">
            <Clock size={16} className="text-slate-500 shrink-0" />
            <span className="text-slate-700">
              {selectedLesson?.label} &middot; {selectedSlot && formatDateStr(selectedSlot.slot_date)} at {selectedSlot && formatTimeStr(selectedSlot.slot_time)}
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-bold text-slate-700 block mb-1.5">Full name</label>
              <input
                type="text"
                value={contact.name}
                onChange={e => setContact({ ...contact, name: e.target.value })}
                placeholder="Jane Murphy"
                className="w-full border-2 border-slate-200 focus:border-emerald-500 outline-none rounded-xl px-4 py-3 text-slate-900"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-slate-700 block mb-1.5">Email</label>
              <input
                type="email"
                value={contact.email}
                onChange={e => setContact({ ...contact, email: e.target.value })}
                placeholder="jane@example.com"
                className="w-full border-2 border-slate-200 focus:border-emerald-500 outline-none rounded-xl px-4 py-3 text-slate-900"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-slate-700 block mb-1.5">Phone number</label>
              <input
                type="tel"
                value={contact.phone}
                onChange={e => setContact({ ...contact, phone: e.target.value })}
                placeholder="087 123 4567"
                className="w-full border-2 border-slate-200 focus:border-emerald-500 outline-none rounded-xl px-4 py-3 text-slate-900"
              />
            </div>
          </div>

          {submitError && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-4">{submitError}</div>
          )}

          <div className="flex gap-3 mt-7">
            <button
              onClick={() => setStep(2)}
              className="flex items-center gap-1.5 px-5 py-3 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50"
            >
              <ChevronLeft size={16} /> Back
            </button>
            <button
              disabled={!canSubmit || submitting}
              onClick={submitBooking}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold px-6 py-3 rounded-xl transition"
            >
              <CalendarCheck size={16} /> {submitting ? "Booking..." : "Confirm booking"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   ADMIN — owner-only page (not in the public nav). Reach it by visiting
   yoursite.com/#admin. Requires logging in with the owner account created
   in the Supabase dashboard (Authentication -> Users -> Add user).
   ========================================================================= */
function AdminLogin({ onLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      setError("Login failed — check your email and password and try again.");
    } else {
      onLoggedIn();
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-5">
      <form onSubmit={submit} className="w-full max-w-sm bg-white rounded-2xl p-7 shadow-xl">
        <h1 className="text-xl font-black text-slate-900 mb-1">Owner Login</h1>
        <p className="text-sm text-slate-500 mb-5">Manage your lesson availability and bookings.</p>
        <div className="space-y-3">
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full border-2 border-slate-200 focus:border-emerald-500 outline-none rounded-xl px-4 py-3"
          />
          <input
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full border-2 border-slate-200 focus:border-emerald-500 outline-none rounded-xl px-4 py-3"
          />
        </div>
        {error && <p className="text-red-600 text-sm mt-3">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="mt-5 w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-200 text-white font-bold py-3 rounded-xl transition"
        >
          {busy ? "Logging in..." : "Log In"}
        </button>
      </form>
    </div>
  );
}

function icsPad(n) {
  return String(n).padStart(2, "0");
}
function toIcsLocalTime(date) {
  return `${date.getFullYear()}${icsPad(date.getMonth() + 1)}${icsPad(date.getDate())}T${icsPad(date.getHours())}${icsPad(date.getMinutes())}${icsPad(date.getSeconds())}`;
}
function lessonDurationMinutes(lessonId) {
  const lesson = LESSON_TYPES.find(l => l.id === lessonId);
  const match = lesson ? /(\d+)/.exec(lesson.duration) : null;
  return match ? parseInt(match[1], 10) : 60;
}
function buildBookingIcsDataUrl(booking) {
  if (!booking.slots) return null;
  const lesson = LESSON_TYPES.find(l => l.id === booking.lesson_type);
  const label = lesson?.label || booking.lesson_type;
  const durationMin = lessonDurationMinutes(booking.lesson_type);
  const start = new Date(`${booking.slots.slot_date}T${booking.slots.slot_time}`);
  const end = new Date(start.getTime() + durationMin * 60000);
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//PassDrivingTest.ie//Booking//EN",
    "BEGIN:VEVENT",
    `UID:${booking.id}@passdrivingtest.ie`,
    `DTSTAMP:${toIcsLocalTime(new Date())}`,
    `DTSTART:${toIcsLocalTime(start)}`,
    `DTEND:${toIcsLocalTime(end)}`,
    `SUMMARY:Driving Lesson - ${booking.full_name} (${label})`,
    `DESCRIPTION:Contact: ${booking.email}\\, ${booking.phone}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(lines.join("\r\n"))}`;
}

function AdminDashboard({ onLogout }) {
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newDate, setNewDate] = useState("");
  const [bulkStart, setBulkStart] = useState("09:00");
  const [bulkEnd, setBulkEnd] = useState("17:00");
  const [bulkLength, setBulkLength] = useState(40);
  const [message, setMessage] = useState(null);

  const loadAll = useCallback(async () => {
    setLoading(true);
    const [{ data: slotData }, { data: bookingData }] = await Promise.all([
      supabase.from("slots").select("*").order("slot_date").order("slot_time"),
      supabase.from("bookings").select("*, slots(slot_date, slot_time)").order("created_at", { ascending: false }),
    ]);
    setSlots(slotData || []);
    setBookings(bookingData || []);
    setLoading(false);
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  const addBulkSlots = async (e) => {
    e.preventDefault();
    if (!newDate) return;
    const rows = [];
    let [h, m] = bulkStart.split(":").map(Number);
    const [endH, endM] = bulkEnd.split(":").map(Number);
    while (h < endH || (h === endH && m < endM)) {
      rows.push({ slot_date: newDate, slot_time: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00` });
      m += Number(bulkLength);
      while (m >= 60) { m -= 60; h += 1; }
    }
    const { error } = await supabase.from("slots").upsert(rows, { onConflict: "slot_date,slot_time", ignoreDuplicates: true });
    setMessage(error ? "Couldn't add those slots." : `Added ${rows.length} slot(s) for ${newDate}.`);
    loadAll();
  };

  const removeSlot = async (id) => {
    await supabase.from("slots").delete().eq("id", id);
    loadAll();
  };

  const cancelBooking = async (booking) => {
    await supabase.from("bookings").delete().eq("id", booking.id);
    await supabase.from("slots").update({ is_booked: false }).eq("id", booking.slot_id);
    loadAll();
  };

  const upcomingOpenSlots = slots.filter(s => !s.is_booked);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 text-white px-5 sm:px-8 py-6 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-emerald-400 font-bold">Owner Dashboard</p>
          <h1 className="text-xl font-black">Manage Bookings & Availability</h1>
        </div>
        <button
          onClick={onLogout}
          className="text-sm font-bold border border-slate-600 rounded-lg px-3 py-2 hover:bg-slate-800"
        >
          Log out
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-5 sm:px-8 py-8 space-y-10">
        {/* Add availability */}
        <section>
          <h2 className="text-lg font-black text-slate-900 mb-3">Open up new lesson times</h2>
          <form onSubmit={addBulkSlots} className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-wrap items-end gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Date</label>
              <input type="date" required value={newDate} onChange={e => setNewDate(e.target.value)}
                className="border-2 border-slate-200 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Start time</label>
              <input type="time" value={bulkStart} onChange={e => setBulkStart(e.target.value)}
                className="border-2 border-slate-200 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">End time</label>
              <input type="time" value={bulkEnd} onChange={e => setBulkEnd(e.target.value)}
                className="border-2 border-slate-200 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Slot length (mins)</label>
              <input type="number" min="10" step="5" value={bulkLength} onChange={e => setBulkLength(e.target.value)}
                className="border-2 border-slate-200 rounded-lg px-3 py-2 w-24" />
            </div>
            <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2.5 rounded-lg">
              Add slots
            </button>
          </form>
          {message && <p className="text-sm text-emerald-700 mt-2">{message}</p>}
          <p className="text-xs text-slate-400 mt-2">
            Example: 09:00 to 17:00 in 40-minute slots creates a full day of lesson times in one click.
          </p>
        </section>

        {/* Open slots list */}
        <section>
          <h2 className="text-lg font-black text-slate-900 mb-3">Open slots ({upcomingOpenSlots.length})</h2>
          {loading ? <p className="text-slate-400 text-sm">Loading...</p> : (
            <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100 max-h-80 overflow-y-auto">
              {upcomingOpenSlots.length === 0 && <p className="p-4 text-sm text-slate-400">No open slots yet — add some above.</p>}
              {upcomingOpenSlots.map(s => (
                <div key={s.id} className="flex items-center justify-between px-4 py-2.5 text-sm">
                  <span className="font-semibold text-slate-700">{formatDateStr(s.slot_date)} &middot; {formatTimeStr(s.slot_time)}</span>
                  <button onClick={() => removeSlot(s.id)} className="text-red-600 text-xs font-bold hover:underline">Remove</button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Bookings list */}
        <section>
          <h2 className="text-lg font-black text-slate-900 mb-3">Bookings ({bookings.length})</h2>
          {loading ? <p className="text-slate-400 text-sm">Loading...</p> : (
            <div className="space-y-3">
              {bookings.length === 0 && <p className="text-sm text-slate-400">No bookings yet.</p>}
              {bookings.map(b => {
                const icsUrl = buildBookingIcsDataUrl(b);
                return (
                  <div key={b.id} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-bold text-slate-900">{b.full_name} &middot; {LESSON_TYPES.find(l => l.id === b.lesson_type)?.label || b.lesson_type}</p>
                      <p className="text-sm text-slate-500">
                        {b.slots ? `${formatDateStr(b.slots.slot_date)} at ${formatTimeStr(b.slots.slot_time)}` : "Time slot removed"}
                      </p>
                      <p className="text-xs text-slate-400 mt-1 flex flex-wrap gap-x-1">
                        <a href={`mailto:${b.email}`} className="text-emerald-700 hover:underline">{b.email}</a>
                        <span>&middot;</span>
                        <a href={`tel:${b.phone}`} className="text-emerald-700 hover:underline">{b.phone}</a>
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      {icsUrl && (
                        <a
                          href={icsUrl}
                          download={`lesson-${b.full_name.replace(/\s+/g, "-")}.ics`}
                          className="text-emerald-700 text-xs font-bold border border-emerald-200 rounded-lg px-3 py-2 hover:bg-emerald-50 text-center"
                        >
                          Add to Calendar
                        </a>
                      )}
                      <button onClick={() => cancelBooking(b)} className="text-red-600 text-xs font-bold border border-red-200 rounded-lg px-3 py-2 hover:bg-red-50">
                        Cancel
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function AdminPage() {
  const [session, setSession] = useState(undefined); // undefined = checking, null = logged out

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => listener.subscription.unsubscribe();
  }, []);

  if (session === undefined) {
    return <div className="min-h-screen bg-slate-900" />;
  }
  if (!session) {
    return <AdminLogin onLoggedIn={() => {}} />;
  }
  return <AdminDashboard onLogout={() => supabase.auth.signOut()} />;
}




/* =========================================================================
   FLASHCARD DATA & DECK COMPONENT (Rules of the Road)
   ========================================================================= */
const CATEGORIES = [
  { id: "licences",   label: "Licences & Categories",   swatch: "bg-blue-600" },
  { id: "learner",     label: "Learner Driver",          swatch: "bg-sky-600" },
  { id: "test",        label: "Driving Test",            swatch: "bg-indigo-600" },
  { id: "vehicle",     label: "Vehicle Safety",          swatch: "bg-emerald-600" },
  { id: "practice",    label: "Good Driving Practice",   swatch: "bg-teal-600" },
  { id: "signs",       label: "Signs & Road Markings",   swatch: "bg-red-600" },
  { id: "lights",      label: "Lights & Signals",        swatch: "bg-amber-500", dark: true },
  { id: "speed",       label: "Speed Limits",            swatch: "bg-orange-600" },
  { id: "junctions",   label: "Junctions & Roundabouts", swatch: "bg-purple-600" },
  { id: "parking",     label: "Parking",                 swatch: "bg-fuchsia-600" },
  { id: "motorway",    label: "Motorways & Tunnels",     swatch: "bg-blue-800" },
  { id: "garda",       label: "Assisting Gardai",        swatch: "bg-slate-600" },
  { id: "impair",      label: "Alcohol, Drugs & Fatigue",swatch: "bg-rose-600" },
  { id: "incident",    label: "Incident Scene",          swatch: "bg-red-800" },
  { id: "points",      label: "Penalty Points & Bans",   swatch: "bg-yellow-500", dark: true },
  { id: "moto",        label: "Motorcyclists",           swatch: "bg-cyan-600" },
  { id: "cycle",       label: "Cyclists & E-Scooters",   swatch: "bg-lime-600", dark: true },
  { id: "pedestrian",  label: "Pedestrians",             swatch: "bg-green-600" },
  { id: "otherusers",  label: "Other Road Users",        swatch: "bg-stone-600" },
  { id: "recognise",   label: "Sign Recognition",        swatch: "bg-red-700" },
];
const CAT = Object.fromEntries(CATEGORIES.map(c => [c.id, c]));

const RAW_CARDS = [
  // ---------------- LICENCES & CATEGORIES ----------------
  { c: "licences", q: "Minimum age for a first learner permit — category B (car)?", a: "17 years old." },
  { c: "licences", q: "Minimum age for category A1 (small motorcycle, up to 125cc)?", a: "16 years old." },
  { c: "licences", q: "Minimum age to ride an unrestricted category A motorcycle without progressive access?", a: "24 years old (or 20 with progressive access)." },
  { c: "licences", q: "What licence category covers work vehicles and land tractors?", a: "Category W — minimum age 16." },
  { c: "licences", q: "On a full category B licence, when can you tow a trailer without needing category BE?", a: "When the trailer's MAM is 750kg or less, or the combined vehicle+trailer weight is 3,500kg or less." },
  { c: "licences", q: "Who needs a Driver CPC (Certificate of Professional Competence)?", a: "Professional bus drivers (D, D1, DE, D1E) and professional truck drivers (C, C1, CE, C1E)." },
  { c: "licences", q: "How long is a full car/motorcycle driving licence valid for?", a: "10 years (5 years for trucks and buses)." },
  { c: "licences", q: "How long must you display N-plates after getting your first full licence?", a: "2 years — you're a 'novice driver' for that period." },

  // ---------------- LEARNER DRIVER ----------------
  { c: "learner", q: "Must a learner permit holder for category B always be accompanied?", a: "Yes — by a qualified driver who has held a full licence in that category for 2 continuous years." },
  { c: "learner", q: "Do AM/A1/A2/A learner permit holders need an accompanying qualified driver?", a: "No, but they can't ride unsupervised until they've completed Initial Basic Training (IBT)." },
  { c: "learner", q: "What colour and letter must L-plates show, and minimum letter height?", a: "A red 'L' on a white background, at least 15cm tall, with a 2cm border." },
  { c: "learner", q: "How do motorcycle/moped learners (A, A1, A2, AM) display their L-plates?", a: "On a yellow fluorescent tabard worn on the body, visible front and back." },
  { c: "learner", q: "How many one-hour sessions make up Essential Driver Training (EDT)?", a: "12 sessions, with an Approved Driving Instructor (ADI)." },
  { c: "learner", q: "How many hours is Initial Basic Training (IBT) for motorcyclists, and how many modules?", a: "16 hours, in 4 sequential modules." },
  { c: "learner", q: "What is the 'six-month rule' for first-time learner permit holders?", a: "You can't sit your driving test for 6 months after the permit starts (categories A, A1, A2, AM, B, W)." },
  { c: "learner", q: "What's the drink-drive alcohol limit for learner, novice and professional drivers?", a: "20mg of alcohol per 100ml of blood." },

  // ---------------- DRIVING TEST ----------------
  { c: "test", q: "How long before your test appointment should you arrive at the test centre?", a: "At least 10 minutes early." },
  { c: "test", q: "Roughly how long does the test last for categories A, A1, A2, AM, B, BE and W?", a: "About 40 minutes, over roughly 8–10km." },
  { c: "test", q: "What do you get if you pass your driving test?", a: "A Certificate of Competency — exchange it for your full licence within 2 years." },
  { c: "test", q: "Name three reasons your driving test could be cancelled (fee lost).", a: "Any of: arriving late; wrong/missing discs or L-plates; unroadworthy vehicle; wrong vehicle for the category." },
  { c: "test", q: "What is 'progressive access' for motorcyclists?", a: "Moving to a higher motorcycle licence category without an extra test, after holding the lower category long enough." },

  // ---------------- VEHICLE SAFETY ----------------
  { c: "vehicle", q: "What is the legal minimum tyre tread depth?", a: "1.6mm across the main tread (though it's wise to replace at 3mm)." },
  { c: "vehicle", q: "When may you use fog lights?", a: "Only in dense fog or falling snow — switch them off otherwise." },
  { c: "vehicle", q: "Who may fit blue or red flashing lights to a vehicle?", a: "No one except Gardai, ambulances and other designated emergency service vehicles." },
  { c: "vehicle", q: "A child must use a child restraint system (CRS) until what height/weight?", a: "Until they're 150cm tall or 36kg, whichever comes first." },
  { c: "vehicle", q: "What EU child-seat standard replaced the older R44 standard from 1 September 2024?", a: "R129 (i-Size) — R44 seats can no longer be sold in the EU." },
  { c: "vehicle", q: "Can you place a rear-facing child seat in a seat with an active frontal airbag?", a: "No — never. It can cause serious injury or death if the airbag deploys." },
  { c: "vehicle", q: "What's the fine/penalty range for using a hand-held mobile phone while driving?", a: "A fixed charge and up to 5 penalty points." },
  { c: "vehicle", q: "What's the penalty for texting/emailing while driving?", a: "Compulsory court appearance, a judge-set fine, and possibly up to 3 months in prison for repeat offences — no fixed-charge option." },

  // ---------------- GOOD DRIVING PRACTICE ----------------
  { c: "practice", q: "How much space should you give a cyclist when overtaking, in a zone up to 50km/h?", a: "At least 1 metre." },
  { c: "practice", q: "How much space should you give a cyclist when overtaking, above 50km/h?", a: "At least 1.5 metres." },
  { c: "practice", q: "How long must a 'LONG VEHICLE' sign be displayed — what's the minimum vehicle length?", a: "13 metres or more." },
  { c: "practice", q: "Can you overtake on the left?", a: "Yes — e.g. if the vehicle ahead is turning right and you're going straight, if you've signalled left, or in slow stop-start traffic where your lane is faster." },
  { c: "practice", q: "Name three places you must never overtake.", a: "Any of: near a pedestrian crossing; approaching a junction, bend, dip, hilltop or narrow road; in the left lane of a motorway/dual carriageway at normal speed." },
  { c: "practice", q: "What's the maximum gap allowed between a towing vehicle and trailer without a warning device?", a: "1.5 metres — beyond that (up to 4.5m max) you need a warning device such as a white flag at least 30cm square." },
  { c: "practice", q: "At night, roughly how far do dipped headlights let you see?", a: "About 30 metres (full headlights: about 100 metres)." },
  { c: "practice", q: "When must you not use your horn in a built-up area?", a: "Between 11:30pm and 7am, unless there's a traffic emergency." },

  // ---------------- SIGNS & ROAD MARKINGS ----------------
  { c: "signs", q: "What shape and colour is a Stop sign, uniquely in the whole sign system?", a: "A red octagon with a white border — the only sign of that shape." },
  { c: "signs", q: "What does an advanced stop line for cyclists mean for drivers?", a: "Drivers must stop at the first white line they reach and not enter the shaded box reserved for cyclists." },
  { c: "signs", q: "What does a single broken yellow line at the roadside mark?", a: "A hard shoulder — mainly for pedestrians/cyclists; you may briefly pull in to let a vehicle overtake." },
  { c: "signs", q: "What colour and shape are warning signs, and what do they mean?", a: "Yellow diamonds/rectangles with a black border and black symbol — they warn of a hazard ahead." },
  { c: "signs", q: "What colour are roadworks warning signs, as opposed to ordinary warning signs?", a: "Orange (with black border/symbols), instead of yellow." },
  { c: "signs", q: "What do the three information-sign background colours mean?", a: "Blue = motorways, green = national roads, white = local/regional roads." },
  { c: "signs", q: "At roadworks, what must you do at a Stop/Go (Teigh) sign?", a: "Stop completely on Stop; only proceed when Go/Teigh is shown." },
  { c: "signs", q: "What does hatched (diagonal-striped) road marking mean?", a: "An area you must never drive into — used for merging, diverging or separating traffic." },

  // ---------------- LIGHTS & SIGNALS ----------------
  { c: "lights", q: "Does a green traffic light give you right of way?", a: "No — it means you may proceed with caution only if the way is clear." },
  { c: "lights", q: "When can you go through an amber light?", a: "Only if you're already so close to the stop line that stopping safely isn't possible." },
  { c: "lights", q: "What does a flashing amber arrow at a junction mean?", a: "You may proceed, but only after giving way to traffic already crossing from the other road." },
  { c: "lights", q: "What should you do if traffic lights at a junction are out of order?", a: "Treat it as a give-way junction: stop at the control line and proceed only when safe, yielding to others with right of way." },
  { c: "lights", q: "Does signalling ever give you right of way?", a: "No — a signal only shows your intention, never a right of way." },
  { c: "lights", q: "What does a red light showing a cyclist figure at a cycle-track signal mean?", a: "Cyclists, e-scooter and L1e-A e-moped riders must stop." },

  // ---------------- SPEED LIMITS ----------------
  { c: "speed", q: "Default speed limit on a motorway?", a: "120km/h." },
  { c: "speed", q: "Default speed limit on national roads (primary and secondary)?", a: "100km/h." },
  { c: "speed", q: "Default speed limit on regional roads?", a: "80km/h." },
  { c: "speed", q: "Default speed limit on local roads?", a: "60km/h." },
  { c: "speed", q: "Default speed limit in built-up areas (cities, towns, boroughs)?", a: "50km/h." },
  { c: "speed", q: "Special speed limit used in densely populated/built-up zones?", a: "30km/h." },
  { c: "speed", q: "What is the 'two-second rule'?", a: "Keep at least a two-second gap behind the vehicle in front — double it in the wet, 4–5x in snow/fog/ice." },
  { c: "speed", q: "Vehicle speed limit for a goods vehicle over 3,500kg MAM, on a motorway?", a: "90km/h." },
  { c: "speed", q: "Vehicle speed limit for any vehicle towing a trailer, caravan or horsebox?", a: "80km/h on all roads." },
  { c: "speed", q: "Roughly what share of pedestrians die if hit by a car at 60km/h, vs 30km/h?", a: "About 9 in 10 at 60km/h, but only about 1 in 10 at 30km/h." },

  // ---------------- JUNCTIONS & ROUNDABOUTS ----------------
  { c: "junctions", q: "At a junction of roads of equal importance, who has right of way?", a: "Traffic coming from your right." },
  { c: "junctions", q: "Must you always yield to pedestrians already crossing at a junction?", a: "Yes, always." },
  { c: "junctions", q: "When may you enter a yellow box junction?", a: "Only if you can clear it without stopping — except when turning right, where you may wait in it for a gap in oncoming traffic." },
  { c: "junctions", q: "The roundabout 'golden rule': which lane for an exit between 6 and 12 o'clock?", a: "Approach in the left-hand lane." },
  { c: "junctions", q: "The roundabout 'golden rule': which lane for an exit between 12 and 6 o'clock?", a: "Approach in the right-hand lane." },
  { c: "junctions", q: "At a crossroads, if you and an oncoming driver are both turning right, what's the safest approach?", a: "Turn 'back to back' (behind each other) if possible, or 'near-side to near-side' if not." },
  { c: "junctions", q: "On a dual carriageway, which lane should you normally drive in?", a: "The left-hand lane — use the outer lane only for overtaking or an imminent right turn." },
  { c: "junctions", q: "At a T-junction, who has right of way?", a: "Traffic already on the through-road; traffic joining from the road that ends there must wait." },

  // ---------------- PARKING ----------------
  { c: "parking", q: "What do double yellow lines mean?", a: "No parking at any time." },
  { c: "parking", q: "How close before a pedestrian crossing must you not park?", a: "15 metres before (and 5 metres after) the crossing." },
  { c: "parking", q: "How long can you park in a loading bay?", a: "Up to 30 minutes, only while loading/unloading goods." },
  { c: "parking", q: "What is a 'clearway'?", a: "A stretch of road that must stay clear of stopped/parked vehicles during posted busy periods." },
  { c: "parking", q: "Fine/penalty for dangerous parking?", a: "A fixed charge of €80 and up to 5 penalty points." },
  { c: "parking", q: "How close to a junction must you not park (unless a bay is marked)?", a: "Within 5 metres." },
  { c: "parking", q: "Can you park in a disabled persons' bay just to drop someone off quickly?", a: "No — only a valid permit holder, and generally for the permit holder's own use." },
  { c: "parking", q: "Under disc parking, how soon can you re-park in the same street after leaving a space?", a: "Not within 1 hour of leaving." },

  // ---------------- MOTORWAYS & TUNNELS ----------------
  { c: "motorway", q: "Name three types of road user banned from motorways.", a: "Any of: cyclists, pedestrians, animals, learner permit holders, vehicles under 50km/h or 50cc or less, invalid carriages." },
  { c: "motorway", q: "Approximate total stopping distance at 120km/h in the dry?", a: "About 102 metres — roughly 27 car lengths." },
  { c: "motorway", q: "Which lane on a motorway is banned to HGVs, trailers and standing-passenger buses?", a: "The outermost lane (Lane 2 or 3, whichever is furthest from the hard shoulder)." },
  { c: "motorway", q: "When may you stop or park on a motorway?", a: "Only if you break down, a Garda signals you to, there's an emergency, roadworks, or you're at a toll plaza." },
  { c: "motorway", q: "What should you never place on a motorway hard shoulder in a breakdown?", a: "A warning triangle — it's too dangerous." },
  { c: "motorway", q: "Recommended minimum distance behind the vehicle ahead in a road tunnel?", a: "50 metres for cars/motorcycles, 100 metres for other vehicles." },
  { c: "motorway", q: "What does a flashing red light at a level crossing or tunnel mean?", a: "The same as a steady red traffic light — stop." },
  { c: "motorway", q: "What should you do if a fire breaks out ahead of you inside a tunnel?", a: "Switch off the engine, leave the vehicle immediately, and exit via the nearest emergency exit." },
  { c: "motorway", q: "What are LRI and LRM signs used for on a motorway hard shoulder?", a: "To help you give your exact location (road, direction, distance) in a breakdown or emergency." },
  { c: "motorway", q: "How do you know your exit is coming up 300m, 200m, 100m ahead?", a: "Countdown markers on the approach to the exit." },

  // ---------------- ASSISTING GARDAI ----------------
  { c: "garda", q: "Do Garda hand signals override traffic lights?", a: "Yes — a Garda's signal always overrides the lights." },
  { c: "garda", q: "Within how many days must you produce your insurance certificate if asked?", a: "10 days." },
  { c: "garda", q: "Is refusing a roadside breath/saliva sample a criminal offence?", a: "Yes." },
  { c: "garda", q: "When an emergency vehicle approaches with lights/siren, what should you never do?", a: "Never tailgate or overtake it, run a red light, brake suddenly, or block the road." },
  { c: "garda", q: "Should you ever mount the kerb to let an emergency vehicle pass?", a: "Only if absolutely necessary, and only if you're certain no pedestrians are there." },

  // ---------------- ALCOHOL, DRUGS & FATIGUE ----------------
  { c: "impair", q: "What BAC range triggers an on-the-spot €200 fine and 3-month ban for a qualified driver?", a: "50–80mg per 100ml of blood." },
  { c: "impair", q: "What BAC range triggers an on-the-spot €400 fine and 6-month ban?", a: "80–100mg per 100ml of blood." },
  { c: "impair", q: "What's the automatic ban for refusing an evidential breath/blood/urine sample, first offence?", a: "4 years (6 years for a second or subsequent offence)." },
  { c: "impair", q: "Name the five roadside 'impairment tests' Gardai may use for suspected drug driving.", a: "Pupil dilation, balance, walk-and-turn, one-leg stand, and finger-to-nose." },
  { c: "impair", q: "How long can a 'micro-sleep' last, and how far can a car travel in just 4 seconds of one?", a: "Up to 10 seconds; roughly 100 metres in 4 seconds — more than a football pitch." },
  { c: "impair", q: "What's the recommended maximum length for an emergency 'tiredness nap' while driving?", a: "20 minutes (have a strong coffee first — it takes about 20 minutes to kick in)." },
  { c: "impair", q: "What should you do if another driver tries to provoke you (road rage)?", a: "Stay calm, don't react, don't speed up/brake/swerve — focus on driving safely and report it." },
  { c: "impair", q: "Maximum fine/prison term for drug driving on summary conviction?", a: "Up to €5,000 and/or up to 6 months in prison." },

  // ---------------- INCIDENT SCENE ----------------
  { c: "incident", q: "If you're involved in a crash, what must you do at the scene?", a: "Stop, stay a reasonable time, and help anyone injured or in need of assistance." },
  { c: "incident", q: "Penalty for leaving the scene knowing someone is injured or killed, to escape liability?", a: "Up to €20,000 fine or up to 10 years in prison." },
  { c: "incident", q: "Should you remove an injured motorcyclist's helmet?", a: "No — inexperienced removal risks paralysis from neck injuries." },
  { c: "incident", q: "Should you give an injured person food or drink at the scene?", a: "No." },
  { c: "incident", q: "When must Gardai carry out mandatory alcohol testing after a crash?", a: "At the scene of any crash involving injury, or of an injured driver taken to hospital." },

  // ---------------- PENALTY POINTS & BANS ----------------
  { c: "points", q: "How many points in 36 months bans a fully licensed driver?", a: "12 or more points → 6-month ban." },
  { c: "points", q: "How many points in 36 months bans a learner or novice driver?", a: "7 or more points → 6-month ban." },
  { c: "points", q: "How many days do you have to pay a fixed-charge notice before it increases by 50%?", a: "28 days." },
  { c: "points", q: "When do points get added to your licence after a fixed-charge notice?", a: "28 days after you're notified (triggered by payment or conviction)." },
  { c: "points", q: "How many days do you have to surrender your licence once a ban starts?", a: "14 days — post it to the NDLS." },
  { c: "points", q: "Does time spent banned count toward your 36-month points window?", a: "No — the window is extended to cover the time lost." },

  // ---------------- MOTORCYCLISTS ----------------
  { c: "moto", q: "What's the fine for riding, or letting a passenger ride, without a helmet?", a: "A fixed charge of €80." },
  { c: "moto", q: "How many pillion passengers may a motorcycle carry?", a: "No more than one, on a proper seat, facing forward, feet reaching the footrests." },
  { c: "moto", q: "What acronym helps riders remember pre-ride checks?", a: "POWDERS — Petrol, Oil, Water, Damage, Electrics, Rubber (tyres), Security." },
  { c: "moto", q: "Minimum legal tyre tread depth for a motorcycle?", a: "1mm — but replace well before that." },
  { c: "moto", q: "Should motorcyclists ride between traffic lanes (filtering)?", a: "No — avoid it." },
  { c: "moto", q: "What proportion of road deaths in Ireland involve motorcyclists, despite being under 1 in 50 licensed vehicles?", a: "About 1 in 8 road deaths." },

  // ---------------- CYCLISTS & E-SCOOTERS ----------------
  { c: "cycle", q: "Minimum age to ride an e-scooter in a public place?", a: "16 years old." },
  { c: "cycle", q: "Maximum legal speed for an e-scooter?", a: "20km/h (or a lower posted limit)." },
  { c: "cycle", q: "Do you need a licence or insurance for a legal e-scooter?", a: "No — none required." },
  { c: "cycle", q: "At what speed does an e-bike's motor assistance have to cut out?", a: "25km/h — and it must only assist pedalling, not propel on its own." },
  { c: "cycle", q: "What's the maximum power/speed for an L1e-A e-moped?", a: "Up to 1,000W, maximum 25km/h." },
  { c: "cycle", q: "What's the maximum power/speed for an L1e-B e-moped?", a: "Up to 4,000W, maximum 45km/h — treated like a motorbike, always needs an AM licence." },
  { c: "cycle", q: "A continuous white line on a cycle track means what?", a: "It's a mandatory cycle track — no other vehicle may cross it or park there (except entering/leaving a driveway)." },
  { c: "cycle", q: "What braking system must an adult bicycle have?", a: "Two brakes — one on the front wheel, one on the back." },
  { c: "cycle", q: "Is a cycle helmet legally required in Ireland?", a: "No, but it's strongly recommended for safety." },
  { c: "cycle", q: "Fixed charge for cycling through a red light?", a: "€40." },

  // ---------------- PEDESTRIANS ----------------
  { c: "pedestrian", q: "If there's no footpath, which side of the road should a pedestrian walk on?", a: "The right-hand side, facing oncoming traffic." },
  { c: "pedestrian", q: "At a zebra crossing, when do you get right of way as a pedestrian?", a: "Only once you actually step onto the crossing — not before." },
  { c: "pedestrian", q: "What does a flashing amber light at a pelican crossing mean for pedestrians?", a: "It gives priority to any pedestrian still on the crossing." },
  { c: "pedestrian", q: "What's different about a toucan crossing compared to a zebra crossing?", a: "It's shared by pedestrians and cyclists together and relies solely on traffic lights, not stripes." },
  { c: "pedestrian", q: "Where should you never cross the road, relating to buses?", a: "In front of a stopped bus — you can't be seen by traffic behind it." },
  { c: "pedestrian", q: "Roughly what share of Irish road deaths are pedestrians?", a: "About 1 in 5." },

  // ---------------- OTHER ROAD USERS ----------------
  { c: "otherusers", q: "What must an adult school warden's raised Stop sign make you do?", a: "Stop and remain stopped until the children have crossed, the sign is lowered, and the warden is back on the footpath." },
  { c: "otherusers", q: "When leading a horse on the road, where should you walk?", a: "Between the horse and the traffic." },
  { c: "otherusers", q: "Should you use your horn or headlights near a horse?", a: "No — it could startle the horse and cause the rider to lose control." },
  { c: "otherusers", q: "What must a horse-drawn vehicle carry at night?", a: "Two red rear reflectors, and on the right-hand side, a lamp showing white to the front and red to the back." },
  { c: "otherusers", q: "What safety equipment must all tractors used in public places have?", a: "An approved safety frame, to protect the driver in a rollover." },

  // ---------------- SIGN RECOGNITION ----------------
  { c: "recognise", q: "What does a red octagon always mean?", a: "Stop." },
  { c: "recognise", q: "What does a red-bordered triangle pointing downward mean?", a: "Yield — give way." },
  { c: "recognise", q: "White background, red border, circular shape — what family of sign is this?", a: "A regulatory sign (a legal requirement you must obey)." },
  { c: "recognise", q: "Blue background, white symbol, circular shape — what does this sign family mean?", a: "A mandatory instruction (e.g. the direction you must take)." },
  { c: "recognise", q: "Yellow diamond, black border, black symbol — what family of sign is this?", a: "A warning sign — a hazard ahead." },
  { c: "recognise", q: "Orange diamond/rectangle, black border — what family of sign is this?", a: "A roadworks warning sign." },
  { c: "recognise", q: "Blue rectangle sign — what road type does this mean?", a: "A motorway." },
  { c: "recognise", q: "Green rectangle sign — what road type does this mean?", a: "A national road." },
  { c: "recognise", q: "White rectangle sign with black text — what road type does this mean?", a: "A local or regional road." },
  { c: "recognise", q: "What does a red circle with a white horizontal bar mean?", a: "No entry." },
  { c: "recognise", q: "What does a white triangular symbol painted on the road, near a broken line, indicate?", a: "A Yield line — give way to traffic on the major road ahead." },
  { c: "recognise", q: "What does criss-crossed yellow lines on the road (a 'yellow box') mean?", a: "Don't enter unless you can clear it without stopping (except waiting to turn right)." },
  { c: "recognise", q: "What does a red flashing light at a level crossing mean?", a: "Stop — same as a steady red traffic light. Never zigzag around the barriers." },
  { c: "recognise", q: "What colour tabard must a learner motorcyclist wear their L-plate on?", a: "Yellow fluorescent." },
  { c: "recognise", q: "What does a white arrow in a white-edged box at a signalled junction mean?", a: "A turning box — position here for a right turn, and don't enter on a red light." },
];

// Assign sequential numbers, grouped by category order defined in CATEGORIES.
const CARDS = (() => {
  const byCat = {};
  RAW_CARDS.forEach(card => {
    byCat[card.c] = byCat[card.c] || [];
    byCat[card.c].push(card);
  });
  let n = 0;
  const out = [];
  CATEGORIES.forEach(cat => {
    (byCat[cat.id] || []).forEach((card, i) => {
      n += 1;
      out.push({ ...card, id: n, catIndex: i + 1 });
    });
  });
  return out;
})();

function shuffleArr(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function FlashcardDeck({ onBack, cards, categories, catLookup, deckTitle, deckSubtitle, backLabel }) {
  const [activeCat, setActiveCat] = useState("all");
  const [order, setOrder] = useState(() => cards.map(c => c.id));
  const [pos, setPos] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(() => new Set());
  const [review, setReview] = useState(() => new Set());

  const deck = useMemo(() => {
    const filtered = activeCat === "all"
      ? cards
      : cards.filter(c => c.c === activeCat);
    // preserve current shuffle/order among the filtered set
    const orderIndex = new Map(order.map((id, i) => [id, i]));
    return [...filtered].sort((a, b) => (orderIndex.get(a.id) ?? 0) - (orderIndex.get(b.id) ?? 0));
  }, [activeCat, order, cards]);

  useEffect(() => { setPos(0); setFlipped(false); }, [activeCat]);

  const card = deck[pos];
  const total = deck.length;

  const goto = useCallback((delta) => {
    setFlipped(false);
    setPos(p => {
      const next = p + delta;
      if (next < 0) return total - 1;
      if (next >= total) return 0;
      return next;
    });
  }, [total]);

  // Fly-away/fly-in animation: "out" slides+fades the current card off screen,
  // then the index changes, then "in" slides+fades the next card back to centre
  // from the opposite side.
  const ANIM_MS = 260;
  const [animPhase, setAnimPhase] = useState("idle"); // idle | out | in
  const [animDir, setAnimDir] = useState(1); // 1 = advancing (card exits left), -1 = going back (card exits right)
  const animTimer = useRef(null);
  const animFrame = useRef(null);

  const triggerChange = useCallback((delta) => {
    if (animPhase !== "idle") return; // ignore taps/swipes mid-animation
    setAnimDir(delta);
    setAnimPhase("out");
  }, [animPhase]);

  useEffect(() => {
    if (animPhase === "out") {
      animTimer.current = setTimeout(() => {
        goto(animDir);
        setAnimPhase("in");
      }, ANIM_MS);
    } else if (animPhase === "in") {
      // Land the new card off-screen on the opposite side with no transition,
      // then release it back to centre on the next paint for a slide-in effect.
      animFrame.current = requestAnimationFrame(() => {
        animFrame.current = requestAnimationFrame(() => setAnimPhase("idle"));
      });
    }
    return () => {
      clearTimeout(animTimer.current);
      cancelAnimationFrame(animFrame.current);
    };
  }, [animPhase, animDir, goto]);

  const slideStyle = useMemo(() => {
    if (animPhase === "out") {
      return {
        transform: `translateX(${animDir === 1 ? "-130%" : "130%"}) rotate(${animDir === 1 ? "-8deg" : "8deg"})`,
        opacity: 0,
        transition: `transform ${ANIM_MS}ms ease-in, opacity ${ANIM_MS}ms ease-in`,
      };
    }
    if (animPhase === "in") {
      return {
        transform: `translateX(${animDir === 1 ? "130%" : "-130%"}) rotate(${animDir === 1 ? "8deg" : "-8deg"})`,
        opacity: 0,
        transition: "none",
      };
    }
    return {
      transform: "translateX(0) rotate(0deg)",
      opacity: 1,
      transition: `transform ${ANIM_MS}ms ease-out, opacity ${ANIM_MS}ms ease-out`,
    };
  }, [animPhase, animDir]);

  // Swipe gestures: swipe left -> next card, swipe right -> previous card.
  const touchStart = useRef(null);
  const wasSwipe = useRef(false);
  const SWIPE_THRESHOLD = 45;

  const handleTouchStart = (e) => {
    if (animPhase !== "idle") return;
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
    wasSwipe.current = false;
  };
  const handleTouchEnd = (e) => {
    if (!touchStart.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    touchStart.current = null;
    if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
      wasSwipe.current = true;
      if (dx < 0) triggerChange(1);   // swipe left -> next
      else triggerChange(-1);         // swipe right -> previous
    }
  };
  const handleCardClick = () => {
    if (animPhase !== "idle") return;
    if (wasSwipe.current) { wasSwipe.current = false; return; }
    setFlipped(f => !f);
  };

  const doShuffle = () => {
    setOrder(shuffleArr(cards.map(c => c.id)));
    setPos(0);
    setFlipped(false);
  };

  const resetOrder = () => {
    setOrder(cards.map(c => c.id));
    setPos(0);
    setFlipped(false);
  };

  const markKnown = () => {
    if (!card) return;
    setKnown(prev => new Set(prev).add(card.id));
    setReview(prev => { const s = new Set(prev); s.delete(card.id); return s; });
    triggerChange(1);
  };
  const markReview = () => {
    if (!card) return;
    setReview(prev => new Set(prev).add(card.id));
    setKnown(prev => { const s = new Set(prev); s.delete(card.id); return s; });
    triggerChange(1);
  };

  const cat = card ? catLookup[card.c] : null;
  const knownCount = deck.filter(c => known.has(c.id)).length;


  if (!card) {
    return (
      <div className="bg-slate-900 text-white flex items-center justify-center p-6 rounded-3xl">
        <p className="text-slate-400">No cards in this category.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 text-white flex flex-col rounded-3xl overflow-hidden ring-1 ring-slate-800">
      {/* Header */}
      <header className="border-b border-slate-700 px-4 sm:px-8 py-4 sm:py-5">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-slate-400 hover:text-emerald-400 mb-3"
          >
            <ChevronLeft size={14} /> {backLabel || "Back to Flashcards"}
          </button>
          <div className="flex items-baseline justify-between gap-4 flex-wrap">
            <h1 className="font-black uppercase tracking-tight text-2xl sm:text-3xl text-emerald-400">
              {deckTitle}
            </h1>
            <span className="text-xs sm:text-sm font-mono text-slate-400 uppercase tracking-widest">
              {deckSubtitle}
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            {cards.length} cards &middot; {categories.length} categories &middot; {knownCount}/{total} known in this set
          </p>
        </div>
      </header>

      {/* Category filter strip */}
      <div className="border-b border-slate-800 bg-slate-950/60 overflow-x-auto">
        <div className="max-w-3xl mx-auto px-4 sm:px-8 py-3 flex gap-2 flex-nowrap w-max sm:w-auto sm:flex-wrap">
          <button
            onClick={() => setActiveCat("all")}
            className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide border transition
              ${activeCat === "all" ? "bg-emerald-400 text-slate-900 border-emerald-400" : "border-slate-700 text-slate-300 hover:border-slate-500"}`}
          >
            <ListFilter size={13} /> All ({cards.length})
          </button>
          {categories.map(c => {
            const count = cards.filter(k => k.c === c.id).length;
            const active = activeCat === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setActiveCat(c.id)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide border transition
                  ${active ? `${c.swatch} ${c.dark ? "text-slate-900" : "text-white"} border-transparent` : "border-slate-700 text-slate-300 hover:border-slate-500"}`}
              >
                {c.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Stage */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-xl">

          {/* progress bar */}
          <div className="mb-5 flex items-center gap-3">
            <span className="font-mono text-xs text-slate-500 w-16 shrink-0">
              {pos + 1} / {total}
            </span>
            <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-400 transition-all duration-300"
                style={{ width: `${((pos + 1) / total) * 100}%` }}
              />
            </div>
          </div>

          {/* card */}
          <div
            role="button"
            tabIndex={0}
            onClick={handleCardClick}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") { if (animPhase === "idle") setFlipped(f => !f); }
              if (e.key === "ArrowLeft") triggerChange(-1);
              if (e.key === "ArrowRight") triggerChange(1);
            }}
            className="relative w-full h-72 sm:h-80 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-2xl touch-pan-y"
            style={{ perspective: "1400px", ...slideStyle, willChange: "transform, opacity" }}
          >
            <div
              className="relative w-full h-full transition-transform duration-500"
              style={{
                transformStyle: "preserve-3d",
                transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
              }}
            >
              {/* front */}
              <div
                className={`absolute inset-0 rounded-2xl border-4 ${cat.swatch.replace("bg-", "border-")} bg-slate-800 p-6 sm:p-8 flex flex-col`}
                style={{ backfaceVisibility: "hidden" }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`font-mono text-xs px-2 py-1 rounded ${cat.swatch} ${cat.dark ? "text-slate-900" : "text-white"} font-bold`}>
                    No. {String(card.id).padStart(3, "0")}
                  </span>
                  <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold text-right">
                    {cat.label} &middot; {card.catIndex}
                  </span>
                </div>
                <div className="flex-1 flex items-center">
                  <p className="text-lg sm:text-xl font-semibold leading-snug">{card.q}</p>
                </div>
                <p className="text-center text-xs text-slate-500 uppercase tracking-widest mt-4">
                  Tap to reveal &middot; swipe left/right to move
                </p>
              </div>

              {/* back */}
              <div
                className={`absolute inset-0 rounded-2xl border-4 ${cat.swatch.replace("bg-", "border-")} ${cat.swatch} p-6 sm:p-8 flex flex-col ${cat.dark ? "text-slate-900" : "text-white"}`}
                style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`font-mono text-xs px-2 py-1 rounded bg-black/20 font-bold`}>
                    No. {String(card.id).padStart(3, "0")}
                  </span>
                  <span className="text-xs uppercase tracking-widest opacity-80 font-semibold text-right">
                    {cat.label}
                  </span>
                </div>
                <div className="flex-1 flex items-center">
                  <p className="text-lg sm:text-xl font-bold leading-snug">{card.a}</p>
                </div>
                <p className="text-center text-xs opacity-70 uppercase tracking-widest mt-4">
                  Tap to flip back &middot; swipe left/right to move
                </p>
              </div>
            </div>
          </div>

          {/* known / review controls */}
          <div className="flex gap-3 mt-5">
            <button
              onClick={markReview}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-semibold uppercase tracking-wide"
            >
              <XIcon size={16} /> Study again
            </button>
            <button
              onClick={markKnown}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold uppercase tracking-wide"
            >
              <Check size={16} /> Know it
            </button>
          </div>

          {/* nav controls */}
          <div className="flex items-center justify-between mt-5">
            <button
              onClick={() => triggerChange(-1)}
              className="p-3 rounded-full border border-slate-700 text-slate-300 hover:bg-slate-800"
              aria-label="Previous card"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex gap-2">
              <button
                onClick={doShuffle}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-semibold uppercase tracking-wide"
              >
                <Shuffle size={14} /> Shuffle
              </button>
              <button
                onClick={resetOrder}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-semibold uppercase tracking-wide"
              >
                <Undo2 size={14} /> Order
              </button>
            </div>

            <button
              onClick={() => triggerChange(1)}
              className="p-3 rounded-full border border-slate-700 text-slate-300 hover:bg-slate-800"
              aria-label="Next card"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {review.size > 0 && (
            <p className="text-center text-xs text-slate-500 mt-4">
              {review.size} card{review.size === 1 ? "" : "s"} marked for review in this session.
            </p>
          )}
        </div>
      </main>

      <footer className="text-center text-xs text-slate-600 py-4 px-4">
        Independent study aid based on Ireland's Rules of the Road (RSA). Not an official publication — always check www.rsa.ie for current rules.
      </footer>
    </div>
  );
}

/* =========================================================================
   APP SHELL — desktop top nav, mobile top bar + slide-down menu,
   and a native-app-style bottom tab bar for mobile (this same structure
   maps directly onto a future iOS/Android wrapper).
   ========================================================================= */
function TopNav({ view, go }) {
  return (
    <header className="hidden sm:block sticky top-0 z-30 bg-slate-900 border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <button onClick={() => go("home")}><Logo /></button>
        <nav className="flex items-center gap-1">
          {PRIMARY_NAV.map(n => (
            <button
              key={n.id}
              onClick={() => go(n.id)}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition
                ${view === n.id
                  || (n.id === "flashcards-hub" && view === "flashcards-deck")
                  || (n.id === "adi" && ["adi-quiz", "adi-theory-quiz", "adi-flashcards"].includes(view))
                  ? "bg-slate-800 text-white"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"}`}
            >
              {n.label}
            </button>
          ))}
        </nav>
        <button
          onClick={() => go("booking")}
          className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold text-sm px-4 py-2 rounded-lg transition"
        >
          <CalendarCheck size={16} /> Book a Lesson
        </button>
      </div>
    </header>
  );
}

function MobileHeader({ view, go, menuOpen, setMenuOpen }) {
  return (
    <header className="sm:hidden sticky top-0 z-30 bg-slate-900 border-b border-slate-800">
      <div className="px-4 h-14 flex items-center justify-between">
        <button onClick={() => go("home")}><Logo compact /></button>
        <span className="font-black tracking-tight text-white text-sm">
          Pass<span className="text-emerald-400">DrivingTest</span><span className="text-slate-400">.ie</span>
        </span>
        <button
          onClick={() => setMenuOpen(o => !o)}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-300 hover:bg-slate-800"
          aria-label="Open menu"
        >
          {menuOpen ? <CloseIcon size={20} /> : <MenuIcon size={20} />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-slate-800 bg-slate-900 px-4 py-4">
          <nav className="flex flex-col gap-1">
            {PRIMARY_NAV.map(n => (
              <button
                key={n.id}
                onClick={() => { go(n.id); setMenuOpen(false); }}
                className={`text-left px-3 py-2.5 rounded-lg text-sm font-semibold transition
                  ${view === n.id ? "bg-slate-800 text-white" : "text-slate-300 hover:bg-slate-800/60"}`}
              >
                {n.label}
              </button>
            ))}
            <button
              onClick={() => { go("booking"); setMenuOpen(false); }}
              className="mt-2 text-left px-3 py-2.5 rounded-lg text-sm font-bold bg-emerald-500 text-slate-900"
            >
              Book a Lesson
            </button>
          </nav>
          <div className="mt-4 pt-4 border-t border-slate-800 text-slate-400 text-xs space-y-1.5">
            <div className="flex items-center gap-3">
              <a href={`tel:${SITE_CONFIG.phoneTel}`} className="flex items-center gap-2 hover:text-emerald-400"><Phone size={13} /> {SITE_CONFIG.phoneDisplay}</a>
              <WhatsAppLink size={15} />
            </div>
            <a href={`mailto:${SITE_CONFIG.email}`} className="flex items-center gap-2 hover:text-emerald-400"><Mail size={13} /> {SITE_CONFIG.email}</a>
            <p className="flex items-center gap-2"><MapPin size={13} /> {SITE_CONFIG.address}</p>
          </div>
        </div>
      )}
    </header>
  );
}

function BottomTabBar({ view, go, onMore }) {
  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-30 bg-slate-900 border-t border-slate-800 pb-safe">
      <div className="grid grid-cols-4">
        {TAB_BAR.map(t => {
          const active = isTabActive(t.id, view);
          const handleClick = () => (t.id === "more" ? onMore() : go(t.id === "learning" ? "learning" : t.id));
          return (
            <button
              key={t.id}
              onClick={handleClick}
              className="flex flex-col items-center justify-center gap-1 py-2.5"
            >
              <t.icon size={20} className={active ? "text-emerald-400" : "text-slate-400"} strokeWidth={active ? 2.5 : 2} />
              <span className={`text-xs font-semibold ${active ? "text-emerald-400" : "text-slate-400"}`}>{t.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function SiteFooter() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 pb-20 sm:pb-8">
      <div className="max-w-6xl mx-auto px-6 py-10 grid sm:grid-cols-3 gap-8">
        <div>
          <Logo />
          <p className="text-sm mt-3 max-w-xs">
            Study material and test booking for learner drivers, theory test candidates
            and ADI trainees in Ireland.
          </p>
        </div>
        <div className="text-sm space-y-2">
          <p className="font-bold text-white mb-2">Contact</p>
          <div className="flex items-center gap-3">
            <a href={`tel:${SITE_CONFIG.phoneTel}`} className="flex items-center gap-2 hover:text-emerald-400"><Phone size={14} /> {SITE_CONFIG.phoneDisplay}</a>
            <WhatsAppLink size={16} />
          </div>
          <a href={`mailto:${SITE_CONFIG.email}`} className="flex items-center gap-2 hover:text-emerald-400"><Mail size={14} /> {SITE_CONFIG.email}</a>
          <p className="flex items-center gap-2"><MapPin size={14} /> {SITE_CONFIG.address}</p>
        </div>
        <div className="text-sm space-y-2">
          <p className="font-bold text-white mb-2">Learning Materials</p>
          <p>Rules of the Road</p>
          <p>Theory &amp; Driving Test</p>
          <p>Approved Driving Instructor</p>
          <p>RSA Flashcards</p>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 pb-8 text-xs text-slate-500 border-t border-slate-800 pt-6">
        PassDrivingTest.ie is an independent driving-school resource. Rules of the Road content is
        rewritten from the Road Safety Authority (RSA) of Ireland's official material and is not an
        official RSA publication — always check www.rsa.ie for the current rules.
      </div>
    </footer>
  );
}

/* =========================================================================
   WHATSAPP ICON — small inline icon used right beside the phone number.
   ========================================================================= */
function WhatsAppIcon({ size = 16 }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M16.02 3C9.4 3 4 8.36 4 14.94c0 2.2.6 4.26 1.66 6.04L4 29l8.24-2.6a12.9 12.9 0 0 0 3.78.57h.01c6.62 0 12.02-5.36 12.02-11.94C28.05 8.36 22.65 3 16.02 3zm0 21.7h-.01a10.6 10.6 0 0 1-5.4-1.48l-.39-.23-4.02 1.27 1.3-3.9-.25-.4a9.86 9.86 0 0 1-1.53-5.3c0-5.46 4.48-9.9 10-9.9 2.67 0 5.18 1.04 7.07 2.92a9.8 9.8 0 0 1 2.92 7c0 5.46-4.48 9.92-9.99 9.92zm5.48-7.43c-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.24-.46-2.37-1.46-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.5-.17 0-.37-.02-.57-.02s-.52.07-.8.37c-.27.3-1.04 1.02-1.04 2.47 0 1.46 1.07 2.87 1.22 3.07.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35z"/>
    </svg>
  );
}

function WhatsAppLink({ size = 16, className = "" }) {
  return (
    <a
      href={`https://wa.me/${SITE_CONFIG.whatsappNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className={`text-green-500 hover:text-green-400 transition ${className}`}
    >
      <WhatsAppIcon size={size} />
    </a>
  );
}

/* =========================================================================
   ROOT APP
   ========================================================================= */
export default function App() {
  const [view, setView] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAdminRoute, setIsAdminRoute] = useState(() => window.location.hash === "#admin");

  useEffect(() => {
    const onHashChange = () => setIsAdminRoute(window.location.hash === "#admin");
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const go = useCallback((id) => {
    setView(id);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  let content;
  if (view === "home") content = <HomePage go={go} />;
  else if (view === "learning") content = <LearningMaterialsHub go={go} />;
  else if (view === "rules") content = <RulesOfRoadPage go={go} />;
  else if (view === "theory") content = <TheoryTestPage go={go} />;
  else if (view === "adi") content = <ADITestPage go={go} />;
  else if (view === "adi-quiz") {
    content = (
      <AdiQuizApp
        onBack={() => go("adi")}
        categories={ADI_CATEGORIES}
        storageKey="adi-mock-test"
        badge="RSA &middot; Approved Driving Instructor"
        title="ADI Stage 1 Mock Test"
        description="Practice questions across all 5 official sections of the ADI Stage 1 theory test, grounded in RSA source material — the Driving Instructor's Handbook, official sample questions, and the Driver Tester Marking Guidelines."
        note="On the real exam you must pass each of the 5 sections individually — failing one section fails the whole test. Category-specific content shown here covers Car & Work Vehicles (B/W)."
      />
    );
  }
  else if (view === "adi-theory-quiz") {
    content = (
      <AdiQuizApp
        onBack={() => go("adi")}
        categories={ADI_THEORY_PRACTICE_CATEGORIES}
        storageKey="adi-theory-practice"
        badge="Theory Practice"
        title="ADI Stage 1 Theory Practice"
        description="126 additional practice questions sourced from real mock test papers and the RSA's own official ADI Stage 1 sample questions — bookmark anything tricky, and see your overall score across every section you attempt."
        note="This is a separate practice set from the Mock Test above, drawn from different source material — use both for the widest coverage."
      />
    );
  }
  else if (view === "adi-flashcards") {
    content = (
      <div className="max-w-3xl mx-auto px-3 sm:px-8 py-6 sm:py-10">
        <FlashcardDeck
          onBack={() => go("adi")}
          cards={ADI_FLASHCARDS}
          categories={ADI_FLASHCARD_CATEGORIES}
          catLookup={ADI_FLASHCARD_CAT}
          deckTitle="ADI Flashcards"
          deckSubtitle="Approved Driving Instructor"
          backLabel="Back to Approved Driving Instructor"
        />
      </div>
    );
  }
  else if (view === "flashcards-hub") content = <FlashcardsHub go={go} />;
  else if (view === "flashcards-deck") {
    content = (
      <div className="max-w-3xl mx-auto px-3 sm:px-8 py-6 sm:py-10">
        <FlashcardDeck
          onBack={() => go("flashcards-hub")}
          cards={CARDS}
          categories={CATEGORIES}
          catLookup={CAT}
          deckTitle="Rules of the Road"
          deckSubtitle="RSA Flashcards"
          backLabel="Back to Flashcards"
        />
      </div>
    );
  } else if (view === "booking") content = <BookingPage />;
  else content = <HomePage go={go} />;

  const isFlashcardDeck = view === "flashcards-deck";

  if (isAdminRoute) {
    return <AdminPage />;
  }

  return (
    <div className={`min-h-screen flex flex-col ${isFlashcardDeck ? "bg-slate-950" : "bg-white"}`}>
      <TopNav view={view} go={go} />
      <MobileHeader go={go} view={view} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <main className="flex-1">{content}</main>

      {!isFlashcardDeck && <SiteFooter />}
      <BottomTabBar view={view} go={go} onMore={() => setMenuOpen(o => !o)} />
    </div>
  );
}
