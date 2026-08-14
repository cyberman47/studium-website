"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie, X } from "lucide-react";
import { acceptAllCookies, hasDecidedCookieConsent, rejectNonEssentialCookies, saveCookieConsent } from "@/lib/cookieConsent";
import { ToggleRow } from "./ui";

// Mounted once, site-wide, in app/layout.tsx. Stays hidden until we know
// there's genuinely no decision on file for this browser (post-mount check,
// same hydration-safety pattern as every localStorage read in this app), so
// it can never flash for a returning visitor.
export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [managing, setManaging] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    setVisible(!hasDecidedCookieConsent());
  }, []);

  if (!visible) return null;

  function accept() { acceptAllCookies(); setVisible(false); }
  function reject() { rejectNonEssentialCookies(); setVisible(false); }
  function savePreferences() { saveCookieConsent({ analytics, marketing }); setVisible(false); }

  return <div className="fixed inset-x-0 bottom-0 z-[200] flex justify-center p-3 sm:bottom-4 sm:p-4">
    <div className="w-full max-w-2xl rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1917] p-5 shadow-lift sm:p-6">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-teal-50 dark:bg-teal-500/15 dark:text-teal-300 text-teal-600"><Cookie size={19} /></span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-extrabold text-heading">We use cookies</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            Studium uses essential cookies to keep you signed in and remember your progress. With your consent, we'd also like to use cookies for analytics and marketing to help us improve the Service. See our <Link href="/cookie-settings" className="cursor-pointer font-bold text-teal-600 hover:text-teal-700">Cookie Policy</Link> for details.
          </p>
        </div>
        <button type="button" onClick={reject} aria-label="Dismiss and keep only essential cookies" className="shrink-0 cursor-pointer rounded-full p-1.5 text-slate-300 transition hover:bg-slate-100 dark:bg-white/10 hover:text-heading"><X size={16} /></button>
      </div>

      {managing && <div className="mt-4 divide-y divide-slate-100 rounded-2xl border border-slate-100 dark:border-white/10 bg-[#f9fcfc] dark:bg-white/5 px-4">
        <ToggleRow label="Essential" desc="Always on—required to keep you signed in and the Service working." checked disabled />
        <ToggleRow label="Analytics" desc="Helps us understand how the Service is used, so we can improve it." checked={analytics} onChange={() => setAnalytics(v => !v)} />
        <ToggleRow label="Marketing" desc="Used to measure and personalize marketing, where applicable." checked={marketing} onChange={() => setMarketing(v => !v)} />
      </div>}

      <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
        {!managing && <button type="button" onClick={() => setManaging(true)} className="mr-auto cursor-pointer text-xs font-bold text-slate-500 transition hover:text-heading">Manage preferences</button>}
        {managing
          ? <button type="button" onClick={savePreferences} className="cursor-pointer rounded-full bg-accent-500 px-5 py-2.5 text-xs font-bold text-white shadow-[0_10px_20px_-10px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600">Save preferences</button>
          : <>
            <button type="button" onClick={reject} className="cursor-pointer rounded-full border border-slate-200 dark:border-white/10 px-5 py-2.5 text-xs font-bold text-heading transition hover:border-teal-200 hover:bg-[#f9fcfc] dark:bg-white/5">Reject non-essential</button>
            <button type="button" onClick={accept} className="cursor-pointer rounded-full bg-accent-500 px-5 py-2.5 text-xs font-bold text-white shadow-[0_10px_20px_-10px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600">Accept all</button>
          </>}
      </div>
    </div>
  </div>;
}
