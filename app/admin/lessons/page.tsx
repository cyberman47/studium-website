"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Check, FileText, GripVertical, Plus, Stethoscope, Trash2, X } from "lucide-react";
import { getAllCases } from "@/lib/clinicalCases";
import { termCategories } from "@/lib/terminology";
import {
  addBlock, addCourse, addLesson, CUSTOM_COURSES_EVENT, CustomCourse, getCourses, LessonBlockType,
  removeBlock, removeCourse, removeLesson, reorderBlocks, reorderLessons
} from "@/lib/customPaths";

const fieldClass = "w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-teal-500/40";

const blockIcons: Record<LessonBlockType, typeof BookOpen> = { vocabulary: BookOpen, case: Stethoscope, note: FileText };

export default function LessonsPage() {
  const [courses, setCourses] = useState<CustomCourse[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [courseModalOpen, setCourseModalOpen] = useState(false);

  function refresh() {
    const list = getCourses();
    setCourses(list);
  }
  useEffect(() => {
    refresh();
    window.addEventListener(CUSTOM_COURSES_EVENT, refresh);
    return () => window.removeEventListener(CUSTOM_COURSES_EVENT, refresh);
  }, []);

  const selectedCourse = courses.find(c => c.id === selectedCourseId) ?? null;
  const selectedLesson = selectedCourse?.lessons.find(l => l.id === selectedLessonId) ?? null;

  function handleAddLesson() {
    if (!selectedCourseId) return;
    const title = prompt("Lesson title:");
    if (title) addLesson(selectedCourseId, title);
  }

  function handleDropLesson(draggedId: string, targetId: string) {
    if (!selectedCourse || draggedId === targetId) return;
    const ids = selectedCourse.lessons.map(l => l.id);
    const from = ids.indexOf(draggedId), to = ids.indexOf(targetId);
    ids.splice(to, 0, ids.splice(from, 1)[0]);
    reorderLessons(selectedCourse.id, ids);
  }

  function handleDropBlock(draggedId: string, targetId: string) {
    if (!selectedCourse || !selectedLesson || draggedId === targetId) return;
    const ids = selectedLesson.blocks.map(b => b.id);
    const from = ids.indexOf(draggedId), to = ids.indexOf(targetId);
    ids.splice(to, 0, ids.splice(from, 1)[0]);
    reorderBlocks(selectedCourse.id, selectedLesson.id, ids);
  }

  return <div>
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="text-lg font-extrabold text-white">Lesson Builder</h1>
        <p className="mt-1 text-xs text-slate-500">Real, drag-and-drop course composer. Blocks reference real content (Vocabulary categories, Clinical Cases)—no fake placeholder lessons. A student-facing course player isn't built yet; this is the real authoring half.</p>
      </div>
      <button type="button" onClick={() => setCourseModalOpen(true)} className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-teal-500 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-teal-600"><Plus size={14} />New Course</button>
    </div>

    <div className="mt-5 grid gap-4 lg:grid-cols-[280px_1fr_320px]">
      {/* Courses column */}
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
        <p className="mb-2 px-1 text-[11px] font-bold uppercase tracking-wide text-slate-500">Courses ({courses.length})</p>
        <div className="space-y-1">
          {courses.map(c => <button
            key={c.id} type="button" onClick={() => { setSelectedCourseId(c.id); setSelectedLessonId(null); }}
            className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-xs font-bold transition ${selectedCourseId === c.id ? "bg-teal-500/10 text-teal-300" : "text-slate-300 hover:bg-white/5"}`}
          >
            <span className="truncate">{c.title}</span>
            <span className="shrink-0 text-slate-500">{c.lessons.length}</span>
          </button>)}
          {courses.length === 0 && <p className="px-1 py-4 text-center text-xs text-slate-500">No courses yet.</p>}
        </div>
      </div>

      {/* Lessons column */}
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
        {selectedCourse ? <>
          <div className="mb-2 flex items-center justify-between px-1">
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Lessons — drag to reorder</p>
            <div className="flex items-center gap-2">
              <button type="button" onClick={handleAddLesson} className="cursor-pointer text-[11px] font-bold text-teal-400 hover:text-teal-300">+ Add Lesson</button>
              <button type="button" onClick={() => { removeCourse(selectedCourse.id); setSelectedCourseId(null); }} className="cursor-pointer text-slate-500 hover:text-rose-400"><Trash2 size={13} /></button>
            </div>
          </div>
          <p className="mb-2 px-1 text-xs text-slate-500">{selectedCourse.specialty} · {selectedCourse.difficulty}</p>
          <div className="space-y-1.5">
            {selectedCourse.lessons.map((l, i) => <div
              key={l.id} draggable
              onDragStart={e => e.dataTransfer.setData("text/plain", l.id)}
              onDragOver={e => e.preventDefault()}
              onDrop={e => handleDropLesson(e.dataTransfer.getData("text/plain"), l.id)}
              onClick={() => setSelectedLessonId(l.id)}
              className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2.5 text-xs font-bold transition ${selectedLessonId === l.id ? "border-teal-500/40 bg-teal-500/10 text-teal-300" : "border-white/10 text-slate-300 hover:bg-white/5"}`}
            >
              <GripVertical size={13} className="shrink-0 cursor-grab text-slate-600" />
              <span className="shrink-0 text-slate-500">{i + 1}.</span>
              <span className="truncate">{l.title}</span>
              <span className="ml-auto shrink-0 text-slate-500">{l.blocks.length} blocks</span>
              <button type="button" onClick={e => { e.stopPropagation(); removeLesson(selectedCourse.id, l.id); if (selectedLessonId === l.id) setSelectedLessonId(null); }} className="shrink-0 cursor-pointer text-slate-600 hover:text-rose-400"><X size={13} /></button>
            </div>)}
            {selectedCourse.lessons.length === 0 && <p className="py-4 text-center text-xs text-slate-500">No lessons yet.</p>}
          </div>
        </> : <p className="py-8 text-center text-xs text-slate-500">Select a course to manage its lessons.</p>}
      </div>

      {/* Blocks column */}
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
        {selectedLesson && selectedCourse ? <BlocksPanel courseId={selectedCourse.id} lessonId={selectedLesson.id} blocks={selectedLesson.blocks} onDropBlock={handleDropBlock} /> : <p className="py-8 text-center text-xs text-slate-500">Select a lesson to compose its content blocks.</p>}
      </div>
    </div>

    <AnimatePresence>
      {courseModalOpen && <CourseModal onClose={() => setCourseModalOpen(false)} onSaved={() => { setCourseModalOpen(false); refresh(); }} />}
    </AnimatePresence>
  </div>;
}

function BlocksPanel({ courseId, lessonId, blocks, onDropBlock }: { courseId: string; lessonId: string; blocks: CustomCourse["lessons"][number]["blocks"]; onDropBlock: (dragged: string, target: string) => void }) {
  const [blockType, setBlockType] = useState<LessonBlockType>("vocabulary");
  const [refId, setRefId] = useState(termCategories[0].id);
  const [noteText, setNoteText] = useState("");
  const cases = getAllCases();

  function handleAdd() {
    const finalRefId = blockType === "note" ? noteText : refId;
    if (!finalRefId.trim()) return;
    addBlock(courseId, lessonId, blockType, finalRefId);
    setNoteText("");
  }

  return <div>
    <p className="mb-2 px-1 text-[11px] font-bold uppercase tracking-wide text-slate-500">Lesson Blocks — drag to reorder</p>
    <div className="space-y-1.5">
      {blocks.map(b => {
        const Icon = blockIcons[b.type];
        return <div
          key={b.id} draggable
          onDragStart={e => e.dataTransfer.setData("text/plain", b.id)}
          onDragOver={e => e.preventDefault()}
          onDrop={e => onDropBlock(e.dataTransfer.getData("text/plain"), b.id)}
          className="flex cursor-grab items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-slate-300"
        >
          <GripVertical size={13} className="shrink-0 text-slate-600" />
          <Icon size={13} className="shrink-0 text-teal-400" />
          <span className="truncate">{b.label}</span>
          <button type="button" onClick={() => removeBlock(courseId, lessonId, b.id)} className="ml-auto shrink-0 cursor-pointer text-slate-600 hover:text-rose-400"><X size={13} /></button>
        </div>;
      })}
      {blocks.length === 0 && <p className="py-3 text-center text-xs text-slate-500">No blocks yet.</p>}
    </div>

    <div className="mt-4 space-y-2 border-t border-white/10 pt-4">
      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Add Block</p>
      <select value={blockType} onChange={e => setBlockType(e.target.value as LessonBlockType)} className={fieldClass}>
        <option value="vocabulary" className="bg-[#12171F] text-white">Vocabulary Category</option>
        <option value="case" className="bg-[#12171F] text-white">Clinical Case</option>
        <option value="note" className="bg-[#12171F] text-white">Free-text Note</option>
      </select>
      {blockType === "vocabulary" && <select value={refId} onChange={e => setRefId(e.target.value)} className={fieldClass}>
        {termCategories.map(c => <option key={c.id} value={c.id} className="bg-[#12171F] text-white">{c.name}</option>)}
      </select>}
      {blockType === "case" && <select value={refId} onChange={e => setRefId(e.target.value)} className={fieldClass}>
        {cases.map(c => <option key={c.id} value={c.id} className="bg-[#12171F] text-white">{c.title}</option>)}
      </select>}
      {blockType === "note" && <input value={noteText} onChange={e => setNoteText(e.target.value)} placeholder="Note text..." className={fieldClass} />}
      <button type="button" onClick={handleAdd} className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-teal-500 py-2 text-xs font-bold text-white transition hover:bg-teal-600"><Plus size={13} />Add Block</button>
    </div>
  </div>;
}

function CourseModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", description: "", specialty: "Cardiology", difficulty: "Beginner" as CustomCourse["difficulty"] });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const result = addCourse(form);
    if (!result.ok) { setError(result.error); return; }
    onSaved();
  }

  return <motion.div
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
    onClick={onClose}
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
  >
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, scale: 0.97, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97, y: 8 }}
      onClick={e => e.stopPropagation()}
      className="w-full max-w-md rounded-2xl border border-white/10 bg-[#12171F] p-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-extrabold text-white">New Course</h3>
        <button type="button" onClick={onClose} className="grid h-7 w-7 cursor-pointer place-items-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-white"><X size={15} /></button>
      </div>
      {error && <p className="mt-3 rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs font-bold text-rose-300">{error}</p>}
      <div className="mt-4 space-y-3">
        <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Cardiology Beginner Path" className={fieldClass} />
        <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} placeholder="Short description" className={`${fieldClass} resize-none`} />
        <div className="grid grid-cols-2 gap-3">
          <input value={form.specialty} onChange={e => setForm(f => ({ ...f, specialty: e.target.value }))} placeholder="Specialty" className={fieldClass} />
          <select value={form.difficulty} onChange={e => setForm(f => ({ ...f, difficulty: e.target.value as CustomCourse["difficulty"] }))} className={fieldClass}>
            <option className="bg-[#12171F] text-white">Beginner</option>
            <option className="bg-[#12171F] text-white">Intermediate</option>
            <option className="bg-[#12171F] text-white">Advanced</option>
          </select>
        </div>
      </div>
      <button type="submit" className="mt-4 flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-teal-500 py-2.5 text-sm font-bold text-white transition hover:bg-teal-600"><Check size={14} />Create Course</button>
    </motion.form>
  </motion.div>;
}
