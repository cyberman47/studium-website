// Document-lesson content for "Consciousness & Sleep"
// (lib/mcatPath.ts's consciousness-sleep LessonContent entry).
// See lib/documentLesson.ts for the shared shape.
import { DocumentLessonContent } from "../documentLesson";

export const consciousnessSleepContent: DocumentLessonContent = {
  lessonIntro: {
    description: "Consciousness isn't a single on/off switch—it ranges across waking alertness, several distinct stages of sleep, and altered states. This lesson covers the stages of sleep and what happens in each, the circadian rhythms that regulate the sleep-wake cycle, and the major sleep disorders.",
    objectives: [
      "Describe the stages of sleep (NREM 1-3 and REM) and their characteristic brain wave patterns",
      "Explain the structure of a typical sleep cycle across a night",
      "Explain circadian rhythm and the role of the suprachiasmatic nucleus and melatonin",
      "Identify major sleep disorders and their defining features"
    ]
  },
  bigPicture: {
    flow: ["Awake (beta/alpha waves)", "NREM 1 → NREM 2 → NREM 3 (progressively slower brain waves)", "REM sleep (vivid dreaming, brain activity resembles waking)", "Cycle repeats ~every 90 minutes, REM periods lengthen across the night"],
    caption: "A night's sleep isn't one uniform state—it's a repeating cycle through distinct stages, each with its own brain activity pattern and function, and the balance between them shifts as the night goes on."
  },
  concepts: [
    {
      number: "01",
      id: "stages-of-sleep",
      title: "Stages of Sleep",
      difficulty: "IDENTIFY",
      coreIdea: "Sleep progresses through NREM stages 1-3 (progressively deeper, slower brain waves) and REM sleep (vivid dreaming, brain activity resembling wakefulness despite near-total muscle paralysis).",
      learn: [
        "NREM (non-REM) sleep has three stages of increasing depth: stage 1 is light sleep with theta waves; stage 2 includes sleep spindles and K-complexes, and is where the largest fraction of total sleep time is spent; stage 3 (slow-wave sleep) features high-amplitude, low-frequency delta waves and is the deepest, most restorative stage, hardest to wake someone from.",
        "REM (rapid eye movement) sleep is marked by fast, low-amplitude brain waves that closely resemble waking brain activity, rapid eye movements, and vivid dreaming—despite this brain activity, the body experiences near-total muscle paralysis (atonia) during REM, which normally prevents a person from physically acting out their dreams."
      ],
      mcatConnection: "Recognizing that REM sleep's brain activity looks like wakefulness (hence its nickname 'paradoxical sleep') while the body is paralyzed is a frequently tested contrast—don't confuse REM's active brain waves with the deep, slow delta waves of stage 3 NREM.",
      quickCheck: {
        prompt: "An EEG shows a sleeping person's brain waves closely resembling those of an awake person, along with rapid eye movements, even though their body is almost completely paralyzed. What sleep stage does this describe?",
        options: ["NREM stage 1", "NREM stage 3 (slow-wave sleep)", "REM sleep", "This pattern does not occur during normal sleep"],
        correctIndex: 2,
        explanation: "Brain activity resembling wakefulness combined with rapid eye movements and muscle paralysis is the signature of REM sleep, sometimes called 'paradoxical sleep' for exactly this contrast between an active brain and an immobilized body."
      },
      keyTakeaway: "NREM sleep progresses through stages 1-3 with progressively slower brain waves (stage 3 being deepest); REM sleep features waking-like brain activity, vivid dreaming, and near-total muscle paralysis."
    },
    {
      number: "02",
      id: "sleep-cycle-circadian-rhythm",
      title: "The Sleep Cycle and Circadian Rhythm",
      difficulty: "UNDERSTAND",
      coreIdea: "A full sleep cycle (through all stages and back) repeats roughly every 90 minutes across the night, with REM periods lengthening later in the night; circadian rhythm is regulated by the suprachiasmatic nucleus and the hormone melatonin.",
      learn: [
        "Across a typical night, a person cycles through NREM stages 1-3 and REM roughly every 90 minutes; slow-wave (stage 3) sleep is concentrated in the earlier cycles of the night, while REM periods become progressively longer in the later cycles, which is why early awakenings tend to be dreamless and later ones are more likely to interrupt vivid dreams.",
        "Circadian rhythm is the roughly 24-hour internal biological clock regulating the sleep-wake cycle, primarily controlled by the suprachiasmatic nucleus (SCN) in the hypothalamus, which responds to light input from the eyes; the SCN regulates the pineal gland's release of melatonin, a hormone that promotes sleepiness and rises in darkness."
      ],
      mcatConnection: "The suprachiasmatic nucleus as the body's 'master clock,' regulated by light exposure, is a high-yield fact connecting this topic to broader endocrine/hypothalamus questions elsewhere in the exam—light exposure resets the SCN, which is exactly why jet lag and shift work disrupt sleep.",
      quickCheck: {
        prompt: "Which brain structure functions as the body's primary internal 'clock,' regulating the roughly 24-hour circadian sleep-wake cycle based on light exposure?",
        options: ["The amygdala", "The suprachiasmatic nucleus", "The cerebellum", "The pineal gland"],
        correctIndex: 1,
        explanation: "The suprachiasmatic nucleus (SCN), located in the hypothalamus, is the primary circadian pacemaker, receiving light input from the eyes and in turn regulating the pineal gland's melatonin release—the pineal gland releases melatonin but doesn't itself function as the master clock."
      },
      keyTakeaway: "A full sleep cycle repeats roughly every 90 minutes, with REM periods lengthening later in the night; the suprachiasmatic nucleus regulates the roughly 24-hour circadian rhythm based on light, controlling melatonin release."
    },
    {
      number: "03",
      id: "sleep-disorders",
      title: "Sleep Disorders",
      difficulty: "REASON",
      coreIdea: "Major sleep disorders have distinct defining features: insomnia (difficulty falling/staying asleep), sleep apnea (breathing repeatedly stops during sleep), narcolepsy (sudden, uncontrollable sleep attacks, often with cataplexy), and parasomnias (abnormal behaviors during sleep, like sleepwalking).",
      learn: [
        "Insomnia is persistent difficulty falling asleep or staying asleep; sleep apnea involves repeated pauses in breathing during sleep (often due to airway obstruction), causing frequent brief awakenings and poor sleep quality even without full conscious awareness of waking.",
        "Narcolepsy involves sudden, uncontrollable episodes of falling asleep during the day, sometimes accompanied by cataplexy (a sudden loss of muscle tone triggered by strong emotion); parasomnias are abnormal behaviors during sleep, such as sleepwalking or night terrors, which typically occur during NREM slow-wave sleep, not REM."
      ],
      mcatConnection: "Narcolepsy is frequently linked on the exam to intrusion of REM-like muscle paralysis (atonia) into waking life, which is exactly the mechanism behind cataplexy—recognizing narcolepsy as a REM-regulation disorder, not simply 'excessive sleepiness,' is the deeper, more testable understanding.",
      quickCheck: {
        prompt: "A patient experiences sudden, brief episodes of muscle weakness triggered by laughter or strong emotion, along with uncontrollable daytime sleep attacks. This presentation is most consistent with:",
        options: ["Insomnia", "Sleep apnea", "Narcolepsy with cataplexy", "A parasomnia like sleepwalking"],
        correctIndex: 2,
        explanation: "Sudden daytime sleep attacks combined with emotion-triggered episodes of muscle weakness (cataplexy) is the classic presentation of narcolepsy—cataplexy specifically reflects an intrusion of REM sleep's muscle paralysis into waking life."
      },
      keyTakeaway: "Insomnia, sleep apnea, narcolepsy (with cataplexy), and parasomnias each have distinct defining features; narcolepsy's cataplexy specifically reflects REM-related muscle paralysis intruding into waking life."
    }
  ]
};
