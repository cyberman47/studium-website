export type ClinicalCase = {
  id: string;
  title: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  stem: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export const clinicalCases: ClinicalCase[] = [
  {
    id: "inferior-mi",
    title: "Chest Pain After Exertion",
    category: "Cardiology",
    difficulty: "Intermediate",
    stem: "A 58-year-old man presents to the ED with 30 minutes of crushing substernal chest pain radiating to his left arm, associated with diaphoresis and nausea. His ECG shows ST-segment elevation in leads II, III, and aVF.",
    question: "Which coronary artery is most likely occluded?",
    options: ["Left anterior descending artery", "Right coronary artery", "Circumflex artery", "Left main artery"],
    correctIndex: 1,
    explanation: "ST elevation in the inferior leads (II, III, aVF) reflects an inferior wall infarction, which is supplied by the right coronary artery in roughly 80–90% of people."
  },
  {
    id: "thunderclap-headache",
    title: "The Worst Headache of Her Life",
    category: "Neurology",
    difficulty: "Advanced",
    stem: "A 42-year-old woman presents with the 'worst headache of her life,' sudden onset, reaching maximum intensity within seconds. She has photophobia and neck stiffness but no focal neurologic deficits. A non-contrast CT of the head is unremarkable.",
    question: "What is the most appropriate next step?",
    options: ["Discharge home with analgesics", "Lumbar puncture to look for xanthochromia", "Outpatient MRI in one week", "Start triptan therapy"],
    correctIndex: 1,
    explanation: "This is a classic subarachnoid hemorrhage presentation. CT sensitivity drops after 6–12 hours, so a lumbar puncture looking for xanthochromia is the next step when CT is negative but suspicion remains high."
  },
  {
    id: "postpartum-pe",
    title: "Sudden Breathlessness Postpartum",
    category: "Pulmonology",
    difficulty: "Intermediate",
    stem: "A 34-year-old woman, 2 weeks postpartum, presents with sudden-onset pleuritic chest pain and shortness of breath. Heart rate is 118 bpm, and SpO2 is 91% on room air. She has unilateral calf swelling.",
    question: "What is the most likely diagnosis?",
    options: ["Community-acquired pneumonia", "Pulmonary embolism", "Panic attack", "Spontaneous pneumothorax"],
    correctIndex: 1,
    explanation: "The postpartum period is hypercoagulable. Pleuritic pain, tachycardia, hypoxia, and signs of a DVT (calf swelling) together point strongly to pulmonary embolism."
  },
  {
    id: "migrating-abdominal-pain",
    title: "Migrating Abdominal Pain",
    category: "Gastroenterology",
    difficulty: "Beginner",
    stem: "A 21-year-old man presents with periumbilical pain that migrated to the right lower quadrant over 12 hours, along with anorexia and a low-grade fever. He has rebound tenderness at McBurney's point.",
    question: "What is the most likely diagnosis?",
    options: ["Acute pancreatitis", "Acute appendicitis", "Mesenteric adenitis", "Ovarian torsion"],
    correctIndex: 1,
    explanation: "Periumbilical pain migrating to the RLQ with anorexia, low-grade fever, and McBurney's point tenderness is the textbook presentation of acute appendicitis."
  },
  {
    id: "dka-management",
    title: "Vomiting and Deep Breathing",
    category: "Endocrinology",
    difficulty: "Intermediate",
    stem: "A 19-year-old woman with type 1 diabetes presents with 2 days of nausea, vomiting, and abdominal pain. She appears dehydrated with deep, rapid breathing. Glucose is 480 mg/dL and serum bicarbonate is 10 mEq/L.",
    question: "What is the most appropriate initial management step?",
    options: ["Give an IV insulin bolus immediately", "Start IV isotonic fluids first, then insulin", "Encourage oral rehydration only", "Give IV sodium bicarbonate"],
    correctIndex: 1,
    explanation: "In DKA, fluid resuscitation comes first to restore perfusion and help correct the metabolic derangement, with insulin therapy started shortly after. Bicarbonate is reserved for severe, refractory acidosis."
  },
  {
    id: "meningococcemia",
    title: "Fever, Stiff Neck, and a Rash",
    category: "Infectious Disease",
    difficulty: "Advanced",
    stem: "A 24-year-old college student presents with fever, severe headache, neck stiffness, and photophobia for 6 hours. He appears toxic, and a petechial rash is noted on his trunk and legs.",
    question: "What is the most appropriate immediate action?",
    options: ["Wait for lumbar puncture results before treating", "Start empiric IV antibiotics immediately", "Discharge with oral antibiotics", "Order an outpatient MRI"],
    correctIndex: 1,
    explanation: "This presentation is concerning for meningococcal meningitis, a life-threatening emergency. Empiric antibiotics should be started immediately and never delayed for imaging or lumbar puncture."
  },
  {
    id: "podagra",
    title: "Sudden Big Toe Pain",
    category: "Rheumatology",
    difficulty: "Beginner",
    stem: "A 55-year-old man presents with sudden, severe pain and swelling of his right first metatarsophalangeal joint that woke him from sleep. The joint is red, warm, and exquisitely tender. He drinks alcohol regularly.",
    question: "Which finding on joint aspiration would confirm the diagnosis?",
    options: ["Needle-shaped, negatively birefringent crystals", "Rhomboid, positively birefringent crystals", "Gram-positive cocci in clusters", "Elevated white count with no crystals"],
    correctIndex: 0,
    explanation: "This is classic podagra from gout. Monosodium urate crystals are needle-shaped and negatively birefringent, distinguishing gout from pseudogout (rhomboid, positively birefringent CPPD crystals)."
  },
  {
    id: "irregularly-irregular",
    title: "Palpitations and an Irregular Pulse",
    category: "Cardiology",
    difficulty: "Beginner",
    stem: "A 67-year-old woman presents with palpitations and mild dyspnea for the past 3 hours. Her pulse is irregularly irregular at 132 bpm. ECG shows no discernible P waves with an irregular ventricular response.",
    question: "What is the most likely diagnosis?",
    options: ["Atrial fibrillation", "Ventricular tachycardia", "Sinus tachycardia", "Atrial flutter with fixed block"],
    correctIndex: 0,
    explanation: "An irregularly irregular rhythm with absent P waves is the hallmark of atrial fibrillation."
  },
  {
    id: "vasovagal-syncope",
    title: "Fainting in a Crowded Room",
    category: "Neurology",
    difficulty: "Beginner",
    stem: "A 19-year-old man faints after standing for a long time at a crowded event. He reports nausea and tunnel vision just before losing consciousness and recovered quickly afterward with no confusion. He has no cardiac history.",
    question: "What is the most likely cause of his syncope?",
    options: ["Ventricular arrhythmia", "Vasovagal syncope", "Orthostatic hypotension from medication", "Seizure"],
    correctIndex: 1,
    explanation: "Prolonged standing, a clear prodrome of nausea and tunnel vision, and rapid recovery without confusion are typical of vasovagal (reflex) syncope."
  },
  {
    id: "necrotizing-fasciitis",
    title: "Pain Out of Proportion to Exam",
    category: "Dermatology",
    difficulty: "Advanced",
    stem: "A 48-year-old man with diabetes presents with a rapidly spreading, exquisitely painful red area on his leg, with pain out of proportion to the exam findings. He is febrile, and crepitus is palpable over the area.",
    question: "What is the most likely diagnosis?",
    options: ["Simple cellulitis", "Necrotizing fasciitis", "Contact dermatitis", "Deep vein thrombosis"],
    correctIndex: 1,
    explanation: "Pain out of proportion to exam findings plus crepitus (gas in the tissue) points to necrotizing fasciitis—a surgical emergency requiring urgent debridement."
  }
];

function toDateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function getTodayDateKey(): string {
  return toDateKey(new Date());
}

// ---- Custom cases (Admin) ----
// Same pattern as custom terms in lib/terminology.ts: built-in cases above
// are static code, not database rows. Admin-created cases live in their own
// localStorage layer and are merged in via getAllCases()/getCaseOfTheDay(),
// so a case built in the admin editor is genuinely schedulable, previewable,
// and browsable everywhere a real case is—not a decorative mockup.
export type CustomCase = ClinicalCase & { createdAt: string };

const CUSTOM_CASES_KEY = "studium_custom_cases";
export const CUSTOM_CASES_EVENT = "studium:customCasesChange";

function getCustomCasesRaw(): CustomCase[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(CUSTOM_CASES_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function getCustomCases(): CustomCase[] {
  return getCustomCasesRaw();
}

export function isCustomCase(caseId: string): boolean {
  return getCustomCasesRaw().some(c => c.id === caseId);
}

function slugifyCaseId(title: string): string {
  return title.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

// The single source of truth every real consumer should read from—built-in
// (static) cases plus whatever an admin has authored this browser.
export function getAllCases(): ClinicalCase[] {
  return [...clinicalCases, ...getCustomCasesRaw()];
}

export function getCase(caseId: string): ClinicalCase | undefined {
  return getAllCases().find(c => c.id === caseId);
}

export function addCustomCase(input: Omit<ClinicalCase, "id"> & { id?: string }): { ok: true; case: CustomCase } | { ok: false; error: string } {
  if (typeof window === "undefined") return { ok: false, error: "Not available" };
  if (!input.title.trim()) return { ok: false, error: "Title is required." };
  if (!input.stem.trim()) return { ok: false, error: "Case stem is required." };
  if (!input.question.trim()) return { ok: false, error: "Question is required." };
  if (input.options.filter(o => o.trim()).length < 2) return { ok: false, error: "At least 2 answer options are required." };
  if (input.correctIndex < 0 || input.correctIndex >= input.options.length) return { ok: false, error: "Correct answer index is out of range." };
  const id = input.id?.trim() || slugifyCaseId(input.title);
  if (!id) return { ok: false, error: "Couldn't derive a valid id from that title." };
  if (getAllCases().some(c => c.id === id)) return { ok: false, error: `A case with id "${id}" already exists.` };
  const newCase: CustomCase = { ...input, id, createdAt: new Date().toISOString() };
  const next = [...getCustomCasesRaw(), newCase];
  localStorage.setItem(CUSTOM_CASES_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent(CUSTOM_CASES_EVENT));
  return { ok: true, case: newCase };
}

export function updateCustomCase(caseId: string, updates: Partial<Omit<ClinicalCase, "id">>): { ok: true } | { ok: false; error: string } {
  if (typeof window === "undefined") return { ok: false, error: "Not available" };
  const existing = getCustomCasesRaw();
  const idx = existing.findIndex(c => c.id === caseId);
  if (idx === -1) return { ok: false, error: "Only admin-created custom cases can be edited—built-in cases are static code." };
  const updated = { ...existing[idx], ...updates };
  const next = [...existing];
  next[idx] = updated;
  localStorage.setItem(CUSTOM_CASES_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent(CUSTOM_CASES_EVENT));
  return { ok: true };
}

export function removeCustomCase(caseId: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CUSTOM_CASES_KEY, JSON.stringify(getCustomCasesRaw().filter(c => c.id !== caseId)));
  window.dispatchEvent(new CustomEvent(CUSTOM_CASES_EVENT));
}

// ---- Admin override ----
// Real, not decorative: the admin panel's "Trigger Today's Swap" writes
// here, and this is genuinely what every page that shows "today's case"
// (Home, Library, Case of the Day) reads. There's no real backend to swap
// a database row, so this is the honest equivalent—a forced override that
// actually changes what every user of this browser sees as today's case,
// scoped to only apply to *today* so historical/future lookups are
// unaffected.
const CASE_OVERRIDE_KEY = "studium_admin_case_override";

export function getCaseOverride(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(CASE_OVERRIDE_KEY);
}

export function setCaseOverride(caseId: string | null) {
  if (typeof window === "undefined") return;
  if (caseId) localStorage.setItem(CASE_OVERRIDE_KEY, caseId);
  else localStorage.removeItem(CASE_OVERRIDE_KEY);
}

export function getCaseOfTheDay(date: Date = new Date()): ClinicalCase {
  const allCases = getAllCases();
  if (toDateKey(date) === getTodayDateKey()) {
    const overrideId = getCaseOverride();
    const overridden = overrideId ? allCases.find(c => c.id === overrideId) : undefined;
    if (overridden) return overridden;
  }
  const dayIndex = Math.floor(date.getTime() / 86400000);
  const index = ((dayIndex % allCases.length) + allCases.length) % allCases.length;
  return allCases[index];
}

// The date this case will next appear "for real" (i.e. as the deterministic
// rotation pick, ignoring any admin override)—used by the admin panel to
// show a genuine upcoming schedule instead of a fabricated one.
export function getNextScheduledDate(caseId: string): Date | null {
  const allCases = getAllCases();
  const index = allCases.findIndex(c => c.id === caseId);
  if (index === -1) return null;
  const todayIndex = Math.floor(new Date().getTime() / 86400000);
  const todayMod = ((todayIndex % allCases.length) + allCases.length) % allCases.length;
  const daysAhead = (index - todayMod + allCases.length) % allCases.length;
  return new Date(Date.now() + daysAhead * 86400000);
}

export type CaseAttempt = { caseId: string; selectedIndex: number; correct: boolean };

const CASE_PROGRESS_KEY = "studium_case_progress";

function getCaseProgressMap(): Record<string, CaseAttempt> {
  if (typeof window === "undefined") return {};
  const raw = localStorage.getItem(CASE_PROGRESS_KEY);
  return raw ? JSON.parse(raw) : {};
}

export function getTodayCaseAttempt(): CaseAttempt | null {
  return getCaseProgressMap()[getTodayDateKey()] ?? null;
}

// Every real attempt this browser has ever submitted (one per day, keyed by
// date internally)—used by the admin Analytics page to compute genuine
// "most missed" stats instead of a single day's snapshot.
export function getAllCaseAttempts(): CaseAttempt[] {
  return Object.values(getCaseProgressMap());
}

// Same real map, keyed by date—for the Library's Past Cases calendar, which
// needs to know *which* day each attempt happened on, not just the list.
export function getCaseAttemptsByDate(): Record<string, CaseAttempt> {
  return getCaseProgressMap();
}

// Consecutive real days, walking back from today, with a logged attempt—
// counts showing up (any attempt), not just correct answers, same spirit as
// a daily-puzzle streak. A day with no attempt breaks the chain immediately.
export function getCaseStreak(): number {
  const map = getCaseProgressMap();
  let streak = 0;
  const cursor = new Date();
  while (map[toDateKey(cursor)]) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function submitCaseAnswer(caseId: string, selectedIndex: number): CaseAttempt {
  const todaysCase = getCaseOfTheDay();
  const attempt: CaseAttempt = { caseId, selectedIndex, correct: caseId === todaysCase.id && selectedIndex === todaysCase.correctIndex };
  if (typeof window !== "undefined") {
    const map = getCaseProgressMap();
    map[getTodayDateKey()] = attempt;
    localStorage.setItem(CASE_PROGRESS_KEY, JSON.stringify(map));
  }
  return attempt;
}
