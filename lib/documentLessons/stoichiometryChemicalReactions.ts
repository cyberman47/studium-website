// Document-lesson content for "Stoichiometry & Chemical Reactions"
// (lib/mcatPath.ts's stoichiometry-chemical-reactions LessonContent entry).
// See lib/documentLesson.ts for the shared shape.
import { DocumentLessonContent } from "../documentLesson";

export const stoichiometryChemicalReactionsContent: DocumentLessonContent = {
  lessonIntro: {
    description: "Stoichiometry is the accounting system of chemistry: it converts between moles, mass, and particles, and lets a balanced equation tell you exactly how much product a reaction can make. This lesson covers the mole concept, balancing equations and identifying the limiting reactant, and the major reaction types you'll need to recognize on sight.",
    objectives: [
      "Convert between mass, moles, and number of particles using molar mass and Avogadro's number",
      "Balance chemical equations and use mole ratios from balanced coefficients",
      "Identify the limiting reactant and calculate theoretical and percent yield",
      "Classify reactions as synthesis, decomposition, single displacement, double displacement, or combustion"
    ]
  },
  bigPicture: {
    flow: ["Balanced equation gives mole ratios", "Convert given amounts to moles", "Identify limiting reactant", "Calculate theoretical yield", "Compare to actual yield for percent yield"],
    caption: "Every stoichiometry problem is the same chain of conversions—the only real skill is getting everything into moles before doing any ratio math."
  },
  concepts: [
    {
      number: "01",
      id: "mole-concept",
      title: "The Mole and Molar Mass",
      difficulty: "UNDERSTAND",
      coreIdea: "The mole is a counting unit (6.022 × 10^23 particles, Avogadro's number); molar mass converts between grams and moles for any substance.",
      learn: [
        "A mole is simply a very large counting number, defined so that one mole of a substance's molar mass in grams contains exactly Avogadro's number (6.022 × 10^23) of particles—atoms, molecules, or ions, depending on the substance.",
        "Molar mass (g/mol), found by summing atomic masses from the periodic table, is the conversion factor between the mass of a sample and the number of moles it contains—every stoichiometry calculation starts by converting given quantities into moles."
      ],
      mcatConnection: "Nearly every quantitative chemistry passage requires converting mass or concentration into moles as the first step—being fast and error-free with mole conversions saves time for the actual reasoning the question is testing.",
      quickCheck: {
        prompt: "A sample contains 2 moles of water (H2O, molar mass 18 g/mol). What is the mass of the sample?",
        options: ["9 g", "18 g", "36 g", "6.022 × 10^23 g"],
        correctIndex: 2,
        explanation: "Mass = moles × molar mass = 2 mol × 18 g/mol = 36 g—18 g would be for 1 mole, and 6.022 × 10^23 confuses the particle count (Avogadro's number) with mass."
      },
      keyTakeaway: "The mole is a counting unit tied to Avogadro's number; molar mass converts between a substance's mass in grams and its amount in moles."
    },
    {
      number: "02",
      id: "limiting-reactant-yield",
      title: "Limiting Reactant and Yield",
      difficulty: "REASON",
      coreIdea: "The limiting reactant is used up first and determines the maximum (theoretical) amount of product; percent yield compares actual product obtained to that theoretical maximum.",
      learn: [
        "A balanced equation's coefficients give the mole ratio in which reactants combine; when reactants aren't supplied in exactly that ratio, one runs out first (the limiting reactant) and stops the reaction, while the other is left over (in excess).",
        "Theoretical yield is the maximum product possible, calculated from the limiting reactant using the balanced equation's mole ratios; percent yield = (actual yield / theoretical yield) × 100% reflects real-world losses like incomplete reactions or side products."
      ],
      mcatConnection: "Limiting reactant problems test whether you can convert every given quantity to moles and compare ratios correctly—setting up both reactants' calculations side by side and taking whichever gives less product is the reliable method.",
      quickCheck: {
        prompt: "In the reaction N2 + 3H2 → 2NH3, 1 mole of N2 is mixed with 2 moles of H2. Which reactant is limiting?",
        options: ["N2, because it has a coefficient of 1", "H2, because 1 mole of N2 requires 3 moles of H2 but only 2 are available", "Neither—they are both fully consumed", "It cannot be determined without molar masses"],
        correctIndex: 1,
        explanation: "The balanced equation requires 3 moles of H2 for every mole of N2; with only 2 moles of H2 available, H2 runs out first and limits the reaction—the coefficient alone doesn't determine which reactant is limiting, the actual mole ratio supplied does."
      },
      keyTakeaway: "The limiting reactant runs out first and caps theoretical yield; percent yield compares the actual amount of product recovered to that theoretical maximum."
    },
    {
      number: "03",
      id: "reaction-types",
      title: "Classifying Reaction Types",
      difficulty: "IDENTIFY",
      coreIdea: "Reactions fall into recognizable patterns—synthesis, decomposition, single displacement, double displacement, and combustion—identifiable from the arrangement of reactants and products alone.",
      learn: [
        "Synthesis (A + B → AB) combines two substances into one; decomposition (AB → A + B) is the reverse, breaking one substance into two or more; single displacement (A + BC → AC + B) swaps one element into a compound, displacing another.",
        "Double displacement (AB + CD → AD + CB) swaps ions between two compounds, often producing a precipitate, gas, or water; combustion reactions involve a hydrocarbon reacting with O2 to produce CO2 and H2O, releasing energy."
      ],
      mcatConnection: "Recognizing the reaction type quickly helps you predict products before doing any calculation—especially useful for double displacement reactions that produce a precipitate (a common setup for solubility and equilibrium passages).",
      quickCheck: {
        prompt: "AgNO3(aq) + NaCl(aq) → AgCl(s) + NaNO3(aq). What type of reaction is this?",
        options: ["Synthesis", "Decomposition", "Single displacement", "Double displacement"],
        correctIndex: 3,
        explanation: "The silver and sodium ions swap partners between the two compounds (Ag with Cl, Na with NO3), which is the defining pattern of a double displacement reaction—no single element is displacing another, and nothing is combining into or breaking from one substance."
      },
      keyTakeaway: "Reaction type can be identified from the pattern of reactants and products: synthesis combines, decomposition breaks apart, single displacement swaps one element, double displacement swaps ions between two compounds, and combustion produces CO2 and H2O."
    }
  ]
};
