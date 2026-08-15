// Document-lesson content for "Cell Structure & Organelles" (lib/mcatPath.ts's
// cell-structure-organelles LessonContent entry)—restructured from that same
// real entry. See lib/documentLesson.ts for the shared shape.
import { DocumentLessonContent } from "../documentLesson";

export const cellStructureOrganellesContent: DocumentLessonContent = {
  lessonIntro: {
    description: "Every living cell is either prokaryotic or eukaryotic—a distinction that shapes everything else about how it's organized. This lesson covers that split, the endomembrane system that acts as a eukaryotic cell's production line, and the two organelles (mitochondria, cytoskeleton) responsible for power and shape.",
    objectives: [
      "Distinguish prokaryotic from eukaryotic cells",
      "Trace a secreted protein's path through the endomembrane system",
      "Explain the evidence behind the endosymbiotic theory",
      "Name the cytoskeleton's three filament types and their roles"
    ]
  },
  bigPicture: {
    flow: ["Nucleus (DNA)", "Rough ER (build/fold protein)", "Golgi (modify/sort)", "Vesicle (deliver)"],
    caption: "A eukaryotic cell works like a small factory—the nucleus is the head office, and the endomembrane system is the assembly line that builds, finishes, and ships proteins to their destination."
  },
  concepts: [
    {
      number: "01",
      id: "prokaryotic-vs-eukaryotic",
      title: "Prokaryotic vs. Eukaryotic Cells",
      difficulty: "UNDERSTAND",
      coreIdea: "Prokaryotic cells (bacteria, archaea) have no nucleus or membrane-bound organelles; eukaryotic cells have both.",
      learn: [
        "Every living cell falls into one of two categories. Prokaryotic cells—bacteria and archaea—have no nucleus and no membrane-bound organelles; their single circular chromosome sits free in the cytoplasm, in a region called the nucleoid.",
        "Eukaryotic cells—found in animals, plants, fungi, and protists—are larger, more compartmentalized, and keep their DNA enclosed in a true, membrane-bound nucleus, with additional membrane-bound organelles dividing the cytoplasm into specialized workspaces."
      ],
      mcatConnection: "This distinction underlies why antibiotics can target bacterial (prokaryotic) structures—like the cell wall or 70S ribosomes—without harming human (eukaryotic) cells, which lack those structures or have different versions.",
      quickCheck: {
        prompt: "Which feature is present in eukaryotic cells but absent in prokaryotic cells?",
        options: ["Ribosomes", "A membrane-bound nucleus", "A plasma membrane", "Cytoplasm"],
        correctIndex: 1,
        explanation: "Only eukaryotic cells enclose their DNA in a membrane-bound nucleus. Ribosomes, a plasma membrane, and cytoplasm are present in both cell types."
      },
      keyTakeaway: "Prokaryotic cells lack a nucleus and membrane-bound organelles; eukaryotic cells have both, with DNA free in the nucleoid versus enclosed in a nucleus."
    },
    {
      number: "02",
      id: "endomembrane-system",
      title: "The Endomembrane System",
      difficulty: "IDENTIFY",
      coreIdea: "The nucleus, ER, Golgi apparatus, lysosomes, and vesicles form a connected production line for building, modifying, and sorting proteins.",
      learn: [
        "Rough ER (studded with ribosomes) synthesizes and folds proteins destined for secretion or membranes; smooth ER synthesizes lipids and detoxifies drugs. The Golgi apparatus receives proteins from the ER, modifies them further, and packages them into vesicles addressed for their final destination.",
        "Lysosomes—membrane-bound sacs of digestive enzymes—break down waste, worn-out organelles, and material taken in from outside the cell."
      ],
      flowDiagram: ["Rough ER (synthesize/fold)", "Golgi (modify/sort)", "Vesicle (package)", "Secretion or membrane"],
      mcatConnection: "The exam frequently asks you to trace a secreted protein's route through this pipeline in order—rough ER, then Golgi, then a secretory vesicle—so having that sequence automatic saves time on passage-based questions.",
      quickCheck: {
        prompt: "A protein destined for secretion outside the cell is synthesized on the rough ER. What is the correct order of organelles it passes through?",
        options: ["Golgi → rough ER → vesicle", "Rough ER → Golgi → secretory vesicle", "Lysosome → rough ER → Golgi", "Rough ER → lysosome → Golgi"],
        correctIndex: 1,
        explanation: "Proteins are made and folded in the rough ER, modified and sorted in the Golgi, then packaged into a secretory vesicle—lysosomes digest material and aren't part of this secretory order."
      },
      keyTakeaway: "The endomembrane system is a pipeline: rough ER builds and folds proteins, the Golgi modifies and sorts them, and lysosomes digest waste and damaged material."
    },
    {
      number: "03",
      id: "mitochondria-cytoskeleton",
      title: "Mitochondria and the Cytoskeleton",
      difficulty: "REASON",
      coreIdea: "Mitochondria's own DNA and double membrane support the endosymbiotic theory; the cytoskeleton gives the cell shape, support, and movement.",
      learn: [
        "Mitochondria generate the cell's ATP through aerobic respiration and are unusual among organelles in having their own circular DNA and double membrane—strong evidence they originated as free-living bacteria engulfed by an ancestral cell (the endosymbiotic theory).",
        "The cytoskeleton, a dynamic internal scaffold of microtubules, microfilaments, and intermediate filaments, gives the cell its shape, anchors organelles in place, and drives movement, from muscle contraction to the beating of cilia and flagella."
      ],
      mcatConnection: "Endosymbiotic-theory evidence (double membrane, own circular DNA, own ribosomes, binary-fission-like division) is a favorite standalone fact pattern—expect a passage to present one or two of these clues and ask what theory they support.",
      quickCheck: {
        prompt: "Which observation about mitochondria most directly supports the endosymbiotic theory?",
        options: ["They produce ATP", "They have their own circular DNA and a double membrane", "They are found in most eukaryotic cells", "They are larger than ribosomes"],
        correctIndex: 1,
        explanation: "Circular DNA and a double membrane are hallmarks of a formerly free-living prokaryote—ATP production, prevalence, and relative size don't speak to evolutionary origin."
      },
      keyTakeaway: "Mitochondria's own circular DNA and double membrane point to a bacterial origin; the cytoskeleton's three filament types give the cell shape, structural support, and the machinery for movement."
    }
  ]
};
