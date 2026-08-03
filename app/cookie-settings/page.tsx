import { LegalDocument, LegalSection, legalList } from "@/components/legal-document";

export default function CookieSettingsPage() {
  return <LegalDocument title="Cookie Policy" lastUpdated="August 2, 2026">
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
      <p>You can control or delete cookies at any time through your browser settings; most browsers let you block or clear cookies from their settings menu. Blocking essential cookies may affect your ability to use parts of the Service, such as staying signed in.</p>
    </LegalSection>

    <LegalSection heading="5. Changes to This Policy">
      <p>We may update this Cookie Policy from time to time to reflect changes in the cookies and technologies we use. We'll update the "Last updated" date above when we do.</p>
    </LegalSection>

    <LegalSection heading="6. Contact Us">
      <p>Questions about our use of cookies? Contact us at <a href="mailto:hello@studium.app" className="cursor-pointer font-bold text-teal-600 hover:text-teal-700">hello@studium.app</a>.</p>
    </LegalSection>
  </LegalDocument>;
}
