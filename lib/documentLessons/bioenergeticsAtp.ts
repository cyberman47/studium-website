// Document-lesson content for "Bioenergetics & ATP" (lib/mcatPath.ts's
// bioenergetics-atp LessonContent entry)—restructured from that same real
// entry. See lib/documentLesson.ts for the shared shape.
import { DocumentLessonContent } from "../documentLesson";

export const bioenergeticsAtpContent: DocumentLessonContent = {
  lessonIntro: {
    description: "Every metabolic reaction in the body obeys the same thermodynamic rules. This lesson covers exergonic vs. endergonic reactions and how cells couple them, why breaking a bond in ATP releases usable energy, and the oxidation-reduction reactions that shuttle that energy around the cell.",
    objectives: [
      "Distinguish exergonic from endergonic reactions",
      "Explain how coupling drives an unfavorable reaction forward",
      "Explain why ATP hydrolysis releases energy",
      "Define oxidation and reduction and explain why they always occur together"
    ]
  },
  bigPicture: {
    flow: ["Exergonic reaction (releases energy)", "Coupled via ATP", "Endergonic reaction (needs energy)", "Proceeds"],
    caption: "Cells don't fight thermodynamics—they use it. An unfavorable reaction becomes possible by pairing it with a favorable one, so the combined process has a net energy release."
  },
  concepts: [
    {
      number: "01",
      id: "thermodynamics-metabolism",
      title: "Thermodynamics of Metabolism",
      difficulty: "UNDERSTAND",
      coreIdea: "Exergonic reactions release energy (ΔG < 0) and proceed spontaneously; endergonic reactions require energy input (ΔG > 0)—cells couple the two.",
      learn: [
        "Every metabolic reaction is either exergonic (releases energy, negative Gibbs free energy change, ΔG < 0) or endergonic (requires energy input, ΔG > 0).",
        "Cells drive unfavorable, endergonic reactions forward by coupling them to a favorable, exergonic reaction—most often ATP hydrolysis—so the combined, coupled reaction has a net negative ΔG and proceeds spontaneously."
      ],
      mcatConnection: "Coupling is the mechanism behind nearly every energy-requiring process in the body—active transport, biosynthesis, muscle contraction—so recognizing 'this reaction needs ATP' as a coupling problem, not a special exception, saves time across many passage types.",
      quickCheck: {
        prompt: "A cell couples ATP hydrolysis to an otherwise unfavorable reaction. Why does this allow the overall process to proceed?",
        options: ["ATP hydrolysis has no effect on the overall ΔG", "The combined reaction has a net negative ΔG", "ATP hydrolysis requires energy, adding to the unfavorable reaction", "Coupling only works for reactions that are already favorable"],
        correctIndex: 1,
        explanation: "Combining a very exergonic reaction (ATP hydrolysis) with an endergonic one can produce a net negative ΔG, making the overall process spontaneous—ATP hydrolysis is itself exergonic, not endergonic, and coupling is specifically useful for unfavorable reactions."
      },
      keyTakeaway: "Exergonic reactions release energy and proceed on their own; endergonic reactions need energy input, which cells supply by coupling them to a favorable reaction like ATP hydrolysis."
    },
    {
      number: "02",
      id: "atp-structure-energy",
      title: "ATP Structure and Energy Release",
      difficulty: "IDENTIFY",
      coreIdea: "ATP hydrolysis breaks a high-energy phosphoanhydride bond, forming the more stable ADP + Pi and releasing usable energy.",
      learn: [
        "ATP consists of an adenine base, a ribose sugar, and three phosphate groups linked by two high-energy phosphoanhydride bonds.",
        "Hydrolyzing the terminal phosphate bond (ATP → ADP + Pi) releases a substantial amount of energy, largely because the products (ADP and free phosphate) are more stable than ATP itself—that released energy is what powers the cell's endergonic processes, from muscle contraction to active transport."
      ],
      mcatConnection: "The exam sometimes tests why ATP hydrolysis is favorable in terms of product stability, not just 'high-energy bonds breaking'—being able to explain it via relative product stability shows a deeper, more testable understanding.",
      quickCheck: {
        prompt: "Which best explains why ATP hydrolysis releases a substantial amount of energy?",
        options: ["ADP and Pi are less stable than ATP", "The products (ADP and Pi) are more stable than ATP, and breaking the phosphoanhydride bond releases energy", "ATP contains a peptide bond that is broken", "Water is consumed without any bonds breaking"],
        correctIndex: 1,
        explanation: "Breaking the high-energy phosphoanhydride bond and forming the more stable ADP + Pi releases usable energy—it's the reverse: the products are more stable, not less, and the bond broken is a phosphoanhydride bond, not a peptide bond."
      },
      keyTakeaway: "ATP hydrolysis (ATP → ADP + Pi) breaks a high-energy phosphoanhydride bond and forms more stable products, releasing energy that powers the cell's endergonic reactions."
    },
    {
      number: "03",
      id: "energy-coupling-redox",
      title: "Energy Coupling and Oxidation-Reduction",
      difficulty: "REASON",
      coreIdea: "Oxidation (losing electrons) and reduction (gaining electrons) always occur together; NAD+/FAD shuttle electrons from glucose breakdown to the electron transport chain.",
      learn: [
        "Cellular energy metabolism relies heavily on oxidation-reduction (redox) reactions: oxidation is the loss of electrons, and reduction is the gain of electrons—always paired together, since electrons removed from one molecule must go somewhere.",
        "Electron carriers like NAD+ and FAD get reduced (to NADH and FADH2) by accepting electrons during glucose breakdown, then later get oxidized as they donate those electrons to the electron transport chain, ultimately powering ATP synthesis."
      ],
      mcatConnection: "\"OIL RIG\" (Oxidation Is Loss, Reduction Is Gain, of electrons) is worth having completely automatic—redox questions appear across biochemistry, cell biology, and general chemistry passages alike.",
      quickCheck: {
        prompt: "In the reaction NAD+ + 2e- + H+ → NADH, what is happening to NAD+?",
        options: ["NAD+ is being oxidized", "NAD+ is being reduced", "NAD+ is acting as a catalyst with no chemical change", "NAD+ is losing a phosphate group"],
        correctIndex: 1,
        explanation: "NAD+ gains electrons (and a hydrogen) to become NADH, which is reduction—oxidation is loss of electrons, and NAD+ does undergo a real chemical change here, not act as an unchanged catalyst."
      },
      keyTakeaway: "Oxidation and reduction always occur together as one electron transfer—NAD+/FAD are reduced while collecting electrons from glucose breakdown, then oxidized while delivering them to the electron transport chain."
    }
  ]
};
