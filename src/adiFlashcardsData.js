// ADI Stage 1 flashcards — a smaller, quick-recall set drawn from the same
// Airport Driving School mock papers and RSA sample questions used in the
// Theory Practice quiz, plus a few pure "concept" cards (pedagogy theory,
// pedestrian crossing types) that suit flashcards better than multiple choice.

const ADI_FLASHCARD_CATEGORIES = [
  { id: "procedure", label: "Test Procedure & Documents", swatch: "bg-red-600" },
  { id: "roadsafety", label: "Road Safety Precepts", swatch: "bg-amber-500", dark: true },
  { id: "pedagogy", label: "Pedagogy", swatch: "bg-blue-600" },
  { id: "mechanics", label: "Mechanics & Maintenance", swatch: "bg-emerald-600" },
  { id: "categoryb", label: "Category B & BE Towing", swatch: "bg-purple-600" },
  { id: "crossings", label: "Pedestrian Crossings", swatch: "bg-lime-600", dark: true },
];

const ADI_FLASHCARD_CAT = Object.fromEntries(ADI_FLASHCARD_CATEGORIES.map(c => [c.id, c]));

const RAW_ADI_CARDS = [
  // ---- Test Procedure & Documents ----
  { c: "procedure", q: "What licence restriction code applies after passing a test in an automatic car?", a: "Code 78 — restricted to automatic-transmission vehicles." },
  { c: "procedure", q: "What colour on the Driving Test Report form marks a Grade 3 (dangerous) fault?", a: "Pink." },
  { c: "procedure", q: "How many Grade 3 faults cause an automatic fail?", a: "Just one." },
  { c: "procedure", q: "How long is a Certificate of Competency valid for after a test pass?", a: "24 months (2 years) — it must be exchanged for a full licence within that time." },
  { c: "procedure", q: "What must the insurance disc show on the day of a driving test?", a: "It must be current on the actual date of the test — there's no grace period." },
  { c: "procedure", q: "What shape and colour is an L-plate, and what's the minimum letter height?", a: "A red 'L' on a white square background, at least 15cm tall." },
  { c: "procedure", q: "What documents/requirements are needed to become an ADI?", a: "Tax clearance, a full licence held at least 2 years, and all other RSA requirements." },
  { c: "procedure", q: "What recommended gap should a pupil leave when passing a parked car on the left?", a: "About a door's width." },
  { c: "procedure", q: "What lights must be working for a vehicle to proceed with a driving test?", a: "Indicators, hazard lights, and at least one brake light." },

  // ---- Road Safety Precepts ----
  { c: "roadsafety", q: "What are 'lighting-up hours'?", a: "From half an hour after sunset to half an hour before sunrise." },
  { c: "roadsafety", q: "What should you do if you break down on a motorway?", a: "Use the roadside emergency phone — it identifies your location automatically." },
  { c: "roadsafety", q: "How do you safely cross an unattended level crossing?", a: "Open both gates, drive across, then stop and close both gates straight away." },
  { c: "roadsafety", q: "Who is legally responsible for a passenger aged 16 or under wearing a seatbelt?", a: "The driver." },
  { c: "roadsafety", q: "When is sounding the horn banned in a built-up area?", a: "Between 11.30pm and 7am, except in a genuine traffic emergency." },
  { c: "roadsafety", q: "What year did wearing rear seatbelts become mandatory in Ireland?", a: "1992." },
  { c: "roadsafety", q: "What does a flashing amber light mean at a pelican crossing?", a: "Give way to any pedestrian still on the crossing, but proceed if it's clear." },
  { c: "roadsafety", q: "What's the minimum speed a vehicle must reach to enter a motorway?", a: "50km/h." },
  { c: "roadsafety", q: "What's the legal minimum tyre tread depth?", a: "1.6mm." },
  { c: "roadsafety", q: "At 30km/h, roughly what share of pedestrian collisions are fatal?", a: "About 1 in 10 — far lower than at higher speeds." },
  { c: "roadsafety", q: "What lights should you use in dense fog?", a: "Dipped headlights, plus front and rear fog lights." },
  { c: "roadsafety", q: "How can you identify a zebra crossing at night?", a: "By its flashing amber beacons on posts either side." },

  // ---- Pedagogy ----
  { c: "pedagogy", q: "What's the standard teaching sequence for a new skill?", a: "Explanation, Demonstration, then Controlled Practice." },
  { c: "pedagogy", q: "What does MSPSL stand for?", a: "Mirror, Signal, Position, Speed, Look." },
  { c: "pedagogy", q: "What does EDT stand for?", a: "Essential Driver Training." },
  { c: "pedagogy", q: "What does GROW stand for in the RSA Driving Instructor Handbook?", a: "Goal, Reality, Options, Will." },
  { c: "pedagogy", q: "When should you recap a previous lesson?", a: "At the beginning of the next lesson." },
  { c: "pedagogy", q: "What should happen at the end of a lesson?", a: "Look ahead to the next lesson and set relevant homework tasks." },
  { c: "pedagogy", q: "When should a lesson plan be modified?", a: "If problems come up as the lesson progresses, or the learner is progressing faster than expected." },
  { c: "pedagogy", q: "What are the three general categories of skill in pedagogy?", a: "Cognitive (knowledge), psychomotor (physical), and affective (attitude)." },
  { c: "pedagogy", q: "What's 'self-analysis' in a driving lesson?", a: "When the student analyses their own actions/performance." },
  { c: "pedagogy", q: "What's the structured pattern pupil practice should follow?", a: "Controlled, Prompted, Transferred responsibility, Distributed practice." },
  { c: "pedagogy", q: "What's the difference between learning by rote and learning by gestalt?", a: "Rote is learning by repetition; gestalt is learning by understanding the subject." },

  // ---- Mechanics & Maintenance ----
  { c: "mechanics", q: "What colour is the full-beam headlight dashboard symbol?", a: "Blue." },
  { c: "mechanics", q: "What's the best braking method in a car without ABS?", a: "Cadence braking — pumping the brake pedal." },
  { c: "mechanics", q: "What typically causes a rapidly flashing indicator?", a: "A blown indicator bulb." },
  { c: "mechanics", q: "What's a classic sign of a coolant leak?", a: "Frequent topping-up, and coloured puddles where the car has been parked." },
  { c: "mechanics", q: "What does the oil warning light on the dashboard mean?", a: "You're running low on oil." },
  { c: "mechanics", q: "Since what year has laminated windscreen glass been mandatory in Ireland?", a: "1986." },
  { c: "mechanics", q: "What does spongy or soft-feeling brakes suggest?", a: "The brake fluid may be running low." },
  { c: "mechanics", q: "What does ABS stand for?", a: "Anti-lock Braking System." },
  { c: "mechanics", q: "What does ECO driving mean?", a: "Economical, ecological and safe driving." },
  { c: "mechanics", q: "What can cause wear on the inside edge of a tyre?", a: "Worn struts or shock absorbers." },

  // ---- Category B & BE Towing ----
  { c: "categoryb", q: "What's the maximum vehicle weight under category B?", a: "3.5 tonnes." },
  { c: "categoryb", q: "What is a BE licence?", a: "A category B vehicle combined with a (heavier) trailer." },
  { c: "categoryb", q: "What's the minimum combined length of vehicle + trailer for a BE test?", a: "4.25 metres." },
  { c: "categoryb", q: "What's the minimum trailer size for a BE test?", a: "2.4 metres long, 1.2 metres wide." },
  { c: "categoryb", q: "Who chooses the direction of the reverse manoeuvre in a BE test?", a: "The examiner — it may be left or right." },
  { c: "categoryb", q: "What's the maximum gap allowed between a towing vehicle and a trailer?", a: "4.5 metres." },
  { c: "categoryb", q: "Above what trailer weight are a parking brake, service brake and breakaway brake all required?", a: "750kg Maximum Authorised Mass." },
  { c: "categoryb", q: "What's the maximum passenger count allowed on a category B licence?", a: "8 passengers." },
  { c: "categoryb", q: "What speed limit applies to a car towing a trailer, even on a motorway?", a: "80km/h." },
  { c: "categoryb", q: "How long must N-plates be displayed after passing the full test?", a: "2 years." },
  { c: "categoryb", q: "What penalty points threshold (in 3 years) revokes a full licence held 2+ years?", a: "12 points." },
  { c: "categoryb", q: "What shape and colour must trailer reflectors be?", a: "Red and triangular." },
  { c: "categoryb", q: "If a trailer starts to swerve, what's the correct response?", a: "Ease off the accelerator." },
  { c: "categoryb", q: "What's the minimum age to operate a category W (work vehicle)?", a: "16 years old." },

  // ---- Pedestrian Crossings (concept notes) ----
  { c: "crossings", q: "How is a zebra crossing marked, and what backs it up?", a: "Black-and-white stripes across the road, with flashing amber beacons on either side." },
  { c: "crossings", q: "How does a pelican crossing's light sequence work for pedestrians?", a: "Red 'man' means don't cross; green 'man' means cross with caution; then both pedestrian and vehicle lights flash amber before returning to normal." },
  { c: "crossings", q: "How is a puffin crossing different from a pelican crossing?", a: "No flashing amber stage — the green man goes straight to red, and the vehicle red goes straight to green." },
  { c: "crossings", q: "What makes a toucan crossing different from a zebra, pelican or puffin crossing?", a: "It's designed for both pedestrians and cyclists, with a green cycle symbol alongside the green man." },
  { c: "crossings", q: "What is a Pegasus crossing designed for?", a: "Horse riders — it has a red/green horse symbol and higher-mounted push buttons." },
  { c: "crossings", q: "What is a staggered crossing?", a: "Crossings on each side of a central island, crossed in stages by pressing a button for each separate crossing." },
];

const ADI_FLASHCARDS = (() => {
  const byCat = {};
  RAW_ADI_CARDS.forEach(card => {
    byCat[card.c] = byCat[card.c] || [];
    byCat[card.c].push(card);
  });
  let n = 0;
  const out = [];
  ADI_FLASHCARD_CATEGORIES.forEach(cat => {
    (byCat[cat.id] || []).forEach((card, i) => {
      n += 1;
      out.push({ ...card, id: n, catIndex: i + 1 });
    });
  });
  return out;
})();

export { ADI_FLASHCARD_CATEGORIES, ADI_FLASHCARD_CAT, ADI_FLASHCARDS };
