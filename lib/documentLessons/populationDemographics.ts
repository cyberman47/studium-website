// Document-lesson content for "Population & Demographics"
// (lib/mcatPath.ts's population-demographics LessonContent entry).
// See lib/documentLesson.ts for the shared shape.
import { DocumentLessonContent } from "../documentLesson";

export const populationDemographicsContent: DocumentLessonContent = {
  lessonIntro: {
    description: "Demography is the statistical study of populations, and its core measures show up constantly in public health and epidemiology contexts on the MCAT. This lesson covers the basic demographic measures used to describe a population, the demographic transition model, and the push and pull factors behind migration.",
    objectives: [
      "Interpret birth rate, death rate, fertility rate, and population pyramids",
      "Explain the stages of the demographic transition model",
      "Distinguish push factors from pull factors in migration",
      "Explain urbanization and its demographic drivers"
    ]
  },
  bigPicture: {
    flow: ["Birth/death/fertility rates", "Determine population growth rate and age structure", "Demographic transition model tracks how these rates shift as a society develops", "Migration and urbanization further reshape population distribution"],
    caption: "A population's basic vital rates—births, deaths, fertility—aren't static facts; the demographic transition model describes a fairly predictable pattern in how they shift together as a society industrializes."
  },
  concepts: [
    {
      number: "01",
      id: "demographic-measures",
      title: "Basic Demographic Measures",
      difficulty: "IDENTIFY",
      coreIdea: "Birth rate and death rate (per 1,000 people per year) and fertility rate (average births per woman) describe a population's vital statistics; a population pyramid visually represents a population's age and sex structure.",
      learn: [
        "Birth rate (or crude birth rate) is the number of live births per 1,000 people in a population per year; death rate (or crude death rate) is the number of deaths per 1,000 people per year; fertility rate is the average number of children born per woman over her reproductive lifetime—a fertility rate around 2.1 is generally considered the 'replacement rate' needed to keep a population stable without migration.",
        "A population pyramid is a graph showing the age and sex distribution of a population as horizontal bars stacked by age group; a wide base that narrows sharply toward the top indicates a young, rapidly growing population (high birth rate), while a more rectangular or top-heavy shape indicates an older, slower-growing or shrinking population."
      ],
      mcatConnection: "Recognizing a population pyramid's shape and immediately connecting it to growth rate (wide base = young, growing population; narrow base = aging, slow/shrinking population) is a fast, frequently tested visual-interpretation skill.",
      quickCheck: {
        prompt: "A population pyramid shows a very wide base of young children that narrows sharply with each older age group. What does this shape most likely indicate about the population?",
        options: ["A shrinking, aging population", "A young, rapidly growing population with a high birth rate", "A population with an equal number of people in every age group", "A population undergoing significant emigration only"],
        correctIndex: 1,
        explanation: "A wide base that narrows sharply toward older ages indicates many more young people than old, which reflects a high birth rate and a young, rapidly growing population—a shrinking, aging population would instead show a narrower base and a more rectangular or top-heavy shape."
      },
      keyTakeaway: "Birth rate and death rate (per 1,000 per year) and fertility rate (average births per woman) describe a population's vital statistics; a population pyramid's shape visually reveals age structure and growth trajectory."
    },
    {
      number: "02",
      id: "demographic-transition-model",
      title: "The Demographic Transition Model",
      difficulty: "REASON",
      coreIdea: "The demographic transition model describes a predictable pattern as societies industrialize: high birth and death rates (stage 1) shift to declining death rates with still-high birth rates (rapid growth, stage 2), then declining birth rates (stage 3), settling into low birth and death rates (stable population, stage 4).",
      learn: [
        "In stage 1 (pre-industrial), both birth rates and death rates are high, so population growth is slow and the population stays relatively small; in stage 2, death rates drop sharply (due to improved sanitation, medicine, and food supply) while birth rates remain high, producing rapid population growth—this stage is responsible for most of the dramatic population growth seen during a society's early industrialization.",
        "In stage 3, birth rates begin to decline as well (often due to urbanization, increased education and workforce participation for women, and access to contraception), slowing population growth; in stage 4, both birth and death rates are low, and population growth levels off or stabilizes—some models add a stage 5, where birth rates fall below death rates, causing population decline."
      ],
      mcatConnection: "Stage 2's specific mechanism—death rate falling while birth rate stays high—is the most frequently tested detail, since it's the stage responsible for the rapid population growth associated with early industrialization, and it's easy to mistakenly attribute that growth to rising birth rates instead.",
      quickCheck: {
        prompt: "A developing country experiences rapid population growth after death rates fall sharply due to improved medical care and sanitation, while birth rates remain largely unchanged and still high. According to the demographic transition model, this country is most likely in:",
        options: ["Stage 1", "Stage 2", "Stage 3", "Stage 4"],
        correctIndex: 1,
        explanation: "A sharp drop in death rate combined with still-high birth rates, producing rapid population growth, is the defining pattern of stage 2 of the demographic transition model—stage 1 would have both rates high, and stages 3-4 would show birth rates declining as well."
      },
      keyTakeaway: "The demographic transition model describes a predictable shift from high birth/death rates (stage 1), through falling death rates with high birth rates (stage 2, rapid growth), to falling birth rates (stage 3), to low, stable birth/death rates (stage 4)."
    },
    {
      number: "03",
      id: "migration-urbanization",
      title: "Migration and Urbanization",
      difficulty: "IDENTIFY",
      coreIdea: "Push factors drive people to leave a location; pull factors attract people to a new location; urbanization—the growth of cities relative to rural areas—is driven largely by economic opportunity and is closely tied to a society's stage of demographic and economic development.",
      learn: [
        "Push factors are negative conditions that drive people to leave a location, such as war, persecution, natural disaster, or lack of economic opportunity; pull factors are positive conditions that attract people to a new location, such as better job prospects, political stability, or family already living there—most real migration decisions involve some combination of both push and pull factors acting together.",
        "Urbanization is the increasing concentration of a population in cities relative to rural areas, typically driven by greater economic and educational opportunity concentrated in urban centers during industrialization; urbanization is closely linked to the demographic transition, since urban living tends to be associated with lower birth rates (due to factors like the cost of raising children in cities and greater access to education and family planning)."
      ],
      mcatConnection: "The exam often gives a scenario and asks you to classify a specific factor as a push or pull factor—the deciding question is simply whether it's a negative condition driving someone away from their original location, or a positive condition drawing them toward a new one.",
      quickCheck: {
        prompt: "A family leaves their home country due to ongoing political persecution and chooses to move to a country where they have relatives already established and where they've heard job opportunities are abundant. Which of these is a pull factor in this scenario?",
        options: ["The political persecution", "The presence of relatives and job opportunities in the new country", "Both are push factors", "Neither is a push or pull factor"],
        correctIndex: 1,
        explanation: "The presence of relatives and job opportunities are positive conditions attracting the family to the new location, making them pull factors—the political persecution is a negative condition driving them away from their original location, making it a push factor instead."
      },
      keyTakeaway: "Push factors are negative conditions driving migration away from a location; pull factors are positive conditions attracting migration toward a new one. Urbanization concentrates population in cities, driven by economic opportunity, and is linked to lower birth rates."
    }
  ]
};
