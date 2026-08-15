// Document-lesson content for "Nucleic Acids" (lib/mcatPath.ts's
// nucleic-acids LessonContent entry)—restructured from that same real
// entry. See lib/documentLesson.ts for the shared shape.
import { DocumentLessonContent } from "../documentLesson";

export const nucleicAcidsContent: DocumentLessonContent = {
  lessonIntro: {
    description: "This lesson looks at nucleic acids from the chemistry side: what a nucleotide is actually made of, how those nucleotides link and pair to form the double helix, and the other essential jobs nucleotide-derived molecules do beyond storing genetic information.",
    objectives: [
      "Name the three components of a nucleotide",
      "Distinguish purines from pyrimidines",
      "Explain complementary base pairing and why G-C pairs are more stable than A-T pairs",
      "Name three nucleotide derivatives and their non-genetic roles"
    ]
  },
  bigPicture: {
    flow: ["Sugar + phosphate + base", "Nucleotide", "Phosphodiester bonds", "Antiparallel double strand"],
    caption: "A nucleic acid is built the same way a protein or carbohydrate is—simple repeating units linked by one bond type—but its units also carry a second, separate function: pairing with a specific partner base."
  },
  concepts: [
    {
      number: "01",
      id: "nucleotide-components",
      title: "Nucleotide Components",
      difficulty: "UNDERSTAND",
      coreIdea: "A nucleotide is a pentose sugar, a phosphate group, and a nitrogenous base—either a two-ring purine or a one-ring pyrimidine.",
      learn: [
        "A nucleotide has three parts: a five-carbon (pentose) sugar, a phosphate group, and a nitrogenous base. Nitrogenous bases fall into two structural classes: purines (adenine and guanine), which have a two-ring structure, and pyrimidines (cytosine, thymine, and uracil), which have a single-ring structure.",
        "DNA's sugar is deoxyribose; RNA's is ribose, distinguished by a single extra hydroxyl group at the 2' carbon."
      ],
      mcatConnection: "\"Purines: two rings, PUR-ine has more letters and more rings\" is a common trick for keeping purine (A, G) vs. pyrimidine (C, T, U) straight quickly under time pressure.",
      quickCheck: {
        prompt: "What structural feature distinguishes a purine from a pyrimidine?",
        options: ["Purines have a single ring; pyrimidines have two rings", "Purines have two rings; pyrimidines have a single ring", "Purines contain a phosphate group; pyrimidines do not", "Purines are only found in RNA"],
        correctIndex: 1,
        explanation: "Purines (adenine, guanine) have a fused two-ring structure; pyrimidines (cytosine, thymine, uracil) have a single ring—the phosphate group is separate from the base and present regardless of base type."
      },
      keyTakeaway: "A nucleotide is a pentose sugar, phosphate group, and nitrogenous base—purines (A, G) have two rings, pyrimidines (C, T, U) have one."
    },
    {
      number: "02",
      id: "phosphodiester-strand-structure",
      title: "Phosphodiester Bonds and Strand Structure",
      difficulty: "IDENTIFY",
      coreIdea: "Phosphodiester bonds link nucleotides into an antiparallel double strand held together by complementary base pairing (A-T: 2 H-bonds; G-C: 3 H-bonds).",
      learn: [
        "Nucleotides link together via phosphodiester bonds, connecting the phosphate group of one nucleotide to the sugar of the next, building a strand with directionality: a free phosphate at the 5' end and a free hydroxyl at the 3' end.",
        "In double-stranded DNA, two strands run antiparallel (one 5'→3', the other 3'→5') and pair through hydrogen bonds according to complementary base pairing: adenine with thymine (two hydrogen bonds) and guanine with cytosine (three hydrogen bonds)—which is why GC-rich DNA has a higher melting temperature than AT-rich DNA."
      ],
      mcatConnection: "GC content and melting temperature is a classic quantitative-reasoning setup—expect a passage giving you a DNA sequence's GC percentage and asking you to predict relative thermal stability compared to another sequence.",
      quickCheck: {
        prompt: "Which pair of nitrogenous bases forms three hydrogen bonds when paired?",
        options: ["Adenine and thymine", "Guanine and cytosine", "Adenine and uracil", "Thymine and cytosine"],
        correctIndex: 1,
        explanation: "G-C pairs form three hydrogen bonds, making GC-rich regions more thermally stable—A-T and A-U pairs each form only two hydrogen bonds, and thymine and cytosine are not complementary partners at all."
      },
      keyTakeaway: "Phosphodiester bonds link nucleotides 5' to 3'; the two DNA strands run antiparallel and pair via A-T (2 H-bonds) and G-C (3 H-bonds)."
    },
    {
      number: "03",
      id: "nucleotide-derivatives",
      title: "Nucleotide Derivatives and Their Roles",
      difficulty: "REASON",
      coreIdea: "Beyond genetic storage, nucleotide derivatives serve as the cell's energy currency (ATP), electron carriers (NAD+/FAD), and second messengers (cAMP).",
      learn: [
        "Beyond building DNA and RNA, individual nucleotides and their derivatives serve other essential roles. ATP (adenosine triphosphate) is the cell's main energy currency, releasing energy when its high-energy phosphate bonds are hydrolyzed.",
        "NAD+ and FAD are nucleotide-derived electron carriers central to cellular respiration, and cyclic AMP (cAMP) is a nucleotide-derived second messenger in cell signaling."
      ],
      mcatConnection: "Recognizing that ATP, NAD+, FAD, and cAMP are all nucleotide derivatives (not separate, unrelated molecule classes) helps connect this lesson directly to bioenergetics and cell-signaling passages elsewhere in the exam.",
      quickCheck: {
        prompt: "Which nucleotide derivative functions as an electron carrier in cellular respiration?",
        options: ["cAMP", "NAD+", "A phospholipid", "Cellulose"],
        correctIndex: 1,
        explanation: "NAD+ (along with FAD) is a nucleotide-derived electron carrier central to cellular respiration—cAMP is a second messenger, and phospholipids and cellulose are unrelated to nucleotides."
      },
      keyTakeaway: "Nucleotide derivatives extend far beyond DNA/RNA: ATP is energy currency, NAD+/FAD are electron carriers, and cAMP is a signaling second messenger."
    }
  ]
};
