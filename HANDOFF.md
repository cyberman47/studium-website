# Studium — Project Handoff

_Last updated: 2026-08-02. Written for a fresh Claude session to pick this project up with no prior context._

## 1. Project Overview

**Studium** is a website for an AI-powered study companion aimed at medical, pre-med, nursing, pharmacy, dentistry, and other health-track students. It's owned by **Eduardo Alvarez** (the user I'm working with — also written into the site as the fictional founder on the About page, so treat "Eduardo" in the codebase as both the real user and the in-universe founder).

The repo is public on GitHub: **github.com/cyberman47/studium-website** (account `cyberman47`), remote `origin`, branch `main`. `gh` CLI is authenticated on this machine. Push only when the user explicitly asks ("upload to github" / "save and push") — never proactively.

The project has two halves:
1. **Public marketing site** — landing page, pricing, careers, gift cards, legal pages, signup/login.
2. **A demo "dashboard" app** — what a logged-in student would see, including a full onboarding flow and a Settings area with its own nested sidebar.

**There is no real backend.** No database, no auth server, no payment processor, no AI, no email. Everything that looks like it "works" (accounts, streaks, preferences, profile edits) is genuinely functional in the sense that it reads/writes real browser `localStorage` and persists across reloads — but it's local to one browser, not synced anywhere, and not secure. This has been a deliberate, consistently-applied choice, and every place it matters has honest UI copy saying so (e.g. "no real backend behind it", "isn't connected yet"). **Keep this pattern** unless the user asks to wire up a real backend.

## 2. Tech Stack

- **Next.js 14** (App Router), **React 18**, **TypeScript** (strict mode, `paths: "@/*" → "./*"`)
- **Tailwind CSS 3** — no CSS modules, no styled-components; all styling is Tailwind utility classes inline in JSX
- **Framer Motion 11** — page/step transitions, dropdowns, accordions
- **lucide-react** — all icons except three hand-built brand SVGs (Apple, Google "G", TikTok — see §6)
- **next/font/google** — Figtree (headings/`display` class) + Noto Sans (body), loaded in `app/layout.tsx`
- No test framework, no CI, no linting enforced beyond `next lint` (not run regularly)
- Package manager: npm (`package-lock.json` present)

Run locally: `npm run dev` (port 3000). Verification workflow used throughout this project: `npx tsc --noEmit` after every change, then check it in the Browser pane before considering it done.

## 3. Architecture

### Routing structure
```
/                      Homepage (marketing)
/about /careers /careers/apply /pricing /gift-cards
/signup /login
/terms /privacy /cookie-settings /guidelines /acknowledgements /licenses /company-information
/onboarding            Post-signup quiz (redirects to /dashboard if already completed)
/dashboard             ← app shell, see below
```

### `/dashboard` — two independent sidebars via Next.js route groups
`app/dashboard/layout.tsx` is now a **thin shared shell**: just the header (Logo, Knowledge Points pill, account-avatar dropdown) + `{children}`. It does **not** render a sidebar itself. Two child areas each bring their own:

- **`app/dashboard/(main)/layout.tsx`** — the "Home / Library / AI Tutor / Flashcards" sidebar. Wraps:
  - `(main)/page.tsx` → `/dashboard` (Home)
  - `(main)/library/page.tsx` → `/dashboard/library`
  - `(main)/ai-tutor/page.tsx` → `/dashboard/ai-tutor`
  - `(main)/flashcards/page.tsx` → `/dashboard/flashcards`
  - (route group `(main)` doesn't affect the URL — `/dashboard` still resolves correctly)

- **`app/dashboard/settings/layout.tsx`** — a completely different sidebar (Account / Profile / Notifications / Points / Invite Friends / "App settings" group [General / Reader / Review / Languages] / Billing), plus a "Back to dashboard" link. Wraps 10 pages under `settings/*`.

This route-group pattern is the correct/idiomatic way to give sibling sections of an app different sidebars while sharing one header — **reuse it** if more distinct app sections are added later (don't go back to conditional-rendering-by-pathname inside one shared layout).

### Shared client-side "backend" (`lib/`)
- **`lib/onboarding.ts`** — user identity (`getUser`/`saveUser`/`updateUser`), onboarding answers (`getOnboardingAnswers`/`completeOnboarding`/`isOnboardingComplete`), the 5 onboarding question option lists (exported as `roleOptions`, `goalOptions`, `studyTimeOptions`, `studyMethodOptions`, `sourceOptions` — **the single source of truth**, used by both the onboarding quiz and the Profile editor so they can't drift out of sync), notification `Preferences`, and `AppSettings` (General/Reader/Review prefs).
- **`lib/progress.ts`** — the Knowledge Points / streak system. `recordVisit()` stamps today's date into `localStorage`; `getStreak()`, `getTotalKP()`, `getWeekLog()` derive everything else from that one array of date strings. This is **genuinely computed**, not faked — verified with seeded multi-day data mid-session (gap-day streak counting, KP totals, Mon–Sun placement all confirmed correct).

All `localStorage` keys are prefixed `studium_` (e.g. `studium_user`, `studium_onboarding_answers`, `studium_active_days`, `studium_preferences`, `studium_app_settings`).

### Shared UI components (`components/`)
- **`navigation.tsx`** — `Logo`, `LogoMark`, `Wordmark`, `LanguageBar` (marketing-site 6-language switcher, UI-only), `Navigation` (marketing site's fixed header + mobile menu).
- **`ui.tsx`** — grab-bag of reusable pieces: `PrimaryButton`, `Reveal` (scroll-in animation wrapper), `Field`/`inputClass` (form field styling used everywhere), `ToggleRow` (the pill switch, used across Notifications/General/Reader/Review), `OAuthButtons`, `AppleIcon`/`GooglePlayIcon`/`TikTokIcon` (hand-built brand SVGs).
- **`dashboard-shell.tsx`** — `UserMenu` (avatar dropdown), `KnowledgePoints` (streak pill + dropdown), and `StreakSummary` (the shared inner content both `KnowledgePoints`'s dropdown *and* the dashboard Home page's sidebar card *and* the Settings→Points page all render — extracted specifically to avoid duplicating the streak-display JSX three times).
- **`policy-page.tsx`** — one shared `<PolicyPage title="...">` component used by all 7 legal pages (Terms, Privacy, Cookie Settings, Guidelines, Acknowledgements, Licenses, Company Information). They're intentionally honest "we're still finalizing this" placeholders, **not real legal text** — see §8.

### Design tokens (`tailwind.config.ts` + `app/globals.css`)
- `ink` = `#102829` (near-black, used for dark sections/text)
- `teal` (custom, **not** Tailwind's default teal) — brand/identity color, `teal-500 = #0F8B8D`. Used for nav, badges, links, secondary buttons.
- `accent` (emerald-based) — `accent-500 = #059669`. Used **specifically for primary CTAs** ("Get started", "Sign up", "Resume Session", etc.) so brand-identity and call-to-action don't compete for the same color. This split came out of a deliberate design-system pass (see §7).
- `.container-page` (max-w-1200px) — marketing site width. `.dashboard-shell` (max-w-1440px) — wider, used for the whole `/dashboard` area to reduce dead whitespace in the app UI.
- `.display` class = Figtree font, used for all headings.
- Global `:focus-visible` ring, `prefers-reduced-motion` support, both added during the accessibility pass.

## 4. Completed Features (chronological, so you can see the shape of the project)

1. Inherited an initial teal/light Next.js marketing site from an earlier ChatGPT-assisted session and merged it in (favicon needed a real transparency fix — the original had a baked-in white background; also had to re-encode the PNG to fix a Next.js dev-loader chunking quirk, see §9).
2. Applied a real design-system pass using a third-party Claude Skill (`ui-ux-pro-max`, installed to `.claude/skills/`, safety-audited before use — no network calls, no eval/exec, pure local CSV lookup): resulted in the teal/accent color split, Figtree/Noto Sans typography, and an accessibility checklist (contrast, focus rings, 44px touch targets, `cursor-pointer` everywhere, reduced-motion support).
3. Careers page + full application form with drag-and-drop CV upload (client-side validation, simulated submit).
4. Signup/Login pages with email/password forms + Google/Apple "sign in" buttons that honestly say "isn't connected yet" on click rather than faking success. Real Apple logo and Google "G" logo built as SVGs (no npm icon package had accurate ones); official Apple/Google Play app-store badge **images** downloaded from Apple's/Google's own public asset URLs and self-hosted in `public/images/badges/` (used in the account dropdown).
5. 6-language switcher bar on the marketing site (flags + names), fully interactive UI, honestly reports "translation coming soon" — no i18n library, no translated strings exist.
6. About page rewritten around a founder quote/story/timeline for Eduardo Alvarez.
7. Pricing pulled off the homepage into its own `/pricing` page with a feature-comparison table and billing FAQ.
8. Gift cards: homepage teaser section + `/gift-cards` page (tier picker, recipient form, simulated send).
9. Footer: added a "Policies" column (7 legal pages) and social icons (Instagram/LinkedIn/TikTok — placeholder `href="#"`, user said they'll add real links later).
10. Fixed a real bug: the site logo used `href="#home"`, a same-page anchor, so clicking it did nothing on every page except the homepage. Now a real `next/link` to `/`.
11. **Onboarding flow** (`/onboarding`): welcome screen → 5 questions (role, goal, study time, study methods [multi-select], how they heard about us) → animated loading screen with rotating messages → redirect to `/dashboard`. Signup now redirects straight into this instead of showing its own success screen. Progress bar, skip-per-question, back button, Framer Motion transitions.
12. **Dashboard Home** redesigned per a detailed UI/UX brief into a 70/30 grid: hero "Jump back in" resume-session card, three stat widgets (SVG circular MCAT-countdown ring, mastery progress bar, cards-due stack visual), a "Weak Areas" action list with per-topic accuracy bars, a "Quick Launch" hub (replaced a redundant card grid that just repeated the sidebar), and a sticky right sidebar (streak summary + onboarding-derived profile snapshot).
13. **Knowledge Points (KP)** streak system — real, not decorative (see `lib/progress.ts` above).
14. Dashboard chrome (header + sidebar) recolored to `slate-50` so it visually separates from the white content cards (previously everything was near-white and felt flat).
15. **Settings area** — full second app section with its own sidebar and 10 pages (see §3 routing + component list above). Profile editing genuinely round-trips to the same storage the onboarding flow uses.

## 5. Current Folder Structure

```
app/
  about/page.tsx
  acknowledgements/page.tsx
  careers/page.tsx
  careers/apply/page.tsx
  company-information/page.tsx
  cookie-settings/page.tsx
  dashboard/
    layout.tsx                 ← shared header only
    (main)/
      layout.tsx                ← Home/Library/AI Tutor/Flashcards sidebar
      page.tsx                  ← Home
      library/page.tsx
      ai-tutor/page.tsx
      flashcards/page.tsx
    settings/
      layout.tsx                ← Settings-only sidebar
      page.tsx                  ← redirects to /dashboard/settings/account
      account/page.tsx
      profile/page.tsx
      notifications/page.tsx
      points/page.tsx
      invite/page.tsx
      general/page.tsx
      reader/page.tsx
      review/page.tsx
      languages/page.tsx
      billing/page.tsx
  gift-cards/page.tsx
  guidelines/page.tsx
  licenses/page.tsx
  login/page.tsx
  onboarding/page.tsx
  pricing/page.tsx
  privacy/page.tsx
  signup/page.tsx
  terms/page.tsx
  globals.css
  layout.tsx                    ← root layout, loads fonts
  page.tsx                      ← homepage
  icon.png                      ← favicon (Next.js file-convention)
components/
  dashboard-shell.tsx           ← UserMenu, KnowledgePoints, StreakSummary
  dashboard.tsx                 ← homepage's dashboard *mockup* (marketing illustration, not the real app)
  navigation.tsx                ← Logo, LanguageBar, Navigation (marketing header)
  policy-page.tsx                ← shared legal-page shell
  ui.tsx                        ← PrimaryButton, Field, ToggleRow, brand icons, etc.
lib/
  onboarding.ts                 ← user/answers/preferences storage + option lists
  progress.ts                   ← streak/KP engine
public/images/
  studium-logo.png, studium-wordmark.png
  badges/app-store-badge.svg, badges/google-play-badge.png
design-system/studium/MASTER.md ← generated design-system reference doc (from the ui-ux-pro-max skill run)
.claude/skills/ui-ux-pro-max/   ← the installed skill (gitignored — see .gitignore)
```

Note: `components/dashboard.tsx` (marketing mockup for the homepage hero) and `components/dashboard-shell.tsx` (real dashboard app chrome) are **different files with confusingly similar names** — don't conflate them.

## 6. Coding Conventions

- **Formatting**: the original codebase favors dense, single-line JSX-heavy function components (e.g. most of `app/page.tsx`). Newer files added this session (forms, settings pages) use more readable multi-line JSX. Both styles coexist; match whichever file you're editing rather than reformatting wholesale.
- `"use client"` at the top of any file using hooks/interactivity; plain server components otherwise (e.g. the legal pages, `(main)/library/page.tsx` etc.).
- Tailwind only — no separate CSS files except `globals.css` (base layer, `.container-page`/`.dashboard-shell`/`.eyebrow`/`.display` component classes, keyframes).
- Icons: `lucide-react` first; only build a custom SVG when the exact brand mark matters (Apple, Google, TikTok) and no accurate lucide icon exists.
- Every interactive element gets `cursor-pointer` explicitly (lucide/Tailwind don't add it by default) and a `focus-visible` state (global ring is defined in `globals.css`, so this is usually automatic — just don't `outline-none` without replacing it).
- Dropdowns/menus: click-to-toggle (not hover) is the established pattern (`UserMenu`, `KnowledgePoints`, settings toggles) — state via `useState` + a `mousedown` outside-click listener via `useRef`. See `components/dashboard-shell.tsx` for the canonical pattern to copy.
- `localStorage` access is always guarded with `typeof window === "undefined"` checks inside `lib/` functions (SSR-safety), and always called from inside `useEffect`, never at module scope or during render.
- Verification loop for every change: `npx tsc --noEmit` → check in Browser pane → only then consider it done. Don't claim something works without at least one of these.

## 7. Important Decisions & Rationale

- **No backend, ever, unless asked.** Every "account" feature is `localStorage`-backed and clearly labeled as a demo where relevant. This was set early and reinforced repeatedly — don't quietly start "faking" something as if it were real (e.g. don't make a button claim to send a real email).
- **Teal = brand, green = action.** Don't let both compete on the same element; this came from an actual design-system analysis, not a whim, and reversing it would undo a deliberate accessibility/hierarchy decision.
- **Real assets over recreations when trademarks are involved.** Apple/Google logos and app-store badges are either accurately hand-built (when only an SVG icon is needed) or the *actual official* downloaded images (when a "badge" with exact wording/proportions matters) — never a copied stock photo (one was explicitly declined mid-session because it was a copyrighted, watermarked Dreamstime image).
- **Onboarding option lists live in one place** (`lib/onboarding.ts`) specifically so the quiz and the later Profile editor can't drift apart.
- **Route groups for independent sidebars**, not conditional rendering in one shared layout — cleaner, and the pattern to extend if a third distinct app section is ever added.
- **Server push/commit only on explicit request.** The user corrected me early on to stop stopping the dev server after every change (leave it running), and separately expects git push only when they say so.

## 8. Remaining / Known-Incomplete Areas (things a user or future session will likely ask for next)

- **No real backend/auth/database.** Signup, login, onboarding data, streaks, settings — all local to one browser. Nothing syncs across devices; nothing is secure; refreshing on a different machine loses everything. This is the single biggest gap before any real launch.
- `/dashboard/library`, `/dashboard/ai-tutor`, `/dashboard/flashcards` are still empty "still building this section" placeholders.
- Dashboard Home's stats are illustrative, not computed from real activity: MCAT countdown (120/180 days), Cardiology Mastery (65%), Cards Due (42), Weak Areas accuracy %s, and the "Cardiac Physiology — 25 questions remaining" hero card are all hardcoded constants in `app/dashboard/(main)/page.tsx`.
- Quick Launch's "Q-Banks" tile and the "Practice" buttons on Weak Areas rows point to `href="#"` — no destination exists yet.
- OAuth buttons (Google/Apple) are UI-only everywhere they appear (signup, login).
- Language switching (marketing site's `LanguageBar` and the dashboard's Settings→Languages page) is UI-only — no i18n library, no translated copy.
- Billing/payments are not connected to any real processor; Gift Cards, Pricing "Get started", and Settings→Billing are all simulate-only.
- The 7 legal pages have **no real legal text** — intentionally left as honest placeholders since writing real Terms/Privacy content isn't something to fabricate. Needs a lawyer or the user's own drafted content before launch.
- No dark mode (Settings→Reader has a "Dark reading mode" toggle explicitly labeled "coming soon").
- Account deletion is explicitly disabled/placeholder in Settings→Account's danger zone.
- Footer social links (Instagram/LinkedIn/TikTok) and a few footer columns (Features, For educators, Help centre, Study guides, Community, Contact) still point to `#`.
- No automated tests exist; all verification this session was manual (type-check + live browser interaction).
- `github-upload-log.txt` and `publish-to-github-final.bat` are leftover artifacts from the very first ChatGPT-assisted export — harmless, could be deleted for tidiness but haven't been touched.

## 9. Known Gotchas (cost real debugging time — read before re-diagnosing from scratch)

1. **Never run `npm run build` while `next dev` is also running against the same `.next` folder on this Windows machine** — it corrupts the dev server's build output mid-flight (symptom: page renders as just the logo, or webpack "module not found" errors). Fix: stop the dev server, `rm -rf .next`, restart.
2. **A stale `node.exe` can keep holding port 3000** even after the harness reports the server "stopped" — if a bug persists identically across multiple edit+restart cycles, check `netstat -ano | grep :3000` and `tasklist`, and `taskkill //F //PID <pid>` any orphaned node process before assuming the code is wrong.
3. **`next-metadata-image-loader` sometimes logs a spurious "not a valid image file" error for `app/icon.png`** in the dev console even though the file is valid (verified via manual PNG chunk parsing) and the actual route serves fine (200, correct bytes). Cosmetic dev-only noise — don't chase it.
4. **React 18 Strict Mode double-invokes effects in dev.** A `useRef` "already started" guard to prevent double-setup is an anti-pattern that breaks things: first run sets up timers, the simulated cleanup clears them, the guard blocks the *second, real* run from re-arming them → the effect ends up doing nothing, permanently. (This exact bug shipped in the onboarding loading screen and had to be fixed by deleting the guard and trusting the cleanup function.)
5. **Framer Motion `AnimatePresence mode="wait"`** can appear to hang a step-based UI forever if the exiting element's animation never resolves (e.g. a backgrounded/unfocused browser tab throttles `requestAnimationFrame`). Prefer default (sync) mode, or `mode="popLayout"` when you also need to stop two overlapping elements from jumping the layout height during the transition (this exact combination — hang, then layout-jump once fixed — happened in the onboarding flow; `popLayout` fixed both).
6. **Automated testing of React controlled `<input>`s**: setting `element.value = x` directly and dispatching a plain `input` event does *not* reliably register with React. Use the native setter: `Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set.call(el, x)` before dispatching. (Not an app bug — only matters if you're scripting the browser to test forms.)
7. **The Browser preview pane's console log accumulates for the tab's whole lifetime.** An old error from three edits ago can resurface in a fresh read — always cross-check against actual current page content/behavior, not just console text.
8. **When the Browser pane isn't visually displayed/composited, Chrome throttles it heavily**, which can make clicks/animations/timers appear to hang indefinitely during automated verification. Not a real bug — try a fresh tab, longer waits, or direct handler invocation before concluding the app is broken.

## 10. How to Continue Seamlessly

- Read this file first, then skim `app/dashboard/(main)/page.tsx` and `app/dashboard/settings/layout.tsx` to see the two most structurally important recent additions.
- The user (Eduardo) generally drives feature-by-feature in plain language, sometimes pasting reference images or very detailed structured specs (treat both as real requirements to implement directly in the codebase, not just discuss).
- Always: implement → `npx tsc --noEmit` → verify live in the Browser pane → report back plainly what was verified vs. what's still illustrative/placeholder. Don't claim something works if you only confirmed it compiles.
- Don't push to GitHub or restart-stop the dev server proactively — wait to be asked, per §3/§7 conventions above.
