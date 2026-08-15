// Document-lesson content for "DNA" (lib/mcatPath.ts's dna LessonContent
// entry)—restructured from that same real entry. See lib/documentLesson.ts
// for the shared shape.
import { DocumentLessonContent } from "../documentLesson";

export const dnaContent: DocumentLessonContent = {
  lessonIntro: {
    description: "DNA is the molecule every other lesson in this section ultimately traces back to. This lesson covers its physical structure, how it's faithfully copied every time a cell divides, and how an enormous amount of it fits inside a nucleus far smaller than the molecule itself.",
    objectives: [
      "Describe DNA's double-helix structure and base-pairing rules",
      "Explain what \"semiconservative\" replication actually means",
      "Name the two key enzymes involved in replication and what each does",
      "Explain how DNA is packaged into chromosomes"
    ]
  },
  bigPicture: {
    flow: ["Helicase unwinds", "Two template strands", "DNA polymerase synthesizes", "Two new double helices"],
    caption: "Every round of replication follows this same sequence—the helix is opened up before it's copied, and each new molecule is assembled directly against an original strand acting as the template."
  },
  concepts: [
    {
      number: "01",
      id: "dna-structure",
      title: "DNA Structure",
      difficulty: "UNDERSTAND",
      coreIdea: "DNA is a double helix made of two antiparallel strands of nucleotides, held together by a fixed base-pairing pattern.",
      learn: [
        "DNA is a double helix made of two antiparallel strands of nucleotides—meaning the two strands run in opposite chemical directions relative to each other. Each nucleotide contains a sugar, a phosphate, and one of four bases: adenine (A), thymine (T), guanine (G), or cytosine (C).",
        "Bases pair in a fixed pattern—A with T, G with C—held together by hydrogen bonds between the two strands. That fixed pairing is what makes DNA's two strands complementary rather than identical: knowing one strand's sequence tells you the other's automatically."
      ],
      mcatConnection: "Base-pairing rules are foundational enough that the exam rarely tests them directly—instead, expect passages to hand you one strand's sequence and require you to derive the complementary strand, or an mRNA transcript, correctly and quickly.",
      quickCheck: {
        prompt: "In DNA, adenine pairs with:",
        options: ["Guanine", "Cytosine", "Thymine", "Uracil"],
        correctIndex: 2,
        explanation: "Adenine pairs with thymine in DNA. Guanine pairs with cytosine instead, and uracil is RNA's substitute for thymine—it doesn't appear in DNA at all."
      },
      keyTakeaway: "DNA's two strands are complementary, not identical, held together by a fixed base-pairing rule: A with T, G with C."
    },
    {
      number: "02",
      id: "dna-replication",
      title: "DNA Replication",
      difficulty: "IDENTIFY",
      coreIdea: "DNA replication is semiconservative—each new molecule contains one original strand and one newly synthesized strand—carried out by helicase and DNA polymerase.",
      learn: [
        "Replication is semiconservative: each new DNA molecule ends up with one original (parental) strand and one newly synthesized strand, rather than two entirely new strands or two entirely old ones.",
        "Helicase unwinds the double helix, separating the two original strands so each can serve as a template. DNA polymerase then synthesizes the new complementary strands, reading each template and adding the nucleotide that correctly base-pairs with it."
      ],
      flowDiagram: ["Helicase unwinds", "Two template strands exposed", "DNA polymerase adds nucleotides", "Two new double helices"],
      mcatConnection: "\"Semiconservative\" is one of the single most frequently tested vocabulary terms in MCAT molecular biology—passages will describe the mechanism without using the word, and expect you to recognize and name it.",
      quickCheck: {
        prompt: "What does semiconservative replication mean?",
        options: ["Both strands of the new molecule are entirely new", "One strand is original, one is new, in each daughter molecule", "DNA is not replicated at all", "Only half the genome is copied"],
        correctIndex: 1,
        explanation: "Each daughter molecule keeps one original strand and gains one newly synthesized strand—that's what \"semiconservative\" describes. The entire genome is copied, not half, and both strands being entirely new would describe a different (\"conservative\") model that isn't how DNA actually replicates."
      },
      keyTakeaway: "DNA replication is semiconservative: helicase unwinds the helix, and DNA polymerase builds a new complementary strand against each original, so every new molecule is half old, half new."
    },
    {
      number: "03",
      id: "chromosomes-and-packaging",
      title: "Chromosomes and Packaging",
      difficulty: "INTERPRET",
      coreIdea: "DNA is wrapped around histone proteins to form chromatin, which condenses into visible chromosomes during cell division—letting a huge amount of DNA fit inside a tiny nucleus.",
      learn: [
        "DNA is wrapped around proteins called histones to form chromatin. This packaging is what lets an enormous length of DNA—far longer than the nucleus containing it—fit inside that tiny space.",
        "During normal interphase, chromatin stays relatively loose, which allows the cell's machinery to access genes for transcription. During cell division, that same chromatin condenses tightly into the visible, X-shaped chromosomes most people picture, which makes accurate separation between daughter cells possible."
      ],
      mcatConnection: "Passages sometimes ask why chromatin needs to condense specifically during division (rather than staying condensed all the time)—the answer connects directly back to gene accessibility: tightly packed chromatin can't be transcribed.",
      quickCheck: {
        prompt: "Chromatin condenses into visible chromosomes primarily during:",
        options: ["Interphase", "Cell division", "Protein synthesis", "Apoptosis only"],
        correctIndex: 1,
        explanation: "Chromatin condenses tightly into chromosomes during cell division, for accurate separation. During interphase, chromatin is typically kept looser to allow gene access, and condensation isn't specific to protein synthesis or to cell death."
      },
      keyTakeaway: "DNA wraps around histones to form chromatin, which stays loose for gene access during interphase and condenses into chromosomes only during division."
    }
  ]
};
