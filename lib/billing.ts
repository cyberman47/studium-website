// Demo-only plan/subscription state. There is no real payment processor
// wired into this app (see app/dashboard/settings/billing/page.tsx's own
// disclosure)—no Stripe, no card capture, no actual charge ever happens.
// Choosing a plan here just records which plan the UI should *say* this
// browser is on, so the rest of the app (Billing settings, this flow) has
// something honest and real-per-browser to read, instead of a screen that
// silently does nothing when pressed. Never presented as a completed
// purchase—see the confirmation copy in the upgrade page itself.
import { getPlan, Plan, PlanId } from "./plans";

const PLAN_KEY = "studium_demo_plan";
export const PLAN_CHANGE_EVENT = "studium:planChange";

export function getCurrentPlanId(): PlanId {
  if (typeof window === "undefined") return "free";
  const raw = localStorage.getItem(PLAN_KEY);
  return raw === "pro" || raw === "max" ? raw : "free";
}

export function getCurrentPlan(): Plan {
  return getPlan(getCurrentPlanId());
}

export function setCurrentPlanId(id: PlanId) {
  if (typeof window === "undefined") return;
  if (id === "free") localStorage.removeItem(PLAN_KEY);
  else localStorage.setItem(PLAN_KEY, id);
  window.dispatchEvent(new CustomEvent(PLAN_CHANGE_EVENT));
}
