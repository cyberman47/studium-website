// Document-lesson content for "Sensation & Perception"
// (lib/mcatPath.ts's sensation-perception LessonContent entry).
// See lib/documentLesson.ts for the shared shape.
import { DocumentLessonContent } from "../documentLesson";

export const sensationPerceptionContent: DocumentLessonContent = {
  lessonIntro: {
    description: "Sensation is raw input from the world; perception is what the brain makes of it. This lesson covers the thresholds that determine what we can detect at all, how sensory organs convert physical energy into neural signals, and the organizing principles that turn scattered sensory input into a coherent perceived world.",
    objectives: [
      "Define absolute threshold and difference threshold (just noticeable difference), and apply Weber's law",
      "Explain sensory transduction as the shared mechanism across the senses",
      "Distinguish bottom-up from top-down processing",
      "Apply Gestalt principles of perceptual organization"
    ]
  },
  bigPicture: {
    flow: ["Physical stimulus", "Sensory receptor transduction (energy → neural signal)", "Sensation (raw detection)", "Perception (brain organizes and interprets)"],
    caption: "Every sense follows the same basic pipeline—transduction turns physical energy into a neural signal—but what the brain does with that signal afterward, organizing it into a meaningful perceived world, is where the more interesting psychology happens."
  },
  concepts: [
    {
      number: "01",
      id: "sensory-thresholds",
      title: "Sensory Thresholds",
      difficulty: "UNDERSTAND",
      coreIdea: "Absolute threshold is the minimum stimulus intensity detectable 50% of the time; difference threshold (just noticeable difference) is the minimum detectable change, and Weber's law states this change is a constant proportion of the original stimulus.",
      learn: [
        "Absolute threshold is the smallest amount of a stimulus a person can detect half the time it's presented—below it, a stimulus essentially isn't sensed at all; difference threshold (also called just noticeable difference, JND) is the smallest change in a stimulus a person can reliably detect.",
        "Weber's law states that the JND is a constant proportion (not a constant amount) of the original stimulus intensity—detecting a 1-pound increase is easy when holding a 2-pound bag but nearly impossible when holding a 100-pound bag, because the proportional change, not the absolute change, is what matters for detection."
      ],
      mcatConnection: "Weber's law questions usually present two scenarios differing only in starting stimulus intensity and ask which change would be easier to detect—the proportional (not absolute) size of the change is always the deciding factor.",
      quickCheck: {
        prompt: "According to Weber's law, why is it easier to notice someone turning on one extra candle in a dark room than turning on one extra light in an already brightly lit room?",
        options: ["Candles are inherently easier to detect than electric lights", "The added light is a much larger proportional change relative to the dim room's low starting brightness", "Absolute threshold, not difference threshold, applies to this scenario", "There is no real difference in detectability between the two situations"],
        correctIndex: 1,
        explanation: "Weber's law states that the just noticeable difference is a constant proportion of the starting stimulus—one candle added to near-darkness is a huge proportional change, while one light added to an already bright room is a tiny proportional change, making it much harder to detect."
      },
      keyTakeaway: "Absolute threshold is the minimum detectable stimulus; difference threshold (JND) is the minimum detectable change, and Weber's law states that the JND is a constant proportion, not a constant amount, of the original stimulus."
    },
    {
      number: "02",
      id: "sensory-transduction",
      title: "Sensory Transduction",
      difficulty: "IDENTIFY",
      coreIdea: "Every sense relies on transduction—specialized receptors converting a specific form of physical energy (light, sound waves, pressure, chemicals) into electrical neural signals the brain can process.",
      learn: [
        "Transduction is the shared mechanism underlying every sense: photoreceptors in the retina transduce light, hair cells in the cochlea transduce sound waves (mechanical vibration), and mechanoreceptors in the skin transduce pressure/touch—each converts its specific type of physical energy into the same basic currency, neural action potentials.",
        "Because the resulting signal is electrochemical rather than the original physical stimulus itself, the brain never directly experiences light, sound, or pressure—it only ever interprets patterns of neural firing, which is exactly why perception can be manipulated or fooled even when the physical stimulus is unchanged (as in sensory illusions)."
      ],
      mcatConnection: "Recognizing transduction as the common thread across all sensory systems lets you transfer the same concept across vision, audition, and somatosensation passages instead of treating each sense as an unrelated topic to memorize separately.",
      quickCheck: {
        prompt: "What do photoreceptors in the eye and hair cells in the cochlea have in common, despite responding to completely different types of physical stimuli?",
        options: ["They both directly transmit light energy to the brain", "They both transduce their specific stimulus into electrical neural signals", "They are both located in the same part of the nervous system", "They both respond exclusively to chemical stimuli"],
        correctIndex: 1,
        explanation: "Both are sensory receptors that transduce their specific form of physical energy (light for photoreceptors, sound vibration for hair cells) into the same basic currency, electrochemical neural signals—the brain never receives light or sound directly, only these converted signals."
      },
      keyTakeaway: "Transduction—the conversion of a specific type of physical energy into neural signals—is the shared mechanism underlying every sense, even though each sense responds to a different kind of stimulus."
    },
    {
      number: "03",
      id: "perceptual-organization",
      title: "Perceptual Organization",
      difficulty: "REASON",
      coreIdea: "Bottom-up processing builds perception from raw sensory data upward; top-down processing uses prior knowledge and expectations to interpret sensory input, and Gestalt principles describe how the brain organizes scattered elements into unified wholes.",
      learn: [
        "Bottom-up processing starts with raw sensory details and builds up to a full perception (analyzing individual features of a face piece by piece); top-down processing starts with existing knowledge, context, or expectations and uses them to interpret incoming sensory data (recognizing a blurry, partially obscured word because it fits the sentence's context)—most real perception involves both simultaneously.",
        "Gestalt principles describe the brain's default rules for organizing individual sensory elements into unified wholes: proximity (nearby elements are grouped together), similarity (similar-looking elements are grouped together), closure (the brain fills in gaps to perceive a complete shape), and figure-ground (separating an object from its background)."
      ],
      mcatConnection: "A passage describing an optical illusion or a case where expectation changes what someone perceives is almost always testing top-down processing—the brain's prior knowledge actively shaping, not just passively receiving, sensory input.",
      quickCheck: {
        prompt: "A reader easily perceives a word even though several of its letters are blurry or obscured, because the surrounding sentence provides enough context to fill in the gaps. This best illustrates:",
        options: ["Bottom-up processing", "Top-down processing", "Absolute threshold", "Transduction"],
        correctIndex: 1,
        explanation: "Using prior knowledge and context (the sentence) to interpret incomplete sensory data (the blurry letters) is the definition of top-down processing—bottom-up processing would instead require building the perception purely from the raw visual features, without relying on context."
      },
      keyTakeaway: "Bottom-up processing builds perception from raw sensory data; top-down processing uses prior knowledge and context to interpret it; Gestalt principles (proximity, similarity, closure, figure-ground) describe how the brain organizes elements into unified wholes."
    }
  ]
};
