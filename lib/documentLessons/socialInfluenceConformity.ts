// Document-lesson content for "Social Influence & Conformity"
// (lib/mcatPath.ts's social-influence-conformity LessonContent entry).
// See lib/documentLesson.ts for the shared shape.
import { DocumentLessonContent } from "../documentLesson";

export const socialInfluenceConformityContent: DocumentLessonContent = {
  lessonIntro: {
    description: "Some of social psychology's most famous, unsettling findings come from studying how far people will go to fit in with a group or obey an authority figure. This lesson covers Asch's conformity studies, Milgram's obedience studies, and the everyday compliance techniques that get people to say yes.",
    objectives: [
      "Explain Asch's conformity findings and the factors that increase or decrease conformity",
      "Explain Milgram's obedience findings and the factors that increase or decrease obedience",
      "Distinguish conformity, compliance, and obedience",
      "Explain the foot-in-the-door and door-in-the-face compliance techniques"
    ]
  },
  bigPicture: {
    flow: ["Group pressure without direct request (conformity)", "Direct request from a peer (compliance)", "Direct command from an authority figure (obedience)"],
    caption: "Conformity, compliance, and obedience all describe social influence, but they differ in exactly who's doing the influencing and how directly they're asking—a distinction worth keeping precise, since the exam tests it directly."
  },
  concepts: [
    {
      number: "01",
      id: "conformity-asch",
      title: "Conformity: Asch's Studies",
      difficulty: "REASON",
      coreIdea: "Asch's studies showed that people will often conform to an obviously incorrect group answer on a simple perceptual task, and conformity is strongly influenced by group size, unanimity, and public vs. private responding.",
      learn: [
        "In Asch's classic line-judgment studies, a real participant was placed among confederates (actors) who unanimously gave an obviously wrong answer to a simple perceptual question—a substantial portion of real participants conformed to the group's incorrect answer at least once, despite the correct answer being visually obvious.",
        "Conformity increased with group size up to about 3-5 confederates (beyond that, additional group members added little further pressure) and dropped sharply if even one confederate broke unanimity by giving the correct answer; conformity was also higher when participants answered publicly rather than privately, showing that at least part of the effect was about avoiding open disagreement, not just genuine belief change."
      ],
      mcatConnection: "The 'one dissenter breaks the effect' finding is one of the most frequently tested specific details from Asch's work—even a single ally giving the correct answer dramatically reduces conformity, which the exam often uses to test whether a described intervention would increase or decrease conforming behavior.",
      quickCheck: {
        prompt: "In a replication of Asch's study, one confederate is instructed to give the correct answer while the rest of the group gives an incorrect answer. What effect does this single dissenting confederate have on the real participant's conformity?",
        options: ["It has no measurable effect on conformity", "It substantially increases conformity to the incorrect group answer", "It substantially decreases conformity to the incorrect group answer", "It causes the participant to always give an incorrect answer"],
        correctIndex: 2,
        explanation: "Breaking the group's unanimity, even with just one dissenting voice, substantially reduces conformity in Asch's studies—the participant no longer feels alone in disagreeing with the majority, which is one of the most well-established and frequently tested findings from this research."
      },
      keyTakeaway: "Asch's studies showed conformity to an obviously incorrect group answer, increasing with group size (up to a point) and public responding, but dropping sharply when group unanimity is broken by even one dissenter."
    },
    {
      number: "02",
      id: "obedience-milgram",
      title: "Obedience: Milgram's Studies",
      difficulty: "REASON",
      coreIdea: "Milgram's studies showed that a striking majority of participants would obey an authority figure's instructions to deliver what they believed were increasingly severe (even dangerous) electric shocks to another person, and obedience was strongly influenced by the authority figure's proximity and legitimacy.",
      learn: [
        "In Milgram's studies, participants were instructed by an experimenter (an authority figure) to administer increasingly intense electric shocks to a 'learner' (actually a confederate, not really shocked) for wrong answers—a majority of participants continued administering shocks all the way to the maximum, clearly labeled dangerous level, despite the learner's apparent distress.",
        "Obedience dropped substantially when the authority figure was physically farther away or less clearly legitimate (giving instructions by phone rather than in person, or when the study was run outside a prestigious institution), and also dropped when the participant could see the direct human consequences of their actions (being in the same room as the 'learner')."
      ],
      mcatConnection: "Milgram's findings are frequently used to test whether you understand that obedience isn't about individual moral character so much as it is about situational factors (authority proximity, legitimacy, and psychological distance from the consequences)—the exam often asks which factor would increase or decrease obedience in a modified scenario.",
      quickCheck: {
        prompt: "In a variation of Milgram's study, the experimenter gives instructions over the phone from another room rather than being physically present. Based on Milgram's findings, what effect would this most likely have on obedience rates?",
        options: ["Obedience would increase", "Obedience would decrease", "Obedience would remain exactly the same", "This variation was not studied by Milgram and its effect is unknown"],
        correctIndex: 1,
        explanation: "Milgram found that obedience dropped when the authority figure was physically more distant (such as giving instructions remotely rather than in person)—reduced physical presence and immediacy of the authority figure reliably decreased obedience rates in his research."
      },
      keyTakeaway: "Milgram's studies showed high rates of obedience to an authority figure's instructions, which decreased substantially when the authority figure was less physically present/legitimate or when the participant could see the direct consequences of their actions."
    },
    {
      number: "03",
      id: "compliance-techniques",
      title: "Conformity, Compliance, and Obedience; Compliance Techniques",
      difficulty: "IDENTIFY",
      coreIdea: "Conformity is matching behavior to group norms without a direct request; compliance is agreeing to a direct request from a peer; obedience is following a direct command from an authority figure—and specific techniques like foot-in-the-door and door-in-the-face reliably increase compliance.",
      learn: [
        "Conformity involves changing behavior to match a group, often without anyone directly asking; compliance involves agreeing to a specific request made by someone without institutional authority over you (a peer asking a favor); obedience involves following a direct command from a recognized authority figure—the distinguishing question is who is exerting the influence and how directly they're asking.",
        "The foot-in-the-door technique gets someone to agree to a small initial request first, which increases the likelihood they'll agree to a larger related request afterward; the door-in-the-face technique does the reverse—starting with a large request expected to be refused, then following up with a smaller request (the one actually desired all along), which seems more reasonable by comparison and is more likely to be accepted."
      ],
      mcatConnection: "Distinguishing foot-in-the-door from door-in-the-face is a frequent exam target—remember foot-in-the-door escalates (small request first, then bigger), while door-in-the-face de-escalates (large request first, then smaller), and both work by exploiting the contrast with the request that came before it.",
      quickCheck: {
        prompt: "A salesperson first asks a homeowner to sign a small petition supporting a cause, and a few weeks later asks the same homeowner to place a large, obtrusive sign in their yard supporting that same cause. This sequence is an example of:",
        options: ["The door-in-the-face technique", "The foot-in-the-door technique", "Obedience to authority", "The bystander effect"],
        correctIndex: 1,
        explanation: "Starting with a small request (signing a petition) to increase the likelihood of compliance with a larger related request later (the yard sign) is the defining pattern of the foot-in-the-door technique—door-in-the-face would instead start with an oversized request expected to be refused, followed by a smaller one."
      },
      keyTakeaway: "Conformity matches group norms without a direct request; compliance follows a peer's direct request; obedience follows an authority figure's command. Foot-in-the-door escalates from a small to a larger request; door-in-the-face de-escalates from a large to a smaller one."
    }
  ]
};
