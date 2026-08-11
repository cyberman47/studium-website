"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { LegalDocument, LegalSection, legalList } from "@/components/legal-document";
import { ToggleRow } from "@/components/ui";
import { CookieConsent, getCookieConsent, saveCookieConsent } from "@/lib/cookieConsent";

function PreferencesPanel() {
  // Post-mount only—getCookieConsent() reads localStorage, unavailable
  // during SSR, same hydration-safety pattern used everywhere else.
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    const existing = getCookieConsent();
    setConsent(existing);
    setAnalytics(existing?.analytics ?? false);
    setMarketing(existing?.marketing ?? false);
    setLoaded(true);
  }, []);

  function save() {
    saveCookieConsent({ analytics, marketing });
    setConsent(getCookieConsent());
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);
  }

  if (!loaded) return null;

  return <div className="mb-8 rounded-3xl border border-teal-100 bg-[#f9fcfc] p-5 sm:p-6">
    <p className="text-sm font-extrabold text-ink">Manage your cookie preferences</p>
    <p className="mt-1 text-xs leading-relaxed text-slate-500">
      {consent
        ? `You last made a choice on ${new Date(consent.decidedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}. You can change it below at any time.`
        : "You haven't made a choice yet in this browser—only essential cookies are in use. Set your preferences below."}
    </p>
    <div className="mt-4 divide-y divide-slate-100 rounded-2xl border border-slate-100 bg-white px-4">
      <ToggleRow label="Essential" desc="Always on—required to keep you signed in and the Service working." checked disabled />
      <ToggleRow label="Analytics" desc="Helps us understand how the Service is used, so we can improve it." checked={analytics} onChange={() => setAnalytics(v => !v)} />
      <ToggleRow label="Marketing" desc="Used to measure and personalize marketing, where applicable." checked={marketing} onChange={() => setMarketing(v => !v)} />
    </div>
    <div className="mt-4 flex items-center gap-3">
      <button type="button" onClick={save} className="cursor-pointer rounded-full bg-accent-500 px-5 py-2.5 text-xs font-bold text-white shadow-[0_10px_20px_-10px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600">Save preferences</button>
      {justSaved && <span className="flex items-center gap-1.5 text-xs font-bold text-teal-600"><Check size={14} />Saved</span>}
    </div>
  </div>;
}

export default function CookieSettingsPage() {
  return <LegalDocument title="Cookie Policy" lastUpdated="August 2, 2026">
    <PreferencesPanel />

    <LegalSection heading="1. What Are Cookies">
      <p>Cookies are small text files placed on your device when you visit a website. We also use similar technologies, such as local storage, which let us store information directly in your browser. This policy explains how and why we use them.</p>
    </LegalSection>

    <LegalSection heading="2. Types of Cookies We Use">
      <ul className={legalList}>
        <li><span className="font-bold text-ink">Essential cookies:</span> required for the Service to function, such as keeping you signed in and remembering security settings. The Service cannot function properly without these.</li>
        <li><span className="font-bold text-ink">Preference cookies:</span> remember choices you make, such as language or display settings, so you don't have to set them again.</li>
        <li><span className="font-bold text-ink">Analytics cookies:</span> help us understand how visitors use the Service, such as which pages are visited most, so we can improve it. Where required, these are only set with your consent.</li>
        <li><span className="font-bold text-ink">Marketing cookies:</span> may be used, where applicable, to measure the effectiveness of our marketing and show you relevant content on other platforms.</li>
      </ul>
    </LegalSection>

    <LegalSection heading="3. Third-Party Cookies">
      <p>Some cookies may be set by third-party services we use, such as analytics or payment providers. We do not control these cookies directly; please refer to the relevant third party's own cookie or privacy policy for more information.</p>
    </LegalSection>

    <LegalSection heading="4. Managing Your Cookie Preferences">
      <p>Use the panel above to accept or reject analytics and marketing cookies for this browser at any time. You can also control or delete cookies through your browser settings directly; most browsers let you block or clear cookies from their settings menu. Blocking essential cookies may affect your ability to use parts of the Service, such as staying signed in.</p>
    </LegalSection>

    <LegalSection heading="5. Changes to This Policy">
      <p>We may update this Cookie Policy from time to time to reflect changes in the cookies and technologies we use. We'll update the "Last updated" date above when we do.</p>
    </LegalSection>

    <LegalSection heading="6. Contact Us">
      <p>Questions about our use of cookies? Contact us at <a href="mailto:hello@studium.app" className="cursor-pointer font-bold text-teal-600 hover:text-teal-700">hello@studium.app</a>.</p>
    </LegalSection>
  </LegalDocument>;
}
