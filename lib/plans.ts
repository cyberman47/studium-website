// Single source of truth for Studium's real plan lineup and pricing—both
// the public marketing page (app/pricing) and the in-app upgrade flow
// (app/dashboard/settings/billing/upgrade) import from here, so the two
// surfaces can never quote different numbers for the same plan.

export type PlanId = "free" | "pro" | "max";
export type Billing = "monthly" | "yearly";

export type Plan = {
  id: PlanId;
  name: string;
  monthly: number;
  yearly: number | null;
  text: string;
  items: string[];
  popular?: boolean;
};

export const plans: Plan[] = [
  { id: "free", name: "Free", monthly: 0, yearly: null, text: "A better way to begin.", items: ["20 AI Tutor messages/mo", "1 AI quiz + 3 flashcard decks/mo", "Basic study planner"] },
  { id: "pro", name: "Pro", monthly: 12.99, yearly: 99.99, text: "For focused learners.", items: ["500 AI Tutor messages/mo", "Voice AI Tutor", "Personalized study planner", "Smart Review & Weakness Detection"], popular: true },
  { id: "max", name: "Max", monthly: 24.99, yearly: 199.99, text: "For big academic goals.", items: ["2,000 AI Tutor messages/mo", "Advanced AI models", "Adaptive AI learning paths", "Early access to new AI features"] }
];

// Every row from the plan comparison, faithfully carried over—text values
// (message caps, "Limited"/"Advanced" tiers) render as-is, true/false render
// as a check or dash. Monthly/Yearly price live in the plan cards above,
// not duplicated here.
export const comparison: [string, boolean | string, boolean | string, boolean | string][] = [
  ["AI Tutor", "20 messages/mo", "500 messages/mo", "2,000 messages/mo"],
  ["Voice AI Tutor", false, true, true],
  ["AI Quiz creation", "1/mo", "30/mo", "100/mo"],
  ["AI Flashcard decks", "3/mo", "30/mo", "100/mo"],
  ["AI Study Planner", "Basic", "Personalized", "Advanced + adaptive"],
  ["Document → study materials", "1/mo", "20/mo", "100/mo"],
  ["AI explanations", "Limited", true, "Advanced"],
  ["AI Learning Paths", "Limited", true, "Adaptive AI paths"],
  ["Smart Review", false, true, "Adaptive"],
  ["Weakness Detection", false, true, "Advanced AI analysis"],
  ["Daily Case", "Limited", true, "Unlimited"],
  ["Terminology", true, true, true],
  ["Progress Tracking", "Basic", "Advanced", "Advanced + AI insights"],
  ["Text-to-Speech", "Limited", true, "Unlimited"],
  ["Advanced AI models", false, false, true],
  ["Early access to new AI features", false, false, true]
];

export function formatPrice(n: number): string {
  return n % 1 === 0 ? `${n}` : n.toFixed(2);
}

export function getPlan(id: PlanId): Plan {
  return plans.find(p => p.id === id) ?? plans[0];
}
