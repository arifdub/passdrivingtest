/*
  ===========================================================================
  FLASHCARD PLAYER

  Works for all three decks — Rules of the Road, Road Signs, ADI — because the
  only difference between them is whether the front of the card is text or a
  sign image. That comes from `deck.imageCards`.

  "Known" marks are stored per module in the progress store, so they sync with
  everything else and follow the learner to another device.
  ===========================================================================
*/

import React, { useState, useMemo } from "react";
import {
  ChevronLeft, ChevronRight, Shuffle, Check, RotateCcw, ListFilter, X,
} from "lucide-react";
import { ScreenHeader, Screen, ProgressBar, PrimaryButton } from "./ui";
import { useProgress } from "./progressStore";

function shuffle(arr) {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export default function FlashcardPlayer({ module, deck, onExit }) {
  const { getModule, toggleCardKnown } = useProgress();
  const progress = getModule(module.id);
  const known = progress.completedIds || [];

  const [catFilter, setCatFilter] = useState("all"); // all | <catId> | known | unknown
  const [showFilters, setShowFilters] = useState(false);
  const [order, setOrder] = useState(null); // null = natural order
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  /* The deck currently on screen, after filtering and any shuffle. */
  const cards = useMemo(() => {
    let list = deck.cards;
    if (catFilter === "known") {
      list = list.filter(c => known.includes(c.id));
    } else if (catFilter === "unknown") {
      list = list.filter(c => !known.includes(c.id));
    } else if (catFilter !== "all") {
      list = list.filter(c => c.c === catFilter);
    }
    if (!order) return list;
    // Re-apply a stored shuffle order, dropping ids no longer in the filter.
    const byId = Object.fromEntries(list.map(c => [c.id, c]));
    return order.map(id => byId[id]).filter(Boolean);
  }, [deck.cards, catFilter, order, known]);

  const card = cards[index] || null;
  const knownInView = cards.filter(c => known.includes(c.id)).length;
  const pct = cards.length ? Math.round((knownInView / cards.length) * 100) : 0;

  function go(delta) {
    if (!cards.length) return;
    setFlipped(false);
    setIndex(i => (i + delta + cards.length) % cards.length);
  }

  function doShuffle() {
    setOrder(shuffle(cards).map(c => c.id));
    setIndex(0);
    setFlipped(false);
  }

  function reset() {
    setOrder(null);
    setIndex(0);
    setFlipped(false);
  }

  function applyFilter(value) {
    setCatFilter(value);
    setOrder(null);
    setIndex(0);
    setFlipped(false);
    setShowFilters(false);
  }

  async function markKnown() {
    if (!card) return;
    await toggleCardKnown(module.id, card.id);
    // Move on automatically — the point of "I know this" is to get it out of
    // the way, not to sit looking at it.
    if (!known.includes(card.id)) go(1);
  }

  const isKnown = card ? known.includes(card.id) : false;

  return (
    <>
      <ScreenHeader
        title={deck.title}
        subtitle={deck.subtitle}
        onBack={onExit}
        backLabel={module.sectionLabel}
      />

      <Screen>
        {/* Progress */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4">
          <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
            <span>Marked as known</span>
            <span>{knownInView} / {cards.length}</span>
          </div>
          <ProgressBar pct={pct} />
        </div>

        {/* Controls */}
        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={() => setShowFilters(v => !v)}
            className="flex items-center gap-1.5 text-sm font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-200"
          >
            <ListFilter size={15} />
            {catFilter === "all" ? "All topics"
              : catFilter === "known" ? "Known"
              : catFilter === "unknown" ? "Still learning"
              : deck.cat[catFilter]?.label || "Filter"}
          </button>
          <button
            onClick={doShuffle}
            className="flex items-center gap-1.5 text-sm font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-200"
          >
            <Shuffle size={15} /> Shuffle
          </button>
          {order && (
            <button
              onClick={reset}
              className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 px-2 py-2"
            >
              <RotateCcw size={15} />
            </button>
          )}
        </div>

        {showFilters && (
          <div className="mt-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3">
            <div className="flex flex-wrap gap-1.5">
              <FilterChip label="All topics" active={catFilter === "all"} onClick={() => applyFilter("all")} />
              <FilterChip label="Still learning" active={catFilter === "unknown"} onClick={() => applyFilter("unknown")} />
              <FilterChip label="Known" active={catFilter === "known"} onClick={() => applyFilter("known")} />
              {deck.categories.map(c => (
                <FilterChip
                  key={c.id}
                  label={c.label}
                  active={catFilter === c.id}
                  onClick={() => applyFilter(c.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Card */}
        {!card ? (
          <div className="mt-6 text-center py-16 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl">
            <p className="font-bold text-slate-900 dark:text-white">Nothing here</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {catFilter === "unknown"
                ? "You've marked every card in this filter as known."
                : "No cards match this filter yet."}
            </p>
          </div>
        ) : (
          <>
            <button
              onClick={() => setFlipped(f => !f)}
              className="mt-5 w-full min-h-[280px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 flex flex-col items-center justify-center text-center transition active:scale-[0.99]"
            >
              {deck.cat[card.c] && (
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full text-white mb-4 ${deck.cat[card.c].swatch}`}>
                  {deck.cat[card.c].label}
                </span>
              )}

              {!flipped ? (
                deck.imageCards ? (
                  <img
                    src={card.img}
                    alt=""
                    className="max-h-40 w-auto object-contain"
                    loading="lazy"
                  />
                ) : (
                  <p className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                    {card.q}
                  </p>
                )
              ) : (
                <p className={`leading-relaxed ${
                  deck.imageCards
                    ? "text-xl font-bold text-slate-900 dark:text-white"
                    : "text-base text-slate-700 dark:text-slate-200"
                }`}>
                  {deck.imageCards ? card.name : card.a}
                </p>
              )}

              <span className="mt-6 text-[11px] font-bold uppercase tracking-widest text-slate-300 dark:text-slate-600">
                {flipped ? "Tap to go back" : "Tap to reveal"}
              </span>
            </button>

            {/* Nav */}
            <div className="mt-4 flex items-center justify-between gap-3">
              <button
                onClick={() => go(-1)}
                className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300"
              >
                <ChevronLeft size={20} />
              </button>

              <span className="text-sm font-mono font-bold text-slate-400">
                {index + 1} / {cards.length}
              </span>

              <button
                onClick={() => go(1)}
                className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <div className="mt-3">
              <button
                onClick={markKnown}
                className={`w-full font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 ${
                  isKnown
                    ? "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                    : "bg-emerald-500 hover:bg-emerald-400 text-slate-900"
                }`}
              >
                {isKnown ? <><X size={16} /> Study this again</> : <><Check size={16} /> I know this</>}
              </button>
            </div>
          </>
        )}
      </Screen>
    </>
  );
}

function FilterChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`text-xs font-semibold px-3 py-1.5 rounded-full transition ${
        active
          ? "bg-emerald-500 text-slate-900"
          : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
      }`}
    >
      {label}
    </button>
  );
}
