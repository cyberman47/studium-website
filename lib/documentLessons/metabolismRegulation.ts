// Document-lesson content for "Metabolism & Metabolic Regulation"
// (lib/mcatPath.ts's metabolism-regulation LessonContent entry)—
// restructured from that same real entry. See lib/documentLesson.ts for the
// shared shape.
import { DocumentLessonContent } from "../documentLesson";

export const metabolismRegulationContent: DocumentLessonContent = {
  lessonIntro: {
    description: "Metabolism isn't one fixed set of reactions running constantly—it shifts based on whether the body just ate or is fasting, and pathways are tightly regulated so opposing processes don't run at the same time. This lesson covers hormonal control of blood glucose, the key regulatory enzyme of glycolysis, and how fat breakdown and synthesis are kept from competing.",
    objectives: [
      "Explain insulin's and glucagon's opposing roles in blood glucose regulation",
      "Explain what gluconeogenesis is and when the body relies on it",
      "Explain how PFK-1 is regulated and why",
      "Explain why beta-oxidation and fatty acid synthesis are reciprocally regulated"
    ]
  },
  bigPicture: {
    flow: ["Blood glucose rises", "Insulin", "Uptake + glycogen synthesis", "Blood glucose falls → glucagon"],
    caption: "Blood glucose regulation is a feedback loop with two opposing hormones—insulin pulls glucose down into storage, glucagon pulls it back out, keeping levels in a narrow working range."
  },
  concepts: [
    {
      number: "01",
      id: "fed-fasted-regulation",
      title: "Fed vs. Fasted State Regulation",
      difficulty: "UNDERSTAND",
      coreIdea: "Insulin (fed state) promotes glucose uptake and storage; glucagon (fasted state) promotes glycogen breakdown and, eventually, gluconeogenesis.",
      learn: [
        "After a meal (fed state), rising blood glucose triggers insulin release from the pancreas, which promotes glucose uptake into cells and glycogen synthesis in the liver and muscle for storage.",
        "During fasting, falling blood glucose triggers glucagon release, which promotes glycogen breakdown (glycogenolysis) and, if fasting continues, gluconeogenesis—the synthesis of new glucose from non-carbohydrate sources like amino acids and glycerol—to keep blood glucose from dropping too low."
      ],
      mcatConnection: "Insulin/glucagon as an opposing hormone pair is a foundational fact for endocrine and metabolism passages alike—know which state (fed/fasted) triggers which hormone and its specific downstream effect, not just that they're 'opposites.'",
      quickCheck: {
        prompt: "After a carbohydrate-rich meal, which hormone is released, and what is its main effect?",
        options: ["Glucagon; promotes glycogen breakdown", "Insulin; promotes glucose uptake and glycogen synthesis", "Glucagon; promotes gluconeogenesis", "Insulin; promotes fatty acid breakdown only"],
        correctIndex: 1,
        explanation: "Rising blood glucose after a meal triggers insulin release, promoting glucose uptake and glycogen storage—glucagon and gluconeogenesis are associated with fasting, not the fed state."
      },
      keyTakeaway: "Insulin (fed state) drives glucose into storage; glucagon (fasted state) drives it back out, first from glycogen and later via gluconeogenesis."
    },
    {
      number: "02",
      id: "glycolysis-gluconeogenesis-regulation",
      title: "Regulation of Glycolysis and Gluconeogenesis",
      difficulty: "IDENTIFY",
      coreIdea: "PFK-1, glycolysis's rate-limiting enzyme, is inhibited by high ATP/citrate and activated by high AMP, matching glycolytic rate to the cell's actual energy need.",
      learn: [
        "Glycolysis and gluconeogenesis are reciprocally regulated so they don't run simultaneously and waste energy in a futile cycle.",
        "Phosphofructokinase-1 (PFK-1) is the key rate-limiting enzyme of glycolysis: it's allosterically inhibited by high ATP and citrate (signs the cell has enough energy already) and activated by high AMP (a sign of low energy), so glycolysis speeds up exactly when the cell needs energy and slows down when it doesn't."
      ],
      mcatConnection: "PFK-1's regulation is a favorite worked example of allosteric feedback control in general—ATP/citrate as inhibitors, AMP as an activator is worth memorizing as a self-contained fact pattern independent of the rest of glycolysis.",
      quickCheck: {
        prompt: "High levels of ATP and citrate in a cell have what effect on PFK-1 activity, and why?",
        options: ["They activate PFK-1, since the cell needs more energy", "They inhibit PFK-1, since high ATP/citrate signal the cell already has enough energy", "They have no effect on PFK-1", "They activate gluconeogenesis instead, with no effect on glycolysis"],
        correctIndex: 1,
        explanation: "High ATP and citrate are allosteric inhibitors of PFK-1, slowing glycolysis when the cell doesn't need more energy—ATP and citrate are established, direct allosteric regulators of PFK-1, not neutral bystanders."
      },
      keyTakeaway: "PFK-1 is glycolysis's rate-limiting enzyme, inhibited by high-energy signals (ATP, citrate) and activated by low-energy signals (AMP)."
    },
    {
      number: "03",
      id: "fatty-acid-oxidation-synthesis",
      title: "Fatty Acid Oxidation vs. Synthesis",
      difficulty: "REASON",
      coreIdea: "Beta-oxidation breaks fatty acids down for energy when needed; fatty acid synthesis builds them up for storage when energy is abundant—reciprocally regulated to avoid running both at once.",
      learn: [
        "When energy is needed and glucose is scarce, cells break down fatty acids through beta-oxidation, repeatedly removing two-carbon units as acetyl-CoA, which then feeds into the citric acid cycle, along with generating NADH and FADH2 directly.",
        "When energy is abundant, the reverse process—fatty acid synthesis—builds fatty acids from acetyl-CoA for long-term storage. The two processes are regulated reciprocally (largely through the molecule malonyl-CoA) so a cell isn't simultaneously building and breaking down fat."
      ],
      mcatConnection: "Reciprocal regulation (avoiding a futile cycle) is a recurring theme across metabolism—glycolysis/gluconeogenesis and beta-oxidation/fatty acid synthesis are the two classic paired examples, and recognizing the pattern helps on novel pathway questions too.",
      quickCheck: {
        prompt: "Why are beta-oxidation and fatty acid synthesis reciprocally regulated?",
        options: ["To allow both to occur at maximum rate simultaneously", "To prevent a futile cycle of simultaneously building and breaking down fat", "Because both processes occur in different organisms", "Because fatty acids cannot be synthesized in humans"],
        correctIndex: 1,
        explanation: "Reciprocal regulation (largely via malonyl-CoA) prevents the cell from simultaneously synthesizing and breaking down fatty acids, which would waste energy—both processes occur within the same human cells, and humans can and do synthesize fatty acids."
      },
      keyTakeaway: "Beta-oxidation (breakdown for energy) and fatty acid synthesis (buildup for storage) are reciprocally regulated so a cell never runs both at once, wasting energy in a futile cycle."
    }
  ]
};
