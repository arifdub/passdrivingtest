// ADI (Approved Driving Instructor) Stage 1 Theory Test — Ireland
// Question bank grounded in official RSA sources:
// - The Driving Instructor's Handbook (RSA, 3rd edition, 2019) — Table 3: Structure of ADI Driving Theory Test
// - RSA Driver Tester Marking Guidelines ("Making Your Mark")
// - RSA official ADI Stage 1 sample questions (18-sample-questions-stage-1-theory-test.pdf)
// - RSA Rules of the Road handbook
//
// REAL EXAM STRUCTURE (per RSA Table 3):
//   Driver Testing Procedures and Documentation   20 Qs   pass 14/20 (70%)
//   Road Safety Precepts and Practices             25 Qs   pass 18/25 (72%)
//   Pedagogy – Teaching Ability                     15 Qs   pass  9/15 (60%)
//   Basic Mechanics and Maintenance of Vehicles     20 Qs   pass 14/20 (70%)
//   Category Specific (Car & Work Vehicles B/W)     20 Qs   pass 14/20 (70%)
// This practice bank uses 30 questions per section for a larger pool; the
// pass mark shown for each section matches the real exam's requirement.

const CATEGORIES = [
  {
    id: "testing-procedures",
    title: "Driver Testing Procedures & Documentation",
    signType: "regulatory",
    blurb: "Test marking, fault grades, documentation, ADI process.",
    passMarkPct: 70,
    realExamQuestions: 20,
    questions: [
      {
        q: "On the Driving Test Report form, the pink area relates to:",
        options: ["No faults", "Grade 1, or minor faults", "Grade 2, or more serious faults", "Grade 3, or dangerous faults"],
        correct: 3,
        explain: "The pink area on the Report form is used to record Grade 3 (dangerous or potentially dangerous) faults. This is an official RSA sample question."
      },
      {
        q: "Which of the following is NOT included under secondary controls on the driving test?",
        options: ["Temperature controls", "Air vents", "Head restraints", "Air-intake control"],
        correct: 2,
        explain: "Head restraints are covered under 'Rules/Checks', not secondary controls. Secondary controls include things like temperature and air-intake controls."
      },
      {
        q: "The height of the lettering on an L-plate must be at least:",
        options: ["5cm", "10cm", "15cm", "20cm"],
        correct: 2,
        explain: "L-plate lettering must be at least 15cm high, red on a white background, displayed front and rear."
      },
      {
        q: "When presenting a vehicle for a driving test, the insurance disc must be:",
        options: ["Not more than 10 days out of date", "Not more than 20 days out of date", "Not more than 30 days out of date", "Current on the date of the test"],
        correct: 3,
        explain: "The insurance disc must be current on the actual date of the test — there's no grace period for an expired disc."
      },
      {
        q: "A Grade 2 fault is defined by the RSA marking guidelines as:",
        options: ["A dangerous or potentially dangerous fault", "A serious fault", "Total disregard of traffic controls", "A fault that automatically fails the test"],
        correct: 1,
        explain: "Grade 2 = 'a serious fault' per the RSA Driver Tester Marking Guidelines. Grade 3 is reserved for dangerous/potentially dangerous faults or total disregard of traffic controls."
      },
      {
        q: "A Grade 3 fault is defined as:",
        options: ["Any fault recorded more than 3 times", "A serious fault only", "A dangerous/potentially dangerous fault, or total disregard of traffic controls", "A fault under the 'Progress' heading only"],
        correct: 2,
        explain: "Per the official RSA guidelines, Grade 3 covers dangerous or potentially dangerous faults, or a total disregard of traffic controls."
      },
      {
        q: "According to the RSA marking scale, what percentage range is NOT recorded as a fault at all?",
        options: ["0% to 35%", "0% to 50%", "36% to 75%", "76% to 100%"],
        correct: 0,
        explain: "Faults occurring between 0% and 35% on the marking scale are not deemed serious enough to record."
      },
      {
        q: "On the RSA marking scale, Grade 2 faults fall within which percentage range?",
        options: ["0% to 35%", "36% to 75%", "76% to 100%", "50% to 100%"],
        correct: 1,
        explain: "Grade 2 (more serious) faults occupy the 36% to 75% band on the marking scale."
      },
      {
        q: "A candidate automatically fails the driving test if they incur:",
        options: ["Any single Grade 1 fault", "4 of the same Grade 2 fault for a single aspect", "3 Grade 2 faults spread across different headings", "5 Grade 1 faults under one heading"],
        correct: 1,
        explain: "One of the four automatic-fail rules is 4 of the same Grade 2 fault recorded for a single aspect (e.g. missing the mirror before turning right, four separate times)."
      },
      {
        q: "How many Grade 2 faults under the SAME heading cause an automatic fail?",
        options: ["3 or more", "4 or more", "6 or more", "9 or more"],
        correct: 2,
        explain: "6 or more Grade 2 faults recorded under the same heading is one of the automatic fail conditions."
      },
      {
        q: "How many Grade 2 faults overall (across all headings) cause an automatic fail?",
        options: ["6 or more", "8 or more", "9 or more", "12 or more"],
        correct: 2,
        explain: "9 or more Grade 2 faults overall, regardless of heading, results in an automatic fail."
      },
      {
        q: "How many Grade 3 faults does it take to fail the test?",
        options: ["Just 1", "2", "3", "It depends on the heading"],
        correct: 0,
        explain: "A single Grade 3 fault fails the test immediately, regardless of how well the rest of the drive went."
      },
      {
        q: "A 'Safety Glance' is officially defined as:",
        options: ["Any glance in the rear-view mirror", "The last check over the shoulder to cover the blind spot before changing direction", "A glance used only by motorcyclists", "A check made only when moving off"],
        correct: 1,
        explain: "A Safety Glance is the final check over either shoulder covering the blind spot area not visible in the mirrors, required before changes of direction such as moving off, changing lane, or turning."
      },
      {
        q: "For a Category B reverse manoeuvre, after reversing around the corner, the applicant should continue reversing in a straight line for approximately:",
        options: ["1 car length", "2 car lengths", "3 car lengths", "5 car lengths"],
        correct: 2,
        explain: "For Category B, after completing the corner, the applicant should continue reversing in a straight line for approximately 3 car lengths."
      },
      {
        q: "All Category B reverse manoeuvres (including vans) should be performed along which kerb?",
        options: ["The right-hand kerb", "The left-hand kerb", "Either kerb, examiner's choice", "No kerb — the manoeuvre is done in open road"],
        correct: 1,
        explain: "All Category B reverses, including vans, must be conducted along the left-hand kerb."
      },
      {
        q: "On HGV and Category B van tests, where must the tester be positioned during the reverse manoeuvre?",
        options: ["In the passenger seat", "Outside the vehicle", "In the back of the vehicle", "It doesn't matter"],
        correct: 1,
        explain: "For HGVs and Category B vans, the tester must be outside the vehicle during the reverse manoeuvre, having first checked the parking brake is applied."
      },
      {
        q: "'Rules/Checks' faults on the marking sheet include all of the following EXCEPT:",
        options: ["Door, mirror, and seat adjustments", "Seatbelt and head restraint checks", "Technical checks and hand signals", "Speed on the approach to a junction"],
        correct: 3,
        explain: "Speed on approach to a junction is recorded under 'Speed', not 'Rules/Checks'. Rules/Checks covers door, mirror, seat, seatbelt, head restraint adjustments, technical checks, and hand signals."
      },
      {
        q: "If 3 or more 'Rules/Checks' questions are not answered, or are answered incorrectly, what happens?",
        options: ["No fault is recorded — it's advisory only", "A Grade 1 fault is recorded", "A Grade 2 fault is recorded", "The test is stopped immediately"],
        correct: 2,
        explain: "Where 3 or more questions under Rules/Checks are unanswered or wrong, a Grade 2 fault is recorded (maximum of 1 fault for this aspect)."
      },
      {
        q: "Which organisation issues the unique Eligibility Number needed to book the ADI Stage 1 theory test?",
        options: ["The NDLS", "Prometric (after RSA registration and vetting)", "The local Garda station", "Your ADI training provider"],
        correct: 1,
        explain: "You receive your unique 9-digit Prometric Eligibility Number once you've successfully registered with the RSA as an ADI candidate and your Garda vetting has been approved."
      },
      {
        q: "How long is the ADI Stage 1 theory test, and how many questions does it contain?",
        options: ["60 minutes, 60 questions", "90 minutes, 100 questions", "120 minutes, 80 questions", "45 minutes, 50 questions"],
        correct: 1,
        explain: "The Stage 1 theory test is 90 minutes (plus 15 minutes' familiarisation beforehand) and consists of 100 multiple-choice questions."
      },
      {
        q: "What is the current fee for sitting the ADI Stage 1 theory test?",
        options: ["€75", "€100", "€150", "€200"],
        correct: 2,
        explain: "The Stage 1 ADI theory test fee is €150, payable directly to Prometric."
      },
      {
        q: "If you fail the Stage 1 theory test, how long must you wait before you can re-sit it?",
        options: ["No wait — you may re-sit immediately", "At least 3 complete business days", "1 full week", "1 calendar month"],
        correct: 1,
        explain: "You must wait at least three complete business days before re-sitting the Stage 1 ADI theory test, and you'll need a new Prometric eligibility number."
      },
      {
        q: "You can appeal (request a rescore of) your ADI theory test result within:",
        options: ["10 days of your exam, for a €15 fee", "30 days, free of charge", "6 months, for a €50 fee", "Appeals are not permitted"],
        correct: 0,
        explain: "You can request a rescore within 10 days of your exam by calling Prometric's Candidate Service Team; the appeal fee is €15."
      },
      {
        q: "An RSA Trainee Instructor Licence, held after passing Stages 1 and 2, is valid for a maximum of:",
        options: ["3 months", "6 months", "12 months", "24 months"],
        correct: 1,
        explain: "The Trainee Licence can be held for a maximum of 6 months, during which the cADI trains under the supervision of a sponsoring registered ADI."
      },
      {
        q: "How many hours of supervised training must a Trainee Licence holder complete during the scheme?",
        options: ["At least 10 hours", "At least 20 hours", "At least 40 hours", "At least 60 hours"],
        correct: 1,
        explain: "A Trainee Licence holder must complete at least 20 hours of supervised training, following the RSA syllabus of learning and practice."
      },
      {
        q: "What minimum percentage of a Trainee Licence holder's training must be under the DIRECT supervision of the sponsoring ADI?",
        options: ["10%", "20%", "50%", "100%"],
        correct: 1,
        explain: "A minimum of 20% of training delivered under a Trainee Licence must be directly supervised by the sponsoring ADI."
      },
      {
        q: "How many trainees may a sponsoring ADI supervise at one time under the Trainee Licence scheme?",
        options: ["Only 1", "Up to 2", "Up to 3", "No limit"],
        correct: 0,
        explain: "The sponsoring ADI must only have one trainee under their supervision for the duration of that trainee's licence."
      },
      {
        q: "Once you pass Stage 1 of the ADI assessment process, you must complete Stage 2 within:",
        options: ["3 months", "6 months", "12 months", "18 months"],
        correct: 1,
        explain: "Each subsequent stage of the three-stage ADI process must be started within 6 months of completing the previous stage."
      },
      {
        q: "You must pass Stage 3 (instruction ability) within how long of passing Stage 1?",
        options: ["1 year", "18 months", "2 years", "3 years"],
        correct: 2,
        explain: "All three stages of the ADI qualification process must be completed within 2 years of successfully passing Stage 1."
      },
      {
        q: "A cADI must have held a full driving licence in the relevant category for a minimum of how long before being added to the ADI register?",
        options: ["1 year", "2 years", "3 years", "5 years"],
        correct: 1,
        explain: "Before registration, a cADI must have held a full driving licence for a minimum of two years in the category for which instruction is to be delivered."
      },
      {
        q: "The ADI theory test must be passed before a candidate can proceed to:",
        options: ["Applying for their PPS number", "Stages 2 and 3 of the ADI assessment process", "Garda vetting", "Registering as an ADI candidate"],
        correct: 1,
        explain: "Stage 1 (the theory test) must be passed before a cADI can progress to Stage 2 (practical driving skills) and Stage 3 (instruction ability)."
      }
    ]
  },
  {
    id: "road-safety",
    title: "Road Safety Precepts & Practices",
    signType: "warning",
    blurb: "Speed, alcohol, stopping distances, junctions, GDL.",
    passMarkPct: 72,
    realExamQuestions: 25,
    questions: [
      {
        q: "What is the typical stopping distance on a dry road at 50km/h?",
        options: ["3 metres", "13 metres", "25 metres", "35 metres"],
        correct: 1,
        explain: "This is an official RSA sample question. The typical total stopping distance at 50km/h on a dry road is approximately 13 metres."
      },
      {
        q: "A fully licensed driver is disqualified for 6 months on reaching how many penalty points within 36 months?",
        options: ["7 points", "9 points", "12 points", "15 points"],
        correct: 2,
        explain: "12 or more penalty points within 36 months triggers a 6-month driving ban for a fully licensed driver."
      },
      {
        q: "A learner or novice driver faces a 6-month ban on reaching how many penalty points within 36 months?",
        options: ["4 points", "7 points", "10 points", "12 points"],
        correct: 1,
        explain: "The threshold is lower for learner and novice drivers — 7 points within 36 months triggers disqualification."
      },
      {
        q: "Under the Graduated Driver Licensing (GDL) system, novice drivers can face which of the following for certain offences?",
        options: ["Automatic loss of licence for any offence", "Doubled penalty points for certain offences", "Reduced fines only", "No change compared to fully licensed drivers"],
        correct: 1,
        explain: "Novice drivers (holding a full licence for less than two years) can face doubled penalty points for offences such as drink/drug driving, speeding, seatbelt infractions, handheld phone use, dangerous overtaking, and non-compliance with traffic lights."
      },
      {
        q: "The drink-drive alcohol limit for learner, novice, and professional drivers is:",
        options: ["50mg per 100ml of blood", "80mg per 100ml of blood", "20mg per 100ml of blood", "100mg per 100ml of blood"],
        correct: 2,
        explain: "Learners, novices (first 2 years after passing the test), and professional drivers face a stricter 20mg per 100ml limit."
      },
      {
        q: "A driver with a BAC between 50mg and 80mg receives an on-the-spot fixed penalty and a disqualification of:",
        options: ["1 month", "3 months", "6 months", "12 months"],
        correct: 1,
        explain: "This band carries a €200 fine and an immediate 3-month disqualification."
      },
      {
        q: "The total minimum stopping distance of a vehicle depends on all of the following EXCEPT:",
        options: ["Perception time", "Reaction time", "Vehicle braking capability", "The make of the vehicle's radio"],
        correct: 3,
        explain: "Stopping distance is a function of perception time, reaction time, vehicle reaction time, and braking capability — never anything unrelated like the radio."
      },
      {
        q: "In wet weather, the 'two-second rule' following gap should be:",
        options: ["Halved", "Kept the same", "Doubled", "Tripled"],
        correct: 2,
        explain: "In wet conditions, double the following distance by repeating the two-second phrase twice."
      },
      {
        q: "The minimum speed a vehicle must be capable of to legally use a motorway is:",
        options: ["30km/h", "50km/h", "80km/h", "100km/h"],
        correct: 1,
        explain: "Vehicles incapable of at least 50km/h are barred from motorways, along with cyclists, pedestrians, and several other categories."
      },
      {
        q: "The maximum speed limit on an Irish motorway is:",
        options: ["100km/h", "110km/h", "120km/h", "130km/h"],
        correct: 2,
        explain: "The default maximum motorway speed limit in Ireland is 120km/h."
      },
      {
        q: "Using the roundabout 'golden rule', an exit taken between the 12 and 6 o'clock positions should be approached in:",
        options: ["The left-hand lane", "The right-hand lane", "Whichever lane has less traffic", "The hard shoulder"],
        correct: 1,
        explain: "Exits taken from 12 o'clock round to 6 o'clock should generally be approached in the right-hand lane."
      },
      {
        q: "On a three-lane approach to a roundabout, a driver taking the FIRST exit should approach in:",
        options: ["The left-hand lane", "The middle lane", "The right-hand lane", "Any lane that is free of traffic"],
        correct: 0,
        explain: "This is an official RSA sample question. For the first exit (6 o'clock to 12 o'clock), approach in the left-hand lane."
      },
      {
        q: "You must never enter a yellow box junction unless:",
        options: ["A Garda directs you to", "You can clear it without stopping (except when turning right and waiting for a gap)", "It's after 6pm", "You're driving a bus"],
        correct: 1,
        explain: "The only exception to 'never enter unless you can clear it' is when turning right, where you may wait in the box for a gap, provided you don't block other traffic with right of way."
      },
      {
        q: "At a junction of two roads of equal importance, right of way generally belongs to:",
        options: ["Traffic on the left", "Traffic on the right", "Whoever arrives first", "The larger vehicle"],
        correct: 1,
        explain: "Traffic coming from the right generally has right of way at junctions of equal-importance roads, though caution is always required."
      },
      {
        q: "A micro-sleep while driving tired can last up to:",
        options: ["1 second", "10 seconds", "30 seconds", "1 minute"],
        correct: 1,
        explain: "Micro-sleeps can last up to 10 seconds and can occur even with the driver's eyes open."
      },
      {
        q: "During a 4-second micro-sleep, a car can travel approximately how far?",
        options: ["10 metres", "50 metres", "100 metres", "300 metres"],
        correct: 2,
        explain: "In 4 seconds, a car can travel around 100 metres — more than the length of a football pitch — with effectively no one in control."
      },
      {
        q: "Attitudes towards driving and road use can begin forming from as early as what age?",
        options: ["Age 3", "Age 7", "Age 14", "Age 18"],
        correct: 1,
        explain: "Per the Driving Instructor's Handbook, research shows attitudes to driving can begin forming as early as age 7."
      },
      {
        q: "Driving attitudes can be fully formed by what age, according to the Driving Instructor's Handbook?",
        options: ["Age 10", "Age 14", "Age 18", "Age 21"],
        correct: 1,
        explain: "The Handbook notes that attitudes towards driving and road use can be fully formed by the age of fourteen."
      },
      {
        q: "'Endangering others' as an unsafe driving attitude includes behaviours such as:",
        options: ["Signalling in good time", "Weaving in and out of traffic, tailgating, and racing to overtake", "Complying with speed limits", "Checking mirrors before manoeuvres"],
        correct: 1,
        explain: "The Handbook lists weaving through traffic, tailgating, and racing to overtake with oncoming traffic as examples of endangering others."
      },
      {
        q: "'Thoughtlessness' as an unsafe driving attitude includes:",
        options: ["Parking in disabled bays, or hogging the middle lane on a dual carriageway", "Yielding to pedestrians", "Indicating before turning", "Wearing a seatbelt"],
        correct: 0,
        explain: "Thoughtless behaviours inconvenience or endanger others without malice — parking in reserved spaces or unnecessarily hogging a lane are examples given in the Handbook."
      },
      {
        q: "'Rule compliance' as a safe driving attitude means a driver:",
        options: ["Only follows rules if they think they'll be caught", "Complies with rules and regulations regardless of the chance of being caught", "Ignores rules they personally disagree with", "Follows rules only during driving tests"],
        correct: 1,
        explain: "Safe and socially responsible drivers comply with rules whether or not they believe there's a chance of being caught."
      },
      {
        q: "'Individual risk taking' as an unsafe attitude might show up as:",
        options: ["Driving without a seatbelt because it 'looks cool'", "Wearing a seatbelt at all times", "Obeying the speed limit at night", "Checking blind spots before changing lane"],
        correct: 0,
        explain: "The Handbook lists driving without a seatbelt for image reasons as an example of individual risk-taking that undermines safe driving."
      },
      {
        q: "Essential Driver Training (EDT) for Category B learners consists of:",
        options: ["6 one-hour sessions", "12 one-hour sessions", "16 hours across 4 modules", "20 hours of supervised practice"],
        correct: 1,
        explain: "EDT is a mandatory course of 12 one-hour sessions, delivered over a period of at least 6 months."
      },
      {
        q: "Initial Basic Training (IBT) for motorcycle learners consists of:",
        options: ["6 one-hour sessions", "12 one-hour sessions", "16 hours across 4 modules", "24 hours across 6 modules"],
        correct: 2,
        explain: "Basic IBT is a mandatory 16-hour course broken into 4 sequential modules covering theory and practical riding skills."
      },
      {
        q: "Reduced EDT is available to drivers who:",
        options: ["Are under 18 years old", "Hold a current full Category B licence from a country without a licence exchange agreement with Ireland", "Have passed their theory test twice", "Are training to become an ADI"],
        correct: 1,
        explain: "Reduced EDT (6 one-hour sessions) is designed for holders of a full Category B licence from a country that doesn't have a licence exchange agreement with Ireland."
      },
      {
        q: "The GDL (Graduated Driver Licensing) system consists of which three stages?",
        options: ["Beginner, Intermediate, Advanced", "Learner, Novice, Fully qualified driver", "Junior, Senior, Professional", "Provisional, Restricted, Full"],
        correct: 1,
        explain: "GDL has three stages: Learner (undertaking EDT/IBT), Novice (held a full licence less than 2 years, displays N plates), and Fully qualified driver (2+ years on a full licence)."
      },
      {
        q: "A novice driver is defined as someone who has held a full driving licence for:",
        options: ["Less than 6 months", "Less than 1 year", "Less than 2 years", "Less than 3 years"],
        correct: 2,
        explain: "A novice driver is one who has held their full licence for less than two years, and must display N plates during this period."
      },
      {
        q: "What is the RSA's core safety advice regarding alcohol and driving?",
        options: ["One drink is generally safe", "Never ever drink and drive", "Only avoid drinking if driving long distances", "Wait one hour after your last drink before driving"],
        correct: 1,
        explain: "There's no reliable way to know exactly how much alcohol puts someone over the limit — the RSA's unambiguous advice is never to drink and drive."
      },
      {
        q: "Learner permit holders are prohibited from driving on which type of road?",
        options: ["National roads", "Regional roads", "Motorways", "Local roads"],
        correct: 2,
        explain: "It is an offence for a learner permit holder to drive on a motorway under any circumstances."
      },
      {
        q: "A driver's judgement, reaction time, and decision-making can be significantly affected by:",
        options: ["Alcohol, drugs, tiredness, and state of mind", "The colour of their vehicle", "The time of year", "Their preferred driving route"],
        correct: 0,
        explain: "Alcohol, drugs (prescription and non-prescription), tiredness/fatigue, and state of mind are all recognised factors that impair safe driving."
      }
    ]
  },
  {
    id: "pedagogy",
    title: "Pedagogy — Teaching Ability",
    signType: "info",
    blurb: "Coaching, feedback, learning styles, assessment.",
    passMarkPct: 60,
    realExamQuestions: 15,
    questions: [
      {
        q: "RSA guidance lists 'running commentary' among teaching skills examined at Stage 3. In instructional practice, running commentary most directly supports:",
        options: ["Increasing fuel consumption to build confidence", "Making hazards, observations, and decisions explicit to the learner", "Replacing mirror checks with narration", "Avoiding feedback at lesson end"],
        correct: 1,
        explain: "Running commentary is a technique where the ADI (or learner) verbalises hazards and decision-making in real time, making the thought process behind safe driving explicit."
      },
      {
        q: "A formative assessment is best described as:",
        options: ["An assessment that generates a formal pass/fail decision", "A reflective process that promotes learner attainment, without a pass/fail outcome", "Only used at the end of a learning period", "Only relevant to the practical driving test"],
        correct: 1,
        explain: "Formative assessment is a reflective process — typically a mix of observation and question-and-answer — designed to help the learner improve, without a formal pass/fail result."
      },
      {
        q: "A summative assessment is best described as:",
        options: ["An informal chat about progress", "An assessment undertaken at the end of a learning period to generate a pass/fail decision", "Something only used by Sponsors, never ADIs", "A synonym for formative assessment"],
        correct: 1,
        explain: "Summative assessment happens at the end of a period of learning and does generate a formal pass or fail decision — such as the practical driving test itself."
      },
      {
        q: "The VARK model of learning styles refers to which four categories?",
        options: ["Visual, Auditory, Read/write, Kinesthetic", "Verbal, Active, Reflective, Kinetic", "Visual, Analytical, Reactive, Kinesthetic", "Verbal, Auditory, Reflective, Kinesthetic"],
        correct: 0,
        explain: "VARK stands for Visual, Auditory, Read/write, and Kinesthetic — a common model for understanding different learners' preferred ways of absorbing information."
      },
      {
        q: "A 'Sponsor', as defined in the Driving Instructor's Handbook, must hold a full Category B licence for a minimum of:",
        options: ["6 months", "1 year", "2 years", "5 years"],
        correct: 2,
        explain: "A Sponsor is someone who accompanies a learner during practice drives outside formal lessons, and must hold a valid Category B licence for at least 2 years."
      },
      {
        q: "The LDT (Learner Driver Training) Syllabus is made up of how many modules?",
        options: ["2", "4", "6", "8"],
        correct: 1,
        explain: "The LDT Syllabus has 4 modules: Before starting to drive; Basic control of the vehicle; The fundamentals of road sharing; and Driving in more challenging situations."
      },
      {
        q: "Which LDT Syllabus module covers driving laws, primary/secondary controls, and journey planning?",
        options: ["Module 1: Before starting to drive", "Module 2: Basic control of the vehicle", "Module 3: The fundamentals of road sharing", "Module 4: Driving in more challenging situations"],
        correct: 0,
        explain: "Module 1 covers what learners need to know before they begin driving, including laws, basic vehicle controls, and journey planning."
      },
      {
        q: "The ADI Framework identifies which three main roles for an ADI?",
        options: ["Teaching, Testing, Certifying", "Driving competently, Instruction, Business skills", "Coaching, Mentoring, Assessing", "Theory, Practical, Business"],
        correct: 1,
        explain: "The ADI Framework defines Role 1 (Driving competently — category specific), Role 2 (Instruction — generic), and Role 3 (Business skills — generic)."
      },
      {
        q: "Good feedback to a learner should, according to the ADI code of practice, relate to:",
        options: ["As many faults as possible at once, for efficiency", "One piece of changeable behaviour at a time", "Only positive points, never faults", "Only what happened in the final 5 minutes"],
        correct: 1,
        explain: "The lesson structure code of practice specifies feedback should relate to one piece of changeable behaviour at a time, given in a balanced, timely, and supportive way."
      },
      {
        q: "'Self-analysis', per the Handbook's glossary, incorporates:",
        options: ["Self-assessment and self-reflection", "Only formal written tests", "Feedback from the Sponsor only", "External assessment only"],
        correct: 0,
        explain: "Self-analysis is defined as incorporating both self-assessment (evaluating your own performance) and self-reflection (considering past actions and decisions)."
      },
      {
        q: "What is the first check-test an ADI undergoes officially called, and what is its purpose?",
        options: ["A Formal Check-test — results in pass/fail", "An Information Check Test — for the ADI's benefit, no formal assessment", "A Practical Retest — same as Stage 2", "A Compliance Audit — legal in nature"],
        correct: 1,
        explain: "The first check-test is called an Information Check Test. It provides feedback to help the ADI improve but does not result in a formal pass/fail assessment."
      },
      {
        q: "If an ADI's check-test performance is found unsatisfactory, when is a second check-test typically arranged?",
        options: ["Immediately, the same day", "Within 4 to 8 weeks", "After 6 months", "After 1 year"],
        correct: 1,
        explain: "A second check-test is arranged 4 to 8 weeks later, giving the ADI time to address the issues identified."
      },
      {
        q: "A cADI must score at least how many marks to pass the Stage 3 instruction ability test?",
        options: ["40 marks", "50 marks", "60 marks", "75 marks"],
        correct: 2,
        explain: "The cADI must score a minimum of 60 marks, demonstrating competence across a set of assessed areas including 16 core competencies."
      },
      {
        q: "Of the competencies assessed at Stage 3, how many are 'core competencies' that must be demonstrated in either or both phases of the test?",
        options: ["8", "12", "16", "20"],
        correct: 2,
        explain: "There are 16 core competencies (out of 38 total areas assessed) that must be demonstrated during Stage 3."
      },
      {
        q: "According to the ADI voluntary code of practice, every lesson should be structured to have:",
        options: ["A beginning, middle, and end", "No fixed structure — flexibility is key", "At least three separate breaks", "A written test at the end"],
        correct: 0,
        explain: "The code of practice states each lesson should be prepared beforehand and structured with a clear beginning, middle, and end."
      },
      {
        q: "In the RSA approved ADI training programme, which module covers a 45-minute assessed drive on a complex route?",
        options: ["Module 1: The role of an ADI", "Module 3: ADI practical driving skills", "Module 6: Support the learner", "Module 8: Delivering a good service"],
        correct: 1,
        explain: "Module 3 involves a 45-minute drive on a complex route with an approved trainer, used to identify areas the cADI needs to focus on."
      },
      {
        q: "Which module of the ADI training programme focuses on designing lesson plans and route planning?",
        options: ["Module 2: ADI driving theory", "Module 4: Design and prepare training", "Module 5: Deliver training", "Module 7: Evaluate and improve training"],
        correct: 1,
        explain: "Module 4 covers designing and tailoring lesson plans, judging progress, and route planning to match individual learner needs."
      },
      {
        q: "Which module of the ADI training programme covers integrating Sponsors and preparing the learner for their final assessment?",
        options: ["Module 4: Design and prepare training", "Module 5: Deliver training", "Module 6: Support the learner", "Module 8: Delivering a good service"],
        correct: 2,
        explain: "Module 6 explains how to support the learner throughout the learning-to-drive process, including integrating Sponsors and preparing for the practical test."
      },
      {
        q: "Which module of the ADI training programme covers record-keeping, health and safety, and customer care?",
        options: ["Module 5: Deliver training", "Module 6: Support the learner", "Module 7: Evaluate and improve training", "Module 8: Delivering a good service"],
        correct: 3,
        explain: "Module 8 covers business tasks: selecting an appropriate vehicle, keeping records, updating Learner Logbooks, and providing good customer care."
      },
      {
        q: "According to the Handbook glossary, formative assessments by ADIs and learners will normally be a mixture of:",
        options: ["Written exams and quizzes only", "Observations and question-and-answer techniques", "Peer review sessions only", "Self-certification forms"],
        correct: 1,
        explain: "Formative assessment is described as normally being a mixture of observing driving performance and using question-and-answer techniques."
      },
      {
        q: "A 'Learner', as defined in the Handbook, is most likely to be:",
        options: ["Always someone aged 17-21 with no exceptions", "A young person aged 17-21 with little experience, though could also be an older driver seeking refresher training or a driver with disabilities", "Only ever someone who has failed a previous test", "Exclusively defined as someone under 18"],
        correct: 1,
        explain: "While most learners are young (17-21) with little driving experience, the Handbook notes a learner could also be an older driver seeking refresher training, or a driver with disabilities."
      },
      {
        q: "The Handbook lists tailored feedback approaches for several types of learner. Which of these is one of them?",
        options: ["Learners who own a particular car brand", "Learners who are anxious, over-confident, hard of hearing, or have English as a second language", "Learners who live in rural areas only", "Learners who book morning lessons only"],
        correct: 1,
        explain: "The Handbook gives specific guidance for giving feedback to disabled learners, older learners, anxious learners, over-confident learners, ESL learners, and hard-of-hearing learners."
      },
      {
        q: "Continuing Professional Development (CPD) for an ADI can be achieved through:",
        options: ["Formal training courses only — nothing else counts", "Networking with other ADIs, e-learning, internet research, or attending conferences, not just formal courses", "Only by retaking the Stage 1 theory test", "CPD is optional and requires no record-keeping"],
        correct: 1,
        explain: "CPD doesn't necessarily require attending formal courses — it can include networking, involvement in relevant organisations, e-learning, research, or conferences."
      },
      {
        q: "When keeping CPD records, an ADI should include all of the following EXCEPT:",
        options: ["The type of activity and total hours", "The area of competence developed", "How the learning was applied to real situations", "The make and model of their training vehicle"],
        correct: 3,
        explain: "CPD records should cover activity type, hours, area of competence, real-world application, and career/business impact — not vehicle details."
      },
      {
        q: "'Competence', per the Handbook's glossary, is defined as:",
        options: ["Holding a full driving licence for over 5 years", "The ability to consistently perform driving and/or teaching activities to the required standard under a specified range of conditions", "Passing the Stage 1 theory test with a perfect score", "Having no penalty points on your licence"],
        correct: 1,
        explain: "Competence is defined precisely as consistent performance of driving/teaching activities to the required standard, under specified conditions."
      },
      {
        q: "'Attitudes', per the Handbook's glossary, are best described as:",
        options: ["Fixed traits present from birth that cannot change", "Feelings and emotions towards a person or object, formed through experience, leading to a readiness to respond in a predetermined way", "Only relevant to professional drivers", "The same thing as driving skills"],
        correct: 1,
        explain: "Attitudes reflect feelings and emotions formed through experience, and lead to a readiness to respond to situations in a predetermined manner."
      },
      {
        q: "'Behaviours', as distinct from attitudes, are defined in the Handbook as:",
        options: ["Purely genetic and unchangeable", "The personal style of, or approaches to, driving which demonstrate whether someone has safe and socially responsible attitudes", "Identical in meaning to 'attitudes'", "Only measured during the practical driving test"],
        correct: 1,
        explain: "Behaviours are the observable driving style or approach that demonstrates whether a person's underlying attitudes are safe and socially responsible."
      },
      {
        q: "The Handbook notes that changing a learner's attitude is often easier than:",
        options: ["Explaining road signs to them", "Getting them to change their actual driving behaviour", "Teaching them to parallel park", "Booking their driving test"],
        correct: 1,
        explain: "It can be quite easy to get someone to say they'll change their attitude — the harder part is actually changing their behaviour to match it."
      },
      {
        q: "According to the Handbook, influences that can cause drivers to act inconsistently with their stated attitudes include:",
        options: ["Cognitive, emotional, and enforced-behaviour factors, such as peer pressure overriding stated beliefs", "Only the driver's age", "Only the make of their vehicle", "Weather conditions exclusively"],
        correct: 0,
        explain: "The Handbook identifies cognitive factors, emotional factors, and enforced behaviours (e.g. peer pressure) as the three main influences causing gaps between stated attitudes and actual behaviour."
      },
      {
        q: "A 'cADI', per the Handbook's glossary, refers to:",
        options: ["A fully registered ADI with over 10 years' experience", "A candidate who has applied for registration as an Approved Driving Instructor", "A driving test examiner", "A learner driver taking their first lesson"],
        correct: 1,
        explain: "cADI stands for Candidate Approved Driving Instructor — someone who has applied for ADI registration but has not yet completed the full three-stage process."
      }
    ]
  },
  {
    id: "mechanics",
    title: "Basic Mechanics & Vehicle Maintenance",
    signType: "warning",
    blurb: "Tyres, engines, brakes, and vehicle systems.",
    passMarkPct: 70,
    realExamQuestions: 20,
    questions: [
      {
        q: "A turbocharger's air pump is driven by:",
        options: ["Exhaust gases", "The crankshaft", "The camshaft", "A fan belt"],
        correct: 0,
        explain: "This is an official RSA sample question. A turbocharger uses exhaust gases to drive its turbine, which compresses intake air."
      },
      {
        q: "'Design gross vehicle weight' (DGVW) means:",
        options: ["Weight as specified by the manufacturer", "Unladen weight only", "Maximum permitted load weight only", "Unladen weight plus the weight of passengers only"],
        correct: 0,
        explain: "This is an official RSA sample question. DGVW is the weight specified by the manufacturer, covering the vehicle plus its maximum designed load — also referred to as Maximum Authorised Mass (MAM)."
      },
      {
        q: "Coasting (driving with the clutch pressed in or in neutral) affects the vehicle by:",
        options: ["Increasing the braking effect of engine compression", "Eliminating the braking effect of engine compression", "Overheating the tyres", "Overheating the engine"],
        correct: 1,
        explain: "This is an official RSA sample question. Coasting removes the natural braking effect that engine compression normally provides, reducing control."
      },
      {
        q: "For driving test purposes, a Category C vehicle must have:",
        options: ["A closed box body at least as wide and as high as the cab", "A flat body only", "Either a closed box or flat body, examiner's choice", "No specific body requirement"],
        correct: 0,
        explain: "This is an official RSA sample question. The representative Category C test vehicle must have a closed box body at least as wide and high as the cab."
      },
      {
        q: "Left-foot braking in an automatic vehicle is advisable only when:",
        options: ["Driving downhill", "Driving in the rain", "Manoeuvring slowly (e.g. reverse, turnabout, parking)", "Stopping in an emergency"],
        correct: 2,
        explain: "This is an official RSA sample question. Left-foot braking is acceptable only while manoeuvring slowly in confined areas, such as reversing, a turnabout, or parking."
      },
      {
        q: "The maximum permitted weight of an articulated vehicle with air suspension and six axles is:",
        options: ["38,000kg", "40,000kg", "42,000kg", "44,000kg"],
        correct: 3,
        explain: "This is an official RSA sample question. With air suspension and six axles, the maximum permitted weight is 44,000kg."
      },
      {
        q: "A rear load projecting overhang must be marked with a red flag when it exceeds:",
        options: ["1.5 metres", "1 metre", "0.75 metres", "0.5 metres"],
        correct: 1,
        explain: "This is an official RSA sample question. A projecting rear overhang exceeding 1 metre must be marked with a red flag."
      },
      {
        q: "What is the legal minimum tyre tread depth in Ireland?",
        options: ["1.0mm", "1.6mm", "2.5mm", "3mm"],
        correct: 1,
        explain: "The legal minimum tread depth is 1.6mm over the main tread, though it's strongly recommended to replace tyres closer to 3mm."
      },
      {
        q: "Windscreens on vehicles registered since January 1986 must be made of:",
        options: ["Tempered glass", "Laminated glass", "Polycarbonate", "Acrylic"],
        correct: 1,
        explain: "Laminated glass has been required for windscreens since January 1986, and for any replacement windscreens on older vehicles."
      },
      {
        q: "HGVs must be fitted with which types of mirror to reduce blind spots for pedestrians and cyclists?",
        options: ["Standard wing mirrors only", "Cyclops, close proximity, and wide-angle mirrors", "Rear-view mirror only", "No additional mirrors are required"],
        correct: 1,
        explain: "All HGVs must have Cyclops (front), close proximity, and wide-angle mirrors to eliminate blind spots and protect vulnerable road users."
      },
      {
        q: "Fog lights should only be used:",
        options: ["At any time after dark", "In dense fog or falling snow", "Whenever it's raining", "Fog lights are illegal in Ireland"],
        correct: 1,
        explain: "Fog lights should be reserved for dense fog or falling snow — using them otherwise can dazzle other drivers."
      },
      {
        q: "Which of the following is on the RSA's list of recommended items to carry in a vehicle?",
        options: ["A spare set of number plates", "A first aid kit, hi-viz vest, warning triangle, torch, and small fire extinguisher", "A second spare wheel always", "A fire blanket, but no extinguisher"],
        correct: 1,
        explain: "The RSA recommends carrying a first aid kit, at least one hi-viz vest, a warning triangle, a torch, and a small fire extinguisher."
      },
      {
        q: "A rear-facing child car seat must never be placed in a seating position that has:",
        options: ["A window nearby", "An active frontal airbag", "A seatbelt fitted", "Rear headrests"],
        correct: 1,
        explain: "A deploying frontal airbag can cause serious injury or death to a child in a rear-facing car seat positioned in front of it."
      },
      {
        q: "All Driving School vehicles (except motorcycles) are legally required to have:",
        options: ["A rear-view camera", "Dual controls fitted", "Heated seats", "A sunroof"],
        correct: 1,
        explain: "All ADI training vehicles, apart from motorcycles, must have dual controls fitted."
      },
      {
        q: "The RSA advises ADI training vehicles should carry which safety items?",
        options: ["A spare tyre only", "A first aid kit, fluorescent jackets, a warning triangle, and a fire extinguisher", "A tow rope only", "No specific items are advised"],
        correct: 1,
        explain: "In addition to being roadworthy, ADI vehicles should carry a first aid kit, fluorescent jackets, a collision warning triangle, and a fire extinguisher."
      },
      {
        q: "'Coasting' in a manual vehicle specifically refers to:",
        options: ["Driving with the clutch engaged and gear selected at all times", "Driving with the clutch pressed in, or in neutral, for a prolonged distance", "Using cruise control on a motorway", "Applying gentle, steady acceleration"],
        correct: 1,
        explain: "Coasting means driving for a prolonged distance with the clutch pedal pressed in, or in neutral — removing the vehicle's engine braking effect and reducing driver control."
      },
      {
        q: "For test purposes, what should an applicant do with 'Technical Checks' if they cannot describe or perform them?",
        options: ["Nothing — technical checks are not assessed", "A fault may be recorded for lack of expertise or inability to describe the check", "The test is automatically cancelled", "The examiner performs the check on their behalf, no fault recorded"],
        correct: 1,
        explain: "Technical Checks assess an applicant's expertise and ability to describe vehicle checks; failing 3 or more results in a Grade 2 fault being recorded."
      },
      {
        q: "A vehicle's minimum stopping distance is affected by the condition of its:",
        options: ["Infotainment system", "Brakes, tyre pressure/tread, and vehicle weight", "Paint finish", "Number plate design"],
        correct: 1,
        explain: "Braking capability depends on factors like brake condition, tyre pressure and tread, and the overall weight of the vehicle."
      },
      {
        q: "What must a driver check regularly regarding tyres, beyond tread depth?",
        options: ["Only the tyre brand", "Pressure (including the spare) and signs of damage like cuts, cracks, or bulges", "Only the manufacturing date", "Nothing else is required by law"],
        correct: 1,
        explain: "Regularly check tyre pressure — including the spare — against manufacturer specifications, and inspect for cuts, cracks, and bulges that could cause a blowout."
      },
      {
        q: "A driving instructor's vehicle must comply with which set of requirements in addition to normal roadworthiness rules?",
        options: ["No additional requirements beyond a normal car", "Requirements for 'representative vehicles' for the driving test category being taught", "Only insurance requirements", "Only requirements set by the local council"],
        correct: 1,
        explain: "An ADI's training vehicle must meet the RSA's 'representative vehicle' requirements for the licence category in which instruction is being given, in addition to standard roadworthiness rules (NCT, tax, insurance)."
      },
      {
        q: "What does CVRT stand for, and to which vehicles does it apply?",
        options: ["Commercial Vehicle Roadworthiness Test — applies to commercial/goods vehicles", "Car Value Registration Tax — applies to imported cars", "Certified Vehicle Repair Ticket — applies to written-off vehicles", "Category Vehicle Restriction Table — a licensing document"],
        correct: 0,
        explain: "CVRT (Commercial Vehicle Roadworthiness Test) is the equivalent of the NCT for commercial vehicles, checking their ongoing roadworthiness."
      },
      {
        q: "At the front of a motor vehicle, the required lights include:",
        options: ["Two headlights (white or yellow), two white sidelights, and amber direction indicators", "Red sidelights and blue headlights", "Only headlights — sidelights aren't required", "Rear reflectors only"],
        correct: 0,
        explain: "Front lighting requirements include two headlights (white or yellow), two white sidelights, and amber-only direction indicators."
      },
      {
        q: "At the rear of a motor vehicle, the required lights and reflectors include:",
        options: ["Two red tail lights, two red brake lights, two red reflectors, number plate lighting, and amber indicators", "White reflectors only", "Blue tail lights", "No reflectors are required, only brake lights"],
        correct: 0,
        explain: "Rear requirements are two red tail lights, two red brake lights, two red reflectors, number plate lighting, and amber direction indicators."
      },
      {
        q: "Safety belts must be worn where fitted, except for certain groups. Which of these is a recognised exemption?",
        options: ["Anyone travelling under 5km", "A person with a medical exemption certificate from their doctor", "All rear-seat passengers automatically", "Anyone over the age of 60"],
        correct: 1,
        explain: "Exemptions include people whose doctor has certified, on medical grounds, that they should not wear a safety belt — as well as certain specific roles like driving instructors during a lesson."
      },
      {
        q: "A vehicle owner must ensure regular checks are carried out on which of these systems?",
        options: ["Only the infotainment system", "Steering, brakes, lights, indicators, reflectors, mirrors, seatbelts, speedometer, tyres, wipers, horn, and silencer", "Only the horn and silencer", "Only cosmetic condition"],
        correct: 1,
        explain: "Drivers must ensure a full range of safety-critical systems are checked regularly, including steering, brakes, lighting, mirrors, seatbelts, tyres, wipers, horn, and silencer."
      },
      {
        q: "As an owner of a commercial vehicle, what must be in place regarding vehicle inspection?",
        options: ["No formal system is required", "A system for regular inspection and ongoing maintenance, including a daily walk-around check before driving in a public place", "Only an annual check is required", "Inspections are optional if the vehicle is under warranty"],
        correct: 1,
        explain: "Commercial vehicle owners must implement a system for regular inspection and maintenance, including a daily walk-around check of the vehicle before it's driven in public."
      },
      {
        q: "Rear-view mirrors on a vehicle may be substituted by which approved technology?",
        options: ["A dashcam only", "An approved MirrorCam (side-mounted digital rear-view system)", "A phone mounted on the dashboard", "There is no approved substitute for mirrors"],
        correct: 1,
        explain: "Vehicles may use an approved MirrorCam — a side-mounted digital rear-view system — as a substitute for traditional mirrors."
      },
      {
        q: "Vehicle mirrors must be used by a driver:",
        options: ["Only when reversing", "Before signalling, moving off, changing lanes, overtaking, slowing down, stopping, turning, or opening doors", "Only on motorways", "Mirror use is optional if the driver has good peripheral vision"],
        correct: 1,
        explain: "Drivers must use mirrors before a wide range of manoeuvres: signalling, moving off, changing lanes, overtaking, slowing, stopping, turning, and opening doors."
      },
      {
        q: "What must be kept clean and in good working order for a vehicle's lighting to be considered legally effective?",
        options: ["Only the headlight bulbs matter", "Lights, reflectors, and number plate lighting must all be kept clean and functional", "Only the brake lights matter", "There's no requirement to keep lights clean"],
        correct: 1,
        explain: "Lights, reflectors, and number plate lighting are only effective — and legally compliant — if kept clean and in good working order."
      },
      {
        q: "Before changing or fitting accessories such as spot lights, bull bars, or ornaments to a vehicle, a driver should:",
        options: ["Do so freely — no restrictions apply", "Take care not to increase risk to road users, particularly vulnerable ones like cyclists and pedestrians", "Only worry about the vehicle's appearance", "Inform the local council only"],
        correct: 1,
        explain: "Modifications to a vehicle's physical appearance must not increase risk to road users, especially vulnerable ones such as cyclists and pedestrians — and drivers should also check the modification won't invalidate their insurance."
      }
    ]
  },
  {
    id: "category-specific",
    title: "Category-Specific: Car & Work Vehicles (B/W)",
    signType: "national",
    blurb: "Category B and W rules, licences, and test specifics.",
    passMarkPct: 70,
    realExamQuestions: 20,
    questions: [
      {
        q: "The minimum age to apply for a first learner permit in Category B (car) is:",
        options: ["16", "17", "18", "21"],
        correct: 1,
        explain: "Category B (cars, small vans, 4x4s) has a minimum age of 17 for a first learner permit."
      },
      {
        q: "Category B covers vehicles with a Maximum Authorised Mass (MAM) not exceeding:",
        options: ["1,500kg", "2,500kg", "3,500kg", "5,000kg"],
        correct: 2,
        explain: "Category B covers vehicles (other than motorcycles, mopeds, work vehicles, or land tractors) with a MAM not exceeding 3,500kg."
      },
      {
        q: "A Category B vehicle can have passenger accommodation for how many people, in addition to the driver?",
        options: ["Not more than 4", "Not more than 8", "Not more than 12", "Unlimited"],
        correct: 1,
        explain: "Category B allows passenger accommodation for not more than 8 people in addition to the driver."
      },
      {
        q: "Category W covers which vehicles, and at what minimum age?",
        options: ["Mopeds, from age 16", "Work vehicles and land tractors, from age 16", "Motorcycles, from age 18", "Buses, from age 21"],
        correct: 1,
        explain: "Category W covers work vehicles and land tractors, with a minimum age of 16."
      },
      {
        q: "Quadricycles (other than those covered by Category AM) fall under which licence category?",
        options: ["Category A1", "Category B", "Category C1", "Category D1"],
        correct: 1,
        explain: "Quadricycles not covered by Category AM are included under Category B."
      },
      {
        q: "A Category BE licence allows towing a trailer where the combined vehicle-and-trailer MAM is:",
        options: ["Up to 2,000kg only", "Greater than 3,500kg but generally up to 7,000kg", "Only under 1,000kg", "Unlimited"],
        correct: 1,
        explain: "A category BE licence covers combinations where the combined MAM exceeds 3,500kg (the Category B towing limit) but is generally capped around 7,000kg."
      },
      {
        q: "How many one-hour EDT sessions must a Category B learner complete?",
        options: ["6", "8", "12", "16"],
        correct: 2,
        explain: "Category B learners must complete 12 one-hour Essential Driver Training sessions with an Approved Driving Instructor."
      },
      {
        q: "A first-time Category B learner permit holder must generally wait how long before they can sit the driving test?",
        options: ["3 months", "6 months", "9 months", "12 months"],
        correct: 1,
        explain: "First-time learner permit holders (in most categories, including B) must wait at least six months before taking the driving test."
      },
      {
        q: "A Category W learner permit holder may only carry a passenger if:",
        options: ["Never — Category W learners can't carry passengers at all", "The vehicle is constructed to carry a passenger and that passenger is a qualified driver", "Any licensed adult is present", "The passenger has also passed the theory test"],
        correct: 1,
        explain: "Category W learner permit holders may carry a passenger only if the vehicle is constructed/adapted to carry one, and the passenger is a qualified driver."
      },
      {
        q: "A learner permit holder for Category B must be accompanied at all times by:",
        options: ["Anyone with a valid ID", "A qualified driver, holding a full licence in that category for a continuous 2 years", "A Garda", "No one — Category B learners may drive unaccompanied"],
        correct: 1,
        explain: "Category B learner permit holders must be accompanied and supervised by a qualified driver — someone who's held a full licence in the same category continuously for 2 years."
      },
      {
        q: "A Sponsor supporting a Category B learner outside formal lessons must hold a full Category B licence for a minimum of:",
        options: ["6 months", "1 year", "2 years", "5 years"],
        correct: 2,
        explain: "A Sponsor must hold a valid Category B licence for a minimum of two years and have built up considerable driving experience."
      },
      {
        q: "The Category B reverse test manoeuvre requires the applicant to continue reversing in a straight line for approximately:",
        options: ["1 car length", "3 car lengths", "5 car lengths", "10 car lengths"],
        correct: 1,
        explain: "For Category B, after negotiating the corner, the applicant continues reversing in a straight line for approximately 3 car lengths."
      },
      {
        q: "On Category B car tests, faults for not using the external mirror(s) correctly are recorded as:",
        options: ["'Mirror' faults", "'Observation' faults", "'Vehicle Control' faults", "No fault is recorded"],
        correct: 1,
        explain: "Unlike vans, BE, or HGV tests (where these are 'Mirror' faults), on Category B car tests, external mirror faults are recorded as 'Observation' faults."
      },
      {
        q: "Category B vehicles used for a driving test must display:",
        options: ["No special markings are required", "Valid L-plates front and rear, plus current insurance, tax, and NCT discs (where applicable)", "Only a rear L-plate", "A 'Student Driver' sign only"],
        correct: 1,
        explain: "Any test vehicle, including Category B, must display valid L-plates front and rear and have current insurance, motor tax, and NCT discs where required."
      },
      {
        q: "Which of the following is a legal requirement specifically for Category B ADI training vehicles?",
        options: ["A rear spoiler", "Dual controls fitted", "A manual transmission only", "Leather seats"],
        correct: 1,
        explain: "All ADI training vehicles for categories other than motorcycles — including Category B — must have dual controls fitted."
      },
      {
        q: "A driver holding a full Category B licence may tow a trailer without upgrading to Category BE only if:",
        options: ["The trailer's MAM is 750kg or less, or the combined MAM of vehicle and trailer doesn't exceed 3,500kg", "The trailer is under 500kg regardless of vehicle weight", "Never — any towing needs Category BE", "The trailer has no brakes fitted"],
        correct: 0,
        explain: "A full Category B licence permits towing only where the trailer's MAM is 750kg or less, or where the combined MAM of vehicle and trailer stays within 3,500kg."
      },
      {
        q: "For Category B, if a driver needs to tow a heavier trailer than the standard B limit allows, which licence category is required?",
        options: ["Category A", "Category BE", "Category C1", "Category D"],
        correct: 1,
        explain: "A Category BE licence is required to tow trailers heavier than what a standard full Category B licence allows."
      },
      {
        q: "Under EU regulation, since 1 September 2024, new child seats sold in the EU must comply with which regulation, relevant to fitting seats in Category B vehicles?",
        options: ["R44 only", "R129 (i-Size)", "ISO-FIX only, no formal regulation", "There is no applicable regulation"],
        correct: 1,
        explain: "Since 1 September 2024, child seats sold in the EU must comply with Regulation R129 (i-Size), which provides improved head and neck protection compared to the older R44 standard."
      },
      {
        q: "A driver of a Category B vehicle towing any trailer, caravan, or horsebox faces a vehicle speed limit of:",
        options: ["65km/h on all roads", "80km/h on all roads", "100km/h on motorways only", "No specific limit applies"],
        correct: 1,
        explain: "Any Category B vehicle towing a trailer, caravan, horsebox, or similar attachment is limited to 80km/h on all roads."
      },
      {
        q: "The Stage 2 ADI practical driving skills test for Category B lasts approximately how long and covers what distance?",
        options: ["20 minutes and 10km", "About an hour and up to 30km", "3 hours and 100km", "10 minutes and 2km"],
        correct: 1,
        explain: "The ADI practical driving skills test is a test of safe, responsible driving lasting about an hour and covering up to 30 kilometres."
      },
      {
        q: "A driver may apply for a third (or subsequent) Category B learner permit only if they can show:",
        options: ["No special condition applies — permits renew automatically", "They applied to sit their driving test within the previous two years, or have a valid medical reason for not doing so", "They've completed a refresher EDT course", "They are under 25 years of age"],
        correct: 1,
        explain: "To get a third or subsequent learner permit, an applicant must show they applied to sit their driving test within the previous two years, or provide medical evidence for why they could not."
      },
      {
        q: "Driver CPC (Certificate of Professional Competence) is required for which categories, and NOT for Category B?",
        options: ["Professional bus categories (D1, D1E, D, DE) and truck categories (C1, C1E, C, CE)", "Category B and BE only", "Category AM only", "All categories, including B"],
        correct: 0,
        explain: "Driver CPC applies to professional bus and truck drivers in categories D1/D1E/D/DE and C1/C1E/C/CE — it does not apply to Category B."
      },
      {
        q: "Under the Reduced EDT programme (for eligible foreign licence holders switching to Category B), which specific EDT sessions must be completed?",
        options: ["All 12 sessions, no reduction possible", "Sessions 1, 5, 6, 7, 9, and 10", "Only session 1", "Sessions chosen at the learner's discretion"],
        correct: 1,
        explain: "Eligible drivers on the Reduced EDT programme must complete specific sessions — 1, 5, 6, 7, 9, and 10 — rather than the full set of 12."
      },
      {
        q: "The six-month waiting period before a first-time Category B learner can sit their driving test does NOT apply to:",
        options: ["Anyone who requests an exception verbally", "A holder of a current full driving licence from another country for more than six months, who forwards the required documentation", "Learners who complete EDT early", "There are no exceptions to this rule"],
        correct: 1,
        explain: "One recognised exception is for holders of a current full licence from another country (held over six months), provided they forward a current original licence and a letter of entitlement from the relevant licensing authority."
      },
      {
        q: "For Category B (car) driving tests, direct observation is required during which manoeuvre?",
        options: ["Parking only", "The reverse manoeuvre", "Moving off in a straight line only", "Direct observation is never required for Category B"],
        correct: 1,
        explain: "On Category B (car) tests, direct observations — checking front, sides, and rear including blind spots — are specifically required during the reverse manoeuvre."
      },
      {
        q: "A Category B vehicle's normal driving lane on a dual carriageway should be:",
        options: ["The right-hand (outer) lane at all times", "The left-hand lane, using the outer lane only for overtaking or an imminent right turn", "Whichever lane has less traffic", "The hard shoulder"],
        correct: 1,
        explain: "Category B drivers must normally use the left-hand lane on a dual carriageway, only moving to the outer lane to overtake or when about to turn right."
      },
      {
        q: "Which of these vehicles would typically be classed under Category W rather than Category B?",
        options: ["A family hatchback", "A land tractor used on a farm", "A small 4x4 SUV", "A standard passenger car"],
        correct: 1,
        explain: "Category W specifically covers work vehicles and land tractors, distinct from the general passenger/car vehicles covered by Category B."
      },
      {
        q: "A Category B learner permit holder wishing to tow a trailer:",
        options: ["May do so freely, same as a full licence holder", "Must not tow a trailer at all while on a learner permit", "May tow only trailers under 100kg", "May tow if accompanied by any adult passenger"],
        correct: 1,
        explain: "Learner permit holders in Categories B, C, C1, D, or D1 must not tow a trailer at all, regardless of the trailer's weight."
      },
      {
        q: "For Category B EDT purposes, who is responsible for tracking a learner's supervised practice sessions outside formal lessons?",
        options: ["The RSA directly, with no other party involved", "The Sponsor, who tracks practice sessions in the learner's logbook", "The local Garda station", "No tracking is required for practice sessions"],
        correct: 1,
        explain: "A Sponsor supervises driving practice outside of formal ADI lessons and is responsible for tracking these sessions in the learner's EDT logbook."
      },
      {
        q: "A Category B vehicle's trailer, when towed under a standard full B licence (not BE), must have a MAM not greater than:",
        options: ["500kg", "750kg", "1,000kg", "1,500kg"],
        correct: 1,
        explain: "Under a standard full Category B licence, the trailer's MAM must not exceed 750kg (unless the combined vehicle-and-trailer MAM stays within 3,500kg)."
      }
    ]
  }
];

export default CATEGORIES;
