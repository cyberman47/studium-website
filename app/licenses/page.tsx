import { LegalDocument, LegalSection } from "@/components/legal-document";

type LicenseRow = { name: string; license: string; use: string };

const runtime: LicenseRow[] = [
  { name: "Next.js", license: "MIT", use: "Application framework" },
  { name: "React & React DOM", license: "MIT", use: "UI library" },
  { name: "Framer Motion", license: "MIT", use: "Animation" },
  { name: "lucide-react", license: "ISC", use: "Icons" }
];

const tooling: LicenseRow[] = [
  { name: "TypeScript", license: "Apache-2.0", use: "Type checking" },
  { name: "Tailwind CSS", license: "MIT", use: "Styling" },
  { name: "PostCSS", license: "MIT", use: "CSS processing" },
  { name: "Autoprefixer", license: "MIT", use: "CSS processing" }
];

function LicenseTable({ rows }: { rows: LicenseRow[] }) {
  return <div className="overflow-x-auto rounded-2xl border border-slate-100">
    <table className="w-full min-w-[420px] text-left text-sm">
      <thead className="bg-[#f9fcfc] text-xs font-extrabold uppercase tracking-wide text-slate-500">
        <tr><th className="px-4 py-3">Project</th><th className="px-4 py-3">License</th><th className="px-4 py-3">Used for</th></tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {rows.map(r => <tr key={r.name}><td className="px-4 py-3 font-bold text-ink">{r.name}</td><td className="px-4 py-3 text-slate-600">{r.license}</td><td className="px-4 py-3 text-slate-500">{r.use}</td></tr>)}
      </tbody>
    </table>
  </div>;
}

export default function LicensesPage() {
  return <LegalDocument title="Licenses" eyebrow="Legal" lastUpdated="August 9, 2026">
    <LegalSection heading="1. Open-Source Software">
      <p>Studium is built with the help of open-source software. We're grateful to the maintainers and contributors of these projects. The table below covers the software actually used to build and run Studium today—not a placeholder list.</p>
      <p className="mt-4 text-xs font-extrabold uppercase tracking-wide text-slate-500">Used in the running app</p>
      <div className="mt-2"><LicenseTable rows={runtime} /></div>
      <p className="mt-5 text-xs font-extrabold uppercase tracking-wide text-slate-500">Used to build the app</p>
      <div className="mt-2"><LicenseTable rows={tooling} /></div>
    </LegalSection>

    <LegalSection heading="2. Fonts">
      <p>Studium uses Figtree and Noto Sans, both distributed through Google Fonts under the SIL Open Font License 1.1.</p>
    </LegalSection>

    <LegalSection heading="3. Full License Text">
      <p>MIT, ISC, Apache-2.0, and OFL are all permissive licenses; each package's full license text ships alongside its source and is also available from the project's own repository. Write to <a href="mailto:hello@studium.app" className="cursor-pointer font-bold text-teal-600 hover:text-teal-700">hello@studium.app</a> if you'd like a specific license's full text and can't locate it.</p>
    </LegalSection>

    <LegalSection heading="4. Trademark Notice">
      <p>MCAT® is a registered trademark of the Association of American Medical Colleges (AAMC), which does not sponsor, endorse, or affiliate with Studium. References to the MCAT on this site are solely to describe the subject matter Studium helps students study.</p>
    </LegalSection>

    <LegalSection heading="5. Questions">
      <p>Questions about our use of open-source software or trademarks? Contact us at <a href="mailto:hello@studium.app" className="cursor-pointer font-bold text-teal-600 hover:text-teal-700">hello@studium.app</a>.</p>
    </LegalSection>
  </LegalDocument>;
}
