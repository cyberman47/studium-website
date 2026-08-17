// Document-lesson content for "Personality"
// (lib/mcatPath.ts's personality LessonContent entry).
// See lib/documentLesson.ts for the shared shape.
import { DocumentLessonContent } from "../documentLesson";

export const personalityContent: DocumentLessonContent = {
  lessonIntro: {
    description: "Personality psychology asks what makes each person's pattern of thinking, feeling, and behaving relatively stable across situations. This lesson covers the psychoanalytic, trait, and humanistic/social-cognitive perspectives—three very different ways of explaining where personality comes from and how to describe it.",
    objectives: [
      "Explain Freud's structural model of personality (id, ego, superego) and defense mechanisms",
      "Describe the Big Five (OCEAN) trait model of personality",
      "Compare humanistic theory (Rogers, Maslow) with social-cognitive theory (Bandura)",
      "Explain self-efficacy and reciprocal determinism"
    ]
  },
  bigPicture: {
    flow: ["Psychoanalytic: personality from unconscious conflict (id/ego/superego)", "Trait: personality as stable dimensions (Big Five)", "Humanistic: personality driven by growth and self-actualization", "Social-cognitive: personality shaped by the interaction of person, behavior, and environment"],
    caption: "These four perspectives aren't really competing on facts so much as asking a different question each—what unconscious forces drive you, what stable traits describe you, what growth motivates you, and how your environment and behavior shape each other."
  },
  concepts: [
    {
      number: "01",
      id: "psychoanalytic-theory",
      title: "Psychoanalytic Theory",
      difficulty: "UNDERSTAND",
      coreIdea: "Freud's structural model divides personality into the id (unconscious instinctual drives), ego (rational mediator), and superego (internalized moral standards), with defense mechanisms protecting the ego from anxiety.",
      learn: [
        "The id operates on the pleasure principle, seeking immediate gratification of instinctual drives without regard for consequences; the superego represents internalized moral standards and strives for perfection; the ego operates on the reality principle, mediating between the id's demands, the superego's moral constraints, and the practical limits of reality.",
        "Defense mechanisms are unconscious strategies the ego uses to reduce anxiety from conflict between the id, superego, and reality—repression (pushing distressing thoughts out of conscious awareness), denial (refusing to accept a distressing reality), projection (attributing one's own unacceptable feelings to someone else), and rationalization (creating a logical-sounding excuse for behavior actually driven by other motives) are among the most commonly tested."
      ],
      mcatConnection: "Being able to identify a specific defense mechanism from a described scenario is the most frequently tested skill from this theory—each mechanism has a distinct signature (denying vs. blaming someone else vs. making excuses), so focus on matching the scenario's mechanism precisely rather than the theory's broader claims.",
      quickCheck: {
        prompt: "A person who is angry at their boss but can't express it instead comes home and snaps at their family for minor issues. This best illustrates which defense mechanism?",
        options: ["Denial", "Projection", "Displacement", "Rationalization"],
        correctIndex: 2,
        explanation: "Displacement is redirecting an emotional impulse from its original, threatening target (the boss) to a safer substitute target (the family)—denial would be refusing to acknowledge the anger exists at all, and projection would involve attributing one's own anger to someone else instead."
      },
      keyTakeaway: "Freud's model divides personality into the id (instinctual drives), ego (rational mediator), and superego (moral standards); defense mechanisms like repression, denial, projection, displacement, and rationalization protect the ego from anxiety."
    },
    {
      number: "02",
      id: "trait-theory",
      title: "Trait Theory: The Big Five",
      difficulty: "IDENTIFY",
      coreIdea: "Trait theory describes personality as a set of stable dimensions along which people vary continuously; the Big Five (OCEAN) is the most well-supported modern trait model.",
      learn: [
        "Unlike psychoanalytic theory's focus on unconscious conflict, trait theory simply describes personality as a set of relatively stable characteristics along which people differ in degree—not categories a person either has or lacks, but continuous dimensions on which everyone falls somewhere.",
        "The Big Five (OCEAN) are Openness (curiosity, imagination vs. conventionality), Conscientiousness (organization, discipline vs. carelessness), Extraversion (sociability, assertiveness vs. reservedness), Agreeableness (cooperation, compassion vs. antagonism), and Neuroticism (emotional instability, anxiety vs. emotional stability)—these five dimensions are well-supported across cultures and are considered relatively stable across adulthood."
      ],
      mcatConnection: "The Big Five is worth having completely memorized (the OCEAN acronym makes this easy)—passages will describe someone's behavior and expect you to identify which trait dimension, and which end of it, is being illustrated.",
      quickCheck: {
        prompt: "A person is described as highly organized, disciplined, and reliable, consistently planning ahead and meeting deadlines. Which Big Five trait does this best describe?",
        options: ["Openness", "Conscientiousness", "Extraversion", "Agreeableness"],
        correctIndex: 1,
        explanation: "Organization, discipline, and reliability are the defining features of conscientiousness—openness relates to curiosity and imagination, extraversion to sociability, and agreeableness to cooperation and compassion, none of which match this description as closely."
      },
      keyTakeaway: "Trait theory describes personality as stable, continuous dimensions; the Big Five (OCEAN: Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism) is the best-supported modern trait model."
    },
    {
      number: "03",
      id: "humanistic-social-cognitive-theory",
      title: "Humanistic and Social-Cognitive Theory",
      difficulty: "REASON",
      coreIdea: "Humanistic theory (Rogers, Maslow) emphasizes free will and an innate drive toward self-actualization; social-cognitive theory (Bandura) emphasizes reciprocal determinism—personality, behavior, and environment continuously shaping each other.",
      learn: [
        "Humanistic theory, in contrast to psychoanalytic theory's focus on unconscious conflict, emphasizes conscious free will and an innate drive toward growth and self-actualization (reaching one's full potential)—Rogers proposed that unconditional positive regard (acceptance without conditions) from others helps a person develop a healthy, congruent self-concept.",
        "Bandura's social-cognitive theory proposes reciprocal determinism: personal factors (like beliefs and expectations), behavior, and the environment all continuously influence one another in a two-way, ongoing loop, rather than any one of the three simply causing the others. Self-efficacy—a person's belief in their own ability to succeed at a specific task—is a key personal factor in this model, shaping which behaviors a person even attempts."
      ],
      mcatConnection: "Reciprocal determinism is often tested by asking you to identify all three interacting factors (person, behavior, environment) in a described scenario—resist treating it as one-directional causation (environment simply causing behavior), since the model explicitly claims influence runs in every direction.",
      quickCheck: {
        prompt: "A student with high self-efficacy for math (a personal belief) chooses to take more challenging math courses (behavior), which exposes them to more advanced material and encouraging teachers (environment), which in turn further boosts their confidence. This cycle best illustrates:",
        options: ["Freud's structural model of personality", "The Big Five trait model", "Bandura's reciprocal determinism", "The James-Lange theory of emotion"],
        correctIndex: 2,
        explanation: "This scenario shows personal belief (self-efficacy), behavior (course choice), and environment (exposure to material and teachers) all continuously influencing one another in a two-way loop—that mutual, ongoing influence among all three factors is precisely reciprocal determinism."
      },
      keyTakeaway: "Humanistic theory emphasizes free will and an innate drive toward self-actualization; Bandura's social-cognitive theory emphasizes reciprocal determinism, where person, behavior, and environment continuously shape each other, with self-efficacy as a key personal factor."
    }
  ]
};
