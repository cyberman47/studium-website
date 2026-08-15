// Document-lesson content for "Cell Structure" (lib/mcatPath.ts's
// cell-structure LessonContent entry)—restructured from that same real
// entry. See lib/documentLesson.ts for the shared shape.
import { DocumentLessonContent } from "../documentLesson";

export const cellStructureContent: DocumentLessonContent = {
  lessonIntro: {
    description: "Every cell is a tiny, organized factory. This lesson maps that factory floor: the difference between prokaryotic and eukaryotic cells, what each major organelle actually does, and how the plasma membrane controls what gets in and out.",
    objectives: [
      "Distinguish prokaryotic from eukaryotic cells",
      "Match each major organelle to its real function",
      "Explain the fluid mosaic model of the plasma membrane",
      "Explain what \"selective permeability\" actually means"
    ]
  },
  bigPicture: {
    flow: ["Nucleus (control)", "Ribosome (build)", "ER (process)", "Golgi (ship)", "Lysosome (clean up)"],
    caption: "Picture the cell as a small factory: each organelle is a department with one real job, and materials move between them in roughly this order on their way to being finished and either used or exported."
  },
  concepts: [
    {
      number: "01",
      id: "prokaryotic-vs-eukaryotic",
      title: "Prokaryotic vs. Eukaryotic Cells",
      difficulty: "UNDERSTAND",
      coreIdea: "Prokaryotic cells lack a true nucleus and membrane-bound organelles; eukaryotic cells have both, and are generally larger and more complex as a result.",
      learn: [
        "Prokaryotic cells—bacteria and archaea—lack a true, membrane-bound nucleus. Their DNA instead sits in an open region of the cytoplasm called the nucleoid, with no membrane separating it from everything else in the cell.",
        "Eukaryotic cells—animals, plants, fungi, and protists—have a membrane-bound nucleus and specialized, membrane-bound organelles. That compartmentalization is what allows eukaryotic cells to be larger and carry out more specialized functions than prokaryotic cells can."
      ],
      mcatConnection: "This distinction shows up constantly as a quick filter inside microbiology and cell biology passages—recognizing \"no nucleus\" as shorthand for prokaryote (and therefore bacterium or archaeon) is often the fastest way into a question.",
      quickCheck: {
        prompt: "Which structure is found in prokaryotic cells, without an equivalent membrane-bound version in eukaryotes?",
        options: ["Nucleoid region", "Ribosomes", "Plasma membrane", "Cytoplasm"],
        correctIndex: 0,
        explanation: "The nucleoid is the unbound DNA region unique to prokaryotes—eukaryotes have a membrane-bound nucleus instead. Ribosomes, the plasma membrane, and cytoplasm are present in both cell types."
      },
      keyTakeaway: "The defining difference is compartmentalization: eukaryotes wall their DNA (and other functions) off into membrane-bound structures; prokaryotes don't."
    },
    {
      number: "02",
      id: "key-organelles",
      title: "Key Organelles and Their Functions",
      difficulty: "IDENTIFY",
      coreIdea: "Each major organelle has one real, specific job—treating the cell as a small factory with distinct departments makes those jobs easy to keep straight.",
      learn: [
        "The nucleus houses and protects DNA. Mitochondria generate ATP through cellular respiration, which is why they're often called the \"powerhouse of the cell.\" Ribosomes synthesize proteins, and can either float freely in the cytoplasm or attach to the endoplasmic reticulum.",
        "The rough endoplasmic reticulum—studded with ribosomes, which is where its name comes from—processes and folds proteins; the smooth ER, without ribosomes, synthesizes lipids instead. The Golgi apparatus modifies, sorts, and packages proteins and lipids for transport, and lysosomes contain enzymes that break down waste and damaged cellular debris."
      ],
      mcatConnection: "Organelle-function questions are some of the most directly testable facts on the exam—the exam rewards being able to instantly match a described function (\"produces ATP,\" \"studded with ribosomes\") back to the correct organelle name.",
      quickCheck: {
        prompt: "Rough ER differs from smooth ER in that rough ER:",
        options: ["Synthesizes lipids", "Is studded with ribosomes and processes proteins", "Breaks down cellular waste", "Produces ATP"],
        correctIndex: 1,
        explanation: "Ribosomes studding the rough ER give it its name and its protein-processing role. Lipid synthesis is the smooth ER's job, waste breakdown is the lysosome's, and ATP production happens in mitochondria."
      },
      keyTakeaway: "Nucleus = control room, mitochondria = power plant, ribosomes = assembly line, ER = processing floor, Golgi = shipping, lysosomes = clean-up crew."
    },
    {
      number: "03",
      id: "plasma-membrane",
      title: "The Plasma Membrane",
      difficulty: "INTERPRET",
      coreIdea: "The plasma membrane is a flexible, selectively permeable bilayer of phospholipids embedded with mobile proteins—the fluid mosaic model.",
      learn: [
        "The fluid mosaic model describes the plasma membrane as a flexible bilayer of phospholipids embedded with proteins that can drift laterally within the layer, rather than a rigid, fixed structure. \"Fluid\" refers to that lateral movement; \"mosaic\" refers to the scattered arrangement of different embedded proteins.",
        "The membrane is selectively permeable: it controls which substances can cross into or out of the cell, rather than letting everything through equally or blocking everything entirely. That selectivity is what lets a cell maintain an internal environment different from its surroundings."
      ],
      mcatConnection: "Membrane transport questions build directly on this model—before reasoning about how a specific molecule crosses the membrane (diffusion, a channel, active transport), you need this baseline: the membrane is fluid, embedded with mobile proteins, and selective, not a static wall.",
      quickCheck: {
        prompt: "The plasma membrane's selective permeability means:",
        options: ["It allows all molecules through equally", "It controls which substances enter and exit the cell", "It is completely impermeable", "It only allows water through"],
        correctIndex: 1,
        explanation: "Selective permeability means the membrane regulates which substances pass through—not that it treats every molecule the same, blocks everything, or restricts passage to water alone."
      },
      keyTakeaway: "The plasma membrane is a fluid, selectively permeable bilayer of phospholipids with mobile embedded proteins—not a rigid, uniformly permeable wall."
    }
  ]
};
