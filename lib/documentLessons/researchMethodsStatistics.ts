// Document-lesson content for "Research Methods & Statistics"
// (lib/mcatPath.ts's research-methods-statistics LessonContent entry).
// See lib/documentLesson.ts for the shared shape.
import { DocumentLessonContent } from "../documentLesson";

export const researchMethodsStatisticsContent: DocumentLessonContent = {
  lessonIntro: {
    description: "Every psychology and sociology finding on the MCAT comes from a study design with real strengths and real limitations. This lesson covers how to build a sound experiment, the major non-experimental research designs and what each can (and can't) tell you, and the basic statistics used to describe and interpret data.",
    objectives: [
      "Identify independent and dependent variables and explain operationalization",
      "Distinguish experimental from correlational, case study, and survey designs, and what each can conclude about causation",
      "Distinguish reliability from validity",
      "Interpret descriptive statistics (mean, median, mode, standard deviation) and basic inferential statistics (p-value, correlation coefficient)"
    ]
  },
  bigPicture: {
    flow: ["Research question", "Choose a design (experimental vs. non-experimental)", "Operationalize variables", "Collect data", "Descriptive + inferential statistics", "Conclusion (causal only if truly experimental)"],
    caption: "The single most important thing a study's design determines is whether its conclusion is allowed to say 'causes' or only 'is associated with'—everything else is detail."
  },
  concepts: [
    {
      number: "01",
      id: "experimental-design",
      title: "Experimental Design",
      difficulty: "UNDERSTAND",
      coreIdea: "A true experiment manipulates an independent variable, measures a dependent variable, and controls confounds—usually via random assignment—which is what lets it support a causal claim.",
      learn: [
        "The independent variable (IV) is what the researcher deliberately manipulates; the dependent variable (DV) is what's measured as an outcome; operationalization means defining both in specific, measurable terms (e.g., 'stress' operationalized as cortisol level) so the study can actually be run and replicated.",
        "Random assignment to conditions is what distinguishes a true experiment from other designs—by spreading confounding variables roughly evenly across groups, it lets researchers attribute a difference in the DV to the IV rather than to some other, uncontrolled difference between groups."
      ],
      mcatConnection: "The exam frequently tests whether a described study design can support a causal conclusion—if there's no random assignment and no manipulated IV, the study is correlational at best, no matter how strong the relationship looks.",
      quickCheck: {
        prompt: "A researcher randomly assigns participants to either a new therapy or a waitlist control group, then measures anxiety scores afterward. What is the independent variable?",
        options: ["Anxiety score", "Whether a participant received the therapy or was on the waitlist", "The participant's age", "The researcher's hypothesis"],
        correctIndex: 1,
        explanation: "The independent variable is what the researcher manipulates between groups—here, therapy vs. waitlist—while anxiety score is the dependent variable being measured as the outcome."
      },
      keyTakeaway: "A true experiment manipulates an independent variable and uses random assignment to control confounds, which is specifically what allows a causal conclusion."
    },
    {
      number: "02",
      id: "research-designs-validity",
      title: "Research Designs, Reliability, and Validity",
      difficulty: "REASON",
      coreIdea: "Correlational studies, case studies, and surveys can reveal associations or generate hypotheses but cannot establish causation; reliability (consistency) and validity (accuracy) are separate qualities a measure can have independently.",
      learn: [
        "Correlational studies measure two variables without manipulating either, so they can show that variables are related but never that one causes the other (a third, confounding variable could explain both); case studies give rich detail on a single individual or small group but don't generalize well; surveys/naturalistic observation capture real-world behavior but with less control over confounds.",
        "Reliability is whether a measure gives consistent results on repeated use (a bathroom scale that reads differently each time you step on it, unchanged, is unreliable); validity is whether a measure actually captures what it claims to measure—a measure can be reliable without being valid (consistently wrong), but it can't be valid without being reasonably reliable first."
      ],
      mcatConnection: "'Correlation does not imply causation' is one of the most heavily tested ideas across the whole exam, not just psychology passages—whenever a passage describes a correlational finding, actively resist any answer choice that claims one variable causes the other.",
      quickCheck: {
        prompt: "A scale consistently reads 5 pounds heavier than a person's true weight every time they step on it. What does this describe?",
        options: ["The scale is reliable but not valid", "The scale is valid but not reliable", "The scale is neither reliable nor valid", "The scale is both reliable and valid"],
        correctIndex: 0,
        explanation: "The scale gives consistent (reliable) results each time, but those results are consistently inaccurate (not valid)—reliability and validity are independent qualities, and a measure can have one without the other."
      },
      keyTakeaway: "Correlational, case study, and survey designs can reveal associations but not causation; reliability (consistency) and validity (accuracy) are independent qualities of a measure."
    },
    {
      number: "03",
      id: "descriptive-inferential-statistics",
      title: "Descriptive and Inferential Statistics",
      difficulty: "IDENTIFY",
      coreIdea: "Descriptive statistics (mean, median, mode, standard deviation) summarize a data set; inferential statistics (p-values, correlation coefficients) help determine whether a finding is likely real or due to chance.",
      learn: [
        "Mean (arithmetic average), median (middle value), and mode (most frequent value) each describe central tendency but respond differently to outliers—an extreme outlier pulls the mean but barely affects the median, which is why skewed data (like income) is often reported using the median; standard deviation describes how spread out the data is around the mean.",
        "A p-value indicates the probability of observing a result this extreme if there were truly no effect (the null hypothesis were true); a result is typically called statistically significant when p < 0.05. A correlation coefficient (r) ranges from -1 to +1, indicating both the direction (positive/negative) and strength (closer to ±1 is stronger) of a linear relationship between two variables."
      ],
      mcatConnection: "The exam expects you to recognize that a small p-value means a result is unlikely to be due to chance, not that the effect itself is large or important—statistical significance and practical/clinical significance are two different things, a distinction worth having automatic.",
      quickCheck: {
        prompt: "A data set of yearly incomes contains one extreme outlier (a billionaire) among otherwise typical values. Which measure of central tendency is least affected by this outlier?",
        options: ["Mean", "Median", "Both are affected equally", "Standard deviation"],
        correctIndex: 1,
        explanation: "The median (the middle value when data is ordered) is resistant to extreme outliers, since it depends only on rank order, not magnitude—the mean, by contrast, would be pulled sharply upward by a single billionaire's income; standard deviation isn't a measure of central tendency at all."
      },
      keyTakeaway: "Descriptive statistics (mean, median, mode, standard deviation) summarize a data set; inferential statistics like p-values and correlation coefficients assess whether a finding is likely real and how strong a relationship is."
    }
  ]
};
