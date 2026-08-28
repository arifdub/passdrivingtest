/*
  ===========================================================================
  QUIZ PLAYER

  Handles both module kinds that produce a score:

    mcq   — practice. Pick a section, answer at your own pace, see the right
            answer and explanation immediately after each question.
    mock  — exam simulation. Questions drawn across every section, timed,
            no feedback until the end.

  Both finish on the same result screen, which reports Passed / Almost there /
  Keep practising against the module's own pass mark.
  ===========================================================================
*/

import React, { useState, useEffect, useRef } from "react";
import {
  ChevronLeft, Check, X, Clock, RotateCcw, Star, Flag,
} from "lucide-react";
import { ScreenHeader, Screen, ProgressBar, ProgressRing, PrimaryButton, SecondaryButton, Tile } from "./ui";
import { useProgress } from "./progressStore";
import { verdictFor } from "./appStructure";

/* Fisher–Yates. Returns a new array — never mutates the question bank. */
function shuffle(arr) {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function formatClock(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/* ===========================================================================
   ENTRY — decides which stage to show
   =========================================================================== */
export default function QuizPlayer({ module, quiz, onExit }) {
  const isMock = module.kind === "mock";
  const [stage, setStage] = useState(isMock ? "intro" : "sections");
  const [activeSet, setActiveSet] = useState(null); // { title, questions }
  const [result, setResult] = useState(null);
  const [runKey, setRunKey] = useState(0);

  const { recordResult, getModule } = useProgress();
  const moduleProgress = getModule(module.id);

  /* Build a mock test: questions pulled evenly from every section, shuffled. */
  const buildMock = () => {
    const perSection = Math.max(
      1,
      Math.round((module.questionCount || 40) / quiz.categories.length)
    );
    const picked = quiz.categories.flatMap(cat =>
      shuffle(cat.questions)
        .slice(0, perSection)
        .map(q => ({ ...q, sectionTitle: cat.title }))
    );
    return {
      title: module.label,
      questions: shuffle(picked).slice(0, module.questionCount || 40),
      timed: true,
    };
  };

  const startMock = () => {
    setActiveSet(buildMock());
    setRunKey(k => k + 1);
    setStage("running");
  };

  const startSection = (cat) => {
    setActiveSet({
      title: cat.title,
      questions: shuffle(cat.questions).map(q => ({ ...q, sectionTitle: cat.title })),
      timed: false,
    });
    setRunKey(k => k + 1);
    setStage("running");
  };

  const finish = async ({ score, total, log, elapsed }) => {
    const saved = await recordResult(module.id, score, total);
    setResult({ score, total, log, elapsed, ...saved });
    setStage("result");
  };

  /* ---- section picker (practice mode) ---- */
  if (stage === "sections") {
    return (
      <>
        <ScreenHeader
          title={module.label}
          subtitle={quiz.subtitle}
          onBack={onExit}
          backLabel={module.sectionLabel}
        />
        <Screen>
          {moduleProgress.attempts > 0 && (
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 mb-4">
              <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                <span>Your best</span>
                <span>{moduleProgress.attempts} attempt{moduleProgress.attempts === 1 ? "" : "s"}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  {moduleProgress.bestPct}%
                </span>
                <div className="flex-1">
                  <ProgressBar pct={moduleProgress.bestPct} />
                </div>
              </div>
              <p className={`mt-2 text-sm font-semibold ${
                moduleProgress.passed ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"
              }`}>
                {moduleProgress.passed
                  ? "Passed — you're at test standard here."
                  : `Keep practising — ${moduleProgress.passMark}% is the pass mark.`}
              </p>
            </div>
          )}

          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2.5">
            Choose a section
          </p>
          <div className="space-y-2.5">
            {quiz.categories.map(cat => (
              <Tile
                key={cat.id}
                label={cat.title}
                blurb={`${cat.questions.length} questions${cat.blurb ? ` · ${cat.blurb}` : ""}`}
                onClick={() => startSection(cat)}
              />
            ))}
          </div>
        </Screen>
      </>
    );
  }

  /* ---- mock test intro ---- */
  if (stage === "intro") {
    const count = module.questionCount || 40;
    const minutes = Math.round(count * 0.75);
    return (
      <>
        <ScreenHeader
          title={module.label}
          subtitle="Real test conditions"
          onBack={onExit}
          backLabel={module.sectionLabel}
        />
        <Screen>
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
            <h2 className="font-bold text-slate-900 dark:text-white">Before you start</h2>
            <ul className="mt-3 space-y-2.5 text-sm text-slate-600 dark:text-slate-300">
              <li className="flex gap-2.5"><Check size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                {count} questions, drawn across every section.</li>
              <li className="flex gap-2.5"><Clock size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                {minutes} minutes. The clock runs while you answer.</li>
              <li className="flex gap-2.5"><Flag size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                No answers shown until the end, same as the real thing.</li>
              <li className="flex gap-2.5"><Star size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                Pass mark {module.passMark}%.</li>
            </ul>
            {moduleProgress.attempts > 0 && (
              <p className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 text-sm text-slate-500 dark:text-slate-400">
                Your best so far: <span className="font-bold text-slate-900 dark:text-white">{moduleProgress.bestPct}%</span>
                {" "}over {moduleProgress.attempts} attempt{moduleProgress.attempts === 1 ? "" : "s"}.
              </p>
            )}
          </div>
          <div className="mt-4">
            <PrimaryButton onClick={startMock}>Start mock test</PrimaryButton>
          </div>
        </Screen>
      </>
    );
  }

  /* ---- running ---- */
  if (stage === "running" && activeSet) {
    return (
      <QuizRun
        key={runKey}
        set={activeSet}
        module={module}
        instantFeedback={!isMock}
        onFinish={finish}
        onQuit={() => setStage(isMock ? "intro" : "sections")}
      />
    );
  }

  /* ---- result ---- */
  if (stage === "result" && result) {
    return (
      <QuizResult
        module={module}
        result={result}
        onRetry={() => (isMock ? startMock() : setStage("sections"))}
        onExit={onExit}
      />
    );
  }

  return null;
}

/* ===========================================================================
   RUNNING A QUIZ
   =========================================================================== */
function QuizRun({ set, module, instantFeedback, onFinish, onQuit }) {
  const questions = set.questions;
  const total = questions.length;

  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [log, setLog] = useState([]);
  const [elapsed, setElapsed] = useState(0);

  const startedAt = useRef(Date.now());
  const finished = useRef(false);

  const limitSeconds = set.timed ? Math.round(total * 45) : null;

  /* One interval for the whole run. Cleared on unmount so a quit mid-test
     doesn't leave a timer ticking against a dead component. */
  useEffect(() => {
    const t = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAt.current) / 1000));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  /* Time's up — submit whatever's been answered so far. */
  useEffect(() => {
    if (!limitSeconds || finished.current) return;
    if (elapsed >= limitSeconds) {
      finished.current = true;
      const score = log.filter(l => l.correct).length;
      onFinish({ score, total, log, elapsed });
    }
  }, [elapsed, limitSeconds, log, total, onFinish]);

  const q = questions[index];
  const isLast = index === total - 1;

  function choose(optionIndex) {
    if (revealed) return;
    setPicked(optionIndex);
    if (instantFeedback) setRevealed(true);
  }

  function next() {
    if (picked === null) return;

    const entry = {
      q: q.q,
      options: q.options,
      correct: q.correct,
      picked,
      explain: q.explain,
      sectionTitle: q.sectionTitle,
      isRight: picked === q.correct,
    };
    const nextLog = [...log, { ...entry, correct: entry.isRight }];
    setLog(nextLog);

    if (isLast) {
      finished.current = true;
      const score = nextLog.filter(l => l.correct).length;
      onFinish({ score, total, log: nextLog, elapsed });
      return;
    }

    setIndex(i => i + 1);
    setPicked(null);
    setRevealed(false);
  }

  const timeLeft = limitSeconds ? Math.max(0, limitSeconds - elapsed) : null;
  const lowTime = timeLeft !== null && timeLeft <= 60;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Bar */}
      <div className="bg-slate-900 text-white sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-5 py-3.5">
          <div className="flex items-center justify-between gap-3 mb-2.5">
            <button
              onClick={onQuit}
              className="flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-slate-400 hover:text-emerald-400"
            >
              <ChevronLeft size={14} /> Quit
            </button>
            <span className="text-sm font-bold">
              Question {index + 1} <span className="text-slate-500">/ {total}</span>
            </span>
            <span className={`flex items-center gap-1.5 text-sm font-mono font-bold ${
              lowTime ? "text-red-400" : "text-slate-300"
            }`}>
              <Clock size={14} />
              {timeLeft !== null ? formatClock(timeLeft) : formatClock(elapsed)}
            </span>
          </div>
          <ProgressBar pct={((index) / total) * 100} height="h-1.5" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-5 py-6 pb-32">
        {q.sectionTitle && (
          <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-2">
            {q.sectionTitle}
          </p>
        )}

        <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
          {q.q}
        </h2>

        <div className="mt-5 space-y-2.5">
          {q.options.map((opt, i) => {
            const letter = String.fromCharCode(65 + i);
            const isPicked = picked === i;
            const isAnswer = i === q.correct;

            let cls = "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800";
            if (revealed && isAnswer) {
              cls = "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40";
            } else if (revealed && isPicked) {
              cls = "border-red-400 bg-red-50 dark:bg-red-950/40";
            } else if (isPicked) {
              cls = "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40";
            }

            return (
              <button
                key={i}
                onClick={() => choose(i)}
                disabled={revealed}
                className={`w-full text-left border rounded-2xl px-4 py-3.5 flex items-start gap-3 transition ${cls}`}
              >
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
                  (revealed && isAnswer) || (!revealed && isPicked)
                    ? "bg-emerald-500 text-white"
                    : revealed && isPicked
                      ? "bg-red-500 text-white"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300"
                }`}>
                  {revealed && isAnswer ? <Check size={15} />
                    : revealed && isPicked ? <X size={15} />
                    : letter}
                </span>
                <span className="text-sm text-slate-800 dark:text-slate-100 leading-snug pt-0.5">
                  {opt}
                </span>
              </button>
            );
          })}
        </div>

        {revealed && q.explain && (
          <div className="mt-4 bg-slate-100 dark:bg-slate-800 rounded-2xl p-4">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">
              Why
            </p>
            <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
              {q.explain}
            </p>
          </div>
        )}
      </div>

      {/* Next */}
      <div className="fixed bottom-0 inset-x-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-t border-slate-200 dark:border-slate-800 px-5 py-3.5">
        <div className="max-w-2xl mx-auto">
          <PrimaryButton onClick={next} disabled={picked === null}>
            {isLast ? "Finish" : "Next question"}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

/* ===========================================================================
   RESULT
   =========================================================================== */
function QuizResult({ module, result, onRetry, onExit }) {
  const [reviewing, setReviewing] = useState(false);

  const pct = result.pct ?? Math.round((result.score / result.total) * 100);
  const passMark = result.passMark ?? module.passMark ?? 75;
  const verdict = result.verdict ?? verdictFor(pct, passMark);

  const tone = verdict.status === "pass" ? "emerald"
    : verdict.status === "close" ? "amber" : "red";

  if (reviewing) {
    return (
      <>
        <ScreenHeader
          title="Review answers"
          subtitle={`${result.score} of ${result.total} correct`}
          onBack={() => setReviewing(false)}
          backLabel="Result"
        />
        <Screen>
          <div className="space-y-3">
            {result.log.map((item, i) => (
              <div
                key={i}
                className={`rounded-2xl p-4 border ${
                  item.correct
                    ? "border-emerald-200 dark:border-emerald-900 bg-emerald-50/50 dark:bg-emerald-950/20"
                    : "border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/20"
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                    item.correct ? "bg-emerald-500" : "bg-red-500"
                  }`}>
                    {item.correct ? <Check size={14} className="text-white" /> : <X size={14} className="text-white" />}
                  </span>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white leading-snug">
                    {item.q}
                  </p>
                </div>

                <div className="mt-3 pl-9 space-y-1 text-sm">
                  {!item.correct && (
                    <p className="text-red-600 dark:text-red-400">
                      <span className="font-bold">You chose:</span> {item.options[item.picked]}
                    </p>
                  )}
                  <p className="text-emerald-700 dark:text-emerald-400">
                    <span className="font-bold">Answer:</span> {item.options[item.correct]}
                  </p>
                  {item.explain && (
                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed pt-1">
                      {item.explain}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Screen>
      </>
    );
  }

  return (
    <>
      <ScreenHeader title={module.label} subtitle={module.sectionLabel} />
      <Screen>
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-center">
          <h2 className={`text-xl font-black tracking-tight ${
            verdict.status === "pass" ? "text-emerald-600 dark:text-emerald-400"
              : verdict.status === "close" ? "text-amber-600 dark:text-amber-400"
              : "text-slate-900 dark:text-white"
          }`}>
            {verdict.title}
          </h2>

          <div className="my-5">
            <ProgressRing pct={pct} size={128} stroke={10} tone={tone} label="Your score" />
          </div>

          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
            {verdict.message}
          </p>

          <div className="mt-6 grid grid-cols-3 gap-3 pt-5 border-t border-slate-100 dark:border-slate-700">
            <Stat label="Correct" value={`${result.score}/${result.total}`} />
            <Stat label="Pass mark" value={`${passMark}%`} />
            <Stat label="Time" value={formatClock(result.elapsed || 0)} />
          </div>
        </div>

        <div className="mt-4 space-y-2.5">
          <PrimaryButton onClick={() => setReviewing(true)}>
            Review answers
          </PrimaryButton>
          <SecondaryButton onClick={onRetry}>
            <span className="inline-flex items-center gap-2">
              <RotateCcw size={16} /> Try again
            </span>
          </SecondaryButton>
          <button
            onClick={onExit}
            className="w-full text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-emerald-600 py-2"
          >
            Back to {module.sectionLabel}
          </button>
        </div>
      </Screen>
    </>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
      <p className="mt-0.5 font-black text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}
