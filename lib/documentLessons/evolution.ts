// Document-lesson content for "Evolution" (lib/mcatPath.ts's evolution
// LessonContent entry)—restructured from that same real entry. See
// lib/documentLesson.ts for the shared shape.
import { DocumentLessonContent } from "../documentLesson";

export const evolutionContent: DocumentLessonContent = {
  lessonIntro: {
    description: "Evolution isn't something that happens to an individual—it's a population-level process, measured in changing allele frequencies across generations. This lesson covers how natural selection actually works, the independent lines of evidence behind it, and how to think about it mathematically.",
    objectives: [
      "State the three conditions required for natural selection",
      "Distinguish homologous from analogous structures",
      "Define \"fitness\" in the evolutionary sense",
      "Explain evolution as a change in allele frequency"
    ]
  },
  bigPicture: {
    flow: ["Heritable variation", "Differential survival/reproduction", "Shift in allele frequency", "Population evolves"],
    caption: "Evolution isn't one organism changing during its lifetime—it's this whole sequence playing out across a population, generation after generation."
  },
  concepts: [
    {
      number: "01",
      id: "natural-selection",
      title: "Natural Selection",
      difficulty: "UNDERSTAND",
      coreIdea: "Natural selection requires heritable variation, that variation affecting survival or reproduction, and differential reproductive success as a result—traits that improve fitness become more common over generations.",
      learn: [
        "Natural selection requires three things to be in place: heritable variation within a population, that variation actually affecting survival or reproduction, and differential reproductive success as a result of it.",
        "Fitness is the term for an organism's relative ability to survive and reproduce in its environment. Traits that improve fitness tend to become more common in a population over successive generations—not because any individual organism \"tries\" to evolve, but because organisms carrying that trait simply leave more offspring."
      ],
      mcatConnection: "The exam frequently tests whether you can spot when natural selection does NOT apply—for instance, a trait acquired during an organism's lifetime (like a muscle built through exercise) isn't heritable, so it can't be acted on by natural selection at all.",
      quickCheck: {
        prompt: "Natural selection acts on:",
        options: ["Traits an individual acquires during its lifetime", "Heritable variation already present in a population", "Random mutations that always help the organism", "Traits selected deliberately by scientists"],
        correctIndex: 1,
        explanation: "Natural selection acts on existing heritable variation within a population. Acquired traits aren't heritable and aren't acted on; mutations are random and can be neutral or harmful, not always helpful; and natural selection isn't a deliberate process (that would be artificial selection)."
      },
      keyTakeaway: "Natural selection needs heritable variation that affects survival or reproduction—fitness is relative reproductive success, not strength, speed, or intelligence alone."
    },
    {
      number: "02",
      id: "evidence-for-evolution",
      title: "Evidence for Evolution",
      difficulty: "IDENTIFY",
      coreIdea: "Multiple independent lines of evidence—the fossil record, comparative anatomy, and molecular biology—all support evolution.",
      learn: [
        "The fossil record shows gradual change over time. Comparative anatomy reveals two distinct kinds of structural similarity: homologous structures share a common evolutionary origin even when their current function differs (a bat wing and a human arm share the same underlying bone structure), while analogous structures serve a similar function but evolved completely independently (a bird wing and an insect wing).",
        "Molecular biology adds a third, independent line of evidence: shared genetic sequences across related species, consistent with common ancestry the other two lines of evidence already point to."
      ],
      mcatConnection: "Homologous vs. analogous is one of the most reliably tested single distinctions in evolutionary biology—the key test is always \"do they share a common ancestor,\" not just \"do they look or function similarly.\"",
      quickCheck: {
        prompt: "A bat's wing and a human arm are an example of:",
        options: ["Analogous structures", "Homologous structures", "Vestigial structures", "Convergent structures"],
        correctIndex: 1,
        explanation: "Both share the same underlying bone structure, inherited from a common ancestor—that makes them homologous. Analogous structures evolved independently, which isn't the case here."
      },
      keyTakeaway: "Homologous structures share ancestry (function can differ); analogous structures share function but evolved independently—fossils, anatomy, and molecular biology are three independent lines of evidence, not one."
    },
    {
      number: "03",
      id: "population-genetics",
      title: "Population Genetics Basics",
      difficulty: "REASON",
      coreIdea: "Evolution can be measured as a change in allele frequencies within a population's gene pool over time, shifted by natural selection, genetic drift, mutation, and migration.",
      learn: [
        "At the population level, evolution is best defined as a change in allele frequencies within a population's gene pool over time—not something that happens to a single organism during its own lifetime.",
        "Hardy-Weinberg equilibrium describes a theoretical state where allele frequencies stay perfectly constant across generations, absent any evolutionary forces. Real populations rarely stay in that state: natural selection, genetic drift, mutation, and migration all push allele frequencies away from it, which is exactly what evolution looks like at the population-genetics level."
      ],
      mcatConnection: "Hardy-Weinberg problems often show up as calculation questions, but conceptually, the exam is really testing whether you understand that departure from Hardy-Weinberg equilibrium is itself the signature of evolution happening.",
      quickCheck: {
        prompt: "Evolution at the population level can be defined as:",
        options: ["An individual organism changing during its lifetime", "A change in allele frequencies within a population over time", "The extinction of a species", "An increase in population size only"],
        correctIndex: 1,
        explanation: "This is the standard population-genetics definition of evolution. Individuals don't evolve during their own lifetime—populations evolve across generations—and extinction or population size alone don't capture genetic change."
      },
      keyTakeaway: "Evolution, measured precisely, is a shift in allele frequencies within a population's gene pool—Hardy-Weinberg equilibrium describes the theoretical absence of that shift."
    }
  ]
};
