// Document-lesson content for "Chemical Equilibrium"
// (lib/mcatPath.ts's chemical-equilibrium LessonContent entry).
// See lib/documentLesson.ts for the shared shape.
import { DocumentLessonContent } from "../documentLesson";

export const chemicalEquilibriumContent: DocumentLessonContent = {
  lessonIntro: {
    description: "Most real reactions don't go to completion—they settle into a dynamic balance where forward and reverse reactions proceed at equal rates. This lesson covers the equilibrium constant and reaction quotient, how Le Chatelier's principle predicts a system's response to disturbance, and how ICE tables organize the algebra of equilibrium calculations.",
    objectives: [
      "Write equilibrium constant expressions (Kc, Kp) from a balanced equation",
      "Compare the reaction quotient (Q) to K to predict reaction direction",
      "Apply Le Chatelier's principle to predict the effect of concentration, pressure/volume, and temperature changes",
      "Set up and solve ICE tables for equilibrium concentrations"
    ]
  },
  bigPicture: {
    flow: ["Reaction reaches equilibrium (forward rate = reverse rate)", "System is disturbed (concentration, pressure, or temperature change)", "Le Chatelier's principle predicts the shift", "System reaches a new equilibrium"],
    caption: "Equilibrium isn't static—it's forward and reverse reactions happening at equal rates, which is exactly why disturbing one side makes the whole system shift to find a new balance."
  },
  concepts: [
    {
      number: "01",
      id: "equilibrium-constant",
      title: "The Equilibrium Constant and Reaction Quotient",
      difficulty: "UNDERSTAND",
      coreIdea: "The equilibrium constant K (from the law of mass action) describes the ratio of products to reactants at equilibrium; comparing the reaction quotient Q to K predicts which direction a reaction will shift.",
      learn: [
        "For a reaction aA + bB ⇌ cC + dD, the equilibrium constant K = [C]^c[D]^d / [A]^a[B]^b (using concentrations for Kc, partial pressures for Kp), with pure solids and liquids omitted since their 'concentration' doesn't change.",
        "The reaction quotient Q has the same expression as K but uses concentrations at any point in time, not just at equilibrium; comparing Q to K tells you which way the reaction will shift to reach equilibrium—if Q < K, the reaction proceeds forward; if Q > K, it proceeds in reverse; if Q = K, the system is already at equilibrium."
      ],
      mcatConnection: "Q vs. K comparisons appear constantly, often disguised as 'will this reaction proceed forward or backward from these starting concentrations'—the shortcut is simply calculating Q and comparing it directly to the given K.",
      quickCheck: {
        prompt: "For a reaction with K = 10, a reaction mixture currently has Q = 2. Which direction will the reaction proceed to reach equilibrium?",
        options: ["Forward, toward more products, since Q < K", "Reverse, toward more reactants, since Q < K", "The reaction is already at equilibrium", "It cannot be determined without concentrations"],
        correctIndex: 0,
        explanation: "Since Q (2) is less than K (10), the ratio of products to reactants needs to increase to reach equilibrium, meaning the reaction proceeds forward, consuming reactants and forming more products until Q rises to equal K."
      },
      keyTakeaway: "K (from the law of mass action) describes the product/reactant ratio at equilibrium; comparing the reaction quotient Q to K predicts whether a reaction will shift forward (Q < K) or reverse (Q > K) to reach equilibrium."
    },
    {
      number: "02",
      id: "le-chateliers-principle",
      title: "Le Chatelier's Principle",
      difficulty: "REASON",
      coreIdea: "When a system at equilibrium is disturbed (by changing concentration, pressure/volume, or temperature), it shifts in the direction that relieves the disturbance and reestablishes equilibrium.",
      learn: [
        "Adding a reactant (or removing a product) shifts equilibrium forward, and vice versa; decreasing volume (increasing pressure) shifts equilibrium toward the side with fewer moles of gas, since that reduces the total number of gas particles and partially relieves the pressure increase.",
        "Temperature changes are unique because they actually change the value of K itself, not just shift the position of equilibrium: treating heat as a reactant (endothermic) or product (exothermic) predicts the shift—increasing temperature shifts an endothermic reaction forward (K increases) and shifts an exothermic reaction in reverse (K decreases)."
      ],
      mcatConnection: "The pressure/volume rule (shift toward fewer moles of gas) is frequently tested with reactions that have equal moles of gas on both sides—recognize that such a reaction is unaffected by a volume change, which is itself a common answer choice.",
      quickCheck: {
        prompt: "For the exothermic reaction N2(g) + 3H2(g) ⇌ 2NH3(g), what happens to the equilibrium position if the temperature is increased?",
        options: ["Equilibrium shifts forward, favoring more NH3", "Equilibrium shifts in reverse, favoring N2 and H2", "No shift occurs; temperature doesn't affect equilibrium", "The reaction stops entirely"],
        correctIndex: 1,
        explanation: "Since the reaction is exothermic, heat can be treated as a product—adding heat (increasing temperature) shifts equilibrium away from the side with excess heat, i.e., in reverse, favoring the reactants N2 and H2; temperature is one of the few disturbances that actually changes the value of K, not just the position of equilibrium."
      },
      keyTakeaway: "Le Chatelier's principle predicts a system's response to disturbance: it shifts to relieve concentration changes, shifts toward fewer gas moles under increased pressure, and (uniquely) has its K value itself changed by temperature shifts."
    },
    {
      number: "03",
      id: "ice-tables",
      title: "ICE Tables and Equilibrium Calculations",
      difficulty: "IDENTIFY",
      coreIdea: "An ICE table (Initial, Change, Equilibrium) organizes concentration changes as a reaction proceeds toward equilibrium, letting you solve for equilibrium concentrations algebraically.",
      learn: [
        "An ICE table lists each species' Initial concentration, the Change it undergoes (using the balanced equation's stoichiometric coefficients, with x as the unknown extent of reaction), and the resulting Equilibrium concentration (Initial ± Change).",
        "Substituting the Equilibrium row into the K expression gives an algebraic equation solvable for x; when K is very small, the approximation that x is negligible compared to the initial concentration often simplifies the algebra considerably (a common MCAT shortcut, valid when K is much smaller than the initial concentrations)."
      ],
      mcatConnection: "The exam rarely expects you to solve a full quadratic by hand—recognizing when the 'x is small' approximation applies (very small K relative to initial concentration) is the tested skill, not brute-force algebra.",
      quickCheck: {
        prompt: "In an ICE table for the reaction A ⇌ B + C, starting with only 1.0 M of A and no B or C, what does the 'Change' row show for each species (in terms of x)?",
        options: ["A: +x, B: -x, C: -x", "A: -x, B: +x, C: +x", "A: -2x, B: +x, C: +x", "All species change by the same fixed amount, unrelated to x"],
        correctIndex: 1,
        explanation: "As the reaction proceeds forward (since only A is present initially), A is consumed (-x) while B and C are produced (+x each), matching their 1:1:1 stoichiometric coefficients in the balanced equation."
      },
      keyTakeaway: "ICE tables track Initial, Change (using stoichiometric coefficients and unknown x), and Equilibrium concentrations, which can then be substituted into the K expression to solve for unknown equilibrium concentrations."
    }
  ]
};
