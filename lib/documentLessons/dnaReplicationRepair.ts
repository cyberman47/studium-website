// Document-lesson content for "DNA Replication & Repair" (lib/mcatPath.ts's
// dna-replication-repair LessonContent entry)—restructured from that same
// real entry. See lib/documentLesson.ts for the shared shape.
import { DocumentLessonContent } from "../documentLesson";

export const dnaReplicationRepairContent: DocumentLessonContent = {
  lessonIntro: {
    description: "Copying billions of DNA bases with almost no errors takes real machinery, not luck. This lesson covers the semiconservative replication mechanism, why the two new strands are built differently, and the layered repair systems that catch the rare mistakes that slip through.",
    objectives: [
      "Explain what 'semiconservative' means and how the Meselson-Stahl experiment showed it",
      "Distinguish leading- from lagging-strand synthesis",
      "Explain why the lagging strand requires Okazaki fragments and ligase",
      "Distinguish proofreading, mismatch repair, and nucleotide excision repair"
    ]
  },
  bigPicture: {
    flow: ["Origin", "Helicase unwinds", "Primase primes", "DNA polymerase synthesizes", "Ligase seals"],
    caption: "Replication is an assembly line: each enzyme does one job in sequence, unwinding, priming, building, and finally sealing the new strand into one continuous piece."
  },
  concepts: [
    {
      number: "01",
      id: "semiconservative-replication",
      title: "Semiconservative Replication",
      difficulty: "UNDERSTAND",
      coreIdea: "Each new DNA double helix contains one original strand and one newly synthesized strand, built starting from an origin of replication.",
      learn: [
        "DNA replication is semiconservative: each new double helix contains one original (parental) strand and one newly synthesized strand. Replication begins at an origin of replication, where helicase unwinds and separates the two DNA strands, creating a replication fork.",
        "Primase then lays down a short RNA primer, giving DNA polymerase a starting point, since DNA polymerase can only add nucleotides to an existing strand—it cannot start a new one from scratch."
      ],
      mcatConnection: "The Meselson-Stahl experiment (density-gradient centrifugation of 15N/14N-labeled DNA) is the classic passage used to test this concept—know that it distinguished semiconservative replication from the two ruled-out alternatives, conservative and dispersive.",
      quickCheck: {
        prompt: "The Meselson-Stahl experiment demonstrated that DNA replication is:",
        options: ["Conservative", "Semiconservative", "Dispersive", "Random"],
        correctIndex: 1,
        explanation: "Each new helix contains one original and one new strand, confirming semiconservative replication—conservative (both original strands staying together) and dispersive (mixed old/new within each strand) were both ruled out."
      },
      keyTakeaway: "Replication is semiconservative—each new helix pairs one old strand with one new one—starting at an origin where helicase unwinds DNA and primase lays down a starting primer."
    },
    {
      number: "02",
      id: "leading-lagging-strand",
      title: "Leading vs. Lagging Strand",
      difficulty: "IDENTIFY",
      coreIdea: "DNA polymerase only synthesizes 5' to 3', so the leading strand builds continuously while the lagging strand builds discontinuously as Okazaki fragments, later joined by ligase.",
      learn: [
        "DNA polymerase can only synthesize new DNA in the 5' to 3' direction. Because the two parental strands run antiparallel, one new strand (the leading strand) is synthesized continuously toward the replication fork, while the other (the lagging strand) is synthesized discontinuously, away from the fork, in short segments called Okazaki fragments.",
        "DNA ligase later seals the gaps between Okazaki fragments into one continuous strand."
      ],
      flowDiagram: ["Fork opens", "Leading strand: continuous", "Lagging strand: Okazaki fragments", "Ligase seals gaps"],
      mcatConnection: "This is one of the most reliably tested single facts in molecular biology—expect a question that simply asks why the lagging strand needs fragments at all, testing whether you understand the 5'→3' restriction is the root cause, not an arbitrary rule.",
      quickCheck: {
        prompt: "Why is the lagging strand synthesized as Okazaki fragments rather than continuously?",
        options: ["DNA polymerase cannot synthesize DNA at all on this strand", "DNA polymerase only synthesizes 5' to 3', so this strand must be built discontinuously away from the fork", "Helicase blocks continuous synthesis on this strand", "This strand doesn't require a primer"],
        correctIndex: 1,
        explanation: "The 5' to 3' synthesis restriction, combined with antiparallel strand orientation, forces discontinuous synthesis on the lagging strand—DNA polymerase does synthesize on this strand, just in fragments, each still requiring its own primer."
      },
      keyTakeaway: "The leading strand synthesizes continuously toward the fork; the lagging strand synthesizes discontinuously as Okazaki fragments, away from the fork, later joined by ligase."
    },
    {
      number: "03",
      id: "dna-repair",
      title: "DNA Repair Mechanisms",
      difficulty: "REASON",
      coreIdea: "Proofreading, mismatch repair, and nucleotide excision repair work in layers to keep the DNA replication error rate extremely low.",
      learn: [
        "DNA polymerase has proofreading ability, immediately checking and correcting most misincorporated bases as it replicates. Mismatch repair scans newly replicated DNA afterward for any remaining errors the proofreading missed.",
        "Nucleotide excision repair removes and replaces damaged or bulky DNA segments—such as UV-induced thymine dimers—by cutting out the damaged section and resynthesizing it using the undamaged strand as a template. Together, these layered mechanisms keep the mutation rate extremely low."
      ],
      mcatConnection: "Defective nucleotide excision repair is the real mechanism behind xeroderma pigmentosum, a favorite passage topic connecting molecular biology directly to a clinical condition—know that its hallmark is extreme UV sensitivity from unrepaired thymine dimers.",
      quickCheck: {
        prompt: "A cell has a defective nucleotide excision repair pathway and is exposed to UV light. What is the most likely consequence?",
        options: ["Faster, more accurate replication", "Accumulation of unrepaired thymine dimers, increasing mutation risk", "Immediate cell death in all cases", "No effect, since UV doesn't damage DNA"],
        correctIndex: 1,
        explanation: "Without nucleotide excision repair, UV-induced thymine dimers accumulate, raising mutation risk—the cell doesn't necessarily die immediately, and UV light does cause real DNA damage."
      },
      keyTakeaway: "Three layered systems catch replication errors: real-time proofreading by DNA polymerase, after-the-fact mismatch repair, and nucleotide excision repair for damage like UV-induced thymine dimers."
    }
  ]
};
