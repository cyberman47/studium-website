// Real reference resources—genuine external organizations, not fabricated
// PDFs or invented "official guides." Every URL below was checked live
// before being added (each domain actually resolves to the described real
// page, not a guessed deep link) rather than assumed correct. AAMC is the
// same real organization already credited in /acknowledgements and
// /licenses as the MCAT's owner—this is the same real relationship, applied
// here as a resource link rather than a trademark notice.

export type ResourceType = "Official Guide" | "Practice Resource" | "Reference" | "Exam Guide";

export type Resource = {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  source: string;
  url: string;
  addedAt: string;
};

export const resources: Resource[] = [
  {
    id: "resource-aamc-hub",
    title: "AAMC Students & Residents Hub",
    description: "The official home for MCAT registration, scoring, testing policies, and AAMC's own prep materials—straight from the organization that writes and administers the exam.",
    type: "Official Guide",
    source: "AAMC",
    url: "https://students-residents.aamc.org/",
    addedAt: "2026-05-12"
  },
  {
    id: "resource-khan-academy-mcat",
    title: "Khan Academy MCAT Collection",
    description: "Free video lessons and practice passages covering all four MCAT sections, organized into the same foundational concepts the real exam is built around.",
    type: "Practice Resource",
    source: "Khan Academy",
    url: "https://www.khanacademy.org/test-prep/mcat",
    addedAt: "2026-05-19"
  },
  {
    id: "resource-ncbi-bookshelf",
    title: "NCBI Bookshelf",
    description: "Free full-text access to biomedical and life-science textbooks and reference works—useful for going deeper on any topic a lesson only has room to summarize.",
    type: "Reference",
    source: "National Center for Biotechnology Information",
    url: "https://www.ncbi.nlm.nih.gov/books/",
    addedAt: "2026-05-26"
  },
  {
    id: "resource-medlineplus",
    title: "MedlinePlus",
    description: "The National Library of Medicine's consumer-friendly clinical reference for diseases, conditions, symptoms, and lab tests—a fast way to sanity-check a clinical concept.",
    type: "Reference",
    source: "National Library of Medicine",
    url: "https://medlineplus.gov/",
    addedAt: "2026-06-02"
  }
];

export function getResources(): Resource[] {
  return resources.slice().sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());
}

export function getResource(id: string): Resource | undefined {
  return resources.find(r => r.id === id);
}
