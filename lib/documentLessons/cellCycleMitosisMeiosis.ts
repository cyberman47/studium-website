// Document-lesson content for "Cell Cycle, Mitosis & Meiosis"
// (lib/mcatPath.ts's cell-cycle-mitosis-meiosis LessonContent entry)—
// restructured from that same real entry. See lib/documentLesson.ts for the
// shared shape.
import { DocumentLessonContent } from "../documentLesson";

export const cellCycleMitosisMeiosisContent: DocumentLessonContent = {
  lessonIntro: {
    description: "Cell division has to be both accurate and, for reproduction, genetically diverse—two goals met by two different processes. This lesson covers the checkpoint-controlled cell cycle, the four phases of mitosis, and how meiosis produces varied, haploid gametes.",
    objectives: [
      "Name the phases of the cell cycle and what happens in each",
      "Explain why cell cycle checkpoints matter",
      "Order the four phases of mitosis",
      "Explain how crossing over and independent assortment create genetic variation"
    ]
  },
  bigPicture: {
    flow: ["G1 (grow)", "S (replicate DNA)", "G2 (prepare)", "M (divide)"],
    caption: "The cell cycle is a checklist with built-in inspections—checkpoints act like inspectors that halt the process if DNA is damaged or incompletely copied, before the cell is allowed to divide."
  },
  concepts: [
    {
      number: "01",
      id: "cell-cycle-checkpoints",
      title: "The Cell Cycle and Checkpoints",
      difficulty: "UNDERSTAND",
      coreIdea: "The cell cycle (G1, S, G2, M) is monitored by checkpoints that verify DNA is undamaged and correctly replicated before allowing division to continue.",
      learn: [
        "The cell cycle is the ordered sequence a cell follows between divisions: interphase (G1, S, G2) followed by mitosis (M phase). During G1, the cell grows and carries out its normal functions; during S phase, it replicates its entire DNA; during G2, it prepares for division.",
        "Checkpoints at the end of G1, G2, and during M phase verify that DNA is undamaged and correctly replicated before allowing the cycle to proceed—when checkpoints fail, uncontrolled division can result, which is the basis of cancer."
      ],
      mcatConnection: "Checkpoint failure as a mechanism behind cancer is a high-yield connection between cell biology and pathology—expect passages that describe a mutated checkpoint protein (like p53) and ask you to explain the downstream consequence.",
      quickCheck: {
        prompt: "A cell with damaged DNA fails to arrest at the G1 checkpoint and continues dividing. What is the most likely consequence?",
        options: ["The cell will repair the DNA automatically during mitosis", "The damaged DNA may be replicated and passed to daughter cells, potentially leading to uncontrolled division", "The cell will immediately undergo meiosis instead", "Nothing—checkpoints have no effect on cell division"],
        correctIndex: 1,
        explanation: "Bypassing the checkpoint lets damaged DNA propagate, which is a key mechanism underlying cancer—mitosis doesn't repair DNA, and somatic cells don't switch to meiosis."
      },
      keyTakeaway: "The cell cycle progresses through G1, S, G2, and M, with checkpoints that halt division if DNA is damaged or incompletely replicated—checkpoint failure underlies uncontrolled (cancerous) division."
    },
    {
      number: "02",
      id: "mitosis",
      title: "Mitosis",
      difficulty: "IDENTIFY",
      coreIdea: "Mitosis divides replicated chromosomes into two genetically identical daughter cells through prophase, metaphase, anaphase, and telophase.",
      learn: [
        "Mitosis divides one cell's replicated chromosomes into two genetically identical daughter cells, used for growth and tissue repair. It proceeds through four phases: prophase, when chromosomes condense and the spindle begins to form; metaphase, when chromosomes align at the cell's equator.",
        "Anaphase, when sister chromatids are pulled apart to opposite poles; and telophase, when two new nuclei form, followed by cytokinesis, which physically splits the cytoplasm into two cells."
      ],
      flowDiagram: ["Prophase (condense)", "Metaphase (align)", "Anaphase (separate)", "Telophase (new nuclei)"],
      mcatConnection: "Knowing the phase order cold (PMAT) lets you quickly identify which phase a described or pictured cell is in—a very common, fast-scoring question type on cell biology passages.",
      quickCheck: {
        prompt: "Which phase of mitosis is characterized by chromosomes aligning at the cell's equator?",
        options: ["Prophase", "Metaphase", "Anaphase", "Telophase"],
        correctIndex: 1,
        explanation: "Metaphase is defined by chromosome alignment at the metaphase plate—prophase precedes it (condensing chromosomes), and anaphase and telophase follow (separation and new nuclei)."
      },
      keyTakeaway: "Mitosis proceeds prophase → metaphase → anaphase → telophase, followed by cytokinesis, producing two genetically identical diploid daughter cells."
    },
    {
      number: "03",
      id: "meiosis-genetic-variation",
      title: "Meiosis and Genetic Variation",
      difficulty: "REASON",
      coreIdea: "Meiosis halves the chromosome number through two divisions after one round of replication, with crossing over and independent assortment generating genetic variation.",
      learn: [
        "Meiosis produces gametes (sperm and egg) through two rounds of division (meiosis I and II) but only one round of DNA replication, halving the chromosome number from diploid to haploid. Meiosis I separates homologous chromosome pairs; meiosis II separates sister chromatids, similar to mitosis.",
        "Two mechanisms generate genetic variation during meiosis: crossing over, where homologous chromosomes exchange segments during prophase I, and independent assortment, where each pair of homologous chromosomes lines up and separates independently of the others."
      ],
      mcatConnection: "The exam often asks you to distinguish what crossing over does (exchanges segments between homologs) from what independent assortment does (randomizes which homolog goes where)—both increase variation, but through different mechanisms, and conflating them is a common error.",
      quickCheck: {
        prompt: "How many rounds of DNA replication and division occur in meiosis?",
        options: ["Two rounds of replication, one round of division", "One round of replication, two rounds of division", "Two rounds of both replication and division", "One round of both replication and division"],
        correctIndex: 1,
        explanation: "DNA is replicated once, then the cell divides twice (meiosis I and II), halving the chromosome number—replication happens only once, distinguishing meiosis from a simple doubling of mitosis."
      },
      keyTakeaway: "Meiosis replicates DNA once but divides twice, producing four haploid gametes—crossing over and independent assortment together make each gamete genetically unique."
    }
  ]
};
