// Document-lesson content for "Learning & Conditioning"
// (lib/mcatPath.ts's learning-conditioning LessonContent entry).
// See lib/documentLesson.ts for the shared shape.
import { DocumentLessonContent } from "../documentLesson";

export const learningConditioningContent: DocumentLessonContent = {
  lessonIntro: {
    description: "Behaviorism explains how organisms learn associations between stimuli, and between behaviors and their consequences, without needing to reference internal mental states. This lesson covers classical conditioning (learning through association), operant conditioning (learning through consequences), and observational learning (learning by watching others).",
    objectives: [
      "Identify the components of classical conditioning (UCS, UCR, CS, CR) and explain acquisition, extinction, and generalization",
      "Distinguish reinforcement from punishment, and positive from negative",
      "Compare the four schedules of reinforcement and their effect on response patterns",
      "Explain observational learning and the role of modeling"
    ]
  },
  bigPicture: {
    flow: ["Classical conditioning: neutral stimulus paired with unconditioned stimulus", "Neutral stimulus becomes a conditioned stimulus, triggering a conditioned response", "Operant conditioning: consequences (reinforcement/punishment) shape voluntary behavior", "Observational learning: behavior learned by watching a model, without direct experience"],
    caption: "Classical conditioning is about associating two stimuli with each other; operant conditioning is about associating a behavior with its consequence—confusing which type a scenario describes is the single most common error on this topic."
  },
  concepts: [
    {
      number: "01",
      id: "classical-conditioning",
      title: "Classical Conditioning",
      difficulty: "UNDERSTAND",
      coreIdea: "Classical conditioning pairs a neutral stimulus with an unconditioned stimulus until the neutral stimulus alone triggers a conditioned response; the response can later fade (extinction) or spread to similar stimuli (generalization).",
      learn: [
        "An unconditioned stimulus (UCS) naturally triggers an unconditioned response (UCR) without any learning (food naturally triggers salivation); repeatedly pairing a neutral stimulus (like a bell) with the UCS eventually makes the neutral stimulus alone trigger a similar response—at that point it's called a conditioned stimulus (CS) triggering a conditioned response (CR).",
        "Extinction occurs when the CS is repeatedly presented without the UCS, causing the CR to fade; generalization occurs when stimuli similar to the CS also trigger the CR; discrimination is the ability to distinguish the CS from similar stimuli and respond only to the CS itself."
      ],
      mcatConnection: "The exam frequently gives a scenario and asks you to correctly label each element (UCS, UCR, CS, CR)—the reliable method is to first identify whichever response happens naturally, without any training, and work outward from there.",
      quickCheck: {
        prompt: "In Pavlov's classic experiment, a bell is repeatedly paired with food until the bell alone causes a dog to salivate. What is the food in this scenario?",
        options: ["Conditioned stimulus", "Unconditioned stimulus", "Conditioned response", "Unconditioned response"],
        correctIndex: 1,
        explanation: "Food naturally triggers salivation without any learning required, which is exactly the definition of an unconditioned stimulus—the bell is the conditioned stimulus (it only triggers salivation after pairing), and salivation to the bell alone is the conditioned response."
      },
      keyTakeaway: "Classical conditioning pairs a neutral stimulus with an unconditioned stimulus until it becomes a conditioned stimulus triggering a conditioned response; extinction fades the response, and generalization spreads it to similar stimuli."
    },
    {
      number: "02",
      id: "operant-conditioning",
      title: "Operant Conditioning",
      difficulty: "REASON",
      coreIdea: "Operant conditioning shapes voluntary behavior through consequences: reinforcement increases a behavior's frequency and punishment decreases it, and each can be positive (adding something) or negative (removing something).",
      learn: [
        "Positive reinforcement adds a desirable stimulus to increase a behavior (giving a treat for good behavior); negative reinforcement removes an aversive stimulus to increase a behavior (a car's seatbelt alarm stopping once you buckle up increases buckling); both types of reinforcement increase the future frequency of the behavior—the 'positive/negative' label refers to adding or removing something, not to whether the outcome feels pleasant.",
        "Positive punishment adds an aversive stimulus to decrease a behavior (a reprimand); negative punishment removes a desirable stimulus to decrease a behavior (taking away a phone); both types of punishment decrease the future frequency of the behavior."
      ],
      mcatConnection: "The most common trap is treating 'negative' as synonymous with 'bad' or 'punishment'—negative reinforcement is still reinforcement (it increases behavior) and is one of the most frequently misidentified concepts on the exam, precisely because of that word choice.",
      quickCheck: {
        prompt: "A student starts turning in homework on time because doing so stops their parent from nagging them about it. What type of operant conditioning does this illustrate?",
        options: ["Positive reinforcement", "Negative reinforcement", "Positive punishment", "Negative punishment"],
        correctIndex: 1,
        explanation: "The behavior (turning in homework) increases because it removes an aversive stimulus (the nagging)—removing something aversive to increase a behavior is, by definition, negative reinforcement, not punishment (which would decrease behavior)."
      },
      keyTakeaway: "Reinforcement (positive or negative) increases a behavior's frequency; punishment (positive or negative) decreases it—'positive' and 'negative' refer to adding or removing a stimulus, not to whether it feels good or bad."
    },
    {
      number: "03",
      id: "schedules-observational-learning",
      title: "Schedules of Reinforcement and Observational Learning",
      difficulty: "REASON",
      coreIdea: "Fixed and variable reinforcement schedules (by ratio or interval) produce different, predictable response patterns; observational learning lets behavior be learned by watching a model, without direct reinforcement of the observer.",
      learn: [
        "Fixed-ratio schedules reinforce after a set number of responses (a bonus every 10 sales) and produce a high, steady response rate with a brief pause after each reinforcement; variable-ratio schedules reinforce after an unpredictable number of responses (slot machines) and produce the highest, most persistent response rate of all four schedules, since the next reinforcement could always be just one response away.",
        "Fixed-interval schedules reinforce the first response after a set time has passed (a weekly paycheck) and produce a scalloped pattern (response rate increases as the time approaches); variable-interval schedules reinforce the first response after an unpredictable amount of time (checking for a text message) and produce a slow, steady response rate. Observational learning (Bandura) shows that behavior can be learned just by watching a model perform it and see its consequences, without the observer directly experiencing any reinforcement themselves."
      ],
      mcatConnection: "Variable-ratio schedules producing the most persistent, resistant-to-extinction behavior explains why gambling is so hard to quit—recognizing this real-world link (slot machines = variable-ratio) is a fast way to remember which schedule is which.",
      quickCheck: {
        prompt: "Why do variable-ratio reinforcement schedules typically produce behavior that is highly resistant to extinction?",
        options: ["Reinforcement occurs after a completely predictable number of responses", "The unpredictability of reinforcement keeps the organism responding at a high rate, since the next response could always be the one that pays off", "Variable-ratio schedules never actually reinforce the behavior", "This schedule only applies to classical, not operant, conditioning"],
        correctIndex: 1,
        explanation: "Because reinforcement is unpredictable, the organism can never be sure that continued responding won't pay off, which keeps response rates high and makes the behavior especially resistant to extinction when reinforcement eventually stops—this is the mechanism behind gambling's persistence."
      },
      keyTakeaway: "Variable-ratio schedules produce the highest, most extinction-resistant response rates; fixed schedules produce more predictable patterns; observational learning shows behavior can be acquired by watching a model, without direct reinforcement."
    }
  ]
};
