// Document-lesson content for "RNA" (lib/mcatPath.ts's rna LessonContent
// entry)—restructured from that same real entry. See lib/documentLesson.ts
// for the shared shape.
import { DocumentLessonContent } from "../documentLesson";

export const rnaContent: DocumentLessonContent = {
  lessonIntro: {
    description: "RNA is DNA's working copy—built to carry genetic instructions out of the nucleus and put them to use, rather than to store them permanently. This lesson covers what makes RNA structurally different from DNA, its three main functional types, and how it's made.",
    objectives: [
      "Name the three structural differences between RNA and DNA",
      "Distinguish mRNA, tRNA, and rRNA by function",
      "Describe what happens during transcription",
      "Identify where transcription occurs in a eukaryotic cell"
    ]
  },
  bigPicture: {
    flow: ["DNA gene", "RNA polymerase", "mRNA transcript", "Leaves the nucleus"],
    caption: "Transcription is the first step in reading a gene: RNA polymerase copies one gene from the DNA template into a matching mRNA molecule, which then carries that instruction to the ribosome."
  },
  concepts: [
    {
      number: "01",
      id: "rna-vs-dna",
      title: "RNA vs. DNA",
      difficulty: "UNDERSTAND",
      coreIdea: "RNA differs from DNA in three key structural ways: it's single-stranded, it uses ribose instead of deoxyribose, and it substitutes uracil for thymine.",
      learn: [
        "RNA differs from DNA in three specific structural ways, not just one. First, it's single-stranded rather than double-stranded. Second, its sugar is ribose rather than DNA's deoxyribose. Third, it substitutes the base uracil for thymine—uracil pairs with adenine the same way thymine does in DNA.",
        "Every one of these three differences is independently testable, and questions often isolate just one of them (e.g., \"which sugar\" or \"which base\") rather than asking for all three at once."
      ],
      mcatConnection: "Confusing thymine and uracil—or forgetting that RNA is single-stranded—is one of the most common careless-error traps in MCAT molecular biology, precisely because the two molecules are so structurally similar otherwise.",
      quickCheck: {
        prompt: "RNA differs structurally from DNA because RNA is:",
        options: ["Double-stranded", "Single-stranded", "Found only in mitochondria", "Made of amino acids"],
        correctIndex: 1,
        explanation: "RNA is single-stranded, unlike double-stranded DNA. It isn't restricted to mitochondria, and like DNA, it's made of nucleotides, not amino acids."
      },
      keyTakeaway: "RNA differs from DNA in three ways: single-stranded (not double), ribose (not deoxyribose), and uracil (not thymine)."
    },
    {
      number: "02",
      id: "types-of-rna",
      title: "Types of RNA",
      difficulty: "IDENTIFY",
      coreIdea: "Three main types of RNA carry out gene expression, each with a distinct role: mRNA carries the message, tRNA delivers amino acids, and rRNA builds the ribosome itself.",
      learn: [
        "Three main types of RNA carry out gene expression. Messenger RNA (mRNA) carries the genetic message copied from DNA out to where it's needed. Transfer RNA (tRNA) delivers specific amino acids to the ribosome during translation, matching each one to the correct part of the mRNA message.",
        "Ribosomal RNA (rRNA) is different from the other two: rather than carrying information, it forms the structural and catalytic core of the ribosome itself—the machine that reads mRNA and builds proteins."
      ],
      mcatConnection: "Matching each RNA type to its one-line function is a recurring, fast-scoring question type—the exam expects instant recall here rather than reasoning through it.",
      quickCheck: {
        prompt: "Which type of RNA carries amino acids to the ribosome?",
        options: ["mRNA", "tRNA", "rRNA", "hnRNA"],
        correctIndex: 1,
        explanation: "tRNA delivers specific amino acids matching each codon. mRNA carries the genetic message rather than amino acids, and rRNA forms part of the ribosome's own structure rather than transporting anything."
      },
      keyTakeaway: "mRNA carries the message, tRNA fetches the amino acids, and rRNA builds the ribosome that puts them together."
    },
    {
      number: "03",
      id: "transcription",
      title: "Transcription",
      difficulty: "INTERPRET",
      coreIdea: "Transcription copies a gene from DNA into a complementary mRNA strand, carried out by RNA polymerase—in eukaryotes, entirely inside the nucleus.",
      learn: [
        "Transcription copies a gene from DNA into a complementary mRNA strand. RNA polymerase reads the DNA template strand directly and builds the matching mRNA molecule, nucleotide by nucleotide.",
        "In eukaryotic cells, this entire process happens inside the nucleus, since that's where the DNA template lives—the finished mRNA molecule then has to travel out of the nucleus before it can reach a ribosome for translation."
      ],
      mcatConnection: "The nucleus-vs-cytoplasm location distinction (transcription in the nucleus, translation in the cytoplasm) is a compact, high-yield fact the exam tests directly and often, since it's easy to verify with a single well-placed question.",
      quickCheck: {
        prompt: "Where does transcription primarily occur in eukaryotic cells?",
        options: ["Cytoplasm", "Mitochondria", "Nucleus", "Golgi apparatus"],
        correctIndex: 2,
        explanation: "Transcription occurs in the nucleus, where the DNA template is located. Translation—not transcription—happens in the cytoplasm; the Golgi apparatus processes proteins and lipids, not RNA."
      },
      keyTakeaway: "Transcription is DNA being copied into mRNA by RNA polymerase, happening in the nucleus—separate from translation, which happens afterward in the cytoplasm."
    }
  ]
};
