// Document-lesson content for "Language, Intelligence & Problem Solving"
// (lib/mcatPath.ts's language-intelligence-problem-solving LessonContent entry).
// See lib/documentLesson.ts for the shared shape.
import { DocumentLessonContent } from "../documentLesson";

export const languageIntelligenceProblemSolvingContent: DocumentLessonContent = {
  lessonIntro: {
    description: "Higher cognition covers how humans structure language, solve problems, and reason about intelligence itself. This lesson covers the building blocks of language, the heuristics and biases that shape everyday decision-making, and the major theories of what intelligence actually is.",
    objectives: [
      "Identify the structural building blocks of language (phonemes, morphemes, syntax, semantics)",
      "Distinguish algorithms from heuristics in problem solving, and identify common cognitive biases",
      "Explain the availability and representativeness heuristics",
      "Compare major theories of intelligence, including general intelligence (g) and multiple intelligences"
    ]
  },
  bigPicture: {
    flow: ["Sounds combine into words (phonemes → morphemes)", "Words combine into sentences (syntax)", "Sentences convey meaning (semantics)", "Language enables complex reasoning and problem solving"],
    caption: "Language is built in layers, from the smallest sound unit up to full meaning—and once in place, it becomes one of the main tools the mind uses for the reasoning and problem solving covered in the rest of this lesson."
  },
  concepts: [
    {
      number: "01",
      id: "structure-of-language",
      title: "The Structure of Language",
      difficulty: "IDENTIFY",
      coreIdea: "Language is built from phonemes (smallest sound units), combined into morphemes (smallest meaningful units), arranged by syntax (grammatical rules) to produce semantics (meaning).",
      learn: [
        "A phoneme is the smallest unit of sound that affects meaning in a language (like the difference between 'b' and 'p' in 'bat' vs. 'pat'); a morpheme is the smallest unit that actually carries meaning—some morphemes are whole words, and others are prefixes or suffixes attached to a word (like '-ed' or 're-').",
        "Syntax is the set of rules governing how words are arranged into grammatically correct sentences; semantics is the actual meaning conveyed by words and sentences—a sentence can be syntactically correct but semantically meaningless (Chomsky's famous example: 'colorless green ideas sleep furiously'), showing that grammatical structure and meaning are genuinely separate properties of language."
      ],
      mcatConnection: "The exam sometimes tests whether you recognize that grammatical correctness (syntax) and meaningfulness (semantics) can come apart—a sentence following all the rules of grammar can still be nonsensical, which is exactly the kind of distinction passage questions probe.",
      quickCheck: {
        prompt: "The word 'unhappiness' contains three morphemes: 'un-', 'happy', and '-ness'. What makes each of these a morpheme rather than just a sound?",
        options: ["Each one is a complete word on its own", "Each one is the smallest unit that carries its own distinct piece of meaning", "Each one is a single phoneme", "Morphemes are defined purely by syntax, not meaning"],
        correctIndex: 1,
        explanation: "A morpheme is defined as the smallest meaningful unit of language—'un-' contributes negation, 'happy' contributes the core meaning, and '-ness' converts it to a noun, each adding its own distinct piece of meaning, even though 'un-' and '-ness' aren't complete words by themselves."
      },
      keyTakeaway: "Phonemes are the smallest sound units, morphemes are the smallest meaningful units, syntax governs grammatical structure, and semantics is meaning—syntax and semantics are separate properties that can come apart."
    },
    {
      number: "02",
      id: "problem-solving-heuristics-biases",
      title: "Problem Solving, Heuristics, and Biases",
      difficulty: "REASON",
      coreIdea: "Algorithms are guaranteed-correct but often slow step-by-step procedures; heuristics are faster mental shortcuts that can be wrong, and predictable biases like availability and representativeness systematically distort judgment.",
      learn: [
        "An algorithm is a logical, step-by-step procedure that's guaranteed to eventually produce a correct solution if followed exactly, but can be slow or impractical; a heuristic is a mental shortcut or 'rule of thumb' that's faster and usually works but isn't guaranteed to produce the correct answer—most everyday decision-making relies on heuristics rather than algorithms.",
        "The availability heuristic judges the likelihood of an event based on how easily examples come to mind (overestimating shark attack risk because they're vivid and memorable, not because they're statistically common); the representativeness heuristic judges likelihood based on how closely something matches a prototype, often ignoring actual base rates (assuming a quiet, detail-oriented person is more likely a librarian than a salesperson, even though salespeople vastly outnumber librarians)."
      ],
      mcatConnection: "Passages often describe a judgment error and ask you to name the heuristic behind it—availability is about ease of recall (vivid, memorable, recent events), while representativeness is about resemblance to a stereotype or prototype; keeping that distinction sharp is the tested skill.",
      quickCheck: {
        prompt: "After seeing extensive news coverage of a plane crash, a person becomes afraid to fly, even though flying is statistically much safer than driving. This best illustrates:",
        options: ["The representativeness heuristic", "The availability heuristic", "An algorithm", "Confirmation bias specifically, not a heuristic"],
        correctIndex: 1,
        explanation: "The vivid, heavily covered plane crash comes easily to mind, inflating the perceived likelihood of a crash far beyond its actual statistical rate—judging likelihood based on how easily examples come to mind is exactly the availability heuristic."
      },
      keyTakeaway: "Algorithms are slow but guaranteed-correct procedures; heuristics are fast mental shortcuts prone to error—the availability heuristic relies on ease of recall, and the representativeness heuristic relies on resemblance to a prototype, often ignoring real base rates."
    },
    {
      number: "03",
      id: "theories-of-intelligence",
      title: "Theories of Intelligence",
      difficulty: "UNDERSTAND",
      coreIdea: "General intelligence (g) proposes a single underlying cognitive ability behind performance across many mental tasks, while multiple intelligences theory proposes several distinct, independent types of intelligence rather than one general factor.",
      learn: [
        "The general intelligence (g) model, based on the observation that performance on different cognitive tests tends to correlate with each other, proposes one underlying general mental ability that contributes to performance across many different tasks; standard IQ tests are built on this assumption, producing a single overall score.",
        "Multiple intelligences theory (Gardner) instead proposes several distinct, relatively independent types of intelligence—such as logical-mathematical, linguistic, spatial, musical, and interpersonal—arguing that a single g score can't capture genuinely different kinds of ability that don't necessarily correlate with each other."
      ],
      mcatConnection: "You're not expected to take a side on which theory is 'right'—the exam tests whether you can identify which theory a described study or argument supports: correlated performance across diverse tasks supports g, while evidence of independent, uncorrelated abilities supports multiple intelligences.",
      quickCheck: {
        prompt: "A researcher finds that a person's musical ability shows no meaningful correlation with their mathematical or linguistic ability, suggesting these are genuinely separate skills rather than reflections of one general ability. This finding is most consistent with:",
        options: ["The general intelligence (g) model", "Multiple intelligences theory", "Weber's law", "The representativeness heuristic"],
        correctIndex: 1,
        explanation: "Finding that different types of ability don't correlate with each other directly supports the idea of several independent intelligences rather than one general underlying factor—the g model instead predicts that performance across different cognitive domains should correlate."
      },
      keyTakeaway: "The general intelligence (g) model proposes one underlying ability behind correlated performance across cognitive tasks; multiple intelligences theory proposes several independent types of intelligence that need not correlate with each other."
    }
  ]
};
