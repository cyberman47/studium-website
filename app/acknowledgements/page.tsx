import { LegalDocument, LegalSection } from "@/components/legal-document";

export default function AcknowledgementsPage() {
  return <LegalDocument title="Acknowledgements" eyebrow="About" lastUpdated="August 9, 2026">
    <LegalSection heading="With Thanks">
      <p>Studium was built with inspiration from the many educators, researchers, students, and learning platforms that have contributed to modern approaches to education.</p>
      <p>We especially acknowledge the Association of American Medical Colleges (AAMC) for its work in developing and maintaining the MCAT examination and its publicly available resources.</p>
      <p>We also thank the students who have tested Studium and provided feedback throughout its development.</p>
      <p>Finally, we acknowledge the open-source developers and communities whose tools and libraries make projects like Studium possible—see our <a href="/licenses" className="cursor-pointer font-bold text-teal-600 hover:text-teal-700">Licenses</a> page for the specifics.</p>
    </LegalSection>
  </LegalDocument>;
}
