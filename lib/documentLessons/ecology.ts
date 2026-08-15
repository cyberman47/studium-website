// Document-lesson content for "Ecology" (lib/mcatPath.ts's ecology
// LessonContent entry)—restructured from that same real entry. See
// lib/documentLesson.ts for the shared shape.
import { DocumentLessonContent } from "../documentLesson";

export const ecologyContent: DocumentLessonContent = {
  lessonIntro: {
    description: "Ecology zooms out from a single organism to the whole system it lives in—how life is organized at increasing scales, how energy actually moves through that system, and what keeps a population's size in check.",
    objectives: [
      "Name the levels of ecological organization from smallest to largest",
      "Explain how energy flows through trophic levels, and roughly how much is lost at each step",
      "Define carrying capacity and limiting factors",
      "Distinguish logistic from exponential population growth"
    ]
  },
  bigPicture: {
    flow: ["Organism", "Population", "Community", "Ecosystem", "Biosphere"],
    caption: "Each level is built from the one before it—a population is a group of one species, a community adds every interacting species in an area, and an ecosystem adds the physical environment around them."
  },
  concepts: [
    {
      number: "01",
      id: "levels-of-organization",
      title: "Levels of Ecological Organization",
      difficulty: "UNDERSTAND",
      coreIdea: "Ecology studies life at increasing scales—organism, population, community, ecosystem, and finally the biosphere.",
      learn: [
        "Ecology studies life at a series of increasing scales. A population is all individuals of one species living in a defined area. A community is every different species population interacting in that same area. An ecosystem is a community together with its physical, non-living environment—soil, water, climate.",
        "The broadest scale, the biosphere, is all of Earth's ecosystems considered together. Each level is built directly on the one below it, which is why questions at this scale often hinge on correctly identifying which level a described scenario is actually operating at."
      ],
      mcatConnection: "The exam frequently tests whether you can correctly place a described scenario at the right level—confusing \"population\" (one species) with \"community\" (multiple species) is one of the most common errors here.",
      quickCheck: {
        prompt: "The correct order of ecological organization, from smallest to largest, is:",
        options: ["Ecosystem, community, population, organism", "Organism, population, community, ecosystem", "Community, organism, ecosystem, population", "Population, organism, community, ecosystem"],
        correctIndex: 1,
        explanation: "Organization scales up from a single organism to population, community, and ecosystem—the other orderings are reversed or scrambled."
      },
      keyTakeaway: "Ecological organization scales up: organism → population (one species) → community (multiple species) → ecosystem (community plus environment) → biosphere."
    },
    {
      number: "02",
      id: "energy-flow",
      title: "Energy Flow and Food Webs",
      difficulty: "IDENTIFY",
      coreIdea: "Energy flows one way through an ecosystem's trophic levels, and on average only about 10% transfers from one level to the next—the rest is lost as heat.",
      learn: [
        "Energy flows one way through an ecosystem's trophic levels: producers, like plants, capture energy from the sun; primary consumers eat producers; secondary consumers eat primary consumers; and decomposers break down dead matter at every level, recycling nutrients back into the system.",
        "Only about 10% of energy transfers from one trophic level to the next, on average—the rest is lost as heat. That steep loss is why food chains rarely extend more than four or five levels, and why there's always far more biomass at the producer level than at the top of the chain."
      ],
      flowDiagram: ["Producers (sun)", "Primary consumers", "Secondary consumers", "~10% transferred each step"],
      mcatConnection: "The 10% rule shows up constantly in questions asking you to estimate biomass or energy available at a given trophic level—it's a specific number worth having memorized rather than reasoned out from scratch.",
      quickCheck: {
        prompt: "Approximately what percentage of energy is transferred from one trophic level to the next?",
        options: ["90%", "50%", "10%", "1%"],
        correctIndex: 2,
        explanation: "Roughly 10% of energy transfers to the next trophic level; the rest is lost as heat. The other options substantially overstate or understate that typical transfer."
      },
      keyTakeaway: "Energy flows one-way from producers upward, with roughly 90% lost as heat at every step—only about 10% reaches the next trophic level."
    },
    {
      number: "03",
      id: "population-dynamics",
      title: "Population Dynamics",
      difficulty: "REASON",
      coreIdea: "A population's growth is limited by its environment's carrying capacity, producing logistic (S-shaped) growth that levels off, rather than unlimited exponential growth.",
      learn: [
        "A population's growth is limited by its environment's carrying capacity—the maximum size that environment can sustainably support—and by limiting factors like food, space, and predators.",
        "Real populations tend to follow logistic growth: an S-shaped curve that starts fast, then slows and levels off as the population approaches carrying capacity. That's different from unlimited exponential growth, which keeps accelerating with no ceiling and doesn't reflect how real, resource-limited populations actually behave."
      ],
      mcatConnection: "The exam often presents a population growth graph and asks you to identify whether it's logistic or exponential, and to explain what's causing the curve to level off—recognizing the S-shape and connecting it to carrying capacity is the key skill.",
      quickCheck: {
        prompt: "Logistic population growth differs from exponential growth because logistic growth:",
        options: ["Has no upper limit", "Levels off as it approaches carrying capacity", "Always leads to extinction", "Only occurs in plants"],
        correctIndex: 1,
        explanation: "Logistic growth slows and levels off as the population nears carrying capacity—that's the defining S-shape. Having no upper limit describes exponential growth instead, and logistic growth describes stabilization, not extinction, and applies broadly across species."
      },
      keyTakeaway: "Real population growth is logistic, not exponential—it slows and levels off as the population approaches its environment's carrying capacity, limited by real factors like food, space, and predation."
    }
  ]
};
