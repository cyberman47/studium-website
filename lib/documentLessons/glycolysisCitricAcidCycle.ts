// Document-lesson content for "Glycolysis & Citric Acid Cycle"
// (lib/mcatPath.ts's glycolysis-citric-acid-cycle LessonContent entry)—
// restructured from that same real entry. See lib/documentLesson.ts for the
// shared shape.
import { DocumentLessonContent } from "../documentLesson";

export const glycolysisCitricAcidCycleContent: DocumentLessonContent = {
  lessonIntro: {
    description: "Breaking down glucose for energy happens in stages, each in a different cellular location with a different job. This lesson covers glycolysis in the cytoplasm, the bridge step that feeds pyruvate into the mitochondria, and the citric acid cycle that strips the remaining carbons while loading up electron carriers.",
    objectives: [
      "State glycolysis's location, oxygen requirement, and net ATP/NADH yield",
      "Explain the pyruvate dehydrogenase (link) reaction",
      "State the citric acid cycle's location and per-turn yield",
      "Explain why NADH and FADH2 are the cycle's most valuable products"
    ]
  },
  bigPicture: {
    flow: ["Glucose (cytoplasm)", "2 Pyruvate", "2 Acetyl-CoA (mitochondria)", "Citric acid cycle (×2)"],
    caption: "One glucose molecule takes this exact path: split in the cytoplasm, trimmed and shipped into the mitochondria, then fed through the citric acid cycle twice—once for each acetyl-CoA it produced."
  },
  concepts: [
    {
      number: "01",
      id: "glycolysis-overview",
      title: "Glycolysis Overview",
      difficulty: "UNDERSTAND",
      coreIdea: "Glycolysis is a ten-step, anaerobic, cytoplasmic pathway that splits glucose into two pyruvate, netting 2 ATP and 2 NADH.",
      learn: [
        "Glycolysis is a ten-step pathway, occurring in the cytoplasm, that breaks down one glucose molecule (6 carbons) into two pyruvate molecules (3 carbons each). It requires no oxygen (anaerobic) and has a net yield, per glucose, of 2 ATP (produced by substrate-level phosphorylation, after an initial investment of 2 ATP is repaid) and 2 NADH.",
        "Because it doesn't require oxygen, glycolysis can continue even under anaerobic conditions, making it the one energy-yielding step available to every cell type, including red blood cells, which lack mitochondria entirely."
      ],
      mcatConnection: "Red blood cells relying entirely on glycolysis (since they have no mitochondria) is a favorite specific fact pattern connecting this pathway to physiology—worth remembering as a concrete example of why glycolysis matters independently of aerobic respiration.",
      quickCheck: {
        prompt: "What is the net ATP yield of glycolysis alone, per glucose molecule?",
        options: ["0 ATP", "2 ATP", "4 ATP", "36 ATP"],
        correctIndex: 1,
        explanation: "Glycolysis invests 2 ATP and produces 4, for a net yield of 2 ATP per glucose—36 ATP is closer to the theoretical total across all of aerobic respiration, not glycolysis alone."
      },
      keyTakeaway: "Glycolysis (cytoplasm, no oxygen needed) splits glucose into two pyruvate, netting 2 ATP and 2 NADH—the only energy-yielding pathway available to cells without mitochondria."
    },
    {
      number: "02",
      id: "pyruvate-to-acetyl-coa",
      title: "Pyruvate to Acetyl-CoA",
      difficulty: "IDENTIFY",
      coreIdea: "The pyruvate dehydrogenase complex converts pyruvate to acetyl-CoA in the mitochondrial matrix, releasing CO2 and producing NADH—an irreversible link reaction.",
      learn: [
        "Before entering the citric acid cycle, each pyruvate molecule is transported into the mitochondrial matrix and converted to acetyl-CoA by the pyruvate dehydrogenase complex—a link (bridge) reaction that releases one CO2 and produces one NADH per pyruvate (so two of each per original glucose, since glycolysis yields two pyruvate).",
        "This step is irreversible in animals, which is why animals cannot convert fat back into glucose."
      ],
      mcatConnection: "The irreversibility of the pyruvate dehydrogenase reaction is the biochemical reason fat can't be converted back to glucose in humans—a detail that connects directly to metabolism-regulation and fasting-physiology passages.",
      quickCheck: {
        prompt: "What happens to pyruvate before it can enter the citric acid cycle?",
        options: ["It is directly used without modification", "It is converted to acetyl-CoA by the pyruvate dehydrogenase complex, releasing CO2", "It is converted directly to glucose", "It is exported from the cell"],
        correctIndex: 1,
        explanation: "The pyruvate dehydrogenase complex converts pyruvate to acetyl-CoA, releasing CO2 and producing NADH, in the mitochondrial matrix—this conversion is irreversible in animals, so pyruvate isn't converted back to glucose this way."
      },
      keyTakeaway: "Pyruvate dehydrogenase converts pyruvate to acetyl-CoA in the mitochondrial matrix, releasing CO2 and producing NADH—an irreversible step in animals."
    },
    {
      number: "03",
      id: "citric-acid-cycle",
      title: "Citric Acid Cycle",
      difficulty: "REASON",
      coreIdea: "The citric acid cycle turns twice per glucose in the mitochondrial matrix, together yielding 6 NADH, 2 FADH2, 2 GTP/ATP, and 4 CO2—mainly valuable for its electron carriers.",
      learn: [
        "The citric acid cycle (Krebs cycle), occurring in the mitochondrial matrix, is the central hub of aerobic metabolism: acetyl-CoA combines with a four-carbon molecule to eventually regenerate that same starting molecule, releasing two CO2 per turn.",
        "Per turn of the cycle (and since each glucose yields two acetyl-CoA, the cycle turns twice per glucose), the products are 3 NADH, 1 FADH2, and 1 GTP or ATP (via substrate-level phosphorylation)—the NADH and FADH2 are the cycle's most valuable output, since they carry electrons to the electron transport chain, where the majority of ATP is ultimately generated."
      ],
      flowDiagram: ["Acetyl-CoA enters", "2 CO2 released", "3 NADH + 1 FADH2 produced", "1 GTP/ATP produced"],
      mcatConnection: "Know the citric acid cycle's per-turn yield (3 NADH, 1 FADH2, 1 GTP/ATP, 2 CO2) cold—the exam frequently asks you to double it (since it turns twice per glucose) or use it to calculate downstream ATP yield.",
      quickCheck: {
        prompt: "Per turn of the citric acid cycle, which combination of products is generated?",
        options: ["1 NADH, 1 FADH2, 3 GTP", "3 NADH, 1 FADH2, 1 GTP, 2 CO2", "2 NADH, 2 FADH2, 2 CO2", "3 NADH, 3 FADH2, 1 GTP"],
        correctIndex: 1,
        explanation: "Each turn of the citric acid cycle yields 3 NADH, 1 FADH2, 1 GTP (or ATP), and 2 CO2—the other options understate NADH, overstate FADH2 or GTP, or otherwise misstate the real per-turn yield."
      },
      keyTakeaway: "The citric acid cycle (mitochondrial matrix, twice per glucose) yields mostly electron carriers—NADH and FADH2—which matter more than its small direct GTP/ATP output, since they power the electron transport chain next."
    }
  ]
};
