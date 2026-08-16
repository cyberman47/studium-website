"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen, Brain, ClipboardList, Copy, FileText, HelpCircle, Layers, Search,
  Sparkles, Trash2, Type, UploadCloud
} from "lucide-react";
import { CreateHub } from "@/components/create-hub";
import { inputClass } from "@/components/ui";
import {
  deleteDeck, deleteLesson, deleteQuiz, deleteSummary, duplicateDeck, duplicateLesson, duplicateQuiz, duplicateSummary,
  getDecks, getLessons, getQuizzes, getSummaries, registerUpload, sampleDocument, SavedDeck, SavedLesson,
  SavedQuiz, SavedSummaryEntry
} from "@/lib/create";
import { getLearnedTerms } from "@/lib/terminology";
import { setPendingSource } from "@/lib/aiGenerate";
import { SectionTour } from "@/components/product-tour/SectionTour";
import { createTourSteps } from "@/lib/productTour";

type Step = "idle" | "analyzing" | "analyzed";

const acceptedTypes = ".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg,.txt";

// All five are wired to real AI generation now (see lib/aiGenerate.ts +
// app/api/generate/route.ts)—every one of these reads the real captured
// text from this page's upload/paste flow and grounds its output in it.
const realGenerateOptions = [
  { id: "flashcards", label: "Generate Flashcards", icon: Brain, href: "/dashboard/create/flashcards", color: "bg-indigo-100 dark:bg-indigo-500/20 dark:text-indigo-300 text-indigo-600" },
  { id: "quiz", label: "Create Quiz", icon: HelpCircle, href: "/dashboard/create/quiz", color: "bg-amber-100 dark:bg-amber-500/20 dark:text-amber-300 text-amber-600" },
  { id: "lesson", label: "Build Lesson", icon: BookOpen, href: "/dashboard/create/lesson", color: "bg-teal-100 dark:bg-teal-500/20 dark:text-teal-300 text-teal-700" },
  { id: "summary", label: "Create Summary", icon: FileText, href: "/dashboard/create/summary", color: "bg-sky-100 dark:bg-sky-500/20 dark:text-sky-300 text-sky-600" },
  { id: "terminology", label: "Extract Terminology", icon: Type, href: "/dashboard/create/terminology", color: "bg-rose-100 dark:bg-rose-500/20 dark:text-rose-300 text-rose-600" }
];

type CreationRow = { id: string; type: "Lesson" | "Flashcards" | "Quiz" | "Summary"; title: string; createdAt: string; meta: string };

function estimateReadMinutes(wordCount: number): number {
  return Math.max(1, Math.round(wordCount / 200));
}

export default function CreatePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<Step>("idle");
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [fileError, setFileError] = useState("");

  // Real captured text—from a real .txt file's actual contents, or pasted
  // notes. null means the sample-document walkthrough is running instead
  // (e.g. any other accepted file type, which can't be parsed for real
  // without new server-side parsing dependencies).
  const [realText, setRealText] = useState<string | null>(null);
  const [pasteOpen, setPasteOpen] = useState(false);
  const [pasteDraft, setPasteDraft] = useState("");

  const [decks, setDecks] = useState<SavedDeck[]>([]);
  const [quizzes, setQuizzes] = useState<SavedQuiz[]>([]);
  const [lessons, setLessons] = useState<SavedLesson[]>([]);
  const [summaries, setSummaries] = useState<SavedSummaryEntry[]>([]);
  const [termsLearned, setTermsLearned] = useState(0);
  const [search, setSearch] = useState("");

  function refreshCreations() {
    setDecks(getDecks());
    setQuizzes(getQuizzes());
    setLessons(getLessons());
    setSummaries(getSummaries());
    setTermsLearned(getLearnedTerms().length);
  }

  useEffect(() => { refreshCreations(); }, []);

  function isSupported(name: string) {
    const ext = name.split(".").pop()?.toLowerCase();
    return ["pdf", "doc", "docx", "ppt", "pptx", "png", "jpg", "jpeg", "txt"].includes(ext ?? "");
  }

  async function startAnalysis(input: File | string) {
    const name = typeof input === "string" ? input : input.name;
    if (!isSupported(name)) { setFileError("That file type isn't supported. Try a PDF, Word, PowerPoint, image, or text file."); return; }
    setFileError("");
    setUploadedFileName(name);
    setPasteOpen(false);
    setStep("analyzing");

    // Only .txt files can be read for real without a server-side parser
    // (pdf/doc/ppt/image parsing isn't wired up)—everything else genuinely
    // falls back to the labeled sample-document walkthrough below.
    if (typeof input !== "string" && name.toLowerCase().endsWith(".txt")) {
      const text = await input.text();
      setTimeout(() => { registerUpload(); setRealText(text); setStep("analyzed"); }, 700);
      return;
    }
    setTimeout(() => { registerUpload(); setRealText(null); setStep("analyzed"); }, 1200);
  }

  function analyzePastedText() {
    const trimmed = pasteDraft.trim();
    if (!trimmed) { setFileError("Paste some text first."); return; }
    setFileError("");
    setUploadedFileName("Pasted notes");
    setStep("analyzing");
    setTimeout(() => { registerUpload(); setRealText(trimmed); setStep("analyzed"); }, 500);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) startAnalysis(file);
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) startAnalysis(file);
  }

  function goGenerate(href: string) {
    if (realText !== null) setPendingSource({ kind: "text", text: realText, fileName: uploadedFileName ?? undefined });
    // else: no pending source is set, so the destination page falls back
    // to its own honest sample-content walkthrough (unchanged behavior).
  }

  const rows: CreationRow[] = [
    ...lessons.map(l => ({ id: l.id, type: "Lesson" as const, title: l.title, createdAt: l.createdAt, meta: "Lesson" })),
    ...decks.map(d => ({ id: d.id, type: "Flashcards" as const, title: d.title, createdAt: d.createdAt, meta: `${d.cards.length} cards` })),
    ...quizzes.map(q => ({ id: q.id, type: "Quiz" as const, title: q.title, createdAt: q.createdAt, meta: `${q.questions.length} questions` })),
    ...summaries.map(s => ({ id: s.id, type: "Summary" as const, title: s.title, createdAt: s.createdAt, meta: "Summary" }))
  ].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const filteredRows = rows.filter(r => r.title.toLowerCase().includes(search.trim().toLowerCase()));

  function handleAction(action: "delete" | "duplicate", row: CreationRow) {
    const fn = { Lesson: { delete: deleteLesson, duplicate: duplicateLesson }, Flashcards: { delete: deleteDeck, duplicate: duplicateDeck }, Quiz: { delete: deleteQuiz, duplicate: duplicateQuiz }, Summary: { delete: deleteSummary, duplicate: duplicateSummary } }[row.type][action];
    fn(row.id);
    refreshCreations();
  }

  const wordCount = realText ? realText.trim().split(/\s+/).filter(Boolean).length : 0;

  return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(15,139,141,0.12),transparent_65%)]" />
    <span className="eyebrow"><Sparkles size={13} />Create</span>
    <h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">Create Your Own Learning Materials.</h1>
    <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500">Paste your notes, upload a document, and let Studium transform them into real, AI-generated study resources.</p>

    <CreateHub />

    {/* Tour anchor lives here, not on the whole <section>—see the same note
        on app/dashboard/(main)/flashcards/page.tsx. */}
    <div id="upload-files" data-tour="create-main" className="mt-10 max-w-3xl scroll-mt-24">
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`rounded-3xl border-2 border-dashed p-10 text-center transition ${dragOver ? "border-teal-400 bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300" : "border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917]"}`}
      >
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-teal-100 dark:bg-teal-500/20 dark:text-teal-300 text-teal-700"><UploadCloud size={26} /></span>
        <h2 className="mt-4 text-lg font-extrabold tracking-tight">Upload Notes</h2>
        <p className="mt-1.5 max-w-sm mx-auto text-sm leading-relaxed text-slate-500">Drag and drop a .txt file for real AI generation, or a PDF/Word/PowerPoint/image for a sample walkthrough.</p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <button type="button" onClick={() => fileInputRef.current?.click()} className="cursor-pointer rounded-full bg-accent-500 px-6 py-3 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600">Browse Files</button>
          <button type="button" onClick={() => { setPasteOpen(o => !o); setFileError(""); }} className="cursor-pointer rounded-full border border-slate-200 dark:border-white/10 px-6 py-3 text-sm font-bold text-heading transition hover:border-teal-200 hover:bg-[#f9fcfc] dark:bg-white/5">Paste Text Instead</button>
          <button type="button" onClick={() => startAnalysis(sampleDocument.fileName)} className="cursor-pointer rounded-full border border-slate-200 dark:border-white/10 px-6 py-3 text-sm font-bold text-heading transition hover:border-teal-200 hover:bg-[#f9fcfc] dark:bg-white/5">Try a Sample Document</button>
        </div>
        <input ref={fileInputRef} type="file" accept={acceptedTypes} onChange={handleFileSelect} className="hidden" />
        {fileError && <p className="mt-3 text-xs font-bold text-rose-600">{fileError}</p>}

        <AnimatePresence>
          {pasteOpen && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="mt-5 text-left">
              <textarea value={pasteDraft} onChange={e => setPasteDraft(e.target.value)} rows={6} placeholder="Paste your notes here—this becomes the real source Studium's AI generates from." className={`${inputClass} resize-none`} />
              <button type="button" onClick={analyzePastedText} className="mt-3 cursor-pointer rounded-full bg-accent-500 px-6 py-2.5 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600">Use This Text</button>
            </div>
          </motion.div>}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {step === "analyzing" && <motion.div key="analyzing" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-6 rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-6 text-center shadow-soft">
          <p className="text-sm font-bold text-heading">Analyzing "{uploadedFileName}"…</p>
          <div className="mx-auto mt-4 h-1.5 w-48 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10"><motion.div className="h-full rounded-full bg-teal-500" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 1.1, ease: "easeInOut" }} /></div>
        </motion.div>}

        {step === "analyzed" && realText !== null && <motion.div key="analyzed-real" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-6 rounded-3xl border border-teal-100 bg-white dark:bg-[#0d1917] p-6 shadow-soft sm:p-7">
          <p className="text-sm font-extrabold text-teal-700">✓ Real text captured from "{uploadedFileName}".</p>
          <p className="mt-1 text-xs text-slate-400">{wordCount.toLocaleString()} words · ~{estimateReadMinutes(wordCount)} min read. This is your actual content—generation below is a real AI call grounded in it, not a sample.</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {realGenerateOptions.map(opt => <Link key={opt.id} href={opt.href} onClick={() => goGenerate(opt.href)} className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-100 dark:border-white/10 p-3.5 transition hover:border-teal-200 hover:bg-[#f9fcfc] dark:bg-white/5">
              <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${opt.color}`}><opt.icon size={18} /></span>
              <span className="text-sm font-bold text-heading">{opt.label}</span>
            </Link>)}
          </div>
        </motion.div>}

        {step === "analyzed" && realText === null && <motion.div key="analyzed-sample" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-6 rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-6 shadow-soft sm:p-7">
          <p className="text-sm font-extrabold text-teal-700">✓ Your document has been analyzed.</p>
          <p className="mt-1 text-xs text-slate-400">You uploaded "{uploadedFileName}". Parsing arbitrary file types (PDF/Word/PowerPoint/image) for real isn't connected yet, so the results below use a sample document ({sampleDocument.fileName}) to show you what the finished experience looks like. Upload a .txt file or paste text instead for real generation.</p>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl bg-[#f9fcfc] dark:bg-white/5 p-4 text-center"><p className="text-xl font-extrabold text-heading">{sampleDocument.pages}</p><p className="mt-0.5 text-[11px] font-bold text-slate-500">pages analyzed</p></div>
            <div className="rounded-2xl bg-[#f9fcfc] dark:bg-white/5 p-4 text-center"><p className="text-xl font-extrabold text-heading">{sampleDocument.keyConceptsFound}</p><p className="mt-0.5 text-[11px] font-bold text-slate-500">key concepts found</p></div>
            <div className="rounded-2xl bg-[#f9fcfc] dark:bg-white/5 p-4 text-center"><p className="text-xl font-extrabold text-heading">{sampleDocument.importantTermsFound}</p><p className="mt-0.5 text-[11px] font-bold text-slate-500">important terms found</p></div>
            <div className="rounded-2xl bg-[#f9fcfc] dark:bg-white/5 p-4 text-center"><p className="text-xl font-extrabold text-heading">{sampleDocument.estimatedStudyMinutes}</p><p className="mt-0.5 text-[11px] font-bold text-slate-500">min est. study time</p></div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {realGenerateOptions.map(opt => <Link key={opt.id} href={opt.href} onClick={() => goGenerate(opt.href)} className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-100 dark:border-white/10 p-3.5 transition hover:border-teal-200 hover:bg-[#f9fcfc] dark:bg-white/5">
              <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${opt.color}`}><opt.icon size={18} /></span>
              <span className="text-sm font-bold text-heading">{opt.label}</span>
            </Link>)}
          </div>
        </motion.div>}
      </AnimatePresence>
    </div>

    <div className="mt-12">
      <h2 className="text-lg font-extrabold tracking-tight">My Creations</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <div className="rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-4 text-center shadow-soft"><BookOpen size={18} className="mx-auto text-teal-600" /><p className="mt-2 text-xl font-extrabold text-heading">{lessons.length}</p><p className="text-[11px] font-bold text-slate-500">My Lessons</p></div>
        <div className="rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-4 text-center shadow-soft"><Layers size={18} className="mx-auto text-indigo-600" /><p className="mt-2 text-xl font-extrabold text-heading">{decks.length}</p><p className="text-[11px] font-bold text-slate-500">My Flashcards</p></div>
        <div className="rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-4 text-center shadow-soft"><ClipboardList size={18} className="mx-auto text-amber-600" /><p className="mt-2 text-xl font-extrabold text-heading">{quizzes.length}</p><p className="text-[11px] font-bold text-slate-500">My Quizzes</p></div>
        <div className="rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-4 text-center shadow-soft"><FileText size={18} className="mx-auto text-sky-600" /><p className="mt-2 text-xl font-extrabold text-heading">{summaries.length}</p><p className="text-[11px] font-bold text-slate-500">My Summaries</p></div>
        <Link href="/dashboard/terminology" className="cursor-pointer rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-4 text-center shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift"><Type size={18} className="mx-auto text-rose-600" /><p className="mt-2 text-xl font-extrabold text-heading">{termsLearned}</p><p className="text-[11px] font-bold text-slate-500">My Terminology</p></Link>
      </div>

      <div className="relative mt-6 max-w-md">
        <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search your creations..." className={`${inputClass} pl-11`} />
      </div>

      {filteredRows.length === 0
        ? <p className="mt-6 text-sm text-slate-500">{rows.length === 0 ? "Nothing saved yet—generate something above and save it here." : `No matches for "${search}".`}</p>
        : <div className="mt-4 space-y-2">
          {filteredRows.map(row => <div key={row.id} className="flex items-center gap-4 rounded-2xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d1917] p-4 shadow-soft">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2"><p className="truncate text-sm font-bold text-heading">{row.title}</p><span className="rounded-full bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-teal-700">{row.type}</span></div>
              <p className="mt-0.5 text-xs text-slate-500">{row.meta} · {new Date(row.createdAt).toLocaleDateString()}</p>
            </div>
            <button type="button" onClick={() => handleAction("duplicate", row)} aria-label="Duplicate" className="cursor-pointer rounded-full p-2 text-slate-400 transition hover:bg-slate-100 dark:bg-white/10 hover:text-heading"><Copy size={15} /></button>
            <button type="button" onClick={() => handleAction("delete", row)} aria-label="Delete" className="cursor-pointer rounded-full p-2 text-slate-400 transition hover:bg-rose-50 dark:bg-rose-500/15 dark:text-rose-300 hover:text-rose-600"><Trash2 size={15} /></button>
          </div>)}
        </div>}
    </div>
    <SectionTour id="create" steps={createTourSteps} />
  </section>;
}
