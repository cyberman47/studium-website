// Document-lesson content for "Solutions & Concentrations"
// (lib/mcatPath.ts's solutions-concentrations LessonContent entry).
// See lib/documentLesson.ts for the shared shape.
import { DocumentLessonContent } from "../documentLesson";

export const solutionsConcentrationsContent: DocumentLessonContent = {
  lessonIntro: {
    description: "Almost every reaction the MCAT asks about happens in solution, which makes concentration units and colligative properties recurring building blocks across the exam. This lesson covers how to express concentration, how dissolved particles change a solution's physical properties, and how to work through dilution and titration calculations.",
    objectives: [
      "Calculate and convert between molarity, molality, and mole fraction",
      "Explain colligative properties: boiling point elevation, freezing point depression, and osmotic pressure",
      "Apply the van't Hoff factor for ionic solutes",
      "Solve dilution problems using M1V1 = M2V2"
    ]
  },
  bigPicture: {
    flow: ["Solute dissolves in solvent", "Concentration expressed (molarity, molality, etc.)", "More dissolved particles", "Greater effect on colligative properties"],
    caption: "Colligative properties depend only on how many particles are dissolved, not what they are—which is exactly why the van't Hoff factor (how many particles a solute breaks into) matters so much."
  },
  concepts: [
    {
      number: "01",
      id: "concentration-units",
      title: "Concentration Units",
      difficulty: "UNDERSTAND",
      coreIdea: "Molarity (mol solute / L solution) is the most common concentration unit, but molality (mol solute / kg solvent) and mole fraction (mol solute / total mol) matter when temperature or total composition is relevant.",
      learn: [
        "Molarity (M) = moles of solute / liters of solution is the standard concentration unit for reactions and titrations, but it changes slightly with temperature because solution volume expands or contracts with heat.",
        "Molality (m) = moles of solute / kilograms of solvent is temperature-independent (mass doesn't change with temperature) and is the unit used for colligative property calculations; mole fraction (x) = moles of one component / total moles of all components is used in Raoult's law and vapor pressure problems."
      ],
      mcatConnection: "Picking the right concentration unit for the right formula (molarity for reaction stoichiometry, molality for freezing/boiling point problems) is a common point of confusion—matching the unit to what the question is actually asking for is worth double-checking.",
      quickCheck: {
        prompt: "Why is molality, rather than molarity, used in freezing point depression and boiling point elevation calculations?",
        options: ["Molality is always a larger number than molarity", "Molality is based on mass of solvent, which doesn't change with temperature, unlike solution volume", "Molarity cannot be calculated for aqueous solutions", "Freezing and boiling points don't depend on concentration at all"],
        correctIndex: 1,
        explanation: "Because molality uses mass of solvent (unaffected by temperature) rather than volume of solution (which expands or contracts with temperature), it gives a more accurate, temperature-independent concentration for these temperature-changing calculations."
      },
      keyTakeaway: "Molarity (mol/L solution) is standard for reactions; molality (mol/kg solvent) is temperature-independent and used for colligative properties; mole fraction expresses a component's fraction of total moles."
    },
    {
      number: "02",
      id: "colligative-properties",
      title: "Colligative Properties",
      difficulty: "REASON",
      coreIdea: "Colligative properties—boiling point elevation, freezing point depression, and osmotic pressure—depend only on the number of dissolved particles, not their identity, and scale with the van't Hoff factor for ionic solutes.",
      learn: [
        "Adding solute particles to a solvent raises its boiling point (ΔTb = i·Kb·m) and lowers its freezing point (ΔTf = i·Kf·m), because dissolved particles disrupt the solvent's ability to form the ordered structure needed to freeze or interfere with its escape into vapor to boil.",
        "The van't Hoff factor (i) accounts for solutes that dissociate into multiple particles in solution—NaCl (i = 2) has twice the colligative effect of an equal molal concentration of glucose (i = 1, since it doesn't dissociate)—and osmotic pressure (Π = iMRT) follows the same particle-counting logic."
      ],
      mcatConnection: "Osmotic pressure and van't Hoff factor questions appear constantly in physiology passages (tonicity, osmosis across membranes)—recognizing that an ionic solute's colligative effect is multiplied by how many ions it dissociates into is essential, not optional, math.",
      quickCheck: {
        prompt: "Equal molal solutions of glucose (a nonelectrolyte) and CaCl2 (which dissociates into 3 ions) are compared. Which has the greater freezing point depression, and why?",
        options: ["Glucose, because smaller molecules have a bigger effect", "CaCl2, because its van't Hoff factor of 3 gives it three times the effective particle concentration", "They are equal, since freezing point depression only depends on molal concentration of the compound added, not its dissociation", "Neither depresses freezing point; only boiling point is affected by solutes"],
        correctIndex: 1,
        explanation: "CaCl2 dissociates into Ca2+ and 2 Cl- (i = 3), tripling the effective particle concentration compared to glucose (i = 1) at the same molality—freezing point depression depends on total dissolved particles, which is exactly what the van't Hoff factor accounts for."
      },
      keyTakeaway: "Colligative properties (boiling point elevation, freezing point depression, osmotic pressure) depend on the total number of dissolved particles, scaled by the van't Hoff factor for solutes that dissociate."
    },
    {
      number: "03",
      id: "dilutions-solution-stoichiometry",
      title: "Dilutions and Solution Stoichiometry",
      difficulty: "IDENTIFY",
      coreIdea: "Dilution doesn't change the moles of solute, only the volume—M1V1 = M2V2 lets you solve for any one variable given the other three.",
      learn: [
        "Diluting a solution adds solvent without adding more solute, so the moles of solute before and after dilution are equal: M1V1 = M2V2, where M is molarity and V is volume, in matching units.",
        "This same mole-conservation logic extends to titrations, where the moles of titrant added at the equivalence point equal the moles of analyte originally present (adjusted for stoichiometric ratio), letting you solve for an unknown concentration or volume."
      ],
      mcatConnection: "M1V1 = M2V2 is a rearrangement of the same mole-conservation idea used everywhere in solution chemistry—recognize it as 'moles don't change, only volume/concentration do' rather than a separate formula to memorize.",
      quickCheck: {
        prompt: "50 mL of a 4 M NaOH solution is diluted to a final volume of 200 mL. What is the new concentration?",
        options: ["0.5 M", "1 M", "2 M", "4 M"],
        correctIndex: 1,
        explanation: "Using M1V1 = M2V2: (4 M)(50 mL) = M2(200 mL), so M2 = 200/200 = 1 M—the moles of NaOH (0.2 mol) stay constant; only the concentration drops because the volume quadrupled."
      },
      keyTakeaway: "Dilution conserves moles of solute while changing volume and concentration, summarized by M1V1 = M2V2; the same mole-conservation logic underlies titration calculations."
    }
  ]
};
