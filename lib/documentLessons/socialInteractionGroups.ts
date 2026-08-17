// Document-lesson content for "Social Interaction & Groups"
// (lib/mcatPath.ts's social-interaction-groups LessonContent entry).
// See lib/documentLesson.ts for the shared shape.
import { DocumentLessonContent } from "../documentLesson";

export const socialInteractionGroupsContent: DocumentLessonContent = {
  lessonIntro: {
    description: "People behave differently in groups than they do alone, sometimes performing better, sometimes worse, and sometimes failing to act at all. This lesson covers how the presence of others changes individual performance and effort, how groups can amplify extreme views, and why bystanders often fail to help in an emergency.",
    objectives: [
      "Distinguish social facilitation from social loafing",
      "Explain group polarization and groupthink",
      "Explain deindividuation and its behavioral effects",
      "Explain the bystander effect and diffusion of responsibility"
    ]
  },
  bigPicture: {
    flow: ["Individual placed in a group context", "Presence of others changes performance (facilitation/loafing)", "Group discussion changes attitudes (polarization/groupthink)", "Group presence changes sense of personal accountability (deindividuation, bystander effect)"],
    caption: "Groups don't just add people together—being observed, sharing effort, and sharing responsibility each change behavior in their own specific, well-documented way."
  },
  concepts: [
    {
      number: "01",
      id: "social-facilitation-loafing",
      title: "Social Facilitation and Social Loafing",
      difficulty: "REASON",
      coreIdea: "Social facilitation is improved performance on simple/well-learned tasks when others are present; social loafing is reduced individual effort on a shared task when working in a group, especially when individual contribution can't be evaluated.",
      learn: [
        "Social facilitation occurs on simple or well-practiced tasks—the presence of others increases arousal, which improves performance on tasks a person already does well, but can actually impair performance on complex or unfamiliar tasks, where that same increased arousal becomes disruptive instead of helpful.",
        "Social loafing occurs specifically on shared, collective tasks where individual contribution isn't separately identifiable or evaluated—people tend to exert less individual effort as part of a group than they would working alone, since responsibility (and credit) for the outcome is diffused across the whole group."
      ],
      mcatConnection: "The key distinguishing factor between these two is whether individual performance is separately identifiable: facilitation involves individual performance being watched/evaluated (even just an audience), while loafing involves individual effort being pooled and untraceable within a group output.",
      quickCheck: {
        prompt: "A team of employees is asked to work together on a group project where individual contributions aren't tracked or evaluated separately. Several team members put in noticeably less effort than they would working alone. This best illustrates:",
        options: ["Social facilitation", "Social loafing", "Group polarization", "Deindividuation"],
        correctIndex: 1,
        explanation: "Reduced individual effort on a shared task, specifically because individual contribution isn't separately identifiable or evaluated, is the definition of social loafing—social facilitation instead involves individual performance being observable, which tends to improve effort on simple tasks."
      },
      keyTakeaway: "Social facilitation improves performance on simple/well-learned tasks when individually observed; social loafing reduces individual effort on shared tasks when contribution can't be separately evaluated."
    },
    {
      number: "02",
      id: "group-polarization-groupthink",
      title: "Group Polarization and Groupthink",
      difficulty: "IDENTIFY",
      coreIdea: "Group polarization is the tendency for group discussion to strengthen the group's initial leaning into a more extreme position; groupthink is the tendency for a highly cohesive group to prioritize consensus over critically evaluating alternatives.",
      learn: [
        "Group polarization occurs when discussing an issue with like-minded others pushes the group's average opinion further toward whatever direction it already leaned before discussion began—a group that starts out mildly in favor of a risky decision often becomes strongly in favor of it after discussing it together.",
        "Groupthink occurs when a highly cohesive group's desire for harmony and consensus overrides realistic, critical appraisal of alternatives—dissenting opinions get suppressed (often self-censored by members who don't want to disrupt group harmony), leading to poor decisions that a more critical, individually-reasoned process would have avoided."
      ],
      mcatConnection: "Groupthink is frequently illustrated with real historical decision-making failures where dissent was suppressed for the sake of consensus—recognize the signature (cohesive group, suppressed dissent, poor outcome) rather than needing to memorize any specific historical example.",
      quickCheck: {
        prompt: "A tightly-knit committee, eager to maintain group harmony, moves forward with a risky decision after a few members privately doubt it but stay silent rather than disrupt the group's apparent consensus. This best illustrates:",
        options: ["Social loafing", "Group polarization", "Groupthink", "The bystander effect"],
        correctIndex: 2,
        explanation: "A cohesive group suppressing dissenting views and prioritizing apparent consensus over critical evaluation of a decision is the defining pattern of groupthink—group polarization would instead involve the group's overall opinion shifting toward a more extreme version of its initial leaning, not suppression of dissent specifically."
      },
      keyTakeaway: "Group polarization strengthens a group's initial leaning into a more extreme shared position through discussion; groupthink is a cohesive group prioritizing consensus over critical evaluation, suppressing dissent."
    },
    {
      number: "03",
      id: "deindividuation-bystander-effect",
      title: "Deindividuation and the Bystander Effect",
      difficulty: "REASON",
      coreIdea: "Deindividuation is a loss of individual self-awareness and personal accountability in a group (especially when anonymous), which can increase behavior a person wouldn't engage in alone; the bystander effect is reduced likelihood of any one person helping in an emergency as the number of bystanders increases, driven by diffusion of responsibility.",
      learn: [
        "Deindividuation occurs when being part of a group—especially an anonymous one, like a crowd or a mob—reduces self-awareness and the sense of personal accountability for one's own actions, which can lead people to behave in ways (often more extreme or antisocial) that they wouldn't as clearly identifiable individuals.",
        "The bystander effect describes the counterintuitive finding that an individual is less likely to help someone in an emergency when other bystanders are present than when alone—this is driven largely by diffusion of responsibility, where each bystander assumes someone else will (or should) act, so responsibility for helping feels spread thin across the whole group rather than resting on any one person."
      ],
      mcatConnection: "The bystander effect is a favorite MCAT setup because it's counterintuitive—more witnesses to an emergency should intuitively mean more help, but the exam tests whether you know it actually predicts less individual likelihood of helping, specifically via diffusion of responsibility.",
      quickCheck: {
        prompt: "A person collapses in a crowded public plaza. Research on the bystander effect predicts that, compared to a scenario with only one witness present, having many witnesses present will most likely result in:",
        options: ["A faster response, since more people are available to help", "A slower or absent response, since each witness assumes someone else will act", "No difference in response time regardless of the number of witnesses", "Witnesses becoming more anxious but equally likely to help"],
        correctIndex: 1,
        explanation: "The bystander effect predicts that as the number of witnesses increases, any individual witness becomes less likely to help, since diffusion of responsibility spreads the perceived obligation to act across the whole group—counterintuitively, a lone witness is often more likely to help than one among many."
      },
      keyTakeaway: "Deindividuation reduces self-awareness and personal accountability in a group, especially when anonymous; the bystander effect—driven by diffusion of responsibility—makes any one person less likely to help as the number of witnesses increases."
    }
  ]
};
