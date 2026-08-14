"use client";

// The single "Knowledge gained" toast—mounted once in app/dashboard/layout.tsx
// so it works consistently anywhere Studium awards real KP, replacing every
// feature's own hand-rolled floating "+N KP" text. Deliberately quiet: a
// small card that slides/fades in from the bottom-right, holds briefly, and
// fades out—no bright color, no motion that fights with reading.
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Brain } from "lucide-react";
import { KP_TOAST_EVENT } from "@/lib/kpToast";

type ToastEntry = { id: number; amount: number };

const VISIBLE_MS = 2200;

export function KnowledgeToastHost() {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);

  useEffect(() => {
    let nextId = 0;
    function onToast(e: Event) {
      const amount = (e as CustomEvent<{ amount: number }>).detail?.amount;
      if (!amount || amount <= 0) return;
      const id = nextId++;
      setToasts(list => [...list, { id, amount }]);
      setTimeout(() => setToasts(list => list.filter(t => t.id !== id)), VISIBLE_MS);
    }
    window.addEventListener(KP_TOAST_EVENT, onToast);
    return () => window.removeEventListener(KP_TOAST_EVENT, onToast);
  }, []);

  // z-[130]: above every other fixed overlay in the app (fullscreen focus
  // sessions/quizzes top out at z-[120]), so the toast is never hidden
  // behind a review or practice session—exactly where most real KP awards
  // actually happen.
  return <div className="pointer-events-none fixed bottom-5 right-5 z-[130] flex flex-col items-end gap-2">
    <AnimatePresence>
      {toasts.map(t => <motion.div
        key={t.id}
        initial={{ opacity: 0, y: 14, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 6, scale: 0.98, transition: { duration: 0.2, ease: "easeIn" } }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center gap-3 rounded-2xl border border-slate-100 dark:border-white/10 bg-white/95 dark:bg-[#0d1917]/95 px-4 py-3 shadow-lift backdrop-blur"
      >
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 text-teal-600"><Brain size={16} /></span>
        <span className="leading-tight">
          <span className="block text-xs font-bold text-slate-500">Knowledge gained</span>
          <span className="block text-sm font-extrabold text-heading">+{t.amount} <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">KP</span></span>
        </span>
      </motion.div>)}
    </AnimatePresence>
  </div>;
}
