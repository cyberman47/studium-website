// Document-lesson content for "Enzymes & Enzyme Kinetics" (lib/mcatPath.ts's
// enzymes-enzyme-kinetics LessonContent entry)—restructured from that same
// real entry. See lib/documentLesson.ts for the shared shape.
import { DocumentLessonContent } from "../documentLesson";

export const enzymesEnzymeKineticsContent: DocumentLessonContent = {
  lessonIntro: {
    description: "Enzymes make life's chemistry fast enough to matter. This lesson covers how an enzyme's active site actually catalyzes a reaction, how Km and Vmax describe an enzyme's behavior, and how competitive and noncompetitive inhibitors change that behavior in different, testable ways.",
    objectives: [
      "Explain how enzymes lower activation energy without changing reaction thermodynamics",
      "Define Km and Vmax and what each tells you",
      "Distinguish competitive from noncompetitive inhibition by their effect on Km and Vmax",
      "Explain feedback inhibition as a form of allosteric regulation"
    ]
  },
  bigPicture: {
    flow: ["Substrate binds active site", "Induced fit", "Transition state stabilized", "Product released"],
    caption: "An enzyme doesn't change whether a reaction happens—it changes how fast, by stabilizing the high-energy transition state and lowering the activation energy needed to get there."
  },
  concepts: [
    {
      number: "01",
      id: "enzyme-active-site",
      title: "Enzyme Function and the Active Site",
      difficulty: "UNDERSTAND",
      coreIdea: "Enzymes lower activation energy via a substrate-specific active site that changes shape slightly to improve the fit (induced fit).",
      learn: [
        "Enzymes are biological catalysts—almost always proteins—that speed up reactions by lowering the activation energy required, without being consumed or altering the reaction's overall thermodynamics.",
        "A substrate binds the enzyme's active site, a specifically shaped pocket. The induced fit model describes the active site subtly changing shape as the substrate binds, improving the fit, rather than the older, more rigid lock-and-key model."
      ],
      mcatConnection: "A common trap is thinking enzymes change a reaction's ΔG or equilibrium—they don't. Enzymes only speed up how fast equilibrium is reached, by lowering activation energy; the reaction's overall favorability is unchanged.",
      quickCheck: {
        prompt: "What effect does an enzyme have on a reaction's activation energy and overall thermodynamics?",
        options: ["It lowers activation energy and changes the overall ΔG", "It lowers activation energy without changing the overall ΔG", "It raises activation energy to slow the reaction", "It has no effect on either"],
        correctIndex: 1,
        explanation: "Enzymes lower the activation energy required for a reaction, speeding it up, but they don't change the reaction's overall thermodynamics (ΔG) or equilibrium."
      },
      keyTakeaway: "Enzymes speed up reactions by lowering activation energy via a substrate-specific active site that uses induced fit—the reaction's own thermodynamics stay unchanged."
    },
    {
      number: "02",
      id: "enzyme-kinetics",
      title: "Enzyme Kinetics",
      difficulty: "IDENTIFY",
      coreIdea: "Vmax is the maximum reaction rate at substrate saturation; Km is the substrate concentration at half-maximal rate, reflecting substrate affinity.",
      learn: [
        "Michaelis-Menten kinetics describes how reaction rate (V) depends on substrate concentration [S]. Vmax is the maximum reaction rate, reached when the enzyme is saturated with substrate.",
        "Km (the Michaelis constant) is the substrate concentration at which the reaction rate is half of Vmax, and it reflects the enzyme's affinity for its substrate—a low Km means high affinity (the enzyme reaches half-maximal rate at a low substrate concentration), while a high Km means low affinity."
      ],
      mcatConnection: "Km and affinity are inversely related—a fact worth internalizing so well you don't have to re-derive it under time pressure: low Km = high affinity, high Km = low affinity.",
      quickCheck: {
        prompt: "An enzyme has a very low Km for its substrate. What does this indicate?",
        options: ["The enzyme has low affinity for the substrate", "The enzyme has high affinity for the substrate", "The enzyme is inactive", "The reaction has no activation energy"],
        correctIndex: 1,
        explanation: "A low Km means half-maximal rate is reached at low substrate concentration, indicating high affinity—Km alone doesn't indicate inactivity, and all enzyme-catalyzed reactions still have some (lowered) activation energy."
      },
      keyTakeaway: "Vmax is the rate ceiling at substrate saturation; Km is the substrate concentration at half-maximal rate, and it's inversely related to substrate affinity."
    },
    {
      number: "03",
      id: "enzyme-inhibition",
      title: "Enzyme Inhibition",
      difficulty: "REASON",
      coreIdea: "Competitive inhibitors raise Km but not Vmax (overcome by more substrate); noncompetitive inhibitors lower Vmax but not Km (not overcome by more substrate).",
      learn: [
        "Competitive inhibitors resemble the substrate and bind the active site directly, competing with substrate for the same spot—their effect can be overcome by adding more substrate, so Vmax stays the same but Km increases (more substrate is needed to reach half-maximal rate).",
        "Noncompetitive inhibitors bind a separate allosteric site, changing the enzyme's shape and reducing its activity regardless of substrate concentration—Vmax decreases, but Km stays the same, since substrate binding itself isn't blocked. Feedback inhibition is a related allosteric mechanism where a pathway's own end product inhibits an earlier enzyme in that pathway."
      ],
      mcatConnection: "This Km/Vmax effect table is one of the highest-yield memorization pairs in biochemistry: competitive → Km up, Vmax same; noncompetitive → Km same, Vmax down. Passages often give you a kinetics graph and expect you to read the inhibitor type off it.",
      quickCheck: {
        prompt: "Adding a competitive inhibitor to an enzyme reaction changes the kinetics in which way?",
        options: ["Vmax decreases, Km stays the same", "Vmax stays the same, Km increases", "Both Vmax and Km decrease", "Neither Vmax nor Km changes"],
        correctIndex: 1,
        explanation: "Competitive inhibitors can be outcompeted by enough substrate, so Vmax is unchanged, but more substrate is needed to reach half-maximal rate, so Km increases—the reverse pattern describes noncompetitive inhibition."
      },
      keyTakeaway: "Competitive inhibitors compete for the active site (Km↑, Vmax same, overcome by substrate); noncompetitive inhibitors bind elsewhere (Vmax↓, Km same, not overcome by substrate)."
    }
  ]
};
