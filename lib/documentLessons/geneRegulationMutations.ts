// Document-lesson content for "Gene Regulation & Mutations"
// (lib/mcatPath.ts's gene-regulation-mutations LessonContent entry)—
// restructured from that same real entry. See lib/documentLesson.ts for the
// shared shape.
import { DocumentLessonContent } from "../documentLesson";

export const geneRegulationMutationsContent: DocumentLessonContent = {
  lessonIntro: {
    description: "Genes aren't just transcribed whenever they're present—cells decide when and how much. This lesson covers the classic prokaryotic operon model, the more layered eukaryotic system of enhancers and epigenetics, and the categories of DNA mutation that can disrupt any of it.",
    objectives: [
      "Explain how the lac operon turns transcription on and off in response to lactose",
      "Explain how enhancers and epigenetic marks regulate eukaryotic transcription",
      "Distinguish silent, missense, and nonsense point mutations",
      "Explain why frameshift mutations are usually more disruptive than point mutations"
    ]
  },
  bigPicture: {
    flow: ["Repressor blocks operator", "Signal (e.g. lactose) inactivates repressor", "RNA polymerase transcribes", "Genes expressed on demand"],
    caption: "The lac operon is regulation at its simplest: a doorstop (repressor) holds the door shut by default, and only the right key opens it—eukaryotic regulation builds many more layers on top of this same basic idea."
  },
  concepts: [
    {
      number: "01",
      id: "prokaryotic-gene-regulation",
      title: "Prokaryotic Gene Regulation",
      difficulty: "UNDERSTAND",
      coreIdea: "The lac operon shows how a repressor blocks transcription by default, and how a signal (lactose) can inactivate it to allow transcription on demand.",
      learn: [
        "Bacteria often organize related genes into an operon: a single promoter controlling a cluster of genes transcribed together as one mRNA. The lac operon is the classic example—it controls genes for lactose digestion.",
        "A repressor protein normally binds the operator (a regulatory DNA sequence) and blocks transcription. When lactose is present, it binds and inactivates the repressor, allowing RNA polymerase to transcribe the operon's genes—an efficient, on-demand system that avoids wasting energy producing enzymes the cell doesn't currently need."
      ],
      mcatConnection: "The lac operon is the single most-tested gene regulation example on the exam—know the direction of the logic precisely: lactose present → repressor inactivated → transcription proceeds, not the reverse.",
      quickCheck: {
        prompt: "In the lac operon, what happens when lactose is present in the cell?",
        options: ["The repressor binds more tightly to the operator", "Lactose inactivates the repressor, allowing transcription of the operon", "RNA polymerase is permanently blocked", "The operon is deleted from the genome"],
        correctIndex: 1,
        explanation: "Lactose binds and inactivates the repressor, freeing the operator so RNA polymerase can transcribe the operon—lactose presence weakens, not strengthens, repressor binding, and gene regulation never involves deleting the operon."
      },
      keyTakeaway: "The lac operon is repressed by default; lactose inactivates the repressor, letting RNA polymerase transcribe the lactose-digesting genes only when they're actually needed."
    },
    {
      number: "02",
      id: "eukaryotic-gene-regulation",
      title: "Eukaryotic Gene Regulation",
      difficulty: "IDENTIFY",
      coreIdea: "Eukaryotic regulation adds enhancers (often distant regulatory sequences) and epigenetic mechanisms like DNA methylation and histone modification.",
      learn: [
        "Eukaryotic gene regulation is more layered. Transcription factors bind promoters and enhancers (regulatory sequences that can be far from the gene they control) to increase or decrease transcription rates.",
        "Epigenetic mechanisms add another layer without altering the DNA sequence itself: DNA methylation typically silences genes, while histone modification changes how tightly DNA is packaged, making genes more or less accessible for transcription."
      ],
      mcatConnection: "\"Epigenetic\" specifically means a heritable change in expression without a DNA sequence change—expect the exam to test this definition directly by asking you to distinguish an epigenetic mechanism (methylation) from a genetic one (mutation).",
      quickCheck: {
        prompt: "DNA methylation typically has what effect on gene expression?",
        options: ["It increases transcription of the affected gene", "It silences transcription of the affected gene", "It has no effect on transcription", "It permanently deletes the gene"],
        correctIndex: 1,
        explanation: "DNA methylation typically silences gene expression without altering the underlying DNA sequence—it's a real, reversible regulatory effect, not a deletion, and not an increase in transcription."
      },
      keyTakeaway: "Eukaryotic regulation layers enhancers (distant transcription-factor binding sites) on top of epigenetic marks like DNA methylation and histone modification, which silence or open genes without changing the DNA sequence."
    },
    {
      number: "03",
      id: "mutations",
      title: "Mutations",
      difficulty: "REASON",
      coreIdea: "Point mutations (silent, missense, nonsense) change one base; frameshift mutations insert/delete bases not divisible by three, shifting the whole downstream reading frame.",
      learn: [
        "A point mutation changes a single DNA base. A silent mutation changes a codon but not the resulting amino acid (due to the genetic code's redundancy); a missense mutation changes the codon to specify a different amino acid; a nonsense mutation changes a codon to a premature stop codon, truncating the protein.",
        "A frameshift mutation—caused by inserting or deleting a number of bases not divisible by three—shifts the entire reading frame downstream, typically scrambling the rest of the protein sequence and usually producing a nonfunctional protein."
      ],
      mcatConnection: "Frameshift vs. point mutation severity is a reliable exam pattern: point mutations affect at most one amino acid (or none, if silent), while frameshifts corrupt everything downstream—recognizing which type a described insertion/deletion causes (check divisibility by three) is the key skill.",
      quickCheck: {
        prompt: "An insertion of one nucleotide occurs early in a gene's coding sequence. What is the most likely effect on the resulting protein?",
        options: ["No effect on the protein at all", "A single amino acid is changed", "The entire downstream reading frame is shifted, usually scrambling the protein", "The gene is duplicated"],
        correctIndex: 2,
        explanation: "An insertion not divisible by three shifts the reading frame for every downstream codon, typically scrambling the rest of the protein—a single-nucleotide insertion is highly disruptive, not neutral, and doesn't simply change one amino acid or duplicate the gene."
      },
      keyTakeaway: "Point mutations (silent, missense, nonsense) change at most one amino acid; frameshift mutations shift the entire downstream reading frame and are usually far more disruptive."
    }
  ]
};
