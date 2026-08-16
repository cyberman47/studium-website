"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ChevronDown, Crown } from "lucide-react";
import { FEATURE_FLAGS_EVENT, isFlagEnabled } from "@/lib/featureFlags";
import { reconcileKPOnLoad, startLeaderboardSync } from "@/lib/leaderboardSync";
import { hasActiveChild, isNavItemActive, navGroups } from "@/lib/dashboardNav";
import { getCurrentPlanId, PLAN_CHANGE_EVENT } from "@/lib/billing";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Real feature-flag gate, not decorative: admin's Feature Management tab
  // writes to the same localStorage key isFlagEnabled() reads, so toggling
  // it there genuinely hides/shows this nav item on next render.
  const [aiTutorNavEnabled, setAiTutorNavEnabled] = useState(true);
  // "free" is the correct default even before the real plan loads client-side
  // (matches getCurrentPlanId()'s own signed-out/no-plan default), so this
  // never flashes the card for an already-paying visitor on first paint.
  const [isFreePlan, setIsFreePlan] = useState(true);
  // Manual expand/collapse override per collapsible item (keyed by href),
  // layered on top of the automatic "expanded because a child route is
  // active" state below—so clicking Community to collapse it while you're
  // still on one of its pages actually collapses it, instead of the active
  // child silently forcing it back open.
  const [expandOverride, setExpandOverride] = useState<Record<string, boolean>>({});

  useEffect(() => {
    function refresh() { setAiTutorNavEnabled(isFlagEnabled("ai_tutor_nav")); }
    refresh();
    window.addEventListener(FEATURE_FLAGS_EVENT, refresh);
    return () => window.removeEventListener(FEATURE_FLAGS_EVENT, refresh);
  }, []);

  // Real plan check—once a student is on Pro or Max, the upsell card has
  // nothing left to sell them, so it disappears rather than nagging someone
  // who already paid. Listens for the same event lib/billing.ts fires on
  // any plan change, so upgrading/downgrading updates this without reload.
  useEffect(() => {
    function refresh() { setIsFreePlan(getCurrentPlanId() === "free"); }
    refresh();
    window.addEventListener(PLAN_CHANGE_EVENT, refresh);
    return () => window.removeEventListener(PLAN_CHANGE_EVENT, refresh);
  }, []);

  // Real cross-device KP: catch this device up to whatever's already been
  // earned on the account (reconcile) *before* the ongoing sync starts
  // pushing this device's own numbers back up—then keep pushing every real
  // change for as long as they're anywhere in the dashboard. Both no-op
  // entirely for a signed-out/local-only visitor.
  useEffect(() => {
    let cancelled = false;
    let stopSync: (() => void) | null = null;
    reconcileKPOnLoad().finally(() => { if (!cancelled) stopSync = startLeaderboardSync(); });
    return () => { cancelled = true; stopSync?.(); };
  }, []);

  const visibleGroups = navGroups
    .map(group => ({ ...group, items: group.items.filter(item => item.flag !== "ai_tutor_nav" || aiTutorNavEnabled) }))
    .filter(group => group.items.length > 0);

  return <div className="dashboard-shell flex items-start gap-8">
    <aside className="hidden w-56 shrink-0 py-6 sm:block">
      {/* sticky wrapper holds both the nav and the Go Premium card so they
          scroll together as one unit, staying pinned once the page scrolls
          past them. Dark mode: the panel itself goes transparent/borderless
          so it blends into the page background rather than reading as a
          separate boxed-in card—only the active link's own teal-tinted
          highlight should pop, matching the reference dark design. */}
      <div className="sticky top-24 space-y-4">
        <nav data-tour="sidebar-nav" className="space-y-1 rounded-3xl border border-slate-200 bg-slate-50 p-3 dark:border-transparent dark:bg-transparent">
          {visibleGroups.map((group, i) => <div key={group.label ?? `ungrouped-${i}`} className={i > 0 ? "pt-3" : ""}>
            {group.label && <p className="px-3 pb-1 pt-1 text-[10px] font-extrabold uppercase tracking-wide text-slate-400 dark:text-slate-500">{group.label}</p>}
            <div className="space-y-1">
              {group.items.map(item => {
                if (item.children) {
                  const activeChild = hasActiveChild(pathname ?? "", item);
                  const expanded = expandOverride[item.href] ?? activeChild;
                  return <div key={item.href}>
                    <button
                      type="button"
                      data-tour={item.tourId}
                      onClick={() => setExpandOverride(prev => ({ ...prev, [item.href]: !expanded }))}
                      aria-expanded={expanded}
                      className={`flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-bold transition ${activeChild ? "text-teal-700 dark:text-teal-300" : "text-slate-600 hover:bg-white hover:text-heading dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"}`}
                    >
                      <item.icon size={18} className={activeChild ? "text-teal-600 dark:text-teal-300" : "text-slate-400 dark:text-slate-500"} />
                      <span className="flex-1">{item.label}</span>
                      <ChevronDown size={15} className={`shrink-0 text-slate-400 transition-transform dark:text-slate-500 ${expanded ? "rotate-180" : ""}`} />
                    </button>
                    {expanded && <div className="ml-4 mt-0.5 space-y-0.5 border-l border-slate-200 pl-3 dark:border-white/10">
                      {item.children.map(child => {
                        const childActive = isNavItemActive(pathname ?? "", child.href);
                        return <Link key={child.href} href={child.href} data-tour={child.tourId} className={`flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-bold transition ${childActive ? "bg-teal-50 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300" : "text-slate-500 hover:bg-white hover:text-heading dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"}`}>
                          <child.icon size={16} className={childActive ? "text-teal-600 dark:text-teal-300" : "text-slate-400 dark:text-slate-500"} />{child.label}
                        </Link>;
                      })}
                    </div>}
                  </div>;
                }

                const active = isNavItemActive(pathname ?? "", item.href);
                // rounded-lg (not -xl) + py-3: Chromium excludes a rounded
                // corner's cut-off triangle from an element's own hit-test
                // area, so clicks near a corner fell through to the
                // non-interactive wrapping div instead of this link—verified
                // directly (elementFromPoint at the corner hit the parent,
                // and returned this link the instant border-radius was
                // zeroed). A smaller radius shrinks that dead zone; the
                // taller target (py-3, ~44px) also gives more roundable
                // margin for error, matching standard touch-target sizing.
                return <Link key={item.href} href={item.href} data-tour={item.tourId} className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-3 text-sm font-bold transition ${active ? "bg-teal-50 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300" : "text-slate-600 hover:bg-white hover:text-heading dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"}`}>
                  <item.icon size={18} className={active ? "text-teal-600 dark:text-teal-300" : "text-slate-400 dark:text-slate-500"} />{item.label}
                </Link>;
              })}
            </div>
          </div>)}
        </nav>

        {/* Go Premium — links straight to the real Subscription/billing
            settings page (app/dashboard/settings/billing); no fabricated
            plan/pricing copy lives here, just the upsell entry point. Hidden
            entirely once the student is actually on Pro or Max—nothing left
            to upsell a paying member. */}
        {isFreePlan && <Link href="/dashboard/settings/billing" className="group flex cursor-pointer flex-col gap-2 rounded-2xl border border-teal-100 bg-teal-50/60 p-4 transition hover:border-teal-200 hover:bg-teal-50 dark:border-teal-500/15 dark:bg-teal-500/[0.06] dark:hover:border-teal-500/30 dark:hover:bg-teal-500/10">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-teal-600 text-white dark:bg-teal-500/90"><Crown size={16} fill="currentColor" /></span>
          <span>
            <span className="flex items-center gap-1.5 text-sm font-extrabold text-heading dark:text-white">Go Premium<ArrowRight size={13} className="text-teal-600 transition group-hover:translate-x-0.5 dark:text-teal-300" /></span>
            <span className="mt-0.5 block text-xs font-bold text-slate-500 dark:text-slate-400">Unlock all features</span>
          </span>
        </Link>}
      </div>
    </aside>
    <div className="min-w-0 flex-1">{children}</div>
  </div>;
}
