import { recordFlashcardsCreated, recordLessonCreated, recordMaterialUploaded, recordQuizCreated } from "./progress";

// ---- Sample document ----
// This whole feature is a demo walkthrough: there's no real AI backend to parse an
// arbitrary uploaded file, so every "analysis" and "generation" below runs against
// one hand-written sample document instead of whatever the user actually uploads.

export const sampleDocument = {
  fileName: "Cardiovascular System — Lecture Notes.pdf",
  pages: 42,
  keyConceptsFound: 87,
  importantTermsFound: 54,
  estimatedStudyMinutes: 95
};

export function registerUpload() {
  recordMaterialUploaded();
}

// ---- Sample flashcards ----

export type Difficulty = "Easy" | "Medium" | "Hard";
export type GeneratedFlashcard = { question: string; answer: string; difficulty: Difficulty };

export const sampleFlashcards: GeneratedFlashcard[] = [
  { question: "What is the primary function of the myocardium?", answer: "To contract and pump blood through the heart.", difficulty: "Easy" },
  { question: "What is the difference between systole and diastole?", answer: "Systole is the contraction phase that ejects blood; diastole is the relaxation phase that lets the chambers fill.", difficulty: "Medium" },
  { question: "Which layer of the heart directly lines the chambers?", answer: "The endocardium.", difficulty: "Easy" },
  { question: "What does the pericardium do?", answer: "It's a protective sac around the heart that reduces friction as it beats.", difficulty: "Easy" },
  { question: "What is atherosclerosis?", answer: "A buildup of fatty plaques inside artery walls that narrows and stiffens them over time.", difficulty: "Medium" },
  { question: "What typically causes a myocardial infarction?", answer: "A sudden blockage of blood flow to part of the heart muscle, often from a ruptured plaque.", difficulty: "Medium" },
  { question: "What is an arrhythmia?", answer: "An abnormal heart rhythm—too fast, too slow, or irregular.", difficulty: "Easy" },
  { question: "What are the four chambers of the heart?", answer: "Right atrium, right ventricle, left atrium, left ventricle.", difficulty: "Easy" },
  { question: "Which coronary artery most often supplies the inferior wall of the heart?", answer: "The right coronary artery.", difficulty: "Hard" },
  { question: "What is the role of the SA node?", answer: "It's the heart's natural pacemaker, initiating each normal heartbeat.", difficulty: "Medium" },
  { question: "What does 'tachycardia' mean?", answer: "An abnormally fast heart rate.", difficulty: "Easy" },
  { question: "Why is atherosclerosis dangerous?", answer: "Narrowed, stiffened arteries reduce blood flow and can rupture, triggering a heart attack or stroke.", difficulty: "Hard" }
];

export function saveFlashcardDeck(title: string, cards: GeneratedFlashcard[]): SavedDeck {
  const deck: SavedDeck = { id: `deck-${Date.now()}`, title, cards, createdAt: new Date().toISOString() };
  const decks = getDecks();
  decks.push(deck);
  saveDecks(decks);
  recordFlashcardsCreated(cards.length);
  return deck;
}

// ---- Sample quiz bank ----

export type QuestionType = "multiple-choice" | "true-false" | "short-answer" | "clinical-scenario";

export type GeneratedQuestion = {
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: Difficulty;
};

export const sampleQuizBank: GeneratedQuestion[] = [
  { type: "multiple-choice", question: "Which chamber of the heart pumps oxygenated blood to the body?", options: ["Right atrium", "Right ventricle", "Left atrium", "Left ventricle"], correctAnswer: "Left ventricle", explanation: "The left ventricle has the thickest muscular wall and generates the pressure needed to pump blood through the entire body.", difficulty: "Easy" },
  { type: "multiple-choice", question: "What is the heart's natural pacemaker?", options: ["AV node", "SA node", "Bundle of His", "Purkinje fibers"], correctAnswer: "SA node", explanation: "The sinoatrial (SA) node initiates the electrical impulse for each normal heartbeat.", difficulty: "Medium" },
  { type: "multiple-choice", question: "Atherosclerosis primarily involves buildup of what inside artery walls?", options: ["Blood clots only", "Fatty plaques", "Calcium alone", "Scar tissue only"], correctAnswer: "Fatty plaques", explanation: "Atherosclerosis is the gradual buildup of fatty (lipid) plaques within artery walls, which can calcify and harden over time.", difficulty: "Easy" },
  { type: "true-false", question: "True or False: Diastole is the contraction phase of the cardiac cycle.", correctAnswer: "False", explanation: "Diastole is the relaxation phase, when the heart's chambers fill with blood. Systole is the contraction phase.", difficulty: "Easy" },
  { type: "true-false", question: "True or False: The endocardium is the outermost layer of the heart.", correctAnswer: "False", explanation: "The endocardium is the innermost layer, lining the chambers and valves. The pericardium is the outermost protective sac.", difficulty: "Easy" },
  { type: "true-false", question: "True or False: Bradycardia refers to an abnormally slow heart rate.", correctAnswer: "True", explanation: "Brady- means slow, so bradycardia is a heart rate that is slower than normal.", difficulty: "Easy" },
  { type: "short-answer", question: "In one sentence, explain why atherosclerosis increases the risk of a heart attack.", correctAnswer: "Narrowed, plaque-filled arteries restrict blood flow and can rupture, forming a clot that blocks blood supply to the heart muscle.", explanation: "The key idea is that plaque buildup both restricts flow directly and creates a rupture risk that can trigger sudden blockage.", difficulty: "Medium" },
  { type: "short-answer", question: "What is the functional difference between an artery and a vein?", correctAnswer: "Arteries carry blood away from the heart under higher pressure; veins carry blood back to the heart under lower pressure and often have valves.", explanation: "This distinction is based on direction of flow and pressure, not on oxygenation—pulmonary arteries carry deoxygenated blood, for example.", difficulty: "Medium" },
  { type: "short-answer", question: "Why does the left ventricle have a thicker wall than the right ventricle?", correctAnswer: "Because it must generate enough pressure to pump blood through the entire systemic circulation, while the right ventricle only pumps to the nearby lungs.", explanation: "Wall thickness generally reflects the pressure workload a chamber needs to produce.", difficulty: "Hard" },
  { type: "clinical-scenario", question: "A 58-year-old man presents with crushing chest pain radiating to his left arm, diaphoresis, and nausea. ECG shows ST-elevation in leads II, III, and aVF. What is the most likely diagnosis, and which artery is most likely involved?", correctAnswer: "Inferior myocardial infarction, most likely involving the right coronary artery.", explanation: "ST elevation in the inferior leads (II, III, aVF) classically reflects an inferior wall MI, most often due to right coronary artery occlusion.", difficulty: "Hard" },
  { type: "clinical-scenario", question: "A patient's heart rate is 45 bpm and they feel dizzy on standing. What term describes this heart rate, and what structure might be malfunctioning?", correctAnswer: "Bradycardia; the SA node (or the conduction pathway) may be malfunctioning.", explanation: "A resting heart rate below 60 bpm is bradycardia, and dizziness suggests the slow rate is affecting perfusion—often traced back to SA node dysfunction.", difficulty: "Hard" },
  { type: "clinical-scenario", question: "A patient with long-standing hypertension develops a stiff, narrowed coronary artery found on imaging. What underlying process caused this, and what is the long-term risk?", correctAnswer: "Atherosclerosis; the long-term risk is myocardial infarction from plaque rupture or progressive occlusion.", explanation: "Chronic hypertension accelerates atherosclerotic plaque buildup, which stiffens and narrows arteries and raises MI risk over time.", difficulty: "Medium" }
];

export function saveQuiz(title: string, questions: GeneratedQuestion[]): SavedQuiz {
  const quiz: SavedQuiz = { id: `quiz-${Date.now()}`, title, questions, createdAt: new Date().toISOString() };
  const quizzes = getQuizzes();
  quizzes.push(quiz);
  saveQuizzes(quizzes);
  recordQuizCreated();
  return quiz;
}

// ---- Sample lesson ----

export type GeneratedLesson = {
  title: string;
  introduction: string;
  mainConcepts: { heading: string; body: string }[];
  examples: string[];
  keyTakeaways: string[];
  practiceQuestions: GeneratedQuestion[];
  summary: string;
  flashcards: GeneratedFlashcard[];
};

export const sampleLesson: GeneratedLesson = {
  title: "The Cardiovascular System",
  introduction: "The cardiovascular system moves blood, oxygen, and nutrients throughout the body using the heart as a pump and blood vessels as the delivery network. This lesson covers the heart's structure, how it beats, and what goes wrong in common cardiovascular disease.",
  mainConcepts: [
    { heading: "Heart Structure", body: "The heart has four chambers—two atria and two ventricles—separated by valves that keep blood flowing one direction. Its wall has three layers: the endocardium (inner lining), myocardium (muscle that contracts), and pericardium (protective outer sac)." },
    { heading: "The Cardiac Cycle", body: "Each heartbeat alternates between systole (contraction, ejecting blood) and diastole (relaxation, filling with blood). The SA node triggers each cycle by initiating an electrical signal that spreads through the heart's conduction system." },
    { heading: "Atherosclerosis and Its Consequences", body: "Over years, fatty plaques can build up inside artery walls—atherosclerosis—narrowing and stiffening them. If a plaque ruptures, it can trigger a clot that blocks blood flow entirely, causing a myocardial infarction (heart attack)." }
  ],
  examples: [
    "A resting heart rate of 45 bpm is bradycardia; a resting rate of 110 bpm is tachycardia.",
    "ST-elevation in leads II, III, and aVF on an ECG points to an inferior wall MI, usually from a blocked right coronary artery.",
    "An irregularly irregular pulse with no clear P waves on ECG is characteristic of atrial fibrillation, a common arrhythmia."
  ],
  keyTakeaways: [
    "The heart's wall has three layers—endocardium, myocardium, pericardium—each with a distinct job.",
    "The SA node is the heart's natural pacemaker, and systole/diastole describe its contraction and relaxation phases.",
    "Atherosclerosis is the gradual root cause behind most heart attacks, from slow arterial narrowing to sudden plaque rupture."
  ],
  practiceQuestions: sampleQuizBank.slice(0, 5),
  summary: "The cardiovascular system relies on a four-chambered heart, driven by the SA node, to cycle blood through systole and diastole. Atherosclerosis narrows arteries over time and is the underlying cause of most heart attacks and many arrhythmias.",
  flashcards: sampleFlashcards.slice(0, 6)
};

export function saveLesson(title: string): SavedLesson {
  const lesson: SavedLesson = { id: `lesson-${Date.now()}`, title, createdAt: new Date().toISOString() };
  const lessons = getLessons();
  lessons.push(lesson);
  saveLessons(lessons);
  recordLessonCreated();
  return lesson;
}

// ---- Sample summary ----

export type GeneratedSummary = {
  shortSummary: string;
  highYieldNotes: string[];
  importantConcepts: string[];
  keyDefinitions: { term: string; definition: string }[];
  examTips: string[];
};

export const sampleSummary: GeneratedSummary = {
  shortSummary: "The heart is a four-chambered pump with three wall layers (endocardium, myocardium, pericardium), driven by the SA node through cycles of systole and diastole. Atherosclerosis—fatty plaque buildup in arteries—is the root cause behind most heart attacks and many arrhythmias.",
  highYieldNotes: [
    "Systole = contraction/ejection; diastole = relaxation/filling.",
    "SA node > AV node > Bundle of His > Purkinje fibers is the normal conduction pathway.",
    "Inferior wall MI (leads II, III, aVF) usually implicates the right coronary artery.",
    "Bradycardia = slow heart rate; tachycardia = fast heart rate."
  ],
  importantConcepts: ["Cardiac chamber anatomy", "Cardiac conduction system", "Atherosclerosis and plaque rupture", "ECG lead correlation with coronary territory"],
  keyDefinitions: [
    { term: "Myocardium", definition: "The muscular tissue of the heart responsible for contraction." },
    { term: "Atherosclerosis", definition: "A buildup of fatty plaques inside artery walls that narrows and stiffens them." },
    { term: "Myocardial infarction", definition: "Damage to heart muscle caused by a sudden loss of blood supply." },
    { term: "Arrhythmia", definition: "An abnormal heart rhythm—too fast, too slow, or irregular." }
  ],
  examTips: [
    "When you see ECG lead groupings in a question, map them to a coronary territory before answering.",
    "Don't confuse systole/diastole with tachycardia/bradycardia—one is about phase, the other about rate.",
    "\"Pain out of proportion\" and \"crushing chest pain radiating to the arm\" are classic exam phrasing for MI—learn to recognize them fast."
  ]
};

export type SavedSummaryEntry = { id: string; title: string; createdAt: string };

export function saveSummary(title: string): SavedSummaryEntry {
  const entry: SavedSummaryEntry = { id: `summary-${Date.now()}`, title, createdAt: new Date().toISOString() };
  const summaries = getSummaries();
  summaries.push(entry);
  saveSummaries(summaries);
  return entry;
}

// ---- My Creations storage ----

const DECKS_KEY = "studium_create_decks";
const QUIZZES_KEY = "studium_create_quizzes";
const LESSONS_KEY = "studium_create_lessons";
const SUMMARIES_KEY = "studium_create_summaries";

export type SavedDeck = { id: string; title: string; cards: GeneratedFlashcard[]; createdAt: string };
export type SavedQuiz = { id: string; title: string; questions: GeneratedQuestion[]; createdAt: string };
export type SavedLesson = { id: string; title: string; createdAt: string };

function readList<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : [];
}

function writeList<T>(key: string, list: T[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(list));
}

export function getDecks(): SavedDeck[] { return readList<SavedDeck>(DECKS_KEY); }
function saveDecks(list: SavedDeck[]) { writeList(DECKS_KEY, list); }
export function deleteDeck(id: string) { saveDecks(getDecks().filter(d => d.id !== id)); }
export function duplicateDeck(id: string) {
  const deck = getDecks().find(d => d.id === id);
  if (!deck) return;
  saveDecks([...getDecks(), { ...deck, id: `deck-${Date.now()}`, title: `${deck.title} (copy)`, createdAt: new Date().toISOString() }]);
}

export function getQuizzes(): SavedQuiz[] { return readList<SavedQuiz>(QUIZZES_KEY); }
function saveQuizzes(list: SavedQuiz[]) { writeList(QUIZZES_KEY, list); }
export function deleteQuiz(id: string) { saveQuizzes(getQuizzes().filter(q => q.id !== id)); }
export function duplicateQuiz(id: string) {
  const quiz = getQuizzes().find(q => q.id === id);
  if (!quiz) return;
  saveQuizzes([...getQuizzes(), { ...quiz, id: `quiz-${Date.now()}`, title: `${quiz.title} (copy)`, createdAt: new Date().toISOString() }]);
}

export function getLessons(): SavedLesson[] { return readList<SavedLesson>(LESSONS_KEY); }
function saveLessons(list: SavedLesson[]) { writeList(LESSONS_KEY, list); }
export function deleteLesson(id: string) { saveLessons(getLessons().filter(l => l.id !== id)); }
export function duplicateLesson(id: string) {
  const lesson = getLessons().find(l => l.id === id);
  if (!lesson) return;
  saveLessons([...getLessons(), { ...lesson, id: `lesson-${Date.now()}`, title: `${lesson.title} (copy)`, createdAt: new Date().toISOString() }]);
}

export function getSummaries(): SavedSummaryEntry[] { return readList<SavedSummaryEntry>(SUMMARIES_KEY); }
function saveSummaries(list: SavedSummaryEntry[]) { writeList(SUMMARIES_KEY, list); }
export function deleteSummary(id: string) { saveSummaries(getSummaries().filter(s => s.id !== id)); }
export function duplicateSummary(id: string) {
  const summary = getSummaries().find(s => s.id === id);
  if (!summary) return;
  saveSummaries([...getSummaries(), { ...summary, id: `summary-${Date.now()}`, title: `${summary.title} (copy)`, createdAt: new Date().toISOString() }]);
}
