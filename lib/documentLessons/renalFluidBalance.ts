// Document-lesson content for "Renal & Fluid Balance" (lib/mcatPath.ts's
// renal-fluid-balance LessonContent entry)—restructured from that same real
// entry. See lib/documentLesson.ts for the shared shape.
import { DocumentLessonContent } from "../documentLesson";

export const renalFluidBalanceContent: DocumentLessonContent = {
  lessonIntro: {
    description: "The kidney's real trick is a two-step system: filter everything small out first, then selectively reclaim what the body still needs. This lesson covers glomerular filtration, how the nephron reabsorbs and secretes along its length, and the two hormones that fine-tune fluid balance.",
    objectives: [
      "Explain why glomerular filtration is nonselective by size",
      "Describe the roles of the proximal tubule, loop of Henle, and distal tubule/collecting duct",
      "Explain what triggers ADH release and its effect",
      "Explain what triggers aldosterone release and its effect"
    ]
  },
  bigPicture: {
    flow: ["Glomerulus (filter)", "Proximal tubule (reabsorb)", "Loop of Henle (concentrate)", "Collecting duct (fine-tune)"],
    caption: "The nephron works in two opposite phases: dump everything small out first (filtration), then spend the rest of its length carefully taking back only what the body actually needs."
  },
  concepts: [
    {
      number: "01",
      id: "nephron-filtration",
      title: "Nephron Structure and Filtration",
      difficulty: "UNDERSTAND",
      coreIdea: "Filtration at the glomerulus is nonselective by size, so needed substances like glucose and amino acids are filtered out along with waste.",
      learn: [
        "The nephron is the kidney's functional unit. Blood enters the glomerulus, a ball of capillaries, under pressure that forces water and small solutes (but not blood cells or large proteins) out into the surrounding Bowman's capsule—this is filtration, producing filtrate that then flows into the renal tubule.",
        "Filtration is nonselective for size (anything small enough passes through), meaning it removes needed substances (glucose, amino acids, ions) along with waste, all of which must be selectively reclaimed afterward."
      ],
      mcatConnection: "The nonselective-by-size nature of filtration is the key insight that makes reabsorption necessary at all—understanding this causal link (filter everything small, then reclaim selectively) is more valuable than memorizing the steps separately.",
      quickCheck: {
        prompt: "Why does the filtrate at the glomerulus contain glucose, even though the body needs to conserve glucose?",
        options: ["Filtration selectively removes only waste products", "Filtration is nonselective by size, so small molecules like glucose pass through regardless of usefulness", "Glucose is actively secreted at the glomerulus", "The glomerulus only filters large proteins"],
        correctIndex: 1,
        explanation: "Filtration is nonselective by size, so small useful molecules like glucose are filtered along with waste and must be reabsorbed afterward—large proteins are specifically excluded, not selectively filtered."
      },
      keyTakeaway: "Glomerular filtration lets anything small enough through regardless of usefulness—this is exactly why the rest of the nephron must actively reabsorb needed substances."
    },
    {
      number: "02",
      id: "reabsorption-secretion",
      title: "Reabsorption and Secretion",
      difficulty: "IDENTIFY",
      coreIdea: "The proximal tubule reabsorbs most needed substances; the loop of Henle's countercurrent multiplier enables urine concentration; the distal tubule/collecting duct fine-tune the output.",
      learn: [
        "As filtrate moves through the renal tubule, the proximal tubule reabsorbs most needed substances (glucose, amino acids, most water and ions) back into the blood. The loop of Henle uses a countercurrent multiplier mechanism to establish a concentration gradient in the surrounding tissue, which is essential for concentrating urine.",
        "The descending limb is permeable to water (which leaves, concentrating the filtrate), while the ascending limb is permeable to ions but not water. The distal tubule and collecting duct fine-tune the final composition through further reabsorption and secretion."
      ],
      mcatConnection: "The loop of Henle's descending-permeable-to-water/ascending-permeable-to-ions split is a specific, testable detail—expect a question that gives you one limb's property and asks what it implies about the filtrate's concentration at that point.",
      quickCheck: {
        prompt: "What is the primary role of the loop of Henle's countercurrent multiplier mechanism?",
        options: ["Filtering blood cells out of the filtrate", "Establishing a concentration gradient that enables the kidney to concentrate urine", "Secreting hormones directly into the blood", "Reabsorbing all remaining water immediately"],
        correctIndex: 1,
        explanation: "The countercurrent multiplier builds a concentration gradient in the surrounding tissue, essential for concentrating urine—filtering blood cells happens at the glomerulus, and the loop doesn't secrete hormones."
      },
      keyTakeaway: "The proximal tubule reclaims most needed substances; the loop of Henle builds the concentration gradient that makes concentrated urine possible; the distal tubule/collecting duct handle final fine-tuning."
    },
    {
      number: "03",
      id: "hormonal-fluid-regulation",
      title: "Hormonal Regulation of Fluid Balance",
      difficulty: "REASON",
      coreIdea: "ADH increases water reabsorption in response to high osmolarity/low volume; aldosterone (via RAAS) increases sodium and water reabsorption in response to low blood pressure/volume.",
      learn: [
        "Antidiuretic hormone (ADH), released by the posterior pituitary in response to high blood osmolarity (concentration) or low blood volume, increases water reabsorption at the collecting duct, concentrating urine and diluting the blood back toward normal.",
        "Aldosterone, released by the adrenal cortex as part of the renin-angiotensin-aldosterone system (RAAS) in response to low blood pressure or blood volume, increases sodium (and secondarily water) reabsorption at the distal tubule, raising blood volume and pressure."
      ],
      mcatConnection: "ADH and aldosterone both raise blood volume but respond to different specific triggers and act at different exact locations (collecting duct vs. distal tubule)—expect a scenario question that requires distinguishing which hormone dominates a described situation.",
      quickCheck: {
        prompt: "A patient with low blood volume shows elevated ADH and aldosterone levels. What is the combined expected effect?",
        options: ["Increased urine output to eliminate excess fluid", "Increased water and sodium reabsorption, raising blood volume", "No change in blood volume", "Decreased blood pressure"],
        correctIndex: 1,
        explanation: "ADH increases water reabsorption and aldosterone increases sodium (and water) reabsorption, together raising blood volume back toward normal—the body's response to low blood volume is to conserve, not eliminate, fluid."
      },
      keyTakeaway: "ADH (triggered by high osmolarity/low volume) and aldosterone (triggered by low blood pressure/volume via RAAS) both work to raise blood volume, but through different triggers and nephron sites."
    }
  ]
};
