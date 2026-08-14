import type { Metadata } from "next";
import { Figtree, Noto_Sans } from "next/font/google";
import { CookieConsentBanner } from "@/components/cookie-consent-banner";
import "./globals.css";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const notoSans = Noto_Sans({ subsets: ["latin"], variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  title: "Studium — Learn your way",
  description: "Your intelligent study companion, designed around how you learn."
};

// Runs before React hydrates (a literal <head> script, not a component—
// lib/theme.ts can't run this early), so the "dark" class and native
// color-scheme are already correct on the very first paint instead of
// flashing light-then-dark for a returning dark-mode user. Default
// fallback is "light", not "system"—a brand-new visitor always lands in
// light mode regardless of OS preference; only an explicit Dark or
// System choice (made via the theme toggle) changes that from then on.
const themeInitScript = `(function(){try{var m=localStorage.getItem('studium_theme')||'light';var d=m==='dark'||(m==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d)document.documentElement.classList.add('dark');document.documentElement.style.colorScheme=d?'dark':'light';}catch(e){}})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${figtree.variable} ${notoSans.variable}`}>
    <head><script dangerouslySetInnerHTML={{ __html: themeInitScript }} /></head>
    <body>{children}<CookieConsentBanner /></body>
  </html>;
}
