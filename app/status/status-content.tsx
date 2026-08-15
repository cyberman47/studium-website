"use client";

import Link from "next/link";

// Internal handoff/status page content — a Client Component because
// styled-jsx (used for the page's scoped CSS) requires one. The route's
// page.tsx stays a Server Component so it can export real metadata; this
// file is deliberately outside the dashboard shell (no student sidebar, no
// admin chrome), since it's meant to be read by someone who isn't logged
// in. Every number and feature claim here was checked against the live
// app, not recalled from memory. Update this page whenever a major feature
// lands or a "gated" item becomes real.
export function StatusContent() {
  return <div className="status-page">
    <style jsx>{`
      .status-page {
        --ink: #102829;
        --paper: #fcfdfd;
        --paper-raised: #ffffff;
        --muted: #5b7473;
        --muted-2: #8ba09f;
        --line: #dbe6e5;
        --line-soft: #eaf2f1;
        --teal-50: #effbfa;
        --teal-100: #d7f3f1;
        --teal-500: #0f8b8d;
        --teal-600: #087478;
        --teal-700: #075f63;
        --accent-600: #047857;
        --status-live-fg: #166534;
        --status-live-bg: #eefaf1;
        --status-live-line: #bfe6cc;
        --status-gated-fg: #92400e;
        --status-gated-bg: #fdf6ec;
        --status-gated-line: #f0ddb8;
        --status-admin-fg: #5b21b6;
        --status-admin-bg: #f6f1fd;
        --status-admin-line: #ded0f5;
        --shadow-soft: 0 18px 45px -28px rgba(16, 40, 41, .28);

        background: var(--paper);
        color: var(--ink);
        font-family: Charter, "Iowan Old Style", "Palatino Linotype", Georgia, "Noto Serif", serif;
        font-size: 16.5px;
        line-height: 1.65;
        -webkit-font-smoothing: antialiased;
        min-height: 100vh;
      }
      .status-page :global(*) { box-sizing: border-box; }
      .tabular { font-variant-numeric: tabular-nums; }

      .back-link {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-family: -apple-system, "Segoe UI", ui-sans-serif, sans-serif;
        font-size: 12.5px;
        font-weight: 700;
        color: var(--muted);
        text-decoration: none;
        padding: 16px 28px 0;
        max-width: 1180px;
        margin: 0 auto;
      }
      .back-link:hover { color: var(--teal-700); }

      .status-page :global(a) { color: var(--teal-700); }

      .shell {
        display: grid;
        grid-template-columns: 240px minmax(0, 1fr);
        gap: 56px;
        max-width: 1180px;
        margin: 0 auto;
        padding: 24px 28px 100px;
      }
      @media (max-width: 880px) {
        .shell { grid-template-columns: 1fr; }
        .toc { display: none; }
      }

      /* ---- Sticky TOC ---- */
      .toc { position: sticky; top: 32px; align-self: start; }
      .toc-eyebrow {
        font: 700 11px/1 -apple-system, "Segoe UI", sans-serif;
        letter-spacing: .09em;
        text-transform: uppercase;
        color: var(--muted-2);
        margin: 0 0 14px;
      }
      .toc ol { list-style: none; margin: 0; padding: 0; border-left: 1px solid var(--line); }
      .toc li { margin: 0; }
      .toc :global(a) {
        display: block;
        font-family: -apple-system, "Segoe UI", ui-sans-serif, sans-serif;
        font-size: 13px;
        font-weight: 600;
        color: var(--muted);
        text-decoration: none;
        padding: 7px 0 7px 16px;
        border-left: 2px solid transparent;
        margin-left: -1px;
        transition: color .15s, border-color .15s;
      }
      .toc :global(a):hover { color: var(--teal-700); border-left-color: var(--line); }
      .toc .num { color: var(--muted-2); font-variant-numeric: tabular-nums; margin-right: 6px; }

      /* ---- Header ---- */
      .masthead {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: 24px;
        flex-wrap: wrap;
        padding-bottom: 26px;
        border-bottom: 1px solid var(--line);
        margin-bottom: 40px;
      }
      .wordmark {
        font-family: -apple-system, "Segoe UI", ui-sans-serif, sans-serif;
        font-weight: 800;
        letter-spacing: -0.03em;
        font-size: 34px;
        margin: 0 0 6px;
      }
      .wordmark span { color: var(--teal-600); }
      .kicker {
        font-family: -apple-system, "Segoe UI", ui-sans-serif, sans-serif;
        font-size: 14px;
        color: var(--muted);
        margin: 0;
        max-width: 46ch;
      }
      .meta-block { text-align: right; font-family: -apple-system, "Segoe UI", ui-sans-serif, sans-serif; }
      .meta-block .date { font-size: 12px; font-weight: 700; color: var(--muted-2); text-transform: uppercase; letter-spacing: .06em; }
      .swatches { display: flex; gap: 5px; margin-top: 10px; justify-content: flex-end; }
      .swatch { width: 16px; height: 16px; border-radius: 4px; box-shadow: inset 0 0 0 1px rgba(0,0,0,.08); }

      /* ---- Sections ---- */
      .status-page :global(section) { margin-bottom: 54px; scroll-margin-top: 24px; }
      .status-page :global(section > h2) {
        font-family: -apple-system, "Segoe UI", ui-sans-serif, sans-serif;
        font-weight: 800;
        letter-spacing: -0.02em;
        font-size: 22px;
        margin: 0 0 4px;
        text-wrap: balance;
        display: flex;
        align-items: baseline;
        gap: 10px;
      }
      .status-page :global(section > h2 .idx) {
        font-variant-numeric: tabular-nums;
        color: var(--teal-500);
        font-size: 14px;
        font-weight: 700;
      }
      .status-page :global(section > .dek) {
        font-family: -apple-system, "Segoe UI", ui-sans-serif, sans-serif;
        font-size: 13.5px;
        color: var(--muted);
        margin: 0 0 22px;
        max-width: 62ch;
      }
      .status-page :global(h3) {
        font-family: -apple-system, "Segoe UI", ui-sans-serif, sans-serif;
        font-weight: 700;
        font-size: 15.5px;
        letter-spacing: -0.01em;
        margin: 26px 0 8px;
      }
      .status-page :global(p) { max-width: 68ch; margin: 0 0 14px; }
      .status-page :global(ul.plain) { max-width: 68ch; padding-left: 1.1em; margin: 0 0 14px; }
      .status-page :global(ul.plain li) { margin-bottom: 6px; }
      .status-page :global(strong) { font-weight: 700; }

      /* ---- Status chips ---- */
      .status-page :global(.chip) {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        font-family: -apple-system, "Segoe UI", ui-sans-serif, sans-serif;
        font-size: 10.5px;
        font-weight: 700;
        letter-spacing: .02em;
        padding: 2px 8px 3px;
        border-radius: 20px;
        border: 1px solid;
        white-space: nowrap;
      }
      .status-page :global(.chip::before) { content: ""; width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
      .status-page :global(.chip.live) { color: var(--status-live-fg); background: var(--status-live-bg); border-color: var(--status-live-line); }
      .status-page :global(.chip.gated) { color: var(--status-gated-fg); background: var(--status-gated-bg); border-color: var(--status-gated-line); }
      .status-page :global(.chip.admin) { color: var(--status-admin-fg); background: var(--status-admin-bg); border-color: var(--status-admin-line); }

      /* ---- Feature table ---- */
      .status-page :global(.ftable) { width: 100%; border-collapse: collapse; margin: 4px 0 22px; font-family: -apple-system, "Segoe UI", ui-sans-serif, sans-serif; font-size: 13.5px; }
      .status-page :global(.ftable th) {
        text-align: left; font-size: 10.5px; text-transform: uppercase; letter-spacing: .07em;
        color: var(--muted-2); font-weight: 700; padding: 0 12px 8px 0; border-bottom: 1px solid var(--line);
      }
      .status-page :global(.ftable td) { padding: 11px 12px 11px 0; border-bottom: 1px solid var(--line-soft); vertical-align: top; }
      .status-page :global(.ftable tr:last-child td) { border-bottom: none; }
      .status-page :global(.ftable td.name) { font-weight: 700; white-space: nowrap; }
      .status-page :global(.ftable td.desc) { color: var(--muted); max-width: 46ch; }
      .scroll-x { overflow-x: auto; }

      /* ---- Mock UI previews (real color values, not screenshots) ---- */
      .mock-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin: 6px 0 24px; }
      .mock {
        border: 1px solid var(--line);
        border-radius: 14px;
        background: var(--paper-raised);
        box-shadow: var(--shadow-soft);
        overflow: hidden;
        font-family: -apple-system, "Segoe UI", ui-sans-serif, sans-serif;
      }
      .mock-cap { font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: var(--muted-2); padding: 10px 14px 0; margin: 0; }

      .mock-card { padding: 16px; }
      .mock-eyebrow { display: inline-flex; align-items: center; gap: 5px; font-size: 10px; font-weight: 800; color: var(--teal-700); background: var(--teal-50); padding: 3px 8px; border-radius: 20px; }
      .mock-title { font-weight: 800; font-size: 15px; margin: 8px 0 4px; letter-spacing: -0.01em; }
      .mock-line { height: 6px; background: var(--line-soft); border-radius: 3px; margin-bottom: 6px; }
      .w60 { width: 60%; } .w80 { width: 80%; } .w40 { width: 40%; }
      .mock-btn { display: inline-block; margin-top: 10px; background: var(--accent-600); color: white; font-size: 11px; font-weight: 700; padding: 6px 14px; border-radius: 20px; }

      .mock-flash { padding: 0; }
      .mock-flash .top { height: 3px; background: var(--line-soft); }
      .mock-flash .top i { display: block; width: 40%; height: 100%; background: var(--teal-500); }
      .mock-flash .body { padding: 18px; text-align: center; }
      .mock-flash .card { border: 1px solid var(--line); border-radius: 14px; padding: 22px 14px; margin: 10px 0; }
      .mock-flash .card b { font-size: 14px; }
      .mock-flash .row { display: flex; gap: 6px; margin-top: 10px; }
      .mock-flash .r { flex: 1; border: 1.5px solid var(--line); border-radius: 10px; padding: 6px 0; font-size: 9px; font-weight: 800; text-align: center; color: var(--muted); }
      .mock-flash .r.on { background: var(--teal-600); color: #fff; border-color: var(--teal-600); }
      .counter-row { display: flex; justify-content: space-between; font-size: 9px; font-weight: 800; color: var(--muted); }

      .mock-admin { padding: 14px; background: #0e1620; color: #cfe0df; }
      .mock-admin .stat { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,.08); font-size: 11.5px; }
      .mock-admin .stat:last-child { border: none; }
      .mock-admin .stat b { font-family: inherit; font-variant-numeric: tabular-nums; color: #fff; }
      .mock-admin .stat span { color: #8aa3a1; }

      .mock-tutor { padding: 14px; }
      .mock-tutor .seg { display: flex; gap: 4px; background: var(--teal-50); border-radius: 10px; padding: 3px; margin-bottom: 10px; }
      .mock-tutor .seg div { flex: 1; text-align: center; font-size: 9px; font-weight: 700; padding: 5px 0; border-radius: 7px; color: var(--muted); }
      .mock-tutor .seg div.on { background: var(--paper-raised); color: var(--teal-700); box-shadow: 0 1px 3px rgba(0,0,0,.08); }
      .mock-tutor .bubble { font-size: 10.5px; border-radius: 12px; padding: 8px 10px; margin-bottom: 6px; max-width: 85%; }
      .mock-tutor .bubble.user { background: var(--teal-600); color: #fff; margin-left: auto; }
      .mock-tutor .bubble.ai { background: var(--line-soft); color: var(--muted); }

      /* ---- Callouts ---- */
      .note {
        border: 1px solid var(--line);
        border-left: 3px solid var(--teal-500);
        background: var(--teal-50);
        border-radius: 4px;
        padding: 14px 18px;
        font-family: -apple-system, "Segoe UI", ui-sans-serif, sans-serif;
        font-size: 13.5px;
        color: var(--ink);
        max-width: 68ch;
        margin: 8px 0 20px;
      }
      .note b { color: var(--teal-700); }

      .rule { border: none; border-top: 1px solid var(--line); margin: 56px 0 40px; }

      .colophon {
        font-family: -apple-system, "Segoe UI", ui-sans-serif, sans-serif;
        font-size: 12px;
        color: var(--muted-2);
        border-top: 1px solid var(--line);
        padding-top: 18px;
        margin-top: 20px;
      }
    `}</style>

    <Link href="/dashboard" className="back-link">← Back to Studium</Link>

    <div className="shell">
      <nav className="toc">
        <p className="toc-eyebrow">On this page</p>
        <ol>
          <li><a href="#overview"><span className="num">01</span>What Studium Is</a></li>
          <li><a href="#architecture"><span className="num">02</span>Architecture</a></li>
          <li><a href="#marketing"><span className="num">03</span>Marketing &amp; Onboarding</a></li>
          <li><a href="#dashboard"><span className="num">04</span>Student Dashboard</a></li>
          <li><a href="#lessons"><span className="num">05</span>Learning Paths &amp; Lessons</a></li>
          <li><a href="#tutor"><span className="num">06</span>Studium AI Tutor</a></li>
          <li><a href="#terminology"><span className="num">07</span>Terminology System</a></li>
          <li><a href="#cases"><span className="num">08</span>Clinical Case of the Day</a></li>
          <li><a href="#progress"><span className="num">09</span>Progress &amp; Gamification</a></li>
          <li><a href="#admin"><span className="num">10</span>Internal Ops / Admin</a></li>
          <li><a href="#honesty"><span className="num">11</span>Real vs. Gated</a></li>
        </ol>
      </nav>

      <main>
        <header className="masthead">
          <div>
            <h1 className="wordmark">Studi<span>u</span>m</h1>
            <p className="kicker">Product status summary — an AI-assisted study companion for medical, MCAT, nursing, and anatomy students. Prepared for handoff review.</p>
          </div>
          <div className="meta-block">
            <p className="date">Status Summary</p>
            <div className="swatches">
              <span className="swatch" style={{ background: "#0f8b8d" }} />
              <span className="swatch" style={{ background: "#047857" }} />
              <span className="swatch" style={{ background: "#102829" }} />
              <span className="swatch" style={{ background: "#d7f3f1" }} />
            </div>
          </div>
        </header>

        <section id="overview">
          <h2><span className="idx">01</span>What Studium Is</h2>
          <p>Studium is a browser-based study companion built around <strong>active recall, spaced repetition, and an always-available AI tutor</strong>. A student picks a track — Medical School, MCAT, Nursing, or Anatomy — and works through lessons, flashcards, a daily clinical case, and a growing medical terminology library, with knowledge points, streaks, and levels tracking progress along the way.</p>
          <p>The whole app runs as a Next.js front end with <strong>no server-side database</strong>: every piece of student data lives in that browser&apos;s <code>localStorage</code>. That constraint shapes almost every design decision below, and Section 11 lays out exactly what that means in practice.</p>
        </section>

        <section id="architecture">
          <h2><span className="idx">02</span>Architecture, in Brief</h2>
          <div className="scroll-x">
            <table className="ftable">
              <tbody>
                <tr><th>Layer</th><th>Choice</th><th>Notes</th></tr>
                <tr><td className="name">Framework</td><td>Next.js 14, App Router</td><td className="desc">Route groups separate the marketing shell, the standard dashboard shell, and two purpose-built full-bleed layouts (the split-screen lesson view and the admin console).</td></tr>
                <tr><td className="name">Styling</td><td>Tailwind CSS</td><td className="desc">Custom palette extends Tailwind with the app&apos;s own <code>teal</code>, <code>accent</code>, and <code>ink</code> scales (see swatches above).</td></tr>
                <tr><td className="name">Motion</td><td>Framer Motion</td><td className="desc">Card flips, panel collapses, modal transitions, reward pulses.</td></tr>
                <tr><td className="name">Persistence</td><td>Browser <code>localStorage</code></td><td className="desc">~40 typed data modules under <code>lib/</code>, each owning one real feature&apos;s storage schema and mutation functions.</td></tr>
                <tr><td className="name">Backend</td><td>None</td><td className="desc">No API routes, no database, no auth server. Every &quot;account&quot; is local to one browser.</td></tr>
              </tbody>
            </table>
          </div>
          <div className="note"><b>Design principle followed throughout:</b> nothing in the product fakes a number or a response. Where a feature would need real infrastructure that doesn&apos;t exist yet (a live AI model, a multi-user backend), the UI says so plainly instead of simulating it. See Section 11.</div>
        </section>

        <section id="marketing">
          <h2><span className="idx">03</span>Marketing &amp; Onboarding</h2>
          <p className="dek">The public-facing shell before a student signs in.</p>
          <ul className="plain">
            <li><strong>Landing page</strong> — product pitch, feature highlights, calls to action into signup.</li>
            <li><strong>Pricing, gift cards</strong> — plan comparison and gift-card purchase flow (UI-complete; no live payment processor connected).</li>
            <li><strong>Legal &amp; company pages</strong> — Terms, Privacy, Cookie Settings, Guidelines, Licenses, Acknowledgements, About, Company Information, Careers.</li>
            <li><strong>Auth</strong> — Login and Signup screens, feeding into a guided <strong>onboarding flow</strong> that captures role (med student, pre-med, nursing, pharmacy, dentistry…), goals, and study preferences, then routes the student into their dashboard with a track pre-selected.</li>
          </ul>
        </section>

        <section id="dashboard">
          <h2><span className="idx">04</span>Student Dashboard</h2>
          <p className="dek">The shared shell every logged-in page lives inside, plus the home screen itself.</p>
          <h3>Shell</h3>
          <ul className="plain">
            <li>Top header: logo, global command search, current-path switcher, study-streak indicator, notifications bell, account menu.</li>
            <li>Left sidebar: Home, Learning Paths, Library, Create, Terminology, Studium AI, Progress.</li>
            <li>Full Settings area on its own route: Account, Profile, General, Billing, Notifications, Languages, Reader, Points, Review, Invite.</li>
          </ul>
          <h3>Home</h3>
          <p>A single real-time snapshot: the &quot;Continue Studying&quot; card (next lesson, % complete), today&apos;s Knowledge Points and level, the day&apos;s clinical case, and the day&apos;s Study Plan — a personalized checklist assembled from whatever the student actually has due (lesson, flashcards, terminology review, practice questions), not a fixed script.</p>
        </section>

        <section id="lessons">
          <h2><span className="idx">05</span>Learning Paths &amp; Lessons</h2>
          <p className="dek">Four tracks; one has real, completable lesson content today.</p>
          <div className="scroll-x">
            <table className="ftable">
              <tbody>
                <tr><th>Track</th><th>Structure</th><th>Status</th></tr>
                <tr><td className="name">MCAT</td><td className="desc">4 sections → subjects → lessons. Biology has 9 real lessons written; the rest are real, browsable placeholders.</td><td><span className="chip live">1 lesson live</span></td></tr>
                <tr><td className="name">Medical School</td><td className="desc">Real topic structure, content not yet authored.</td><td><span className="chip gated">Structure only</span></td></tr>
                <tr><td className="name">Nursing</td><td className="desc">Real topic structure, content not yet authored.</td><td><span className="chip gated">Structure only</span></td></tr>
                <tr><td className="name">Anatomy</td><td className="desc">Real region structure, content not yet authored.</td><td><span className="chip gated">Structure only</span></td></tr>
              </tbody>
            </table>
          </div>

          <h3>The lesson experience</h3>
          <p>A completed lesson (e.g. MCAT → Biology → <em>Scientific Method</em>) walks: <strong>Read → Flashcards → Practice → AI Review → Complete</strong>. Two rounds of feedback reshaped this from its first version:</p>
          <ul className="plain">
            <li>The reading step used to be a stack of separate boxed cards with a distinct &quot;Key Takeaways&quot; step and a &quot;Knowledge Check&quot; step after it. It&apos;s now <strong>one continuous document</strong> — section headings, flowing text, an inline glossary per section, and the lesson&apos;s real key takeaways folded in as a summary callout at the end. Knowledge Check was cut entirely.</li>
            <li>Flashcards default to an inline flip-card, with a <strong>fullscreen toggle</strong> that expands into the same Focus Mode described in Section 07 — hiding the app chrome entirely — and collapses back without losing your place in the deck.</li>
            <li>Highlighting any sentence in the reading opens a real action menu: <strong>Explain</strong>, <strong>Create Flashcard</strong>, <strong>Connect Concepts</strong> (looks up real terminology-database matches), <strong>Ask AI</strong>, <strong>Save</strong>.</li>
          </ul>
        </section>

        <section id="tutor">
          <h2><span className="idx">06</span>Studium AI Tutor</h2>
          <p className="dek">A persistent, context-aware panel docked beside the lesson — closed by default, one click away.</p>

          <div className="mock-row">
            <div className="mock">
              <p className="mock-cap">Tutor panel</p>
              <div className="mock-tutor">
                <div className="seg"><div className="on">Tutor</div><div>Socratic</div><div>MCAT</div><div>Simplify</div></div>
                <div className="mock-line w80" style={{ height: 8, marginBottom: 10 }} />
                <div className="mock-line w40" />
                <div className="bubble user">I don&apos;t understand: &quot;Hypothesis&quot;</div>
                <div className="bubble ai">A hypothesis is a specific, testable explanation—it has to be falsifiable, meaning an experiment could actually prove it wrong…</div>
              </div>
            </div>
            <div className="mock">
              <p className="mock-cap">Lesson card</p>
              <div className="mock-card">
                <span className="mock-eyebrow">Beginner</span>
                <div className="mock-title">Scientific Method</div>
                <div className="mock-line w80" />
                <div className="mock-line w60" />
                <div className="mock-btn">Continue to Flashcards</div>
              </div>
            </div>
          </div>

          <ul className="plain">
            <li><strong>Four modes</strong> — Tutor, Socratic, MCAT, Simplify — a real, persisted preference that shapes how a reply would be framed.</li>
            <li><strong>Real context, every message</strong> — subject, section, lesson, current step, and (in Flashcards) the exact card on screen. Asking &quot;I don&apos;t understand&quot; on the &quot;Hypothesis&quot; card produces a response scoped to <em>that card</em>, not a generic one.</li>
            <li><strong>Quick actions</strong> — Explain this, Give me a hint, Why is this important?, Explain simply, Make a mnemonic, How would the MCAT test this?</li>
            <li><strong>Proactive tips</strong> — drawn from the lesson&apos;s own real key takeaways and key terms, and from real recent performance (e.g. two missed practice questions in a row), never invented.</li>
            <li><strong>Saved / My Cards tabs</strong> — highlights saved from the reading, and personal flashcards built from a highlight&apos;s text.</li>
            <li>Collapses to a slim re-open tab; the reading column genuinely widens to fill the freed space rather than leaving empty margin.</li>
          </ul>
          <div className="note">Chat replies are <b>real</b> — a secure server route (<code>/api/tutor</code>) calls the Anthropic API with the same real context described above and streams the answer back. No auth or rate-limiting exists yet (see Section 11), so this depends on the server having a valid key configured.</div>
        </section>

        <section id="terminology">
          <h2><span className="idx">07</span>Terminology System</h2>
          <p className="dek">284 real medical terms across 7 categories, reviewed on a genuine Leitner-box spaced-repetition schedule.</p>
          <div className="scroll-x">
            <table className="ftable">
              <tbody>
                <tr><th>Category</th><th className="tabular">Terms</th></tr>
                <tr><td className="name">Anatomy</td><td className="tabular">113</td></tr>
                <tr><td className="name">Clinical</td><td className="tabular">84</td></tr>
                <tr><td className="name">Pathology</td><td className="tabular">64</td></tr>
                <tr><td className="name">Biology</td><td className="tabular">10</td></tr>
                <tr><td className="name">Pharmacology</td><td className="tabular">9</td></tr>
                <tr><td className="name">Microbiology</td><td className="tabular">3</td></tr>
                <tr><td className="name">Abbreviations</td><td className="tabular">1</td></tr>
              </tbody>
            </table>
          </div>
          <p>Every term carries a definition, a plain-language explanation, an example sentence, and its real clinical relevance. Terms auto-highlight anywhere they appear in lesson text or clinical cases (longest-match-first, so multi-word terms like &quot;Myocardial Infarction&quot; aren&apos;t shadowed by a shorter partial match).</p>

          <h3>Flashcard Focus Mode</h3>
          <div className="mock-row">
            <div className="mock mock-flash">
              <div className="top"><i /></div>
              <div className="body">
                <div className="counter-row">
                  <span>Still Learning · 0</span><span>Know · 2</span>
                </div>
                <div className="card"><b>Myocardium</b></div>
                <div className="row">
                  <div className="r">1<br />Still Learning</div>
                  <div className="r">2<br />Getting There</div>
                  <div className="r on">✓<br />Know</div>
                </div>
              </div>
            </div>
          </div>
          <p>Reviewing due terms opens a fullscreen, distraction-free session: a real progress bar, a card that flips without ever rendering mirrored text (rebuilt after an early version had a real cross-browser 3D-flip bug), and a <strong>1 / 2 / ✓</strong> rating that maps onto the actual 3-tier Leitner schedule — not a cosmetic simplification. Undo restores the exact pre-rating state, keyboard shortcuts cover flip and rate, and finishing shows a real session tally.</p>
        </section>

        <section id="cases">
          <h2><span className="idx">08</span>Clinical Case of the Day</h2>
          <p>One new patient vignette per day, deterministically rotated from a bank of real cases (cardiology, neurology, pulmonology, GI, endocrine, ID, rheum, dermatology) — stem, question, four options, and a full explanation. Answering is scored for real and feeds Knowledge Points; a student can flag a case as wrong via a real report action that lands in the admin Reports inbox.</p>
        </section>

        <section id="progress">
          <h2><span className="idx">09</span>Progress &amp; Gamification</h2>
          <ul className="plain">
            <li><strong>Knowledge Points &amp; 6 levels</strong> — Beginner through Master, thresholds from 0 to 6,000 KP.</li>
            <li><strong>Streaks</strong> — a day only counts once the day&apos;s real Study Plan goals are met, not just for visiting.</li>
            <li><strong>Achievements</strong> — 8 defined, 6 wired to real thresholds (sessions, flashcards, KP, quiz scores); 2 marked &quot;coming soon&quot; honestly rather than faked.</li>
          </ul>
        </section>

        <section id="admin">
          <h2><span className="idx">10</span>Internal Ops / Admin</h2>
          <p className="dek">An unlisted console at <code>/admin</code> (or <code>Ctrl+Shift+A</code> from any dashboard page) — sidebar-nav SaaS layout, 16 sections.</p>

          <div className="mock-row">
            <div className="mock">
              <p className="mock-cap">Overview stats</p>
              <div className="mock-admin">
                <div className="stat"><span>Total Medical Terms</span><b>284</b></div>
                <div className="stat"><span>Clinical Cases</span><b>10</b></div>
                <div className="stat"><span>Question Bank</span><b>0</b></div>
                <div className="stat"><span>Open Reports</span><b>0</b></div>
              </div>
            </div>
          </div>

          <div className="scroll-x">
            <table className="ftable">
              <tbody>
                <tr><th>Section</th><th>What it does</th></tr>
                <tr><td className="name">Vocabulary</td><td className="desc">Full CMS for terms — difficulty, tags, browser-native pronunciation, bulk JSON import.</td></tr>
                <tr><td className="name">Clinical Cases</td><td className="desc">Create/edit cases that genuinely enter the daily rotation; force today&apos;s case for testing.</td></tr>
                <tr><td className="name">Anatomy Library</td><td className="desc">Structures with image references, linked to real terms and cases.</td></tr>
                <tr><td className="name">Reference Database</td><td className="desc">Textbooks/papers/guidelines, linkable to specific terms and cases.</td></tr>
                <tr><td className="name">Learning Paths</td><td className="desc">Real content-track counts side by side with the onboarding path-identity list, plus a &quot;preview as this path&quot; switch.</td></tr>
                <tr><td className="name">Lesson Builder</td><td className="desc">Drag-and-drop course composer over real content blocks (vocabulary categories, cases, notes).</td></tr>
                <tr><td className="name">Question Bank</td><td className="desc">MCQ / image / ECG / case / flashcard question authoring.</td></tr>
                <tr><td className="name">Notifications</td><td className="desc">Compose tool that publishes into the real student notification feed.</td></tr>
                <tr><td className="name">Gamification</td><td className="desc">Real level thresholds and achievement defs, with QA overrides for KP and unlock state.</td></tr>
                <tr><td className="name">Reports &amp; Feedback</td><td className="desc">Inbox for real student-submitted reports (open/resolve/dismiss).</td></tr>
                <tr><td className="name">AI Management</td><td className="desc">Prompt-template library and tutor settings — real config, honestly marked as not yet wired to a live model.</td></tr>
                <tr><td className="name">Analytics</td><td className="desc">This browser&apos;s own real usage (most-viewed terms, most-missed cases) — explicitly not multi-user analytics.</td></tr>
                <tr><td className="name">Feature Management</td><td className="desc">Flags that genuinely gate real UI (e.g. hide the Studium AI nav link).</td></tr>
                <tr><td className="name">Roles &amp; Permissions</td><td className="desc">A sidebar-filtering role preview — explicitly labeled as not real access control.</td></tr>
                <tr><td className="name">Account</td><td className="desc">The one real account this browser has — progress, streak, weak areas — not a fabricated user table.</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <hr className="rule" />

        <section id="honesty">
          <h2><span className="idx">11</span>Real vs. Gated — the Honest Ledger</h2>
          <p className="dek">The single most important section for planning what&apos;s next. Every claim below was verified live, not assumed.</p>
          <div className="scroll-x">
            <table className="ftable">
              <tbody>
                <tr><th>Capability</th><th>Status</th><th>What&apos;s actually true today</th></tr>
                <tr><td className="name">Terminology, spaced repetition, KP, streaks, cases</td><td><span className="chip live">Real</span></td><td className="desc">Fully functional, persisted, computed live — nothing here is a mock.</td></tr>
                <tr><td className="name">Admin CMS (all 16 sections)</td><td><span className="chip admin">Real, admin-only</span></td><td className="desc">Genuine CRUD over the same data students see; not linked from student UI, not secured by a real auth boundary.</td></tr>
                <tr><td className="name">AI Tutor replies</td><td><span className="chip live">Real</span></td><td className="desc">A server route calls the live Anthropic API and streams the reply back. No auth/rate-limiting on the endpoint yet—see the auth row below.</td></tr>
                <tr><td className="name">Multi-user accounts, auth</td><td><span className="chip gated">Not built</span></td><td className="desc">One account per browser. Signup/login UI exists; there&apos;s no server to authenticate against.</td></tr>
                <tr><td className="name">Payments (pricing, gift cards)</td><td><span className="chip gated">UI only</span></td><td className="desc">No payment processor connected.</td></tr>
                <tr><td className="name">Cross-user analytics, leaderboards</td><td><span className="chip gated">Not possible yet</span></td><td className="desc">Would need a real backend collecting data across users; intentionally not faked with placeholder numbers.</td></tr>
              </tbody>
            </table>
          </div>
          <p>In short: <strong>the student-facing learning product is real and usable today.</strong> The gap to a shippable multi-user SaaS is a backend — auth, a database, a live AI endpoint, and payments — not more front-end work.</p>
        </section>

        <footer className="colophon">Studium — internal handoff summary. Every feature and number above was checked against the live app, not recalled from memory.</footer>
      </main>
    </div>
  </div>;
}
