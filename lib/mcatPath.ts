// ---- Structure ----

export type LessonSummary = { id: string; title: string };

export type SubjectDef = {
  id: string;
  name: string;
  lessons: LessonSummary[]; // empty = content not written yet ("coming soon")
};

export type SectionDef = {
  id: string;
  title: string;
  shortTitle: string;
  subjects: SubjectDef[];
};

export const mcatSections: SectionDef[] = [
  {
    id: "bio-biochem",
    title: "Biological & Biochemical Foundations of Living Systems",
    shortTitle: "Biological & Biochemical Foundations",
    subjects: [
      {
        id: "biology",
        name: "Biology",
        lessons: [
          { id: "scientific-method", title: "Scientific Method" },
          { id: "biomolecules", title: "Biomolecules" },
          { id: "cell-structure", title: "Cell Structure" },
          { id: "cell-division", title: "Cell Division" },
          { id: "dna", title: "DNA" },
          { id: "rna", title: "RNA" },
          { id: "protein-synthesis", title: "Protein Synthesis" },
          { id: "evolution", title: "Evolution" },
          { id: "ecology", title: "Ecology" }
        ]
      },
      { id: "biochemistry", name: "Biochemistry", lessons: [] },
      { id: "genetics", name: "Genetics", lessons: [] },
      { id: "cell-biology", name: "Cell Biology", lessons: [] },
      { id: "human-physiology", name: "Human Physiology", lessons: [] },
      { id: "molecular-biology", name: "Molecular Biology", lessons: [] },
      { id: "immunology", name: "Immunology", lessons: [] },
      { id: "microbiology", name: "Microbiology", lessons: [] }
    ]
  },
  {
    id: "chem-phys",
    title: "Chemical & Physical Foundations of Biological Systems",
    shortTitle: "Chemical & Physical Foundations",
    subjects: [
      { id: "general-chemistry", name: "General Chemistry", lessons: [] },
      { id: "organic-chemistry", name: "Organic Chemistry", lessons: [] },
      { id: "physics", name: "Physics", lessons: [] },
      { id: "biochemistry-cp", name: "Biochemistry", lessons: [] }
    ]
  },
  {
    id: "psych-social",
    title: "Psychological, Social & Biological Foundations of Behavior",
    shortTitle: "Psychological, Social & Biological Foundations",
    subjects: [
      { id: "psychology", name: "Psychology", lessons: [] },
      { id: "sociology", name: "Sociology", lessons: [] },
      { id: "biological-bases", name: "Biological Bases of Behavior", lessons: [] }
    ]
  },
  {
    id: "cars",
    title: "Critical Analysis & Reasoning Skills",
    shortTitle: "CARS",
    subjects: [
      { id: "humanities-passages", name: "Humanities Passages", lessons: [] },
      { id: "social-science-passages", name: "Social Science Passages", lessons: [] },
      { id: "natural-science-passages", name: "Natural Science Passages", lessons: [] }
    ]
  }
];

export function findSection(sectionId: string): SectionDef | undefined {
  return mcatSections.find(s => s.id === sectionId);
}

export function findSubject(sectionId: string, subjectId: string): SubjectDef | undefined {
  return findSection(sectionId)?.subjects.find(s => s.id === subjectId);
}

// ---- Lesson content ----

export type KeyTerm = { term: string; definition: string };
export type ContentSection = { heading: string; body: string; keyTerms: KeyTerm[] };
export type KnowledgeCheckQuestion = { question: string; answer: string };
export type Flashcard = { front: string; back: string };
export type PracticeQuestion = { question: string; concept: string; options: string[]; correctIndex: number; optionExplanations: string[] };

export type LessonContent = {
  id: string;
  subjectId: string;
  sectionId: string;
  title: string;
  estimatedMinutes: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  sections: ContentSection[];
  keyTakeaways: string[];
  knowledgeCheck: KnowledgeCheckQuestion[];
  flashcards: Flashcard[];
  practiceQuestions: PracticeQuestion[];
  simplifiedExplanation: string;
  prerequisiteLessonId: string | null;
};

const biologyLessons: LessonContent[] = [
  {
    id: "scientific-method",
    subjectId: "biology",
    sectionId: "bio-biochem",
    title: "Scientific Method",
    estimatedMinutes: 25,
    difficulty: "Beginner",
    prerequisiteLessonId: null,
    sections: [
      {
        heading: "What Is the Scientific Method?",
        body: "The scientific method is a cyclical, iterative process for investigating the world: make an observation, ask a question, form a hypothesis, make a prediction, run an experiment, analyze the results, and draw a conclusion. If the results don't support the hypothesis, it's refined and tested again. It isn't a rigid checklist—real research loops back on itself constantly.",
        keyTerms: [
          { term: "Hypothesis", definition: "A testable, falsifiable statement predicting the relationship between variables." },
          { term: "Prediction", definition: "A specific, testable outcome expected if the hypothesis is true." }
        ]
      },
      {
        heading: "Designing a Good Experiment",
        body: "A well-designed experiment isolates one independent variable—the thing the researcher deliberately changes—while holding everything else constant, so any change in the dependent variable can be attributed to it. Control groups provide a baseline for comparison, and techniques like blinding and placebos help prevent bias from affecting the results.",
        keyTerms: [
          { term: "Independent variable", definition: "The variable a researcher deliberately manipulates." },
          { term: "Dependent variable", definition: "The variable that is measured to see how it responds to the independent variable." },
          { term: "Confounding variable", definition: "An uncontrolled factor that could affect the outcome and obscure the true relationship being tested." }
        ]
      },
      {
        heading: "Reading Scientific Data",
        body: "MCAT science-reasoning questions often test whether you can interpret data correctly rather than recall facts. The most common trap is confusing correlation with causation: two variables changing together doesn't mean one causes the other—a third, confounding variable might explain both.",
        keyTerms: [
          { term: "Correlation", definition: "A statistical relationship where two variables tend to change together." },
          { term: "Causation", definition: "A relationship where a change in one variable directly produces a change in another." }
        ]
      }
    ],
    keyTakeaways: [
      "The scientific method is a cyclical, iterative process, not a strict linear checklist.",
      "A good experiment isolates one independent variable while controlling all others.",
      "Correlation between two variables does not, by itself, establish causation."
    ],
    knowledgeCheck: [
      { question: "What is the difference between an independent and a dependent variable?", answer: "The independent variable is manipulated by the researcher; the dependent variable is measured as the outcome." },
      { question: "Why do controlled experiments include a control group?", answer: "To provide a baseline for comparison so the effect of the independent variable can be isolated from other factors." }
    ],
    flashcards: [
      { front: "Hypothesis", back: "A testable, falsifiable statement predicting the relationship between variables." },
      { front: "Independent variable", back: "The variable a researcher deliberately changes or manipulates." },
      { front: "Dependent variable", back: "The variable that is measured to see how it responds to the independent variable." },
      { front: "Control group", back: "A group that does not receive the experimental treatment, used as a baseline." },
      { front: "Correlation vs. causation", back: "Two variables moving together doesn't mean one causes the other—a third factor may explain both." }
    ],
    practiceQuestions: [
      {
        question: "A researcher wants to test whether a new fertilizer increases plant height. Which is the independent variable?",
        concept: "Experimental design",
        options: ["Plant height", "Type of fertilizer used", "Sunlight exposure", "Soil pH"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—plant height is the outcome being measured (the dependent variable).",
          "Correct—the fertilizer is what the researcher deliberately manipulates.",
          "Incorrect—sunlight should be held constant as a controlled variable, not the one being tested.",
          "Incorrect—soil pH should also be controlled, not the variable being manipulated."
        ]
      },
      {
        question: "A study finds that ice cream sales and drowning incidents both rise in summer. What best explains this correlation?",
        concept: "Correlation vs. causation",
        options: ["Ice cream causes drowning", "Drowning causes ice cream sales", "A confounding variable (warm weather) increases both", "The correlation proves causation"],
        correctIndex: 2,
        optionExplanations: [
          "Incorrect—there's no mechanism linking ice cream consumption to drowning.",
          "Incorrect—drowning doesn't cause people to buy ice cream.",
          "Correct—warm weather independently increases both swimming (and drowning risk) and ice cream purchases.",
          "Incorrect—correlation alone never proves causation."
        ]
      },
      {
        question: "Why is a large sample size important in an experiment?",
        concept: "Experimental design",
        options: ["It guarantees the hypothesis is correct", "It reduces the influence of random chance on the results", "It eliminates the need for a control group", "It removes all confounding variables"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—no sample size guarantees a hypothesis is correct.",
          "Correct—larger samples reduce the effect of random variation, making results more reliable.",
          "Incorrect—a control group is still needed regardless of sample size.",
          "Incorrect—sample size doesn't eliminate confounders; careful design does."
        ]
      },
      {
        question: "In a double-blind study, who is unaware of which group (treatment or control) each participant is in?",
        concept: "Experimental design",
        options: ["Only the participants", "Only the researchers", "Both participants and the researchers administering treatment", "Neither party"],
        correctIndex: 2,
        optionExplanations: [
          "Incorrect—single-blind studies keep only participants unaware.",
          "Incorrect—that alone describes a different design.",
          "Correct—double-blind means both participants and administering researchers are unaware, minimizing bias.",
          "Incorrect—someone, such as a separate data analyst, still tracks group assignment."
        ]
      },
      {
        question: "A hypothesis is best described as:",
        concept: "Scientific reasoning",
        options: ["A proven fact", "A random guess with no basis", "A testable, falsifiable statement predicting a relationship", "The final conclusion of an experiment"],
        correctIndex: 2,
        optionExplanations: [
          "Incorrect—a hypothesis isn't proven; it's tested.",
          "Incorrect—it should be grounded in prior observation, not random.",
          "Correct—hypotheses must be testable and falsifiable.",
          "Incorrect—that describes a conclusion, which comes after testing."
        ]
      }
    ],
    simplifiedExplanation: "Think of the scientific method like a loop, not a line: notice something, ask a question, guess an answer (hypothesis), test it fairly, look at the results, then refine your guess and test again. The key skill for exam questions is spotting which variable is being changed (independent) and which one is being measured (dependent), and remembering that two things happening together doesn't mean one caused the other."
  },
  {
    id: "biomolecules",
    subjectId: "biology",
    sectionId: "bio-biochem",
    title: "Biomolecules",
    estimatedMinutes: 30,
    difficulty: "Beginner",
    prerequisiteLessonId: "scientific-method",
    sections: [
      {
        heading: "The Four Major Biomolecule Classes",
        body: "Living things are built from four major classes of biomolecules: carbohydrates, lipids, proteins, and nucleic acids. Most are polymers—large molecules built from repeating monomer subunits linked together, much like beads on a string.",
        keyTerms: [
          { term: "Monomer", definition: "A single repeating subunit that links together to form a polymer." },
          { term: "Polymer", definition: "A large molecule made of many repeating monomer units bonded together." }
        ]
      },
      {
        heading: "Carbohydrates and Lipids",
        body: "Carbohydrates (monosaccharides linked into polysaccharides) provide quick energy and structural support. Lipids—fatty acids, phospholipids, and steroids—are hydrophobic, meaning they don't mix well with water; this property makes phospholipids ideal for forming cell membranes and makes fats an efficient long-term energy store.",
        keyTerms: [
          { term: "Monosaccharide", definition: "A single sugar unit, the monomer of carbohydrates (e.g., glucose)." },
          { term: "Phospholipid", definition: "A lipid with a hydrophilic head and two hydrophobic tails; forms cell membranes." },
          { term: "Hydrophobic", definition: "Repelling or not mixing well with water." }
        ]
      },
      {
        heading: "Proteins and Nucleic Acids",
        body: "Proteins are polymers of amino acids linked by peptide bonds; their function depends entirely on their 3D shape, built up through primary, secondary, tertiary, and sometimes quaternary structure. Nucleic acids (DNA and RNA) are polymers of nucleotides, each made of a sugar, a phosphate group, and a nitrogenous base.",
        keyTerms: [
          { term: "Amino acid", definition: "The monomer of proteins; contains an amino group, a carboxyl group, and a variable side chain." },
          { term: "Peptide bond", definition: "The covalent bond joining two amino acids, formed by a condensation reaction." },
          { term: "Nucleotide", definition: "The monomer of nucleic acids, made of a sugar, phosphate group, and nitrogenous base." }
        ]
      }
    ],
    keyTakeaways: [
      "All four biomolecule classes are built from repeating monomer units linked into polymers.",
      "Carbohydrates and lipids are primarily energy and structural molecules; lipids are hydrophobic.",
      "Protein function depends on its 3D shape, which is determined by four levels of structure."
    ],
    knowledgeCheck: [
      { question: "What are the monomers of proteins called, and what bond links them?", answer: "Amino acids, linked by peptide bonds." },
      { question: "Why are lipids described as hydrophobic?", answer: "Their long hydrocarbon chains don't interact well with water, so they repel it rather than dissolving in it." }
    ],
    flashcards: [
      { front: "Monomer", back: "A single repeating subunit that links together to form a polymer." },
      { front: "Peptide bond", back: "The covalent bond joining two amino acids, formed by a condensation (dehydration) reaction." },
      { front: "Phospholipid", back: "A lipid with a hydrophilic head and two hydrophobic tails; forms cell membranes." },
      { front: "Primary protein structure", back: "The linear sequence of amino acids in a polypeptide chain." },
      { front: "Nucleotide", back: "The monomer of nucleic acids, made of a sugar, phosphate group, and nitrogenous base." }
    ],
    practiceQuestions: [
      {
        question: "Which biomolecule class serves as the primary long-term energy storage molecule in the body?",
        concept: "Biomolecule function",
        options: ["Proteins", "Nucleic acids", "Lipids", "Monosaccharides"],
        correctIndex: 2,
        optionExplanations: [
          "Incorrect—proteins are primarily structural and functional, not storage molecules.",
          "Incorrect—nucleic acids store genetic information, not energy.",
          "Correct—lipids pack more energy per gram and are the body's main long-term energy reserve.",
          "Incorrect—monosaccharides are used for quick energy, not long-term storage."
        ]
      },
      {
        question: "What type of reaction links two amino acids together?",
        concept: "Protein structure",
        options: ["Hydrolysis", "Condensation (dehydration synthesis)", "Oxidation", "Phosphorylation"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—hydrolysis breaks bonds using water, the opposite process.",
          "Correct—condensation reactions release a water molecule while forming the peptide bond.",
          "Incorrect—oxidation involves electron loss and is unrelated to this bond formation.",
          "Incorrect—phosphorylation adds a phosphate group, not a peptide bond."
        ]
      },
      {
        question: "Which level of protein structure describes interactions between multiple separate polypeptide subunits?",
        concept: "Protein structure",
        options: ["Primary", "Secondary", "Tertiary", "Quaternary"],
        correctIndex: 3,
        optionExplanations: [
          "Incorrect—primary structure is just the amino acid sequence.",
          "Incorrect—secondary structure refers to local folding patterns like alpha helices.",
          "Incorrect—tertiary structure is the overall 3D shape of a single polypeptide.",
          "Correct—quaternary structure describes how multiple polypeptide chains assemble together."
        ]
      },
      {
        question: "Phospholipids arrange into a bilayer in water because:",
        concept: "Lipid structure",
        options: ["Their hydrophilic heads and hydrophobic tails orient to minimize contact with water", "They are attracted to oxygen molecules", "Water actively pulls them into position", "They are positively charged"],
        correctIndex: 0,
        optionExplanations: [
          "Correct—heads face outward toward water and tails cluster inward, minimizing unfavorable contact.",
          "Incorrect—this isn't about attraction to oxygen specifically.",
          "Incorrect—it's a passive, thermodynamically favorable self-assembly, not an active pull.",
          "Incorrect—phospholipids aren't simply \"positively charged.\""
        ]
      },
      {
        question: "DNA and RNA are polymers of which monomer?",
        concept: "Nucleic acid structure",
        options: ["Amino acids", "Nucleotides", "Monosaccharides", "Fatty acids"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—amino acids are the monomers of proteins.",
          "Correct—nucleotides (sugar, phosphate, and base) are the building blocks of nucleic acids.",
          "Incorrect—monosaccharides are the monomers of carbohydrates.",
          "Incorrect—fatty acids are components of lipids."
        ]
      }
    ],
    simplifiedExplanation: "There are four big biomolecule 'families': carbs (quick energy), lipids (long-term energy and membranes, hate water), proteins (built from amino acids, shape equals function), and nucleic acids (DNA/RNA, built from nucleotides, store information). If you remember each family's monomer and its job, most exam questions become pattern matching."
  },
  {
    id: "cell-structure",
    subjectId: "biology",
    sectionId: "bio-biochem",
    title: "Cell Structure",
    estimatedMinutes: 30,
    difficulty: "Beginner",
    prerequisiteLessonId: "biomolecules",
    sections: [
      {
        heading: "Prokaryotic vs. Eukaryotic Cells",
        body: "Prokaryotic cells (bacteria and archaea) lack a true nucleus and membrane-bound organelles—their DNA sits in an open nucleoid region. Eukaryotic cells (animals, plants, fungi, protists) have a membrane-bound nucleus and specialized organelles, and are generally larger and more complex.",
        keyTerms: [
          { term: "Prokaryote", definition: "A cell lacking a membrane-bound nucleus, such as a bacterium." },
          { term: "Eukaryote", definition: "A cell containing a membrane-bound nucleus and organelles." }
        ]
      },
      {
        heading: "Key Organelles and Their Functions",
        body: "The nucleus houses and protects DNA. Mitochondria generate ATP through cellular respiration. Ribosomes synthesize proteins. The rough endoplasmic reticulum (studded with ribosomes) processes proteins; the smooth ER synthesizes lipids. The Golgi apparatus modifies, sorts, and packages proteins and lipids for transport, and lysosomes break down waste and cellular debris.",
        keyTerms: [
          { term: "Mitochondria", definition: "Organelles that generate ATP through cellular respiration; often called the \"powerhouse of the cell.\"" },
          { term: "Ribosome", definition: "The site of protein synthesis; can float freely or be bound to the ER." },
          { term: "Golgi apparatus", definition: "Modifies, sorts, and packages proteins and lipids for transport." }
        ]
      },
      {
        heading: "The Plasma Membrane",
        body: "The plasma membrane is described by the fluid mosaic model: a flexible bilayer of phospholipids embedded with proteins that can drift within the layer. It is selectively permeable, controlling which substances can enter or exit the cell.",
        keyTerms: [
          { term: "Fluid mosaic model", definition: "Describes the plasma membrane as a fluid bilayer embedded with mobile proteins." },
          { term: "Selective permeability", definition: "The property of allowing some substances to cross a membrane more easily than others." }
        ]
      }
    ],
    keyTakeaways: [
      "Eukaryotic cells have membrane-bound organelles; prokaryotic cells don't.",
      "Mitochondria are the primary site of ATP production in the cell.",
      "The plasma membrane is a selectively permeable fluid mosaic of lipids and proteins."
    ],
    knowledgeCheck: [
      { question: "What distinguishes a eukaryotic cell from a prokaryotic cell?", answer: "The presence of a true, membrane-bound nucleus and other membrane-bound organelles." },
      { question: "Why is the mitochondrion often called the \"powerhouse of the cell\"?", answer: "Because it's the primary site of ATP (cellular energy) production via cellular respiration." }
    ],
    flashcards: [
      { front: "Mitochondria", back: "Site of ATP production via cellular respiration; the \"powerhouse of the cell.\"" },
      { front: "Ribosome", back: "Site of protein synthesis; can be free-floating or bound to the ER." },
      { front: "Rough ER", back: "Studded with ribosomes; processes and folds proteins." },
      { front: "Golgi apparatus", back: "Modifies, sorts, and packages proteins and lipids for transport." },
      { front: "Fluid mosaic model", back: "Describes the plasma membrane as a fluid bilayer embedded with mobile proteins." }
    ],
    practiceQuestions: [
      {
        question: "Which organelle is the primary site of ATP production?",
        concept: "Organelle function",
        options: ["Nucleus", "Mitochondria", "Golgi apparatus", "Lysosome"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—the nucleus houses DNA, not ATP production.",
          "Correct—mitochondria generate ATP through cellular respiration.",
          "Incorrect—the Golgi apparatus packages and ships proteins, not energy production.",
          "Incorrect—lysosomes digest waste, not produce energy."
        ]
      },
      {
        question: "Which structure is found in prokaryotic cells, without an equivalent membrane-bound version in eukaryotes?",
        concept: "Prokaryotes vs. eukaryotes",
        options: ["Nucleoid region", "Ribosomes", "Plasma membrane", "Cytoplasm"],
        correctIndex: 0,
        optionExplanations: [
          "Correct—the nucleoid is the unbound DNA region unique to prokaryotes, since eukaryotes have a membrane-bound nucleus instead.",
          "Incorrect—both prokaryotes and eukaryotes have ribosomes.",
          "Incorrect—both cell types have a plasma membrane.",
          "Incorrect—both cell types have cytoplasm."
        ]
      },
      {
        question: "Rough ER differs from smooth ER in that rough ER:",
        concept: "Organelle function",
        options: ["Synthesizes lipids", "Is studded with ribosomes and processes proteins", "Breaks down cellular waste", "Produces ATP"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—lipid synthesis is a role of the smooth ER.",
          "Correct—ribosomes studding the rough ER give it its name and its protein-processing role.",
          "Incorrect—waste breakdown is the job of lysosomes.",
          "Incorrect—ATP production happens in mitochondria."
        ]
      },
      {
        question: "The plasma membrane's selective permeability means:",
        concept: "Membrane structure",
        options: ["It allows all molecules through equally", "It controls which substances enter and exit the cell", "It is completely impermeable", "It only allows water through"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—it does not treat all molecules equally.",
          "Correct—selective permeability means the membrane regulates which substances pass through.",
          "Incorrect—a completely impermeable membrane would prevent all necessary exchange.",
          "Incorrect—many substances besides water cross the membrane."
        ]
      },
      {
        question: "Lysosomes primarily function to:",
        concept: "Organelle function",
        options: ["Produce energy", "Synthesize proteins", "Digest waste and cellular debris", "Package proteins for secretion"],
        correctIndex: 2,
        optionExplanations: [
          "Incorrect—energy production is the job of mitochondria.",
          "Incorrect—protein synthesis happens at ribosomes.",
          "Correct—lysosomes contain enzymes that break down waste and damaged organelles.",
          "Incorrect—packaging for secretion is the Golgi apparatus's role."
        ]
      }
    ],
    simplifiedExplanation: "Picture the cell as a tiny factory: nucleus is the control room (DNA), mitochondria is the power plant (ATP), ribosomes are the assembly line (proteins), the ER is the processing floor, the Golgi is shipping, and lysosomes are clean-up crew. Prokaryotes (bacteria) don't have these separate 'rooms'—everything floats freely in one open space."
  },
  {
    id: "cell-division",
    subjectId: "biology",
    sectionId: "bio-biochem",
    title: "Cell Division",
    estimatedMinutes: 30,
    difficulty: "Intermediate",
    prerequisiteLessonId: "cell-structure",
    sections: [
      {
        heading: "The Cell Cycle",
        body: "The cell cycle alternates growth with division. Interphase (G1, S, G2) is the longest phase, where the cell grows and replicates its DNA. Checkpoints throughout the cycle verify that conditions—like accurate DNA replication—are met before the cell is allowed to proceed to the next phase.",
        keyTerms: [
          { term: "Interphase", definition: "The phase of the cell cycle where the cell grows and replicates DNA before division." },
          { term: "Cell cycle checkpoint", definition: "A control point verifying conditions are met before proceeding to the next phase." }
        ]
      },
      {
        heading: "Mitosis: Prophase to Telophase",
        body: "Mitosis divides one cell into two genetically identical diploid daughter cells, used for growth and tissue repair. Chromosomes condense, align at the cell's equator, and are pulled apart by spindle fibers before the cell splits.",
        keyTerms: [
          { term: "Mitosis", definition: "Cell division producing two genetically identical diploid daughter cells." },
          { term: "Chromatid", definition: "One of two identical copies of a replicated chromosome, joined at the centromere." },
          { term: "Spindle fiber", definition: "A structure that pulls duplicated chromosomes apart during cell division." }
        ]
      },
      {
        heading: "Meiosis and Genetic Variation",
        body: "Meiosis involves two rounds of division, producing four genetically distinct haploid gametes for sexual reproduction. Crossing over (exchange of DNA between homologous chromosomes) and independent assortment during meiosis I are the two main sources of genetic variation.",
        keyTerms: [
          { term: "Meiosis", definition: "Two rounds of division producing four genetically distinct haploid gametes." },
          { term: "Crossing over", definition: "Exchange of genetic material between homologous chromosomes, increasing variation." },
          { term: "Haploid", definition: "Containing a single set of chromosomes (half the normal diploid number)." }
        ]
      }
    ],
    keyTakeaways: [
      "The cell cycle alternates growth (interphase) with division (mitosis or meiosis).",
      "Mitosis produces two genetically identical diploid cells, used for growth and repair.",
      "Meiosis produces four genetically distinct haploid gametes, with variation from crossing over and independent assortment."
    ],
    knowledgeCheck: [
      { question: "What is the key functional difference between mitosis and meiosis?", answer: "Mitosis produces two identical diploid cells for growth and repair; meiosis produces four genetically varied haploid gametes for reproduction." },
      { question: "What two processes during meiosis I create genetic variation?", answer: "Crossing over (exchange of DNA between homologous chromosomes) and independent assortment." }
    ],
    flashcards: [
      { front: "Interphase", back: "The longest phase of the cell cycle, where the cell grows and replicates its DNA before division." },
      { front: "Mitosis", back: "Cell division producing two genetically identical diploid daughter cells." },
      { front: "Meiosis", back: "Two rounds of division producing four genetically distinct haploid gametes." },
      { front: "Crossing over", back: "Exchange of genetic material between homologous chromosomes during meiosis I, increasing variation." },
      { front: "Checkpoint", back: "A cell cycle control point that verifies conditions are met before proceeding to the next phase." }
    ],
    practiceQuestions: [
      {
        question: "During which phase of the cell cycle does DNA replication occur?",
        concept: "Cell cycle",
        options: ["G1", "S phase", "G2", "Mitosis"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—G1 is a growth phase before replication.",
          "Correct—DNA is replicated during S (synthesis) phase.",
          "Incorrect—G2 is a growth phase after replication, before mitosis.",
          "Incorrect—mitosis is the division phase, after DNA is already replicated."
        ]
      },
      {
        question: "How many daughter cells result from one round of mitosis, and are they haploid or diploid?",
        concept: "Mitosis",
        options: ["Two, haploid", "Four, haploid", "Two, diploid", "Four, diploid"],
        correctIndex: 2,
        optionExplanations: [
          "Incorrect—mitosis produces diploid, not haploid, cells.",
          "Incorrect—mitosis produces two cells, not four, and they are diploid.",
          "Correct—mitosis produces two genetically identical diploid daughter cells.",
          "Incorrect—mitosis produces two cells, not four."
        ]
      },
      {
        question: "Crossing over occurs between:",
        concept: "Meiosis",
        options: ["Sister chromatids of the same chromosome", "Homologous chromosomes from each parent", "Unrelated chromosomes", "Mitochondrial DNA strands"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—sister chromatids are identical copies, so exchange between them wouldn't create new variation.",
          "Correct—crossing over exchanges segments between homologous chromosomes, one from each parent.",
          "Incorrect—crossing over occurs between paired homologous chromosomes, not unrelated ones.",
          "Incorrect—this process involves nuclear chromosomes, not mitochondrial DNA."
        ]
      },
      {
        question: "What is the main biological purpose of meiosis?",
        concept: "Meiosis",
        options: ["Tissue repair", "Producing genetically varied gametes for reproduction", "Producing energy", "Replicating the entire genome exactly"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—tissue repair relies on mitosis, not meiosis.",
          "Correct—meiosis produces genetically varied gametes (sperm and egg cells).",
          "Incorrect—energy production is unrelated to cell division type.",
          "Incorrect—meiosis introduces variation rather than producing exact replicas."
        ]
      },
      {
        question: "A cell cycle checkpoint that fails to detect DNA damage could lead to:",
        concept: "Cell cycle regulation",
        options: ["Improved genetic variation", "Uncontrolled cell division, such as cancer", "Faster wound healing only", "No effect on the cell"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—undetected damage isn't beneficial variation, it's an error.",
          "Correct—failed checkpoints can let damaged cells keep dividing, a hallmark of cancer.",
          "Incorrect—this describes a serious risk, not a benign speed-up.",
          "Incorrect—undetected DNA damage can have serious downstream effects."
        ]
      }
    ],
    simplifiedExplanation: "Mitosis is like a copy machine: one cell becomes two identical cells, used for growth and repair. Meiosis is like shuffling a deck: one cell becomes four different cells with half the DNA, used to make sperm and eggs. The 'shuffling' comes from crossing over and independent assortment, which is why siblings look different from each other."
  },
  {
    id: "dna",
    subjectId: "biology",
    sectionId: "bio-biochem",
    title: "DNA",
    estimatedMinutes: 25,
    difficulty: "Intermediate",
    prerequisiteLessonId: "cell-division",
    sections: [
      {
        heading: "DNA Structure",
        body: "DNA is a double helix made of two antiparallel strands of nucleotides. Each nucleotide contains a sugar, a phosphate, and one of four bases: adenine (A), thymine (T), guanine (G), or cytosine (C). Bases pair in a fixed pattern—A with T, G with C—held together by hydrogen bonds.",
        keyTerms: [
          { term: "Double helix", definition: "The twisted, ladder-like structure formed by two strands of DNA." },
          { term: "Base pairing", definition: "The fixed pattern in which adenine pairs with thymine, and guanine pairs with cytosine." }
        ]
      },
      {
        heading: "DNA Replication",
        body: "Replication is semiconservative: each new DNA molecule contains one original strand and one newly synthesized strand. Helicase unwinds the double helix, and DNA polymerase synthesizes new complementary strands by adding nucleotides that match the template.",
        keyTerms: [
          { term: "Semiconservative replication", definition: "Each new DNA molecule contains one original and one new strand." },
          { term: "Helicase", definition: "The enzyme that unwinds and separates the DNA double helix." },
          { term: "DNA polymerase", definition: "The enzyme that synthesizes new DNA strands by adding complementary nucleotides." }
        ]
      },
      {
        heading: "Chromosomes and Packaging",
        body: "DNA is wrapped around proteins called histones to form chromatin, which condenses tightly into visible chromosomes during cell division. This packaging lets a huge amount of DNA fit inside a tiny nucleus.",
        keyTerms: [
          { term: "Histone", definition: "A protein that DNA wraps around to form chromatin." },
          { term: "Chromatin", definition: "The complex of DNA and histone proteins that makes up chromosomes." }
        ]
      }
    ],
    keyTakeaways: [
      "DNA is a double helix held together by complementary base pairing: A with T, G with C.",
      "DNA replication is semiconservative—each new molecule has one original strand and one new strand.",
      "DNA is packaged around histone proteins into chromatin, which condenses into chromosomes during division."
    ],
    knowledgeCheck: [
      { question: "What does \"semiconservative\" mean in DNA replication?", answer: "Each new DNA molecule consists of one original (parental) strand and one newly synthesized strand." },
      { question: "Which enzyme unwinds the DNA double helix during replication?", answer: "Helicase." }
    ],
    flashcards: [
      { front: "Base pairing", back: "Adenine pairs with thymine, guanine pairs with cytosine, held together by hydrogen bonds." },
      { front: "Semiconservative replication", back: "Each daughter DNA molecule retains one original strand and gains one new strand." },
      { front: "Helicase", back: "Enzyme that unwinds and separates the DNA double helix." },
      { front: "DNA polymerase", back: "Enzyme that synthesizes new DNA strands by adding complementary nucleotides." },
      { front: "Histone", back: "A protein that DNA wraps around to form chromatin." }
    ],
    practiceQuestions: [
      {
        question: "In DNA, adenine pairs with:",
        concept: "DNA structure",
        options: ["Guanine", "Cytosine", "Thymine", "Uracil"],
        correctIndex: 2,
        optionExplanations: [
          "Incorrect—guanine pairs with cytosine, not adenine.",
          "Incorrect—cytosine pairs with guanine, not adenine.",
          "Correct—adenine pairs with thymine in DNA.",
          "Incorrect—uracil replaces thymine in RNA, not DNA."
        ]
      },
      {
        question: "What does semiconservative replication mean?",
        concept: "DNA replication",
        options: ["Both strands of the new molecule are entirely new", "One strand is original, one is new, in each daughter molecule", "DNA is not replicated at all", "Only half the genome is copied"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—this would describe \"conservative\" replication, which isn't how DNA actually replicates.",
          "Correct—each daughter molecule keeps one original strand and gains one newly synthesized strand.",
          "Incorrect—DNA is fully replicated before cell division.",
          "Incorrect—the entire genome is copied, not just half."
        ]
      },
      {
        question: "Which enzyme adds new nucleotides to a growing DNA strand?",
        concept: "DNA replication",
        options: ["Helicase", "DNA polymerase", "Ligase", "RNA polymerase"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—helicase unwinds the helix but doesn't add nucleotides.",
          "Correct—DNA polymerase synthesizes new strands by adding complementary nucleotides.",
          "Incorrect—ligase joins DNA fragments together, rather than adding individual nucleotides.",
          "Incorrect—RNA polymerase synthesizes RNA, not DNA."
        ]
      },
      {
        question: "DNA strands are described as \"antiparallel\" because:",
        concept: "DNA structure",
        options: ["They run in opposite 5' to 3' directions", "They never touch", "They are identical in sequence", "They repel each other"],
        correctIndex: 0,
        optionExplanations: [
          "Correct—the two strands run in opposite chemical directions relative to each other.",
          "Incorrect—the strands are held together by base pairing, so they do interact closely.",
          "Incorrect—complementary strands have matching, not identical, sequences.",
          "Incorrect—hydrogen bonds hold the strands together rather than repelling them."
        ]
      },
      {
        question: "Chromatin condenses into visible chromosomes primarily during:",
        concept: "Chromosome packaging",
        options: ["Interphase", "Cell division", "Protein synthesis", "Apoptosis only"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—during interphase, chromatin is typically loose to allow gene access.",
          "Correct—chromatin condenses tightly into chromosomes during cell division for accurate separation.",
          "Incorrect—protein synthesis doesn't require chromosome condensation.",
          "Incorrect—condensation happens during normal division, not only during cell death."
        ]
      }
    ],
    simplifiedExplanation: "DNA is a twisted ladder (double helix). The rungs are base pairs that always match the same way: A with T, G with C. When the cell copies DNA, it unzips the ladder and builds a new matching half on each side, so every new DNA molecule is actually half old, half new."
  },
  {
    id: "rna",
    subjectId: "biology",
    sectionId: "bio-biochem",
    title: "RNA",
    estimatedMinutes: 25,
    difficulty: "Intermediate",
    prerequisiteLessonId: "dna",
    sections: [
      {
        heading: "RNA vs. DNA",
        body: "RNA differs from DNA in three key ways: it's single-stranded rather than double-stranded, it uses the sugar ribose instead of deoxyribose, and it substitutes the base uracil for thymine.",
        keyTerms: [
          { term: "Ribose", definition: "The sugar found in RNA nucleotides." },
          { term: "Uracil", definition: "The RNA base that pairs with adenine, replacing thymine." }
        ]
      },
      {
        heading: "Types of RNA",
        body: "Three main types of RNA carry out gene expression: messenger RNA (mRNA) carries the genetic message copied from DNA, transfer RNA (tRNA) delivers specific amino acids to the ribosome, and ribosomal RNA (rRNA) forms the structural and catalytic core of the ribosome itself.",
        keyTerms: [
          { term: "mRNA", definition: "Carries genetic instructions from DNA to the ribosome." },
          { term: "tRNA", definition: "Delivers specific amino acids to the ribosome during translation." },
          { term: "rRNA", definition: "Structural and catalytic component of ribosomes." }
        ]
      },
      {
        heading: "Transcription",
        body: "Transcription copies a gene from DNA into a complementary mRNA strand. RNA polymerase reads the DNA template strand and builds the mRNA molecule; in eukaryotes, this happens in the nucleus before the mRNA travels to the ribosome.",
        keyTerms: [
          { term: "Transcription", definition: "The process of copying a DNA gene into an mRNA molecule." },
          { term: "RNA polymerase", definition: "The enzyme that synthesizes RNA from a DNA template during transcription." }
        ]
      }
    ],
    keyTakeaways: [
      "RNA differs from DNA by being single-stranded, using ribose sugar, and substituting uracil for thymine.",
      "The three main RNA types—mRNA, tRNA, and rRNA—each play a distinct role in gene expression.",
      "Transcription copies a DNA gene into mRNA using RNA polymerase."
    ],
    knowledgeCheck: [
      { question: "Which base replaces thymine in RNA?", answer: "Uracil." },
      { question: "What is the role of mRNA?", answer: "It carries the genetic message copied from DNA to the ribosome for protein synthesis." }
    ],
    flashcards: [
      { front: "Uracil", back: "The RNA base that pairs with adenine, replacing thymine." },
      { front: "mRNA (messenger RNA)", back: "Carries genetic instructions from DNA to the ribosome." },
      { front: "tRNA (transfer RNA)", back: "Delivers specific amino acids to the ribosome during translation." },
      { front: "rRNA (ribosomal RNA)", back: "Structural and catalytic component of ribosomes." },
      { front: "Transcription", back: "The process of copying a DNA gene into an mRNA molecule." }
    ],
    practiceQuestions: [
      {
        question: "RNA differs structurally from DNA because RNA is:",
        concept: "RNA structure",
        options: ["Double-stranded", "Single-stranded", "Found only in mitochondria", "Made of amino acids"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—DNA, not RNA, is typically double-stranded.",
          "Correct—RNA is single-stranded, unlike double-stranded DNA.",
          "Incorrect—RNA is found throughout the cell, not just in mitochondria.",
          "Incorrect—RNA is made of nucleotides, not amino acids."
        ]
      },
      {
        question: "Which type of RNA carries amino acids to the ribosome?",
        concept: "Types of RNA",
        options: ["mRNA", "tRNA", "rRNA", "hnRNA"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—mRNA carries the genetic message, not amino acids.",
          "Correct—tRNA delivers specific amino acids matching each codon.",
          "Incorrect—rRNA forms part of the ribosome's structure.",
          "Incorrect—hnRNA is an unprocessed precursor, not an amino acid carrier."
        ]
      },
      {
        question: "Transcription is catalyzed by:",
        concept: "Transcription",
        options: ["DNA polymerase", "RNA polymerase", "Helicase", "Ligase"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—DNA polymerase synthesizes DNA, not RNA.",
          "Correct—RNA polymerase synthesizes RNA from a DNA template during transcription.",
          "Incorrect—helicase unwinds DNA but doesn't synthesize RNA.",
          "Incorrect—ligase joins DNA fragments, unrelated to transcription."
        ]
      },
      {
        question: "Where does transcription primarily occur in eukaryotic cells?",
        concept: "Transcription",
        options: ["Cytoplasm", "Mitochondria", "Nucleus", "Golgi apparatus"],
        correctIndex: 2,
        optionExplanations: [
          "Incorrect—translation, not transcription, occurs in the cytoplasm.",
          "Incorrect—mitochondria have their own limited DNA but this isn't the primary site.",
          "Correct—transcription occurs in the nucleus, where the DNA template is located.",
          "Incorrect—the Golgi apparatus processes proteins and lipids, not RNA synthesis."
        ]
      },
      {
        question: "The sugar found in RNA nucleotides is:",
        concept: "RNA structure",
        options: ["Deoxyribose", "Ribose", "Glucose", "Fructose"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—deoxyribose is the sugar found in DNA.",
          "Correct—ribose is the sugar found in RNA nucleotides.",
          "Incorrect—glucose is a simple sugar used for energy, not a nucleotide component.",
          "Incorrect—fructose is another simple sugar, not part of RNA's structure."
        ]
      }
    ],
    simplifiedExplanation: "RNA is like a photocopy of one page of the DNA instruction manual (a gene), made so the cell can send that instruction to the ribosome without risking damage to the original DNA. Three helpers do the job: mRNA carries the message, tRNA fetches the amino acid parts, and rRNA builds the ribosome factory itself."
  },
  {
    id: "protein-synthesis",
    subjectId: "biology",
    sectionId: "bio-biochem",
    title: "Protein Synthesis",
    estimatedMinutes: 30,
    difficulty: "Intermediate",
    prerequisiteLessonId: "rna",
    sections: [
      {
        heading: "From Gene to Protein",
        body: "The central dogma of molecular biology describes the flow of genetic information: DNA is transcribed into RNA, and RNA is translated into protein. This two-step process, transcription followed by translation, is how genes are expressed as functional molecules.",
        keyTerms: [
          { term: "Central dogma", definition: "DNA is transcribed into RNA, which is translated into protein." },
          { term: "Gene expression", definition: "The process by which information from a gene is used to build a functional product, usually a protein." }
        ]
      },
      {
        heading: "Translation",
        body: "At the ribosome, mRNA is read in three-nucleotide codons. Each codon is matched by a tRNA carrying a complementary three-nucleotide anticodon and a specific amino acid. Translation begins at a start codon (AUG) and continues until a stop codon is reached, releasing the finished polypeptide.",
        keyTerms: [
          { term: "Codon", definition: "A three-nucleotide sequence on mRNA coding for one amino acid or a stop signal." },
          { term: "Anticodon", definition: "The three-nucleotide sequence on tRNA that pairs with a complementary mRNA codon." },
          { term: "Start codon", definition: "AUG; signals the beginning of translation and codes for methionine." }
        ]
      },
      {
        heading: "Protein Folding and Function",
        body: "The finished polypeptide must fold into its correct three-dimensional shape to function properly. Heat, extreme pH, or other stress can cause denaturation—loss of that functional shape—which usually destroys the protein's activity.",
        keyTerms: [
          { term: "Polypeptide", definition: "A chain of amino acids linked by peptide bonds." },
          { term: "Denaturation", definition: "Loss of a protein's functional shape due to heat, pH, or other stress." }
        ]
      }
    ],
    keyTakeaways: [
      "The central dogma describes information flow: DNA to RNA (transcription) to protein (translation).",
      "During translation, ribosomes read mRNA in codons, matched by tRNA anticodons carrying specific amino acids.",
      "The resulting polypeptide must fold correctly into a 3D shape to function."
    ],
    knowledgeCheck: [
      { question: "What is a codon?", answer: "A three-nucleotide sequence on mRNA that specifies a particular amino acid, or a start/stop signal." },
      { question: "What happens at a stop codon?", answer: "Translation ends and the completed polypeptide is released from the ribosome." }
    ],
    flashcards: [
      { front: "Central dogma", back: "DNA is transcribed into RNA, which is translated into protein." },
      { front: "Codon", back: "A three-nucleotide sequence on mRNA coding for one amino acid or a stop signal." },
      { front: "Anticodon", back: "The three-nucleotide sequence on tRNA that pairs with a complementary mRNA codon." },
      { front: "Start codon", back: "AUG; signals the beginning of translation and codes for methionine." },
      { front: "Denaturation", back: "Loss of a protein's functional shape due to heat, pH, or other stress." }
    ],
    practiceQuestions: [
      {
        question: "Translation takes place at the:",
        concept: "Translation",
        options: ["Nucleus", "Ribosome", "Golgi apparatus", "Mitochondria"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—the nucleus is where transcription occurs, not translation.",
          "Correct—translation occurs at the ribosome, where mRNA is read and protein is built.",
          "Incorrect—the Golgi apparatus processes finished proteins, not translation itself.",
          "Incorrect—mitochondria have their own ribosomes but aren't the primary site described here."
        ]
      },
      {
        question: "Each codon corresponds to:",
        concept: "Translation",
        options: ["One nucleotide", "One amino acid (or a stop signal)", "One entire protein", "One gene"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—a codon is three nucleotides, not one.",
          "Correct—each codon specifies one amino acid or signals stop/start.",
          "Incorrect—a full protein requires many codons in sequence.",
          "Incorrect—a gene contains many codons, not just one."
        ]
      },
      {
        question: "The start codon AUG codes for which amino acid?",
        concept: "Translation",
        options: ["Glycine", "Methionine", "Leucine", "Alanine"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—glycine has its own separate codons.",
          "Correct—AUG both signals translation start and codes for methionine.",
          "Incorrect—leucine has its own separate codons.",
          "Incorrect—alanine has its own separate codons."
        ]
      },
      {
        question: "tRNA molecules are responsible for:",
        concept: "Translation",
        options: ["Storing genetic information long-term", "Delivering specific amino acids matching the mRNA codon", "Copying DNA into mRNA", "Breaking down proteins"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—long-term genetic storage is DNA's role.",
          "Correct—tRNA delivers the amino acid matching each mRNA codon during translation.",
          "Incorrect—copying DNA into mRNA is transcription, done by RNA polymerase.",
          "Incorrect—protein breakdown is not tRNA's function."
        ]
      },
      {
        question: "If a protein is denatured, it most likely:",
        concept: "Protein folding",
        options: ["Gains new function", "Loses its functional 3D shape and function", "Becomes a different amino acid", "Turns into RNA"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—denaturation disrupts function rather than improving it.",
          "Correct—denaturation destroys the folded shape a protein needs to function.",
          "Incorrect—denaturation doesn't change one amino acid into another.",
          "Incorrect—a denatured protein remains a protein; it doesn't convert to RNA."
        ]
      }
    ],
    simplifiedExplanation: "Think of it as a translation chain: DNA (the master blueprint) is copied into mRNA (a work order), which travels to the ribosome (the workshop). There, tRNA molecules act like delivery trucks, each bringing one specific amino acid that matches a three-letter code (codon) on the mRNA, until the amino acids are strung together into a protein."
  },
  {
    id: "evolution",
    subjectId: "biology",
    sectionId: "bio-biochem",
    title: "Evolution",
    estimatedMinutes: 30,
    difficulty: "Intermediate",
    prerequisiteLessonId: "protein-synthesis",
    sections: [
      {
        heading: "Natural Selection",
        body: "Natural selection requires heritable variation within a population, that variation affecting survival or reproduction, and differential reproductive success as a result. Traits that improve an organism's fitness—its relative ability to survive and reproduce in its environment—tend to become more common over generations.",
        keyTerms: [
          { term: "Natural selection", definition: "The process by which heritable traits that improve reproductive success become more common in a population over time." },
          { term: "Fitness", definition: "An organism's relative ability to survive and reproduce in its environment." }
        ]
      },
      {
        heading: "Evidence for Evolution",
        body: "Multiple independent lines of evidence support evolution: the fossil record shows gradual change over time, comparative anatomy reveals homologous structures (shared ancestry, e.g., a bat wing and a human arm) and analogous structures (independently evolved similar function, e.g., a bird wing and an insect wing), and molecular biology shows shared genetic sequences across related species.",
        keyTerms: [
          { term: "Homologous structures", definition: "Structures with a shared evolutionary origin, though possibly different functions." },
          { term: "Analogous structures", definition: "Structures that serve a similar function but evolved independently." }
        ]
      },
      {
        heading: "Population Genetics Basics",
        body: "At the population level, evolution can be measured as a change in allele frequencies within a population's gene pool over time. Forces like natural selection, genetic drift, mutation, and migration all shift these frequencies away from the theoretical stability described by Hardy-Weinberg equilibrium.",
        keyTerms: [
          { term: "Allele frequency", definition: "How common a particular version of a gene is within a population's gene pool." },
          { term: "Hardy-Weinberg equilibrium", definition: "A theoretical state where allele frequencies remain constant across generations absent evolutionary forces." }
        ]
      }
    ],
    keyTakeaways: [
      "Natural selection acts on heritable variation, favoring traits that increase reproductive success.",
      "Multiple independent lines of evidence—fossils, comparative anatomy, molecular biology—support evolution.",
      "Evolution can be measured as a change in allele frequencies within a population's gene pool over time."
    ],
    knowledgeCheck: [
      { question: "What three conditions are required for natural selection to occur?", answer: "Heritable variation exists, that variation affects survival or reproduction, and there is differential reproductive success based on that variation." },
      { question: "What's the difference between homologous and analogous structures?", answer: "Homologous structures share a common ancestor; analogous structures evolved independently to serve a similar function." }
    ],
    flashcards: [
      { front: "Natural selection", back: "The process by which heritable traits that improve reproductive success become more common in a population over time." },
      { front: "Fitness", back: "An organism's relative ability to survive and reproduce in its environment." },
      { front: "Homologous structures", back: "Structures with a shared evolutionary origin, e.g., a bat wing and a human arm." },
      { front: "Analogous structures", back: "Structures that serve a similar function but evolved independently, e.g., a bird wing and an insect wing." },
      { front: "Allele frequency", back: "How common a particular version of a gene is within a population's gene pool." }
    ],
    practiceQuestions: [
      {
        question: "Natural selection acts on:",
        concept: "Natural selection",
        options: ["Traits an individual acquires during its lifetime", "Heritable variation already present in a population", "Random mutations that always help the organism", "Traits selected deliberately by scientists"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—acquired traits (like a muscle built from exercise) aren't heritable and aren't acted on by natural selection.",
          "Correct—natural selection acts on existing heritable variation within a population.",
          "Incorrect—mutations are random and can be neutral or harmful, not always helpful.",
          "Incorrect—natural selection is not a deliberate process; that would describe artificial selection."
        ]
      },
      {
        question: "A bat's wing and a human arm are an example of:",
        concept: "Evidence for evolution",
        options: ["Analogous structures", "Homologous structures", "Vestigial structures", "Convergent structures"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—analogous structures evolved independently, unlike these two.",
          "Correct—both share the same underlying bone structure, inherited from a common ancestor.",
          "Incorrect—vestigial structures are reduced remnants with little current function; that's not this example.",
          "Incorrect—\"convergent structures\" isn't the standard term here; homologous is correct."
        ]
      },
      {
        question: "\"Fitness\" in an evolutionary sense refers to:",
        concept: "Natural selection",
        options: ["Physical strength", "Relative reproductive success", "Speed and agility", "Intelligence"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—strength alone doesn't define evolutionary fitness.",
          "Correct—fitness is about how successfully an organism reproduces relative to others.",
          "Incorrect—speed can contribute to fitness in some contexts, but isn't the definition itself.",
          "Incorrect—intelligence alone doesn't define evolutionary fitness."
        ]
      },
      {
        question: "Evolution at the population level can be defined as:",
        concept: "Population genetics",
        options: ["An individual organism changing during its lifetime", "A change in allele frequencies within a population over time", "The extinction of a species", "An increase in population size only"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—individuals don't evolve during their lifetime; populations evolve across generations.",
          "Correct—this is the standard population-genetics definition of evolution.",
          "Incorrect—extinction is a possible outcome, not the definition of evolution.",
          "Incorrect—population size alone doesn't capture genetic change."
        ]
      },
      {
        question: "A bird's wing and an insect's wing evolving independently to serve flight is an example of:",
        concept: "Evidence for evolution",
        options: ["Homologous structures", "Analogous structures", "Vestigial structures", "Genetic drift"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—homologous structures share a common ancestor; birds and insects don't share a winged ancestor.",
          "Correct—these structures evolved independently to serve a similar function, making them analogous.",
          "Incorrect—vestigial structures are reduced remnants, not fully functional wings.",
          "Incorrect—genetic drift is a mechanism of allele frequency change, not a description of structures."
        ]
      }
    ],
    simplifiedExplanation: "Evolution isn't about individuals changing; it's about populations shifting over generations because individuals with helpful traits leave more offspring. If a trait helps you survive and reproduce, it becomes more common in the next generation. That's natural selection in one sentence."
  },
  {
    id: "ecology",
    subjectId: "biology",
    sectionId: "bio-biochem",
    title: "Ecology",
    estimatedMinutes: 25,
    difficulty: "Beginner",
    prerequisiteLessonId: "evolution",
    sections: [
      {
        heading: "Levels of Ecological Organization",
        body: "Ecology studies life at increasing scales: an organism, a population (all individuals of one species in an area), a community (all species populations interacting in an area), an ecosystem (a community plus its physical environment), and finally the biosphere (all ecosystems on Earth).",
        keyTerms: [
          { term: "Population", definition: "All individuals of one species living in a defined area." },
          { term: "Community", definition: "All the different species populations interacting in a given area." },
          { term: "Ecosystem", definition: "A community together with its physical, non-living environment." }
        ]
      },
      {
        heading: "Energy Flow and Food Webs",
        body: "Energy flows one way through an ecosystem's trophic levels: producers (like plants) capture energy from the sun, primary consumers eat producers, secondary consumers eat primary consumers, and decomposers break down dead matter. On average, only about 10% of energy transfers from one trophic level to the next—the rest is lost as heat.",
        keyTerms: [
          { term: "Trophic level", definition: "A feeding position in a food chain, such as producer or primary consumer." },
          { term: "Producer", definition: "An organism, like a plant, that captures energy from sunlight to make its own food." },
          { term: "Decomposer", definition: "An organism that breaks down dead organic matter, recycling nutrients." }
        ]
      },
      {
        heading: "Population Dynamics",
        body: "A population's growth is limited by its environment's carrying capacity—the maximum size it can sustainably support—and by limiting factors like food, space, and predators. Real populations tend to follow logistic (S-shaped) growth that levels off near carrying capacity, rather than unlimited exponential growth.",
        keyTerms: [
          { term: "Carrying capacity", definition: "The maximum population size an environment can sustainably support." },
          { term: "Limiting factor", definition: "A resource or condition that restricts population growth." }
        ]
      }
    ],
    keyTakeaways: [
      "Ecological organization scales from organism to population, community, ecosystem, and the biosphere.",
      "Energy flows one-way through trophic levels, with roughly only 10% transferred to the next level.",
      "Population growth is limited by carrying capacity, producing logistic rather than unlimited exponential growth."
    ],
    knowledgeCheck: [
      { question: "What is carrying capacity?", answer: "The maximum population size an environment can sustainably support given its resources." },
      { question: "Roughly what percentage of energy transfers from one trophic level to the next?", answer: "About 10%." }
    ],
    flashcards: [
      { front: "Population", back: "All individuals of one species living in a defined area." },
      { front: "Community", back: "All the different species populations interacting in a given area." },
      { front: "Trophic level", back: "A feeding position in a food chain, such as producer or primary consumer." },
      { front: "Carrying capacity", back: "The maximum population size an environment can sustainably support long-term." },
      { front: "Limiting factor", back: "A resource or condition that restricts population growth, such as food, space, or predators." }
    ],
    practiceQuestions: [
      {
        question: "The correct order of ecological organization, from smallest to largest, is:",
        concept: "Ecological organization",
        options: ["Ecosystem, community, population, organism", "Organism, population, community, ecosystem", "Community, organism, ecosystem, population", "Population, organism, community, ecosystem"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—this order is reversed.",
          "Correct—organization scales up from a single organism to population, community, and ecosystem.",
          "Incorrect—this order is scrambled and doesn't reflect increasing scale.",
          "Incorrect—this order is scrambled and doesn't reflect increasing scale."
        ]
      },
      {
        question: "Approximately what percentage of energy is transferred from one trophic level to the next?",
        concept: "Energy flow",
        options: ["90%", "50%", "10%", "1%"],
        correctIndex: 2,
        optionExplanations: [
          "Incorrect—this vastly overstates how much energy transfers between levels.",
          "Incorrect—this overstates how much energy transfers between levels.",
          "Correct—roughly 10% of energy transfers to the next trophic level; the rest is lost as heat.",
          "Incorrect—this understates the typical transfer, which is closer to 10%."
        ]
      },
      {
        question: "Carrying capacity refers to:",
        concept: "Population dynamics",
        options: ["The fastest possible growth rate of a population", "The maximum population size an environment can sustainably support", "The total number of species in an ecosystem", "The rate of predation"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—that describes growth rate, not carrying capacity.",
          "Correct—carrying capacity is the maximum sustainable population size for an environment.",
          "Incorrect—that describes species richness, a different ecological concept.",
          "Incorrect—that describes a predator-prey dynamic, not carrying capacity."
        ]
      },
      {
        question: "Which organisms occupy the first trophic level in most food chains?",
        concept: "Energy flow",
        options: ["Primary consumers", "Producers", "Decomposers", "Apex predators"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—primary consumers occupy the second trophic level, eating producers.",
          "Correct—producers, like plants, form the base of most food chains.",
          "Incorrect—decomposers break down dead matter across all levels, not just the first.",
          "Incorrect—apex predators sit at the top, not the base, of the food chain."
        ]
      },
      {
        question: "Logistic population growth differs from exponential growth because logistic growth:",
        concept: "Population dynamics",
        options: ["Has no upper limit", "Levels off as it approaches carrying capacity", "Always leads to extinction", "Only occurs in plants"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—that describes exponential growth, not logistic growth.",
          "Correct—logistic growth slows and levels off as the population nears carrying capacity.",
          "Incorrect—logistic growth describes stabilization, not extinction.",
          "Incorrect—logistic growth applies broadly across species, not just plants."
        ]
      }
    ],
    simplifiedExplanation: "Zoom out step by step: one organism, then a population (same species), then a community (different species together), then an ecosystem (community plus physical environment), then the biosphere (all ecosystems on Earth). Energy only flows one direction up this chain, and a lot is lost as heat at each step—that's why there are far more producers (plants) than top predators."
  }
];

const lessonContentList: LessonContent[] = [...biologyLessons];

export const lessonContentMap: Record<string, LessonContent> = Object.fromEntries(lessonContentList.map(l => [l.id, l]));

export function getLessonContent(lessonId: string): LessonContent | undefined {
  return lessonContentMap[lessonId];
}

// ---- Progress tracking ----

const LESSON_PROGRESS_KEY = "studium_lesson_progress";

export type LessonProgressEntry = {
  status: "completed";
  timeSpentMinutes: number;
  quizScore: number;
  flashcardsCompleted: number;
  lastStudied: string;
  confidence: "understand" | "practice" | "confused" | null;
};

function getLessonProgressMap(): Record<string, LessonProgressEntry> {
  if (typeof window === "undefined") return {};
  const raw = localStorage.getItem(LESSON_PROGRESS_KEY);
  return raw ? JSON.parse(raw) : {};
}

export function getLessonEntry(lessonId: string): LessonProgressEntry | null {
  return getLessonProgressMap()[lessonId] ?? null;
}

export type LessonStatus = "locked" | "available" | "completed";

export function getLessonStatus(lessonIds: string[], lessonId: string): LessonStatus {
  const map = getLessonProgressMap();
  if (map[lessonId]?.status === "completed") return "completed";
  const idx = lessonIds.indexOf(lessonId);
  if (idx <= 0) return "available";
  const prevId = lessonIds[idx - 1];
  return map[prevId]?.status === "completed" ? "available" : "locked";
}

export function completeLesson(lessonId: string, data: { timeSpentMinutes: number; quizScore: number; flashcardsCompleted: number }) {
  if (typeof window === "undefined") return;
  const map = getLessonProgressMap();
  map[lessonId] = {
    status: "completed",
    timeSpentMinutes: data.timeSpentMinutes,
    quizScore: data.quizScore,
    flashcardsCompleted: data.flashcardsCompleted,
    lastStudied: new Date().toISOString().slice(0, 10),
    confidence: null
  };
  localStorage.setItem(LESSON_PROGRESS_KEY, JSON.stringify(map));
}

// Called once the user answers the post-lesson confidence check, so it can be
// recorded separately from lesson completion (which happens first).
export function setLessonConfidence(lessonId: string, confidence: "understand" | "practice" | "confused") {
  if (typeof window === "undefined") return;
  const map = getLessonProgressMap();
  const entry = map[lessonId];
  if (!entry) return;
  map[lessonId] = { ...entry, confidence };
  localStorage.setItem(LESSON_PROGRESS_KEY, JSON.stringify(map));
}

export type SubjectProgress = { completed: number; total: number; percent: number; hoursRemaining: number };

export function getSubjectProgress(lessonIds: string[]): SubjectProgress {
  const map = getLessonProgressMap();
  const total = lessonIds.length;
  let completed = 0;
  let remainingMinutes = 0;
  for (const id of lessonIds) {
    if (map[id]?.status === "completed") completed++;
    else remainingMinutes += lessonContentMap[id]?.estimatedMinutes ?? 0;
  }
  return { completed, total, percent: total ? Math.round((completed / total) * 100) : 0, hoursRemaining: Math.round((remainingMinutes / 60) * 10) / 10 };
}

export function getSectionProgress(section: SectionDef): SubjectProgress {
  const allLessonIds = section.subjects.flatMap(s => s.lessons.map(l => l.id));
  return getSubjectProgress(allLessonIds);
}

// ---- Bookmarked flashcards ----

const BOOKMARKS_KEY = "studium_lesson_bookmarks";

function getBookmarksMap(): Record<string, number[]> {
  if (typeof window === "undefined") return {};
  const raw = localStorage.getItem(BOOKMARKS_KEY);
  return raw ? JSON.parse(raw) : {};
}

export function getBookmarkedCards(lessonId: string): number[] {
  return getBookmarksMap()[lessonId] ?? [];
}

export function toggleBookmarkedCard(lessonId: string, cardIndex: number) {
  if (typeof window === "undefined") return;
  const map = getBookmarksMap();
  const current = map[lessonId] ?? [];
  map[lessonId] = current.includes(cardIndex) ? current.filter(i => i !== cardIndex) : [...current, cardIndex];
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(map));
}
