// Document-lesson content for "Evolution, Genetics & Ecology"
// (lib/mcatPath.ts's evolution-genetics-ecology LessonContent entry)—
// restructured from that same real entry. See lib/documentLesson.ts for the
// shared shape.
import { DocumentLessonContent } from "../documentLesson";

export const evolutionGeneticsEcologyContent: DocumentLessonContent = {
  lessonIntro: {
    description: "This lesson ties population genetics, evolutionary mechanisms, and community ecology together at a more advanced level than the standalone Biology lessons: the math that detects evolution in a population, the mechanisms (beyond natural selection) that drive it, and the patterns of interaction that structure an ecological community.",
    objectives: [
      "Use the Hardy-Weinberg equation to predict and check genotype frequencies",
      "List the five Hardy-Weinberg assumptions",
      "Distinguish allopatric speciation, genetic drift, the founder effect, and the bottleneck effect",
      "Distinguish predation, competition, and the three types of symbiosis"
    ]
  },
  bigPicture: {
    flow: ["Predicted (Hardy-Weinberg)", "vs. Observed", "Deviation detected", "Evolution is occurring"],
    caption: "Hardy-Weinberg equilibrium is a null hypothesis for a population's genetics—it describes what genotype frequencies would look like if the population were NOT evolving, so any real deviation from it is evidence that it is."
  },
  concepts: [
    {
      number: "01",
      id: "hardy-weinberg",
      title: "Hardy-Weinberg Equilibrium",
      difficulty: "UNDERSTAND",
      coreIdea: "The Hardy-Weinberg equation (p² + 2pq + q² = 1) predicts genotype frequencies in a non-evolving population under five specific assumptions.",
      learn: [
        "The Hardy-Weinberg equation (p² + 2pq + q² = 1, where p + q = 1) predicts genotype frequencies in a population that is not evolving. p and q represent the frequencies of the two alleles for a gene; p² and q² represent the frequencies of the two homozygous genotypes, and 2pq represents the frequency of the heterozygous genotype.",
        "Hardy-Weinberg equilibrium only holds under five idealized assumptions: no mutation, no migration, no natural selection, random mating, and a very large population size. Comparing a real population's actual genotype frequencies to the Hardy-Weinberg prediction is a direct way to detect whether evolution is occurring."
      ],
      mcatConnection: "Hardy-Weinberg math questions are very formulaic—practice converting q² (observed frequency of recessive phenotype) into q, then p, then the full genotype breakdown, since this exact chain shows up repeatedly.",
      quickCheck: {
        prompt: "In a population at Hardy-Weinberg equilibrium, the frequency of the recessive allele (q) is 0.2. What is the expected frequency of homozygous recessive individuals (q²)?",
        options: ["0.2", "0.04", "0.4", "0.96"],
        correctIndex: 1,
        explanation: "q² = (0.2)² = 0.04, the expected frequency of homozygous recessive individuals—0.2 is the allele frequency itself, and 0.4 would be 2q, not q²."
      },
      keyTakeaway: "Hardy-Weinberg equilibrium (p² + 2pq + q² = 1) is the mathematical baseline for a non-evolving population under five strict assumptions—deviation from its prediction signals real evolution."
    },
    {
      number: "02",
      id: "speciation-mechanisms",
      title: "Speciation and Mechanisms of Evolution",
      difficulty: "IDENTIFY",
      coreIdea: "Speciation can occur with (allopatric) or without (sympatric) geographic separation; genetic drift, including the founder and bottleneck effects, shifts allele frequencies by chance.",
      learn: [
        "Speciation is the formation of new, reproductively isolated species. Allopatric speciation occurs when a population is physically separated by a geographic barrier, evolving independently until the two groups can no longer interbreed; sympatric speciation occurs without physical separation, through mechanisms like polyploidy in plants.",
        "Beyond natural selection, allele frequencies can shift through genetic drift—random chance fluctuations, especially powerful in small populations—including the founder effect (a new, small population founded by few individuals, with unrepresentative allele frequencies) and the bottleneck effect (a population's size is drastically reduced, randomly eliminating much of its genetic variation)."
      ],
      mcatConnection: "Founder effect vs. bottleneck effect is a commonly confused pair—the key distinguishing question is whether a small group is founding a brand-new population (founder) or an existing population's size crashed (bottleneck).",
      quickCheck: {
        prompt: "A small group of birds colonizes a remote island and establishes a new population with allele frequencies very different from the mainland population. This is an example of:",
        options: ["The bottleneck effect", "The founder effect", "Natural selection", "Sympatric speciation"],
        correctIndex: 1,
        explanation: "A small group founding a new, isolated population with unrepresentative allele frequencies is the founder effect—the bottleneck effect instead describes a drastic reduction in an existing population's size, and this scenario describes random sampling, not selection."
      },
      keyTakeaway: "Speciation happens with (allopatric) or without (sympatric) geographic separation; genetic drift—including the founder effect (new population) and bottleneck effect (crashed population)—shifts allele frequencies purely by chance."
    },
    {
      number: "03",
      id: "community-ecology",
      title: "Community Ecology and Species Interactions",
      difficulty: "REASON",
      coreIdea: "Predation, competition, and symbiosis (mutualism, commensalism, parasitism) are the defined patterns of species interaction that structure a community.",
      learn: [
        "Within a community, species interact in several defined ways. In predation, one species (the predator) consumes another (the prey). In competition, two species vie for the same limited resource, which can reduce both populations if their niches (their specific role and resource use within the ecosystem) overlap heavily.",
        "Symbiotic relationships include mutualism (both species benefit), commensalism (one benefits, the other is unaffected), and parasitism (one benefits at the other's expense). These interactions, together, help explain a community's overall structure and the relative abundance of each species within it."
      ],
      mcatConnection: "Classifying a described interaction into one of these five categories (predation, competition, mutualism, commensalism, parasitism) is a fast, formulaic question type—the key test is always \"who benefits, who's harmed, who's unaffected.\"",
      quickCheck: {
        prompt: "Two bird species compete intensely for the same limited nesting sites but do not otherwise directly harm each other. What type of interaction is this?",
        options: ["Predation", "Mutualism", "Competition", "Parasitism"],
        correctIndex: 2,
        explanation: "Two species vying for the same limited resource, with overlapping niches, defines competition—predation involves consumption, mutualism requires both species to benefit, and parasitism requires one species to directly harm the other."
      },
      keyTakeaway: "Species interactions fall into defined categories based on who benefits and who's harmed: predation (one consumes another), competition (both compete for a resource), and symbiosis's three flavors—mutualism, commensalism, parasitism."
    }
  ]
};
