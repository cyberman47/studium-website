import { LegalDocument, LegalSection, legalList } from "@/components/legal-document";

export default function PrivacyPage() {
  return <LegalDocument title="Privacy Policy" lastUpdated="August 2, 2026">
    <LegalSection heading="1. Overview">
      <p>This Privacy Policy explains how Studium, Inc. ("Studium," "we," "us," or "our"), a company based in New York, United States, collects, uses, and shares information when you use our website and Service. It applies alongside our <a href="/terms" className="cursor-pointer font-bold text-teal-600 hover:text-teal-700">Terms of Service</a>.</p>
    </LegalSection>

    <LegalSection heading="2. Information We Collect">
      <ul className={legalList}>
        <li><span className="font-bold text-ink">Account information:</span> your name, email address, username, password (stored securely, never in plain text), and profile photo if you choose to add one.</li>
        <li><span className="font-bold text-ink">Study data:</span> your onboarding answers, study preferences, streaks, flashcard and quiz activity, and other progress data you generate while using the Service.</li>
        <li><span className="font-bold text-ink">Payment information:</span> if you subscribe to a paid plan, our payment processor collects your payment details directly; we do not store full card numbers on our servers.</li>
        <li><span className="font-bold text-ink">Communications:</span> messages you send us, such as support requests.</li>
        <li><span className="font-bold text-ink">Usage data:</span> information about how you interact with the Service, such as pages viewed, features used, and device or browser information, collected automatically.</li>
        <li><span className="font-bold text-ink">Cookies and local storage:</span> see our <a href="/cookie-settings" className="cursor-pointer font-bold text-teal-600 hover:text-teal-700">Cookie Policy</a> for details.</li>
      </ul>
    </LegalSection>

    <LegalSection heading="3. How We Use Your Information">
      <p>We use the information we collect to:</p>
      <ul className={legalList}>
        <li>Provide, maintain, and improve the Service, including personalizing your study plan and AI tutor responses;</li>
        <li>Process payments and manage subscriptions;</li>
        <li>Communicate with you, including account, service, and (where you've opted in) marketing emails;</li>
        <li>Monitor and analyze usage to improve features and troubleshoot issues;</li>
        <li>Detect, prevent, and address fraud, abuse, or security issues;</li>
        <li>Comply with our legal obligations.</li>
      </ul>
    </LegalSection>

    <LegalSection heading="4. Cookies and Similar Technologies">
      <p>We use cookies, local storage, and similar technologies to keep you signed in, remember your preferences, and understand how the Service is used. For details on the types of cookies we use and how to manage them, see our <a href="/cookie-settings" className="cursor-pointer font-bold text-teal-600 hover:text-teal-700">Cookie Policy</a>.</p>
    </LegalSection>

    <LegalSection heading="5. How We Share Information">
      <p>We do not sell your personal information. We may share information with:</p>
      <ul className={legalList}>
        <li>Service providers who help us operate the Service, such as hosting, analytics, email delivery, and payment processing, under contractual obligations to protect your data;</li>
        <li>Law enforcement or other parties when required by law, or to protect the rights, safety, or property of Studium, our users, or others;</li>
        <li>A successor entity in the event of a merger, acquisition, or sale of assets, subject to this Policy or a policy at least as protective;</li>
        <li>Other parties with your consent.</li>
      </ul>
    </LegalSection>

    <LegalSection heading="6. Data Retention">
      <p>We retain your information for as long as your account is active or as needed to provide the Service. If you delete your account, we delete or anonymize your personal information within a reasonable period, except where we are required to retain it for legal, tax, or accounting purposes.</p>
    </LegalSection>

    <LegalSection heading="7. Your Rights and Choices">
      <p>Depending on where you live, you may have rights to access, correct, delete, or export your personal information, or to object to or restrict certain processing. You can update most account information directly in your account settings, or contact us at <a href="mailto:hello@studium.app" className="cursor-pointer font-bold text-teal-600 hover:text-teal-700">hello@studium.app</a> to make a request. You can also delete your account entirely at any time from Settings → Account.</p>
    </LegalSection>

    <LegalSection heading="8. Children's Privacy">
      <p>The Service is not directed to children under 13, and we do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal information, contact us at <a href="mailto:hello@studium.app" className="cursor-pointer font-bold text-teal-600 hover:text-teal-700">hello@studium.app</a> and we will take appropriate steps to delete it.</p>
    </LegalSection>

    <LegalSection heading="9. Data Security">
      <p>We use reasonable administrative, technical, and physical safeguards designed to protect your information. No method of transmission or storage is completely secure, so we cannot guarantee absolute security.</p>
    </LegalSection>

    <LegalSection heading="10. International Users">
      <p>Studium is based in the United States, and information we collect is processed in the United States. If you access the Service from outside the United States, you understand that your information will be transferred to, stored, and processed in the United States, which may have data protection laws different from those of your country.</p>
    </LegalSection>

    <LegalSection heading="11. Changes to This Policy">
      <p>We may update this Privacy Policy from time to time. If we make material changes, we will notify you before they take effect, as described in our Terms of Service.</p>
    </LegalSection>

    <LegalSection heading="12. Contact Us">
      <p>Questions about this Policy or your data? Contact us at <a href="mailto:hello@studium.app" className="cursor-pointer font-bold text-teal-600 hover:text-teal-700">hello@studium.app</a> or write to us at:</p>
      <p className="font-bold text-ink">Studium, Inc.<br />[Company Address]<br />New York, NY [ZIP Code]</p>
    </LegalSection>
  </LegalDocument>;
}
