// Document-lesson content for "Transcription & RNA" (lib/mcatPath.ts's
// transcription-rna LessonContent entry)—restructured from that same real
// entry. See lib/documentLesson.ts for the shared shape.
import { DocumentLessonContent } from "../documentLesson";

export const transcriptionRnaContent: DocumentLessonContent = {
  lessonIntro: {
    description: "Transcription is where gene expression actually begins—turning a DNA gene into a working RNA copy. This lesson covers how RNA polymerase finds and starts at the right gene, how it builds the transcript, and how eukaryotic cells process that raw transcript into mature, usable mRNA.",
    objectives: [
      "Explain the role of the promoter and, in eukaryotes, transcription factors",
      "Describe elongation and termination during transcription",
      "Name the three eukaryotic RNA-processing steps: capping, tailing, splicing",
      "Explain how alternative splicing increases protein diversity"
    ]
  },
  bigPicture: {
    flow: ["Transcription factors bind promoter", "RNA polymerase binds + elongates", "Terminator releases transcript", "Pre-mRNA processed"],
    caption: "Eukaryotic transcription needs one extra step prokaryotes skip: transcription factors have to open the door at the promoter before RNA polymerase II can even bind."
  },
  concepts: [
    {
      number: "01",
      id: "transcription-initiation",
      title: "Transcription Initiation",
      difficulty: "UNDERSTAND",
      coreIdea: "RNA polymerase binds a promoter to begin transcription; in eukaryotes, transcription factors must bind first before RNA polymerase II can attach.",
      learn: [
        "Transcription begins when RNA polymerase binds a specific DNA sequence called a promoter, located just upstream of the gene. In eukaryotes, transcription factors must first bind the promoter (often a TATA box) before RNA polymerase II can attach and begin—unlike in prokaryotes, where RNA polymerase can bind the promoter directly.",
        "Once bound, RNA polymerase unwinds the DNA locally and begins synthesizing a complementary RNA strand using one DNA strand (the template strand) as its guide."
      ],
      mcatConnection: "The prokaryote/eukaryote contrast here is a favorite exam target: prokaryotic RNA polymerase binds its promoter directly, while eukaryotic RNA polymerase II needs transcription factors to bind first—mixing these up is a common error.",
      quickCheck: {
        prompt: "In eukaryotic transcription, what must occur before RNA polymerase II binds the promoter?",
        options: ["DNA replication must occur first", "Transcription factors must bind the promoter", "The mRNA must be spliced", "A poly-A tail must be added"],
        correctIndex: 1,
        explanation: "In eukaryotes, transcription factors bind the promoter (often a TATA box) before RNA polymerase II can attach—splicing and poly-A tail addition happen after transcription, not before initiation."
      },
      keyTakeaway: "RNA polymerase initiates transcription at a promoter; eukaryotes require transcription factors to bind first, while prokaryotic RNA polymerase binds the promoter directly."
    },
    {
      number: "02",
      id: "elongation-termination",
      title: "Elongation and Termination",
      difficulty: "IDENTIFY",
      coreIdea: "RNA polymerase synthesizes RNA 5' to 3' during elongation and releases the transcript upon reaching a terminator sequence.",
      learn: [
        "During elongation, RNA polymerase moves along the DNA template, synthesizing RNA in the 5' to 3' direction, one nucleotide at a time, using uracil in place of thymine.",
        "Termination occurs when RNA polymerase reaches a specific terminator sequence, causing it to release both the DNA template and the newly made RNA transcript."
      ],
      mcatConnection: "Direction of synthesis (5' to 3') is shared by both RNA and DNA polymerase—a detail the exam likes to test by asking you to identify the direction from a labeled diagram rather than stating it directly.",
      quickCheck: {
        prompt: "RNA polymerase synthesizes RNA in which direction relative to the template strand?",
        options: ["3' to 5'", "5' to 3'", "Randomly, in either direction", "Only in the middle of the strand outward"],
        correctIndex: 1,
        explanation: "Like DNA polymerase, RNA polymerase synthesizes new nucleic acid strands 5' to 3'—synthesis direction is fixed and proceeds continuously from the start site, not randomly or from the middle outward."
      },
      keyTakeaway: "Elongation builds RNA 5' to 3' along the DNA template; termination at a terminator sequence releases the finished transcript."
    },
    {
      number: "03",
      id: "rna-processing",
      title: "Post-Transcriptional RNA Processing",
      difficulty: "REASON",
      coreIdea: "Eukaryotic pre-mRNA is capped, tailed, and spliced before leaving the nucleus—and alternative splicing lets one gene produce multiple proteins.",
      learn: [
        "In eukaryotes, the initial RNA transcript (pre-mRNA) is processed before leaving the nucleus. A 5' cap is added to protect the RNA and assist ribosome binding later, and a poly-A tail is added to the 3' end for stability. Splicing removes non-coding introns and joins the coding exons together, producing mature mRNA.",
        "Alternative splicing allows a single gene to produce multiple different protein products by including or excluding different exons in different combinations."
      ],
      mcatConnection: "Alternative splicing is the go-to explanation whenever a passage describes one gene producing multiple distinct, tissue-specific protein variants—recognizing this pattern quickly is a high-value shortcut on molecular biology passages.",
      quickCheck: {
        prompt: "A single gene produces three structurally different proteins in different tissues. What process most directly explains this?",
        options: ["DNA replication errors", "Alternative splicing of the same pre-mRNA transcript", "Random mutation in each tissue", "Different genes being used in each tissue"],
        correctIndex: 1,
        explanation: "Alternative splicing allows one gene's pre-mRNA to be processed into multiple distinct mature mRNAs and proteins—replication errors and random mutation wouldn't reliably produce specific, functional, tissue-appropriate variants, and the premise specifies a single gene."
      },
      keyTakeaway: "Eukaryotic pre-mRNA gets a 5' cap and poly-A tail for stability, and splicing removes introns—alternative splicing of the same transcript can produce multiple distinct proteins from one gene."
    }
  ]
};
