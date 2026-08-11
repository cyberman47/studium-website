import { LegalDocument, LegalSection } from "@/components/legal-document";

type Row = { label: string; value: string };

function InfoRow({ label, value }: Row) {
  return <div className="flex flex-col gap-1 border-b border-slate-100 py-3 last:border-0 sm:flex-row sm:items-baseline sm:gap-4">
    <span className="w-full shrink-0 text-xs font-extrabold uppercase tracking-wide text-slate-500 sm:w-48">{label}</span>
    <span className="text-sm font-semibold text-ink">{value}</span>
  </div>;
}

const placeholder = "[to be added]";

export default function CompanyInformationPage() {
  return <LegalDocument title="Company Information" eyebrow="About" lastUpdated="August 9, 2026">
    <LegalSection heading="Rough outline">
      <p>This is a working outline of Studium's formal company details, not a finished corporate filing—some fields below are still placeholders and will be filled in as they're finalized. For our story and team, see <a href="/about" className="cursor-pointer font-bold text-teal-600 hover:text-teal-700">About</a>; for how we handle your data, see our <a href="/privacy" className="cursor-pointer font-bold text-teal-600 hover:text-teal-700">Privacy Policy</a>.</p>
    </LegalSection>

    <LegalSection heading="Legal Entity">
      <div>
        <InfoRow label="Legal name" value="Studium, Inc." />
        <InfoRow label="Entity type" value={placeholder + " (e.g. Delaware C-Corporation)"} />
        <InfoRow label="Date of incorporation" value={placeholder} />
        <InfoRow label="Registration / EIN number" value={placeholder} />
        <InfoRow label="Governing jurisdiction" value="New York, United States" />
      </div>
    </LegalSection>

    <LegalSection heading="Registered Address">
      <div>
        <InfoRow label="Principal place of business" value={placeholder} />
        <InfoRow label="Registered agent" value={placeholder} />
      </div>
    </LegalSection>

    <LegalSection heading="Contacts">
      <div>
        <InfoRow label="General inquiries" value="hello@studium.app" />
        <InfoRow label="Support" value="hello@studium.app" />
        <InfoRow label="Legal / privacy" value="hello@studium.app" />
        <InfoRow label="Press" value={placeholder} />
      </div>
    </LegalSection>

    <LegalSection heading="Leadership">
      <div>
        <InfoRow label="Founder & CEO" value="Eduardo Alvarez" />
      </div>
    </LegalSection>

    <LegalSection heading="Regulatory Notices">
      <p>Studium is an educational study tool. It is not a healthcare provider and does not provide medical advice, diagnosis, or treatment—see our <a href="/guidelines" className="cursor-pointer font-bold text-teal-600 hover:text-teal-700">Community Guidelines</a> for details. No industry-specific licenses or regulatory registrations currently apply to the Service; this section will be updated if that changes.</p>
    </LegalSection>

    <LegalSection heading="Questions">
      <p>Spot something in this outline that needs correcting, or need a detail not listed here? Contact us at <a href="mailto:hello@studium.app" className="cursor-pointer font-bold text-teal-600 hover:text-teal-700">hello@studium.app</a>.</p>
    </LegalSection>
  </LegalDocument>;
}
