/*
  ===========================================================================
  CONTENT SOURCES

  The one place where a module id from appStructure.js is joined to the data
  that fills it. Screens ask for content by module id and never import a data
  file directly, so moving or renaming a data file only changes this file.

  Two content shapes:

    deck  — flashcards.  { cards, categories, cat, imageCards }
    quiz  — categorised multiple choice.  { categories }  where each category
            has { id, title, blurb, passMarkPct, questions: [{ q, options,
            correct, explain }] }
  ===========================================================================
*/

import { RULES_CARDS, RULES_CATEGORIES, RULES_CAT } from "./rulesFlashcardsData";
import { ROAD_SIGNS, ROAD_SIGN_CATEGORIES, ROAD_SIGN_CAT } from "./roadSignsData";
import { ADI_FLASHCARDS, ADI_FLASHCARD_CATEGORIES, ADI_FLASHCARD_CAT } from "./adiFlashcardsData";
import ADI_THEORY_PRACTICE_CATEGORIES from "./adiTheoryPracticeData";

/* ---------------------------------------------------------------------------
   ADI STAGE 1 MOCK TEST — 151 questions

   adiQuizData.js is in your live repo but wasn't in the zip, so it isn't
   imported here yet. Once the file is back in src/, do two things:

     1. Uncomment the two lines below.
     2. In appStructure.js, set adi.theory.mock to  ready: true

   Nothing else needs changing — the mock test screen is already built and
   will pick the questions up.
   --------------------------------------------------------------------------- */
// import ADI_MOCK_CATEGORIES from "./adiQuizData";
const ADI_MOCK_CATEGORIES = null;

/* ---------------------------------------------------------------------------
   Flashcard decks
   --------------------------------------------------------------------------- */
const DECKS = {
  "driving.theory.flashcards": {
    cards: RULES_CARDS,
    categories: RULES_CATEGORIES,
    cat: RULES_CAT,
    imageCards: false,
    title: "Rules of the Road",
    subtitle: "153 cards across 20 topics",
  },
  "driving.full.flashcards": {
    cards: RULES_CARDS,
    categories: RULES_CATEGORIES,
    cat: RULES_CAT,
    imageCards: false,
    title: "Rules of the Road",
    subtitle: "153 cards across 20 topics",
  },
  "driving.theory.signs": {
    cards: ROAD_SIGNS,
    categories: ROAD_SIGN_CATEGORIES,
    cat: ROAD_SIGN_CAT,
    imageCards: true,
    title: "Road Signs",
    subtitle: "199 official signs across 5 categories",
  },
  "adi.theory.flashcards": {
    cards: ADI_FLASHCARDS,
    categories: ADI_FLASHCARD_CATEGORIES,
    cat: ADI_FLASHCARD_CAT,
    imageCards: false,
    title: "ADI Flashcards",
    subtitle: "62 quick-recall cards",
  },
};

/* ---------------------------------------------------------------------------
   Question banks
   --------------------------------------------------------------------------- */
const QUIZZES = {
  "adi.theory.mcq": {
    categories: ADI_THEORY_PRACTICE_CATEGORIES,
    title: "ADI Theory Practice",
    subtitle: "126 questions across 6 sections",
  },
  "adi.theory.mock": ADI_MOCK_CATEGORIES
    ? {
        categories: ADI_MOCK_CATEGORIES,
        title: "ADI Stage 1 Mock Test",
        subtitle: "151 questions across the 5 official exam sections",
      }
    : null,
};

/* ---------------------------------------------------------------------------
   Learning material — plain topic pages.

   These are outlines, not the full Rules of the Road text. The full rewritten
   book already exists as rules-of-the-road.pdf / .epub; linking or importing
   that content into the app is a separate job.
   --------------------------------------------------------------------------- */
const LEARNING = {
  "driving.theory.learning": {
    title: "Theory Test — Learning Materials",
    intro: "The topics the theory test draws from, in the order worth studying them.",
    topics: [
      { label: "Rules of the Road", blurb: "Right of way, road position, overtaking, general conduct." },
      { label: "Road Signs", blurb: "Regulatory, warning, roadworks, road markings, motorway and information signs." },
      { label: "Alert Driving", blurb: "Observation, anticipation, hazard perception, distraction." },
      { label: "Vehicle & Documents", blurb: "Licences, insurance, NCT, tax, vehicle checks." },
      { label: "Safety Margins", blurb: "Stopping distances, following distances, weather and road surface." },
      { label: "Speed Limits", blurb: "Default limits, special limits, and where each applies." },
      { label: "Vulnerable Road Users", blurb: "Pedestrians, cyclists, motorcyclists, children, older people." },
      { label: "Motorways & Tunnels", blurb: "Joining, lane discipline, breakdowns, tunnel procedure." },
    ],
  },
  "driving.full.learning": {
    title: "Driving Test — Learning Materials",
    intro: "What the tester is watching for, and how the test itself runs.",
    topics: [
      { label: "Test Day Procedure", blurb: "Documents, the vehicle check, the oral technical questions." },
      { label: "Fault Grades", blurb: "How grade 1, 2 and 3 faults are marked and what fails a test." },
      { label: "Manoeuvres", blurb: "Turnabout, reversing around a corner, hill start, parking." },
      { label: "Road Position & Observation", blurb: "Mirrors, blind spots, lane discipline, junction approach." },
      { label: "Junctions & Roundabouts", blurb: "Approach speed, positioning, signalling, right of way." },
      { label: "Progress & Speed", blurb: "Driving to the conditions — hesitancy fails tests too." },
    ],
  },
  "adi.theory.learning": {
    title: "ADI Theory — Learning Materials",
    intro: "The five sections of the Stage 1 written exam.",
    topics: [
      { label: "Driving Test Procedure & Documentation", blurb: "Marking sheets, discs, licence codes, ADI requirements." },
      { label: "Road Safety Precepts & Practices", blurb: "Safe systems, defensive driving, RSA safety policy." },
      { label: "Pedagogy", blurb: "How people learn, lesson structure, feedback and questioning." },
      { label: "Basic Mechanics & Vehicle Maintenance", blurb: "Systems, checks, faults and their symptoms." },
      { label: "Category B & BE Towing", blurb: "Weights, coupling, stability, licence categories." },
    ],
  },
};

/* ---------------------------------------------------------------------------
   Public lookups
   --------------------------------------------------------------------------- */
export const getDeck = (moduleId) => DECKS[moduleId] || null;
export const getQuiz = (moduleId) => QUIZZES[moduleId] || null;
export const getLearning = (moduleId) => LEARNING[moduleId] || null;

/* True when a module genuinely has something behind it right now. The UI uses
   this as well as the `ready` flag, so a module can never open empty even if
   someone flips a flag before the content lands. */
export function hasContent(module) {
  if (!module) return false;
  switch (module.kind) {
    case "flashcards": return Boolean(DECKS[module.id]);
    case "mcq":
    case "mock":       return Boolean(QUIZZES[module.id]);
    case "learning":   return Boolean(LEARNING[module.id]);
    default:           return false;
  }
}
