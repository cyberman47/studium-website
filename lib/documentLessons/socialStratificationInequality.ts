// Document-lesson content for "Social Stratification & Inequality"
// (lib/mcatPath.ts's social-stratification-inequality LessonContent entry).
// See lib/documentLesson.ts for the shared shape.
import { DocumentLessonContent } from "../documentLesson";

export const socialStratificationInequalityContent: DocumentLessonContent = {
  lessonIntro: {
    description: "Every society organizes people into a hierarchy of unequal access to wealth, power, and prestige. This lesson covers the systems societies use to stratify people, how (and how easily) people move between levels of that hierarchy, and the competing theoretical explanations for why stratification exists at all.",
    objectives: [
      "Distinguish class, caste, and meritocracy as systems of social stratification",
      "Distinguish intergenerational from intragenerational social mobility, and structural from individual mobility",
      "Compare the functionalist and conflict explanations of social stratification",
      "Explain relative vs. absolute poverty"
    ]
  },
  bigPicture: {
    flow: ["Society stratifies people (class, caste, or merit-based system)", "Stratification system determines how much movement between levels is possible", "Social mobility (or lack of it) across and within generations", "Persistent inequality, explained differently by functionalist vs. conflict theory"],
    caption: "Every stratification system answers the same underlying question differently: how much can a person's position change, and by what means—inherited status, rigid caste boundaries, or theoretically open competition."
  },
  concepts: [
    {
      number: "01",
      id: "systems-of-stratification",
      title: "Systems of Social Stratification",
      difficulty: "IDENTIFY",
      coreIdea: "Class systems stratify primarily by wealth/income and allow some mobility; caste systems stratify by rigid, inherited status with little to no mobility; meritocracy stratifies (in theory) based on individual ability and effort.",
      learn: [
        "A class system stratifies society mainly along economic lines (wealth, income, occupation) and, while still shaped heavily by family background, formally allows for some social mobility based on individual effort or achievement; a caste system assigns social position at birth based on family lineage, with that position essentially fixed for life and little to no mobility, often reinforced by strict social and cultural norms against crossing caste lines.",
        "A meritocracy is a system in which social position is ideally determined by individual ability, effort, and achievement rather than by birth—most societies describe themselves as meritocracies to some degree, but in practice, factors like inherited wealth and unequal access to opportunity mean pure meritocracy (position purely reflecting merit) is more an ideal than a fully realized reality."
      ],
      mcatConnection: "The exam tests whether you can classify a described stratification system correctly—the deciding question is how much mobility the system actually permits and whether position is fixed at birth (caste) or can shift through the person's own achievement (class, meritocracy).",
      quickCheck: {
        prompt: "In a particular society, a person's social position is determined entirely by the family they are born into, is not something that can be changed through personal effort, and marriage outside one's assigned group is strongly prohibited. This describes:",
        options: ["A class system", "A caste system", "A meritocracy", "Social mobility"],
        correctIndex: 1,
        explanation: "Social position that is fixed at birth, essentially unchangeable through personal effort, and enforced through strict norms (like prohibitions on intergroup marriage) describes a caste system—a class system would instead allow at least some mobility based on individual achievement."
      },
      keyTakeaway: "Class systems stratify by wealth/income with some mobility possible; caste systems assign fixed status at birth with little to no mobility; meritocracy ideally stratifies by individual ability and effort, though rarely achieved in pure form."
    },
    {
      number: "02",
      id: "social-mobility",
      title: "Social Mobility",
      difficulty: "REASON",
      coreIdea: "Intergenerational mobility compares social position across generations (parent to child); intragenerational mobility compares a single person's position over their own lifetime; structural mobility results from broad societal/economic changes rather than individual effort.",
      learn: [
        "Intergenerational mobility measures a change in social position between generations (a child ending up in a higher or lower social class than their parents); intragenerational mobility measures a change in one individual's own social position across their own lifetime (a person starting in a low-wage job and later becoming a company executive).",
        "Structural mobility occurs when large-scale societal or economic changes shift many people's social position at once, regardless of individual effort—an economic boom that creates many new higher-paying jobs, or a recession that displaces many workers, moves large numbers of people up or down the social hierarchy simultaneously, as a structural (society-wide) effect rather than individual achievement or failure."
      ],
      mcatConnection: "Structural mobility is the concept most likely to be misread as individual achievement—the deciding clue is whether the described change in position happened because of a broad economic/societal shift affecting many people at once, rather than one person's own individual effort or ability.",
      quickCheck: {
        prompt: "A major economic downturn causes widespread layoffs, moving thousands of workers across an entire industry into lower-paying jobs or unemployment, regardless of their individual skill or effort. This is best described as:",
        options: ["Intragenerational mobility caused by individual achievement", "Structural mobility", "A caste system", "Meritocracy functioning as intended"],
        correctIndex: 1,
        explanation: "A large-scale economic change moving many people's social position at once, independent of their individual effort or ability, is the definition of structural mobility—this is a society-wide shift, not a story about any one individual's own achievement or failure."
      },
      keyTakeaway: "Intergenerational mobility compares social position across generations; intragenerational mobility compares one person's position over their own lifetime; structural mobility results from broad societal/economic shifts affecting many people at once."
    },
    {
      number: "03",
      id: "explaining-stratification-poverty",
      title: "Explaining Stratification, and Poverty",
      difficulty: "REASON",
      coreIdea: "Functionalist theory explains stratification as motivating people to fill society's important roles; conflict theory explains it as the result of powerful groups maintaining their advantage; poverty can be measured as absolute (lacking basic survival needs) or relative (having significantly less than the surrounding society's norm).",
      learn: [
        "Functionalist theory argues that stratification serves a purpose: unequal rewards (pay, prestige) motivate people to pursue the training and effort required for society's most important or difficult roles, which benefits society as a whole; conflict theory instead argues that stratification persists mainly because it benefits already-powerful groups, who use their position to maintain and reproduce their own advantage across generations, rather than because it serves any broader social good.",
        "Absolute poverty is the lack of resources needed to meet basic survival needs (food, shelter, clean water), and is measured against a fixed, universal standard; relative poverty is having substantially less income or resources than the typical standard of living in one's own surrounding society, even if basic survival needs are technically met—a family could be in relative poverty within a wealthy country while still being above the absolute poverty line."
      ],
      mcatConnection: "Functionalist vs. conflict explanations of stratification is the same lens-comparison tested elsewhere in sociology—functionalism explains stratification via its social benefit/function, conflict theory via power and the maintenance of inequality; absolute vs. relative poverty is a separate, simpler distinction based on whether the standard is fixed/universal or relative to a surrounding society.",
      quickCheck: {
        prompt: "A family in a wealthy country has enough resources to meet basic survival needs like food and shelter, but earns significantly less than the typical income in their community and cannot afford many things most of their neighbors consider standard. This family's situation is best described as:",
        options: ["Absolute poverty", "Relative poverty", "Structural mobility", "A caste system"],
        correctIndex: 1,
        explanation: "Having enough to meet basic survival needs, but significantly less than the typical standard of living in one's own surrounding society, is the definition of relative poverty—absolute poverty would instead mean lacking the resources for basic survival needs altogether, regardless of the surrounding society's standard."
      },
      keyTakeaway: "Functionalist theory explains stratification via the social benefit of motivating people to fill important roles; conflict theory explains it via powerful groups maintaining advantage. Absolute poverty is lacking basic survival needs; relative poverty is having significantly less than one's surrounding society's norm."
    }
  ]
};
