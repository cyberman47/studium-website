// Real, minimal cookie-consent record—no analytics or marketing tooling is
// actually wired up yet, so today this only ever gates the future addition
// of those (nothing currently reads consent.analytics/marketing to decide
// whether to fire a script). Essential storage (auth/session, your saved
// study data) is never gated behind consent, same as every real site's
// "strictly necessary" cookies.
//
// Note: this is "first time this browser has visited," not "first time this
// IP has visited"—Studium has no backend to track IPs against, and a
// consent banner keyed to IP wouldn't actually be more correct anyway (the
// law asks whether *this visitor* has been informed, not whether *this
// address* has). Every real cookie-consent implementation works this way.

export type CookieConsent = {
  analytics: boolean;
  marketing: boolean;
  decidedAt: string;
};

const KEY = "studium_cookie_consent";
export const COOKIE_CONSENT_EVENT = "studium:cookieConsentChange";

export function getCookieConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : null;
}

export function hasDecidedCookieConsent(): boolean {
  return getCookieConsent() !== null;
}

export function saveCookieConsent(choice: { analytics: boolean; marketing: boolean }) {
  if (typeof window === "undefined") return;
  const consent: CookieConsent = { ...choice, decidedAt: new Date().toISOString() };
  localStorage.setItem(KEY, JSON.stringify(consent));
  window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_EVENT));
}

export function acceptAllCookies() {
  saveCookieConsent({ analytics: true, marketing: true });
}

export function rejectNonEssentialCookies() {
  saveCookieConsent({ analytics: false, marketing: false });
}
