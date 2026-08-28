# PassDrivingTest.ie — study app

The site rebuilt as an app: login, subscription, two study paths, and progress
tracking on every test. No booking system, no admin dashboard.

## Install

Copy everything in `src/` into your project's `src/` folder. It replaces
`App.jsx` — keep a copy of your old one, since it's the only place the booking
system and admin dashboard exist.

Then:

1. Run `sql/app-accounts-and-progress.sql` in Supabase → SQL Editor.
2. Supabase → Authentication → Providers: enable **Email**.
3. Add `@supabase/supabase-js` to `package.json` if it isn't listed.
4. Make sure `public/signs/` still holds the 199 sign images.

It runs without Supabase too — accounts fall back to browser-only storage so
you can see the whole app working before touching the database.

## Screens

| File | What it is |
|---|---|
| `App.jsx` | Navigation stack, bottom tab bar, the signed-in / signed-out gate |
| `AuthScreen.jsx` | Login and sign-up |
| `screens.jsx` | Home, path, section, learning materials, progress, profile |
| `QuizPlayer.jsx` | Practice MCQs and timed mock tests, plus the result screen |
| `FlashcardPlayer.jsx` | All three flashcard decks |
| `ui.jsx` | Progress bars, rings, tiles, buttons |

## The parts you'll actually edit

| File | What it controls |
|---|---|
| `appStructure.js` | Every section, module and pass mark. The whole app's shape. |
| `contentSources.js` | Which data file feeds which module. |
| `appAuth.jsx` | `SUBSCRIPTION_REQUIRED` — one line, switches payments on. |

## How it's laid out

```
Home
├── Driving Test
│   ├── Full Driving Test Preparation
│   │   └── Learning · Flashcards · MCQs · Mock Test
│   └── Theory Test Preparation
│       └── Learning · Flashcards · Road Signs · MCQs · Mock Test
└── ADI
    ├── Theory Test          → Learning · Flashcards · MCQs · Mock Test
    ├── Practical Test       → Learning · Flashcards · MCQs · Mock Test
    └── Instructability Test → Learning · Flashcards · MCQs · Mock Test
```

Progress rolls up: a module's best score feeds its section's bar, which feeds
the path's bar on the home screen.

## Subscription

Everyone who signs in reads **Active** and gets everything. Nothing is charged.
`SUBSCRIPTION_REQUIRED` in `appAuth.jsx` is the switch — set it to `true` when
payments go live and the gate turns on everywhere. The database already stores
a status, plan and expiry per learner.

## Progress and pass marks

Results save to the device instantly, then sync to the database when someone's
signed in. Anything studied before signing up merges into the account
afterwards — best score wins, attempts add up, nothing is lost.

Pass marks live in `appStructure.js`: **88%** for theory (the real test is
35/40), **75%** for ADI. After a test the learner sees **Passed**, **Almost
there**, or **Keep practising**. Never "failed".

Flashcard progress is the share of cards marked known. Learning materials and
flashcards have no score, so they can't drag a section's percentage down.

---

## What's working, and what isn't

Live now:

- 153 Rules of the Road flashcards
- 199 road signs, with images
- 126 ADI theory practice MCQs, split across 6 sections
- 62 ADI flashcards
- Learning material topic outlines for three sections

Locked with "Coming soon", because no content exists:

- Driving theory MCQs and mock test
- Practical driving test MCQs and mock test
- ADI Practical Test — all four modules
- ADI Instructability Test — all four modules
- ADI Stage 1 mock test — the content exists, but `adiQuizData.js` wasn't in
  the zip. Put the file back in `src/`, uncomment two lines in
  `contentSources.js`, and set `ready: true` in `appStructure.js`.

Every locked module already has its screen built. Adding content is a data
file plus a flag — no new screens.

## Known gaps

- Learning materials are topic outlines, not the full text. The rewritten
  Rules of the Road exists as a PDF and ePub; importing that is its own job.
- The mock test builder pulls questions evenly across sections. For a real
  theory mock you'll probably want the official topic weightings instead.
- No email verification flow beyond Supabase's own. If you turn on "Confirm
  email", people sign up, get a link, then come back and log in.
