"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen, Brain, ClipboardList, Copy, FileText, HelpCircle, Layers, Search,
  Sparkles, Trash2, Type, UploadCloud
} from "lucide-react";
import { inputClass } from "@/components/ui";
import {
  deleteDeck, deleteLesson, deleteQuiz, deleteSummary, duplicateDeck, duplicateLesson, duplicateQuiz, duplicateSummary,
  getDecks, getLessons, getQuizzes, getSummaries, registerUpload, sampleDocument, SavedDeck, SavedLesson,
  SavedQuiz, SavedSummaryEntry
} from "@/lib/create";
import { getLearnedTerms } from "@/lib/terminology";

type Step = "idle" | "analyzing" | "analyzed";

const acceptedTypes = ".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg,.txt";

const generateOptions = [
  { id: "flashcards", label: "Generate Flashcards", icon: Brain, href: "/dashboard/create/flashcards", color: "bg-indigo-100 text-indigo-600" },
  { id: "quiz", label: "Create Quiz", icon: HelpCircle, href: "/dashboard/create/quiz", color: "bg-amber-100 text-amber-600" },
  { id: "lesson", label: "Build Lesson", icon: BookOpen, href: "/dashboard/create/lesson", color: "bg-teal-100 text-teal-700" },
  { id: "summary", label: "Create Summary", icon: FileText, href: "/dashboard/create/summary", color: "bg-sky-100 text-sky-600" },
  { id: "terminology", label: "Extract Terminology", icon: Type, href: "/dashboard/create/terminology", color: "bg-rose-100 text-rose-600" }
];

type CreationRow = { id: string; type: "Lesson" | "Flashcards" | "Quiz" | "Summary"; title: string; createdAt: string; meta: string };

export default function CreatePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<Step>("idle");
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [fileError, setFileError] = useState("");

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

  function startAnalysis(fileName: string) {
    if (!isSupported(fileName)) { setFileError("That file type isn't supported. Try a PDF, Word, PowerPoint, image, or text file."); return; }
    setFileError("");
    setUploadedFileName(fileName);
    setStep("analyzing");
    setTimeout(() => {
      registerUpload();
      setStep("analyzed");
    }, 1200);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) startAnalysis(file.name);
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) startAnalysis(file.name);
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

  return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)]" />
    <span className="eyebrow"><Sparkles size={13} />Create</span>
    <h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">Create Your Own Learning Materials.</h1>
    <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500">Upload your notes and let Studium transform them into personalized study resources.</p>

    <div className="mt-10 max-w-3xl">
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`rounded-3xl border-2 border-dashed p-10 text-center transition ${dragOver ? "border-teal-400 bg-teal-50" : "border-slate-200 bg-white"}`}
      >
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-teal-100 text-teal-700"><UploadCloud size={26} /></span>
        <h2 className="mt-4 text-lg font-extrabold tracking-tight">Upload Notes</h2>
        <p className="mt-1.5 max-w-sm mx-auto text-sm leading-relaxed text-slate-500">Drag and drop a PDF, Word doc, PowerPoint, image, or text file—or click to browse.</p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <button type="button" onClick={() => fileInputRef.current?.click()} className="cursor-pointer rounded-full bg-accent-500 px-6 py-3 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600">Browse Files</button>
          <button type="button" onClick={() => startAnalysis(sampleDocument.fileName)} className="cursor-pointer rounded-full border border-slate-200 px-6 py-3 text-sm font-bold text-ink transition hover:border-teal-200 hover:bg-[#f9fcfc]">Try a Sample Document</button>
        </div>
        <input ref={fileInputRef} type="file" accept={acceptedTypes} onChange={handleFileSelect} className="hidden" />
        {fileError && <p className="mt-3 text-xs font-bold text-rose-600">{fileError}</p>}
      </div>

      <AnimatePresence>
        {step === "analyzing" && <motion.div key="analyzing" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-6 rounded-3xl border border-slate-100 bg-white p-6 text-center shadow-soft">
          <p className="text-sm font-bold text-ink">Analyzing "{uploadedFileName}"…</p>
          <div className="mx-auto mt-4 h-1.5 w-48 overflow-hidden rounded-full bg-slate-100"><motion.div className="h-full rounded-full bg-teal-500" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 1.1, ease: "easeInOut" }} /></div>
        </motion.div>}

        {step === "analyzed" && <motion.div key="analyzed" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-6 rounded-3xl border border-slate-100 bg-white p-6 shadow-soft sm:p-7">
          <p className="text-sm font-extrabold text-teal-700">✓ Your document has been analyzed.</p>
          <p className="mt-1 text-xs text-slate-400">You uploaded "{uploadedFileName}". Deep AI analysis of arbitrary files isn't connected in this demo, so the results below use a sample document ({sampleDocument.fileName}) to show you what the finished experience looks like.</p>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl bg-[#f9fcfc] p-4 text-center"><p className="text-xl font-extrabold text-ink">{sampleDocument.pages}</p><p className="mt-0.5 text-[11px] font-bold text-slate-500">pages analyzed</p></div>
            <div className="rounded-2xl bg-[#f9fcfc] p-4 text-center"><p className="text-xl font-extrabold text-ink">{sampleDocument.keyConceptsFound}</p><p className="mt-0.5 text-[11px] font-bold text-slate-500">key concepts found</p></div>
            <div className="rounded-2xl bg-[#f9fcfc] p-4 text-center"><p className="text-xl font-extrabold text-ink">{sampleDocument.importantTermsFound}</p><p className="mt-0.5 text-[11px] font-bold text-slate-500">important terms found</p></div>
            <div className="rounded-2xl bg-[#f9fcfc] p-4 text-center"><p className="text-xl font-extrabold text-ink">{sampleDocument.estimatedStudyMinutes}</p><p className="mt-0.5 text-[11px] font-bold text-slate-500">min est. study time</p></div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {generateOptions.map(opt => <Link key={opt.id} href={opt.href} className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-100 p-3.5 transition hover:border-teal-200 hover:bg-[#f9fcfc]">
              <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${opt.color}`}><opt.icon size={18} /></span>
              <span className="text-sm font-bold text-ink">{opt.label}</span>
            </Link>)}
          </div>
        </motion.div>}
      </AnimatePresence>
    </div>

    <div className="mt-12">
      <h2 className="text-lg font-extrabold tracking-tight">My Creations</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <div className="rounded-3xl border border-slate-100 bg-white p-4 text-center shadow-soft"><BookOpen size={18} className="mx-auto text-teal-600" /><p className="mt-2 text-xl font-extrabold text-ink">{lessons.length}</p><p className="text-[11px] font-bold text-slate-500">My Lessons</p></div>
        <div className="rounded-3xl border border-slate-100 bg-white p-4 text-center shadow-soft"><Layers size={18} className="mx-auto text-indigo-600" /><p className="mt-2 text-xl font-extrabold text-ink">{decks.length}</p><p className="text-[11px] font-bold text-slate-500">My Flashcards</p></div>
        <div className="rounded-3xl border border-slate-100 bg-white p-4 text-center shadow-soft"><ClipboardList size={18} className="mx-auto text-amber-600" /><p className="mt-2 text-xl font-extrabold text-ink">{quizzes.length}</p><p className="text-[11px] font-bold text-slate-500">My Quizzes</p></div>
        <div className="rounded-3xl border border-slate-100 bg-white p-4 text-center shadow-soft"><FileText size={18} className="mx-auto text-sky-600" /><p className="mt-2 text-xl font-extrabold text-ink">{summaries.length}</p><p className="text-[11px] font-bold text-slate-500">My Summaries</p></div>
        <Link href="/dashboard/terminology" className="cursor-pointer rounded-3xl border border-slate-100 bg-white p-4 text-center shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift"><Type size={18} className="mx-auto text-rose-600" /><p className="mt-2 text-xl font-extrabold text-ink">{termsLearned}</p><p className="text-[11px] font-bold text-slate-500">My Terminology</p></Link>
      </div>

      <div className="relative mt-6 max-w-md">
        <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search your creations..." className={`${inputClass} pl-11`} />
      </div>

      {filteredRows.length === 0
        ? <p className="mt-6 text-sm text-slate-500">{rows.length === 0 ? "Nothing saved yet—generate something above and save it here." : `No matches for "${search}".`}</p>
        : <div className="mt-4 space-y-2">
          {filteredRows.map(row => <div key={row.id} className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-soft">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2"><p className="truncate text-sm font-bold text-ink">{row.title}</p><span className="rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-teal-700">{row.type}</span></div>
              <p className="mt-0.5 text-xs text-slate-500">{row.meta} · {new Date(row.createdAt).toLocaleDateString()}</p>
            </div>
            <button type="button" onClick={() => handleAction("duplicate", row)} aria-label="Duplicate" className="cursor-pointer rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-ink"><Copy size={15} /></button>
            <button type="button" onClick={() => handleAction("delete", row)} aria-label="Delete" className="cursor-pointer rounded-full p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"><Trash2 size={15} /></button>
          </div>)}
        </div>}
    </div>
  </section>;
}
