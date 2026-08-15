// Document-lesson content for "Cell Division" (lib/mcatPath.ts's
// cell-division LessonContent entry)—restructured from that same real
// entry. See lib/documentLesson.ts for the shared shape.
import { DocumentLessonContent } from "../documentLesson";

export const cellDivisionContent: DocumentLessonContent = {
  lessonIntro: {
    description: "Cells don't divide constantly or carelessly—division is a tightly regulated cycle with built-in checkpoints. This lesson covers that cycle, the two very different kinds of division (mitosis and meiosis), and where genetic variation actually comes from.",
    objectives: [
      "Describe the phases of the cell cycle and what happens in each",
      "Explain what mitosis produces and why",
      "Explain what meiosis produces and why it differs from mitosis",
      "Identify the two main sources of genetic variation during meiosis"
    ]
  },
  bigPicture: {
    flow: ["Interphase (G1, S, G2)", "Checkpoint", "Mitosis or Meiosis", "Daughter cells"],
    caption: "Interphase—where the cell grows and copies its DNA—takes up most of the cycle. Checkpoints along the way verify conditions are met before the cell is allowed to actually divide."
  },
  concepts: [
    {
      number: "01",
      id: "the-cell-cycle",
      title: "The Cell Cycle",
      difficulty: "UNDERSTAND",
      coreIdea: "The cell cycle alternates growth with division, and checkpoints throughout verify that conditions are met before the cell is allowed to proceed to the next phase.",
      learn: [
        "The cell cycle alternates growth with division. Interphase—made up of G1, S, and G2 sub-phases—is by far the longest part of the cycle, and is where the cell grows and replicates its DNA in preparation for division.",
        "Checkpoints throughout the cycle act as quality-control gates: they verify that conditions, like accurate DNA replication, have actually been met before letting the cell proceed to the next phase. A checkpoint that fails to catch a problem is how damaged cells can end up dividing when they shouldn't."
      ],
      flowDiagram: ["G1 (grow)", "S (replicate DNA)", "G2 (grow)", "Checkpoint", "Division"],
      mcatConnection: "Checkpoint failure is a favorite MCAT scenario for connecting cell biology to disease—an undetected error at a checkpoint is a direct, testable link to uncontrolled cell division and cancer.",
      quickCheck: {
        prompt: "During which phase of the cell cycle does DNA replication occur?",
        options: ["G1", "S phase", "G2", "Mitosis"],
        correctIndex: 1,
        explanation: "DNA is replicated during S (synthesis) phase. G1 is a growth phase before replication, G2 is a growth phase after replication, and mitosis is the division phase, which happens after DNA is already replicated."
      },
      keyTakeaway: "The cell cycle alternates growth (interphase) with division, and checkpoints act as gates that verify conditions—like successful DNA replication—before the cycle is allowed to continue."
    },
    {
      number: "02",
      id: "mitosis",
      title: "Mitosis: Prophase to Telophase",
      difficulty: "IDENTIFY",
      coreIdea: "Mitosis divides one cell into two genetically identical diploid daughter cells, used for growth and tissue repair.",
      learn: [
        "Mitosis takes one cell through a sequence of phases—chromosomes condense, align at the cell's equator, and are pulled apart by spindle fibers—before the cell physically splits into two.",
        "The result is two genetically identical diploid daughter cells. This is the division your body uses constantly for growth and tissue repair, not for producing reproductive cells."
      ],
      mcatConnection: "Mitosis questions typically ask you to reason about the outcome (how many cells, what ploidy) rather than name every individual phase—knowing that mitosis always produces two identical diploid cells is usually the fastest path to the right answer.",
      quickCheck: {
        prompt: "How many daughter cells result from one round of mitosis, and are they haploid or diploid?",
        options: ["Two, haploid", "Four, haploid", "Two, diploid", "Four, diploid"],
        correctIndex: 2,
        explanation: "Mitosis produces two genetically identical diploid daughter cells—not four, and not haploid. Producing four haploid cells is what distinguishes meiosis instead."
      },
      keyTakeaway: "Mitosis is a copy machine: one cell becomes two identical diploid cells, used for growth and repair."
    },
    {
      number: "03",
      id: "meiosis-and-variation",
      title: "Meiosis and Genetic Variation",
      difficulty: "REASON",
      coreIdea: "Meiosis involves two rounds of division, producing four genetically distinct haploid gametes—with crossing over and independent assortment as the two main sources of that variation.",
      learn: [
        "Meiosis involves two rounds of division, producing four genetically distinct haploid gametes for sexual reproduction—a very different outcome from mitosis's two identical diploid cells.",
        "Two processes during meiosis I are responsible for most genetic variation between gametes: crossing over, the exchange of DNA segments between homologous chromosomes (one inherited from each parent), and independent assortment, the random distribution of those homologous chromosome pairs into daughter cells. Together, they're why siblings—despite sharing the same two parents—aren't genetically identical to each other."
      ],
      mcatConnection: "Distinguishing crossing over from independent assortment—which chromosomes are involved, and what kind of variation each produces—is one of the more commonly confused pairs of terms in MCAT genetics, and a frequent source of trap answer choices.",
      quickCheck: {
        prompt: "Crossing over occurs between:",
        options: ["Sister chromatids of the same chromosome", "Homologous chromosomes from each parent", "Unrelated chromosomes", "Mitochondrial DNA strands"],
        correctIndex: 1,
        explanation: "Crossing over exchanges segments between homologous chromosomes, one inherited from each parent. Exchange between identical sister chromatids wouldn't create new variation, and crossing over doesn't involve unrelated chromosomes or mitochondrial DNA."
      },
      keyTakeaway: "Meiosis is like shuffling a deck: one cell becomes four genetically different haploid cells, with that variation coming from crossing over and independent assortment during meiosis I."
    }
  ]
};
