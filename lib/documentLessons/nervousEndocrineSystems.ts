// Document-lesson content for "Nervous & Endocrine Systems"
// (lib/mcatPath.ts's nervous-endocrine-systems LessonContent entry)—
// restructured from that same real entry. See lib/documentLesson.ts for the
// shared shape.
import { DocumentLessonContent } from "../documentLesson";

export const nervousEndocrineSystemsContent: DocumentLessonContent = {
  lessonIntro: {
    description: "The body has two communication systems built for different speeds: the nervous system's fast, wired electrical signals and the endocrine system's slower, body-wide chemical broadcasts. This lesson covers how a neuron fires and passes its signal on, then how hormones regulate the body through feedback.",
    objectives: [
      "Explain the action potential's all-or-none principle",
      "Describe synaptic transmission and EPSPs vs. IPSPs",
      "Distinguish peptide from steroid hormone signaling",
      "Explain negative feedback using the HPA axis"
    ]
  },
  bigPicture: {
    flow: ["Threshold reached", "Na+ in (depolarize)", "K+ out (repolarize)", "Signal reaches synapse"],
    caption: "An action potential is a single, standardized electrical pulse—it either fires at full strength or doesn't fire at all, with no in-between."
  },
  concepts: [
    {
      number: "01",
      id: "action-potential",
      title: "Neuron Structure and the Action Potential",
      difficulty: "UNDERSTAND",
      coreIdea: "Once a stimulus depolarizes the membrane past threshold, voltage-gated Na+ then K+ channels fire an all-or-none action potential.",
      learn: [
        "A neuron at rest maintains a resting membrane potential of about -70mV, maintained largely by the sodium-potassium pump and leak channels. When a stimulus depolarizes the membrane past a threshold (around -55mV), voltage-gated sodium channels open, Na+ rushes in, and the membrane rapidly depolarizes.",
        "Voltage-gated potassium channels then open and K+ rushes out, repolarizing the membrane. This all-or-none action potential either fires completely or not at all—there's no partial action potential—and travels down the axon to the axon terminal."
      ],
      mcatConnection: "The all-or-none principle is frequently tested by asking what happens with a stimulus below threshold (nothing) versus well above threshold (the same-sized action potential, not a bigger one)—stimulus intensity is instead encoded by firing frequency, not action potential size.",
      quickCheck: {
        prompt: "What does 'all-or-none' mean regarding an action potential?",
        options: ["Stronger stimuli produce larger action potentials", "Once threshold is reached, the action potential fires completely and at the same magnitude every time", "Action potentials only occur in sensory neurons", "Weak stimuli produce smaller, partial action potentials"],
        correctIndex: 1,
        explanation: "Once a stimulus depolarizes the membrane past threshold, the action potential fires completely and with the same magnitude every time, regardless of how much the stimulus exceeds threshold—there's no such thing as a partial action potential."
      },
      keyTakeaway: "The action potential is all-or-none: threshold triggers Na+ influx (depolarization) then K+ efflux (repolarization), always at the same magnitude."
    },
    {
      number: "02",
      id: "synaptic-transmission",
      title: "Synaptic Transmission",
      difficulty: "IDENTIFY",
      coreIdea: "Ca2+ influx triggers neurotransmitter release at the synapse, producing EPSPs (excitatory) or IPSPs (inhibitory) that sum to determine firing.",
      learn: [
        "When an action potential reaches the axon terminal, voltage-gated calcium channels open, and Ca2+ influx triggers synaptic vesicles to fuse with the membrane and release neurotransmitter into the synaptic cleft. The neurotransmitter diffuses across and binds receptors on the postsynaptic neuron.",
        "This produces either an excitatory postsynaptic potential (EPSP, depolarizing, makes firing more likely) or an inhibitory postsynaptic potential (IPSP, hyperpolarizing, makes firing less likely). Whether the postsynaptic neuron fires depends on the sum of all EPSPs and IPSPs it receives (summation)."
      ],
      mcatConnection: "Remember that the same neurotransmitter can be excitatory or inhibitory depending on the receptor it binds—it's the receptor and resulting ion flow, not the neurotransmitter itself, that determines EPSP vs. IPSP.",
      quickCheck: {
        prompt: "A neurotransmitter binds a postsynaptic receptor and causes hyperpolarization of the postsynaptic membrane. This is an example of:",
        options: ["An EPSP, making the neuron more likely to fire", "An IPSP, making the neuron less likely to fire", "An action potential in the presynaptic neuron", "A resting membrane potential"],
        correctIndex: 1,
        explanation: "Hyperpolarization moves the membrane further from threshold, defining an inhibitory postsynaptic potential (IPSP)—an EPSP would depolarize the membrane instead, making firing more, not less, likely."
      },
      keyTakeaway: "Ca2+ influx triggers neurotransmitter release; the resulting EPSPs and IPSPs sum together to determine whether the postsynaptic neuron reaches threshold and fires."
    },
    {
      number: "03",
      id: "endocrine-basics",
      title: "Endocrine System Basics",
      difficulty: "REASON",
      coreIdea: "Peptide hormones bind surface receptors; steroid hormones diffuse to intracellular receptors—both are typically regulated by negative feedback loops.",
      learn: [
        "The endocrine system uses hormones for slower, longer-lasting, body-wide communication, in contrast to the nervous system's fast, localized signaling. Peptide hormones (e.g., insulin) are water-soluble and bind surface receptors, triggering second-messenger cascades; steroid hormones (e.g., cortisol) are lipid-soluble and diffuse through the membrane to bind intracellular receptors.",
        "Most hormone systems are controlled by negative feedback loops—the hypothalamic-pituitary-adrenal (HPA) axis, which regulates cortisol release in response to stress, is a classic example: rising cortisol feeds back to suppress the signals that triggered its own release."
      ],
      mcatConnection: "The HPA axis is the model example for every hormonal feedback loop on the exam—understanding it deeply (hypothalamus → pituitary → target gland → negative feedback to the top) lets you reason through unfamiliar axes (like HPG, covered elsewhere) by the same logic.",
      quickCheck: {
        prompt: "In the HPA axis, what happens as cortisol levels rise?",
        options: ["Cortisol release is further stimulated", "Cortisol feeds back to suppress the signals that triggered its own release", "The hypothalamus is unaffected by cortisol levels", "Cortisol levels rise indefinitely with no regulation"],
        correctIndex: 1,
        explanation: "This is the defining feature of a negative feedback loop: rising cortisol suppresses the upstream hypothalamic and pituitary signals that triggered its release, preventing levels from rising indefinitely."
      },
      keyTakeaway: "Peptide hormones act via surface receptors and second messengers; steroid hormones diffuse to intracellular receptors—both are typically kept in check by negative feedback, as in the HPA axis."
    }
  ]
};
