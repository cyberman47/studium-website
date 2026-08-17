"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Sparkles, X } from "lucide-react";
import { hasSeenSectionTour, markSectionTourSeen, SectionId, TourStep } from "@/lib/productTour";

// Tracks the on-screen rect (+ the target's own corner radius, so the
// spotlight ring can genuinely match its shape instead of guessing) of
// whatever the current step targets. Section tours never navigate, so the
// target is almost always already mounted—this still polls briefly for the
// rare case a step's element renders a tick after the tour itself does, and
// degrades to a centered tooltip if a target genuinely never appears.
function useSpotlightTarget(selector: string | null) {
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [radius, setRadius] = useState(14);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    setRect(null);
    setSettled(false);
    if (!selector) { setSettled(true); return; }
    const sel = selector;

    let cancelled = false;
    let pollTimer: ReturnType<typeof setTimeout>;
    let attempts = 0;

    function readRadius(el: HTMLElement): number {
      const raw = parseFloat(getComputedStyle(el).borderRadius);
      return Number.isFinite(raw) && raw > 0 ? raw : 14;
    }

    function measureNow() {
      const el = document.querySelector(sel) as HTMLElement | null;
      if (el) { setRect(el.getBoundingClientRect()); setRadius(readRadius(el)); }
      return el;
    }

    function tick() {
      if (cancelled) return;
      const el = document.querySelector(sel) as HTMLElement | null;
      if (el) {
        setRect(el.getBoundingClientRect());
        setRadius(readRadius(el));
        setSettled(true);
        return;
      }
      attempts++;
      if (attempts > 25) { setSettled(true); return; } // ~1s—give up gracefully, not indefinitely
      pollTimer = setTimeout(tick, 40);
    }
    tick();

    function onWindowChange() { measureNow(); }
    window.addEventListener("resize", onWindowChange);
    window.addEventListener("scroll", onWindowChange, true);

    return () => {
      cancelled = true;
      clearTimeout(pollTimer);
      window.removeEventListener("resize", onWindowChange);
      window.removeEventListener("scroll", onWindowChange, true);
    };
  }, [selector]);

  return { rect, radius, settled };
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    function check() { setIsMobile(window.innerWidth < 640); }
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

// Anchored placement for the desktop tooltip: prefers below the target,
// flips above if that would run off the bottom of the viewport, and clamps
// horizontally within a 16px margin either side.
function usePopoverStyle(rect: DOMRect | null, tooltipRef: React.RefObject<HTMLDivElement>, deps: unknown[]) {
  const [style, setStyle] = useState<React.CSSProperties>({ opacity: 0 });

  useLayoutEffect(() => {
    if (!rect || !tooltipRef.current) return;
    const el = tooltipRef.current;
    // Fixed, not measured: the wrapper div carries an explicit CSS width
    // (see TOOLTIP_WIDTH/its className below), so it never needs to be read
    // back off the DOM for its width. Measuring el.offsetWidth here used to
    // be the bug—on the very first spotlighted step, this effect can run
    // before the wrapper has ever actually been laid out with a real width,
    // so it read back the full, unconstrained container width (nearly the
    // whole viewport) and then baked that huge number in permanently as
    // this step's popover width. Height still genuinely varies by step
    // content, so it's still measured live.
    const w = TOOLTIP_WIDTH;
    const h = el.offsetHeight || 160;
    const gap = 16;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let top = rect.bottom + gap;
    if (top + h > vh - 16) top = Math.max(16, rect.top - gap - h);

    let left = rect.left + rect.width / 2 - w / 2;
    left = Math.min(Math.max(left, 16), Math.max(16, vw - w - 16));

    setStyle({ position: "fixed", top, left, width: w, opacity: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rect?.top, rect?.left, rect?.width, rect?.height, ...deps]);

  return style;
}

const PAD = 8;
const DIM = "rgba(8,20,19,0.6)";
// Fixed width for the anchored (non-mobile, non-modal) tooltip. Also applied
// directly as a CSS class on the wrapper div below, so its intrinsic size is
// always this—never dependent on how it happens to be styled at the moment
// something measures it (see the comment in usePopoverStyle above).
const TOOLTIP_WIDTH = 340;

export function SectionTour({ id, steps, enabled = true, autoStartDelay = 350 }: { id: SectionId; steps: TourStep[]; enabled?: boolean; autoStartDelay?: number }) {
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!enabled || hasSeenSectionTour(id)) return;
    const t = setTimeout(() => { setStepIndex(0); setActive(true); }, autoStartDelay);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, id]);

  // Self-heals if stepIndex ever ends up past the last real step—e.g. a
  // rapid double-click firing handlePrimary twice before a re-render lands,
  // each call reading the same pre-click "is this the last step" snapshot
  // and both incrementing. Without this, the component below just quietly
  // renders null (steps[stepIndex] is undefined) while `active` stays true
  // and markSectionTourSeen never fires—so the tour re-launches on the next
  // visit despite the student having genuinely just finished it.
  useEffect(() => {
    if (active && stepIndex >= steps.length) {
      markSectionTourSeen(id);
      setActive(false);
    }
  }, [active, stepIndex, steps.length, id]);

  function close() { markSectionTourSeen(id); setActive(false); }

  // Desktop convenience: Escape closes the tour like any other overlay.
  // Doesn't depend on `step`, so it's safe to declare above the early
  // return—every hook in this component runs unconditionally regardless.
  useEffect(() => {
    if (!active) return;
    function onKeyDown(e: KeyboardEvent) { if (e.key === "Escape") close(); }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const step = active ? steps[stepIndex] ?? null : null;
  const { rect, radius, settled } = useSpotlightTarget(step?.target ?? null);
  const popoverStyle = usePopoverStyle(rect, tooltipRef, [step?.id, isMobile]);

  if (!mounted || !active || !step) return null;

  const isLastStep = stepIndex === steps.length - 1;
  const hasSpotlight = !!step.target && settled && !!rect;
  // Progress bar/counter only ever counts real spotlight steps—Welcome/Finish
  // are bookends, not "tour content" a step counter should include, so a
  // 7-step dashboard tour with 2 modal bookends still shows "2 of 5", not a
  // confusing "3 of 7".
  const spotlightSteps = steps.filter(s => !!s.target);
  const spotlightPosition = spotlightSteps.findIndex(s => s.id === step.id);

  function handlePrimary() {
    step?.action?.();
    if (isLastStep) { close(); return; }
    // Clamped, not a bare i + 1: two handlePrimary calls landing before
    // either's re-render commits (a fast double-click, or two still-mounted
    // AnimatePresence exit-copies each firing their own stale closure) would
    // otherwise both read the same "not last" snapshot and both increment,
    // skipping straight past the true last index.
    setStepIndex(i => Math.min(i + 1, steps.length - 1));
  }
  function back() { if (stepIndex > 0) setStepIndex(i => i - 1); }

  const bodyParagraphs = step.body.split("\n\n");

  return createPortal(
    <div className="fixed inset-0 z-[100]" aria-live="polite">
      {/* Centered modal treatment: Welcome/Finish only. No mode="wait"
          here—that would hold the incoming step hidden behind the outgoing
          one's exit animation, which stalls if the tab is ever backgrounded
          mid-transition (requestAnimationFrame just pauses). Letting both
          render simultaneously means the new step is always immediately
          correct regardless of animation timing. */}
      {!step.target && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 p-4 backdrop-blur-[2px]">
        <AnimatePresence>
          <motion.div
            key={step.id}
            initial={{ opacity: 0, scale: 0.96, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97, y: -6 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative max-h-[85vh] w-full max-w-sm overflow-y-auto rounded-3xl border border-black/[0.06] bg-white p-8 text-center shadow-lift dark:border-white/10 dark:bg-[#0d1917] dark:shadow-none"
          >
            <button type="button" onClick={close} aria-label="Skip tour" className="absolute right-4 top-4 cursor-pointer text-slate-300 transition hover:text-slate-500 dark:text-slate-600 dark:hover:text-slate-400"><X size={16} /></button>

            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-teal-100 text-teal-600 dark:bg-teal-500/15 dark:text-teal-300"><Sparkles size={24} /></span>
            <h2 className="display mt-5 text-2xl text-heading dark:text-white">{step.title}</h2>
            <div className="mt-3 space-y-2.5">
              {bodyParagraphs.map(p => <p key={p} className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">{p}</p>)}
            </div>

            <button type="button" onClick={handlePrimary} className="mt-7 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-accent-500 px-6 py-3 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600">{step.nextLabel}</button>
            {!step.isFinish && <button type="button" onClick={close} className="mt-4 cursor-pointer text-xs font-bold text-slate-400 transition hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300">Skip tour</button>}
          </motion.div>
        </AnimatePresence>
      </div>}

      {/* Spotlight treatment: one box-shadow "ring" div does all the visual
          dimming, its border-radius read straight from the real target
          element—so a rounded card's highlight has rounded corners and a
          pill button's has fully round ones, never a mismatched hard-edged
          cutout. It's pointer-events:none (box-shadow doesn't hit-test
          anyway); four invisible strips around it do the actual click
          blocking, leaving the hole itself genuinely, natively clickable. */}
      {step.target && hasSpotlight && rect && <>
        <div
          className="pointer-events-none fixed z-[100] transition-[top,left,width,height] duration-200"
          style={{
            top: rect.top - PAD, left: rect.left - PAD, width: rect.width + PAD * 2, height: rect.height + PAD * 2,
            borderRadius: radius + PAD,
            boxShadow: `0 0 0 9999px ${DIM}, 0 0 0 3px rgba(15,139,141,0.55), 0 0 0 6px rgba(15,139,141,0.18)`
          }}
        />
        <div className="fixed inset-x-0 top-0 z-[100] pointer-events-auto" style={{ height: Math.max(0, rect.top - PAD) }} />
        <div className="fixed inset-x-0 bottom-0 z-[100] pointer-events-auto" style={{ height: Math.max(0, window.innerHeight - (rect.bottom + PAD)) }} />
        <div className="fixed z-[100] pointer-events-auto" style={{ top: rect.top - PAD, left: 0, width: Math.max(0, rect.left - PAD), height: rect.height + PAD * 2 }} />
        <div className="fixed z-[100] pointer-events-auto" style={{ top: rect.top - PAD, left: rect.right + PAD, right: 0, height: rect.height + PAD * 2 }} />
      </>}

      {step.target && !isMobile && <div
        ref={tooltipRef}
        style={hasSpotlight ? popoverStyle : { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}
        // w-[340px] lives here, as a real CSS class, not just inline
        // style—so the box is always this compact size, even for the one
        // frame before popoverStyle's own effect has run.
        className="z-[101] w-[340px] max-w-[calc(100vw-2rem)] pointer-events-auto"
      >
        <TourCard step={step} isLastStep={isLastStep} stepIndex={spotlightPosition} totalSteps={spotlightSteps.length} back={back} skip={close} onPrimary={handlePrimary} />
      </div>}

      {/* Mobile: an anchored tooltip has nowhere honest to sit on a narrow
          screen without covering the very thing it's explaining—a bottom
          sheet keeps the spotlighted element visible above it instead. */}
      {step.target && isMobile && <div className="fixed inset-x-0 bottom-0 z-[101] pointer-events-auto px-3 pb-3">
        <TourCard step={step} isLastStep={isLastStep} stepIndex={spotlightPosition} totalSteps={spotlightSteps.length} back={back} skip={close} onPrimary={handlePrimary} sheet />
      </div>}
    </div>,
    document.body
  );
}

// Only ever rendered for a spotlighted (non-modal) step, so a step count > 1
// always means Back is meaningful from the second step on, and totalSteps
// (spotlightSteps.length) always counts >= 1.
function TourCard({
  step, isLastStep, stepIndex, totalSteps, back, skip, onPrimary, sheet
}: {
  step: TourStep; isLastStep: boolean; stepIndex: number; totalSteps: number;
  back: () => void; skip: () => void; onPrimary: () => void; sheet?: boolean;
}) {
  const bodyParagraphs = step.body.split("\n\n");
  const current = stepIndex + 1;
  const remaining = Math.max(0, totalSteps - current);
  const progressPercent = totalSteps > 0 ? Math.round((current / totalSteps) * 100) : 100;
  // See the modal's identical note above on why this isn't mode="wait":
  // Next/Back must always show the correct step immediately, never held
  // behind an outgoing card's exit animation.
  return <AnimatePresence>
    <motion.div
      key={step.id}
      initial={sheet ? { opacity: 0, y: 24 } : { opacity: 0, y: 6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={sheet ? { opacity: 0, y: 24 } : { opacity: 0, y: -4, scale: 0.98 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className={`border border-[#EEF2F7] bg-white shadow-[0_16px_40px_-16px_rgba(15,23,42,0.25)] dark:border-white/10 dark:bg-[#0d1917] ${sheet ? "rounded-t-3xl p-5 pb-6" : "rounded-2xl p-5"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[15px] font-extrabold leading-snug text-heading dark:text-white">{step.title}</h3>
        {/* A clear, labeled skip control—not just a bare icon tucked in the
            corner—so ending the tour early is always obviously available,
            on every single spotlighted step. */}
        <button type="button" onClick={skip} className="flex shrink-0 cursor-pointer items-center gap-1 rounded-full px-2 py-1 text-[11px] font-bold text-slate-400 transition hover:bg-slate-50 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-white/5 dark:hover:text-slate-300">
          Skip<X size={12} />
        </button>
      </div>

      <div className="mt-2 space-y-2">
        {bodyParagraphs.map(p => <p key={p} className="text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">{p}</p>)}
      </div>

      {step.exampleChips && <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {step.exampleChips.map((chip, i) => <span key={chip} className="flex items-center gap-1.5">
          <span className="rounded-lg border border-teal-200 bg-teal-50 px-2.5 py-1 text-[11px] font-bold text-teal-700 dark:border-teal-500/25 dark:bg-teal-500/10 dark:text-teal-300">{chip}</span>
          {i < step.exampleChips!.length - 1 && <ArrowRight size={11} className="shrink-0 text-slate-300 dark:text-slate-600" />}
        </span>)}
      </div>}

      {/* Real progress bar, not dots—shows exactly how far through the tour
          this step is and how many are left, per the explicit requirement
          this replaces a small dot row for. */}
      {totalSteps > 1 && <div className="mt-4">
        <div className="flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wide text-slate-400 dark:text-slate-500">
          <span>Step {current} of {totalSteps}</span>
          <span>{remaining > 0 ? `${remaining} left` : "Last step"}</span>
        </div>
        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
          <div className="h-full rounded-full bg-teal-500 transition-[width] duration-300" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>}

      <div className="mt-4 flex items-center justify-end gap-2.5">
        {stepIndex > 0 && <button type="button" onClick={back} className="cursor-pointer text-xs font-bold text-slate-400 transition hover:text-heading dark:text-slate-500 dark:hover:text-white">Back</button>}
        <button type="button" onClick={onPrimary} className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-accent-500 px-4 py-2 text-xs font-bold text-white shadow-[0_10px_20px_-10px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600">{step.nextLabel}</button>
      </div>
    </motion.div>
  </AnimatePresence>;
}
