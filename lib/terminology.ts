import { claimTerminologyGoal, ClaimResult, logFlashcards } from "./progress";

// ---- Categories & terms ----

export type TermCategory = { id: string; name: string };

export const termCategories: TermCategory[] = [
  { id: "anatomy", name: "Anatomy Terms" },
  { id: "biology", name: "Biology Terms" },
  { id: "microbiology", name: "Microbiology Terms" },
  { id: "pharmacology", name: "Pharmacology Terms" },
  { id: "pathology", name: "Pathology Terms" },
  { id: "clinical", name: "Clinical Terms" },
  { id: "abbreviations", name: "Medical Abbreviations" }
];

export type WordPart = { part: string; meaning: string };

export type Term = {
  id: string;
  categoryId: string;
  name: string;
  definition: string;
  wordBreakdown: WordPart[];
  relatedTermIds: string[];
  aiExplanation: string;
  exampleSentence: string;
};

export const terms: Term[] = [
  {
    id: "myocardium",
    categoryId: "anatomy",
    name: "Myocardium",
    definition: "The muscular tissue of the heart responsible for contraction.",
    wordBreakdown: [{ part: "Myo-", meaning: "muscle" }, { part: "Cardium (cardio)", meaning: "heart" }],
    relatedTermIds: ["endocardium", "pericardium"],
    aiExplanation: "The myocardium is the heart's muscle layer that contracts to pump blood.",
    exampleSentence: "The infarct had damaged a large section of the myocardium."
  },
  {
    id: "endocardium",
    categoryId: "anatomy",
    name: "Endocardium",
    definition: "The smooth inner layer lining the chambers and valves of the heart.",
    wordBreakdown: [{ part: "Endo-", meaning: "inner, within" }, { part: "Cardium (cardio)", meaning: "heart" }],
    relatedTermIds: ["myocardium", "pericardium"],
    aiExplanation: "The endocardium is the smooth inner lining that blood directly touches as it moves through the heart.",
    exampleSentence: "Bacteria settled on a heart valve, causing endocarditis, an infection of the endocardium."
  },
  {
    id: "pericardium",
    categoryId: "anatomy",
    name: "Pericardium",
    definition: "The double-layered membranous sac that surrounds and protects the heart.",
    wordBreakdown: [{ part: "Peri-", meaning: "around" }, { part: "Cardium (cardio)", meaning: "heart" }],
    relatedTermIds: ["myocardium", "endocardium"],
    aiExplanation: "The pericardium is a protective sac that wraps around the heart and reduces friction as it beats.",
    exampleSentence: "Fluid accumulated between the layers of the pericardium, causing a pericardial effusion."
  },
  {
    id: "osteoporosis",
    categoryId: "anatomy",
    name: "Osteoporosis",
    definition: "A condition of reduced bone density that makes bones fragile and prone to fracture.",
    wordBreakdown: [{ part: "Osteo-", meaning: "bone" }, { part: "-porosis", meaning: "porous condition" }],
    relatedTermIds: ["osteoblast", "osteoclast"],
    aiExplanation: "Osteoporosis means your bones have become thinner and weaker than normal, making them easier to break.",
    exampleSentence: "Her DEXA scan confirmed osteoporosis, putting her at high risk for a hip fracture."
  },
  {
    id: "osteoblast",
    categoryId: "anatomy",
    name: "Osteoblast",
    definition: "A cell responsible for building new bone tissue.",
    wordBreakdown: [{ part: "Osteo-", meaning: "bone" }, { part: "-blast", meaning: "immature, building cell" }],
    relatedTermIds: ["osteoclast", "osteoporosis"],
    aiExplanation: "An osteoblast is a cell that builds new bone, like a construction worker for your skeleton.",
    exampleSentence: "Osteoblasts were actively laying down new bone matrix at the fracture site."
  },
  {
    id: "osteoclast",
    categoryId: "anatomy",
    name: "Osteoclast",
    definition: "A cell that breaks down (resorbs) bone tissue.",
    wordBreakdown: [{ part: "Osteo-", meaning: "bone" }, { part: "-clast", meaning: "to break" }],
    relatedTermIds: ["osteoblast", "osteoporosis"],
    aiExplanation: "An osteoclast is a cell that breaks down old bone, working opposite osteoblasts to keep bone in balance.",
    exampleSentence: "Increased osteoclast activity was resorbing bone faster than it could be replaced."
  },
  {
    id: "neuroglia",
    categoryId: "anatomy",
    name: "Neuroglia",
    definition: "Supportive cells of the nervous system that protect, insulate, and nourish neurons.",
    wordBreakdown: [{ part: "Neuro-", meaning: "nerve" }, { part: "-glia", meaning: "glue" }],
    relatedTermIds: ["axon", "dendrite"],
    aiExplanation: "Neuroglia are the support cells that protect, feed, and insulate neurons, without transmitting signals themselves.",
    exampleSentence: "Neuroglia outnumber neurons in the brain but don't transmit electrical signals themselves."
  },
  {
    id: "axon",
    categoryId: "anatomy",
    name: "Axon",
    definition: "The long projection of a neuron that transmits electrical impulses away from the cell body.",
    wordBreakdown: [{ part: "Axon", meaning: "axis (Greek)" }],
    relatedTermIds: ["dendrite", "neuroglia"],
    aiExplanation: "An axon is like a wire that carries a nerve signal away from the neuron toward the next cell.",
    exampleSentence: "The axon extended over a meter, carrying signals from the spinal cord to the foot."
  },
  {
    id: "dendrite",
    categoryId: "anatomy",
    name: "Dendrite",
    definition: "A branched extension of a neuron that receives signals from other neurons.",
    wordBreakdown: [{ part: "Dendr-", meaning: "tree" }, { part: "-ite", meaning: "small, resembling" }],
    relatedTermIds: ["axon", "neuroglia"],
    aiExplanation: "Dendrites are the branches of a neuron that receive incoming signals from other neurons.",
    exampleSentence: "Dendrites on the neuron received signals from dozens of neighboring cells."
  },
  {
    id: "peritoneum",
    categoryId: "anatomy",
    name: "Peritoneum",
    definition: "The membrane lining the abdominal cavity and covering most of the abdominal organs.",
    wordBreakdown: [{ part: "Peri-", meaning: "around" }, { part: "-toneum (tonos)", meaning: "stretched" }],
    relatedTermIds: ["diaphragm"],
    aiExplanation: "The peritoneum is a thin membrane that lines your belly and wraps around most abdominal organs.",
    exampleSentence: "Inflammation of the peritoneum, or peritonitis, caused severe abdominal rigidity."
  },
  {
    id: "diaphragm",
    categoryId: "anatomy",
    name: "Diaphragm",
    definition: "The dome-shaped muscle beneath the lungs that drives breathing.",
    wordBreakdown: [{ part: "Dia-", meaning: "across" }, { part: "-phragma", meaning: "fence, wall" }],
    relatedTermIds: ["peritoneum", "cranium"],
    aiExplanation: "The diaphragm is the main muscle you use to breathe—it flattens when you inhale and relaxes when you exhale.",
    exampleSentence: "The diaphragm contracted and flattened with each inhalation."
  },
  {
    id: "cranium",
    categoryId: "anatomy",
    name: "Cranium",
    definition: "The part of the skull that encloses and protects the brain.",
    wordBreakdown: [{ part: "Cranium", meaning: "skull (Greek: kranion)" }],
    relatedTermIds: ["diaphragm"],
    aiExplanation: "The cranium is the bony case that surrounds and protects your brain.",
    exampleSentence: "The CT scan showed no fractures of the cranium."
  },
  {
    id: "myocardial-infarction",
    categoryId: "clinical",
    name: "Myocardial Infarction",
    definition: "Damage to heart muscle caused by a sudden loss of blood supply, commonly called a heart attack.",
    wordBreakdown: [{ part: "Myo-", meaning: "muscle" }, { part: "Cardio-", meaning: "heart" }, { part: "Infarction", meaning: "tissue death from lost blood supply" }],
    relatedTermIds: ["myocardium", "atherosclerosis"],
    aiExplanation: "A myocardial infarction happens when blood flow to part of the heart muscle is blocked, so that tissue starts to die from lack of oxygen.",
    exampleSentence: "He was diagnosed with a myocardial infarction after presenting with crushing chest pain and ST elevation."
  },
  {
    id: "arrhythmia",
    categoryId: "clinical",
    name: "Arrhythmia",
    definition: "An abnormal heart rhythm, where the heart beats too fast, too slow, or irregularly.",
    wordBreakdown: [{ part: "A-", meaning: "without" }, { part: "Rhythmia (rhythmos)", meaning: "rhythm" }],
    relatedTermIds: ["myocardial-infarction"],
    aiExplanation: "An arrhythmia is when your heart's electrical signals misfire, causing it to beat out of its normal steady rhythm.",
    exampleSentence: "The irregular pulse on exam turned out to be an arrhythmia caused by atrial fibrillation."
  },
  {
    id: "atherosclerosis",
    categoryId: "clinical",
    name: "Atherosclerosis",
    definition: "A buildup of fatty plaques inside artery walls that narrows and stiffens the arteries over time.",
    wordBreakdown: [{ part: "Athero-", meaning: "porridge, gruel (plaque)" }, { part: "Sclerosis", meaning: "hardening" }],
    relatedTermIds: ["myocardial-infarction"],
    aiExplanation: "Atherosclerosis is a slow buildup of fatty deposits inside artery walls that narrows them and can eventually block blood flow.",
    exampleSentence: "Decades of atherosclerosis had narrowed his coronary arteries significantly."
  },
  {
    id: "diabetes",
    categoryId: "clinical",
    name: "Diabetes",
    definition: "A chronic condition in which the body cannot properly regulate blood glucose, due to insufficient insulin production, insulin resistance, or both.",
    wordBreakdown: [{ part: "Dia-", meaning: "through" }, { part: "-betes", meaning: "to pass (Greek: diabainein, to pass through)" }],
    relatedTermIds: ["atherosclerosis"],
    aiExplanation: "Diabetes means the body struggles to keep blood sugar in a normal range, either because it doesn't make enough insulin or its cells don't respond to insulin properly.",
    exampleSentence: "His poorly controlled diabetes was a major risk factor for the infection."
  },
  {
    id: "febrile",
    categoryId: "clinical",
    name: "Febrile",
    definition: "Having a fever; showing an elevated body temperature, typically due to infection or inflammation.",
    wordBreakdown: [{ part: "Febr-", meaning: "fever (Latin: febris)" }, { part: "-ile", meaning: "pertaining to" }],
    relatedTermIds: ["afebrile", "pyrexia", "hyperthermia"],
    aiExplanation: "A febrile patient has a fever, usually because the body is responding to an infection or inflammation.",
    exampleSentence: "The patient was febrile with a temperature of 39.2°C."
  },
  {
    id: "afebrile",
    categoryId: "clinical",
    name: "Afebrile",
    definition: "Without fever; having a normal body temperature.",
    wordBreakdown: [{ part: "A-", meaning: "without" }, { part: "Febr-", meaning: "fever" }, { part: "-ile", meaning: "pertaining to" }],
    relatedTermIds: ["febrile"],
    aiExplanation: "Afebrile simply means the opposite of febrile—no fever, temperature within the normal range.",
    exampleSentence: "By the third hospital day, he was afebrile and clinically improving."
  },
  {
    id: "pyrexia",
    categoryId: "clinical",
    name: "Pyrexia",
    definition: "Another medical term for fever; an elevated body temperature above the normal range.",
    wordBreakdown: [{ part: "Pyr-", meaning: "fire, heat (Greek: pyr)" }, { part: "-exia", meaning: "condition" }],
    relatedTermIds: ["febrile", "hyperthermia"],
    aiExplanation: "Pyrexia is just another word for fever—it's used interchangeably with 'febrile' in clinical notes.",
    exampleSentence: "The nursing note documented pyrexia of 38.6°C overnight."
  },
  {
    id: "hyperthermia",
    categoryId: "clinical",
    name: "Hyperthermia",
    definition: "An abnormally high body temperature caused by the body's failure to regulate heat, rather than the immune system resetting its temperature set point as in fever.",
    wordBreakdown: [{ part: "Hyper-", meaning: "above, excessive" }, { part: "-thermia", meaning: "heat condition" }],
    relatedTermIds: ["febrile", "pyrexia"],
    aiExplanation: "Unlike a fever, hyperthermia isn't the immune system raising the body's 'thermostat'—it's the body overheating faster than it can cool down, as in heat stroke.",
    exampleSentence: "The marathon runner was brought in with hyperthermia and confusion after collapsing in the heat."
  },
  {
    id: "crepitus",
    categoryId: "clinical",
    name: "Crepitus",
    definition: "A crackling or grating sensation or sound, often felt or heard on palpation of tissue containing gas, or in joints with cartilage damage.",
    wordBreakdown: [{ part: "Crepitus", meaning: "a rattling, creaking (Latin: crepare, to crackle)" }],
    relatedTermIds: ["palpable"],
    aiExplanation: "Crepitus feels like a crackling under the skin—when it's from gas trapped in soft tissue, it's a red flag for a serious infection.",
    exampleSentence: "Crepitus was palpable over the affected area, raising concern for a gas-forming infection."
  },
  {
    id: "palpable",
    categoryId: "clinical",
    name: "Palpable",
    definition: "Able to be felt by touch during a physical examination.",
    wordBreakdown: [{ part: "Palp-", meaning: "to touch, feel (Latin: palpare)" }, { part: "-able", meaning: "capable of" }],
    relatedTermIds: ["crepitus"],
    aiExplanation: "If something is palpable, a clinician can feel it directly with their hands during an exam—like a lump, a pulse, or crepitus.",
    exampleSentence: "A palpable mass was noted in the right upper quadrant on abdominal exam."
  },
  {
    id: "tachycardia",
    categoryId: "clinical",
    name: "Tachycardia",
    definition: "An abnormally fast heart rate, typically defined as greater than 100 beats per minute in adults.",
    wordBreakdown: [{ part: "Tachy-", meaning: "fast" }, { part: "-cardia", meaning: "heart condition" }],
    relatedTermIds: ["bradycardia", "arrhythmia"],
    aiExplanation: "Tachycardia just means the heart is beating faster than normal—it can be a normal response to exercise or stress, or a sign of an underlying problem.",
    exampleSentence: "Her heart rate was 132 bpm, consistent with tachycardia."
  },
  {
    id: "bradycardia",
    categoryId: "clinical",
    name: "Bradycardia",
    definition: "An abnormally slow heart rate, typically defined as fewer than 60 beats per minute in adults.",
    wordBreakdown: [{ part: "Brady-", meaning: "slow" }, { part: "-cardia", meaning: "heart condition" }],
    relatedTermIds: ["tachycardia", "arrhythmia"],
    aiExplanation: "Bradycardia means the heart is beating slower than normal—it can be totally normal in athletes, or a sign of a conduction problem elsewhere.",
    exampleSentence: "His resting heart rate of 45 bpm was diagnostic of bradycardia."
  }
];

export function getTermsByCategory(categoryId: string): Term[] {
  return terms.filter(t => t.categoryId === categoryId);
}

export function getTerm(termId: string): Term | undefined {
  return terms.find(t => t.id === termId);
}

export function findTermCategory(categoryId: string): TermCategory | undefined {
  return termCategories.find(c => c.id === categoryId);
}

// ---- Word Builder roots ----

export type WordRoot = { id: string; part: string; meaning: string; examples: string[] };

export const wordRoots: WordRoot[] = [
  { id: "hyper", part: "Hyper-", meaning: "above, excessive", examples: ["Hypertension", "Hyperglycemia", "Hyperthyroidism"] },
  { id: "hypo", part: "Hypo-", meaning: "below, deficient", examples: ["Hypotension", "Hypoglycemia", "Hypothyroidism"] },
  { id: "neuro", part: "Neuro-", meaning: "nerve", examples: ["Neurology", "Neuropathy", "Neuroscience"] },
  { id: "cardio", part: "Cardio-", meaning: "heart", examples: ["Cardiology", "Cardiomyopathy", "Cardiovascular"] },
  { id: "osteo", part: "Osteo-", meaning: "bone", examples: ["Osteoporosis", "Osteoarthritis", "Osteomyelitis"] },
  { id: "myo", part: "Myo-", meaning: "muscle", examples: ["Myocardium", "Myopathy", "Myalgia"] },
  { id: "itis", part: "-itis", meaning: "inflammation", examples: ["Arthritis", "Bronchitis", "Dermatitis"] },
  { id: "ology", part: "-ology", meaning: "study of", examples: ["Cardiology", "Neurology", "Pathology"] },
  { id: "ectomy", part: "-ectomy", meaning: "surgical removal", examples: ["Appendectomy", "Tonsillectomy", "Mastectomy"] },
  { id: "otomy", part: "-otomy", meaning: "surgical incision", examples: ["Tracheotomy", "Craniotomy"] },
  { id: "pathy", part: "-pathy", meaning: "disease", examples: ["Neuropathy", "Cardiomyopathy", "Myopathy"] },
  { id: "brady", part: "Brady-", meaning: "slow", examples: ["Bradycardia", "Bradypnea"] },
  { id: "tachy", part: "Tachy-", meaning: "fast", examples: ["Tachycardia", "Tachypnea"] },
  { id: "dys", part: "Dys-", meaning: "difficult, abnormal", examples: ["Dysphagia", "Dyspnea", "Dysfunction"] },
  { id: "algia", part: "-algia", meaning: "pain", examples: ["Myalgia", "Neuralgia", "Arthralgia"] }
];

// ---- Spaced repetition progress (Leitner-style, 5 boxes) ----

const TERM_PROGRESS_KEY = "studium_term_progress";
const TERM_DAILY_KEY = "studium_term_daily";

export const DAILY_TERM_GOAL = 20;
const MAX_BOX = 5;
const boxIntervalDays = [1, 2, 4, 8, 16];

export type Rating = "easy" | "medium" | "hard";

export type TermProgressEntry = {
  box: number;
  nextReview: string;
  timesReviewed: number;
  lastRating: Rating | null;
  learnedAt: string;
};

function toDateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function addDays(d: Date, days: number): Date {
  const next = new Date(d);
  next.setDate(next.getDate() + days);
  return next;
}

function getProgressMap(): Record<string, TermProgressEntry> {
  if (typeof window === "undefined") return {};
  const raw = localStorage.getItem(TERM_PROGRESS_KEY);
  return raw ? JSON.parse(raw) : {};
}

function saveProgressMap(map: Record<string, TermProgressEntry>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TERM_PROGRESS_KEY, JSON.stringify(map));
}

export function getTermProgress(termId: string): TermProgressEntry | null {
  return getProgressMap()[termId] ?? null;
}

export function isTermLearned(termId: string): boolean {
  return !!getProgressMap()[termId];
}

export function isTermMastered(termId: string): boolean {
  return (getProgressMap()[termId]?.box ?? 0) >= MAX_BOX;
}

export function getLearnedTerms(): Term[] {
  const map = getProgressMap();
  return terms.filter(t => map[t.id]);
}

export function getMasteredCount(): number {
  return Object.values(getProgressMap()).filter(p => p.box >= MAX_BOX).length;
}

export function getDueTerms(): Term[] {
  const map = getProgressMap();
  const today = toDateKey(new Date());
  return terms.filter(t => {
    const p = map[t.id];
    return !!p && p.nextReview <= today;
  });
}

function getDailyMap(): Record<string, number> {
  if (typeof window === "undefined") return {};
  const raw = localStorage.getItem(TERM_DAILY_KEY);
  return raw ? JSON.parse(raw) : {};
}

function bumpDaily(): number {
  if (typeof window === "undefined") return 0;
  const map = getDailyMap();
  const today = toDateKey(new Date());
  map[today] = (map[today] ?? 0) + 1;
  localStorage.setItem(TERM_DAILY_KEY, JSON.stringify(map));
  return map[today];
}

export function getTodaysCount(): number {
  return getDailyMap()[toDateKey(new Date())] ?? 0;
}

function checkDailyGoal(): ClaimResult | null {
  return getTodaysCount() >= DAILY_TERM_GOAL ? claimTerminologyGoal() : null;
}

// Called from a term's page when the user saves it for review (Learn Mode).
export function learnTerm(termId: string): ClaimResult | null {
  if (typeof window === "undefined") return null;
  const map = getProgressMap();
  if (!map[termId]) {
    map[termId] = { box: 1, nextReview: toDateKey(addDays(new Date(), boxIntervalDays[0])), timesReviewed: 0, lastRating: null, learnedAt: toDateKey(new Date()) };
    saveProgressMap(map);
  }
  bumpDaily();
  logFlashcards(1);
  return checkDailyGoal();
}

// Called from Review Mode after the user rates a due term.
export function reviewTerm(termId: string, rating: Rating): ClaimResult | null {
  if (typeof window === "undefined") return null;
  const map = getProgressMap();
  const existing = map[termId] ?? { box: 1, nextReview: toDateKey(new Date()), timesReviewed: 0, lastRating: null, learnedAt: toDateKey(new Date()) };
  let box = existing.box;
  if (rating === "easy") box = Math.min(MAX_BOX, box + 1);
  else if (rating === "hard") box = 1;
  const interval = boxIntervalDays[Math.min(box, boxIntervalDays.length) - 1];
  map[termId] = { box, nextReview: toDateKey(addDays(new Date(), interval)), timesReviewed: existing.timesReviewed + 1, lastRating: rating, learnedAt: existing.learnedAt };
  saveProgressMap(map);
  bumpDaily();
  logFlashcards(1);
  return checkDailyGoal();
}

export type TerminologyStats = {
  totalLearned: number;
  masteredCount: number;
  dueForReview: number;
  masteryPercent: number;
  todayCount: number;
  dailyGoal: number;
};

export function getTerminologyStats(): TerminologyStats {
  const learned = getLearnedTerms();
  const mastered = getMasteredCount();
  return {
    totalLearned: learned.length,
    masteredCount: mastered,
    dueForReview: getDueTerms().length,
    masteryPercent: learned.length ? Math.round((mastered / learned.length) * 100) : 0,
    todayCount: getTodaysCount(),
    dailyGoal: DAILY_TERM_GOAL
  };
}

// ---- Confidence rating (Interactive Medical Terms) ----
// Lets a student self-rate a term straight from a highlighted-term panel. This
// writes into the same Leitner-box progress used everywhere else in Terminology,
// so "I Don't Know This Yet" genuinely resurfaces sooner in review/flashcard
// sessions, and "I Know This Well" pushes it further out—no separate system.

export type ConfidenceLevel = "know-well" | "somewhat" | "dont-know";

const confidenceBox: Record<ConfidenceLevel, number> = { "know-well": MAX_BOX, somewhat: 3, "dont-know": 1 };
const confidenceRating: Record<ConfidenceLevel, Rating> = { "know-well": "easy", somewhat: "medium", "dont-know": "hard" };

export function setTermConfidence(termId: string, level: ConfidenceLevel): ClaimResult | null {
  if (typeof window === "undefined") return null;
  const map = getProgressMap();
  const existing = map[termId] ?? { box: 1, nextReview: toDateKey(new Date()), timesReviewed: 0, lastRating: null, learnedAt: toDateKey(new Date()) };
  const box = confidenceBox[level];
  const interval = boxIntervalDays[Math.min(box, boxIntervalDays.length) - 1];
  map[termId] = { box, nextReview: toDateKey(addDays(new Date(), interval)), timesReviewed: existing.timesReviewed + 1, lastRating: confidenceRating[level], learnedAt: existing.learnedAt };
  saveProgressMap(map);
  bumpDaily();
  logFlashcards(1);
  return checkDailyGoal();
}

export function getTermConfidence(termId: string): ConfidenceLevel | null {
  const entry = getProgressMap()[termId];
  if (!entry || !entry.lastRating) return null;
  if (entry.lastRating === "easy") return "know-well";
  if (entry.lastRating === "hard") return "dont-know";
  return "somewhat";
}

// Forces a term to be due today, regardless of its current box—used by the
// "Add to Review Queue" action so it shows up in the very next review session.
export function queueForReview(termId: string) {
  if (typeof window === "undefined") return;
  const map = getProgressMap();
  const existing = map[termId] ?? { box: 1, nextReview: toDateKey(new Date()), timesReviewed: 0, lastRating: null, learnedAt: toDateKey(new Date()) };
  map[termId] = { ...existing, nextReview: toDateKey(new Date()) };
  saveProgressMap(map);
}

// ---- Term views (Interactive Medical Terms) ----

const TERM_VIEWS_KEY = "studium_term_views";

function getViewsMap(): Record<string, number> {
  if (typeof window === "undefined") return {};
  const raw = localStorage.getItem(TERM_VIEWS_KEY);
  return raw ? JSON.parse(raw) : {};
}

export function recordTermView(termId: string) {
  if (typeof window === "undefined") return;
  const map = getViewsMap();
  map[termId] = (map[termId] ?? 0) + 1;
  localStorage.setItem(TERM_VIEWS_KEY, JSON.stringify(map));
}

export function getTermViewCount(termId: string): number {
  return getViewsMap()[termId] ?? 0;
}

export function getTotalTermViews(): number {
  return Object.values(getViewsMap()).reduce((a, b) => a + b, 0);
}
