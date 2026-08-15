// Document-lesson content for "Cell Communication & Signaling"
// (lib/mcatPath.ts's cell-communication-signaling LessonContent entry)—
// restructured from that same real entry. See lib/documentLesson.ts for the
// shared shape.
import { DocumentLessonContent } from "../documentLesson";

export const cellCommunicationSignalingContent: DocumentLessonContent = {
  lessonIntro: {
    description: "Cells coordinate with each other constantly—sometimes whispering to a neighbor, sometimes broadcasting through the bloodstream. This lesson covers the different ranges of cell signaling, the two major receptor mechanisms that receive those signals, and why a tiny signal can produce a large cellular response.",
    objectives: [
      "Distinguish autocrine, paracrine, endocrine, and direct-contact signaling",
      "Explain how GPCRs and receptor tyrosine kinases transduce a signal",
      "Define second messenger and give an example",
      "Explain why signaling pathways amplify rather than just relay a signal"
    ]
  },
  bigPicture: {
    flow: ["Ligand binds receptor", "Signal transduction", "Second messenger / cascade", "Cellular response"],
    caption: "Every signaling pathway follows the same shape: a signal outside the cell is picked up by a receptor, converted into an internal signal, and amplified into a response—only the range and the receptor type change."
  },
  concepts: [
    {
      number: "01",
      id: "types-of-cell-signaling",
      title: "Types of Cell Signaling",
      difficulty: "UNDERSTAND",
      coreIdea: "Cells signal at different ranges—autocrine (self), paracrine (nearby), endocrine (distant, via blood), and direct contact (no diffusible signal at all).",
      learn: [
        "Cells communicate using signaling molecules that travel different distances. In autocrine signaling, a cell releases a signal that acts on itself. In paracrine signaling, a cell releases a signal that acts on nearby cells, diffusing only a short distance.",
        "In endocrine signaling, specialized cells release hormones into the bloodstream that travel throughout the body to reach distant target cells. Direct contact signaling occurs when adjacent cells communicate through gap junctions or by binding surface molecules directly, without a diffusible signal at all."
      ],
      mcatConnection: "The exam tests whether you can correctly classify a described scenario—the key clue is always distance and route: self (autocrine), short diffusion (paracrine), bloodstream (endocrine), or direct membrane contact (direct/gap junction).",
      quickCheck: {
        prompt: "A hormone released by the pancreas travels through the blood to act on liver cells far away. This is an example of:",
        options: ["Autocrine signaling", "Paracrine signaling", "Endocrine signaling", "Direct contact signaling"],
        correctIndex: 2,
        explanation: "Travel through the bloodstream to a distant target is the definition of endocrine signaling—autocrine means self-signaling, paracrine acts only on nearby cells, and no direct contact is described here."
      },
      keyTakeaway: "Signaling ranges from self (autocrine) to nearby (paracrine) to distant via bloodstream (endocrine) to no diffusion at all (direct contact/gap junctions)."
    },
    {
      number: "02",
      id: "receptors-signal-transduction",
      title: "Receptors and Signal Transduction",
      difficulty: "IDENTIFY",
      coreIdea: "GPCRs activate a G-protein and second messenger like cAMP; receptor tyrosine kinases dimerize and phosphorylate each other to start a cascade.",
      learn: [
        "A signaling molecule (ligand) only affects cells that have the matching receptor. G-protein coupled receptors (GPCRs) span the membrane and, when activated, trigger an internal G-protein that activates an enzyme producing a second messenger, such as cyclic AMP (cAMP), which then relays and amplifies the signal inside the cell.",
        "Receptor tyrosine kinases (RTKs) are a different receptor class: ligand binding causes two receptors to pair up (dimerize) and add phosphate groups to each other, kicking off a phosphorylation cascade that relays the signal onward."
      ],
      mcatConnection: "GPCR vs. RTK is a reliably tested contrast—GPCRs work through G-proteins and second messengers like cAMP, while RTKs work through dimerization and self-phosphorylation. Mixing up which mechanism belongs to which receptor is the most common error here.",
      quickCheck: {
        prompt: "A GPCR is activated by its ligand and triggers a rise in intracellular cAMP. What is cAMP acting as?",
        options: ["The original ligand", "A second messenger", "A receptor tyrosine kinase", "A gap junction protein"],
        correctIndex: 1,
        explanation: "cAMP is a classic second messenger that relays and amplifies the signal inside the cell—it is not the ligand itself, a receptor, or a gap junction protein."
      },
      keyTakeaway: "GPCRs signal through G-proteins and second messengers like cAMP; RTKs signal by dimerizing and phosphorylating each other to start a cascade."
    },
    {
      number: "03",
      id: "signal-amplification",
      title: "Signal Amplification and Response",
      difficulty: "REASON",
      coreIdea: "Each step in a signaling cascade can activate multiple downstream molecules, so a small extracellular signal produces a large, controlled intracellular response.",
      learn: [
        "A key feature of signal transduction pathways is amplification: one activated receptor can activate many G-proteins, each of which can generate many second messenger molecules, so a tiny number of hormone molecules outside the cell can produce a large response inside it.",
        "The pathway ultimately alters the target cell's behavior—turning genes on or off, opening ion channels, or activating metabolic enzymes—and is shut off through mechanisms like receptor internalization or second-messenger degradation, so the response doesn't run indefinitely."
      ],
      mcatConnection: "Passages often ask why a hormone present in tiny (even picomolar) concentrations can still produce a measurable physiological effect—the answer is always cascading amplification, not a large amount of hormone.",
      quickCheck: {
        prompt: "Which best explains why a very low concentration of a hormone can still produce a large cellular response?",
        options: ["Hormones are always present in high concentration", "Each activation step in the signaling cascade can activate multiple downstream molecules, amplifying the signal", "The hormone directly enters the nucleus and acts alone", "Second messengers block the receptor"],
        correctIndex: 1,
        explanation: "Cascading activation at each step multiplies the effect of the original signal—most hormones act via surface receptors, not by entering the nucleus directly, and the premise here is a low, not high, concentration."
      },
      keyTakeaway: "Signal transduction pathways amplify a small extracellular signal into a large, precisely controlled and eventually self-limiting intracellular response."
    }
  ]
};
