// Document-lesson content for "Biomolecules" (lib/mcatPath.ts's biomolecules
// LessonContent entry)—every fact, term, and practice-question scenario
// below is restructured from that same real entry, not invented fresh. See
// lib/documentLesson.ts for the shared shape and lib/documentLessons/index.ts
// for the lookup this registers into.
import { DocumentLessonContent } from "../documentLesson";

export const biomoleculesContent: DocumentLessonContent = {
  lessonIntro: {
    description: "Every structure in the body—from a muscle fiber to a strand of DNA—is built from just four classes of biomolecules. Recognizing which class a molecule belongs to, and why its structure suits its job, is the foundation the rest of MCAT biochemistry builds on.",
    objectives: [
      "Name the four major biomolecule classes and their monomer units",
      "Explain why lipids are hydrophobic and what that property is used for",
      "Describe how a peptide bond forms and what determines a protein's shape",
      "Identify the building blocks of a nucleotide"
    ]
  },
  bigPicture: {
    flow: ["Monomer", "Condensation reaction", "Polymer", "3D shape", "Function"],
    caption: "The same pattern repeats across all four classes: small repeating units link together into a large molecule, and for proteins especially, the resulting shape is what determines what the molecule can actually do."
  },
  concepts: [
    {
      number: "01",
      id: "four-biomolecule-classes",
      title: "The Four Major Biomolecule Classes",
      difficulty: "UNDERSTAND",
      coreIdea: "Living things are built from four major classes of biomolecules—carbohydrates, lipids, proteins, and nucleic acids—most of them polymers built from repeating monomer subunits.",
      learn: [
        "Most biomolecules are polymers: large molecules built from repeating monomer subunits linked together, much like beads on a string. The identity of the monomer is what defines the class—a carbohydrate's monomer is a simple sugar, a protein's is an amino acid, a nucleic acid's is a nucleotide.",
        "Lipids are the one major exception: they aren't true polymers of a single repeating monomer, but they're grouped with the other three because they're just as fundamental to how cells are built and powered."
      ],
      flowDiagram: ["Monomer", "Condensation reaction", "Polymer"],
      mcatConnection: "The MCAT rarely asks you to name the four classes directly—it expects you to recognize which class a molecule belongs to from a description of its structure or role buried in a passage, and to know each class's monomer on sight.",
      quickCheck: {
        prompt: "A large biological molecule is described as being built from many repeating nucleotide subunits linked together. Which biomolecule class does it belong to?",
        options: ["Carbohydrate", "Lipid", "Protein", "Nucleic acid"],
        correctIndex: 3,
        explanation: "Nucleotides are the monomer unique to nucleic acids (DNA and RNA)—a molecule built from repeating nucleotides is a nucleic acid by definition, the same way a molecule built from amino acids is a protein."
      },
      keyTakeaway: "All four biomolecule classes are defined by their monomer: monosaccharides for carbohydrates, amino acids for proteins, nucleotides for nucleic acids—lipids are the exception, not a true monomer/polymer system."
    },
    {
      number: "02",
      id: "carbohydrates-and-lipids",
      title: "Carbohydrates and Lipids",
      difficulty: "IDENTIFY",
      coreIdea: "Carbohydrates provide quick energy and structural support; lipids are hydrophobic, which makes them ideal for both long-term energy storage and building cell membranes.",
      learn: [
        "Carbohydrates are built from monosaccharides—single sugar units like glucose—linked into longer polysaccharides. They're the body's fastest-access energy source and, in some organisms, provide structural support.",
        "Lipids—fatty acids, phospholipids, and steroids—are hydrophobic, meaning they don't mix well with water. That single property explains two of their biggest roles: fats pack far more energy per gram than carbohydrates, making them an efficient long-term energy reserve, and phospholipids' hydrophobic tails are exactly what let them self-assemble into the membranes that enclose every cell."
      ],
      mcatConnection: "Passages often describe a molecule's behavior in water (does it dissolve, does it separate out) and expect you to infer hydrophobic vs. hydrophilic character from that behavior alone, then connect it back to structure and function—not just recall the vocabulary.",
      quickCheck: {
        prompt: "Which biomolecule class serves as the primary long-term energy storage molecule in the body?",
        options: ["Proteins", "Nucleic acids", "Lipids", "Monosaccharides"],
        correctIndex: 2,
        explanation: "Lipids pack more energy per gram than any other biomolecule class and are the body's main long-term energy reserve—proteins are primarily structural/functional, nucleic acids store genetic information, and monosaccharides are used for quick, not long-term, energy."
      },
      keyTakeaway: "Carbohydrates provide fast energy; lipids' hydrophobic character makes them both an efficient long-term energy store and the structural basis of every cell membrane."
    },
    {
      number: "03",
      id: "proteins-and-nucleic-acids",
      title: "Proteins and Nucleic Acids",
      difficulty: "INTERPRET",
      coreIdea: "Protein function depends entirely on 3D shape, built up through four levels of structure; nucleic acids are polymers of nucleotides, each made of a sugar, a phosphate, and a nitrogenous base.",
      learn: [
        "Proteins are polymers of amino acids linked by peptide bonds, formed through a condensation (dehydration) reaction that releases a water molecule for every bond made. A protein's function depends on its 3D shape, which builds up through four levels: primary (the linear amino acid sequence), secondary (local folding patterns like alpha helices), tertiary (the overall 3D shape of one polypeptide chain), and quaternary (how multiple separate polypeptide chains assemble together).",
        "Nucleic acids—DNA and RNA—are polymers of nucleotides, each nucleotide built from a sugar, a phosphate group, and a nitrogenous base. Where a protein's monomer sequence determines a 3D shape, a nucleic acid's sequence of bases is what actually encodes genetic information."
      ],
      mcatConnection: "Distinguishing the four levels of protein structure—and recognizing which level a question is describing—is one of the most frequently tested single facts in MCAT biochemistry, often disguised inside a description of a specific real protein.",
      quickCheck: {
        prompt: "Which level of protein structure describes interactions between multiple separate polypeptide subunits assembling together?",
        options: ["Primary", "Secondary", "Tertiary", "Quaternary"],
        correctIndex: 3,
        explanation: "Quaternary structure is specifically about multiple separate polypeptide chains assembling together—primary is just the sequence, secondary is local folding, and tertiary is one chain's overall 3D shape."
      },
      keyTakeaway: "A protein's function comes from its shape, built through primary → secondary → tertiary → (sometimes) quaternary structure; nucleic acids are polymers of nucleotides that encode information through their base sequence rather than a folded shape."
    }
  ]
};
