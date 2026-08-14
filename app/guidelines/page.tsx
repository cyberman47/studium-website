import { LegalDocument, LegalSection, legalList } from "@/components/legal-document";

export default function GuidelinesPage() {
  return <LegalDocument title="Community Guidelines" lastUpdated="August 9, 2026">
    <LegalSection heading="1. Why We Have Guidelines">
      <p>Studium's Forum and other community spaces work because people show up to genuinely help each other learn. These guidelines exist to keep that space useful, honest, and safe—for a first-year student posting a nervous question and a fourth-year answering it alike.</p>
    </LegalSection>

    <LegalSection heading="2. Be Respectful">
      <ul className={legalList}>
        <li>Disagree with ideas, not people. Critique an answer's reasoning, not the person who posted it.</li>
        <li>No harassment, hate speech, or personal attacks, on the Forum or anywhere else in the Service.</li>
        <li>Assume good faith. Most confusing questions come from someone genuinely trying to learn, not from someone trying to waste your time.</li>
        <li>Keep patient stories and clinical case discussions de-identified—never post real patient information.</li>
      </ul>
    </LegalSection>

    <LegalSection heading="3. Post in the Right Place">
      <p>The Forum is organized into a few real categories, and using the right one helps everyone find what they need:</p>
      <ul className={legalList}>
        <li><span className="font-bold text-heading">General:</span> open discussion about studying, school, or anything else on your mind.</li>
        <li><span className="font-bold text-heading">Study Tips:</span> techniques, resources, and approaches that have worked for you.</li>
        <li><span className="font-bold text-heading">Feedback:</span> ideas and suggestions for how Studium itself could be better.</li>
        <li><span className="font-bold text-heading">Bug:</span> something in the Service that isn't working the way it should.</li>
      </ul>
    </LegalSection>

    <LegalSection heading="4. Academic Integrity">
      <ul className={legalList}>
        <li>Don't post live exam questions, secure question-bank content, or anything covered by an academic integrity agreement with your school or another provider.</li>
        <li>Use Studium's own flashcards, quizzes, and practice questions to study—not to circulate answers to a graded assessment.</li>
        <li>Give credit when you're sharing someone else's explanation, mnemonic, or resource rather than presenting it as your own.</li>
      </ul>
    </LegalSection>

    <LegalSection heading="5. Medical Content Is for Studying, Not Diagnosis">
      <p>Studium's clinical cases, terminology, quizzes, and AI Tutor responses are study aids built for learning—they are not medical advice and are not a substitute for professional clinical judgment, a licensed clinician, or your own institution's curriculum. Never use anything on Studium, including AI Tutor responses, to make a real diagnostic or treatment decision for yourself or anyone else.</p>
    </LegalSection>

    <LegalSection heading="6. What's Not Allowed">
      <ul className={legalList}>
        <li>Spam, unsolicited advertising, or repeatedly posting the same content;</li>
        <li>Impersonating another person, school, or organization;</li>
        <li>Sharing someone else's copyrighted material without permission;</li>
        <li>Posting content that is illegal, sexually explicit, or intended to harass, threaten, or demean;</li>
        <li>Attempting to manipulate votes, rankings, or other users through fake accounts or coordinated activity.</li>
      </ul>
    </LegalSection>

    <LegalSection heading="7. Reporting a Problem">
      <p>If you see a post, comment, or piece of content that breaks these guidelines, please email us at <a href="mailto:hello@studium.app" className="cursor-pointer font-bold text-teal-600 hover:text-teal-700">hello@studium.app</a> with a link or description of what you found. We review reports and act on genuine violations—we don't remove content simply because someone disagrees with it.</p>
    </LegalSection>

    <LegalSection heading="8. Enforcement">
      <p>Depending on the severity and pattern of a violation, we may remove content, issue a warning, or suspend or terminate an account, consistent with our <a href="/terms" className="cursor-pointer font-bold text-teal-600 hover:text-teal-700">Terms of Service</a>. We aim to be proportionate: an honest mistake gets a nudge in the right direction, not a ban.</p>
    </LegalSection>

    <LegalSection heading="9. Changes to These Guidelines">
      <p>We may update these guidelines as the community and Service grow. We'll update the "Last updated" date above when we do.</p>
    </LegalSection>

    <LegalSection heading="10. Contact Us">
      <p>Questions about these guidelines? Reach us at <a href="mailto:hello@studium.app" className="cursor-pointer font-bold text-teal-600 hover:text-teal-700">hello@studium.app</a>.</p>
    </LegalSection>
  </LegalDocument>;
}
