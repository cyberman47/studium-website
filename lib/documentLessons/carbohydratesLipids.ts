// Document-lesson content for "Carbohydrates & Lipids" (lib/mcatPath.ts's
// carbohydrates-lipids LessonContent entry)—restructured from that same real
// entry. See lib/documentLesson.ts for the shared shape.
import { DocumentLessonContent } from "../documentLesson";

export const carbohydratesLipidsContent: DocumentLessonContent = {
  lessonIntro: {
    description: "Carbohydrates and lipids are the body's two major energy and structural macromolecule classes, and both derive their function from simple structural rules. This lesson covers how sugars link into storage and structural polysaccharides, how fatty acid saturation determines a fat's physical properties, and how lipids build membranes and hormones.",
    objectives: [
      "Explain how glycosidic bonds link monosaccharides into di- and polysaccharides",
      "Distinguish saturated from unsaturated fatty acids by structure and properties",
      "Explain why phospholipids form a bilayer in water",
      "Explain why steroid hormones can bind intracellular receptors"
    ]
  },
  bigPicture: {
    flow: ["Monosaccharide", "Glycosidic bond", "Disaccharide", "Polysaccharide"],
    caption: "Carbohydrate complexity is built the same way protein complexity is—simple units linked by one repeating bond type, with the linkage pattern determining the final molecule's role."
  },
  concepts: [
    {
      number: "01",
      id: "carbohydrate-structure",
      title: "Carbohydrate Structure",
      difficulty: "UNDERSTAND",
      coreIdea: "Monosaccharides link via glycosidic bonds into disaccharides and polysaccharides—starch/glycogen for storage, cellulose for structure.",
      learn: [
        "Monosaccharides (like glucose, fructose, and galactose) are the simplest carbohydrates—single sugar units that serve as the basic building blocks. Two monosaccharides link via a glycosidic bond (a dehydration reaction) to form a disaccharide, such as sucrose (glucose + fructose).",
        "Long chains of monosaccharides form polysaccharides: starch and glycogen store energy in plants and animals respectively (both made of glucose units, differing in branching), while cellulose provides structural support in plant cell walls, using a glycosidic bond orientation that most animal enzymes cannot digest."
      ],
      mcatConnection: "Starch/glycogen vs. cellulose—same monomer (glucose), different bond orientation, wildly different function—is a favorite way to test whether you understand that a molecule's linkage chemistry, not just its building blocks, determines its role.",
      quickCheck: {
        prompt: "Starch and cellulose are both polysaccharides made of glucose units. What accounts for their very different properties (digestible energy storage vs. indigestible structural support)?",
        options: ["Starch contains fructose, cellulose does not", "The orientation of the glycosidic bonds linking glucose units differs between them", "Cellulose contains nitrogen, starch does not", "They are made of entirely different monosaccharides"],
        correctIndex: 1,
        explanation: "The glycosidic bond orientation differs (alpha vs. beta linkages), which most animal digestive enzymes can't break in cellulose's case—both are made of glucose, and neither contains nitrogen."
      },
      keyTakeaway: "Monosaccharides link via glycosidic bonds; the same glucose monomer builds both storage polysaccharides (starch, glycogen) and structural ones (cellulose), depending on bond orientation."
    },
    {
      number: "02",
      id: "lipid-structure-types",
      title: "Lipid Structure and Types",
      difficulty: "IDENTIFY",
      coreIdea: "Saturated fatty acids pack tightly (solid); unsaturated fatty acids have kinks from double bonds (liquid); triglycerides store energy.",
      learn: [
        "Fatty acids are long hydrocarbon chains ending in a carboxyl group; saturated fatty acids have no carbon-carbon double bonds (packing tightly, typically solid at room temperature), while unsaturated fatty acids have one or more double bonds (creating kinks that prevent tight packing, typically liquid at room temperature).",
        "Triglycerides—three fatty acids attached to a glycerol backbone via ester bonds—are the body's main energy-storage lipid. Phospholipids replace one fatty acid with a phosphate-containing head group, giving them an amphipathic structure (hydrophilic head, hydrophobic tails)."
      ],
      mcatConnection: "Saturated vs. unsaturated is tested through physical properties (melting point, room-temperature state) at least as often as through structure diagrams—know the causal chain: double bond → kink → looser packing → lower melting point.",
      quickCheck: {
        prompt: "A fatty acid has three carbon-carbon double bonds in its chain. This fatty acid is best described as:",
        options: ["Saturated", "Monounsaturated", "Polyunsaturated", "Amphipathic"],
        correctIndex: 2,
        explanation: "Polyunsaturated means multiple (more than one) double bonds—saturated fatty acids have zero, monounsaturated exactly one, and amphipathic describes having both hydrophilic and hydrophobic regions, unrelated to double bond count."
      },
      keyTakeaway: "Saturated fatty acids (no double bonds) pack tightly and are solid at room temperature; unsaturated fatty acids (double bonds, kinks) are typically liquid."
    },
    {
      number: "03",
      id: "membranes-steroids",
      title: "Lipids in Membranes and Steroids",
      difficulty: "REASON",
      coreIdea: "Phospholipids' amphipathic structure builds the membrane bilayer; steroid hormones' hydrophobicity lets them cross membranes and bind intracellular receptors.",
      learn: [
        "Phospholipids' amphipathic structure lets them spontaneously form the bilayer that makes up the plasma membrane, with hydrophilic heads facing the watery environment on both sides and hydrophobic tails hidden inside. Cholesterol, a steroid lipid built from four fused carbon rings, is embedded in animal cell membranes, where it modulates membrane fluidity.",
        "Steroid hormones—like testosterone, estrogen, and cortisol—share this same four-ring core and, unlike protein hormones, are hydrophobic enough to diffuse directly through the plasma membrane and bind receptors inside the cell."
      ],
      mcatConnection: "Steroid vs. protein hormone mechanism (intracellular receptor + direct membrane diffusion vs. surface receptor + signal transduction cascade) is a direct, frequently tested contrast connecting this lesson to cell signaling.",
      quickCheck: {
        prompt: "Cortisol, a steroid hormone, is able to bind a receptor inside the target cell rather than on the cell surface because:",
        options: ["It is too large to be recognized by surface receptors", "It is hydrophobic and can diffuse directly through the plasma membrane", "It is actively transported across the membrane by a pump", "It binds only to receptors on the nuclear membrane, never entering the cytoplasm"],
        correctIndex: 1,
        explanation: "As a hydrophobic steroid, cortisol diffuses directly through the phospholipid bilayer to reach intracellular receptors—size isn't the limiting factor, and steroid hormones typically cross by simple diffusion, not active transport."
      },
      keyTakeaway: "Phospholipids' amphipathic structure drives spontaneous bilayer formation; steroid hormones share lipids' hydrophobicity, letting them diffuse through membranes to intracellular receptors."
    }
  ]
};
