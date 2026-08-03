import { LegalDocument, LegalSection, legalList } from "@/components/legal-document";

export default function TermsPage() {
  return <LegalDocument title="Terms of Service" lastUpdated="August 2, 2026">
    <LegalSection heading="1. Agreement to Terms">
      <p>Welcome to Studium. These Terms of Service ("Terms") are a legal agreement between you and Studium, Inc. ("Studium," "we," "us," or "our"), a company organized under the laws of the State of New York, United States, with its principal place of business at [Company Address], New York, NY [ZIP Code].</p>
      <p>By creating an account, or accessing or using our website, applications, or any related services (together, the "Service"), you agree to be bound by these Terms and by our <a href="/privacy" className="cursor-pointer font-bold text-teal-600 hover:text-teal-700">Privacy Policy</a>. If you do not agree, please do not use the Service.</p>
    </LegalSection>

    <LegalSection heading="2. Eligibility">
      <p>You must be at least 13 years old to use the Service. If you are under 18, you may only use the Service with the involvement and consent of a parent or legal guardian, who agrees to be bound by these Terms on your behalf. By using the Service, you represent that you meet these requirements.</p>
    </LegalSection>

    <LegalSection heading="3. Description of Service">
      <p>Studium provides an AI-assisted study platform for students in medical, pre-med, nursing, pharmacy, dentistry, and related health fields, including features such as an AI study tutor, flashcards, notes, practice questions, and progress tracking. We may add, change, or remove features at any time, with or without notice.</p>
    </LegalSection>

    <LegalSection heading="4. Accounts">
      <p>To use most features of the Service, you must create an account. You agree to provide accurate, current, and complete information and to keep it up to date. You are responsible for safeguarding your account credentials and for all activity that occurs under your account. Notify us immediately at <a href="mailto:hello@studium.app" className="cursor-pointer font-bold text-teal-600 hover:text-teal-700">hello@studium.app</a> if you suspect unauthorized use of your account.</p>
    </LegalSection>

    <LegalSection heading="5. Subscriptions and Billing">
      <p>Some features of the Service are offered on a paid subscription basis, as described on our Pricing page. By subscribing to a paid plan, you authorize us (or our payment processor) to charge your chosen payment method on a recurring basis until you cancel. Subscriptions renew automatically unless canceled before the next billing date.</p>
      <p>You can cancel at any time from your account settings; cancellation takes effect at the end of your current billing period. We do not provide refunds for partial billing periods, except where required by law. If a plan includes a free trial, it will convert to a paid subscription at the end of the trial unless you cancel beforehand. We may change our prices; we will give you reasonable notice before any change takes effect on your subscription.</p>
    </LegalSection>

    <LegalSection heading="6. Acceptable Use">
      <p>When using the Service, you agree not to:</p>
      <ul className={legalList}>
        <li>Violate any applicable law or regulation;</li>
        <li>Impersonate any person, or misrepresent your affiliation with a person or entity;</li>
        <li>Upload or share content that is unlawful, harassing, defamatory, or that infringes another party's rights;</li>
        <li>Attempt to gain unauthorized access to the Service, other accounts, or our systems;</li>
        <li>Use automated means, such as bots or scrapers, to access the Service without our written permission;</li>
        <li>Reverse engineer, decompile, or attempt to extract the source code of the Service, except as permitted by law;</li>
        <li>Use the Service to cheat on a proctored exam or otherwise violate an academic institution's honor code.</li>
      </ul>
      <p>We may suspend or terminate accounts that violate this section.</p>
    </LegalSection>

    <LegalSection heading="7. User Content">
      <p>If the Service allows you to upload or create content, such as notes, flashcards, or study materials ("User Content"), you retain ownership of your User Content. By submitting User Content, you grant Studium a worldwide, non-exclusive, royalty-free license to host, store, reproduce, and display that content solely to operate and improve the Service for you. You are responsible for ensuring you have the rights to any content you upload.</p>
    </LegalSection>

    <LegalSection heading="8. AI-Generated Content">
      <p>The Service uses artificial intelligence to generate explanations, practice questions, quizzes, and other study materials ("AI Content"). AI Content is provided for educational and study purposes only. It is not medical advice, and it is not a substitute for instruction from a qualified educator, clinician, or your academic program.</p>
      <p>AI Content may contain errors, omissions, or outdated information. You are solely responsible for verifying any AI Content against authoritative sources, such as your coursework, textbooks, or instructors, before relying on it, including for exams, coursework, or any clinical context.</p>
    </LegalSection>

    <LegalSection heading="9. Intellectual Property">
      <p>The Service, including its software, design, text, graphics, and the Studium name and logo, is owned by Studium or its licensors and is protected by intellectual property laws. Except for the limited rights expressly granted to you to use the Service, we reserve all rights, title, and interest in the Service.</p>
    </LegalSection>

    <LegalSection heading="10. Third-Party Links and Services">
      <p>The Service may contain links to, or integrations with, third-party websites or services, including payment processors and sign-in providers, that we do not control. We are not responsible for the content, policies, or practices of any third party. Your use of third-party services is governed by their own terms.</p>
    </LegalSection>

    <LegalSection heading="11. Disclaimers">
      <p>THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE," WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT GUARANTEE THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE, OR THAT IT WILL IMPROVE YOUR ACADEMIC OR EXAM RESULTS.</p>
    </LegalSection>

    <LegalSection heading="12. Limitation of Liability">
      <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW, STUDIUM AND ITS OFFICERS, EMPLOYEES, AND AGENTS WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, DATA, OR GOODWILL, ARISING FROM YOUR USE OF THE SERVICE. OUR TOTAL LIABILITY FOR ANY CLAIM ARISING OUT OF OR RELATING TO THESE TERMS OR THE SERVICE WILL NOT EXCEED THE GREATER OF (A) THE AMOUNT YOU PAID US IN THE 12 MONTHS BEFORE THE CLAIM AROSE, OR (B) $100.</p>
    </LegalSection>

    <LegalSection heading="13. Indemnification">
      <p>You agree to indemnify and hold harmless Studium and its officers, employees, and agents from any claims, damages, or expenses, including reasonable attorneys' fees, arising from your use of the Service, your User Content, or your violation of these Terms.</p>
    </LegalSection>

    <LegalSection heading="14. Termination">
      <p>You may stop using the Service and close your account at any time from your account settings. We may suspend or terminate your access to the Service if you violate these Terms or if we reasonably believe your use of the Service poses a risk to Studium or other users. Sections of these Terms that by their nature should survive termination, including Intellectual Property, Disclaimers, Limitation of Liability, and Governing Law, will survive.</p>
    </LegalSection>

    <LegalSection heading="15. Governing Law and Disputes">
      <p>These Terms are governed by the laws of the State of New York, without regard to its conflict-of-laws principles. You agree that any dispute arising out of or relating to these Terms or the Service will be brought exclusively in the state or federal courts located in New York County, New York, and you consent to the personal jurisdiction of those courts.</p>
    </LegalSection>

    <LegalSection heading="16. Changes to These Terms">
      <p>We may update these Terms from time to time. If we make material changes, we will notify you, for example by email or an in-product notice, before the changes take effect. Continuing to use the Service after changes take effect means you accept the updated Terms.</p>
    </LegalSection>

    <LegalSection heading="17. Contact Us">
      <p>Questions about these Terms? Reach us at <a href="mailto:hello@studium.app" className="cursor-pointer font-bold text-teal-600 hover:text-teal-700">hello@studium.app</a> or write to us at:</p>
      <p className="font-bold text-ink">Studium, Inc.<br />[Company Address]<br />New York, NY [ZIP Code]</p>
    </LegalSection>
  </LegalDocument>;
}
