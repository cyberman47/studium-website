// Document-lesson content for "Emotion & Motivation"
// (lib/mcatPath.ts's emotion-motivation LessonContent entry).
// See lib/documentLesson.ts for the shared shape.
import { DocumentLessonContent } from "../documentLesson";

export const emotionMotivationContent: DocumentLessonContent = {
  lessonIntro: {
    description: "Why do we feel what we feel, and what drives us to act at all? This lesson covers the competing theories of how physiological arousal and cognition combine to produce emotion, the major theories of what motivates behavior, and the biological structures underlying emotional response.",
    objectives: [
      "Compare the James-Lange, Cannon-Bard, and Schachter-Singer (two-factor) theories of emotion",
      "Compare drive reduction theory and Maslow's hierarchy of needs as theories of motivation",
      "Distinguish intrinsic from extrinsic motivation",
      "Explain the roles of the limbic system, amygdala, and autonomic nervous system in emotion"
    ]
  },
  bigPicture: {
    flow: ["Stimulus", "Physiological arousal + cognitive appraisal", "Subjective emotional experience", "Motivated behavior"],
    caption: "The three classic emotion theories all agree that arousal and thought are both involved—they disagree only about the order: does the body react first, the mind first, or do both happen together and get labeled by context?"
  },
  concepts: [
    {
      number: "01",
      id: "theories-of-emotion",
      title: "Theories of Emotion",
      difficulty: "REASON",
      coreIdea: "The James-Lange theory says physiological arousal comes first and produces emotion; the Cannon-Bard theory says arousal and emotion occur simultaneously and independently; the Schachter-Singer two-factor theory says emotion results from arousal plus a cognitive label for that arousal.",
      learn: [
        "James-Lange theory proposes that a stimulus triggers physiological arousal first, and the brain then interprets that specific pattern of arousal as a particular emotion (you feel afraid because you notice your heart racing, not the reverse); Cannon-Bard theory instead proposes that the stimulus triggers physiological arousal and the subjective emotional experience simultaneously and independently, with neither one causing the other.",
        "The Schachter-Singer two-factor theory proposes that emotion requires both physiological arousal and a cognitive label explaining that arousal, drawn from the surrounding context—the same generic arousal (like a racing heart) could be labeled as fear, excitement, or anger depending entirely on the situational cues available at the time."
      ],
      mcatConnection: "The exam usually gives you a specific experimental result or scenario and asks which theory it best supports—Schachter-Singer's two-factor theory is the one most often tested via classic misattribution-of-arousal experiments (where arousal from one source, like exercise, gets mislabeled as an emotion caused by something else entirely).",
      quickCheck: {
        prompt: "In a classic study, participants who were physiologically aroused (from exercise) but told it was due to a nearby attractive person reported greater romantic attraction than an unaroused control group. This finding best supports which theory of emotion?",
        options: ["James-Lange theory", "Cannon-Bard theory", "Schachter-Singer two-factor theory", "None of these theories address this scenario"],
        correctIndex: 2,
        explanation: "The same physiological arousal was cognitively relabeled based on contextual cues (attributing it to attraction rather than exercise), producing a different subjective emotion—this misattribution of arousal is exactly what the two-factor theory (arousal + cognitive label) predicts."
      },
      keyTakeaway: "James-Lange: arousal causes emotion. Cannon-Bard: arousal and emotion occur simultaneously and independently. Schachter-Singer: emotion requires arousal plus a cognitive label drawn from context."
    },
    {
      number: "02",
      id: "theories-of-motivation",
      title: "Theories of Motivation",
      difficulty: "UNDERSTAND",
      coreIdea: "Drive reduction theory explains motivation as reducing physiological needs to restore homeostasis; Maslow's hierarchy of needs proposes that basic physiological/safety needs must be largely met before higher psychological needs (like self-actualization) become motivating.",
      learn: [
        "Drive reduction theory proposes that an unmet physiological need (like hunger) creates an uncomfortable state of tension (a drive), and behavior is motivated by the goal of reducing that drive to restore homeostasis (a stable internal balance)—this explains basic biological motivations well but struggles to explain motivation that doesn't reduce any physiological need, like curiosity or thrill-seeking.",
        "Maslow's hierarchy of needs arranges motivations in a pyramid from basic physiological needs (food, water) and safety, up through belonging/love and esteem, to self-actualization (reaching one's full potential) at the top—the general principle is that lower-level needs typically must be reasonably satisfied before higher-level needs become strongly motivating, though real behavior doesn't always follow the hierarchy strictly."
      ],
      mcatConnection: "Intrinsic motivation (engaging in an activity for its own inherent satisfaction) versus extrinsic motivation (engaging in an activity for an external reward or to avoid punishment) is a related, frequently tested distinction—recognize that offering an extrinsic reward for an already intrinsically motivating activity can sometimes actually reduce intrinsic motivation (the overjustification effect).",
      quickCheck: {
        prompt: "A child who loves drawing for fun starts receiving a small cash reward every time they draw. Afterward, the child draws noticeably less often when the reward isn't offered. What does this illustrate?",
        options: ["Drive reduction theory", "The overjustification effect, where an extrinsic reward undermined intrinsic motivation", "Maslow's hierarchy of needs", "The James-Lange theory of emotion"],
        correctIndex: 1,
        explanation: "Adding an extrinsic reward (cash) for a previously intrinsically motivated behavior (drawing for fun) reduced the behavior once the reward stopped—this is the overjustification effect, where external rewards can crowd out internal motivation for an already-enjoyable activity."
      },
      keyTakeaway: "Drive reduction theory explains motivation via restoring physiological homeostasis; Maslow's hierarchy proposes basic needs generally must be met before higher psychological needs become motivating; extrinsic rewards can sometimes undermine intrinsic motivation (overjustification effect)."
    },
    {
      number: "03",
      id: "biological-basis-of-emotion",
      title: "The Biological Basis of Emotion",
      difficulty: "IDENTIFY",
      coreIdea: "The limbic system, especially the amygdala, is central to processing emotion (particularly fear), and the autonomic nervous system's sympathetic branch produces the physiological arousal associated with strong emotional states.",
      learn: [
        "The limbic system is a group of interconnected brain structures central to emotion, motivation, and memory; the amygdala within it plays a particularly critical role in processing fear and threat detection, rapidly triggering a fear response even before the cortex has fully consciously processed the stimulus.",
        "The autonomic nervous system's sympathetic branch drives the physiological arousal that accompanies strong emotions (increased heart rate, faster breathing, pupil dilation—the 'fight-or-flight' response), while the parasympathetic branch works to calm the body back down afterward ('rest-and-digest')."
      ],
      mcatConnection: "The amygdala's role in fear processing is one of the most frequently tested single facts in this entire content area—recognize it immediately whenever a passage describes fear conditioning, threat detection, or a patient with amygdala damage showing blunted fear responses.",
      quickCheck: {
        prompt: "A patient with damage specifically to the amygdala shows a marked reduction in fear responses to threatening stimuli, while other emotional and cognitive functions remain largely intact. This is most consistent with the amygdala's role in:",
        options: ["General intelligence", "Language processing", "Processing fear and threat detection", "Long-term memory consolidation exclusively"],
        correctIndex: 2,
        explanation: "The amygdala is specifically central to processing fear and threat, and damage to it producing a selective reduction in fear responses (while other functions remain intact) is a well-documented, classic finding consistent with that specialized role."
      },
      keyTakeaway: "The limbic system (especially the amygdala) is central to processing emotion, particularly fear; the sympathetic nervous system drives the physiological arousal of strong emotional states, while the parasympathetic system calms the body afterward."
    }
  ]
};
