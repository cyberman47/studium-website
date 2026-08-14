// The one shared "Knowledge gained" toast trigger—replaces the old
// per-feature floating "+N KP" green/teal text that used to be
// hand-rolled separately in half a dozen places (a highlighted term, a
// lesson completion, a review session, ...). Any real KP-awarding call
// site anywhere in the app calls showKnowledgeToast(amount) and the single
// <KnowledgeToastHost/> (mounted once in app/dashboard/layout.tsx, so it
// covers every dashboard route) picks it up—same lightweight
// window-CustomEvent pattern already used for cross-component signals
// elsewhere in this codebase (PROGRESS_EVENT, TERM_PROGRESS_EVENT, ...).
// Purely a presentation layer: it doesn't touch the real KP ledger at all,
// callers still go through lib/progress.ts exactly as before.
export const KP_TOAST_EVENT = "studium:kpToast";

export function showKnowledgeToast(amount: number) {
  if (typeof window === "undefined" || amount <= 0) return;
  window.dispatchEvent(new CustomEvent(KP_TOAST_EVENT, { detail: { amount } }));
}
