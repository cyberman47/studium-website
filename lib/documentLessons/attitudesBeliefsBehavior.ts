// Document-lesson content for "Attitudes, Beliefs & Behavior"
// (lib/mcatPath.ts's attitudes-beliefs-behavior LessonContent entry).
// See lib/documentLesson.ts for the shared shape.
import { DocumentLessonContent } from "../documentLesson";

export const attitudesBeliefsBehaviorContent: DocumentLessonContent = {
  lessonIntro: {
    description: "Attitudes shape behavior, but behavior also shapes attitudes—and how people explain their own and others' behavior follows predictable, often biased patterns. This lesson covers the structure of attitudes, cognitive dissonance, and attribution theory.",
    objectives: [
      "Describe the ABC model of attitudes (affect, behavior, cognition)",
      "Explain cognitive dissonance and how people typically resolve it",
      "Distinguish dispositional from situational attribution",
      "Explain the fundamental attribution error, actor-observer bias, and self-serving bias"
    ]
  },
  bigPicture: {
    flow: ["Attitude formed (affect + cognition)", "Behavior sometimes conflicts with attitude", "Cognitive dissonance (uncomfortable tension)", "Resolved by changing attitude, behavior, or adding a justifying belief"],
    caption: "Attitudes are supposed to predict behavior, but when the two conflict, it's often the attitude—not the behavior—that quietly gives way, which is exactly what cognitive dissonance describes."
  },
  concepts: [
    {
      number: "01",
      id: "abc-model-of-attitudes",
      title: "The ABC Model of Attitudes",
      difficulty: "UNDERSTAND",
      coreIdea: "An attitude has three components—affect (emotional response), behavior (action tendency), and cognition (beliefs/thoughts)—that usually align but can conflict.",
      learn: [
        "The affective component of an attitude is the emotional reaction (liking or disliking something); the cognitive component is the beliefs and thoughts associated with it; the behavioral component is the tendency to act in a way consistent with the attitude—together these three components make up a person's overall attitude toward an object, person, or issue.",
        "These three components usually align (someone who believes exercise is healthy, feels good about it, and exercises regularly), but they can conflict—a person might believe smoking is unhealthy (cognition) yet still smoke (behavior), which sets up exactly the kind of internal tension cognitive dissonance theory addresses."
      ],
      mcatConnection: "Recognizing which specific component (affective, cognitive, or behavioral) a described attitude change is targeting is a quick, frequently tested skill—a public health campaign providing statistics is targeting the cognitive component, while one built around an emotional appeal is targeting the affective component.",
      quickCheck: {
        prompt: "An anti-smoking campaign uses graphic imagery specifically designed to evoke disgust and fear in viewers. Which component of attitude is this campaign most directly targeting?",
        options: ["The cognitive component", "The affective component", "The behavioral component", "None of the three components"],
        correctIndex: 1,
        explanation: "Evoking an emotional reaction like disgust or fear directly targets the affective (emotional) component of attitude—a campaign built around statistics or facts would instead be targeting the cognitive component."
      },
      keyTakeaway: "Attitudes have three components—affective (emotion), behavioral (action tendency), and cognitive (beliefs)—that usually align but can conflict with each other."
    },
    {
      number: "02",
      id: "cognitive-dissonance",
      title: "Cognitive Dissonance",
      difficulty: "REASON",
      coreIdea: "Cognitive dissonance is the psychological discomfort from holding two conflicting beliefs, or from behavior that conflicts with a belief; people typically resolve it by changing their attitude, not their behavior.",
      learn: [
        "Cognitive dissonance theory (Festinger) proposes that inconsistency between beliefs, or between a belief and behavior, creates uncomfortable psychological tension that motivates a person to reduce it—since already-completed behavior is often harder to undo than a belief is to adjust, people frequently resolve dissonance by changing their attitude to match their behavior after the fact, rather than the reverse.",
        "A classic example: someone paid very little to perform a boring task, but who then tells others it was interesting, tends to genuinely start believing it actually was interesting—since the small payment doesn't adequately justify lying, they resolve the dissonance by adjusting their actual attitude toward the task instead."
      ],
      mcatConnection: "The classic 'insufficient justification' finding—smaller external rewards for counter-attitudinal behavior produce larger attitude change—is a favorite MCAT twist, since it's the opposite of what intuition suggests (you'd expect a bigger reward to change attitudes more, not less).",
      quickCheck: {
        prompt: "In a classic study, participants paid only $1 to tell another person a boring task was interesting later rated the task as more enjoyable than participants paid $20 to say the same thing. Why did the $1 group show more attitude change?",
        options: ["They were paid more, creating stronger justification", "The small payment provided insufficient external justification for the lie, so they resolved the resulting dissonance by genuinely changing their attitude", "Money has no effect on cognitive dissonance", "The $20 group experienced no dissonance at all"],
        correctIndex: 1,
        explanation: "With only $1 as justification, the lie couldn't be fully explained by the external reward, creating stronger dissonance between their behavior (lying) and belief (the task was boring)—resolving that dissonance by genuinely changing their attitude was easier than living with the unexplained inconsistency; the $20 group had ample external justification and felt less need to change their actual attitude."
      },
      keyTakeaway: "Cognitive dissonance is the discomfort from conflicting beliefs or belief-behavior conflict; people often resolve it by changing their attitude to match their behavior, especially when external justification for the behavior is insufficient."
    },
    {
      number: "03",
      id: "attribution-theory",
      title: "Attribution Theory",
      difficulty: "REASON",
      coreIdea: "Attribution theory describes how people explain behavior as either dispositional (caused by internal traits) or situational (caused by external circumstances); the fundamental attribution error, actor-observer bias, and self-serving bias are systematic patterns in how these explanations get distorted.",
      learn: [
        "A dispositional attribution explains someone's behavior by their internal traits or personality (they were late because they're irresponsible); a situational attribution explains it by external circumstances (they were late because of terrible traffic)—the fundamental attribution error is the tendency to over-rely on dispositional explanations for other people's behavior while underweighting situational factors.",
        "Actor-observer bias is the tendency to attribute our own behavior to situational factors while attributing others' identical behavior to disposition (I was late because of traffic; they were late because they're careless); self-serving bias is the tendency to attribute our own successes to disposition (I got the promotion because I'm talented) but our own failures to situational factors (I got passed over because of office politics)."
      ],
      mcatConnection: "These three attribution biases are easy to conflate, so anchor each to its specific pattern: fundamental attribution error is about judging others generally, actor-observer bias is about self vs. others for the same type of behavior, and self-serving bias is specifically about protecting our own self-image (successes vs. failures).",
      quickCheck: {
        prompt: "A student attributes their own failing grade to an unfair exam, but attributes a classmate's failing grade on the same exam to the classmate simply not being smart enough. This best illustrates:",
        options: ["The fundamental attribution error only", "Self-serving bias", "Cognitive dissonance", "Social loafing"],
        correctIndex: 1,
        explanation: "Attributing one's own failure to external, situational factors (an unfair exam) while attributing someone else's identical failure to internal disposition (lack of ability) protects self-image—that specific self-protective pattern for one's own outcomes is self-serving bias, a more specific case than the general fundamental attribution error."
      },
      keyTakeaway: "The fundamental attribution error over-attributes others' behavior to disposition; actor-observer bias attributes our own behavior situationally but others' dispositionally; self-serving bias attributes our own successes to disposition and failures to situation."
    }
  ]
};
