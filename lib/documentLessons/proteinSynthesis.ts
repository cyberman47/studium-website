// Document-lesson content for "Protein Synthesis" (lib/mcatPath.ts's
// protein-synthesis LessonContent entry)—restructured from that same real
// entry. See lib/documentLesson.ts for the shared shape.
import { DocumentLessonContent } from "../documentLesson";

export const proteinSynthesisContent: DocumentLessonContent = {
  lessonIntro: {
    description: "This lesson closes the loop from DNA to a working protein: the central dogma, how the ribosome actually reads mRNA three letters at a time, and why a protein's final shape matters as much as its sequence.",
    objectives: [
      "State the central dogma of molecular biology",
      "Explain what a codon and an anticodon are, and how they match up",
      "Describe what starts and stops translation",
      "Explain what denaturation is and why it matters"
    ]
  },
  bigPicture: {
    flow: ["DNA", "Transcription", "mRNA", "Translation", "Protein"],
    caption: "The central dogma in one line: DNA is transcribed into RNA, and RNA is translated into protein—two distinct steps, each with its own machinery, location, and vocabulary."
  },
  concepts: [
    {
      number: "01",
      id: "gene-to-protein",
      title: "From Gene to Protein",
      difficulty: "UNDERSTAND",
      coreIdea: "The central dogma describes the flow of genetic information: DNA is transcribed into RNA, and RNA is translated into protein.",
      learn: [
        "The central dogma of molecular biology describes the flow of genetic information in one direction: DNA is transcribed into RNA, and RNA is translated into protein. This two-step process—transcription followed by translation—is how a gene actually gets expressed as a functional molecule.",
        "Gene expression is the general term for that whole process: using the information stored in a gene to build a functional product, almost always a protein."
      ],
      mcatConnection: "The central dogma is the organizing skeleton for nearly every molecular biology passage—before diving into specifics, quickly locating whether a question is about the transcription step or the translation step will usually point you to the right vocabulary and enzymes.",
      quickCheck: {
        prompt: "The central dogma of molecular biology describes information flowing in which direction?",
        options: ["Protein to RNA to DNA", "DNA to RNA to protein", "RNA to DNA to protein", "Protein directly to DNA"],
        correctIndex: 1,
        explanation: "The central dogma describes DNA being transcribed into RNA, which is then translated into protein—one direction, DNA to RNA to protein, not the reverse."
      },
      keyTakeaway: "The central dogma is DNA → RNA → protein: transcription first, then translation."
    },
    {
      number: "02",
      id: "translation",
      title: "Translation",
      difficulty: "IDENTIFY",
      coreIdea: "At the ribosome, mRNA is read in three-nucleotide codons, each matched by a tRNA anticodon carrying the correct amino acid, from a start codon until a stop codon is reached.",
      learn: [
        "At the ribosome, mRNA is read in codons—three-nucleotide sequences, each one specifying either a single amino acid or a stop signal. Each codon is matched by a tRNA molecule carrying a complementary three-nucleotide anticodon and the one specific amino acid that codon calls for.",
        "Translation begins at a start codon (AUG, which also codes for the amino acid methionine) and continues, codon by codon, until a stop codon is reached—at which point the finished polypeptide chain is released from the ribosome."
      ],
      flowDiagram: ["mRNA codon read", "Matching tRNA anticodon", "Amino acid added", "Stop codon → release"],
      mcatConnection: "The codon/anticodon relationship is tested constantly, often through a codon table the passage expects you to read correctly under time pressure—the concept itself (three bases, one amino acid, matched by a complementary tRNA) is simple, but reading errors are the real risk.",
      quickCheck: {
        prompt: "The start codon AUG codes for which amino acid?",
        options: ["Glycine", "Methionine", "Leucine", "Alanine"],
        correctIndex: 1,
        explanation: "AUG both signals the start of translation and codes for methionine—it does double duty as the start signal and the first amino acid of the new polypeptide."
      },
      keyTakeaway: "Translation reads mRNA three nucleotides (one codon) at a time, matched by tRNA anticodons carrying specific amino acids, from a start codon to a stop codon."
    },
    {
      number: "03",
      id: "protein-folding",
      title: "Protein Folding and Function",
      difficulty: "REASON",
      coreIdea: "A finished polypeptide must fold into its correct 3D shape to function; heat, extreme pH, or other stress can cause denaturation, which usually destroys that function.",
      learn: [
        "The finished polypeptide chain coming off the ribosome isn't yet a functional protein—it has to fold into a specific three-dimensional shape first, and that shape is what actually determines what the protein can do.",
        "Denaturation is the loss of that functional shape, caused by heat, extreme pH, or other environmental stress. A denatured protein usually loses its function even though its amino acid sequence hasn't changed at all—the shape, not just the sequence, is what matters."
      ],
      mcatConnection: "Denaturation is a favorite way for the exam to connect molecular biology to physiology—expect passages describing an enzyme losing activity at high temperature or extreme pH, expecting you to identify denaturation as the mechanism rather than a sequence change.",
      quickCheck: {
        prompt: "If a protein is denatured, it most likely:",
        options: ["Gains new function", "Loses its functional 3D shape and function", "Becomes a different amino acid", "Turns into RNA"],
        correctIndex: 1,
        explanation: "Denaturation destroys the folded shape a protein needs to function—it doesn't improve function, change one amino acid into another, or convert the protein into a different kind of molecule."
      },
      keyTakeaway: "A polypeptide isn't a functioning protein until it folds correctly; denaturation—from heat, pH, or stress—destroys that shape and, with it, function, without changing the underlying sequence."
    }
  ]
};
