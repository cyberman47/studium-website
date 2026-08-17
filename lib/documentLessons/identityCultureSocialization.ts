// Document-lesson content for "Identity, Culture & Socialization"
// (lib/mcatPath.ts's identity-culture-socialization LessonContent entry).
// See lib/documentLesson.ts for the shared shape.
import { DocumentLessonContent } from "../documentLesson";

export const identityCultureSocializationContent: DocumentLessonContent = {
  lessonIntro: {
    description: "Who we understand ourselves to be is shaped by the groups we belong to and the culture we're raised in. This lesson covers self-concept and social identity, how socialization transmits a society's norms across generations, and how culture shapes behavior and values.",
    objectives: [
      "Explain self-concept, self-schema, and social identity theory",
      "Identify the major agents of socialization",
      "Distinguish individualistic from collectivistic cultures",
      "Explain norms and values as the building blocks of culture"
    ]
  },
  bigPicture: {
    flow: ["Agents of socialization (family, peers, media, institutions)", "Transmit norms and values", "Shape self-concept and social identity", "Individual behaves consistently with internalized culture and group identity"],
    caption: "Socialization is the pipeline: the same agents that teach a culture's norms and values are what end up shaping a person's own sense of self and group identity."
  },
  concepts: [
    {
      number: "01",
      id: "self-concept-social-identity",
      title: "Self-Concept and Social Identity",
      difficulty: "UNDERSTAND",
      coreIdea: "Self-concept is a person's overall understanding of who they are, built from self-schemas (organized beliefs about oneself); social identity theory explains how belonging to groups becomes part of that self-concept, often favoring the in-group over out-groups.",
      learn: [
        "Self-concept is the sum of the beliefs a person holds about themselves; a self-schema is an organized cluster of beliefs and feelings about a particular aspect of oneself (like 'I am an athletic person'), which helps process self-relevant information faster and shapes what a person notices and remembers about their own experiences.",
        "Social identity theory proposes that part of a person's self-concept comes from the groups they belong to (in-groups)—simply categorizing people into groups tends to produce in-group favoritism (favoring one's own group) and out-group bias, even when the group distinction is arbitrary or trivial, because group membership becomes genuinely tied to self-esteem."
      ],
      mcatConnection: "Social identity theory is frequently tested through minimal group studies, where researchers assign people to arbitrary, meaningless groups (like a coin flip) and still find in-group favoritism—recognize that even a trivial, randomly assigned group membership is enough to trigger this effect.",
      quickCheck: {
        prompt: "Participants randomly assigned to 'Group A' or 'Group B' based on a coin flip, with no other meaningful distinction between the groups, subsequently allocate more rewards to members of their own group than the other group. This best illustrates:",
        options: ["Cognitive dissonance", "Social identity theory and in-group favoritism", "The bystander effect", "The fundamental attribution error"],
        correctIndex: 1,
        explanation: "Favoring one's own group even when group membership is arbitrary and meaningless demonstrates that group membership alone, once categorized, becomes tied to self-concept and produces in-group favoritism—exactly what social identity theory predicts."
      },
      keyTakeaway: "Self-concept is built from self-schemas (organized self-beliefs); social identity theory explains how group membership becomes part of self-concept, producing in-group favoritism even from arbitrary group distinctions."
    },
    {
      number: "02",
      id: "agents-of-socialization",
      title: "Agents of Socialization",
      difficulty: "IDENTIFY",
      coreIdea: "Socialization—the lifelong process of learning a society's norms, values, and roles—is transmitted through agents including family, peer groups, media, and institutions like schools and religion.",
      learn: [
        "Family is typically the earliest and often most influential agent of socialization, transmitting basic values, language, and norms from birth; peer groups become increasingly influential during childhood and adolescence, shaping behavior often through direct social pressure and modeling of group norms.",
        "Media (television, social media, and other mass communication) socializes by modeling behaviors, roles, and values, often shaping norms at a much larger, less personal scale; institutions like schools and religious organizations formally and deliberately transmit a society's values, expectations, and roles as part of their explicit purpose."
      ],
      mcatConnection: "The exam sometimes describes a specific socializing influence and asks you to identify which agent of socialization it represents—the reliable approach is to identify the actual source of the norm being transmitted (a parent, a peer group, a media portrayal, a school) rather than the norm's content itself.",
      quickCheck: {
        prompt: "A teenager begins adopting certain slang, clothing styles, and attitudes largely because their close friend group has adopted them. Which agent of socialization is most directly at work here?",
        options: ["Family", "Peer group", "Media", "Religious institutions"],
        correctIndex: 1,
        explanation: "Behaviors and attitudes adopted specifically due to influence from a close friend group reflect the peer group as the agent of socialization—family, media, and institutions are each distinct sources of socialization that don't match this specific scenario."
      },
      keyTakeaway: "Socialization is transmitted through multiple agents—family (earliest influence), peer groups (increasingly influential in adolescence), media, and institutions like schools and religion—each shaping norms, values, and roles in its own way."
    },
    {
      number: "03",
      id: "culture-norms-values",
      title: "Culture, Norms, and Values",
      difficulty: "REASON",
      coreIdea: "Norms are a culture's expected behaviors and values are its shared beliefs about what's important; individualistic cultures emphasize personal autonomy and achievement, while collectivistic cultures emphasize group harmony and interdependence.",
      learn: [
        "Norms are the specific, often unwritten rules for expected behavior within a culture or group (like norms around personal space or greeting customs); values are broader, shared beliefs about what's good, desirable, or important, which norms typically reflect and reinforce—norms are the specific behavioral rules, values are the underlying priorities those rules serve.",
        "Individualistic cultures (common in much of North America and Western Europe) tend to emphasize personal autonomy, individual achievement, and self-expression; collectivistic cultures (common in much of East Asia, Africa, and Latin America) tend to emphasize group harmony, interdependence, and the needs of the family/community over individual preferences—this is a broad cultural tendency, not a rule about any individual person within a culture."
      ],
      mcatConnection: "The individualism/collectivism distinction is frequently tested by describing a behavior and asking which cultural orientation it better reflects—the reliable cue is whether the described priority centers on individual achievement/autonomy or on group harmony/interdependence.",
      quickCheck: {
        prompt: "In a particular culture, career decisions are typically made collaboratively with extended family input, and prioritizing family harmony over individual preference is highly valued. This cultural pattern is most consistent with:",
        options: ["An individualistic culture", "A collectivistic culture", "The fundamental attribution error", "Deindividuation"],
        correctIndex: 1,
        explanation: "Prioritizing group harmony and collaborative, family-centered decision-making over individual preference is characteristic of a collectivistic culture—an individualistic culture would instead tend to emphasize personal autonomy and individual decision-making."
      },
      keyTakeaway: "Norms are a culture's specific expected behaviors; values are its broader shared priorities. Individualistic cultures emphasize personal autonomy and achievement; collectivistic cultures emphasize group harmony and interdependence."
    }
  ]
};
