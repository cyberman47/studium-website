// Document-lesson content for "Waves, Sound, Light & Optics"
// (lib/mcatPath.ts's waves-sound-light-optics LessonContent entry).
// See lib/documentLesson.ts for the shared shape.
import { DocumentLessonContent } from "../documentLesson";

export const wavesSoundLightOpticsContent: DocumentLessonContent = {
  lessonIntro: {
    description: "Waves carry energy without carrying matter, and the same basic wave properties describe sound, light, and everything in between. This lesson covers wave fundamentals, sound-specific phenomena like the Doppler effect and resonance, and how light behaves at boundaries between media through reflection, refraction, and simple lenses.",
    objectives: [
      "Relate wavelength, frequency, and wave speed (v = fλ), and distinguish transverse from longitudinal waves",
      "Explain the Doppler effect and describe resonance in standing waves",
      "Apply Snell's law to predict how light refracts at a boundary between media",
      "Apply the thin lens equation to describe image formation by mirrors and lenses"
    ]
  },
  bigPicture: {
    flow: ["Wave source oscillates", "Wave propagates, carrying energy (v = fλ)", "At a boundary: reflects, refracts, or both", "Interacts with medium (resonance, Doppler shift, lens focusing)"],
    caption: "Every wave phenomenon in this lesson—Doppler shift, resonance, refraction—is really just what happens when a wave's basic relationship (v = fλ) meets a boundary, an obstacle, or a moving source."
  },
  concepts: [
    {
      number: "01",
      id: "wave-properties",
      title: "Wave Properties",
      difficulty: "UNDERSTAND",
      coreIdea: "Wave speed equals frequency times wavelength (v = fλ); transverse waves oscillate perpendicular to their direction of travel, while longitudinal waves oscillate parallel to it.",
      learn: [
        "A wave's speed depends on the medium it travels through, and relates to frequency and wavelength by v = fλ—for a wave moving through a given medium at a fixed speed, frequency and wavelength are inversely related (a higher frequency wave has a shorter wavelength).",
        "In a transverse wave (like light, or a wave on a string), particles oscillate perpendicular to the direction the wave travels; in a longitudinal wave (like sound), particles oscillate parallel to the direction of travel, creating alternating regions of compression and rarefaction."
      ],
      mcatConnection: "v = fλ is one of the most frequently reused equations in the physics section—whenever a problem gives you two of the three variables (speed, frequency, wavelength), this is almost certainly the equation to reach for.",
      quickCheck: {
        prompt: "A wave traveling through a fixed medium has its frequency doubled. What happens to its wavelength, assuming wave speed in that medium stays constant?",
        options: ["It doubles", "It is cut in half", "It stays the same", "It cannot be determined"],
        correctIndex: 1,
        explanation: "Since v = fλ and v is constant (fixed medium), frequency and wavelength are inversely proportional—doubling frequency requires wavelength to be cut in half to keep their product (speed) constant."
      },
      keyTakeaway: "Wave speed, frequency, and wavelength are related by v = fλ; transverse waves oscillate perpendicular to travel direction, while longitudinal waves (like sound) oscillate parallel to it."
    },
    {
      number: "02",
      id: "sound-waves-doppler-resonance",
      title: "Sound Waves: Doppler Effect and Resonance",
      difficulty: "REASON",
      coreIdea: "The Doppler effect shifts a wave's observed frequency when the source and observer are in relative motion (higher frequency when approaching, lower when receding); resonance occurs when a system is driven at its natural frequency, producing standing waves of large amplitude.",
      learn: [
        "The Doppler effect describes how observed frequency differs from emitted frequency when a source and observer are moving relative to each other: frequency appears higher when the source and observer are approaching each other, and lower when they're moving apart—the effect arises because relative motion effectively compresses or stretches the wavelength reaching the observer.",
        "Resonance occurs when a system is driven at one of its natural frequencies, producing a standing wave with much larger amplitude than at other driving frequencies; standing waves in a fixed-length system (like a string or a column of air) only form at specific frequencies determined by the boundary conditions at each end."
      ],
      mcatConnection: "The Doppler effect direction rule is easy to keep straight with a quick sanity check: think of an ambulance siren sounding higher-pitched as it approaches and lower-pitched as it moves away—the same logic applies to any source/observer combination.",
      quickCheck: {
        prompt: "A sound source moves toward a stationary observer. Compared to the frequency the source actually emits, what frequency does the observer hear?",
        options: ["A lower frequency than emitted", "The same frequency as emitted", "A higher frequency than emitted", "No sound is heard until the source stops moving"],
        correctIndex: 2,
        explanation: "When a source moves toward an observer, successive wave crests are emitted from progressively closer positions, effectively compressing the wavelength reaching the observer—a shorter wavelength (at the same wave speed) corresponds to a higher observed frequency, which is the Doppler effect."
      },
      keyTakeaway: "The Doppler effect raises observed frequency when source and observer approach each other and lowers it when they separate; resonance occurs when a system is driven at a natural frequency, producing large-amplitude standing waves."
    },
    {
      number: "03",
      id: "light-optics",
      title: "Light and Optics",
      difficulty: "IDENTIFY",
      coreIdea: "Snell's law (n1 sin θ1 = n2 sin θ2) governs refraction at a boundary between media; the thin lens equation (1/f = 1/do + 1/di) relates focal length to object and image distance for mirrors and lenses.",
      learn: [
        "Refraction occurs when light passes between media with different indices of refraction (n), bending toward the normal when entering a higher-index (slower-light) medium and away from the normal when entering a lower-index (faster-light) medium, following Snell's law: n1 sin θ1 = n2 sin θ2.",
        "The thin lens equation, 1/f = 1/do + 1/di, relates a lens's (or mirror's) focal length (f) to the object distance (do) and image distance (di)—together with sign conventions (real vs. virtual image, converging vs. diverging lens), it predicts where an image forms and whether it's magnified, reduced, upright, or inverted."
      ],
      mcatConnection: "Snell's law problems usually reduce to comparing relative index of refraction: light bends toward the normal when slowing down (entering a higher-index medium) and away from the normal when speeding up (entering a lower-index medium)—reasoning through that direction is often faster than solving the full equation.",
      quickCheck: {
        prompt: "Light travels from air (lower index of refraction) into glass (higher index of refraction), striking the surface at an angle. How does the light ray bend as it enters the glass?",
        options: ["It bends away from the normal", "It bends toward the normal", "It does not bend at all", "It reflects entirely back into the air"],
        correctIndex: 1,
        explanation: "Entering a medium with a higher index of refraction (glass) means the light slows down, and by Snell's law, this causes the ray to bend toward the normal (the angle in the glass is smaller than the angle in air)—bending away from the normal would instead occur going from a higher-index to a lower-index medium."
      },
      keyTakeaway: "Snell's law (n1 sin θ1 = n2 sin θ2) governs how light bends at a boundary, toward the normal when slowing down and away when speeding up; the thin lens equation (1/f = 1/do + 1/di) predicts image location for mirrors and lenses."
    }
  ]
};
