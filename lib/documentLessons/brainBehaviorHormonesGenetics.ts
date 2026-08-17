// Document-lesson content for "Brain, Behavior, Hormones & Genetics"
// (lib/mcatPath.ts's brain-behavior-hormones-genetics LessonContent entry).
// See lib/documentLesson.ts for the shared shape.
import { DocumentLessonContent } from "../documentLesson";

export const brainBehaviorHormonesGeneticsContent: DocumentLessonContent = {
  lessonIntro: {
    description: "Every psychological and social process covered elsewhere in this section ultimately runs on biological hardware. This lesson covers the brain structures most closely tied to behavior, the endocrine system's role in shaping mood and behavior through hormones, and what behavioral genetics research reveals about the interplay of genes and environment.",
    objectives: [
      "Identify the brain structures most directly involved in behavior, including the limbic system and cerebral cortex regions",
      "Explain the HPA axis and the roles of cortisol, oxytocin, and testosterone in behavior",
      "Explain heritability and how twin/adoption studies estimate it",
      "Explain gene-environment interaction"
    ]
  },
  bigPicture: {
    flow: ["Brain structure (limbic system, cortex)", "+ Hormonal signaling (HPA axis, endocrine hormones)", "+ Genetic predisposition (heritability)", "Combine to shape behavior, always interacting with environment"],
    caption: "Brain structure, hormones, and genes each contribute their own layer to behavior, but none of them operates in isolation from the environment—every one of this lesson's three concepts ends up qualified by that same interaction."
  },
  concepts: [
    {
      number: "01",
      id: "brain-structures-and-behavior",
      title: "Brain Structures and Behavior",
      difficulty: "IDENTIFY",
      coreIdea: "The limbic system (including the amygdala and hippocampus) governs emotion and memory, while distinct lobes of the cerebral cortex govern higher-order functions like reasoning, movement, and sensory processing.",
      learn: [
        "The limbic system is a set of interconnected structures central to emotion and memory: the amygdala processes fear and threat detection, and the hippocampus is critical for forming new long-term (especially explicit/episodic) memories—damage to the hippocampus classically produces an inability to form new long-term memories while older memories and other cognitive functions remain intact.",
        "The cerebral cortex is organized into four lobes with distinct primary functions: the frontal lobe handles reasoning, planning, voluntary movement, and impulse control; the parietal lobe processes touch and spatial awareness; the temporal lobe processes auditory information and is involved in language comprehension; the occipital lobe processes visual information."
      ],
      mcatConnection: "Case studies describing a patient with a specific brain lesion and an associated behavioral deficit are a classic MCAT format—matching the described deficit to the correct brain structure (memory formation → hippocampus, fear response → amygdala, impulse control → frontal lobe) is exactly the tested skill.",
      quickCheck: {
        prompt: "A patient with bilateral hippocampal damage can no longer form new long-term memories, though their memories from before the injury and their other cognitive abilities remain largely intact. This case is most consistent with damage to a structure primarily responsible for:",
        options: ["Fear and threat detection", "Forming new long-term memories", "Visual processing", "Voluntary movement"],
        correctIndex: 1,
        explanation: "The hippocampus is critical for forming new long-term memories, and this exact pattern—inability to form new memories with intact older memories and other cognitive functions—is the classic, well-documented presentation of hippocampal damage."
      },
      keyTakeaway: "The limbic system (amygdala for fear, hippocampus for new long-term memory formation) governs emotion and memory; the cerebral cortex's four lobes each handle distinct higher-order functions (frontal: reasoning/movement; parietal: touch/spatial; temporal: hearing/language; occipital: vision)."
    },
    {
      number: "02",
      id: "hormones-and-behavior",
      title: "Hormones and Behavior",
      difficulty: "REASON",
      coreIdea: "The HPA axis (hypothalamus-pituitary-adrenal) governs the body's stress response via cortisol; oxytocin promotes social bonding, and testosterone influences aggression and dominance behavior.",
      learn: [
        "The HPA axis is the body's central stress-response pathway: the hypothalamus signals the pituitary gland, which signals the adrenal glands to release cortisol, the primary stress hormone—cortisol mobilizes energy and heightens alertness in the short term, but chronic, prolonged activation of the HPA axis (chronic stress) is associated with negative effects on memory, immune function, and mental health.",
        "Oxytocin, released by the pituitary gland, promotes social bonding, trust, and attachment (including between parent and infant); testosterone, produced mainly by the gonads, is associated with increased aggression and dominance-related behavior in many species, though its relationship with human behavior is shaped substantially by social and environmental context, not purely a direct biological trigger."
      ],
      mcatConnection: "The HPA axis is a high-yield cross-topic fact, connecting directly to both this psych/soc section and physiology/endocrine questions elsewhere on the exam—know the specific order (hypothalamus → pituitary → adrenal → cortisol) rather than just knowing that stress and cortisol are related.",
      quickCheck: {
        prompt: "Which sequence correctly describes the order of activation in the body's stress response via the HPA axis?",
        options: ["Adrenal glands → pituitary gland → hypothalamus → cortisol release", "Hypothalamus → pituitary gland → adrenal glands → cortisol release", "Pituitary gland → hypothalamus → adrenal glands → cortisol release", "Hypothalamus → adrenal glands → pituitary gland → cortisol release"],
        correctIndex: 1,
        explanation: "The HPA axis proceeds in the order named: the hypothalamus signals the pituitary gland, which in turn signals the adrenal glands to release cortisol—this specific order is exactly what the acronym HPA (hypothalamus-pituitary-adrenal) describes."
      },
      keyTakeaway: "The HPA axis (hypothalamus → pituitary → adrenal glands) governs the stress response via cortisol release; oxytocin promotes social bonding, and testosterone is associated with aggression/dominance, though shaped substantially by social context."
    },
    {
      number: "03",
      id: "behavioral-genetics",
      title: "Behavioral Genetics",
      difficulty: "REASON",
      coreIdea: "Heritability estimates the proportion of variation in a trait within a population attributable to genetic differences, typically studied via twin and adoption studies; gene-environment interaction shows that genetic predisposition and environment jointly shape outcomes, rather than acting independently.",
      learn: [
        "Twin studies compare trait similarity between identical (monozygotic, sharing ~100% of genes) and fraternal (dizygotic, sharing ~50% of genes on average) twins—greater similarity in identical twins than fraternal twins for a given trait suggests a genetic contribution; adoption studies compare adopted children to both their biological and adoptive parents, helping separate genetic influence (biological parents) from environmental influence (adoptive family environment).",
        "Heritability is a statistic describing the proportion of variation in a trait within a specific population that's attributable to genetic differences—it does not describe how much of an individual trait is 'caused by genes' (heritability applies to population-level variation, not to any one person), and it can change if the environment changes. Gene-environment interaction describes how a genetic predisposition's effect on behavior often depends on environmental context—a genetic risk factor for a disorder might only actually produce the disorder in the presence of a specific environmental stressor."
      ],
      mcatConnection: "The exam frequently tests the precise meaning of heritability against common misconceptions—a heritability of 50% for a trait does NOT mean an individual's trait is '50% genetic and 50% environmental'; it means that 50% of the variation in that trait across the studied population is attributable to genetic differences.",
      quickCheck: {
        prompt: "A researcher reports that a particular personality trait has a heritability of 60% in the studied population. What does this figure actually mean?",
        options: ["60% of any individual person's personality is directly caused by their genes", "60% of the variation in this trait across the population is attributable to genetic differences", "The trait is inherited from parents in 60% of cases", "Environment has no meaningful effect on this trait"],
        correctIndex: 1,
        explanation: "Heritability is a population-level statistic describing what proportion of variation in a trait across a studied population is attributable to genetic differences—it says nothing about the genetic vs. environmental origin of any single individual's trait, and it doesn't rule out environmental influence."
      },
      keyTakeaway: "Twin and adoption studies help estimate heritability, the proportion of trait variation across a population attributable to genetic differences (not a statement about any individual); gene-environment interaction shows that genetic predisposition and environment jointly shape outcomes."
    }
  ]
};
