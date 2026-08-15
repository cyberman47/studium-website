// Document-lesson content for "Cell Membranes & Transport" (lib/mcatPath.ts's
// cell-membranes-transport LessonContent entry)—restructured from that same
// real entry. See lib/documentLesson.ts for the shared shape.
import { DocumentLessonContent } from "../documentLesson";

export const cellMembranesTransportContent: DocumentLessonContent = {
  lessonIntro: {
    description: "The plasma membrane isn't a passive wall—it's a dynamic, selectively permeable structure that decides what gets in and out. This lesson covers the fluid mosaic model, the passive and active transport mechanisms that move substances across it, and how the cell moves things too large to cross directly.",
    objectives: [
      "Describe the fluid mosaic model of the plasma membrane",
      "Distinguish diffusion, osmosis, and facilitated diffusion",
      "Explain why active transport requires ATP",
      "Distinguish endocytosis from exocytosis"
    ]
  },
  bigPicture: {
    flow: ["High concentration", "Passive transport (no energy)", "Low concentration"],
    caption: "Passive transport always flows downhill, from high to low concentration, the same way water flows downhill on its own—active transport is the only kind that pumps uphill, and that's exactly why it costs energy."
  },
  concepts: [
    {
      number: "01",
      id: "fluid-mosaic-model",
      title: "The Fluid Mosaic Model",
      difficulty: "UNDERSTAND",
      coreIdea: "The plasma membrane is a phospholipid bilayer with embedded proteins, cholesterol, and carbohydrates that can drift laterally—a dynamic mosaic, not a fixed wall.",
      learn: [
        "The plasma membrane is described by the fluid mosaic model: a phospholipid bilayer, with hydrophilic (water-loving) heads facing outward toward the watery environments on both sides and hydrophobic (water-fearing) tails facing inward, away from water.",
        "Proteins, cholesterol, and carbohydrates are embedded throughout this bilayer, forming a shifting, fluid mosaic rather than a fixed structure—components can drift laterally within the membrane's plane."
      ],
      mcatConnection: "Expect 'fluid mosaic' terminology tested directly, often by asking you to identify what makes the membrane 'fluid' (lateral protein/lipid movement) versus what makes it a 'mosaic' (the variety of embedded components).",
      quickCheck: {
        prompt: "Which best describes why the plasma membrane is called a 'fluid mosaic'?",
        options: ["It is a rigid, fixed structure of only lipids", "It is composed of a variety of embedded components that can move laterally within the bilayer", "It only allows water to pass through", "It is made entirely of proteins"],
        correctIndex: 1,
        explanation: "\"Mosaic\" refers to the mix of embedded proteins, cholesterol, and carbohydrates, and \"fluid\" refers to their lateral mobility—the membrane is dynamic and selectively permeable, not a rigid, lipid-only, or protein-only wall."
      },
      keyTakeaway: "The membrane is a phospholipid bilayer (hydrophilic heads out, hydrophobic tails in) with embedded proteins and other components that can move laterally—fluid and mosaic at once."
    },
    {
      number: "02",
      id: "passive-transport",
      title: "Passive Transport",
      difficulty: "IDENTIFY",
      coreIdea: "Diffusion, osmosis, and facilitated diffusion all move substances down their concentration gradient without using cellular energy.",
      learn: [
        "Passive transport moves substances across the membrane without using cellular energy, always down a concentration gradient (from high to low concentration). Simple diffusion lets small, nonpolar molecules like O2 and CO2 pass directly through the lipid bilayer. Osmosis is the diffusion of water specifically, moving toward the side with higher solute concentration.",
        "Facilitated diffusion uses membrane channel or carrier proteins to help larger or charged molecules—like glucose or ions—cross, still moving down their gradient and still requiring no energy."
      ],
      mcatConnection: "A classic trap is assuming any transport that uses a protein must be active—facilitated diffusion uses a protein but is still passive, since it moves down the gradient and uses no ATP. The direction of movement, not protein involvement, is what determines passive vs. active.",
      quickCheck: {
        prompt: "Glucose transport into most cells requires a carrier protein even though it moves down its concentration gradient. This is an example of:",
        options: ["Active transport", "Facilitated diffusion", "Simple diffusion", "Exocytosis"],
        correctIndex: 1,
        explanation: "A carrier protein assisting movement down the gradient, with no energy used, is facilitated diffusion—active transport requires energy and moves against the gradient, and glucose is too polar for simple diffusion."
      },
      keyTakeaway: "Passive transport always moves down the concentration gradient and never uses energy—whether it's simple diffusion, osmosis (water), or facilitated diffusion (protein-assisted)."
    },
    {
      number: "03",
      id: "active-bulk-transport",
      title: "Active Transport & Bulk Transport",
      difficulty: "REASON",
      coreIdea: "Active transport moves substances against their gradient using ATP; bulk transport (endocytosis/exocytosis) moves large material via vesicles.",
      learn: [
        "Active transport moves substances against their concentration gradient—from low to high concentration—which requires energy, usually from ATP. The sodium-potassium pump is a classic example, using ATP to move Na+ out of the cell and K+ in, both against their gradients.",
        "For particles too large to cross the membrane directly, cells use bulk transport: endocytosis brings material into the cell by engulfing it in a vesicle formed from the plasma membrane, and exocytosis releases material out of the cell by fusing a vesicle with the plasma membrane."
      ],
      mcatConnection: "The sodium-potassium pump is worth memorizing exactly (3 Na+ out, 2 K+ in, per ATP hydrolyzed)—it's foundational to neuron resting potential, tested constantly in both cell biology and physiology passages.",
      quickCheck: {
        prompt: "The sodium-potassium pump moves 3 Na+ out and 2 K+ in per cycle, both against their gradients. What must be true for this to occur?",
        options: ["The process requires no energy input", "ATP must be hydrolyzed to power the pump", "Both ions are moving down their gradients", "The membrane must be freely permeable to both ions"],
        correctIndex: 1,
        explanation: "Moving ions against their gradients is energetically unfavorable and requires ATP hydrolysis—by definition, active transport moves ions against, not down, their gradients."
      },
      keyTakeaway: "Active transport (like the Na+/K+ pump) moves substances against their gradient using ATP; bulk transport moves large material across the membrane entirely via vesicles, not through channels."
    }
  ]
};
