// Document-lesson content for "Thermochemistry & Thermodynamics"
// (lib/mcatPath.ts's thermochemistry-thermodynamics LessonContent entry).
// See lib/documentLesson.ts for the shared shape.
import { DocumentLessonContent } from "../documentLesson";

export const thermochemistryThermodynamicsContent: DocumentLessonContent = {
  lessonIntro: {
    description: "Thermochemistry tracks energy as it flows into and out of chemical reactions, and thermodynamics asks the bigger question of whether a reaction happens at all. This lesson covers enthalpy and Hess's law, how entropy and Gibbs free energy together determine spontaneity, and how calorimetry lets you measure heat experimentally.",
    objectives: [
      "Use Hess's law to calculate enthalpy changes for multistep reactions",
      "Distinguish entropy (ΔS) from enthalpy (ΔH) and calculate Gibbs free energy (ΔG)",
      "Predict reaction spontaneity from the signs of ΔH, ΔS, and temperature",
      "Apply calorimetry (q = mcΔT) to calculate heat transfer"
    ]
  },
  bigPicture: {
    flow: ["Enthalpy (ΔH) and entropy (ΔS) of a reaction", "Combined via ΔG = ΔH - TΔS", "Sign of ΔG", "Reaction is spontaneous (ΔG < 0) or not (ΔG > 0)"],
    caption: "Whether a reaction happens on its own isn't just about releasing energy—it's a tug-of-war between enthalpy and entropy, weighted by temperature, and Gibbs free energy is the single number that settles it."
  },
  concepts: [
    {
      number: "01",
      id: "enthalpy-hess-law",
      title: "Enthalpy and Hess's Law",
      difficulty: "UNDERSTAND",
      coreIdea: "Enthalpy (ΔH) is heat exchanged at constant pressure; Hess's law says that ΔH for an overall reaction equals the sum of ΔH for any set of steps that add up to it, since enthalpy is a state function.",
      learn: [
        "Enthalpy change (ΔH) is negative for exothermic reactions (release heat to surroundings) and positive for endothermic reactions (absorb heat from surroundings); because enthalpy is a state function, ΔH depends only on initial and final states, not on the path taken.",
        "Hess's law exploits that state-function property: if a reaction can be written as the sum of two or more steps (possibly reversed or scaled), its overall ΔH is simply the sum of each step's ΔH (reversing a step flips the sign of its ΔH; scaling a step by a coefficient scales its ΔH by the same amount)."
      ],
      mcatConnection: "Hess's law problems are really just algebra with reactions—add, reverse, and scale given equations until they sum to the target equation, applying the same operations to their ΔH values, and the answer falls out.",
      quickCheck: {
        prompt: "Reaction 1 (A → B) has ΔH = +40 kJ. Reaction 2 (B → C) has ΔH = -60 kJ. What is ΔH for the overall reaction A → C?",
        options: ["+100 kJ", "+20 kJ", "-20 kJ", "-100 kJ"],
        correctIndex: 2,
        explanation: "By Hess's law, adding the two steps (A → B and B → C) gives the overall reaction A → C, so their ΔH values simply add: +40 kJ + (-60 kJ) = -20 kJ."
      },
      keyTakeaway: "Enthalpy (ΔH) is a state function measuring heat at constant pressure; Hess's law lets you sum the ΔH of individual steps (reversing or scaling as needed) to find the ΔH of an overall reaction."
    },
    {
      number: "02",
      id: "entropy-gibbs-free-energy",
      title: "Entropy and Gibbs Free Energy",
      difficulty: "REASON",
      coreIdea: "Entropy (ΔS) measures disorder/dispersal of energy; Gibbs free energy (ΔG = ΔH - TΔS) combines enthalpy and entropy to determine whether a reaction is spontaneous.",
      learn: [
        "Entropy increases (ΔS > 0) when a system becomes more disordered—gas forming from liquid/solid, more moles of gas being produced, or a solid dissolving into solution are all common entropy-increasing changes.",
        "A reaction is spontaneous when ΔG < 0; since ΔG = ΔH - TΔS, a reaction that is exothermic (ΔH < 0) and increases entropy (ΔS > 0) is always spontaneous, one that is endothermic and decreases entropy is never spontaneous, and the other two combinations depend on temperature."
      ],
      mcatConnection: "Spontaneity questions are testing whether you can reason through the four ΔH/ΔS sign combinations rather than plug numbers—know which combinations are temperature-dependent (spontaneous only at high or only at low T) versus always/never spontaneous.",
      quickCheck: {
        prompt: "A reaction has ΔH > 0 (endothermic) and ΔS > 0 (entropy increases). Under what condition is this reaction spontaneous?",
        options: ["It is always spontaneous, regardless of temperature", "It is never spontaneous, regardless of temperature", "It is spontaneous only at high temperature", "It is spontaneous only at low temperature"],
        correctIndex: 2,
        explanation: "With ΔG = ΔH - TΔS, a positive ΔH works against spontaneity while a positive ΔS (multiplied by T) works for it—at high enough temperature, the -TΔS term becomes large and negative enough to outweigh the positive ΔH, making ΔG negative and the reaction spontaneous."
      },
      keyTakeaway: "Gibbs free energy (ΔG = ΔH - TΔS) determines spontaneity: ΔG < 0 is spontaneous. Exothermic + entropy-increasing reactions are always spontaneous; endothermic + entropy-decreasing reactions never are; the other two combinations depend on temperature."
    },
    {
      number: "03",
      id: "calorimetry",
      title: "Calorimetry",
      difficulty: "IDENTIFY",
      coreIdea: "Calorimetry measures heat transfer using q = mcΔT, where m is mass, c is specific heat capacity, and ΔT is the temperature change.",
      learn: [
        "The equation q = mcΔT calculates heat absorbed or released by a substance, where c (specific heat capacity) is the amount of heat needed to raise 1 gram of the substance by 1°C—a larger specific heat means a substance resists temperature change more.",
        "In a calorimeter, heat lost by one substance (e.g., a hot metal) equals heat gained by another (e.g., surrounding water), assuming no heat escapes to the environment—this conservation lets you solve for an unknown specific heat, mass, or final temperature."
      ],
      mcatConnection: "Calorimetry problems reduce to setting q(lost) = -q(gained) and solving algebraically—watch the sign convention carefully, since heat lost by the hot object is negative from its own perspective but represents the same magnitude of heat gained by the cooler substance.",
      quickCheck: {
        prompt: "A 50 g sample of metal at 100°C is placed into 100 g of water at 20°C, and they reach a common final temperature. Which principle is used to solve for that final temperature?",
        options: ["The metal and water each independently reach thermal equilibrium with the room", "Heat lost by the metal equals heat gained by the water (conservation of energy)", "The metal and water must end up at the same temperature they started at", "Specific heat capacity is irrelevant to this calculation"],
        correctIndex: 1,
        explanation: "Assuming no heat escapes the system, energy conservation requires that all heat lost by the cooling metal is gained by the warming water—q(metal) = -q(water)—which, combined with q = mcΔT for each substance, lets you solve for the shared final temperature; specific heat capacity is essential to this calculation, not irrelevant."
      },
      keyTakeaway: "Calorimetry uses q = mcΔT to calculate heat transfer, and conservation of energy (heat lost by one substance equals heat gained by another) lets you solve for an unknown temperature, mass, or specific heat."
    }
  ]
};
