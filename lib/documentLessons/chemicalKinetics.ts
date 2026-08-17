// Document-lesson content for "Chemical Kinetics"
// (lib/mcatPath.ts's chemical-kinetics LessonContent entry).
// See lib/documentLesson.ts for the shared shape.
import { DocumentLessonContent } from "../documentLesson";

export const chemicalKineticsContent: DocumentLessonContent = {
  lessonIntro: {
    description: "Kinetics answers a different question than equilibrium does: not where a reaction ends up, but how fast it gets there. This lesson covers rate laws and reaction order, how a multistep mechanism's slowest step controls the overall rate, and the factors—especially temperature and catalysts—that speed reactions up.",
    objectives: [
      "Write and interpret rate laws, including reaction order determined from experimental data",
      "Explain how a reaction mechanism's rate-determining step sets the overall rate law",
      "Distinguish reaction intermediates from catalysts",
      "Explain how the Arrhenius equation and catalysts relate to activation energy"
    ]
  },
  bigPicture: {
    flow: ["Reactants collide with sufficient energy (activation energy)", "Transition state forms", "Rate-determining (slowest) step sets overall rate", "Products form"],
    caption: "A reaction's overall speed is only ever as fast as its slowest step—kinetics is largely about identifying that bottleneck and what makes it faster or slower."
  },
  concepts: [
    {
      number: "01",
      id: "rate-laws",
      title: "Reaction Rates and Rate Laws",
      difficulty: "UNDERSTAND",
      coreIdea: "A rate law (rate = k[A]^m[B]^n) expresses how reaction rate depends on reactant concentrations, with the exponents (reaction orders) determined experimentally, not from the balanced equation's coefficients.",
      learn: [
        "The rate law's exponents (m, n) are the reaction orders with respect to each reactant, and must be determined from experimental data (typically by comparing how rate changes when one concentration is changed while others are held constant)—they are not automatically equal to the stoichiometric coefficients in the balanced equation.",
        "The rate constant k is specific to a given reaction at a given temperature; overall reaction order is the sum of the individual orders (m + n), and it determines how sensitive the rate is to concentration changes—for example, doubling the concentration of a reactant with order 2 quadruples the rate contribution from that reactant."
      ],
      mcatConnection: "The exam loves testing that rate law exponents must come from data, not from the equation's coefficients—if you're given a table of experimental rates at different concentrations, that's your cue to determine order by comparing trials, not by reading the balanced equation.",
      quickCheck: {
        prompt: "For the reaction 2A + B → C, experiments show that doubling [A] alone doubles the rate, and doubling [B] alone quadruples the rate. What is the rate law?",
        options: ["rate = k[A]^2[B]", "rate = k[A][B]^2", "rate = k[A][B]", "rate = k[A]^2[B]^2"],
        correctIndex: 1,
        explanation: "Doubling [A] doubles the rate, so the reaction is first order in A (exponent 1); doubling [B] quadruples the rate (2^2 = 4), so the reaction is second order in B (exponent 2)—giving rate = k[A][B]^2, notably not matching the balanced equation's coefficients of 2 and 1."
      },
      keyTakeaway: "Rate laws (rate = k[A]^m[B]^n) describe how rate depends on concentration, with reaction orders (m, n) determined experimentally rather than read off the balanced equation's coefficients."
    },
    {
      number: "02",
      id: "reaction-mechanisms",
      title: "Reaction Mechanisms and the Rate-Determining Step",
      difficulty: "REASON",
      coreIdea: "A reaction mechanism is a series of elementary steps that sum to the overall reaction; the slowest step (rate-determining step) controls the overall rate law.",
      learn: [
        "Complex reactions often proceed through multiple elementary steps rather than in one collision; intermediates are species produced in one step and consumed in a later step (they appear in the mechanism but not in the overall balanced equation).",
        "The rate-determining step (RDS) is the slowest elementary step in the mechanism, and it bottlenecks the overall reaction rate—the overall rate law can be written directly from the RDS's molecularity (its reactants and their coefficients in that specific step), which is why the overall rate law often doesn't match the overall balanced equation's coefficients."
      ],
      mcatConnection: "When a passage gives you a proposed mechanism and asks for the rate law, go straight to the rate-determining step and write its rate law using that step's own reactants and coefficients—the other steps (and the overall balanced equation) are mostly irrelevant to that specific question.",
      quickCheck: {
        prompt: "A proposed two-step mechanism has Step 1 (slow): A + B → C, and Step 2 (fast): C + A → D. What is the rate law implied by this mechanism?",
        options: ["rate = k[C][A], based on step 2", "rate = k[A][B], based on the slow step (step 1)", "rate = k[A]^2[B], based on the overall reaction", "It cannot be determined without more information"],
        correctIndex: 1,
        explanation: "The rate-determining step is the slow step, and its rate law is written directly from its own reactants: Step 1 involves A and B, giving rate = k[A][B]—the fast step (step 2) doesn't limit the overall rate and isn't used to write the rate law."
      },
      keyTakeaway: "A mechanism's rate-determining (slowest) step controls the overall rate law, which is written from that step's own reactants; intermediates appear within the mechanism but cancel out of the overall equation."
    },
    {
      number: "03",
      id: "activation-energy-catalysts",
      title: "Activation Energy and Catalysts",
      difficulty: "IDENTIFY",
      coreIdea: "The Arrhenius equation shows that reaction rate increases with temperature and decreases with higher activation energy (Ea); catalysts speed up reactions by lowering Ea without being consumed.",
      learn: [
        "The Arrhenius equation, k = Ae^(-Ea/RT), shows that the rate constant k increases as temperature increases (more molecules have enough kinetic energy to overcome the activation energy barrier) and decreases as activation energy increases (a higher barrier is harder to overcome).",
        "A catalyst speeds up a reaction by providing an alternative pathway with lower activation energy, without being consumed in the overall reaction (it's regenerated at the end)—this contrasts with an intermediate, which is produced and then consumed as the reaction proceeds through its mechanism, and with a reactant, which is consumed overall."
      ],
      mcatConnection: "Distinguishing a catalyst from an intermediate is a classic trap: both appear in a mechanism without appearing in the overall equation, but a catalyst is present at the start and regenerated at the end, while an intermediate is produced partway through and consumed before the end.",
      quickCheck: {
        prompt: "A substance appears as a reactant in the first step of a mechanism and is regenerated, unchanged, as a product in the final step. What role does it play?",
        options: ["Reactant", "Intermediate", "Catalyst", "Product"],
        correctIndex: 2,
        explanation: "A species present at the start of the mechanism and regenerated unchanged by the end—without a net change in its own amount—is a catalyst, which lowers activation energy without being consumed; an intermediate would instead be produced partway through and consumed before the end, the reverse pattern."
      },
      keyTakeaway: "The Arrhenius equation shows rate increases with temperature and decreases with activation energy; catalysts lower activation energy and are regenerated (not consumed), unlike intermediates, which are produced and then consumed during the mechanism."
    }
  ]
};
