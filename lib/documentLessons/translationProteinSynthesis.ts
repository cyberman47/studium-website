// Document-lesson content for "Translation & Protein Synthesis"
// (lib/mcatPath.ts's translation-protein-synthesis LessonContent entry)—
// restructured from that same real entry. See lib/documentLesson.ts for the
// shared shape.
import { DocumentLessonContent } from "../documentLesson";

export const translationProteinSynthesisContent: DocumentLessonContent = {
  lessonIntro: {
    description: "This lesson goes inside the ribosome itself: how translation actually starts, the three-site cycle that builds a polypeptide one amino acid at a time, and what has to happen after the ribosome finishes before a protein is truly functional.",
    objectives: [
      "Describe how the ribosome assembles at the start codon",
      "Name the ribosome's A, P, and E sites and their roles",
      "Explain what triggers translation termination",
      "Explain why post-translational modification is often still required"
    ]
  },
  bigPicture: {
    flow: ["Start codon found", "A site: tRNA enters", "P site: peptide bond forms", "E site: tRNA exits"],
    caption: "Elongation is one repeating cycle: a new tRNA enters at A, the chain grows and shifts to P, the spent tRNA leaves at E—repeated once per codon until a stop codon ends it."
  },
  concepts: [
    {
      number: "01",
      id: "translation-initiation",
      title: "Translation Initiation",
      difficulty: "UNDERSTAND",
      coreIdea: "The ribosome assembles at the mRNA's start codon (AUG), with an initiator tRNA carrying methionine positioned in the P site.",
      learn: [
        "Translation begins when the small ribosomal subunit binds the mRNA near its 5' cap and scans along it until it finds the start codon (AUG). An initiator tRNA carrying methionine base-pairs with the start codon.",
        "The large ribosomal subunit then joins to complete the assembled ribosome, positioning the initiator tRNA in the ribosome's P (peptidyl) site, ready for elongation to begin."
      ],
      mcatConnection: "Remember that AUG does double duty: it's both the start signal and codes for methionine, which is why nearly every newly synthesized eukaryotic polypeptide begins with methionine (often cleaved off later).",
      quickCheck: {
        prompt: "Which best describes the initiator tRNA's role in translation?",
        options: ["It enters the A site during elongation", "It carries methionine and base-pairs with the start codon to begin translation", "It signals termination", "It splices the mRNA before translation begins"],
        correctIndex: 1,
        explanation: "The initiator tRNA carries methionine and pairs with the AUG start codon to begin translation—it's positioned in the P site at initiation, not the A site, and has no role in termination or splicing."
      },
      keyTakeaway: "Translation initiates when the ribosome assembles at the AUG start codon, with an initiator tRNA carrying methionine seated in the P site."
    },
    {
      number: "02",
      id: "elongation-termination-translation",
      title: "Elongation and Termination",
      difficulty: "IDENTIFY",
      coreIdea: "Elongation cycles a new aminoacyl-tRNA through the A, P, and E sites, forming peptide bonds, until a stop codon triggers release factor binding.",
      learn: [
        "During elongation, a new aminoacyl-tRNA enters the ribosome's A (aminoacyl) site, matching its anticodon to the next mRNA codon. A peptide bond forms between the new amino acid and the growing chain, the ribosome shifts (translocates) by one codon, moving the tRNA from the A site to the P site and ejecting the previous, now-empty tRNA from the E (exit) site.",
        "This cycle repeats until a stop codon (UAA, UAG, or UGA) enters the A site; since no tRNA matches a stop codon, a release factor binds instead, freeing the finished polypeptide."
      ],
      flowDiagram: ["A site (tRNA enters)", "Peptide bond forms", "Translocation (A→P→E)", "Stop codon → release factor"],
      mcatConnection: "The reason translation stops at a stop codon is a favorite \"why,\" not \"what\" question—the exam wants you to explain that no tRNA anticodon matches a stop codon, not just recite the codon sequences.",
      quickCheck: {
        prompt: "Why does translation terminate when a stop codon enters the ribosome's A site?",
        options: ["A release factor binds instead of a tRNA, since no tRNA matches a stop codon", "The ribosome runs out of energy", "The mRNA is degraded at that point", "A special stop tRNA adds a terminal amino acid"],
        correctIndex: 0,
        explanation: "No tRNA anticodon matches a stop codon, so a release factor binds instead, ending translation—termination isn't caused by an energy shortage, mRNA degradation, or a special stop-recognizing tRNA (none exists)."
      },
      keyTakeaway: "Elongation cycles tRNAs through the A, P, and E sites to build the polypeptide one amino acid at a time; a stop codon ends the process by recruiting a release factor instead of a tRNA."
    },
    {
      number: "03",
      id: "post-translational-modification",
      title: "Post-Translational Modification",
      difficulty: "REASON",
      coreIdea: "A freshly translated polypeptide often needs chaperone-assisted folding and further modification—cleavage, glycosylation, targeting—before it functions as a mature protein.",
      learn: [
        "A freshly synthesized polypeptide is not yet a functional protein. Molecular chaperones assist it in folding into its correct three-dimensional shape.",
        "Many proteins are further modified afterward: a signal sequence may be cleaved off, sugar groups may be added (glycosylation), or the protein may be cleaved into a smaller, active form (as with many hormones and enzymes). Proteins are also directed to their correct cellular or extracellular location based on built-in targeting sequences."
      ],
      mcatConnection: "Expect passages describing a hormone synthesized as an inactive precursor (like proinsulin) that must be cleaved to become active—recognizing that this is a post-translational modification, not a translation error, is the key skill.",
      quickCheck: {
        prompt: "A newly synthesized polypeptide fails to fold correctly despite having the correct amino acid sequence. Which process most directly would normally prevent this?",
        options: ["Transcription", "Splicing", "Molecular chaperone-assisted folding", "DNA repair"],
        correctIndex: 2,
        explanation: "Molecular chaperones assist proper folding of the polypeptide into its functional shape—transcription and splicing occur earlier in gene expression, and DNA repair addresses genetic damage, not protein folding."
      },
      keyTakeaway: "A correct amino acid sequence isn't enough on its own—chaperone-assisted folding and modifications like cleavage or glycosylation are often required before a polypeptide becomes a working protein."
    }
  ]
};
