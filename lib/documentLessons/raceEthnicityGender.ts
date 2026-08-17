// Document-lesson content for "Race, Ethnicity & Gender"
// (lib/mcatPath.ts's race-ethnicity-gender LessonContent entry).
// See lib/documentLesson.ts for the shared shape.
import { DocumentLessonContent } from "../documentLesson";

export const raceEthnicityGenderContent: DocumentLessonContent = {
  lessonIntro: {
    description: "Race, ethnicity, and gender are all, at their core, social categories that shape real experiences and outcomes even though they aren't fixed biological facts in the way they're often assumed to be. This lesson covers race and ethnicity as social constructs, the distinction between sex and gender, and how overlapping identities combine through intersectionality.",
    objectives: [
      "Explain why race and ethnicity are considered social constructs, and distinguish the two",
      "Distinguish prejudice, discrimination, and stereotypes",
      "Distinguish sex from gender, and explain gender roles and gender identity",
      "Explain intersectionality"
    ]
  },
  bigPicture: {
    flow: ["Society constructs categories (race, ethnicity, gender roles)", "Categories become attached to stereotypes and expectations", "Stereotypes/prejudice can produce discrimination (unequal treatment)", "Overlapping identities combine and compound (intersectionality)"],
    caption: "None of these categories act alone in someone's real, lived experience—intersectionality is the reminder that overlapping identities combine in ways that aren't just the sum of each category's separate effect."
  },
  concepts: [
    {
      number: "01",
      id: "race-ethnicity-social-constructs",
      title: "Race and Ethnicity as Social Constructs",
      difficulty: "UNDERSTAND",
      coreIdea: "Race and ethnicity are social constructs—categories created and given meaning by society rather than reflecting clear-cut biological divisions; ethnicity is based on shared cultural heritage, while race is typically based on perceived physical characteristics.",
      learn: [
        "Race is typically understood as a category based on perceived shared physical characteristics (like skin color), but genetic research shows there's more genetic variation within groups traditionally labeled as the same 'race' than between different racial groups—the boundaries and meaning of racial categories are defined by society and have shifted across history and culture, which is exactly what makes race a social construct rather than a clean biological fact.",
        "Ethnicity is based on shared cultural heritage—language, ancestry, traditions, and national origin—rather than physical characteristics; a person can identify with a particular ethnicity regardless of how they're racially categorized by others, and ethnic identity is often more directly chosen and embraced by the individual than racial categorization, which is frequently imposed from the outside."
      ],
      mcatConnection: "'Social construct' does not mean race has no real effects—the exam tests whether you understand that even though racial categories aren't based on clean biological divisions, they have very real, measurable social and health consequences precisely because society treats them as significant.",
      quickCheck: {
        prompt: "Genetic research finds more genetic variation among individuals within a single socially-defined racial group than between different racial groups. What does this best support?",
        options: ["Race is a purely biological category with no social component", "Race is a social construct, since it doesn't correspond to clean, consistent genetic/biological divisions", "This finding means race has no real effects on people's lives", "This finding is only relevant to ethnicity, not race"],
        correctIndex: 1,
        explanation: "Finding more genetic variation within than between socially-defined racial groups undermines the idea that race reflects clear, consistent biological divisions, supporting the view that racial categories are primarily socially defined—this doesn't mean race lacks real social consequences, only that those consequences aren't rooted in clean biological division."
      },
      keyTakeaway: "Race and ethnicity are social constructs—race is typically based on perceived physical characteristics without clean biological divisions, while ethnicity is based on shared cultural heritage—and both have real social consequences precisely because society treats them as meaningful."
    },
    {
      number: "02",
      id: "prejudice-discrimination-stereotypes",
      title: "Prejudice, Discrimination, and Stereotypes",
      difficulty: "IDENTIFY",
      coreIdea: "A stereotype is a generalized belief about a group; prejudice is a negative attitude toward a group based on that stereotype; discrimination is unequal treatment of individuals based on their group membership—attitude and action, kept distinct.",
      learn: [
        "A stereotype is an oversimplified, generalized belief about the characteristics of a group and its members, applied broadly regardless of individual variation; prejudice is a negative attitude or feeling directed at a group, typically rooted in stereotypes—prejudice is an internal attitude, not by itself an observable action.",
        "Discrimination is unequal, unfair treatment of individuals specifically because of their group membership—it's the behavioral expression that can (but doesn't always) follow from prejudice; a person can hold prejudiced attitudes without acting on them (no discrimination), and structural or institutional discrimination can persist even without any individual person's active, personal prejudice."
      ],
      mcatConnection: "The exam tests whether you keep 'attitude' and 'behavior' cleanly separated here—stereotype and prejudice are both about beliefs/attitudes, while discrimination is specifically about actual unequal treatment, and the three don't always occur together.",
      quickCheck: {
        prompt: "A landlord privately holds negative beliefs about a particular ethnic group but has never actually treated any tenant from that group differently. This landlord's private beliefs, on their own, best illustrate:",
        options: ["Discrimination", "Prejudice, without necessarily involving discrimination", "Intersectionality", "A social institution"],
        correctIndex: 1,
        explanation: "A negative attitude toward a group, without any accompanying unequal treatment or behavior, is prejudice without discrimination—discrimination specifically requires unequal treatment in actual behavior, which hasn't occurred in this scenario."
      },
      keyTakeaway: "A stereotype is a generalized belief about a group; prejudice is a negative attitude toward a group; discrimination is unequal treatment based on group membership—attitude (stereotype, prejudice) and behavior (discrimination) don't always occur together."
    },
    {
      number: "03",
      id: "sex-gender-intersectionality",
      title: "Sex, Gender, and Intersectionality",
      difficulty: "REASON",
      coreIdea: "Sex refers to biological characteristics; gender refers to socially constructed roles, behaviors, and identities associated with being male, female, or another gender; intersectionality describes how overlapping social identities combine to shape a person's experience in ways not reducible to any one category alone.",
      learn: [
        "Sex is typically defined by biological characteristics (chromosomes, anatomy, hormones); gender refers to the socially constructed roles, behaviors, expectations, and identities a culture associates with being male, female, or another gender—gender roles are a society's expectations for how people of a given gender 'should' behave, and gender identity is a person's own internal sense of their gender, which may or may not align with the sex assigned at birth.",
        "Intersectionality is the idea that overlapping social identities (such as race, gender, and class together) combine and interact to shape a person's experience of privilege or disadvantage in ways that can't be fully understood by looking at any single identity category in isolation—the specific experience of, for example, a woman of a particular race and class is not simply the sum of the separate effects of being that race, that gender, and that class."
      ],
      mcatConnection: "Intersectionality is frequently tested by presenting a scenario where a single-category explanation (just race, or just gender, alone) fails to fully explain an outcome, and the better explanation requires considering how multiple identity categories combine together—recognize this as exactly the concept intersectionality was developed to capture.",
      quickCheck: {
        prompt: "A researcher finds that the workplace experiences of women of color differ in specific ways from both the experiences of white women and the experiences of men of color, and cannot be fully explained by looking at race or gender separately. This finding is best explained by:",
        options: ["Sex differences alone", "Intersectionality", "The bystander effect", "Structural mobility"],
        correctIndex: 1,
        explanation: "A distinct experience that emerges from the combination of overlapping identity categories (race and gender together), not fully explained by either category alone, is exactly what intersectionality describes."
      },
      keyTakeaway: "Sex refers to biological characteristics; gender refers to socially constructed roles, expectations, and identity. Intersectionality describes how overlapping social identities combine to shape experience in ways not reducible to any single category."
    }
  ]
};
