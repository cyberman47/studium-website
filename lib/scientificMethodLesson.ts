// Content/config for the Scientific Method lesson prototype ONLY (see
// app/dashboard/learning-paths/mcat/[section]/[subject]/[lesson]/page.tsx's
// scientific-method branch, and components/scientific-method/*). Every fact
// here is drawn from the real lesson entry in lib/mcatPath.ts (same
// sections, key terms, and the real ice-cream/drowning + fertilizer/
// blood-pressure examples already used in that lesson's own practice
// questions)—restructured into a document-style Core Idea → Learn →
// Visualize → MCAT Connection → Apply → Key Takeaway progression instead of
// one continuous article.
//
// This file is intentionally NOT imported by anything outside the
// Scientific Method branch, so it can't affect any other lesson.

export type Difficulty = "UNDERSTAND" | "IDENTIFY" | "INTERPRET" | "REASON";

export type QuickCheck = {
  prompt: string;
  scenario?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

// Concept 03 alone splits its dataset (shown plainly under "Analyze") from
// the interpretation question (asked under "Apply"—reuses QuickCheck like
// every other concept), rather than bundling both into one widget.
export type DataTable = { caption: string; rows: { label: string; value: string }[] };

export const lessonIntro = {
  description: "Before you can analyze an MCAT experiment, you need a mental model for how real research actually works—and how to read it critically. This lesson builds that model from the ground up: what a hypothesis is, how a good experiment is built, how to read real data, and the single distinction the exam tests more than almost any other.",
  objectives: [
    "Explain the scientific method as a cycle, not a checklist",
    "Identify independent, dependent, and confounding variables in an experiment",
    "Interpret a small dataset without overreaching its conclusion",
    "Tell correlation apart from causation, and explain why it matters"
  ]
};

export const bigPicture = {
  flow: ["Question", "Hypothesis", "Prediction", "Experiment", "Data", "Conclusion", "Refine"] as const,
  caption: "Every stage feeds the next, and \"Refine\" loops back to a sharper hypothesis rather than a dead end—real research revisits earlier stages constantly instead of moving through them once."
};

export type Concept = {
  number: string;
  id: string;
  title: string;
  difficulty: Difficulty;
  coreIdea: string;
  learn: string[];
  variableFlow?: boolean;
  correlationExample?: { relationship: string; confound: string };
  dataTable?: DataTable;
  mcatConnection: string;
  quickCheck: QuickCheck;
  keyTakeaway: string;
};

export const concepts: Concept[] = [
  {
    number: "01",
    id: "what-is-scientific-method",
    title: "What Is the Scientific Method?",
    difficulty: "UNDERSTAND",
    coreIdea: "The scientific method is a cyclical, iterative process for investigating the world—not a checklist you complete once and set aside.",
    learn: [
      "Real research rarely moves in a straight line. A result that doesn't match the prediction sends the researcher back to refine the hypothesis and test again, often several times before a conclusion holds up.",
      "The two terms students most often mix up are the hypothesis and the prediction. The hypothesis is the general, testable claim about how two things are related. The prediction is the specific, measurable outcome that claim implies—the thing an experiment can actually check."
    ],
    mcatConnection: "You're more likely to meet the scientific method inside an experiment or research passage than as a standalone definition question—the exam expects you to recognize a hypothesis, prediction, or conclusion embedded in a paragraph of methodology, not just recite what they mean.",
    quickCheck: {
      scenario: "A researcher believes that increased exercise reduces blood pressure.",
      prompt: "What is the hypothesis?",
      options: ["Blood pressure decreases", "Exercise reduces blood pressure", "Blood pressure is measured", "Participants exercise"],
      correctIndex: 1,
      explanation: "\"Exercise reduces blood pressure\" is the general, testable claim about the relationship between two variables—that's the hypothesis. \"Blood pressure decreases\" is closer to the prediction for one group; the others just describe parts of the setup."
    },
    keyTakeaway: "The scientific method is a loop: a hypothesis makes a prediction, an experiment tests it, and the result either supports the hypothesis or sends you back to refine it."
  },
  {
    number: "02",
    id: "designing-a-good-experiment",
    title: "Designing a Good Experiment",
    difficulty: "IDENTIFY",
    coreIdea: "A well-designed experiment isolates one independent variable while holding everything else constant, so any change in the outcome can be attributed to it alone.",
    learn: [
      "The independent variable is whatever the researcher deliberately manipulates. The dependent variable is what's measured in response—the outcome. Everything else that could plausibly affect the outcome should be held constant; these are the constants of the experiment.",
      "The experimental group receives the treatment being tested; the control group does not, and exists purely to provide a baseline. Without a real control group, you can't tell whether the outcome would have happened anyway.",
      "A confounding variable is an uncontrolled factor that sneaks past the experimental design and can make a result look like it found a relationship that isn't really there—or hide one that is."
    ],
    variableFlow: true,
    mcatConnection: "Experimental-design questions on the MCAT are usually framed as \"what's the flaw in this study?\"—almost always a missing control group or an unaccounted-for confounding variable, buried in an otherwise plausible-sounding setup.",
    quickCheck: {
      scenario: "A researcher wants to test whether a new fertilizer increases plant height.",
      prompt: "Which is the independent variable?",
      options: ["Plant height", "Type of fertilizer used", "Sunlight exposure", "Soil pH"],
      correctIndex: 1,
      explanation: "The fertilizer is what the researcher deliberately manipulates—that makes it the independent variable. Plant height is the dependent variable (what's measured); sunlight and soil pH should be held constant, not tested."
    },
    keyTakeaway: "Isolate one independent variable, hold the rest constant, and always compare against a real control group—that's what lets a result be attributed to the thing you actually changed."
  },
  {
    number: "03",
    id: "reading-scientific-data",
    title: "Reading Scientific Data",
    difficulty: "INTERPRET",
    coreIdea: "MCAT science-reasoning questions test whether you can interpret data correctly, not just recall facts about how experiments work.",
    learn: [
      "Reading data well means comparing groups against each other, not just reading numbers in isolation—looking for a real trend, and asking whether the sample size is large enough for that trend to be meaningful rather than noise.",
      "The most common trap is drawing a bigger conclusion than the data actually supports. A result can be real and still not prove what an answer choice claims it proves."
    ],
    dataTable: {
      caption: "Two groups were tracked for eight weeks. Group A exercised 30 minutes daily; Group B did not change their routine.",
      rows: [
        { label: "Group A — average systolic BP, week 0", value: "138 mmHg" },
        { label: "Group A — average systolic BP, week 8", value: "124 mmHg" },
        { label: "Group B — average systolic BP, week 0", value: "137 mmHg" },
        { label: "Group B — average systolic BP, week 8", value: "136 mmHg" }
      ]
    },
    mcatConnection: "MCAT passages routinely hand you unfamiliar experimental data and ask you to interpret it on the spot—not recall a fact you memorized. The skill being tested is restraint: picking the conclusion the data actually supports, not the most dramatic-sounding one.",
    quickCheck: {
      prompt: "Based on the data above, what conclusion can you draw?",
      options: [
        "Exercise cured Group A's hypertension",
        "Group A's blood pressure dropped more than Group B's over the same period, consistent with the hypothesis",
        "Group B's routine caused no change in anyone's blood pressure",
        "The results prove exercise reduces blood pressure in all adults"
      ],
      correctIndex: 1,
      explanation: "The data shows a real, measured difference between the two groups over the same 8-week window—exactly what the hypothesis predicted, and as far as this data lets you go. \"Cured,\" \"in all adults,\" and generalizing to \"anyone\" all claim more certainty than one 8-week study in two groups can support."
    },
    keyTakeaway: "Read data by comparing groups and checking sample size—then pick the conclusion the numbers actually support, not the strongest-sounding one."
  },
  {
    number: "04",
    id: "correlation-vs-causation",
    title: "Correlation vs. Causation",
    difficulty: "REASON",
    coreIdea: "Two variables changing together doesn't mean one causes the other—this is the single most-tested distinction in MCAT science reasoning.",
    learn: [
      "A correlation is a statistical relationship where two variables tend to change together. Causation is a relationship where a change in one variable directly produces a change in the other. Only a properly controlled experiment—not an observed correlation—can support a causal claim.",
      "When two things move together, the honest first question isn't \"what caused what\"—it's \"what third factor could explain both.\""
    ],
    correlationExample: {
      relationship: "Ice cream sales and drowning incidents both rise in summer.",
      confound: "Warm weather independently increases both ice cream purchases and swimming (and therefore drowning risk)—it's the real driver behind both, not ice cream causing drowning."
    },
    mcatConnection: "The MCAT often presents a real correlation in a passage and asks whether a causal conclusion is justified. The correct answer is almost always \"no, not without a controlled experiment\"—identifying the plausible confounding variable is what separates the right answer from the trap.",
    quickCheck: {
      scenario: "A study finds that ice cream sales and drowning incidents both rise in summer.",
      prompt: "What best explains this correlation?",
      options: ["Ice cream causes drowning", "Drowning causes ice cream sales", "A confounding variable (warm weather) increases both", "The correlation proves causation"],
      correctIndex: 2,
      explanation: "Warm weather is the confounding variable driving both trends—there's no real mechanism linking ice cream to drowning, and correlation alone never proves causation."
    },
    keyTakeaway: "Correlation is a real pattern; causation is a claim about what produced it. Only a controlled experiment can bridge that gap."
  }
];
