// Document-lesson content for "Acids, Bases & Buffers"
// (lib/mcatPath.ts's acids-bases-buffers LessonContent entry).
// See lib/documentLesson.ts for the shared shape.
import { DocumentLessonContent } from "../documentLesson";

export const acidsBasesBuffersContent: DocumentLessonContent = {
  lessonIntro: {
    description: "Acid-base chemistry governs everything from blood pH to enzyme activity, making it one of the most heavily tested topics on the MCAT. This lesson covers the major acid-base theories, how pH and Ka/Kb relate through the Henderson-Hasselbalch equation, and how buffers resist pH changes.",
    objectives: [
      "Apply the Arrhenius, Brønsted-Lowry, and Lewis definitions of acids and bases",
      "Identify conjugate acid-base pairs and distinguish strong from weak acids/bases",
      "Calculate pH and relate it to pKa using the Henderson-Hasselbalch equation",
      "Explain how a buffer resists pH change and interpret a titration curve"
    ]
  },
  bigPicture: {
    flow: ["Acid donates H+ (or base accepts it)", "Conjugate acid-base pair forms", "Equilibrium set by Ka/Kb", "pH determined via Henderson-Hasselbalch"],
    caption: "Every acid-base reaction is a proton handoff—once you can identify who's donating and who's accepting, pH, pKa, and buffers are all just consequences of where that equilibrium sits."
  },
  concepts: [
    {
      number: "01",
      id: "acid-base-theories",
      title: "Acid-Base Theories",
      difficulty: "UNDERSTAND",
      coreIdea: "The Brønsted-Lowry definition (acids donate H+, bases accept H+) is the most broadly useful on the MCAT; every Brønsted-Lowry acid-base reaction forms a conjugate acid-base pair.",
      learn: [
        "The Arrhenius definition (acids produce H+ in water, bases produce OH-) is the most limited; the Brønsted-Lowry definition (acids donate a proton, bases accept a proton) is more general and applies even without water; the Lewis definition (acids accept an electron pair, bases donate one) is the broadest, covering reactions with no protons involved at all.",
        "In a Brønsted-Lowry reaction, the acid becomes its conjugate base after losing H+, and the base becomes its conjugate acid after gaining H+—strong acids/bases dissociate essentially completely in water, while weak acids/bases establish an equilibrium, only partially dissociating."
      ],
      mcatConnection: "The Lewis definition is the one most likely to trip you up, since it applies to reactions with no protons at all (like a metal ion accepting an electron pair from a ligand)—recognizing electron-pair acceptance/donation as acid-base chemistry, not just proton transfer, is a real conceptual leap the exam tests.",
      quickCheck: {
        prompt: "In the reaction NH3 + H2O ⇌ NH4+ + OH-, which species is the conjugate acid of NH3?",
        options: ["H2O", "OH-", "NH4+", "NH3 has no conjugate acid in this reaction"],
        correctIndex: 2,
        explanation: "NH3 acts as a Brønsted-Lowry base, accepting a proton (H+) to become NH4+, which is by definition its conjugate acid—OH- is the conjugate base of H2O (the acid in this reaction), not related to NH3."
      },
      keyTakeaway: "Brønsted-Lowry acids donate H+ and bases accept H+, forming conjugate acid-base pairs; strong acids/bases dissociate completely, while weak ones establish a partial equilibrium."
    },
    {
      number: "02",
      id: "ph-pka-henderson-hasselbalch",
      title: "pH, pKa, and the Henderson-Hasselbalch Equation",
      difficulty: "REASON",
      coreIdea: "pH = -log[H+] measures acidity; pKa = -log(Ka) measures a weak acid's strength; the Henderson-Hasselbalch equation (pH = pKa + log([A-]/[HA])) relates the two for a buffer or partially dissociated weak acid.",
      learn: [
        "A lower pKa means a stronger acid (dissociates more, higher Ka); pH and pKa use the same logarithmic relationship as concentration and equilibrium constants, so a change of one pH unit represents a tenfold change in [H+].",
        "The Henderson-Hasselbalch equation, pH = pKa + log([A-]/[HA]), directly connects a solution's pH to the ratio of a weak acid's conjugate base to its undissociated acid form—when [A-] = [HA] (equal amounts), the log term is zero and pH = pKa exactly."
      ],
      mcatConnection: "Henderson-Hasselbalch is one of the highest-yield equations on the exam, especially combined with titration curves—recognizing that pH = pKa at the half-equivalence point of a weak acid titration is a shortcut worth having memorized cold.",
      quickCheck: {
        prompt: "A weak acid has a pKa of 4.75. In a solution where the concentration of its conjugate base equals the concentration of the undissociated acid, what is the solution's pH?",
        options: ["0", "4.75", "7.00", "9.50"],
        correctIndex: 1,
        explanation: "When [A-] = [HA], the ratio in the Henderson-Hasselbalch equation is 1, and log(1) = 0, so pH = pKa + 0 = pKa = 4.75."
      },
      keyTakeaway: "pH = -log[H+] and pKa = -log(Ka) use the same logarithmic scale; the Henderson-Hasselbalch equation connects them, and when a weak acid and its conjugate base are equally concentrated, pH equals pKa."
    },
    {
      number: "03",
      id: "buffers-titration-curves",
      title: "Buffers and Titration Curves",
      difficulty: "IDENTIFY",
      coreIdea: "A buffer (a weak acid and its conjugate base, or weak base and its conjugate acid) resists pH change by neutralizing small amounts of added acid or base; titration curves show pH changing as titrant is added, with the equivalence point marking complete neutralization.",
      learn: [
        "A buffer resists pH change because it contains both a weak acid (which can neutralize added base) and its conjugate base (which can neutralize added acid)—buffer capacity is greatest, and pH changes least per amount of acid/base added, when the buffer is near its pKa (roughly equal amounts of the acid and conjugate base forms).",
        "On a titration curve, the equivalence point is where moles of titrant added exactly neutralize the moles of analyte originally present (a steep, sharp rise/fall in pH); the half-equivalence point (halfway to the equivalence point in a weak acid/base titration) is where pH = pKa, since exactly half the original acid has been converted to its conjugate base."
      ],
      mcatConnection: "Titration curve questions usually ask you to locate a specific point (equivalence point, half-equivalence point, or buffer region) and state what's true there—memorize that pH = pKa at half-equivalence and that the curve is flattest (best buffering) in that same region.",
      quickCheck: {
        prompt: "On a titration curve for a weak acid being titrated with a strong base, why does the curve appear relatively flat in the region surrounding the half-equivalence point?",
        options: ["The reaction has stopped in that region", "This is the buffer region, where roughly equal amounts of the weak acid and its conjugate base resist pH change", "No titrant is being added during this region", "The solution is at its equivalence point throughout this entire flat region"],
        correctIndex: 1,
        explanation: "Near the half-equivalence point, the solution contains substantial amounts of both the weak acid and its conjugate base, forming an effective buffer that resists pH change as more titrant is added—the reaction continues throughout, and the equivalence point is a single, distinct point (marked by a steep rise), not this flat region."
      },
      keyTakeaway: "A buffer (weak acid + conjugate base) resists pH change, most effectively near its pKa; on a titration curve, pH = pKa at the half-equivalence point, and the equivalence point marks complete neutralization of the original analyte."
    }
  ]
};
