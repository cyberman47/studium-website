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
      // Navigation shell only, below—real subject/lesson names, no lesson
      // bodies written yet (same "coming soon" convention as Nursing/
      // Anatomy/Pharmacology/USMLE). Deliberately kept separate from the
      // "biology" subject above rather than merged into it, since that one
      // already has real written content and merging risks orphaning it.
      {
        id: "cell-biology",
        name: "Cell Biology",
        lessons: [
          { id: "cell-structure-organelles", title: "Cell Structure & Organelles" },
          { id: "cell-membranes-transport", title: "Cell Membranes & Transport" },
          { id: "cell-communication-signaling", title: "Cell Communication & Signaling" },
          { id: "cell-cycle-mitosis-meiosis", title: "Cell Cycle, Mitosis & Meiosis" }
        ]
      },
      {
        id: "genetics-molecular-biology",
        name: "Genetics & Molecular Biology",
        lessons: [
          { id: "mendelian-genetics-inheritance", title: "Mendelian Genetics & Inheritance" },
          { id: "dna-replication-repair", title: "DNA Replication & Repair" },
          { id: "transcription-rna", title: "Transcription & RNA" },
          { id: "translation-protein-synthesis", title: "Translation & Protein Synthesis" },
          { id: "gene-regulation-mutations", title: "Gene Regulation & Mutations" }
        ]
      },
      {
        id: "biochemistry",
        name: "Biochemistry",
        lessons: [
          { id: "amino-acids-protein-structure", title: "Amino Acids & Protein Structure" },
          { id: "enzymes-enzyme-kinetics", title: "Enzymes & Enzyme Kinetics" },
          { id: "carbohydrates-lipids", title: "Carbohydrates & Lipids" },
          { id: "nucleic-acids", title: "Nucleic Acids" },
          { id: "bioenergetics-atp", title: "Bioenergetics & ATP" },
          { id: "glycolysis-citric-acid-cycle", title: "Glycolysis & Citric Acid Cycle" },
          { id: "oxidative-phosphorylation", title: "Oxidative Phosphorylation" },
          { id: "metabolism-regulation", title: "Metabolism & Metabolic Regulation" }
        ]
      },
      {
        id: "organ-systems",
        name: "Organ Systems",
        lessons: [
          { id: "nervous-endocrine-systems", title: "Nervous & Endocrine Systems" },
          { id: "cardiovascular-respiratory-systems", title: "Cardiovascular & Respiratory Systems" },
          { id: "renal-fluid-balance", title: "Renal & Fluid Balance" },
          { id: "digestive-system-nutrition", title: "Digestive System & Nutrition" },
          { id: "immune-system", title: "Immune System" },
          { id: "reproductive-system-development", title: "Reproductive System & Development" }
        ]
      },
      {
        id: "evolution-ecology",
        name: "Evolution & Ecology",
        lessons: [
          { id: "evolution-genetics-ecology", title: "Evolution, Genetics & Ecology" }
        ]
      }
    ]
  },
  {
    id: "chem-phys",
    title: "Chemical & Physical Foundations of Biological Systems",
    shortTitle: "Chemical & Physical Foundations",
    subjects: [
      {
        id: "general-chemistry",
        name: "General Chemistry",
        lessons: [
          { id: "atomic-structure-periodic-trends", title: "Atomic Structure & Periodic Trends" },
          { id: "chemical-bonding-molecular-structure", title: "Chemical Bonding & Molecular Structure" },
          { id: "stoichiometry-chemical-reactions", title: "Stoichiometry & Chemical Reactions" },
          { id: "solutions-concentrations", title: "Solutions & Concentrations" },
          { id: "gases-liquids-solids", title: "Gases, Liquids & Solids" },
          { id: "thermochemistry-thermodynamics", title: "Thermochemistry & Thermodynamics" },
          { id: "chemical-equilibrium", title: "Chemical Equilibrium" },
          { id: "acids-bases-buffers", title: "Acids, Bases & Buffers" },
          { id: "redox-electrochemistry", title: "Redox & Electrochemistry" },
          { id: "chemical-kinetics", title: "Chemical Kinetics" }
        ]
      },
      {
        id: "organic-chemistry",
        name: "Organic Chemistry",
        lessons: [
          { id: "organic-structure-functional-groups", title: "Organic Structure & Functional Groups" },
          { id: "isomers-stereochemistry", title: "Isomers & Stereochemistry" },
          { id: "organic-reactions", title: "Organic Reactions" },
          { id: "carbonyls-carboxylic-acids-derivatives", title: "Carbonyls, Carboxylic Acids & Derivatives" },
          { id: "amines-amides-biological-molecules", title: "Amines, Amides & Biological Molecules" },
          { id: "organic-chemistry-spectroscopy", title: "Organic Chemistry & Spectroscopy" }
        ]
      },
      {
        id: "physics",
        name: "Physics",
        lessons: [
          { id: "units-math-graphs", title: "Units, Math & Graphs" },
          { id: "kinematics-newtonian-mechanics", title: "Kinematics & Newtonian Mechanics" },
          { id: "work-energy-momentum", title: "Work, Energy & Momentum" },
          { id: "fluids-pressure", title: "Fluids & Pressure" },
          { id: "physics-thermodynamics", title: "Thermodynamics" },
          { id: "electrostatics", title: "Electrostatics" },
          { id: "circuits-electricity", title: "Circuits & Electricity" },
          { id: "magnetism-electromagnetic-phenomena", title: "Magnetism & Electromagnetic Phenomena" },
          { id: "waves-sound-light-optics", title: "Waves, Sound, Light & Optics" }
        ]
      }
    ]
  },
  {
    id: "psych-social",
    title: "Psychological, Social & Biological Foundations of Behavior",
    shortTitle: "Psychological, Social & Biological Foundations",
    subjects: [
      {
        id: "psychology",
        name: "Psychology",
        lessons: [
          { id: "research-methods-statistics", title: "Research Methods & Statistics" },
          { id: "sensation-perception", title: "Sensation & Perception" },
          { id: "learning-conditioning", title: "Learning & Conditioning" },
          { id: "memory-cognition", title: "Memory & Cognition" },
          { id: "language-intelligence-problem-solving", title: "Language, Intelligence & Problem Solving" },
          { id: "emotion-motivation", title: "Emotion & Motivation" },
          { id: "consciousness-sleep", title: "Consciousness & Sleep" },
          { id: "personality", title: "Personality" },
          { id: "psychological-development", title: "Psychological Development" },
          { id: "psychological-disorders-mental-health", title: "Psychological Disorders & Mental Health" }
        ]
      },
      {
        id: "social-psychology",
        name: "Social Psychology",
        lessons: [
          { id: "social-interaction-groups", title: "Social Interaction & Groups" },
          { id: "attitudes-beliefs-behavior", title: "Attitudes, Beliefs & Behavior" },
          { id: "social-influence-conformity", title: "Social Influence & Conformity" },
          { id: "identity-culture-socialization", title: "Identity, Culture & Socialization" }
        ]
      },
      {
        id: "sociology",
        name: "Sociology",
        lessons: [
          { id: "social-structure-institutions", title: "Social Structure & Institutions" },
          { id: "social-stratification-inequality", title: "Social Stratification & Inequality" },
          { id: "race-ethnicity-gender", title: "Race, Ethnicity & Gender" },
          { id: "population-demographics", title: "Population & Demographics" },
          { id: "health-healthcare-social-determinants", title: "Health, Healthcare & Social Determinants" }
        ]
      },
      {
        id: "biological-bases",
        name: "Biological Foundations",
        lessons: [
          { id: "brain-behavior-hormones-genetics", title: "Brain, Behavior, Hormones & Genetics" }
        ]
      }
    ]
  },
  {
    id: "cars",
    title: "Critical Analysis & Reasoning Skills",
    shortTitle: "CARS",
    subjects: [
      {
        id: "cars-skills",
        name: "CARS Skills",
        lessons: [
          { id: "introduction-to-cars", title: "Introduction to CARS" },
          { id: "understanding-passage-structure", title: "Understanding Passage Structure" },
          { id: "finding-the-main-idea", title: "Finding the Main Idea" },
          { id: "authors-purpose-tone", title: "Author's Purpose & Tone" },
          { id: "making-inferences", title: "Making Inferences" },
          { id: "understanding-arguments-evidence", title: "Understanding Arguments & Evidence" },
          { id: "applying-passage-information", title: "Applying Passage Information" },
          { id: "eliminating-wrong-answers", title: "Eliminating Wrong Answers" },
          { id: "handling-difficult-passages", title: "Handling Difficult Passages" },
          { id: "reading-speed-timing", title: "Reading Speed & Timing" },
          { id: "humanities-social-science-passages", title: "Humanities & Social Science Passages" },
          { id: "full-cars-practice", title: "Full CARS Practice" }
        ]
      }
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

const cellBiologyLessons: LessonContent[] = [
  {
    id: "cell-structure-organelles",
    subjectId: "cell-biology",
    sectionId: "bio-biochem",
    title: "Cell Structure & Organelles",
    estimatedMinutes: 30,
    difficulty: "Beginner",
    prerequisiteLessonId: null,
    sections: [
      {
        heading: "Prokaryotic vs. Eukaryotic Cells",
        body: "Every living cell falls into one of two categories. Prokaryotic cells—bacteria and archaea—have no nucleus and no membrane-bound organelles; their single circular chromosome sits free in the cytoplasm, in a region called the nucleoid. Eukaryotic cells—found in animals, plants, fungi, and protists—are larger, more compartmentalized, and keep their DNA enclosed in a true, membrane-bound nucleus, with additional membrane-bound organelles dividing the cytoplasm into specialized workspaces.",
        keyTerms: [
          { term: "Prokaryote", definition: "A single-celled organism with no nucleus or membrane-bound organelles; DNA sits free in the nucleoid." },
          { term: "Eukaryote", definition: "An organism whose cells have a true, membrane-bound nucleus and other membrane-bound organelles." },
          { term: "Nucleoid", definition: "The irregular region in a prokaryotic cell where the circular chromosome is located." }
        ]
      },
      {
        heading: "The Endomembrane System",
        body: "Inside a eukaryotic cell, the nucleus, endoplasmic reticulum (ER), Golgi apparatus, lysosomes, and various vesicles form a connected production line called the endomembrane system. Rough ER (studded with ribosomes) synthesizes and folds proteins destined for secretion or membranes; smooth ER synthesizes lipids and detoxifies drugs. The Golgi apparatus receives proteins from the ER, modifies them further, and packages them into vesicles addressed for their final destination. Lysosomes—membrane-bound sacs of digestive enzymes—break down waste, worn-out organelles, and material taken in from outside the cell.",
        keyTerms: [
          { term: "Rough endoplasmic reticulum (RER)", definition: "ER studded with ribosomes; synthesizes and folds proteins for secretion or membrane insertion." },
          { term: "Golgi apparatus", definition: "Organelle that modifies, sorts, and packages proteins and lipids received from the ER for their final destination." },
          { term: "Lysosome", definition: "A membrane-bound organelle containing digestive enzymes that break down waste and damaged organelles." }
        ]
      },
      {
        heading: "Mitochondria and the Cytoskeleton",
        body: "Mitochondria generate the cell's ATP through aerobic respiration and are unusual among organelles in having their own circular DNA and double membrane—strong evidence they originated as free-living bacteria engulfed by an ancestral cell (the endosymbiotic theory). The cytoskeleton, a dynamic internal scaffold of microtubules, microfilaments, and intermediate filaments, gives the cell its shape, anchors organelles in place, and drives movement, from muscle contraction to the beating of cilia and flagella.",
        keyTerms: [
          { term: "Endosymbiotic theory", definition: "The theory that mitochondria (and chloroplasts) originated as free-living prokaryotes engulfed by an ancestral eukaryotic cell." },
          { term: "Microtubule", definition: "A cytoskeletal filament built from tubulin that helps maintain cell shape and forms the mitotic spindle and cilia/flagella." },
          { term: "Cytoskeleton", definition: "The internal network of protein filaments that gives a cell its shape, structural support, and capacity for movement." }
        ]
      }
    ],
    keyTakeaways: [
      "Prokaryotic cells lack a nucleus and membrane-bound organelles; eukaryotic cells have both.",
      "The endomembrane system—ER, Golgi, lysosomes, vesicles—works as a connected pipeline for building, modifying, and sorting proteins.",
      "Mitochondria's own DNA and double membrane are the key evidence behind the endosymbiotic theory."
    ],
    knowledgeCheck: [
      { question: "What is the key structural difference between a prokaryotic and a eukaryotic cell?", answer: "Eukaryotic cells have a true, membrane-bound nucleus and membrane-bound organelles; prokaryotic cells have neither—their DNA sits free in the nucleoid." },
      { question: "What evidence supports the endosymbiotic theory of mitochondrial origin?", answer: "Mitochondria have their own circular DNA and a double membrane, consistent with having once been free-living bacteria engulfed by an ancestral cell." }
    ],
    flashcards: [
      { front: "Prokaryote", back: "A single-celled organism with no nucleus or membrane-bound organelles." },
      { front: "Rough ER", back: "ER studded with ribosomes; builds and folds proteins for secretion or membranes." },
      { front: "Golgi apparatus", back: "Modifies, sorts, and packages proteins and lipids for their final destination." },
      { front: "Lysosome", back: "Membrane-bound sac of digestive enzymes that breaks down waste and damaged organelles." },
      { front: "Endosymbiotic theory", back: "Mitochondria and chloroplasts originated as free-living prokaryotes engulfed by an ancestral eukaryotic cell." }
    ],
    practiceQuestions: [
      {
        question: "Which feature is present in eukaryotic cells but absent in prokaryotic cells?",
        concept: "Prokaryotic vs. eukaryotic cells",
        options: ["Ribosomes", "A membrane-bound nucleus", "A plasma membrane", "Cytoplasm"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—both prokaryotes and eukaryotes have ribosomes.",
          "Correct—only eukaryotic cells enclose their DNA in a membrane-bound nucleus.",
          "Incorrect—all cells have a plasma membrane.",
          "Incorrect—all cells have cytoplasm."
        ]
      },
      {
        question: "A protein destined for secretion outside the cell is synthesized on the rough ER. What is the correct order of organelles it passes through?",
        concept: "Endomembrane system",
        options: ["Golgi → rough ER → vesicle", "Rough ER → Golgi → secretory vesicle", "Lysosome → rough ER → Golgi", "Rough ER → lysosome → Golgi"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—this reverses the order; the ER comes first.",
          "Correct—proteins are made and folded in the rough ER, modified and sorted in the Golgi, then packaged into a secretory vesicle.",
          "Incorrect—lysosomes digest material, they don't precede synthesis.",
          "Incorrect—lysosomes aren't part of this secretory pathway's order."
        ]
      },
      {
        question: "Which observation about mitochondria most directly supports the endosymbiotic theory?",
        concept: "Endosymbiotic theory",
        options: ["They produce ATP", "They have their own circular DNA and a double membrane", "They are found in most eukaryotic cells", "They are larger than ribosomes"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—ATP production alone doesn't imply a bacterial origin.",
          "Correct—circular DNA and a double membrane are hallmarks of a formerly free-living prokaryote.",
          "Incorrect—prevalence doesn't indicate evolutionary origin.",
          "Incorrect—size comparison is irrelevant to the theory."
        ]
      },
      {
        question: "A cell exposed to a toxin shows a large increase in smooth ER. What is the most likely function of this response?",
        concept: "Endomembrane system",
        options: ["Increased protein synthesis for secretion", "Increased lipid synthesis and detoxification", "Increased digestion of the toxin by lysosomes", "Increased DNA replication"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—protein synthesis is primarily a rough ER function.",
          "Correct—smooth ER handles lipid synthesis and detoxification of drugs and toxins.",
          "Incorrect—lysosomal digestion isn't an ER function.",
          "Incorrect—DNA replication occurs in the nucleus, not the ER."
        ]
      },
      {
        question: "Which cytoskeletal component forms the mitotic spindle during cell division?",
        concept: "Cytoskeleton",
        options: ["Microfilaments", "Intermediate filaments", "Microtubules", "Golgi vesicles"],
        correctIndex: 2,
        optionExplanations: [
          "Incorrect—microfilaments are involved in muscle contraction and cell shape, not the spindle.",
          "Incorrect—intermediate filaments provide mechanical strength, not the spindle.",
          "Correct—microtubules, built from tubulin, form the mitotic spindle that separates chromosomes.",
          "Incorrect—Golgi vesicles are unrelated to spindle formation."
        ]
      }
    ],
    simplifiedExplanation: "Picture a eukaryotic cell as a small factory: the nucleus is the head office holding the blueprints (DNA), the rough ER and Golgi are the assembly line building and packaging proteins, lysosomes are the cleanup crew, and mitochondria are the power plant—one with its own separate ID card (DNA) because it used to be its own company before merging in. A prokaryotic cell skips all these separate departments—everything happens in one open room."
  },
  {
    id: "cell-membranes-transport",
    subjectId: "cell-biology",
    sectionId: "bio-biochem",
    title: "Cell Membranes & Transport",
    estimatedMinutes: 30,
    difficulty: "Intermediate",
    prerequisiteLessonId: "cell-structure-organelles",
    sections: [
      {
        heading: "The Fluid Mosaic Model",
        body: "The plasma membrane is described by the fluid mosaic model: a phospholipid bilayer, with hydrophilic (water-loving) heads facing outward toward the watery environments on both sides and hydrophobic (water-fearing) tails facing inward, away from water. Proteins, cholesterol, and carbohydrates are embedded throughout this bilayer, forming a shifting, fluid mosaic rather than a fixed structure—components can drift laterally within the membrane's plane.",
        keyTerms: [
          { term: "Phospholipid bilayer", definition: "Two layers of phospholipids arranged with hydrophilic heads outward and hydrophobic tails inward, forming the core of the plasma membrane." },
          { term: "Amphipathic", definition: "Having both a hydrophilic (polar) region and a hydrophobic (nonpolar) region, as phospholipids do." },
          { term: "Selective permeability", definition: "The membrane's property of allowing some substances to cross more easily than others." }
        ]
      },
      {
        heading: "Passive Transport",
        body: "Passive transport moves substances across the membrane without using cellular energy, always down a concentration gradient (from high to low concentration). Simple diffusion lets small, nonpolar molecules like O2 and CO2 pass directly through the lipid bilayer. Osmosis is the diffusion of water specifically, moving toward the side with higher solute concentration. Facilitated diffusion uses membrane channel or carrier proteins to help larger or charged molecules—like glucose or ions—cross, still moving down their gradient and still requiring no energy.",
        keyTerms: [
          { term: "Diffusion", definition: "The net movement of molecules from an area of high concentration to an area of low concentration." },
          { term: "Osmosis", definition: "The diffusion of water across a selectively permeable membrane, from low to high solute concentration." },
          { term: "Facilitated diffusion", definition: "Passive movement of a substance across a membrane with the help of a channel or carrier protein, still down its concentration gradient." }
        ]
      },
      {
        heading: "Active Transport & Bulk Transport",
        body: "Active transport moves substances against their concentration gradient—from low to high concentration—which requires energy, usually from ATP. The sodium-potassium pump is a classic example, using ATP to move Na+ out of the cell and K+ in, both against their gradients. For particles too large to cross the membrane directly, cells use bulk transport: endocytosis brings material into the cell by engulfing it in a vesicle formed from the plasma membrane, and exocytosis releases material out of the cell by fusing a vesicle with the plasma membrane.",
        keyTerms: [
          { term: "Active transport", definition: "Movement of a substance across a membrane against its concentration gradient, requiring energy (usually ATP)." },
          { term: "Sodium-potassium pump", definition: "An active transport protein that uses ATP to move Na+ out of and K+ into the cell, both against their gradients." },
          { term: "Endocytosis/exocytosis", definition: "Bulk transport processes that bring material into (endocytosis) or release material out of (exocytosis) the cell via vesicles." }
        ]
      }
    ],
    keyTakeaways: [
      "The fluid mosaic model describes the membrane as a dynamic phospholipid bilayer with embedded, laterally mobile proteins.",
      "Passive transport (diffusion, osmosis, facilitated diffusion) moves substances down their gradient and needs no energy.",
      "Active transport moves substances against their gradient and always requires energy, typically from ATP."
    ],
    knowledgeCheck: [
      { question: "What distinguishes facilitated diffusion from simple diffusion?", answer: "Facilitated diffusion uses a channel or carrier protein to help a substance cross the membrane, while simple diffusion occurs directly through the lipid bilayer—but both are passive and move down the concentration gradient." },
      { question: "Why does active transport require ATP?", answer: "Because it moves substances against their concentration gradient, from low to high concentration, which is energetically unfavorable and requires an outside energy input." }
    ],
    flashcards: [
      { front: "Fluid mosaic model", back: "Describes the membrane as a dynamic phospholipid bilayer with embedded proteins that can move laterally." },
      { front: "Osmosis", back: "Diffusion of water across a membrane, from low to high solute concentration." },
      { front: "Facilitated diffusion", back: "Passive transport of a substance via a channel/carrier protein, still down its gradient." },
      { front: "Sodium-potassium pump", back: "Active transport protein using ATP to move Na+ out and K+ into the cell, against their gradients." },
      { front: "Endocytosis", back: "Bulk transport bringing material into the cell by engulfing it in a vesicle." }
    ],
    practiceQuestions: [
      {
        question: "A red blood cell placed in a hypotonic solution swells and may burst. What process causes this?",
        concept: "Osmosis",
        options: ["Active transport of water into the cell", "Osmosis, as water moves into the cell toward the higher solute concentration inside", "Facilitated diffusion of solutes out of the cell", "Exocytosis of excess water"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—water movement via osmosis is passive, not active.",
          "Correct—in a hypotonic (low-solute) external solution, water moves into the cell by osmosis, toward the higher internal solute concentration.",
          "Incorrect—this describes solute movement, not the water movement causing swelling.",
          "Incorrect—exocytosis releases material via vesicles, not simple water movement."
        ]
      },
      {
        question: "Glucose transport into most cells requires a carrier protein even though it moves down its concentration gradient. This is an example of:",
        concept: "Facilitated diffusion",
        options: ["Active transport", "Facilitated diffusion", "Simple diffusion", "Exocytosis"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—active transport requires energy and moves against the gradient; glucose here moves down its gradient.",
          "Correct—a carrier protein assists movement down the gradient without using energy: facilitated diffusion.",
          "Incorrect—simple diffusion doesn't require a protein; glucose is too polar to cross the bilayer directly.",
          "Incorrect—exocytosis involves vesicle fusion, not carrier-protein transport."
        ]
      },
      {
        question: "The sodium-potassium pump moves 3 Na+ out and 2 K+ in per cycle, both against their gradients. What must be true for this to occur?",
        concept: "Active transport",
        options: ["The process requires no energy input", "ATP must be hydrolyzed to power the pump", "Both ions are moving down their gradients", "The membrane must be freely permeable to both ions"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—moving ions against their gradients is energetically unfavorable and requires energy.",
          "Correct—active transport against a gradient requires ATP hydrolysis to supply the needed energy.",
          "Incorrect—by definition, active transport moves ions against their gradients.",
          "Incorrect—if the membrane were freely permeable, no pump would be needed to maintain the gradient."
        ]
      },
      {
        question: "Which best describes why the plasma membrane is called a 'fluid mosaic'?",
        concept: "Fluid mosaic model",
        options: ["It is a rigid, fixed structure of only lipids", "It is composed of a variety of embedded components that can move laterally within the bilayer", "It only allows water to pass through", "It is made entirely of proteins"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—the membrane is dynamic, not rigid, and contains more than lipids.",
          "Correct—'mosaic' refers to the mix of embedded proteins, cholesterol, and carbohydrates, and 'fluid' refers to their lateral mobility.",
          "Incorrect—the membrane is selectively permeable to many substances, not only water.",
          "Incorrect—the membrane's core is a phospholipid bilayer, not pure protein."
        ]
      }
    ],
    simplifiedExplanation: "Think of the membrane as a flexible, buttered cracker: the 'butter' layer (phospholipids) has water-loving heads on the outside and water-fearing tails hidden inside, with protein 'raisins' scattered throughout that can drift around. Passive transport is like water flowing downhill—no energy needed, always toward the lower-concentration side. Active transport is like pumping water uphill—it takes energy (ATP) because it moves the opposite way."
  },
  {
    id: "cell-communication-signaling",
    subjectId: "cell-biology",
    sectionId: "bio-biochem",
    title: "Cell Communication & Signaling",
    estimatedMinutes: 30,
    difficulty: "Intermediate",
    prerequisiteLessonId: "cell-membranes-transport",
    sections: [
      {
        heading: "Types of Cell Signaling",
        body: "Cells communicate using signaling molecules that travel different distances. In autocrine signaling, a cell releases a signal that acts on itself. In paracrine signaling, a cell releases a signal that acts on nearby cells, diffusing only a short distance. In endocrine signaling, specialized cells release hormones into the bloodstream that travel throughout the body to reach distant target cells. Direct contact signaling occurs when adjacent cells communicate through gap junctions or by binding surface molecules directly, without a diffusible signal at all.",
        keyTerms: [
          { term: "Paracrine signaling", definition: "Cell signaling in which a released molecule diffuses a short distance to act on nearby cells." },
          { term: "Endocrine signaling", definition: "Cell signaling in which hormones travel through the bloodstream to act on distant target cells." },
          { term: "Gap junction", definition: "A direct channel connecting the cytoplasm of adjacent cells, allowing ions and small molecules to pass between them." }
        ]
      },
      {
        heading: "Receptors and Signal Transduction",
        body: "A signaling molecule (ligand) only affects cells that have the matching receptor. G-protein coupled receptors (GPCRs) span the membrane and, when activated, trigger an internal G-protein that activates an enzyme producing a second messenger, such as cyclic AMP (cAMP), which then relays and amplifies the signal inside the cell. Receptor tyrosine kinases (RTKs) are a different receptor class: ligand binding causes two receptors to pair up (dimerize) and add phosphate groups to each other, kicking off a phosphorylation cascade that relays the signal onward.",
        keyTerms: [
          { term: "G-protein coupled receptor (GPCR)", definition: "A membrane receptor that, upon ligand binding, activates an internal G-protein to trigger a second-messenger cascade." },
          { term: "Second messenger", definition: "A small intracellular molecule, such as cAMP, that relays and amplifies a signal after receptor activation." },
          { term: "Receptor tyrosine kinase (RTK)", definition: "A membrane receptor that dimerizes and phosphorylates itself upon ligand binding, triggering a signaling cascade." }
        ]
      },
      {
        heading: "Signal Amplification and Response",
        body: "A key feature of signal transduction pathways is amplification: one activated receptor can activate many G-proteins, each of which can generate many second messenger molecules, so a tiny number of hormone molecules outside the cell can produce a large response inside it. The pathway ultimately alters the target cell's behavior—turning genes on or off, opening ion channels, or activating metabolic enzymes—and is shut off through mechanisms like receptor internalization or second-messenger degradation, so the response doesn't run indefinitely.",
        keyTerms: [
          { term: "Signal amplification", definition: "The process by which a small initial signal produces a much larger intracellular response through cascading activation steps." },
          { term: "Phosphorylation cascade", definition: "A chain reaction in which one activated kinase phosphorylates and activates the next, relaying a signal through the cell." }
        ]
      }
    ],
    keyTakeaways: [
      "Cell signaling ranges from short-range (autocrine, paracrine) to long-range (endocrine) to direct contact (gap junctions).",
      "GPCRs use second messengers like cAMP; receptor tyrosine kinases dimerize and phosphorylate to start a signaling cascade.",
      "Signal transduction pathways amplify a small extracellular signal into a large, precisely controlled intracellular response."
    ],
    knowledgeCheck: [
      { question: "What is the difference between paracrine and endocrine signaling?", answer: "Paracrine signals diffuse a short distance to act on nearby cells; endocrine signals (hormones) travel through the bloodstream to act on distant target cells." },
      { question: "Why is signal amplification important in a signaling pathway?", answer: "It allows a small number of extracellular signaling molecules to produce a large, effective response inside the target cell through a cascading series of activation steps." }
    ],
    flashcards: [
      { front: "Autocrine signaling", back: "A cell releases a signal that acts on itself." },
      { front: "Endocrine signaling", back: "Hormones travel through the bloodstream to act on distant target cells." },
      { front: "GPCR", back: "Membrane receptor that activates a G-protein, triggering a second-messenger cascade like cAMP." },
      { front: "Receptor tyrosine kinase", back: "Receptor that dimerizes and phosphorylates itself upon ligand binding, starting a signaling cascade." },
      { front: "Signal amplification", back: "A small extracellular signal produces a much larger intracellular response through cascading steps." }
    ],
    practiceQuestions: [
      {
        question: "A hormone released by the pancreas travels through the blood to act on liver cells far away. This is an example of:",
        concept: "Types of cell signaling",
        options: ["Autocrine signaling", "Paracrine signaling", "Endocrine signaling", "Direct contact signaling"],
        correctIndex: 2,
        optionExplanations: [
          "Incorrect—autocrine signaling means the cell signals itself.",
          "Incorrect—paracrine signaling acts only on nearby cells.",
          "Correct—travel through the bloodstream to a distant target is the definition of endocrine signaling.",
          "Incorrect—no direct cell-to-cell contact is described here."
        ]
      },
      {
        question: "A GPCR is activated by its ligand and triggers a rise in intracellular cAMP. What is cAMP acting as?",
        concept: "Signal transduction",
        options: ["The original ligand", "A second messenger", "A receptor tyrosine kinase", "A gap junction protein"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—the ligand is the extracellular signal, not cAMP.",
          "Correct—cAMP is a classic second messenger that relays and amplifies the signal inside the cell.",
          "Incorrect—cAMP is not a receptor.",
          "Incorrect—gap junctions are unrelated to GPCR signaling."
        ]
      },
      {
        question: "Which best explains why a very low concentration of a hormone can still produce a large cellular response?",
        concept: "Signal amplification",
        options: ["Hormones are always present in high concentration", "Each activation step in the signaling cascade can activate multiple downstream molecules, amplifying the signal", "The hormone directly enters the nucleus and acts alone", "Second messengers block the receptor"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—the premise is that hormone concentration is low, not high.",
          "Correct—cascading activation at each step multiplies the effect of the original signal.",
          "Incorrect—most hormones act via surface receptors, not by entering the nucleus directly.",
          "Incorrect—second messengers relay and amplify signals; they don't block the receptor."
        ]
      },
      {
        question: "Receptor tyrosine kinases differ from GPCRs in that RTKs:",
        concept: "Receptor types",
        options: ["Use G-proteins as their primary activation step", "Dimerize and phosphorylate each other upon ligand binding", "Only respond to hormones traveling in the bloodstream", "Cannot trigger a signaling cascade"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—that describes GPCRs, not RTKs.",
          "Correct—RTK activation involves dimerization and mutual phosphorylation, distinct from the GPCR mechanism.",
          "Incorrect—RTKs respond to a variety of ligands, not just bloodstream hormones.",
          "Incorrect—RTKs do trigger phosphorylation cascades."
        ]
      }
    ],
    simplifiedExplanation: "Cells 'talk' at different ranges: whispering to themselves (autocrine), talking to a neighbor (paracrine), or shouting through a citywide phone system that only cells with the right 'phone' (receptor) can hear (endocrine). Once a receptor 'picks up,' it doesn't just relay one message—it triggers a chain reaction that turns one signal into a loud, cell-wide response, the same way one phone call can trigger an entire phone tree."
  },
  {
    id: "cell-cycle-mitosis-meiosis",
    subjectId: "cell-biology",
    sectionId: "bio-biochem",
    title: "Cell Cycle, Mitosis & Meiosis",
    estimatedMinutes: 35,
    difficulty: "Intermediate",
    prerequisiteLessonId: "cell-communication-signaling",
    sections: [
      {
        heading: "The Cell Cycle and Checkpoints",
        body: "The cell cycle is the ordered sequence a cell follows between divisions: interphase (G1, S, G2) followed by mitosis (M phase). During G1, the cell grows and carries out its normal functions; during S phase, it replicates its entire DNA; during G2, it prepares for division. Checkpoints at the end of G1, G2, and during M phase verify that DNA is undamaged and correctly replicated before allowing the cycle to proceed—when checkpoints fail, uncontrolled division can result, which is the basis of cancer.",
        keyTerms: [
          { term: "Interphase", definition: "The period between cell divisions, consisting of G1, S, and G2 phases, during which the cell grows and replicates its DNA." },
          { term: "Checkpoint", definition: "A control point in the cell cycle where the cell verifies conditions (like undamaged DNA) are met before proceeding." },
          { term: "S phase", definition: "The phase of interphase during which the cell's entire DNA is replicated." }
        ]
      },
      {
        heading: "Mitosis",
        body: "Mitosis divides one cell's replicated chromosomes into two genetically identical daughter cells, used for growth and tissue repair. It proceeds through four phases: prophase, when chromosomes condense and the spindle begins to form; metaphase, when chromosomes align at the cell's equator; anaphase, when sister chromatids are pulled apart to opposite poles; and telophase, when two new nuclei form, followed by cytokinesis, which physically splits the cytoplasm into two cells.",
        keyTerms: [
          { term: "Sister chromatids", definition: "Two identical copies of a replicated chromosome, joined at the centromere until anaphase." },
          { term: "Anaphase", definition: "The mitotic phase in which sister chromatids are pulled apart and move to opposite poles of the cell." },
          { term: "Cytokinesis", definition: "The physical division of the cytoplasm into two separate daughter cells, following the division of the nucleus." }
        ]
      },
      {
        heading: "Meiosis and Genetic Variation",
        body: "Meiosis produces gametes (sperm and egg) through two rounds of division (meiosis I and II) but only one round of DNA replication, halving the chromosome number from diploid to haploid. Meiosis I separates homologous chromosome pairs; meiosis II separates sister chromatids, similar to mitosis. Two mechanisms generate genetic variation during meiosis: crossing over, where homologous chromosomes exchange segments during prophase I, and independent assortment, where each pair of homologous chromosomes lines up and separates independently of the others.",
        keyTerms: [
          { term: "Homologous chromosomes", definition: "A matched pair of chromosomes, one from each parent, carrying genes for the same traits at the same locations." },
          { term: "Crossing over", definition: "The exchange of genetic material between homologous chromosomes during prophase I of meiosis, increasing genetic variation." },
          { term: "Independent assortment", definition: "The random, independent separation of homologous chromosome pairs during meiosis I, contributing to genetic variation." }
        ]
      }
    ],
    keyTakeaways: [
      "The cell cycle (G1, S, G2, M) is controlled by checkpoints that prevent division of damaged or incompletely replicated DNA.",
      "Mitosis produces two genetically identical diploid daughter cells through prophase, metaphase, anaphase, and telophase.",
      "Meiosis produces four genetically distinct haploid gametes through two divisions, with crossing over and independent assortment driving variation."
    ],
    knowledgeCheck: [
      { question: "What is the functional difference between mitosis and meiosis?", answer: "Mitosis produces two genetically identical diploid cells for growth and repair; meiosis produces four genetically distinct haploid gametes for sexual reproduction." },
      { question: "Name two mechanisms during meiosis that generate genetic variation.", answer: "Crossing over (exchange of segments between homologous chromosomes) and independent assortment (random orientation of homologous pairs during meiosis I)." }
    ],
    flashcards: [
      { front: "Interphase", back: "G1, S, and G2 phases—the cell grows and replicates its DNA between divisions." },
      { front: "Checkpoint", back: "A cell cycle control point verifying conditions (like undamaged DNA) before proceeding." },
      { front: "Anaphase", back: "Sister chromatids are pulled apart and move to opposite poles." },
      { front: "Crossing over", back: "Exchange of genetic material between homologous chromosomes during prophase I, increasing variation." },
      { front: "Independent assortment", back: "Random, independent separation of homologous chromosome pairs during meiosis I." }
    ],
    practiceQuestions: [
      {
        question: "During which phase of the cell cycle does DNA replication occur?",
        concept: "Cell cycle",
        options: ["G1", "S phase", "G2", "M phase"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—G1 is a growth phase before replication.",
          "Correct—S phase is specifically when the entire genome is replicated.",
          "Incorrect—G2 is preparation for division, after replication is complete.",
          "Incorrect—M phase is mitosis itself, after DNA has already been replicated."
        ]
      },
      {
        question: "A cell with damaged DNA fails to arrest at the G1 checkpoint and continues dividing. What is the most likely consequence?",
        concept: "Cell cycle checkpoints",
        options: ["The cell will repair the DNA automatically during mitosis", "The damaged DNA may be replicated and passed to daughter cells, potentially leading to uncontrolled division", "The cell will immediately undergo meiosis instead", "Nothing—checkpoints have no effect on cell division"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—mitosis doesn't repair DNA; checkpoints exist specifically to catch damage beforehand.",
          "Correct—bypassing the checkpoint lets damaged DNA propagate, which is a key mechanism underlying cancer.",
          "Incorrect—somatic cells with checkpoint failure don't switch to meiosis.",
          "Incorrect—checkpoints are critical controls; failure has real consequences."
        ]
      },
      {
        question: "How many rounds of DNA replication and division occur in meiosis?",
        concept: "Meiosis",
        options: ["Two rounds of replication, one round of division", "One round of replication, two rounds of division", "Two rounds of both replication and division", "One round of both replication and division"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—meiosis involves only one round of DNA replication.",
          "Correct—DNA is replicated once, then the cell divides twice (meiosis I and II), halving the chromosome number.",
          "Incorrect—replication happens only once, not twice.",
          "Incorrect—this describes mitosis, not meiosis, which divides twice."
        ]
      },
      {
        question: "Crossing over during prophase I directly results in:",
        concept: "Genetic variation in meiosis",
        options: ["Doubling of chromosome number", "Exchange of genetic segments between homologous chromosomes", "Separation of sister chromatids", "Formation of a diploid gamete"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—crossing over doesn't change chromosome number.",
          "Correct—crossing over is the physical exchange of DNA segments between homologous chromosomes.",
          "Incorrect—sister chromatid separation happens later, in anaphase II, not during crossing over.",
          "Incorrect—meiosis produces haploid gametes, not diploid."
        ]
      },
      {
        question: "Which phase of mitosis is characterized by chromosomes aligning at the cell's equator?",
        concept: "Mitosis",
        options: ["Prophase", "Metaphase", "Anaphase", "Telophase"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—prophase is when chromosomes condense and the spindle begins forming.",
          "Correct—metaphase is defined by chromosome alignment at the metaphase plate (cell equator).",
          "Incorrect—anaphase is when chromatids are pulled apart, after alignment.",
          "Incorrect—telophase is when new nuclei form, after separation is complete."
        ]
      }
    ],
    simplifiedExplanation: "The cell cycle is a checklist with built-in inspections: grow (G1), copy the DNA (S), double-check everything (G2), then divide (M)—with checkpoints acting like inspectors who stop the line if something's wrong. Mitosis is photocopying: one cell becomes two identical copies. Meiosis is more like shuffling and dealing a deck of cards twice: one round of copying, two rounds of dealing, so each of the four resulting hands (gametes) is unique and has half the original cards."
  }
];

const geneticsLessons: LessonContent[] = [
  {
    id: "mendelian-genetics-inheritance",
    subjectId: "genetics-molecular-biology",
    sectionId: "bio-biochem",
    title: "Mendelian Genetics & Inheritance",
    estimatedMinutes: 30,
    difficulty: "Beginner",
    prerequisiteLessonId: null,
    sections: [
      {
        heading: "Mendel's Laws",
        body: "Gregor Mendel's pea-plant experiments established two foundational laws. The law of segregation states that an organism's two alleles for a gene separate during gamete formation, so each gamete carries only one allele. The law of independent assortment states that alleles for different genes—located on different chromosomes—segregate independently of one another during gamete formation, so the inheritance of one trait doesn't affect the inheritance of another.",
        keyTerms: [
          { term: "Allele", definition: "One of the alternative versions of a gene that can occupy a given position (locus) on a chromosome." },
          { term: "Law of segregation", definition: "An organism's two alleles for a gene separate during gamete formation, so each gamete gets only one." },
          { term: "Law of independent assortment", definition: "Alleles of different genes on different chromosomes segregate independently during gamete formation." }
        ]
      },
      {
        heading: "Genotype, Phenotype, and Punnett Squares",
        body: "Genotype is an organism's actual allele combination (e.g., Aa); phenotype is the observable trait that results (e.g., purple flowers). An organism is homozygous if it carries two identical alleles for a gene (AA or aa) and heterozygous if it carries two different alleles (Aa). For a dominant allele (A), only one copy is needed to produce the dominant phenotype; a recessive allele (a) only shows its phenotype when homozygous (aa). A Punnett square predicts the genotype and phenotype ratios of offspring from a given cross.",
        keyTerms: [
          { term: "Genotype", definition: "An organism's actual genetic makeup for a given gene, e.g., AA, Aa, or aa." },
          { term: "Phenotype", definition: "The observable physical or biochemical trait resulting from an organism's genotype." },
          { term: "Homozygous/heterozygous", definition: "Carrying two identical alleles (homozygous) or two different alleles (heterozygous) for a gene." }
        ]
      },
      {
        heading: "Beyond Simple Dominance",
        body: "Not all inheritance follows simple dominant/recessive patterns. In incomplete dominance, heterozygotes show a blended intermediate phenotype (e.g., red x white = pink flowers). In codominance, heterozygotes show both parental phenotypes fully and simultaneously (e.g., AB blood type). Some genes have more than two possible alleles in a population (multiple alleles), as with the ABO blood group. Sex-linked traits are carried on the X or Y chromosome, causing them to be inherited differently in males and females—since males have only one X, a single recessive X-linked allele produces the recessive phenotype.",
        keyTerms: [
          { term: "Incomplete dominance", definition: "A heterozygote shows a blended, intermediate phenotype between the two homozygous phenotypes." },
          { term: "Codominance", definition: "A heterozygote fully expresses both parental phenotypes simultaneously." },
          { term: "Sex-linked trait", definition: "A trait carried on a sex chromosome (usually X), inherited differently between males and females." }
        ]
      }
    ],
    keyTakeaways: [
      "Mendel's law of segregation and law of independent assortment describe how alleles separate and combine during gamete formation.",
      "Genotype is the allele combination; phenotype is the observable trait it produces—dominant alleles mask recessive ones only when heterozygous.",
      "Incomplete dominance, codominance, multiple alleles, and sex-linkage are all real deviations from simple Mendelian dominance."
    ],
    knowledgeCheck: [
      { question: "What is the difference between the law of segregation and the law of independent assortment?", answer: "Segregation describes how the two alleles of a single gene separate into different gametes; independent assortment describes how alleles of different genes on different chromosomes assort independently of each other." },
      { question: "Why does a single recessive X-linked allele produce the recessive phenotype in males but not in females?", answer: "Males have only one X chromosome, so a single recessive allele is unmasked; females have two X chromosomes, so a dominant allele on the other X can mask the recessive one." }
    ],
    flashcards: [
      { front: "Law of segregation", back: "An organism's two alleles for a gene separate during gamete formation." },
      { front: "Law of independent assortment", back: "Alleles of different genes on different chromosomes segregate independently." },
      { front: "Incomplete dominance", back: "Heterozygotes show a blended, intermediate phenotype." },
      { front: "Codominance", back: "Heterozygotes fully express both parental phenotypes at once." },
      { front: "Sex-linked trait", back: "A trait carried on a sex chromosome, inherited differently in males and females." }
    ],
    practiceQuestions: [
      {
        question: "Two heterozygous (Aa) pea plants are crossed. What fraction of offspring is expected to be homozygous recessive (aa)?",
        concept: "Punnett squares",
        options: ["1/4", "1/2", "3/4", "1"],
        correctIndex: 0,
        optionExplanations: [
          "Correct—an Aa x Aa cross produces a 1:2:1 genotype ratio (AA:Aa:aa), so 1/4 are aa.",
          "Incorrect—1/2 is the fraction of heterozygotes (Aa), not homozygous recessive.",
          "Incorrect—3/4 is the fraction showing the dominant phenotype, not the aa genotype specifically.",
          "Incorrect—not all offspring are aa."
        ]
      },
      {
        question: "In snapdragons, a cross between red-flowered (RR) and white-flowered (WW) plants produces all pink-flowered offspring. This is an example of:",
        concept: "Incomplete dominance",
        options: ["Codominance", "Incomplete dominance", "Sex linkage", "Multiple alleles"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—codominance would show both red and white simultaneously (e.g., spots), not a blend.",
          "Correct—a blended, intermediate phenotype (pink) is the hallmark of incomplete dominance.",
          "Incorrect—no sex chromosome involvement is described.",
          "Incorrect—only two alleles (R and W) are described, not multiple."
        ]
      },
      {
        question: "Human ABO blood type involves alleles IA, IB, and i, where IA and IB are codominant and both are dominant to i. A person with genotype IAIB has which blood type?",
        concept: "Codominance and multiple alleles",
        options: ["Type A", "Type B", "Type AB", "Type O"],
        correctIndex: 2,
        optionExplanations: [
          "Incorrect—Type A would require genotype IAIA or IAi.",
          "Incorrect—Type B would require genotype IBIB or IBi.",
          "Correct—IA and IB are codominant, so IAIB expresses both A and B antigens: type AB.",
          "Incorrect—Type O requires genotype ii."
        ]
      },
      {
        question: "A color-blind (X-linked recessive) man and a homozygous non-carrier woman have children. What proportion of their daughters will be color-blind?",
        concept: "Sex-linked inheritance",
        options: ["0%", "25%", "50%", "100%"],
        correctIndex: 0,
        optionExplanations: [
          "Correct—all daughters receive the father's affected X and the mother's unaffected X, making them carriers (heterozygous) but not color-blind.",
          "Incorrect—the actual figure among daughters is 0%, since none are homozygous recessive.",
          "Incorrect—50% describes sons' risk in some other crosses, not daughters here.",
          "Incorrect—daughters would need two recessive alleles to be color-blind, which doesn't happen in this cross."
        ]
      }
    ],
    simplifiedExplanation: "Think of alleles as two tickets in a raffle drum for each trait—segregation means only one ticket gets pulled per gamete, and independent assortment means the drum for eye color and the drum for height are pulled separately, not linked. Dominant/recessive is the simple version of the raffle; incomplete dominance and codominance are variations where the 'winning' ticket blends with or shares the stage with the other, instead of one hiding the other completely."
  },
  {
    id: "dna-replication-repair",
    subjectId: "genetics-molecular-biology",
    sectionId: "bio-biochem",
    title: "DNA Replication & Repair",
    estimatedMinutes: 30,
    difficulty: "Intermediate",
    prerequisiteLessonId: "mendelian-genetics-inheritance",
    sections: [
      {
        heading: "Semiconservative Replication",
        body: "DNA replication is semiconservative: each new double helix contains one original (parental) strand and one newly synthesized strand. Replication begins at an origin of replication, where helicase unwinds and separates the two DNA strands, creating a replication fork. Primase then lays down a short RNA primer, giving DNA polymerase a starting point, since DNA polymerase can only add nucleotides to an existing strand—it cannot start a new one from scratch.",
        keyTerms: [
          { term: "Semiconservative replication", definition: "DNA replication in which each new double helix contains one original strand and one newly synthesized strand." },
          { term: "Helicase", definition: "The enzyme that unwinds and separates the two strands of the DNA double helix at the replication fork." },
          { term: "Primase", definition: "The enzyme that synthesizes a short RNA primer to give DNA polymerase a starting point." }
        ]
      },
      {
        heading: "Leading vs. Lagging Strand",
        body: "DNA polymerase can only synthesize new DNA in the 5' to 3' direction. Because the two parental strands run antiparallel, one new strand (the leading strand) is synthesized continuously toward the replication fork, while the other (the lagging strand) is synthesized discontinuously, away from the fork, in short segments called Okazaki fragments. DNA ligase later seals the gaps between Okazaki fragments into one continuous strand.",
        keyTerms: [
          { term: "Leading strand", definition: "The new DNA strand synthesized continuously in the same direction as the replication fork moves." },
          { term: "Lagging strand", definition: "The new DNA strand synthesized discontinuously, in short Okazaki fragments, away from the replication fork." },
          { term: "DNA ligase", definition: "The enzyme that seals the gaps between Okazaki fragments into one continuous DNA strand." }
        ]
      },
      {
        heading: "DNA Repair Mechanisms",
        body: "DNA polymerase has proofreading ability, immediately checking and correcting most misincorporated bases as it replicates. Mismatch repair scans newly replicated DNA afterward for any remaining errors the proofreading missed. Nucleotide excision repair removes and replaces damaged or bulky DNA segments—such as UV-induced thymine dimers—by cutting out the damaged section and resynthesizing it using the undamaged strand as a template. Together, these layered mechanisms keep the mutation rate extremely low.",
        keyTerms: [
          { term: "Proofreading", definition: "DNA polymerase's ability to detect and correct a misincorporated base immediately during replication." },
          { term: "Mismatch repair", definition: "A repair system that scans newly replicated DNA for base-pairing errors missed by proofreading." },
          { term: "Nucleotide excision repair", definition: "A repair system that removes and replaces damaged or bulky DNA segments, such as UV-induced thymine dimers." }
        ]
      }
    ],
    keyTakeaways: [
      "DNA replication is semiconservative—each new helix has one old strand and one new strand.",
      "The leading strand synthesizes continuously; the lagging strand synthesizes discontinuously as Okazaki fragments, joined by ligase.",
      "Proofreading, mismatch repair, and nucleotide excision repair work together to keep DNA replication highly accurate."
    ],
    knowledgeCheck: [
      { question: "Why does the lagging strand need to be synthesized in short fragments?", answer: "Because DNA polymerase only synthesizes 5' to 3', and the lagging strand runs in the opposite direction from the replication fork's movement, so it must be built discontinuously as Okazaki fragments and later joined by ligase." },
      { question: "What is the difference between proofreading and mismatch repair?", answer: "Proofreading happens during replication, as DNA polymerase immediately corrects a misincorporated base; mismatch repair happens afterward, scanning the newly replicated DNA for any errors proofreading missed." }
    ],
    flashcards: [
      { front: "Semiconservative replication", back: "Each new DNA helix has one original strand and one newly synthesized strand." },
      { front: "Helicase", back: "Unwinds and separates the two DNA strands at the replication fork." },
      { front: "Leading strand", back: "Synthesized continuously in the direction of the replication fork." },
      { front: "Okazaki fragments", back: "Short DNA segments making up the discontinuously synthesized lagging strand." },
      { front: "Nucleotide excision repair", back: "Removes and replaces damaged/bulky DNA segments, like UV-induced thymine dimers." }
    ],
    practiceQuestions: [
      {
        question: "The Meselson-Stahl experiment demonstrated that DNA replication is:",
        concept: "Semiconservative replication",
        options: ["Conservative", "Semiconservative", "Dispersive", "Random"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—conservative replication (both original strands staying together) was ruled out.",
          "Correct—each new helix contains one original and one new strand, confirming semiconservative replication.",
          "Incorrect—dispersive replication (mixed old/new within each strand) was also ruled out.",
          "Incorrect—replication is not random; it follows a specific, well-defined mechanism."
        ]
      },
      {
        question: "Why is the lagging strand synthesized as Okazaki fragments rather than continuously?",
        concept: "Leading vs. lagging strand",
        options: ["DNA polymerase cannot synthesize DNA at all on this strand", "DNA polymerase only synthesizes 5' to 3', so this strand must be built discontinuously away from the fork", "Helicase blocks continuous synthesis on this strand", "This strand doesn't require a primer"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—DNA polymerase does synthesize on this strand, just discontinuously.",
          "Correct—the 5' to 3' synthesis restriction, combined with antiparallel strand orientation, forces discontinuous synthesis on the lagging strand.",
          "Incorrect—helicase unwinds DNA; it doesn't block synthesis.",
          "Incorrect—each Okazaki fragment still requires its own RNA primer."
        ]
      },
      {
        question: "A cell has a defective nucleotide excision repair pathway and is exposed to UV light. What is the most likely consequence?",
        concept: "DNA repair",
        options: ["Faster, more accurate replication", "Accumulation of unrepaired thymine dimers, increasing mutation risk", "Immediate cell death in all cases", "No effect, since UV doesn't damage DNA"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—a defective repair pathway would not speed up or improve accuracy.",
          "Correct—without nucleotide excision repair, UV-induced thymine dimers accumulate, raising mutation risk (this is the basis of some skin cancers).",
          "Incorrect—the cell doesn't necessarily die immediately; it may survive with increased mutations.",
          "Incorrect—UV light does cause DNA damage, specifically thymine dimers."
        ]
      },
      {
        question: "What role does DNA ligase play in replication?",
        concept: "Leading vs. lagging strand",
        options: ["Unwinding the double helix", "Synthesizing RNA primers", "Sealing the gaps between Okazaki fragments", "Proofreading newly added bases"],
        correctIndex: 2,
        optionExplanations: [
          "Incorrect—that is helicase's role.",
          "Incorrect—that is primase's role.",
          "Correct—ligase seals the nicks between Okazaki fragments into one continuous lagging strand.",
          "Incorrect—proofreading is a function of DNA polymerase, not ligase."
        ]
      }
    ],
    simplifiedExplanation: "Copying DNA is like unzipping a zipper (helicase) and building a matching new half on each side. One side can be built in one smooth motion (leading strand); the other has to be built backward in short stitches because of which way it's unzipping (lagging strand, Okazaki fragments), then stitched together (ligase). And because copying mistakes matter so much, there are three separate spell-checkers layered on top of each other: real-time proofreading, an after-the-fact mismatch check, and a repair crew (excision repair) for damage from things like UV light."
  },
  {
    id: "transcription-rna",
    subjectId: "genetics-molecular-biology",
    sectionId: "bio-biochem",
    title: "Transcription & RNA",
    estimatedMinutes: 30,
    difficulty: "Intermediate",
    prerequisiteLessonId: "dna-replication-repair",
    sections: [
      {
        heading: "Transcription Initiation",
        body: "Transcription begins when RNA polymerase binds a specific DNA sequence called a promoter, located just upstream of the gene. In eukaryotes, transcription factors must first bind the promoter (often a TATA box) before RNA polymerase II can attach and begin—unlike in prokaryotes, where RNA polymerase can bind the promoter directly. Once bound, RNA polymerase unwinds the DNA locally and begins synthesizing a complementary RNA strand using one DNA strand (the template strand) as its guide.",
        keyTerms: [
          { term: "Promoter", definition: "A DNA sequence located upstream of a gene where RNA polymerase (and, in eukaryotes, transcription factors) binds to initiate transcription." },
          { term: "Transcription factor", definition: "A protein that binds DNA regulatory sequences to help control the rate of transcription, often required before RNA polymerase can bind in eukaryotes." },
          { term: "Template strand", definition: "The DNA strand used as the guide for synthesizing a complementary RNA molecule." }
        ]
      },
      {
        heading: "Elongation and Termination",
        body: "During elongation, RNA polymerase moves along the DNA template, synthesizing RNA in the 5' to 3' direction, one nucleotide at a time, using uracil in place of thymine. Termination occurs when RNA polymerase reaches a specific terminator sequence, causing it to release both the DNA template and the newly made RNA transcript.",
        keyTerms: [
          { term: "Elongation", definition: "The phase of transcription in which RNA polymerase synthesizes RNA 5' to 3' along the DNA template." },
          { term: "Terminator sequence", definition: "A DNA sequence signaling RNA polymerase to stop transcription and release the RNA transcript." }
        ]
      },
      {
        heading: "Post-Transcriptional RNA Processing",
        body: "In eukaryotes, the initial RNA transcript (pre-mRNA) is processed before leaving the nucleus. A 5' cap is added to protect the RNA and assist ribosome binding later, and a poly-A tail is added to the 3' end for stability. Splicing removes non-coding introns and joins the coding exons together, producing mature mRNA. Alternative splicing allows a single gene to produce multiple different protein products by including or excluding different exons in different combinations.",
        keyTerms: [
          { term: "Splicing", definition: "The removal of introns and joining of exons from a pre-mRNA transcript to produce mature mRNA." },
          { term: "Intron/exon", definition: "Introns are non-coding sequences removed during splicing; exons are coding sequences retained and joined together." },
          { term: "Alternative splicing", definition: "A process that produces multiple distinct mRNA (and protein) variants from a single gene by varying which exons are included." }
        ]
      }
    ],
    keyTakeaways: [
      "Transcription initiation requires RNA polymerase to bind a promoter, with eukaryotes also needing transcription factors first.",
      "RNA polymerase synthesizes RNA 5' to 3' during elongation and releases the transcript at a terminator sequence.",
      "Eukaryotic pre-mRNA is processed with a 5' cap, poly-A tail, and splicing—alternative splicing lets one gene produce multiple proteins."
    ],
    knowledgeCheck: [
      { question: "What must happen before RNA polymerase II can bind a eukaryotic promoter?", answer: "Transcription factors must first bind the promoter (often a TATA box), unlike in prokaryotes where RNA polymerase can bind the promoter directly." },
      { question: "What is the functional benefit of alternative splicing?", answer: "It allows a single gene to produce multiple distinct protein products by including or excluding different exons, increasing protein diversity without requiring more genes." }
    ],
    flashcards: [
      { front: "Promoter", back: "DNA sequence upstream of a gene where RNA polymerase binds to initiate transcription." },
      { front: "Transcription factor", back: "Protein required (in eukaryotes) to bind the promoter before RNA polymerase II can attach." },
      { front: "5' cap / poly-A tail", back: "Added to pre-mRNA for stability and to assist ribosome binding/protect the transcript." },
      { front: "Splicing", back: "Removal of introns and joining of exons to produce mature mRNA." },
      { front: "Alternative splicing", back: "Produces multiple protein variants from one gene by varying which exons are included." }
    ],
    practiceQuestions: [
      {
        question: "In eukaryotic transcription, what must occur before RNA polymerase II binds the promoter?",
        concept: "Transcription initiation",
        options: ["DNA replication must occur first", "Transcription factors must bind the promoter", "The mRNA must be spliced", "A poly-A tail must be added"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—transcription doesn't require replication to occur first.",
          "Correct—in eukaryotes, transcription factors bind the promoter (often a TATA box) before RNA polymerase II can attach.",
          "Incorrect—splicing occurs after transcription, not before initiation.",
          "Incorrect—the poly-A tail is added after transcription, to the finished transcript."
        ]
      },
      {
        question: "A pre-mRNA transcript undergoes splicing. What is removed from the transcript during this process?",
        concept: "RNA processing",
        options: ["Exons", "Introns", "The 5' cap", "The poly-A tail"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—exons are the coding sequences that are retained and joined together.",
          "Correct—introns are the non-coding sequences removed during splicing.",
          "Incorrect—the 5' cap is added, not removed, and is retained on the mature mRNA.",
          "Incorrect—the poly-A tail is added, not removed."
        ]
      },
      {
        question: "A single gene produces three structurally different proteins in different tissues. What process most directly explains this?",
        concept: "Alternative splicing",
        options: ["DNA replication errors", "Alternative splicing of the same pre-mRNA transcript", "Random mutation in each tissue", "Different genes being used in each tissue"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—replication errors would not reliably produce three specific, functional variants.",
          "Correct—alternative splicing allows one gene's pre-mRNA to be processed into multiple distinct mature mRNAs and proteins.",
          "Incorrect—random mutation wouldn't reliably or reproducibly generate specific tissue-appropriate variants.",
          "Incorrect—the premise specifies a single gene, not multiple different genes."
        ]
      },
      {
        question: "RNA polymerase synthesizes RNA in which direction relative to the template strand?",
        concept: "Transcription elongation",
        options: ["3' to 5'", "5' to 3'", "Randomly, in either direction", "Only in the middle of the strand outward"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—this is the direction of the template strand being read, not the direction RNA is synthesized.",
          "Correct—like DNA polymerase, RNA polymerase synthesizes new nucleic acid strands 5' to 3'.",
          "Incorrect—synthesis direction is fixed, not random.",
          "Incorrect—synthesis proceeds continuously from the start site, not from the middle outward."
        ]
      }
    ],
    simplifiedExplanation: "Transcription is like a photocopier finding the right page (the promoter) before it can start copying, then running off a copy (elongation) until it hits a stop sign (terminator). In eukaryotes, that copy then gets edited before it's usable: a cover page and back page are stapled on (cap and poly-A tail), and irrelevant paragraphs (introns) are cut out, keeping only the relevant text (exons)—and since you can choose which paragraphs to cut, the same original document (gene) can produce several different final versions (alternative splicing)."
  },
  {
    id: "translation-protein-synthesis",
    subjectId: "genetics-molecular-biology",
    sectionId: "bio-biochem",
    title: "Translation & Protein Synthesis",
    estimatedMinutes: 30,
    difficulty: "Advanced",
    prerequisiteLessonId: "transcription-rna",
    sections: [
      {
        heading: "Translation Initiation",
        body: "Translation begins when the small ribosomal subunit binds the mRNA near its 5' cap and scans along it until it finds the start codon (AUG). An initiator tRNA carrying methionine base-pairs with the start codon, and the large ribosomal subunit then joins to complete the assembled ribosome, positioning the initiator tRNA in the ribosome's P (peptidyl) site, ready for elongation to begin.",
        keyTerms: [
          { term: "Start codon", definition: "The mRNA sequence (AUG) that signals the beginning of translation and codes for methionine." },
          { term: "Initiator tRNA", definition: "The tRNA carrying methionine that base-pairs with the start codon to begin translation." },
          { term: "P site", definition: "The ribosomal site holding the tRNA attached to the growing polypeptide chain." }
        ]
      },
      {
        heading: "Elongation and Termination",
        body: "During elongation, a new aminoacyl-tRNA enters the ribosome's A (aminoacyl) site, matching its anticodon to the next mRNA codon. A peptide bond forms between the new amino acid and the growing chain, the ribosome shifts (translocates) by one codon, moving the tRNA from the A site to the P site and ejecting the previous, now-empty tRNA from the E (exit) site. This cycle repeats until a stop codon (UAA, UAG, or UGA) enters the A site; since no tRNA matches a stop codon, a release factor binds instead, freeing the finished polypeptide.",
        keyTerms: [
          { term: "A site", definition: "The ribosomal site where a new aminoacyl-tRNA enters, matching its anticodon to the mRNA codon." },
          { term: "Translocation", definition: "The ribosome's shift by one codon along the mRNA, moving tRNAs from the A to P to E sites." },
          { term: "Stop codon", definition: "An mRNA sequence (UAA, UAG, or UGA) with no matching tRNA, triggering release factor binding and translation termination." }
        ]
      },
      {
        heading: "Post-Translational Modification",
        body: "A freshly synthesized polypeptide is not yet a functional protein. Molecular chaperones assist it in folding into its correct three-dimensional shape. Many proteins are further modified afterward: a signal sequence may be cleaved off, sugar groups may be added (glycosylation), or the protein may be cleaved into a smaller, active form (as with many hormones and enzymes). Proteins are also directed to their correct cellular or extracellular location based on built-in targeting sequences.",
        keyTerms: [
          { term: "Molecular chaperone", definition: "A protein that assists another polypeptide in folding correctly into its functional three-dimensional shape." },
          { term: "Post-translational modification", definition: "Any chemical change made to a protein after translation, such as cleavage, glycosylation, or phosphorylation." }
        ]
      }
    ],
    keyTakeaways: [
      "Translation initiation assembles the ribosome at the start codon (AUG), with an initiator tRNA carrying methionine.",
      "Elongation cycles a new tRNA through the A, P, and E sites, forming peptide bonds, until a stop codon triggers release factor binding.",
      "A finished polypeptide must fold correctly (often with chaperone help) and may be further modified before it functions as a mature protein."
    ],
    knowledgeCheck: [
      { question: "Why does translation stop when a stop codon reaches the ribosome's A site?", answer: "No tRNA has an anticodon matching a stop codon, so instead a release factor binds there, triggering release of the finished polypeptide rather than addition of another amino acid." },
      { question: "What is the role of a molecular chaperone in protein synthesis?", answer: "It assists a newly synthesized polypeptide in folding correctly into its functional three-dimensional shape." }
    ],
    flashcards: [
      { front: "Start codon", back: "AUG; signals the start of translation and codes for methionine." },
      { front: "A site", back: "Ribosomal site where a new aminoacyl-tRNA enters, matching the mRNA codon." },
      { front: "Translocation", back: "The ribosome shifts one codon, moving tRNAs from A to P to E site." },
      { front: "Stop codon", back: "UAA, UAG, or UGA; no matching tRNA, so a release factor binds and ends translation." },
      { front: "Molecular chaperone", back: "Assists a polypeptide in folding correctly into its functional shape." }
    ],
    practiceQuestions: [
      {
        question: "Which ribosomal site holds the tRNA attached to the growing polypeptide chain?",
        concept: "Translation elongation",
        options: ["A site", "P site", "E site", "T site"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—the A site is where a new aminoacyl-tRNA first enters.",
          "Correct—the P (peptidyl) site holds the tRNA carrying the growing polypeptide chain.",
          "Incorrect—the E (exit) site is where the spent tRNA leaves the ribosome.",
          "Incorrect—there is no 'T site' in the standard ribosome model."
        ]
      },
      {
        question: "Why does translation terminate when a stop codon enters the ribosome's A site?",
        concept: "Translation termination",
        options: ["A release factor binds instead of a tRNA, since no tRNA matches a stop codon", "The ribosome runs out of energy", "The mRNA is degraded at that point", "A special stop tRNA adds a terminal amino acid"],
        correctIndex: 0,
        optionExplanations: [
          "Correct—no tRNA anticodon matches a stop codon, so a release factor binds instead, ending translation.",
          "Incorrect—termination is triggered by the stop codon sequence, not an energy shortage.",
          "Incorrect—mRNA degradation is a separate process, not the direct cause of termination here.",
          "Incorrect—there is no tRNA that recognizes stop codons; that's precisely why they function as stop signals."
        ]
      },
      {
        question: "A newly synthesized polypeptide fails to fold correctly despite having the correct amino acid sequence. Which process most directly would normally prevent this?",
        concept: "Post-translational modification",
        options: ["Transcription", "Splicing", "Molecular chaperone-assisted folding", "DNA repair"],
        correctIndex: 2,
        optionExplanations: [
          "Incorrect—transcription produces RNA, unrelated to protein folding.",
          "Incorrect—splicing processes pre-mRNA, occurring before translation.",
          "Correct—molecular chaperones assist proper folding of the polypeptide into its functional shape.",
          "Incorrect—DNA repair addresses genetic damage, not protein folding."
        ]
      },
      {
        question: "Which best describes the initiator tRNA's role in translation?",
        concept: "Translation initiation",
        options: ["It enters the A site during elongation", "It carries methionine and base-pairs with the start codon to begin translation", "It signals termination", "It splices the mRNA before translation begins"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—the initiator tRNA is positioned in the P site at initiation, not the A site.",
          "Correct—the initiator tRNA carries methionine and pairs with the AUG start codon to begin translation.",
          "Incorrect—termination is signaled by stop codons and release factors, not the initiator tRNA.",
          "Incorrect—splicing is an RNA-processing step, unrelated to the initiator tRNA's role."
        ]
      }
    ],
    simplifiedExplanation: "Translation is an assembly line reading instructions three letters at a time: the ribosome finds the 'start' sign (AUG), then cycles a delivery truck (tRNA) through three loading docks (A, P, E sites), each one dropping off an amino acid and linking it to the growing chain, until it hits a 'stop' sign with no matching truck—so the line halts and the finished product ships out. That product still needs quality control afterward: folding helpers (chaperones) and finishing touches (cleavage, added sugar groups) before it's a working protein."
  },
  {
    id: "gene-regulation-mutations",
    subjectId: "genetics-molecular-biology",
    sectionId: "bio-biochem",
    title: "Gene Regulation & Mutations",
    estimatedMinutes: 30,
    difficulty: "Advanced",
    prerequisiteLessonId: "translation-protein-synthesis",
    sections: [
      {
        heading: "Prokaryotic Gene Regulation",
        body: "Bacteria often organize related genes into an operon: a single promoter controlling a cluster of genes transcribed together as one mRNA. The lac operon is the classic example—it controls genes for lactose digestion. A repressor protein normally binds the operator (a regulatory DNA sequence) and blocks transcription. When lactose is present, it binds and inactivates the repressor, allowing RNA polymerase to transcribe the operon's genes—an efficient, on-demand system that avoids wasting energy producing enzymes the cell doesn't currently need.",
        keyTerms: [
          { term: "Operon", definition: "A cluster of prokaryotic genes transcribed together as a single mRNA, under control of one promoter." },
          { term: "Repressor", definition: "A protein that binds an operator sequence and blocks transcription of the associated operon." },
          { term: "Operator", definition: "A regulatory DNA sequence where a repressor protein binds to block transcription." }
        ]
      },
      {
        heading: "Eukaryotic Gene Regulation",
        body: "Eukaryotic gene regulation is more layered. Transcription factors bind promoters and enhancers (regulatory sequences that can be far from the gene they control) to increase or decrease transcription rates. Epigenetic mechanisms add another layer without altering the DNA sequence itself: DNA methylation typically silences genes, while histone modification changes how tightly DNA is packaged, making genes more or less accessible for transcription.",
        keyTerms: [
          { term: "Enhancer", definition: "A regulatory DNA sequence, often distant from a gene, where transcription factors bind to increase transcription." },
          { term: "DNA methylation", definition: "The addition of a methyl group to DNA, typically silencing gene expression, without changing the DNA sequence." },
          { term: "Epigenetics", definition: "Heritable changes in gene expression that do not involve changes to the underlying DNA sequence." }
        ]
      },
      {
        heading: "Mutations",
        body: "A point mutation changes a single DNA base. A silent mutation changes a codon but not the resulting amino acid (due to the genetic code's redundancy); a missense mutation changes the codon to specify a different amino acid; a nonsense mutation changes a codon to a premature stop codon, truncating the protein. A frameshift mutation—caused by inserting or deleting a number of bases not divisible by three—shifts the entire reading frame downstream, typically scrambling the rest of the protein sequence and usually producing a nonfunctional protein.",
        keyTerms: [
          { term: "Silent mutation", definition: "A point mutation that changes a codon but not the amino acid it specifies, due to genetic code redundancy." },
          { term: "Missense mutation", definition: "A point mutation that changes a codon to specify a different amino acid." },
          { term: "Frameshift mutation", definition: "An insertion or deletion not divisible by three that shifts the reading frame, typically scrambling the downstream protein sequence." }
        ]
      }
    ],
    keyTakeaways: [
      "The lac operon shows how prokaryotes efficiently regulate gene expression on demand, via a repressor that blocks transcription until inactivated.",
      "Eukaryotic regulation adds enhancers, distant transcription factor binding, and epigenetic mechanisms like DNA methylation and histone modification.",
      "Point mutations (silent, missense, nonsense) change one base; frameshift mutations shift the entire reading frame and are usually far more disruptive."
    ],
    knowledgeCheck: [
      { question: "How does the lac operon allow bacteria to conserve energy?", answer: "A repressor blocks transcription of lactose-digesting genes by default; only when lactose is present does it inactivate the repressor, so the genes are transcribed only when actually needed." },
      { question: "Why is a frameshift mutation typically more disruptive than a single missense mutation?", answer: "A frameshift shifts the reading frame for every codon downstream of the mutation, usually scrambling the entire rest of the protein sequence, while a missense mutation changes only one amino acid." }
    ],
    flashcards: [
      { front: "Operon", back: "A cluster of prokaryotic genes transcribed together under one promoter." },
      { front: "Repressor", back: "Protein that binds an operator and blocks transcription of an operon." },
      { front: "Enhancer", back: "Regulatory DNA sequence, often distant, where transcription factors bind to boost transcription." },
      { front: "Silent mutation", back: "Changes a codon but not the amino acid it specifies." },
      { front: "Frameshift mutation", back: "Insertion/deletion not divisible by three; shifts the reading frame and scrambles downstream sequence." }
    ],
    practiceQuestions: [
      {
        question: "In the lac operon, what happens when lactose is present in the cell?",
        concept: "Prokaryotic gene regulation",
        options: ["The repressor binds more tightly to the operator", "Lactose inactivates the repressor, allowing transcription of the operon", "RNA polymerase is permanently blocked", "The operon is deleted from the genome"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—lactose presence weakens, not strengthens, repressor binding.",
          "Correct—lactose binds and inactivates the repressor, freeing the operator so RNA polymerase can transcribe the operon.",
          "Incorrect—the opposite occurs; transcription becomes possible.",
          "Incorrect—gene regulation doesn't involve deleting the operon from the genome."
        ]
      },
      {
        question: "A mutation changes a codon from GAA (glutamate) to GAG, which also codes for glutamate. What type of mutation is this?",
        concept: "Point mutations",
        options: ["Missense mutation", "Nonsense mutation", "Silent mutation", "Frameshift mutation"],
        correctIndex: 2,
        optionExplanations: [
          "Incorrect—missense mutations change the resulting amino acid; this one doesn't.",
          "Incorrect—nonsense mutations create a premature stop codon, not another glutamate codon.",
          "Correct—the base changed, but the amino acid (glutamate) stayed the same due to codon redundancy: a silent mutation.",
          "Incorrect—this is a single base substitution, not an insertion or deletion."
        ]
      },
      {
        question: "An insertion of one nucleotide occurs early in a gene's coding sequence. What is the most likely effect on the resulting protein?",
        concept: "Frameshift mutations",
        options: ["No effect on the protein at all", "A single amino acid is changed", "The entire downstream reading frame is shifted, usually scrambling the protein", "The gene is duplicated"],
        correctIndex: 2,
        optionExplanations: [
          "Incorrect—a single-nucleotide insertion is highly disruptive, not neutral.",
          "Incorrect—that describes a missense mutation, not a frameshift.",
          "Correct—an insertion not divisible by three shifts the reading frame for every downstream codon, typically scrambling the rest of the protein.",
          "Incorrect—an insertion of one base doesn't duplicate the gene."
        ]
      },
      {
        question: "DNA methylation typically has what effect on gene expression?",
        concept: "Epigenetics",
        options: ["It increases transcription of the affected gene", "It silences transcription of the affected gene", "It has no effect on transcription", "It permanently deletes the gene"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—methylation typically decreases, not increases, transcription.",
          "Correct—DNA methylation typically silences gene expression without altering the underlying DNA sequence.",
          "Incorrect—methylation does have a regulatory effect on transcription.",
          "Incorrect—methylation is a reversible chemical modification, not a deletion."
        ]
      }
    ],
    simplifiedExplanation: "Prokaryotic gene regulation is like a light switch controlled by a doorstop (repressor)—normally the door (operon) is held shut, and only a specific key (lactose) removes the doorstop and lets transcription in. Eukaryotic regulation adds dimmer switches from across the room (enhancers) and even sticky notes on the light switch itself (epigenetic marks) that make it harder or easier to flip. Mutations are typos in the DNA: some don't change the meaning (silent), some change one word (missense), some cut the sentence short (nonsense), and some—inserting or deleting the wrong number of letters—shift every word after that point into gibberish (frameshift)."
  }
];

const biochemistryLessons: LessonContent[] = [
  {
    id: "amino-acids-protein-structure",
    subjectId: "biochemistry",
    sectionId: "bio-biochem",
    title: "Amino Acids & Protein Structure",
    estimatedMinutes: 30,
    difficulty: "Intermediate",
    prerequisiteLessonId: null,
    sections: [
      {
        heading: "Amino Acid Structure and Classification",
        body: "Every amino acid shares the same core: a central (alpha) carbon bonded to an amino group, a carboxyl group, a hydrogen, and a variable side chain (R group) that gives each of the 20 amino acids its distinct identity. R groups fall into broad categories—nonpolar/hydrophobic, polar/uncharged, acidic (negatively charged), and basic (positively charged)—and that category largely determines where an amino acid ends up in a folded protein and how it behaves chemically.",
        keyTerms: [
          { term: "Alpha carbon", definition: "The central carbon of an amino acid, bonded to an amino group, carboxyl group, hydrogen, and R group." },
          { term: "R group (side chain)", definition: "The variable portion of an amino acid that determines its chemical identity and properties." },
          { term: "Essential amino acid", definition: "An amino acid the body cannot synthesize and must obtain from the diet." }
        ]
      },
      {
        heading: "Peptide Bonds and Primary Structure",
        body: "A peptide bond forms between the carboxyl group of one amino acid and the amino group of the next, through a condensation (dehydration) reaction that releases a water molecule. A chain of amino acids linked this way is a polypeptide, always synthesized and read from its N-terminus (free amino group end) to its C-terminus (free carboxyl group end). The primary structure of a protein is simply this specific linear sequence of amino acids.",
        keyTerms: [
          { term: "Peptide bond", definition: "The covalent bond linking two amino acids, formed by a dehydration reaction between a carboxyl and an amino group." },
          { term: "Primary structure", definition: "A protein's linear sequence of amino acids, read from the N-terminus to the C-terminus." },
          { term: "N-terminus/C-terminus", definition: "The free amino-group end (N-terminus) and free carboxyl-group end (C-terminus) of a polypeptide." }
        ]
      },
      {
        heading: "Secondary, Tertiary, and Quaternary Structure",
        body: "Secondary structure describes local folding patterns—alpha helices and beta sheets—held together by hydrogen bonds between atoms in the polypeptide backbone. Tertiary structure is the overall three-dimensional shape of a single polypeptide, stabilized by interactions between R groups: hydrophobic interactions, hydrogen bonds, ionic bonds, and covalent disulfide bridges between cysteine residues. Quaternary structure applies only to proteins made of more than one polypeptide chain (subunit), describing how those subunits assemble together—hemoglobin's four subunits are a classic example.",
        keyTerms: [
          { term: "Secondary structure", definition: "Local folding patterns (alpha helices, beta sheets) stabilized by hydrogen bonds in the polypeptide backbone." },
          { term: "Tertiary structure", definition: "The overall 3D shape of a single polypeptide, stabilized by R-group interactions including disulfide bridges." },
          { term: "Quaternary structure", definition: "The arrangement of multiple polypeptide subunits into one functional protein complex." }
        ]
      }
    ],
    keyTakeaways: [
      "Every amino acid shares a common core (alpha carbon, amino group, carboxyl group) but differs by R group, which determines its chemical category.",
      "Peptide bonds link amino acids N-to-C via dehydration reactions; primary structure is just the resulting amino acid sequence.",
      "Secondary structure (H-bonds in the backbone), tertiary structure (R-group interactions), and quaternary structure (multiple subunits) build increasingly complex 3D shape."
    ],
    knowledgeCheck: [
      { question: "What determines the difference between the 20 amino acids?", answer: "The R group (side chain) attached to the alpha carbon—everything else (amino group, carboxyl group, alpha carbon, hydrogen) is identical across all amino acids." },
      { question: "What stabilizes a protein's tertiary structure?", answer: "Interactions between R groups, including hydrophobic interactions, hydrogen bonds, ionic bonds, and covalent disulfide bridges between cysteines." }
    ],
    flashcards: [
      { front: "R group", back: "The variable side chain that gives each amino acid its distinct chemical identity." },
      { front: "Peptide bond", back: "Covalent bond linking amino acids, formed by dehydration between carboxyl and amino groups." },
      { front: "Primary structure", back: "A protein's linear amino acid sequence, N-terminus to C-terminus." },
      { front: "Secondary structure", back: "Alpha helices and beta sheets, stabilized by backbone hydrogen bonds." },
      { front: "Disulfide bridge", back: "A covalent bond between two cysteine R groups that stabilizes tertiary structure." }
    ],
    practiceQuestions: [
      {
        question: "What type of reaction forms a peptide bond between two amino acids?",
        concept: "Peptide bonds",
        options: ["Hydrolysis", "Dehydration (condensation) reaction", "Oxidation", "Phosphorylation"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—hydrolysis breaks peptide bonds using water, the reverse of bond formation.",
          "Correct—a dehydration reaction releases water and forms the peptide bond.",
          "Incorrect—peptide bond formation isn't an oxidation reaction.",
          "Incorrect—phosphorylation adds a phosphate group; it doesn't form peptide bonds."
        ]
      },
      {
        question: "A protein is heated, disrupting its hydrogen bonds and disulfide bridges but not its peptide bonds. What has occurred?",
        concept: "Protein structure levels",
        options: ["The primary structure is destroyed", "The protein is denatured, losing higher-order structure but not primary structure", "The amino acid sequence is altered", "A new protein is synthesized"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—primary structure (peptide bonds/sequence) is unaffected since those bonds remain intact.",
          "Correct—denaturation disrupts secondary, tertiary, and quaternary structure while leaving the primary sequence (peptide bonds) intact.",
          "Incorrect—the amino acid sequence itself doesn't change during denaturation.",
          "Incorrect—no new synthesis occurs; the same polypeptide simply unfolds."
        ]
      },
      {
        question: "Hemoglobin consists of four separate polypeptide subunits assembled together. This describes its:",
        concept: "Quaternary structure",
        options: ["Primary structure", "Secondary structure", "Tertiary structure", "Quaternary structure"],
        correctIndex: 3,
        optionExplanations: [
          "Incorrect—primary structure refers to a single chain's amino acid sequence.",
          "Incorrect—secondary structure refers to local backbone folding within one chain.",
          "Incorrect—tertiary structure refers to a single polypeptide's 3D shape.",
          "Correct—the arrangement of multiple separate polypeptide subunits is quaternary structure."
        ]
      },
      {
        question: "An amino acid with a nonpolar, hydrophobic R group is most likely to be located where in a folded, water-soluble globular protein?",
        concept: "Amino acid classification",
        options: ["On the exposed surface, in contact with water", "Buried in the protein's hydrophobic core, away from water", "Only at the N-terminus", "Only at the C-terminus"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—hydrophobic R groups are unfavorable in contact with water and tend to avoid the surface.",
          "Correct—hydrophobic side chains typically cluster in the protein's interior, away from the surrounding water.",
          "Incorrect—amino acid position isn't restricted to a terminus based on R-group polarity.",
          "Incorrect—same reasoning; terminus position isn't determined by hydrophobicity."
        ]
      }
    ],
    simplifiedExplanation: "Amino acids are like 20 different Lego pieces that all share the same connector (alpha carbon, amino group, carboxyl group) but have a unique attachment (R group) sticking off the side. Snapping them together end-to-end (peptide bonds) makes a chain (primary structure), which then folds locally into coils and sheets (secondary structure), then folds overall into a 3D shape (tertiary structure) based on how the side attachments interact, and sometimes several folded chains clip together into one working unit (quaternary structure)."
  },
  {
    id: "enzymes-enzyme-kinetics",
    subjectId: "biochemistry",
    sectionId: "bio-biochem",
    title: "Enzymes & Enzyme Kinetics",
    estimatedMinutes: 30,
    difficulty: "Intermediate",
    prerequisiteLessonId: "amino-acids-protein-structure",
    sections: [
      {
        heading: "Enzyme Function and the Active Site",
        body: "Enzymes are biological catalysts—almost always proteins—that speed up reactions by lowering the activation energy required, without being consumed or altering the reaction's overall thermodynamics. A substrate binds the enzyme's active site, a specifically shaped pocket. The induced fit model describes the active site subtly changing shape as the substrate binds, improving the fit, rather than the older, more rigid lock-and-key model.",
        keyTerms: [
          { term: "Activation energy", definition: "The minimum energy required for a reaction to proceed; enzymes lower this without changing the reaction's overall energy change." },
          { term: "Active site", definition: "The specifically shaped region of an enzyme where substrate binds and the reaction is catalyzed." },
          { term: "Induced fit", definition: "The model in which an enzyme's active site changes shape slightly as it binds substrate, improving the fit." }
        ]
      },
      {
        heading: "Enzyme Kinetics",
        body: "Michaelis-Menten kinetics describes how reaction rate (V) depends on substrate concentration [S]. Vmax is the maximum reaction rate, reached when the enzyme is saturated with substrate. Km (the Michaelis constant) is the substrate concentration at which the reaction rate is half of Vmax, and it reflects the enzyme's affinity for its substrate—a low Km means high affinity (the enzyme reaches half-maximal rate at a low substrate concentration), while a high Km means low affinity.",
        keyTerms: [
          { term: "Vmax", definition: "The maximum reaction rate an enzyme can achieve, reached when the enzyme is fully saturated with substrate." },
          { term: "Km (Michaelis constant)", definition: "The substrate concentration at which reaction rate is half of Vmax; a measure of enzyme-substrate affinity." },
          { term: "Substrate saturation", definition: "The point at which increasing substrate concentration no longer increases reaction rate, because all active sites are occupied." }
        ]
      },
      {
        heading: "Enzyme Inhibition",
        body: "Competitive inhibitors resemble the substrate and bind the active site directly, competing with substrate for the same spot—their effect can be overcome by adding more substrate, so Vmax stays the same but Km increases (more substrate is needed to reach half-maximal rate). Noncompetitive inhibitors bind a separate allosteric site, changing the enzyme's shape and reducing its activity regardless of substrate concentration—Vmax decreases, but Km stays the same, since substrate binding itself isn't blocked. Allosteric regulation more broadly refers to any regulatory molecule binding a site other than the active site to change enzyme activity, including feedback inhibition by a pathway's own end product.",
        keyTerms: [
          { term: "Competitive inhibitor", definition: "An inhibitor that resembles the substrate and binds the active site directly, increasing apparent Km but not affecting Vmax." },
          { term: "Noncompetitive inhibitor", definition: "An inhibitor that binds an allosteric site, reducing Vmax without affecting Km." },
          { term: "Feedback inhibition", definition: "A regulatory mechanism in which a pathway's end product inhibits an earlier enzyme in that same pathway." }
        ]
      }
    ],
    keyTakeaways: [
      "Enzymes lower activation energy via an active site that binds substrate with induced fit, without changing reaction thermodynamics.",
      "Km reflects substrate affinity (lower Km = higher affinity); Vmax is the maximum rate at substrate saturation.",
      "Competitive inhibitors raise Km but not Vmax (overcome by more substrate); noncompetitive inhibitors lower Vmax but not Km (not overcome by more substrate)."
    ],
    knowledgeCheck: [
      { question: "Why does a competitive inhibitor's effect diminish as substrate concentration increases, while a noncompetitive inhibitor's effect does not?", answer: "A competitive inhibitor competes directly for the active site, so excess substrate can outcompete it; a noncompetitive inhibitor binds a separate allosteric site, so no amount of substrate can displace it." },
      { question: "What does a low Km value indicate about an enzyme's affinity for its substrate?", answer: "A low Km indicates high affinity—the enzyme reaches half-maximal reaction rate at a low substrate concentration, meaning it binds substrate efficiently even when substrate is scarce." }
    ],
    flashcards: [
      { front: "Activation energy", back: "Minimum energy required for a reaction; enzymes lower it without changing overall thermodynamics." },
      { front: "Induced fit", back: "The active site changes shape slightly as it binds substrate, improving the fit." },
      { front: "Km", back: "Substrate concentration at half-maximal rate; lower Km = higher substrate affinity." },
      { front: "Competitive inhibitor", back: "Binds the active site directly; increases Km, doesn't change Vmax; overcome by more substrate." },
      { front: "Noncompetitive inhibitor", back: "Binds an allosteric site; decreases Vmax, doesn't change Km; not overcome by more substrate." }
    ],
    practiceQuestions: [
      {
        question: "Adding a competitive inhibitor to an enzyme reaction changes the kinetics in which way?",
        concept: "Enzyme inhibition",
        options: ["Vmax decreases, Km stays the same", "Vmax stays the same, Km increases", "Both Vmax and Km decrease", "Neither Vmax nor Km changes"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—this describes noncompetitive inhibition, not competitive.",
          "Correct—competitive inhibitors can be outcompeted by enough substrate (Vmax unchanged), but more substrate is needed to reach half-maximal rate (Km increases).",
          "Incorrect—competitive inhibition doesn't decrease Vmax.",
          "Incorrect—competitive inhibition does measurably change Km."
        ]
      },
      {
        question: "An enzyme has a very low Km for its substrate. What does this indicate?",
        concept: "Enzyme kinetics",
        options: ["The enzyme has low affinity for the substrate", "The enzyme has high affinity for the substrate", "The enzyme is inactive", "The reaction has no activation energy"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—a low Km indicates high, not low, affinity.",
          "Correct—a low Km means half-maximal rate is reached at low substrate concentration, indicating high affinity.",
          "Incorrect—Km alone doesn't indicate the enzyme is inactive.",
          "Incorrect—all enzyme-catalyzed reactions still have some activation energy, just a lowered one."
        ]
      },
      {
        question: "A noncompetitive inhibitor is added to an enzyme reaction. Adding excess substrate will:",
        concept: "Enzyme inhibition",
        options: ["Fully restore the original reaction rate", "Have no effect on overcoming the inhibition, since the inhibitor binds a separate site", "Increase Km back to normal", "Convert the inhibitor into a competitive inhibitor"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—noncompetitive inhibition cannot be overcome by adding more substrate.",
          "Correct—since the inhibitor binds an allosteric site rather than competing for the active site, excess substrate doesn't displace it.",
          "Incorrect—noncompetitive inhibition doesn't change Km at all.",
          "Incorrect—the inhibitor's binding site and mechanism don't change based on substrate concentration."
        ]
      },
      {
        question: "In feedback inhibition, what typically inhibits an early enzyme in a metabolic pathway?",
        concept: "Allosteric regulation",
        options: ["The initial substrate of the pathway", "The pathway's own end product", "An unrelated hormone", "A competitive inhibitor from outside the cell"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—the initial substrate typically activates or has no inhibitory role on the early enzyme.",
          "Correct—feedback inhibition occurs when a pathway's end product binds and inhibits an earlier enzyme in that same pathway, preventing overproduction.",
          "Incorrect—feedback inhibition is a self-regulating mechanism internal to the pathway, not typically hormone-driven.",
          "Incorrect—feedback inhibition specifically refers to the pathway's own product, not an external competitive inhibitor."
        ]
      }
    ],
    simplifiedExplanation: "Think of an enzyme as a specially shaped lock (active site) that a key (substrate) fits into, slightly reshaping to grip better (induced fit). Km tells you how good the lock is at grabbing a key even when there aren't many keys around—a low Km lock grabs eagerly. A competitive inhibitor is a fake key jamming the same lock (add more real keys and you can still get in); a noncompetitive inhibitor jams the whole mechanism from a different spot, so no number of keys will help."
  },
  {
    id: "carbohydrates-lipids",
    subjectId: "biochemistry",
    sectionId: "bio-biochem",
    title: "Carbohydrates & Lipids",
    estimatedMinutes: 30,
    difficulty: "Intermediate",
    prerequisiteLessonId: "enzymes-enzyme-kinetics",
    sections: [
      {
        heading: "Carbohydrate Structure",
        body: "Monosaccharides (like glucose, fructose, and galactose) are the simplest carbohydrates—single sugar units that serve as the basic building blocks. Two monosaccharides link via a glycosidic bond (a dehydration reaction) to form a disaccharide, such as sucrose (glucose + fructose). Long chains of monosaccharides form polysaccharides: starch and glycogen store energy in plants and animals respectively (both made of glucose units, differing in branching), while cellulose provides structural support in plant cell walls, using a glycosidic bond orientation that most animal enzymes cannot digest.",
        keyTerms: [
          { term: "Monosaccharide", definition: "A single sugar unit, such as glucose, and the basic building block of carbohydrates." },
          { term: "Glycosidic bond", definition: "The covalent bond linking two monosaccharides, formed by a dehydration reaction." },
          { term: "Polysaccharide", definition: "A long chain of monosaccharides, such as starch, glycogen, or cellulose." }
        ]
      },
      {
        heading: "Lipid Structure and Types",
        body: "Fatty acids are long hydrocarbon chains ending in a carboxyl group; saturated fatty acids have no carbon-carbon double bonds (packing tightly, typically solid at room temperature), while unsaturated fatty acids have one or more double bonds (creating kinks that prevent tight packing, typically liquid at room temperature). Triglycerides—three fatty acids attached to a glycerol backbone via ester bonds—are the body's main energy-storage lipid. Phospholipids replace one fatty acid with a phosphate-containing head group, giving them an amphipathic structure (hydrophilic head, hydrophobic tails) that makes them the core building block of cell membranes.",
        keyTerms: [
          { term: "Saturated fatty acid", definition: "A fatty acid with no carbon-carbon double bonds, allowing tight packing; typically solid at room temperature." },
          { term: "Unsaturated fatty acid", definition: "A fatty acid with one or more carbon-carbon double bonds, creating kinks; typically liquid at room temperature." },
          { term: "Triglyceride", definition: "Three fatty acids attached to a glycerol backbone; the body's main energy-storage lipid." }
        ]
      },
      {
        heading: "Lipids in Membranes and Steroids",
        body: "Phospholipids' amphipathic structure lets them spontaneously form the bilayer that makes up the plasma membrane, with hydrophilic heads facing the watery environment on both sides and hydrophobic tails hidden inside. Cholesterol, a steroid lipid built from four fused carbon rings, is embedded in animal cell membranes, where it modulates membrane fluidity. Steroid hormones—like testosterone, estrogen, and cortisol—share this same four-ring core and, unlike protein hormones, are hydrophobic enough to diffuse directly through the plasma membrane and bind receptors inside the cell.",
        keyTerms: [
          { term: "Amphipathic", definition: "Having both a hydrophilic and a hydrophobic region, as phospholipids do." },
          { term: "Cholesterol", definition: "A steroid lipid embedded in animal cell membranes that modulates membrane fluidity." },
          { term: "Steroid hormone", definition: "A hydrophobic, four-ring hormone (e.g., testosterone, cortisol) that diffuses through the plasma membrane to bind an intracellular receptor." }
        ]
      }
    ],
    keyTakeaways: [
      "Monosaccharides link via glycosidic bonds into disaccharides and polysaccharides (starch/glycogen for storage, cellulose for structure).",
      "Saturated fatty acids pack tightly and are solid at room temperature; unsaturated fatty acids have kinks and are typically liquid.",
      "Phospholipids' amphipathic structure builds the membrane bilayer; steroid hormones' hydrophobicity lets them cross the membrane and act on intracellular receptors."
    ],
    knowledgeCheck: [
      { question: "Why are unsaturated fats typically liquid at room temperature while saturated fats are typically solid?", answer: "Unsaturated fats' carbon-carbon double bonds create kinks in the fatty acid chains that prevent tight packing, while saturated fats' straight chains pack tightly together, raising their melting point." },
      { question: "Why can steroid hormones bind receptors inside the cell rather than on its surface?", answer: "Steroid hormones are hydrophobic, so they can diffuse directly through the phospholipid bilayer of the plasma membrane, unlike protein hormones, which need surface receptors." }
    ],
    flashcards: [
      { front: "Glycosidic bond", back: "Covalent bond linking two monosaccharides, formed by dehydration reaction." },
      { front: "Saturated fatty acid", back: "No carbon-carbon double bonds; packs tightly; solid at room temperature." },
      { front: "Unsaturated fatty acid", back: "Has double bonds creating kinks; liquid at room temperature." },
      { front: "Triglyceride", back: "Three fatty acids attached to glycerol; main energy-storage lipid." },
      { front: "Steroid hormone", back: "Hydrophobic, four-ring hormone that diffuses through the membrane to bind an intracellular receptor." }
    ],
    practiceQuestions: [
      {
        question: "Starch and cellulose are both polysaccharides made of glucose units. What accounts for their very different properties (digestible energy storage vs. indigestible structural support)?",
        concept: "Polysaccharide structure",
        options: ["Starch contains fructose, cellulose does not", "The orientation of the glycosidic bonds linking glucose units differs between them", "Cellulose contains nitrogen, starch does not", "They are made of entirely different monosaccharides"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—both are made of glucose, not fructose.",
          "Correct—the glycosidic bond orientation differs (alpha vs. beta linkages), which most animal digestive enzymes can't break in cellulose's case.",
          "Incorrect—polysaccharides don't contain nitrogen; that's a feature of proteins and nucleic acids.",
          "Incorrect—both are made of the same monosaccharide, glucose."
        ]
      },
      {
        question: "A fatty acid has three carbon-carbon double bonds in its chain. This fatty acid is best described as:",
        concept: "Fatty acid structure",
        options: ["Saturated", "Monounsaturated", "Polyunsaturated", "Amphipathic"],
        correctIndex: 2,
        optionExplanations: [
          "Incorrect—saturated fatty acids have zero double bonds.",
          "Incorrect—monounsaturated means exactly one double bond.",
          "Correct—polyunsaturated means multiple (more than one) double bonds, as described here.",
          "Incorrect—amphipathic describes having both hydrophilic and hydrophobic regions, unrelated to double bond count."
        ]
      },
      {
        question: "Why do phospholipids spontaneously form a bilayer in water?",
        concept: "Membrane lipids",
        options: ["They are entirely hydrophobic", "Their amphipathic structure orients hydrophilic heads toward water and hydrophobic tails away from it", "They are entirely hydrophilic", "They form covalent bonds with water molecules"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—phospholipids are not entirely hydrophobic; they have a hydrophilic head.",
          "Correct—their amphipathic nature drives spontaneous bilayer formation, minimizing contact between hydrophobic tails and water.",
          "Incorrect—phospholipids are not entirely hydrophilic; they have hydrophobic tails.",
          "Incorrect—bilayer formation is driven by noncovalent hydrophobic interactions, not covalent bonding with water."
        ]
      },
      {
        question: "Cortisol, a steroid hormone, is able to bind a receptor inside the target cell rather than on the cell surface because:",
        concept: "Steroid hormones",
        options: ["It is too large to be recognized by surface receptors", "It is hydrophobic and can diffuse directly through the plasma membrane", "It is actively transported across the membrane by a pump", "It binds only to receptors on the nuclear membrane, never entering the cytoplasm"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—size isn't the limiting factor; hydrophobicity is.",
          "Correct—as a hydrophobic steroid, cortisol diffuses directly through the phospholipid bilayer to reach intracellular receptors.",
          "Incorrect—steroid hormones typically cross by simple diffusion, not active transport.",
          "Incorrect—steroid hormone receptors can be cytoplasmic or nuclear, but the hormone does enter the cytoplasm first via diffusion."
        ]
      }
    ],
    simplifiedExplanation: "Carbohydrates are sugar units strung together like beads (glycosidic bonds)—the same glucose bead can build an easy-to-unstring energy-storage necklace (starch/glycogen) or a tightly-knotted structural one (cellulose), depending on how the beads are linked. Fats are like uncooked spaghetti (saturated, packs straight and solid) versus cooked, kinked spaghetti (unsaturated, stays loose and liquid). Phospholipids are two-faced: a water-loving head and water-fearing tails, which is exactly why they self-assemble into the membrane, and why hydrophobic steroid hormones can just slip straight through that same membrane."
  },
  {
    id: "nucleic-acids",
    subjectId: "biochemistry",
    sectionId: "bio-biochem",
    title: "Nucleic Acids",
    estimatedMinutes: 25,
    difficulty: "Intermediate",
    prerequisiteLessonId: "carbohydrates-lipids",
    sections: [
      {
        heading: "Nucleotide Components",
        body: "A nucleotide has three parts: a five-carbon (pentose) sugar, a phosphate group, and a nitrogenous base. Nitrogenous bases fall into two structural classes: purines (adenine and guanine), which have a two-ring structure, and pyrimidines (cytosine, thymine, and uracil), which have a single-ring structure. DNA's sugar is deoxyribose; RNA's is ribose, distinguished by a single extra hydroxyl group at the 2' carbon.",
        keyTerms: [
          { term: "Nucleotide", definition: "The building block of nucleic acids, composed of a pentose sugar, a phosphate group, and a nitrogenous base." },
          { term: "Purine", definition: "A two-ring nitrogenous base—adenine or guanine." },
          { term: "Pyrimidine", definition: "A single-ring nitrogenous base—cytosine, thymine, or uracil." }
        ]
      },
      {
        heading: "Phosphodiester Bonds and Strand Structure",
        body: "Nucleotides link together via phosphodiester bonds, connecting the phosphate group of one nucleotide to the sugar of the next, building a strand with directionality: a free phosphate at the 5' end and a free hydroxyl at the 3' end. In double-stranded DNA, two strands run antiparallel (one 5'→3', the other 3'→5') and pair through hydrogen bonds according to complementary base pairing: adenine with thymine (two hydrogen bonds) and guanine with cytosine (three hydrogen bonds)—which is why GC-rich DNA has a higher melting temperature than AT-rich DNA.",
        keyTerms: [
          { term: "Phosphodiester bond", definition: "The covalent bond linking the phosphate of one nucleotide to the sugar of the next, forming the nucleic acid backbone." },
          { term: "Antiparallel", definition: "The orientation of the two DNA strands running in opposite directions (5'→3' and 3'→5')." },
          { term: "Complementary base pairing", definition: "A pairs with T (2 hydrogen bonds); G pairs with C (3 hydrogen bonds)." }
        ]
      },
      {
        heading: "Nucleotide Derivatives and Their Roles",
        body: "Beyond building DNA and RNA, individual nucleotides and their derivatives serve other essential roles. ATP (adenosine triphosphate) is the cell's main energy currency, releasing energy when its high-energy phosphate bonds are hydrolyzed. NAD+ and FAD are nucleotide-derived electron carriers central to cellular respiration, and cyclic AMP (cAMP) is a nucleotide-derived second messenger in cell signaling.",
        keyTerms: [
          { term: "ATP", definition: "Adenosine triphosphate; the cell's main energy currency, releasing energy when its phosphate bonds are hydrolyzed." },
          { term: "NAD+/FAD", definition: "Nucleotide-derived electron carrier molecules central to cellular respiration." }
        ]
      }
    ],
    keyTakeaways: [
      "A nucleotide is a pentose sugar, a phosphate group, and a nitrogenous base—purines (two rings) or pyrimidines (one ring).",
      "Phosphodiester bonds link nucleotides into an antiparallel double strand held together by complementary base pairing (A-T: 2 H-bonds; G-C: 3 H-bonds).",
      "Beyond genetic storage, nucleotide derivatives play other essential roles: ATP as energy currency, NAD+/FAD as electron carriers, cAMP as a second messenger."
    ],
    knowledgeCheck: [
      { question: "Why does GC-rich DNA have a higher melting temperature than AT-rich DNA?", answer: "G-C base pairs form three hydrogen bonds while A-T pairs form only two, so GC-rich DNA requires more energy (higher temperature) to separate the strands." },
      { question: "What are the three components of a nucleotide?", answer: "A pentose sugar, a phosphate group, and a nitrogenous base (a purine or a pyrimidine)." }
    ],
    flashcards: [
      { front: "Purine", back: "Two-ring nitrogenous base—adenine or guanine." },
      { front: "Pyrimidine", back: "Single-ring nitrogenous base—cytosine, thymine, or uracil." },
      { front: "Phosphodiester bond", back: "Links phosphate of one nucleotide to the sugar of the next; forms the backbone." },
      { front: "Complementary base pairing", back: "A-T (2 H-bonds), G-C (3 H-bonds)." },
      { front: "ATP", back: "Adenosine triphosphate; the cell's main energy currency." }
    ],
    practiceQuestions: [
      {
        question: "Which pair of nitrogenous bases forms three hydrogen bonds when paired?",
        concept: "Base pairing",
        options: ["Adenine and thymine", "Guanine and cytosine", "Adenine and uracil", "Thymine and cytosine"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—A-T pairs form two hydrogen bonds.",
          "Correct—G-C pairs form three hydrogen bonds, making GC-rich regions more thermally stable.",
          "Incorrect—A-U pairs (in RNA) form two hydrogen bonds, like A-T.",
          "Incorrect—thymine and cytosine are not complementary base pairs at all."
        ]
      },
      {
        question: "What structural feature distinguishes a purine from a pyrimidine?",
        concept: "Nucleotide components",
        options: ["Purines have a single ring; pyrimidines have two rings", "Purines have two rings; pyrimidines have a single ring", "Purines contain a phosphate group; pyrimidines do not", "Purines are only found in RNA"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—this reverses the actual structures.",
          "Correct—purines (adenine, guanine) have a fused two-ring structure; pyrimidines (cytosine, thymine, uracil) have a single ring.",
          "Incorrect—the phosphate group is a separate part of the nucleotide, present regardless of base type.",
          "Incorrect—purines are found in both DNA and RNA."
        ]
      },
      {
        question: "The two strands of a DNA double helix are described as antiparallel. What does this mean?",
        concept: "Strand structure",
        options: ["The strands are identical in sequence", "The strands run in opposite directions, one 5'→3' and the other 3'→5'", "The strands are not connected to each other", "The strands each contain only purines"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—the strands are complementary, not identical, in sequence.",
          "Correct—antiparallel means the two strands run in opposite chemical directions relative to each other.",
          "Incorrect—antiparallel strands are held together by hydrogen bonds between bases, not disconnected.",
          "Incorrect—each strand contains a mix of purines and pyrimidines, not purines only."
        ]
      },
      {
        question: "Which nucleotide derivative functions as an electron carrier in cellular respiration?",
        concept: "Nucleotide derivatives",
        options: ["cAMP", "NAD+", "A phospholipid", "Cellulose"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—cAMP functions as a second messenger in cell signaling, not as an electron carrier.",
          "Correct—NAD+ (along with FAD) is a nucleotide-derived electron carrier central to cellular respiration.",
          "Incorrect—phospholipids are membrane lipids, unrelated to nucleotides.",
          "Incorrect—cellulose is a structural polysaccharide, unrelated to nucleotides."
        ]
      }
    ],
    simplifiedExplanation: "A nucleotide is a three-piece kit: a sugar, a phosphate, and one of five possible 'letters' (bases)—big two-ring letters (purines: A, G) always pair with small one-ring letters (pyrimidines: T/U, C), like puzzle pieces that only fit one specific partner, with G-C clicking in more tightly (three connections) than A-T (two connections). Beyond spelling out DNA and RNA, some of these same nucleotide parts get repurposed as the cell's cash (ATP), delivery trucks for electrons (NAD+/FAD), and internal messengers (cAMP)."
  },
  {
    id: "bioenergetics-atp",
    subjectId: "biochemistry",
    sectionId: "bio-biochem",
    title: "Bioenergetics & ATP",
    estimatedMinutes: 30,
    difficulty: "Intermediate",
    prerequisiteLessonId: "nucleic-acids",
    sections: [
      {
        heading: "Thermodynamics of Metabolism",
        body: "Every metabolic reaction is either exergonic (releases energy, negative Gibbs free energy change, ΔG < 0) or endergonic (requires energy input, ΔG > 0). Cells drive unfavorable, endergonic reactions forward by coupling them to a favorable, exergonic reaction—most often ATP hydrolysis—so the combined, coupled reaction has a net negative ΔG and proceeds spontaneously.",
        keyTerms: [
          { term: "Exergonic reaction", definition: "A reaction that releases energy (negative ΔG) and proceeds spontaneously." },
          { term: "Endergonic reaction", definition: "A reaction that requires energy input (positive ΔG) to proceed." },
          { term: "Coupled reaction", definition: "An endergonic reaction driven forward by being paired with an exergonic reaction, usually ATP hydrolysis." }
        ]
      },
      {
        heading: "ATP Structure and Energy Release",
        body: "ATP consists of an adenine base, a ribose sugar, and three phosphate groups linked by two high-energy phosphoanhydride bonds. Hydrolyzing the terminal phosphate bond (ATP → ADP + Pi) releases a substantial amount of energy, largely because the products (ADP and free phosphate) are more stable than ATP itself—that released energy is what powers the cell's endergonic processes, from muscle contraction to active transport.",
        keyTerms: [
          { term: "Phosphoanhydride bond", definition: "The high-energy bond between phosphate groups in ATP; its hydrolysis releases usable energy." },
          { term: "ATP hydrolysis", definition: "The reaction ATP → ADP + Pi, releasing energy used to power cellular processes." }
        ]
      },
      {
        heading: "Energy Coupling and Oxidation-Reduction",
        body: "Cellular energy metabolism relies heavily on oxidation-reduction (redox) reactions: oxidation is the loss of electrons, and reduction is the gain of electrons—always paired together, since electrons removed from one molecule must go somewhere. Electron carriers like NAD+ and FAD get reduced (to NADH and FADH2) by accepting electrons during glucose breakdown, then later get oxidized as they donate those electrons to the electron transport chain, ultimately powering ATP synthesis.",
        keyTerms: [
          { term: "Oxidation", definition: "The loss of electrons from a molecule." },
          { term: "Reduction", definition: "The gain of electrons by a molecule." },
          { term: "Electron carrier", definition: "A molecule like NAD+ or FAD that accepts electrons (becoming reduced) and later donates them (becoming oxidized)." }
        ]
      }
    ],
    keyTakeaways: [
      "Exergonic reactions release energy (ΔG < 0); endergonic reactions require it (ΔG > 0)—cells couple the two so unfavorable reactions proceed.",
      "ATP hydrolysis releases energy by breaking a high-energy phosphoanhydride bond, forming the more stable ADP + Pi.",
      "Oxidation (losing electrons) and reduction (gaining electrons) always occur together; NAD+/FAD shuttle electrons from glucose breakdown to the electron transport chain."
    ],
    knowledgeCheck: [
      { question: "How does a cell drive an endergonic reaction forward?", answer: "By coupling it to an exergonic reaction, typically ATP hydrolysis, so the combined reaction has a net negative ΔG and proceeds spontaneously." },
      { question: "Why must oxidation and reduction always occur together?", answer: "Electrons lost by the molecule being oxidized must be gained by another molecule, which becomes reduced—the two processes are two halves of the same electron transfer." }
    ],
    flashcards: [
      { front: "Exergonic reaction", back: "Releases energy; negative ΔG; proceeds spontaneously." },
      { front: "Endergonic reaction", back: "Requires energy input; positive ΔG." },
      { front: "ATP hydrolysis", back: "ATP → ADP + Pi; releases energy that powers cellular processes." },
      { front: "Oxidation", back: "Loss of electrons from a molecule." },
      { front: "Reduction", back: "Gain of electrons by a molecule." }
    ],
    practiceQuestions: [
      {
        question: "A cell couples ATP hydrolysis to an otherwise unfavorable reaction. Why does this allow the overall process to proceed?",
        concept: "Coupled reactions",
        options: ["ATP hydrolysis has no effect on the overall ΔG", "The combined reaction has a net negative ΔG", "ATP hydrolysis requires energy, adding to the unfavorable reaction", "Coupling only works for reactions that are already favorable"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—ATP hydrolysis's energy release is exactly what changes the overall ΔG.",
          "Correct—combining a very exergonic reaction (ATP hydrolysis) with an endergonic one can produce a net negative ΔG, making the overall process spontaneous.",
          "Incorrect—ATP hydrolysis is exergonic (releases energy), not endergonic.",
          "Incorrect—coupling is specifically useful for driving otherwise unfavorable reactions."
        ]
      },
      {
        question: "In the reaction NAD+ + 2e- + H+ → NADH, what is happening to NAD+?",
        concept: "Oxidation-reduction",
        options: ["NAD+ is being oxidized", "NAD+ is being reduced", "NAD+ is acting as a catalyst with no chemical change", "NAD+ is losing a phosphate group"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—oxidation is loss of electrons; here NAD+ is gaining electrons.",
          "Correct—NAD+ gains electrons (and a hydrogen) to become NADH, which is reduction.",
          "Incorrect—NAD+ does undergo a real chemical change (gaining electrons), not acting as an unchanged catalyst.",
          "Incorrect—no phosphate group is involved in this specific reaction."
        ]
      },
      {
        question: "Which best explains why ATP hydrolysis releases a substantial amount of energy?",
        concept: "ATP structure",
        options: ["ADP and Pi are less stable than ATP", "The products (ADP and Pi) are more stable than ATP, and breaking the phosphoanhydride bond releases energy", "ATP contains a peptide bond that is broken", "Water is consumed without any bonds breaking"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—it's the reverse: the products are more stable, which is why the reaction is favorable.",
          "Correct—breaking the high-energy phosphoanhydride bond and forming the more stable ADP + Pi releases usable energy.",
          "Incorrect—ATP hydrolysis breaks a phosphoanhydride bond, not a peptide bond.",
          "Incorrect—hydrolysis does break a bond (the phosphoanhydride bond), using a water molecule in the process."
        ]
      },
      {
        question: "During glycolysis, NAD+ is converted to NADH. Later, in the electron transport chain, NADH donates its electrons and is converted back to NAD+. In this second step, NADH is:",
        concept: "Electron carriers",
        options: ["Being reduced", "Being oxidized", "Acting as a phosphate donor", "Undergoing hydrolysis"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—reduction is gaining electrons; here NADH is losing (donating) electrons.",
          "Correct—donating electrons is a loss of electrons, which is oxidation—NADH is oxidized back to NAD+.",
          "Incorrect—NADH donates electrons, not phosphate groups.",
          "Incorrect—this isn't a hydrolysis reaction; it's an electron transfer (redox) reaction."
        ]
      }
    ],
    simplifiedExplanation: "Think of ATP like a loaded spring: breaking one of its high-energy phosphate bonds releases stored energy, the same way releasing a spring does—and cells constantly 'spend' that release to power reactions that wouldn't happen on their own (coupling). Oxidation and reduction are a matched pair, like lending and borrowing: whenever one molecule loses electrons (oxidized), another molecule must be right there gaining them (reduced)—NAD+ and FAD act as electron 'buses,' picking up electrons in one part of metabolism and dropping them off in another."
  },
  {
    id: "glycolysis-citric-acid-cycle",
    subjectId: "biochemistry",
    sectionId: "bio-biochem",
    title: "Glycolysis & Citric Acid Cycle",
    estimatedMinutes: 35,
    difficulty: "Advanced",
    prerequisiteLessonId: "bioenergetics-atp",
    sections: [
      {
        heading: "Glycolysis Overview",
        body: "Glycolysis is a ten-step pathway, occurring in the cytoplasm, that breaks down one glucose molecule (6 carbons) into two pyruvate molecules (3 carbons each). It requires no oxygen (anaerobic) and has a net yield, per glucose, of 2 ATP (produced by substrate-level phosphorylation, after an initial investment of 2 ATP is repaid) and 2 NADH. Because it doesn't require oxygen, glycolysis can continue even under anaerobic conditions, making it the one energy-yielding step available to every cell type, including red blood cells, which lack mitochondria entirely.",
        keyTerms: [
          { term: "Glycolysis", definition: "The ten-step, anaerobic pathway in the cytoplasm that breaks down glucose into two pyruvate, net yielding 2 ATP and 2 NADH." },
          { term: "Substrate-level phosphorylation", definition: "ATP synthesis by directly transferring a phosphate group from a substrate to ADP, without using the electron transport chain." },
          { term: "Pyruvate", definition: "The three-carbon end product of glycolysis, two molecules of which are produced per glucose." }
        ]
      },
      {
        heading: "Pyruvate to Acetyl-CoA",
        body: "Before entering the citric acid cycle, each pyruvate molecule is transported into the mitochondrial matrix and converted to acetyl-CoA by the pyruvate dehydrogenase complex—a link (bridge) reaction that releases one CO2 and produces one NADH per pyruvate (so two of each per original glucose, since glycolysis yields two pyruvate). This step is irreversible in animals, which is why animals cannot convert fat back into glucose.",
        keyTerms: [
          { term: "Pyruvate dehydrogenase complex", definition: "The enzyme complex that converts pyruvate to acetyl-CoA in the mitochondrial matrix, releasing CO2 and producing NADH." },
          { term: "Acetyl-CoA", definition: "The two-carbon molecule that enters the citric acid cycle, produced from pyruvate (or fatty acid breakdown)." }
        ]
      },
      {
        heading: "Citric Acid Cycle",
        body: "The citric acid cycle (Krebs cycle), occurring in the mitochondrial matrix, is the central hub of aerobic metabolism: acetyl-CoA combines with a four-carbon molecule to eventually regenerate that same starting molecule, releasing two CO2 per turn. Per turn of the cycle (and since each glucose yields two acetyl-CoA, the cycle turns twice per glucose), the products are 3 NADH, 1 FADH2, and 1 GTP or ATP (via substrate-level phosphorylation)—the NADH and FADH2 are the cycle's most valuable output, since they carry electrons to the electron transport chain, where the majority of ATP is ultimately generated.",
        keyTerms: [
          { term: "Citric acid cycle (Krebs cycle)", definition: "The mitochondrial matrix pathway that oxidizes acetyl-CoA, producing NADH, FADH2, CO2, and GTP/ATP per turn." },
          { term: "GTP", definition: "Guanosine triphosphate, an energy carrier structurally similar to ATP, produced by substrate-level phosphorylation in one citric acid cycle step." }
        ]
      }
    ],
    keyTakeaways: [
      "Glycolysis (cytoplasm, anaerobic) breaks glucose into two pyruvate, net yielding 2 ATP and 2 NADH.",
      "Pyruvate is converted to acetyl-CoA in the mitochondrial matrix, releasing CO2 and producing NADH, before entering the citric acid cycle.",
      "The citric acid cycle turns twice per glucose, together yielding 6 NADH, 2 FADH2, 2 GTP/ATP, and 4 CO2—its main output is electron carriers for the electron transport chain."
    ],
    knowledgeCheck: [
      { question: "Why can glycolysis continue in cells that lack mitochondria, like red blood cells?", answer: "Glycolysis occurs entirely in the cytoplasm and doesn't require oxygen or mitochondria, unlike the citric acid cycle and oxidative phosphorylation." },
      { question: "What is the main functional output of the citric acid cycle, in terms of what powers ATP production later?", answer: "NADH and FADH2, the electron carriers produced by the cycle, which donate their electrons to the electron transport chain, where most of the cell's ATP is ultimately generated." }
    ],
    flashcards: [
      { front: "Glycolysis", back: "Cytoplasmic, anaerobic breakdown of glucose into 2 pyruvate; nets 2 ATP and 2 NADH." },
      { front: "Pyruvate dehydrogenase complex", back: "Converts pyruvate to acetyl-CoA in the mitochondrial matrix; releases CO2, produces NADH." },
      { front: "Acetyl-CoA", back: "Two-carbon molecule that enters the citric acid cycle." },
      { front: "Citric acid cycle", back: "Mitochondrial matrix pathway; per turn yields 3 NADH, 1 FADH2, 1 GTP/ATP, 2 CO2." },
      { front: "Substrate-level phosphorylation", back: "ATP synthesis by direct phosphate transfer, without the electron transport chain." }
    ],
    practiceQuestions: [
      {
        question: "What is the net ATP yield of glycolysis alone, per glucose molecule?",
        concept: "Glycolysis",
        options: ["0 ATP", "2 ATP", "4 ATP", "36 ATP"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—glycolysis does yield a net positive amount of ATP.",
          "Correct—glycolysis invests 2 ATP and produces 4, for a net yield of 2 ATP per glucose.",
          "Incorrect—4 ATP are produced, but 2 were invested up front, for a net of 2.",
          "Incorrect—36 ATP is closer to the (theoretical) total yield of complete aerobic respiration, not glycolysis alone."
        ]
      },
      {
        question: "Where does the citric acid cycle take place, and how many times does it turn per glucose molecule?",
        concept: "Citric acid cycle",
        options: ["Cytoplasm; once per glucose", "Mitochondrial matrix; once per glucose", "Mitochondrial matrix; twice per glucose", "Cytoplasm; twice per glucose"],
        correctIndex: 2,
        optionExplanations: [
          "Incorrect—the citric acid cycle occurs in the mitochondrial matrix, not the cytoplasm.",
          "Incorrect—the cycle turns twice per glucose, since each glucose yields two acetyl-CoA.",
          "Correct—the mitochondrial matrix is the correct location, and it turns twice per glucose (once per acetyl-CoA).",
          "Incorrect—the cytoplasm is where glycolysis occurs, not the citric acid cycle."
        ]
      },
      {
        question: "What happens to pyruvate before it can enter the citric acid cycle?",
        concept: "Pyruvate to acetyl-CoA",
        options: ["It is directly used without modification", "It is converted to acetyl-CoA by the pyruvate dehydrogenase complex, releasing CO2", "It is converted directly to glucose", "It is exported from the cell"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—pyruvate must first be converted to acetyl-CoA before entering the cycle.",
          "Correct—the pyruvate dehydrogenase complex converts pyruvate to acetyl-CoA, releasing CO2 and producing NADH, in the mitochondrial matrix.",
          "Incorrect—this conversion is irreversible in animals; pyruvate is not converted back to glucose this way.",
          "Incorrect—pyruvate is transported into the mitochondria, not exported from the cell."
        ]
      },
      {
        question: "Per turn of the citric acid cycle, which combination of products is generated?",
        concept: "Citric acid cycle yield",
        options: ["1 NADH, 1 FADH2, 3 GTP", "3 NADH, 1 FADH2, 1 GTP, 2 CO2", "2 NADH, 2 FADH2, 2 CO2", "3 NADH, 3 FADH2, 1 GTP"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—this understates NADH and overstates GTP output per turn.",
          "Correct—each turn of the citric acid cycle yields 3 NADH, 1 FADH2, 1 GTP (or ATP), and 2 CO2.",
          "Incorrect—this understates NADH and overstates FADH2.",
          "Incorrect—only 1 FADH2 is produced per turn, not 3."
        ]
      }
    ],
    simplifiedExplanation: "Glycolysis is a quick, no-oxygen-needed job in the cytoplasm: split glucose in half, get a small profit of 2 ATP and 2 NADH. The leftover pieces (pyruvate) then move into the mitochondria, get trimmed down to acetyl-CoA (losing a carbon as CO2 along the way), and feed into the citric acid cycle—a spinning wheel that strips off the remaining carbons as CO2 while loading up NADH and FADH2, the real prize, since those electron carriers are what power the next, much bigger stage of ATP production."
  },
  {
    id: "oxidative-phosphorylation",
    subjectId: "biochemistry",
    sectionId: "bio-biochem",
    title: "Oxidative Phosphorylation",
    estimatedMinutes: 30,
    difficulty: "Advanced",
    prerequisiteLessonId: "glycolysis-citric-acid-cycle",
    sections: [
      {
        heading: "The Electron Transport Chain",
        body: "The electron transport chain (ETC), embedded in the inner mitochondrial membrane, consists of four main protein complexes (I-IV). NADH and FADH2, generated by glycolysis and the citric acid cycle, donate their electrons to this chain (NADH at Complex I, FADH2 at Complex II—which is why NADH yields more ATP than FADH2). As electrons pass through the complexes toward oxygen, the energy released is used to pump protons (H+) from the mitochondrial matrix into the intermembrane space, building up a proton gradient.",
        keyTerms: [
          { term: "Electron transport chain", definition: "A series of protein complexes in the inner mitochondrial membrane that pass electrons from NADH/FADH2 toward oxygen, pumping protons in the process." },
          { term: "Proton gradient", definition: "The higher concentration of H+ in the intermembrane space than the matrix, built up by electron transport chain activity." }
        ]
      },
      {
        heading: "Chemiosmosis and ATP Synthase",
        body: "The proton gradient built by the ETC stores potential energy, since protons naturally want to flow back down their gradient, from the intermembrane space back into the matrix. ATP synthase provides the only channel for that flow, and as protons pass through it, the enzyme physically rotates, using that mechanical energy to synthesize ATP from ADP and Pi—a process called chemiosmosis. This tightly links electron transport to ATP synthesis: without electron flow, there's no proton gradient, and without a proton gradient, ATP synthase can't make ATP.",
        keyTerms: [
          { term: "Chemiosmosis", definition: "ATP synthesis powered by protons flowing down their gradient through ATP synthase." },
          { term: "ATP synthase", definition: "The enzyme complex that uses the energy of protons flowing down their gradient to synthesize ATP from ADP and Pi." }
        ]
      },
      {
        heading: "Yield and Regulation",
        body: "Oxygen serves as the final electron acceptor at the end of the chain (Complex IV), combining with electrons and H+ to form water—without oxygen present, electron flow stops entirely, the proton gradient collapses, and ATP synthase halts, which is why oxidative phosphorylation is strictly aerobic. Each NADH yields roughly 2.5 ATP and each FADH2 roughly 1.5 ATP through this process (estimates vary slightly by source), for a theoretical total of around 30-32 ATP per glucose across all of aerobic respiration. Uncoupling proteins can dissipate the proton gradient as heat instead of ATP, which is how brown fat generates warmth.",
        keyTerms: [
          { term: "Final electron acceptor", definition: "Oxygen, which combines with electrons and H+ at the end of the electron transport chain to form water." },
          { term: "Uncoupling protein", definition: "A protein that allows protons to flow back into the matrix without passing through ATP synthase, releasing the gradient's energy as heat instead of ATP." }
        ]
      }
    ],
    keyTakeaways: [
      "The electron transport chain passes electrons from NADH/FADH2 through complexes I-IV, pumping protons to build a gradient.",
      "Chemiosmosis is ATP synthase using that proton gradient's flow to synthesize ATP—electron transport and ATP synthesis are tightly linked.",
      "Oxygen is the final electron acceptor, forming water; without it, the whole process (and ATP synthase) halts, which is why oxidative phosphorylation is strictly aerobic."
    ],
    knowledgeCheck: [
      { question: "Why does removing oxygen halt ATP synthase activity, even though ATP synthase itself doesn't directly use oxygen?", answer: "Without oxygen as the final electron acceptor, electron flow through the transport chain stops, the proton gradient it maintains collapses, and ATP synthase has nothing left to power it." },
      { question: "Why does NADH yield more ATP than FADH2?", answer: "NADH donates its electrons earlier in the chain (at Complex I), so its electrons contribute to pumping protons at more complexes than FADH2's electrons, which enter later (at Complex II)." }
    ],
    flashcards: [
      { front: "Electron transport chain", back: "Protein complexes in the inner mitochondrial membrane that pass electrons and pump protons." },
      { front: "Chemiosmosis", back: "ATP synthesis powered by protons flowing down their gradient through ATP synthase." },
      { front: "ATP synthase", back: "Enzyme that uses proton flow to synthesize ATP from ADP and Pi." },
      { front: "Final electron acceptor", back: "Oxygen; combines with electrons and H+ to form water at the chain's end." },
      { front: "Uncoupling protein", back: "Lets protons bypass ATP synthase, releasing the gradient's energy as heat instead." }
    ],
    practiceQuestions: [
      {
        question: "What is the role of oxygen in oxidative phosphorylation?",
        concept: "Electron transport chain",
        options: ["It directly powers ATP synthase", "It serves as the final electron acceptor, forming water", "It pumps protons across the membrane", "It is the starting electron donor"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—oxygen doesn't directly power ATP synthase; the proton gradient does.",
          "Correct—oxygen accepts electrons at the end of the chain, combining with H+ to form water.",
          "Incorrect—the protein complexes, not oxygen itself, pump protons.",
          "Incorrect—NADH and FADH2 are the electron donors, not oxygen."
        ]
      },
      {
        question: "A poison blocks Complex IV of the electron transport chain. What is the most likely immediate consequence?",
        concept: "Electron transport chain",
        options: ["ATP production increases", "Electron flow and proton pumping stop, and ATP synthase activity halts", "Glycolysis stops immediately", "The citric acid cycle speeds up"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—blocking the chain would decrease, not increase, ATP production.",
          "Correct—blocking any complex stops electron flow through the chain, collapsing the proton gradient and halting ATP synthase.",
          "Incorrect—glycolysis, occurring in the cytoplasm, can continue independently for a time.",
          "Incorrect—the citric acid cycle would slow, not speed up, as NADH/FADH2 accumulate with nowhere to unload electrons."
        ]
      },
      {
        question: "What does ATP synthase directly use to synthesize ATP?",
        concept: "Chemiosmosis",
        options: ["Direct transfer of a phosphate from a substrate", "The energy of protons flowing down their concentration gradient", "Electrons donated directly from NADH", "Heat released by the electron transport chain"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—that describes substrate-level phosphorylation, a separate mechanism from chemiosmosis.",
          "Correct—ATP synthase harnesses the energy of protons flowing down their gradient (chemiosmosis) to synthesize ATP.",
          "Incorrect—NADH donates electrons to the chain itself, not directly to ATP synthase.",
          "Incorrect—ATP synthase uses the proton gradient's potential energy, not heat."
        ]
      },
      {
        question: "Uncoupling proteins allow protons to bypass ATP synthase. What is the direct effect of this?",
        concept: "Regulation of oxidative phosphorylation",
        options: ["ATP production increases", "The proton gradient's energy is released as heat instead of ATP", "Electron transport stops completely", "Oxygen consumption stops"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—uncoupling reduces ATP production, since the gradient's energy is diverted away from ATP synthase.",
          "Correct—when protons bypass ATP synthase, the gradient's stored energy is released as heat rather than captured as ATP.",
          "Incorrect—electron transport can continue; it's ATP synthesis specifically that's uncoupled from it.",
          "Incorrect—oxygen consumption can actually increase in uncoupled mitochondria, as the cell compensates by increasing electron flow."
        ]
      }
    ],
    simplifiedExplanation: "Picture the electron transport chain as a water wheel system: electrons flowing downhill through the complexes power pumps that push protons uphill into a reservoir (intermembrane space), building pressure. ATP synthase is the only drain letting that pressure flow back down, and it's rigged to a turbine that makes ATP as the water rushes through. Oxygen is what makes room at the bottom of the hill for the electrons to go—cut it off, and the whole system backs up and stops."
  },
  {
    id: "metabolism-regulation",
    subjectId: "biochemistry",
    sectionId: "bio-biochem",
    title: "Metabolism & Metabolic Regulation",
    estimatedMinutes: 30,
    difficulty: "Advanced",
    prerequisiteLessonId: "oxidative-phosphorylation",
    sections: [
      {
        heading: "Fed vs. Fasted State Regulation",
        body: "After a meal (fed state), rising blood glucose triggers insulin release from the pancreas, which promotes glucose uptake into cells and glycogen synthesis in the liver and muscle for storage. During fasting, falling blood glucose triggers glucagon release, which promotes glycogen breakdown (glycogenolysis) and, if fasting continues, gluconeogenesis—the synthesis of new glucose from non-carbohydrate sources like amino acids and glycerol—to keep blood glucose from dropping too low.",
        keyTerms: [
          { term: "Insulin", definition: "A pancreatic hormone released when blood glucose is high, promoting glucose uptake and glycogen synthesis." },
          { term: "Glucagon", definition: "A pancreatic hormone released when blood glucose is low, promoting glycogen breakdown and gluconeogenesis." },
          { term: "Gluconeogenesis", definition: "The synthesis of new glucose from non-carbohydrate sources, such as amino acids or glycerol." }
        ]
      },
      {
        heading: "Regulation of Glycolysis and Gluconeogenesis",
        body: "Glycolysis and gluconeogenesis are reciprocally regulated so they don't run simultaneously and waste energy in a futile cycle. Phosphofructokinase-1 (PFK-1) is the key rate-limiting enzyme of glycolysis: it's allosterically inhibited by high ATP and citrate (signs the cell has enough energy already) and activated by high AMP (a sign of low energy), so glycolysis speeds up exactly when the cell needs energy and slows down when it doesn't.",
        keyTerms: [
          { term: "Rate-limiting enzyme", definition: "The slowest, most tightly regulated step in a pathway, which controls the overall rate of the entire pathway." },
          { term: "PFK-1 (phosphofructokinase-1)", definition: "The key rate-limiting, allosterically regulated enzyme of glycolysis, inhibited by ATP/citrate and activated by AMP." }
        ]
      },
      {
        heading: "Fatty Acid Oxidation vs. Synthesis",
        body: "When energy is needed and glucose is scarce, cells break down fatty acids through beta-oxidation, repeatedly removing two-carbon units as acetyl-CoA, which then feeds into the citric acid cycle, along with generating NADH and FADH2 directly. When energy is abundant, the reverse process—fatty acid synthesis—builds fatty acids from acetyl-CoA for long-term storage. The two processes are regulated reciprocally (largely through the molecule malonyl-CoA) so a cell isn't simultaneously building and breaking down fat.",
        keyTerms: [
          { term: "Beta-oxidation", definition: "The breakdown of fatty acids into two-carbon acetyl-CoA units, generating NADH and FADH2." },
          { term: "Fatty acid synthesis", definition: "The building of new fatty acids from acetyl-CoA, occurring when energy is abundant." }
        ]
      }
    ],
    keyTakeaways: [
      "Insulin (fed state) promotes glucose uptake and storage; glucagon (fasted state) promotes glycogen breakdown and gluconeogenesis.",
      "PFK-1 is glycolysis's rate-limiting enzyme, inhibited by high ATP/citrate and activated by high AMP, matching glycolytic rate to the cell's actual energy need.",
      "Beta-oxidation breaks fatty acids down for energy; fatty acid synthesis builds them up for storage—the two are reciprocally regulated to avoid a futile cycle."
    ],
    knowledgeCheck: [
      { question: "Why does the body use two different hormones (insulin and glucagon) rather than one, to regulate blood glucose?", answer: "Insulin and glucagon have opposing effects—insulin lowers blood glucose (promoting uptake and storage) and glucagon raises it (promoting release from storage)—so together they form a responsive, two-directional control system that keeps blood glucose within a narrow range." },
      { question: "Why is PFK-1 inhibited by high ATP and citrate?", answer: "High ATP and citrate indicate the cell already has abundant energy, so inhibiting PFK-1 slows glycolysis, preventing unnecessary further glucose breakdown when it isn't needed." }
    ],
    flashcards: [
      { front: "Insulin", back: "Released when blood glucose is high; promotes uptake and glycogen synthesis." },
      { front: "Glucagon", back: "Released when blood glucose is low; promotes glycogen breakdown and gluconeogenesis." },
      { front: "Gluconeogenesis", back: "Synthesis of new glucose from non-carbohydrate sources like amino acids or glycerol." },
      { front: "PFK-1", back: "Rate-limiting glycolysis enzyme; inhibited by ATP/citrate, activated by AMP." },
      { front: "Beta-oxidation", back: "Breakdown of fatty acids into acetyl-CoA units, generating NADH and FADH2." }
    ],
    practiceQuestions: [
      {
        question: "After a carbohydrate-rich meal, which hormone is released, and what is its main effect?",
        concept: "Fed vs. fasted regulation",
        options: ["Glucagon; promotes glycogen breakdown", "Insulin; promotes glucose uptake and glycogen synthesis", "Glucagon; promotes gluconeogenesis", "Insulin; promotes fatty acid breakdown only"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—glucagon is released during fasting, not after a meal.",
          "Correct—rising blood glucose after a meal triggers insulin release, promoting glucose uptake and glycogen storage.",
          "Incorrect—glucagon and gluconeogenesis are associated with fasting, not the fed state.",
          "Incorrect—insulin's main effects are glucose uptake and storage, not specifically fat breakdown."
        ]
      },
      {
        question: "High levels of ATP and citrate in a cell have what effect on PFK-1 activity, and why?",
        concept: "Regulation of glycolysis",
        options: ["They activate PFK-1, since the cell needs more energy", "They inhibit PFK-1, since high ATP/citrate signal the cell already has enough energy", "They have no effect on PFK-1", "They activate gluconeogenesis instead, with no effect on glycolysis"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—high ATP/citrate indicate abundant energy, which inhibits, not activates, PFK-1.",
          "Correct—high ATP and citrate are allosteric inhibitors of PFK-1, slowing glycolysis when the cell doesn't need more energy.",
          "Incorrect—ATP and citrate are established, direct allosteric regulators of PFK-1.",
          "Incorrect—while gluconeogenesis may be favored under some of these conditions, PFK-1 and glycolysis are directly inhibited too."
        ]
      },
      {
        question: "During fasting, when glycogen stores are depleted, what process allows the body to continue producing glucose?",
        concept: "Gluconeogenesis",
        options: ["Glycolysis", "Beta-oxidation only", "Gluconeogenesis, using non-carbohydrate sources like amino acids", "Fatty acid synthesis"],
        correctIndex: 2,
        optionExplanations: [
          "Incorrect—glycolysis breaks glucose down; it doesn't produce new glucose.",
          "Incorrect—beta-oxidation provides energy from fat but doesn't directly produce glucose.",
          "Correct—gluconeogenesis synthesizes new glucose from non-carbohydrate sources like amino acids and glycerol once glycogen is depleted.",
          "Incorrect—fatty acid synthesis builds fat for storage; it doesn't produce glucose."
        ]
      },
      {
        question: "Why are beta-oxidation and fatty acid synthesis reciprocally regulated?",
        concept: "Fatty acid metabolism",
        options: ["To allow both to occur at maximum rate simultaneously", "To prevent a futile cycle of simultaneously building and breaking down fat", "Because both processes occur in different organisms", "Because fatty acids cannot be synthesized in humans"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—running both processes at once would waste energy, which is exactly what reciprocal regulation prevents.",
          "Correct—reciprocal regulation (largely via malonyl-CoA) prevents the cell from simultaneously synthesizing and breaking down fatty acids.",
          "Incorrect—both processes occur within the same human cells, not in different organisms.",
          "Incorrect—humans can and do synthesize fatty acids, particularly when energy is abundant."
        ]
      }
    ],
    simplifiedExplanation: "Metabolism runs on two opposing traffic signals: insulin is the green light for storage after a meal, and glucagon is the green light for release when fuel runs low. Inside glycolysis, PFK-1 acts like a thermostat—too much energy already banked (ATP, citrate) and it throttles down; low energy (AMP) and it opens back up. Fat metabolism runs the same way: building fat and burning fat are regulated like opposite ends of a seesaw, so the body doesn't waste energy doing both at once."
  }
];

const organSystemsLessons: LessonContent[] = [
  {
    id: "nervous-endocrine-systems",
    subjectId: "organ-systems",
    sectionId: "bio-biochem",
    title: "Nervous & Endocrine Systems",
    estimatedMinutes: 35,
    difficulty: "Intermediate",
    prerequisiteLessonId: null,
    sections: [
      {
        heading: "Neuron Structure and the Action Potential",
        body: "A neuron at rest maintains a resting membrane potential of about -70mV, maintained largely by the sodium-potassium pump and leak channels. When a stimulus depolarizes the membrane past a threshold (around -55mV), voltage-gated sodium channels open, Na+ rushes in, and the membrane rapidly depolarizes; voltage-gated potassium channels then open and K+ rushes out, repolarizing the membrane. This all-or-none action potential either fires completely or not at all—there's no partial action potential—and travels down the axon to the axon terminal.",
        keyTerms: [
          { term: "Resting membrane potential", definition: "The stable, negative internal voltage (~-70mV) of a neuron at rest, maintained by the Na+/K+ pump and leak channels." },
          { term: "Threshold", definition: "The membrane potential (~-55mV) that must be reached to trigger an action potential." },
          { term: "All-or-none principle", definition: "An action potential either fires completely or does not fire at all, regardless of stimulus strength above threshold." }
        ]
      },
      {
        heading: "Synaptic Transmission",
        body: "When an action potential reaches the axon terminal, voltage-gated calcium channels open, and Ca2+ influx triggers synaptic vesicles to fuse with the membrane and release neurotransmitter into the synaptic cleft. The neurotransmitter diffuses across and binds receptors on the postsynaptic neuron, producing either an excitatory postsynaptic potential (EPSP, depolarizing, makes firing more likely) or an inhibitory postsynaptic potential (IPSP, hyperpolarizing, makes firing less likely). Whether the postsynaptic neuron fires depends on the sum of all EPSPs and IPSPs it receives (summation).",
        keyTerms: [
          { term: "Synaptic vesicle", definition: "A membrane-bound sac storing neurotransmitter, which fuses with the presynaptic membrane to release its contents." },
          { term: "EPSP/IPSP", definition: "Excitatory (depolarizing) or inhibitory (hyperpolarizing) postsynaptic potentials produced by neurotransmitter binding." },
          { term: "Summation", definition: "The combining of multiple EPSPs and IPSPs to determine whether a postsynaptic neuron reaches threshold and fires." }
        ]
      },
      {
        heading: "Endocrine System Basics",
        body: "The endocrine system uses hormones for slower, longer-lasting, body-wide communication, in contrast to the nervous system's fast, localized signaling. Peptide hormones (e.g., insulin) are water-soluble and bind surface receptors, triggering second-messenger cascades; steroid hormones (e.g., cortisol) are lipid-soluble and diffuse through the membrane to bind intracellular receptors. Most hormone systems are controlled by negative feedback loops—the hypothalamic-pituitary-adrenal (HPA) axis, which regulates cortisol release in response to stress, is a classic example: rising cortisol feeds back to suppress the signals that triggered its own release.",
        keyTerms: [
          { term: "Peptide hormone", definition: "A water-soluble hormone that binds a surface receptor and triggers a second-messenger cascade." },
          { term: "Negative feedback loop", definition: "A regulatory mechanism where a hormone's rising level suppresses further release, keeping levels within a stable range." },
          { term: "HPA axis", definition: "The hypothalamic-pituitary-adrenal axis, which regulates cortisol release via a negative feedback loop." }
        ]
      }
    ],
    keyTakeaways: [
      "The action potential is all-or-none, driven by voltage-gated Na+ then K+ channels opening once threshold is reached.",
      "Synaptic transmission converts an electrical signal into a chemical one (neurotransmitter release), producing EPSPs or IPSPs that sum to determine firing.",
      "The endocrine system uses peptide hormones (surface receptors) and steroid hormones (intracellular receptors), regulated by negative feedback loops like the HPA axis."
    ],
    knowledgeCheck: [
      { question: "What does 'all-or-none' mean regarding an action potential?", answer: "Once a stimulus depolarizes the membrane past threshold, the action potential fires completely and with the same magnitude every time—there's no partial or graded action potential, regardless of how much the stimulus exceeds threshold." },
      { question: "How does a negative feedback loop like the HPA axis regulate hormone levels?", answer: "As the hormone (cortisol) level rises, it feeds back to suppress the upstream signals that triggered its release, preventing levels from rising indefinitely and keeping them within a stable range." }
    ],
    flashcards: [
      { front: "Resting membrane potential", back: "~-70mV; maintained by the Na+/K+ pump and leak channels." },
      { front: "Threshold", back: "~-55mV; must be reached to trigger an action potential." },
      { front: "All-or-none principle", back: "An action potential fires completely or not at all." },
      { front: "EPSP/IPSP", back: "Excitatory (depolarizing) or inhibitory (hyperpolarizing) postsynaptic potentials." },
      { front: "Negative feedback loop", back: "Rising hormone levels suppress further release, stabilizing hormone levels." }
    ],
    practiceQuestions: [
      {
        question: "During an action potential, what causes the initial rapid depolarization of the membrane?",
        concept: "Action potential",
        options: ["K+ flowing out of the cell", "Na+ flowing into the cell through voltage-gated channels", "Ca2+ flowing into the cell", "The Na+/K+ pump reversing direction"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—K+ outflow drives repolarization, which happens after depolarization.",
          "Correct—voltage-gated Na+ channels open at threshold, and Na+ influx causes rapid depolarization.",
          "Incorrect—Ca2+ influx triggers neurotransmitter release at the synapse, not the axonal depolarization itself.",
          "Incorrect—the Na+/K+ pump doesn't reverse direction during an action potential."
        ]
      },
      {
        question: "A neurotransmitter binds a postsynaptic receptor and causes hyperpolarization of the postsynaptic membrane. This is an example of:",
        concept: "Synaptic transmission",
        options: ["An EPSP, making the neuron more likely to fire", "An IPSP, making the neuron less likely to fire", "An action potential in the presynaptic neuron", "A resting membrane potential"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—an EPSP depolarizes the membrane, making firing more likely, not hyperpolarizes it.",
          "Correct—hyperpolarization moves the membrane further from threshold, defining an inhibitory postsynaptic potential (IPSP).",
          "Incorrect—this describes a postsynaptic event, not a presynaptic action potential.",
          "Incorrect—this describes an active change in potential, not the baseline resting state."
        ]
      },
      {
        question: "Why can steroid hormones bind receptors inside the cell while peptide hormones typically cannot?",
        concept: "Hormone types",
        options: ["Steroid hormones are larger than peptide hormones", "Steroid hormones are lipid-soluble and can diffuse through the plasma membrane", "Peptide hormones are lipid-soluble", "Steroid hormones are actively pumped into the cell"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—size isn't the relevant distinguishing factor here.",
          "Correct—steroid hormones' lipid solubility lets them diffuse directly through the membrane to intracellular receptors.",
          "Incorrect—peptide hormones are water-soluble, not lipid-soluble, which is exactly why they need surface receptors.",
          "Incorrect—steroid hormones typically cross by simple diffusion, not active transport."
        ]
      },
      {
        question: "In the HPA axis, what happens as cortisol levels rise?",
        concept: "Negative feedback",
        options: ["Cortisol release is further stimulated", "Cortisol feeds back to suppress the signals that triggered its own release", "The hypothalamus is unaffected by cortisol levels", "Cortisol levels rise indefinitely with no regulation"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—rising cortisol suppresses, rather than stimulates, further release.",
          "Correct—this is the defining feature of a negative feedback loop: rising cortisol suppresses the upstream hypothalamic and pituitary signals.",
          "Incorrect—the hypothalamus is a direct target of cortisol's feedback suppression.",
          "Incorrect—negative feedback specifically prevents levels from rising indefinitely."
        ]
      }
    ],
    simplifiedExplanation: "A neuron is like a loaded spring-triggered alarm: nothing happens below a certain trigger point (threshold), but cross it and the alarm goes off at full volume every time (all-or-none). That electrical alarm gets converted to a chemical message (neurotransmitter) at the synapse, which either nudges the next neuron closer to firing (EPSP) or further away (IPSP). The endocrine system works on a slower, body-wide broadcast system instead, with hormones that mostly self-regulate through feedback—like a thermostat that shuts itself off once it senses it's reached the target temperature."
  },
  {
    id: "cardiovascular-respiratory-systems",
    subjectId: "organ-systems",
    sectionId: "bio-biochem",
    title: "Cardiovascular & Respiratory Systems",
    estimatedMinutes: 35,
    difficulty: "Intermediate",
    prerequisiteLessonId: "nervous-endocrine-systems",
    sections: [
      {
        heading: "Heart Structure and the Cardiac Cycle",
        body: "The heart has four chambers: two atria (receiving blood) and two ventricles (pumping blood out), separated by one-way valves that prevent backflow. Deoxygenated blood returns to the right atrium, passes to the right ventricle, and is pumped to the lungs (pulmonary circuit) to pick up oxygen; oxygenated blood returns to the left atrium, passes to the left ventricle, and is pumped to the body (systemic circuit). The cardiac cycle alternates between systole (ventricular contraction, ejecting blood) and diastole (ventricular relaxation, filling with blood).",
        keyTerms: [
          { term: "Pulmonary circuit", definition: "The path of blood from the right ventricle to the lungs and back to the left atrium, where it picks up oxygen." },
          { term: "Systemic circuit", definition: "The path of blood from the left ventricle to the body and back to the right atrium, delivering oxygen to tissues." },
          { term: "Systole/diastole", definition: "Ventricular contraction (systole, ejecting blood) and relaxation (diastole, filling with blood)." }
        ]
      },
      {
        heading: "Blood Vessels and Blood Pressure",
        body: "Arteries carry blood away from the heart under high pressure, with thick, elastic, muscular walls; veins carry blood back to the heart under low pressure, with thinner walls and one-way valves to prevent backflow. Capillaries, the thinnest vessels, are the actual site of gas and nutrient exchange with tissues, thanks to their single-cell-thick walls. Blood pressure is regulated by multiple systems, including baroreceptors (which detect pressure changes and adjust heart rate/vessel diameter) and the kidneys (via blood volume regulation).",
        keyTerms: [
          { term: "Artery", definition: "A thick-walled, muscular vessel that carries blood away from the heart under high pressure." },
          { term: "Capillary", definition: "The thinnest blood vessel, with walls one cell thick, where gas and nutrient exchange with tissue occurs." },
          { term: "Baroreceptor", definition: "A sensor that detects blood pressure changes and triggers reflex adjustments to heart rate and vessel diameter." }
        ]
      },
      {
        heading: "Respiratory Mechanics and Gas Exchange",
        body: "Breathing (ventilation) is driven by the diaphragm and intercostal muscles: contraction expands the chest cavity, lowering pressure inside the lungs and drawing air in; relaxation reverses this, pushing air out. Gas exchange occurs at the alveoli, tiny air sacs surrounded by capillaries, where oxygen and carbon dioxide diffuse down their partial pressure gradients—oxygen from alveolar air into blood, carbon dioxide from blood into alveolar air. The Bohr effect describes how lower pH (higher CO2, as in actively respiring tissue) shifts hemoglobin's oxygen-binding curve to release oxygen more readily exactly where it's needed most.",
        keyTerms: [
          { term: "Alveoli", definition: "Tiny, capillary-surrounded air sacs in the lungs where gas exchange occurs by diffusion." },
          { term: "Partial pressure gradient", definition: "The difference in a gas's concentration between two locations, driving its diffusion from high to low." },
          { term: "Bohr effect", definition: "Lower pH (higher CO2) shifts hemoglobin to release oxygen more readily, favoring delivery to actively respiring tissue." }
        ]
      }
    ],
    keyTakeaways: [
      "Blood follows two circuits: pulmonary (heart-lungs-heart, picking up oxygen) and systemic (heart-body-heart, delivering oxygen).",
      "Arteries (high pressure, thick walls) carry blood from the heart; capillaries enable exchange; veins (low pressure, valves) return blood to the heart.",
      "Gas exchange at the alveoli follows partial pressure gradients; the Bohr effect helps hemoglobin release more oxygen exactly where tissue needs it most."
    ],
    knowledgeCheck: [
      { question: "Why does deoxygenated blood need to pass through the pulmonary circuit before reaching the systemic circuit?", answer: "Blood must pick up oxygen at the lungs (pulmonary circuit) before it can deliver that oxygen to the body's tissues via the systemic circuit—the two circuits are in series, not parallel." },
      { question: "How does the Bohr effect benefit actively respiring (exercising) tissue?", answer: "Actively respiring tissue produces more CO2, lowering local pH, which shifts hemoglobin to release oxygen more readily exactly where it's needed most." }
    ],
    flashcards: [
      { front: "Pulmonary circuit", back: "Right ventricle → lungs → left atrium; blood picks up oxygen." },
      { front: "Systemic circuit", back: "Left ventricle → body → right atrium; delivers oxygen to tissues." },
      { front: "Capillary", back: "Thinnest vessel, one cell thick walls; site of gas/nutrient exchange." },
      { front: "Alveoli", back: "Capillary-surrounded air sacs in the lungs; site of gas exchange." },
      { front: "Bohr effect", back: "Lower pH (higher CO2) makes hemoglobin release oxygen more readily." }
    ],
    practiceQuestions: [
      {
        question: "Which chamber of the heart pumps blood into the systemic circuit?",
        concept: "Heart structure",
        options: ["Right atrium", "Right ventricle", "Left atrium", "Left ventricle"],
        correctIndex: 3,
        optionExplanations: [
          "Incorrect—the right atrium receives blood; it doesn't pump into the systemic circuit.",
          "Incorrect—the right ventricle pumps into the pulmonary circuit, not the systemic circuit.",
          "Incorrect—the left atrium receives oxygenated blood; it doesn't pump into the systemic circuit.",
          "Correct—the left ventricle pumps oxygenated blood out into the systemic circuit to the body."
        ]
      },
      {
        question: "Why are capillary walls only one cell thick, unlike arteries and veins?",
        concept: "Blood vessels",
        options: ["To withstand high pressure", "To allow efficient diffusion of gases and nutrients across the wall", "To store blood between heartbeats", "To prevent backflow of blood"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—capillaries operate under low pressure, unlike arteries; thick walls aren't needed for pressure resistance here.",
          "Correct—thin, single-cell walls minimize the diffusion distance, enabling efficient gas and nutrient exchange with tissue.",
          "Incorrect—capillaries aren't a blood storage site.",
          "Incorrect—preventing backflow is the role of venous valves, not capillary wall thickness."
        ]
      },
      {
        question: "During exercise, actively respiring muscle tissue produces more CO2, lowering local pH. What effect does this have on oxygen delivery, according to the Bohr effect?",
        concept: "Gas exchange",
        options: ["Hemoglobin binds oxygen more tightly, reducing delivery", "Hemoglobin releases oxygen more readily, increasing delivery to the tissue", "Oxygen delivery is unaffected by pH changes", "CO2 directly replaces oxygen in the blood"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—this is the opposite of the Bohr effect; lower pH decreases hemoglobin's oxygen affinity.",
          "Correct—the Bohr effect describes lower pH shifting hemoglobin to release oxygen more readily, delivering more oxygen to actively respiring tissue.",
          "Incorrect—pH does have a measurable, well-characterized effect on hemoglobin's oxygen affinity.",
          "Incorrect—CO2 doesn't directly replace oxygen; it affects blood pH, which affects hemoglobin's behavior."
        ]
      },
      {
        question: "What drives air into the lungs during inhalation?",
        concept: "Respiratory mechanics",
        options: ["Contraction of the diaphragm and intercostal muscles, expanding the chest and lowering internal pressure", "Active pumping of air by the alveoli", "Contraction of the heart", "Relaxation of the diaphragm"],
        correctIndex: 0,
        optionExplanations: [
          "Correct—diaphragm and intercostal muscle contraction expands the chest cavity, lowering pressure inside the lungs and drawing air in.",
          "Incorrect—alveoli are passive exchange sites; they don't actively pump air.",
          "Incorrect—the heart's contraction pumps blood, not air.",
          "Incorrect—diaphragm relaxation is associated with exhalation, not inhalation."
        ]
      }
    ],
    simplifiedExplanation: "The heart runs two separate loops back to back: a short trip to the lungs to pick up oxygen (pulmonary), then a long trip out to the whole body to deliver it (systemic). Blood vessels are built for their job: arteries are thick pressure hoses leaving the heart, veins are thinner return pipes with one-way check valves, and capillaries are just thin enough to let gases leak across. Breathing works like a bellows (diaphragm expanding the chest to suck air in), and inside the lungs, oxygen and CO2 simply diffuse toward wherever there's less of them—tilted, conveniently, even further in the body's favor by the Bohr effect during exercise."
  },
  {
    id: "renal-fluid-balance",
    subjectId: "organ-systems",
    sectionId: "bio-biochem",
    title: "Renal & Fluid Balance",
    estimatedMinutes: 30,
    difficulty: "Advanced",
    prerequisiteLessonId: "cardiovascular-respiratory-systems",
    sections: [
      {
        heading: "Nephron Structure and Filtration",
        body: "The nephron is the kidney's functional unit. Blood enters the glomerulus, a ball of capillaries, under pressure that forces water and small solutes (but not blood cells or large proteins) out into the surrounding Bowman's capsule—this is filtration, producing filtrate that then flows into the renal tubule. Filtration is nonselective for size (anything small enough passes through), meaning it removes needed substances (glucose, amino acids, ions) along with waste, all of which must be selectively reclaimed afterward.",
        keyTerms: [
          { term: "Nephron", definition: "The kidney's functional unit, responsible for filtering blood and forming urine." },
          { term: "Glomerulus", definition: "A ball of capillaries where blood pressure forces water and small solutes out into Bowman's capsule (filtration)." },
          { term: "Filtrate", definition: "The fluid produced by filtration at the glomerulus, containing water, ions, glucose, and waste—but not cells or large proteins." }
        ]
      },
      {
        heading: "Reabsorption and Secretion",
        body: "As filtrate moves through the renal tubule, the proximal tubule reabsorbs most needed substances (glucose, amino acids, most water and ions) back into the blood. The loop of Henle uses a countercurrent multiplier mechanism to establish a concentration gradient in the surrounding tissue, which is essential for concentrating urine—the descending limb is permeable to water (which leaves, concentrating the filtrate), while the ascending limb is permeable to ions but not water. The distal tubule and collecting duct fine-tune the final composition through further reabsorption and secretion (actively moving substances like H+ and K+ from blood into filtrate).",
        keyTerms: [
          { term: "Reabsorption", definition: "The movement of useful substances from the filtrate back into the blood, mainly at the proximal tubule." },
          { term: "Loop of Henle", definition: "The nephron segment that uses a countercurrent multiplier to build a concentration gradient, enabling urine concentration." },
          { term: "Secretion", definition: "The active movement of substances (like H+ and K+) from blood into the filtrate, fine-tuning urine composition." }
        ]
      },
      {
        heading: "Hormonal Regulation of Fluid Balance",
        body: "Antidiuretic hormone (ADH), released by the posterior pituitary in response to high blood osmolarity (concentration) or low blood volume, increases water reabsorption at the collecting duct, concentrating urine and diluting the blood back toward normal. Aldosterone, released by the adrenal cortex as part of the renin-angiotensin-aldosterone system (RAAS) in response to low blood pressure or blood volume, increases sodium (and secondarily water) reabsorption at the distal tubule, raising blood volume and pressure.",
        keyTerms: [
          { term: "ADH (antidiuretic hormone)", definition: "A hormone that increases water reabsorption at the collecting duct in response to high blood osmolarity or low blood volume." },
          { term: "Aldosterone", definition: "A hormone that increases sodium (and water) reabsorption at the distal tubule, raising blood volume and pressure." },
          { term: "RAAS", definition: "The renin-angiotensin-aldosterone system, a hormonal cascade that raises blood pressure in response to low blood volume or pressure." }
        ]
      }
    ],
    keyTakeaways: [
      "Filtration at the glomerulus is nonselective by size, producing filtrate that contains both waste and needed substances.",
      "The proximal tubule reabsorbs most needed substances; the loop of Henle's countercurrent multiplier enables urine concentration; the distal tubule/collecting duct fine-tune the final output.",
      "ADH increases water reabsorption in response to high osmolarity/low volume; aldosterone (via RAAS) increases sodium and water reabsorption in response to low blood pressure/volume."
    ],
    knowledgeCheck: [
      { question: "Why must the body reabsorb glucose and amino acids after filtration, rather than filtering them out directly for excretion?", answer: "Filtration at the glomerulus is nonselective by size, so small, needed molecules like glucose and amino acids are filtered out along with waste and must be actively reabsorbed, mainly at the proximal tubule, to avoid being lost in the urine." },
      { question: "What triggers ADH release, and what is its effect?", answer: "High blood osmolarity or low blood volume triggers ADH release from the posterior pituitary, which increases water reabsorption at the collecting duct, concentrating urine and helping restore normal blood osmolarity/volume." }
    ],
    flashcards: [
      { front: "Glomerulus", back: "Capillary ball where filtration occurs, forcing water/small solutes into Bowman's capsule." },
      { front: "Filtration", back: "Nonselective (by size) movement of water and small solutes out of blood into the nephron." },
      { front: "Loop of Henle", back: "Uses a countercurrent multiplier to build a concentration gradient, enabling urine concentration." },
      { front: "ADH", back: "Increases water reabsorption at the collecting duct; released with high osmolarity/low volume." },
      { front: "Aldosterone", back: "Increases sodium (and water) reabsorption at the distal tubule, raising blood volume/pressure." }
    ],
    practiceQuestions: [
      {
        question: "Why does the filtrate at the glomerulus contain glucose, even though the body needs to conserve glucose?",
        concept: "Filtration",
        options: ["Filtration selectively removes only waste products", "Filtration is nonselective by size, so small molecules like glucose pass through regardless of usefulness", "Glucose is actively secreted at the glomerulus", "The glomerulus only filters large proteins"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—filtration doesn't distinguish waste from useful molecules; it's based only on size.",
          "Correct—filtration is nonselective by size, so small useful molecules like glucose are filtered along with waste and must be reabsorbed afterward.",
          "Incorrect—secretion is a separate, later process at the tubules, not something that occurs at the glomerulus itself.",
          "Incorrect—large proteins are specifically excluded from filtration, not selectively filtered."
        ]
      },
      {
        question: "What is the primary role of the loop of Henle's countercurrent multiplier mechanism?",
        concept: "Loop of Henle",
        options: ["Filtering blood cells out of the filtrate", "Establishing a concentration gradient that enables the kidney to concentrate urine", "Secreting hormones directly into the blood", "Reabsorbing all remaining water immediately"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—filtering blood cells occurs at the glomerulus, not the loop of Henle.",
          "Correct—the countercurrent multiplier builds a concentration gradient in the surrounding tissue, essential for concentrating urine.",
          "Incorrect—the loop of Henle doesn't secrete hormones; it's a filtrate-processing structure.",
          "Incorrect—water reabsorption at the loop is partial (mainly the descending limb) and gradient-dependent, not immediate/complete."
        ]
      },
      {
        question: "A patient with low blood volume shows elevated ADH and aldosterone levels. What is the combined expected effect?",
        concept: "Hormonal regulation",
        options: ["Increased urine output to eliminate excess fluid", "Increased water and sodium reabsorption, raising blood volume", "No change in blood volume", "Decreased blood pressure"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—the body's response to low blood volume is to conserve, not eliminate, fluid.",
          "Correct—ADH increases water reabsorption and aldosterone increases sodium (and water) reabsorption, together raising blood volume back toward normal.",
          "Incorrect—both hormones actively work to change blood volume upward in this scenario.",
          "Incorrect—raising blood volume through these hormones would tend to increase, not decrease, blood pressure."
        ]
      },
      {
        question: "Which nephron segment is responsible for reabsorbing the majority of filtered glucose and amino acids?",
        concept: "Reabsorption",
        options: ["Glomerulus", "Proximal tubule", "Loop of Henle", "Collecting duct"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—the glomerulus is the site of filtration, not reabsorption.",
          "Correct—the proximal tubule reabsorbs most needed substances, including glucose and amino acids, back into the blood.",
          "Incorrect—the loop of Henle's main role is building the concentration gradient, not primary glucose/amino acid reabsorption.",
          "Incorrect—the collecting duct fine-tunes water reabsorption under ADH's influence, not primary nutrient reabsorption."
        ]
      }
    ],
    simplifiedExplanation: "Think of the nephron as a factory recycling line: the glomerulus dumps everything small onto the conveyor belt (nonselective filtration)—useful stuff and waste alike—and then the rest of the nephron is dedicated to picking the useful stuff back off the belt (reabsorption) while letting the waste ride to the end (excretion). The loop of Henle is a clever trick that builds up a 'salty' surrounding environment so water gets pulled out passively later. And two hormones act like thermostats for blood volume: ADH holds onto water when you're low on fluid, and aldosterone holds onto sodium (which drags water with it) when blood pressure drops."
  },
  {
    id: "digestive-system-nutrition",
    subjectId: "organ-systems",
    sectionId: "bio-biochem",
    title: "Digestive System & Nutrition",
    estimatedMinutes: 30,
    difficulty: "Intermediate",
    prerequisiteLessonId: "renal-fluid-balance",
    sections: [
      {
        heading: "Overview of the Digestive Tract",
        body: "The digestive tract is a continuous tube from mouth to anus, with each organ playing a specific role. Mechanical digestion (chewing in the mouth, churning in the stomach) physically breaks food into smaller pieces, increasing surface area; chemical digestion uses enzymes and acid to break chemical bonds in food molecules. The stomach's highly acidic environment (pH ~1.5-3.5) denatures proteins and activates pepsin for protein digestion, while also killing most ingested bacteria.",
        keyTerms: [
          { term: "Mechanical digestion", definition: "The physical breakdown of food into smaller pieces, increasing surface area for enzymes to act on." },
          { term: "Chemical digestion", definition: "The enzymatic and acid-driven breakdown of chemical bonds within food molecules." },
          { term: "Pepsin", definition: "A stomach enzyme, activated by acidic pH, that begins protein digestion." }
        ]
      },
      {
        heading: "Enzymatic Digestion",
        body: "Carbohydrate digestion begins in the mouth with salivary amylase (breaking down starch) and continues in the small intestine with pancreatic amylase. Protein digestion begins in the stomach with pepsin and continues in the small intestine with pancreatic proteases (like trypsin and chymotrypsin), breaking proteins down to peptides and eventually amino acids. Lipid digestion occurs almost entirely in the small intestine: bile (produced by the liver, stored in the gallbladder) emulsifies fats into smaller droplets, increasing surface area for pancreatic lipase to break them down into fatty acids and monoglycerides.",
        keyTerms: [
          { term: "Bile", definition: "A liver-produced, gallbladder-stored substance that emulsifies fats, increasing surface area for lipase to act on." },
          { term: "Pancreatic lipase", definition: "The enzyme that breaks down emulsified fat droplets into fatty acids and monoglycerides in the small intestine." },
          { term: "Trypsin", definition: "A pancreatic protease that continues protein digestion in the small intestine, breaking proteins into smaller peptides." }
        ]
      },
      {
        heading: "Absorption and Nutrition",
        body: "The small intestine is the primary site of nutrient absorption, with its inner surface covered in villi and microvilli that dramatically increase surface area. Monosaccharides and amino acids are absorbed into capillaries within each villus and enter the bloodstream directly; fatty acids and monoglycerides are absorbed into lacteals (lymphatic vessels within each villus) as chylomicrons, entering the lymphatic system before eventually reaching the bloodstream. The large intestine mainly absorbs water and electrolytes from the remaining, largely undigested material.",
        keyTerms: [
          { term: "Villi/microvilli", definition: "Small intestine surface projections that dramatically increase surface area for nutrient absorption." },
          { term: "Lacteal", definition: "A lymphatic vessel within a villus that absorbs fatty acids and monoglycerides as chylomicrons." }
        ]
      }
    ],
    keyTakeaways: [
      "Mechanical digestion increases surface area; chemical digestion (enzymes, acid) breaks chemical bonds—both occur throughout the tract.",
      "Carbohydrates (amylase), proteins (pepsin/trypsin), and fats (bile + lipase) each have their own dedicated digestive process and location.",
      "The small intestine's villi/microvilli maximize absorption surface area—sugars/amino acids go to capillaries, fats go to lacteals via the lymphatic system."
    ],
    knowledgeCheck: [
      { question: "Why is bile necessary for fat digestion, even though it isn't itself an enzyme?", answer: "Bile emulsifies large fat droplets into much smaller ones, dramatically increasing the surface area available for pancreatic lipase to act on—without emulsification, lipase would have far less accessible fat surface to digest." },
      { question: "Why do absorbed fats travel through the lymphatic system while absorbed sugars and amino acids enter capillaries directly?", answer: "Fatty acids and monoglycerides are absorbed into lacteals (lymphatic vessels) as chylomicrons, while water-soluble sugars and amino acids are absorbed directly into the blood capillaries within the villi." }
    ],
    flashcards: [
      { front: "Mechanical digestion", back: "Physical breakdown of food, increasing surface area for enzymes." },
      { front: "Pepsin", back: "Stomach enzyme, activated by acid, that begins protein digestion." },
      { front: "Bile", back: "Emulsifies fats, increasing surface area for pancreatic lipase." },
      { front: "Villi/microvilli", back: "Small intestine surface projections that increase absorption surface area." },
      { front: "Lacteal", back: "Lymphatic vessel absorbing fatty acids/monoglycerides as chylomicrons." }
    ],
    practiceQuestions: [
      {
        question: "What is the primary function of bile in fat digestion?",
        concept: "Enzymatic digestion",
        options: ["Directly breaking chemical bonds in fat molecules", "Emulsifying fat droplets to increase surface area for lipase", "Neutralizing stomach acid", "Producing pancreatic enzymes"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—bile doesn't break chemical bonds itself; that's lipase's role.",
          "Correct—bile emulsifies fat into smaller droplets, increasing surface area for pancreatic lipase to act on.",
          "Incorrect—acid neutralization in the small intestine is primarily done by bicarbonate from the pancreas, not bile.",
          "Incorrect—bile is produced by the liver, not the pancreas, and doesn't produce enzymes."
        ]
      },
      {
        question: "Which enzyme begins protein digestion, and where?",
        concept: "Enzymatic digestion",
        options: ["Amylase, in the mouth", "Pepsin, in the stomach", "Lipase, in the small intestine", "Trypsin, in the mouth"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—amylase begins carbohydrate digestion in the mouth, not protein digestion.",
          "Correct—pepsin, activated by stomach acid, begins protein digestion in the stomach.",
          "Incorrect—lipase digests fats, not proteins.",
          "Incorrect—trypsin continues protein digestion in the small intestine, not the mouth, and doesn't begin the process."
        ]
      },
      {
        question: "Why do the villi and microvilli of the small intestine matter for nutrient absorption?",
        concept: "Absorption",
        options: ["They produce digestive enzymes exclusively", "They dramatically increase the surface area available for absorption", "They neutralize stomach acid before absorption", "They prevent any absorption of water"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—while some enzymes are present at the villi surface, their defining role is increasing surface area, not exclusive enzyme production.",
          "Correct—villi and microvilli dramatically increase the small intestine's surface area, maximizing nutrient absorption.",
          "Incorrect—acid neutralization is a separate function, mainly via pancreatic bicarbonate.",
          "Incorrect—water absorption does occur in the small intestine, alongside the large intestine."
        ]
      },
      {
        question: "Absorbed fatty acids and monoglycerides enter which system first, before eventually reaching the bloodstream?",
        concept: "Absorption",
        options: ["The circulatory system directly", "The lymphatic system, via lacteals", "The nervous system", "The renal system"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—unlike sugars and amino acids, fats don't enter capillaries directly.",
          "Correct—fatty acids and monoglycerides are absorbed into lacteals as chylomicrons, entering the lymphatic system first.",
          "Incorrect—the nervous system has no role in nutrient absorption.",
          "Incorrect—the renal system filters blood; it isn't involved in initial fat absorption from the gut."
        ]
      }
    ],
    simplifiedExplanation: "Digestion is a disassembly line with two tools working together: mechanical (chewing, churning) chops food into smaller pieces, and chemical (enzymes, acid) breaks the actual molecular bonds—carbs get amylase, proteins get pepsin/trypsin, and fats get a two-step process where bile chops fat into tiny droplets first so lipase can actually reach it. The small intestine's shag-carpet lining (villi/microvilli) is built purely to maximize surface area for soaking up the resulting nutrients, with sugars and amino acids taking the fast lane straight into blood vessels, while fats take a longer detour through the lymphatic system first."
  },
  {
    id: "immune-system",
    subjectId: "organ-systems",
    sectionId: "bio-biochem",
    title: "Immune System",
    estimatedMinutes: 30,
    difficulty: "Advanced",
    prerequisiteLessonId: "digestive-system-nutrition",
    sections: [
      {
        heading: "Innate Immunity",
        body: "Innate immunity is the body's fast, nonspecific first line of defense, present from birth and identical for every kind of pathogen. Physical barriers (skin, mucous membranes) and chemical barriers (stomach acid, enzymes in tears/saliva) block most pathogens from entering. If a pathogen breaches these barriers, phagocytes (like macrophages and neutrophils) engulf and destroy it, and the inflammatory response—triggered by chemical signals like histamine—increases blood flow and immune cell recruitment to the site, producing the classic signs of redness, heat, swelling, and pain.",
        keyTerms: [
          { term: "Innate immunity", definition: "The body's fast, nonspecific defense system, present from birth, identical for all pathogens." },
          { term: "Phagocyte", definition: "An innate immune cell (e.g., macrophage, neutrophil) that engulfs and destroys pathogens." },
          { term: "Inflammatory response", definition: "A response to tissue damage or infection that increases blood flow and immune cell recruitment to the affected site." }
        ]
      },
      {
        heading: "Adaptive Immunity: Humoral Response",
        body: "Adaptive immunity is slower to activate than innate immunity but is specific to a particular pathogen and builds lasting memory. The humoral response is mediated by B cells: when a B cell encounters its matching antigen (a specific molecular marker on a pathogen), it proliferates and differentiates into plasma cells, which secrete large quantities of antibodies specific to that antigen. Antibodies neutralize pathogens directly or mark them for destruction by other immune cells. Some activated B cells become memory B cells, persisting long-term and enabling a faster, stronger response if the same pathogen is encountered again.",
        keyTerms: [
          { term: "Antigen", definition: "A specific molecular marker on a pathogen that the immune system recognizes as foreign." },
          { term: "Plasma cell", definition: "A differentiated B cell that secretes large quantities of antibodies specific to one antigen." },
          { term: "Memory B cell", definition: "A long-lived B cell that persists after infection, enabling a faster response upon re-exposure to the same antigen." }
        ]
      },
      {
        heading: "Adaptive Immunity: Cell-Mediated Response",
        body: "The cell-mediated response is carried out primarily by T cells. Helper T cells coordinate the immune response by releasing signaling molecules (cytokines) that activate B cells, cytotoxic T cells, and macrophages. Cytotoxic T cells directly kill infected or abnormal cells (such as virus-infected cells or cancer cells) by recognizing antigen fragments displayed on the infected cell's surface. Like the humoral response, this arm also generates memory T cells, providing long-term, faster protection against future exposure to the same pathogen.",
        keyTerms: [
          { term: "Helper T cell", definition: "A T cell that coordinates the immune response by releasing cytokines that activate B cells, cytotoxic T cells, and macrophages." },
          { term: "Cytotoxic T cell", definition: "A T cell that directly kills infected or abnormal cells by recognizing antigen fragments on their surface." },
          { term: "Cytokine", definition: "A signaling molecule released by immune cells (e.g., helper T cells) to coordinate the immune response." }
        ]
      }
    ],
    keyTakeaways: [
      "Innate immunity is fast and nonspecific (barriers, phagocytes, inflammation); adaptive immunity is slower but specific and builds memory.",
      "Humoral immunity (B cells) produces antibodies specific to an antigen, via plasma cells, and generates memory B cells.",
      "Cell-mediated immunity (T cells) uses helper T cells to coordinate the response and cytotoxic T cells to directly kill infected/abnormal cells."
    ],
    knowledgeCheck: [
      { question: "What is the key functional difference between innate and adaptive immunity?", answer: "Innate immunity is fast, nonspecific, and identical for every pathogen; adaptive immunity is slower to activate but is specific to a particular pathogen and generates lasting immune memory." },
      { question: "How do memory B and T cells enable a faster response upon re-exposure to a pathogen?", answer: "Memory cells persist long after the initial infection is cleared, so if the same pathogen is encountered again, the immune system can mount a faster, stronger response without needing to build the response from scratch." }
    ],
    flashcards: [
      { front: "Innate immunity", back: "Fast, nonspecific defense present from birth, identical for all pathogens." },
      { front: "Phagocyte", back: "Innate immune cell that engulfs and destroys pathogens." },
      { front: "Plasma cell", back: "Differentiated B cell that secretes antibodies specific to one antigen." },
      { front: "Helper T cell", back: "Coordinates the immune response by releasing cytokines that activate other immune cells." },
      { front: "Cytotoxic T cell", back: "Directly kills infected or abnormal cells." }
    ],
    practiceQuestions: [
      {
        question: "Which best distinguishes innate immunity from adaptive immunity?",
        concept: "Innate vs. adaptive immunity",
        options: ["Innate immunity is specific to one pathogen; adaptive is nonspecific", "Innate immunity is fast and nonspecific; adaptive immunity is slower but specific and builds memory", "Only adaptive immunity involves any immune cells at all", "Innate immunity only occurs after vaccination"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—this reverses the actual distinction; innate is nonspecific, adaptive is specific.",
          "Correct—innate immunity responds quickly and identically to any pathogen, while adaptive immunity is slower but pathogen-specific and builds memory.",
          "Incorrect—innate immunity also involves cells, like phagocytes.",
          "Incorrect—innate immunity is present from birth, unrelated to vaccination."
        ]
      },
      {
        question: "A plasma cell is a differentiated form of which immune cell type?",
        concept: "Humoral immunity",
        options: ["Helper T cell", "Cytotoxic T cell", "B cell", "Macrophage"],
        correctIndex: 2,
        optionExplanations: [
          "Incorrect—helper T cells activate B cells but don't themselves become plasma cells.",
          "Incorrect—cytotoxic T cells kill infected cells directly; they aren't the source of plasma cells.",
          "Correct—plasma cells are differentiated B cells that secrete antibodies specific to an encountered antigen.",
          "Incorrect—macrophages are innate immune phagocytes, unrelated to plasma cell differentiation."
        ]
      },
      {
        question: "What is the primary role of a helper T cell in the adaptive immune response?",
        concept: "Cell-mediated immunity",
        options: ["Directly killing infected cells", "Producing antibodies", "Releasing cytokines to coordinate and activate other immune cells", "Serving as a physical barrier to infection"],
        correctIndex: 2,
        optionExplanations: [
          "Incorrect—directly killing infected cells is the role of cytotoxic T cells, not helper T cells.",
          "Incorrect—antibody production is carried out by plasma cells (differentiated B cells), not helper T cells.",
          "Correct—helper T cells release cytokines that coordinate and activate B cells, cytotoxic T cells, and macrophages.",
          "Incorrect—physical barriers are part of innate immunity, unrelated to helper T cell function."
        ]
      },
      {
        question: "After recovering from a viral infection, a person is re-exposed to the same virus years later and mounts a much faster immune response. What best explains this?",
        concept: "Immune memory",
        options: ["Innate immunity has become specific to that virus", "Memory B and T cells generated during the first infection persist and enable a faster response", "The person's inflammatory response has weakened over time", "Phagocytes have developed specificity for the virus"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—innate immunity remains nonspecific; it doesn't develop pathogen-specific memory.",
          "Correct—memory B and T cells generated during the first exposure persist long-term, enabling a faster, stronger response upon re-exposure.",
          "Incorrect—a weakened inflammatory response wouldn't produce a faster, more effective response.",
          "Incorrect—phagocytes are part of the nonspecific innate response and don't develop pathogen-specific memory."
        ]
      }
    ],
    simplifiedExplanation: "The immune system has a fast, generic security guard (innate immunity—barriers, phagocytes, inflammation) that responds to any intruder the same way, and a slower, highly specific detective squad (adaptive immunity) that builds a custom file on each specific pathogen. Within that squad, B cells are the weapons factory, cranking out targeted antibodies (via plasma cells), while T cells are the field agents—helper T cells radio instructions to the rest of the team, and cytotoxic T cells eliminate compromised cells directly. Both squads keep permanent case files (memory cells) so the next time the same intruder shows up, the response is immediate."
  },
  {
    id: "reproductive-system-development",
    subjectId: "organ-systems",
    sectionId: "bio-biochem",
    title: "Reproductive System & Development",
    estimatedMinutes: 30,
    difficulty: "Advanced",
    prerequisiteLessonId: "immune-system",
    sections: [
      {
        heading: "Reproductive Anatomy and Gametogenesis",
        body: "Spermatogenesis occurs continuously in the testes, where diploid germ cells undergo meiosis to produce large numbers of small, motile haploid sperm cells. Oogenesis occurs in the ovaries: a female is born with all the primary oocytes she will ever have, and meiosis is arrested partway through until a single egg is selected for release (ovulation) during each cycle, producing one much larger haploid egg per cycle rather than many. Both processes use meiosis to halve the chromosome number, but differ substantially in timing and number of gametes produced.",
        keyTerms: [
          { term: "Spermatogenesis", definition: "The continuous production of haploid sperm cells from diploid germ cells in the testes via meiosis." },
          { term: "Oogenesis", definition: "The production of a haploid egg cell in the ovaries, with meiosis arrested until ovulation of a single selected oocyte per cycle." },
          { term: "Ovulation", definition: "The release of a mature egg from the ovary, typically once per menstrual cycle." }
        ]
      },
      {
        heading: "Hormonal Regulation of the Menstrual Cycle",
        body: "The menstrual cycle is regulated by the hypothalamic-pituitary-gonadal (HPG) axis. The hypothalamus releases GnRH, stimulating the pituitary to release FSH (stimulating follicle development in the ovary) and LH. Rising estrogen from the developing follicle eventually triggers a sharp LH surge, which causes ovulation. After ovulation, the ruptured follicle becomes the corpus luteum, which secretes progesterone to maintain the uterine lining; if fertilization doesn't occur, the corpus luteum degrades, progesterone falls, and the uterine lining sheds (menstruation), restarting the cycle.",
        keyTerms: [
          { term: "FSH (follicle-stimulating hormone)", definition: "A pituitary hormone that stimulates follicle development in the ovary." },
          { term: "LH surge", definition: "A sharp rise in luteinizing hormone, triggered by rising estrogen, that causes ovulation." },
          { term: "Corpus luteum", definition: "The structure formed from the ruptured follicle after ovulation, secreting progesterone to maintain the uterine lining." }
        ]
      },
      {
        heading: "Fertilization and Early Development",
        body: "Fertilization occurs when a sperm cell fuses with an egg, typically in the fallopian tube, restoring the diploid chromosome number and forming a zygote. The zygote undergoes rapid mitotic divisions (cleavage) without overall growth in size, forming a solid ball of cells (morula) and then a hollow ball (blastocyst). The blastocyst implants into the uterine wall (implantation), after which the placenta develops to support ongoing nutrient and gas exchange between mother and developing embryo.",
        keyTerms: [
          { term: "Zygote", definition: "The diploid cell formed by the fusion of sperm and egg at fertilization." },
          { term: "Cleavage", definition: "Rapid mitotic division of the zygote without overall growth in size, forming a morula and then a blastocyst." },
          { term: "Implantation", definition: "The attachment of the blastocyst to the uterine wall, after which the placenta develops." }
        ]
      }
    ],
    keyTakeaways: [
      "Spermatogenesis (continuous, many sperm) and oogenesis (cyclical, one egg) both use meiosis but differ substantially in timing and output.",
      "The HPG axis regulates the menstrual cycle: FSH drives follicle development, an LH surge triggers ovulation, and the corpus luteum's progesterone maintains the uterine lining afterward.",
      "Fertilization forms a diploid zygote, which undergoes cleavage into a blastocyst that implants in the uterus, after which the placenta develops."
    ],
    knowledgeCheck: [
      { question: "What triggers ovulation during the menstrual cycle?", answer: "Rising estrogen from the developing follicle triggers a sharp LH surge, which causes the mature follicle to rupture and release the egg (ovulation)." },
      { question: "Why does the corpus luteum's degradation lead to menstruation if fertilization doesn't occur?", answer: "The corpus luteum secretes progesterone, which maintains the uterine lining; without fertilization, the corpus luteum degrades, progesterone falls, and the uterine lining can no longer be maintained, so it sheds." }
    ],
    flashcards: [
      { front: "Spermatogenesis", back: "Continuous production of haploid sperm cells via meiosis in the testes." },
      { front: "Oogenesis", back: "Production of one haploid egg per cycle in the ovaries, meiosis arrested until ovulation." },
      { front: "LH surge", back: "Sharp rise in LH, triggered by rising estrogen, that causes ovulation." },
      { front: "Corpus luteum", back: "Structure from the ruptured follicle; secretes progesterone to maintain the uterine lining." },
      { front: "Implantation", back: "Attachment of the blastocyst to the uterine wall, after which the placenta develops." }
    ],
    practiceQuestions: [
      {
        question: "What is a key difference between spermatogenesis and oogenesis?",
        concept: "Gametogenesis",
        options: ["Spermatogenesis produces one large gamete per cycle; oogenesis produces many small ones", "Spermatogenesis is continuous and produces many gametes; oogenesis is cyclical and produces one gamete per cycle", "Neither process involves meiosis", "Oogenesis occurs continuously throughout adult life at the same rate as spermatogenesis"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—this reverses the actual pattern; sperm are small and numerous, eggs are large and produced one at a time.",
          "Correct—spermatogenesis is continuous, producing large numbers of small sperm, while oogenesis is cyclical, producing one large egg per cycle.",
          "Incorrect—both processes use meiosis to produce haploid gametes.",
          "Incorrect—oogenesis is cyclical and arrested at various points, unlike the continuous nature of spermatogenesis."
        ]
      },
      {
        question: "What event directly triggers ovulation?",
        concept: "Menstrual cycle hormones",
        options: ["A drop in FSH", "A sharp LH surge, triggered by rising estrogen", "A rise in progesterone before the follicle develops", "Implantation of the blastocyst"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—a drop in FSH alone doesn't trigger ovulation.",
          "Correct—rising estrogen from the developing follicle triggers a sharp LH surge, which directly causes ovulation.",
          "Incorrect—progesterone rises after ovulation, from the corpus luteum, not before.",
          "Incorrect—implantation occurs after fertilization, well after ovulation, not as its trigger."
        ]
      },
      {
        question: "What is the functional role of the corpus luteum after ovulation?",
        concept: "Menstrual cycle",
        options: ["It releases FSH to stimulate a new follicle", "It secretes progesterone to maintain the uterine lining", "It becomes the site of fertilization", "It produces sperm"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—the corpus luteum secretes progesterone, not FSH.",
          "Correct—the corpus luteum, formed from the ruptured follicle, secretes progesterone to maintain the uterine lining in case of pregnancy.",
          "Incorrect—fertilization typically occurs in the fallopian tube, not at the corpus luteum.",
          "Incorrect—sperm production (spermatogenesis) occurs in the testes, unrelated to the corpus luteum."
        ]
      },
      {
        question: "What process immediately follows fertilization, transforming the zygote into a blastocyst?",
        concept: "Early development",
        options: ["Implantation", "Cleavage (rapid mitotic division without growth)", "Ovulation", "Gastrulation only, with no prior division"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—implantation occurs after the blastocyst has already formed, not immediately after fertilization.",
          "Correct—cleavage is rapid mitotic division without overall growth, transforming the zygote into a morula and then a blastocyst.",
          "Incorrect—ovulation occurs before fertilization, not after.",
          "Incorrect—cleavage precedes further developmental stages; it isn't skipped."
        ]
      }
    ],
    simplifiedExplanation: "Sperm production runs like a factory conveyor belt—continuous and high-volume—while egg production runs like a monthly lottery drawing—one winner selected per cycle from a fixed pool established at birth. The whole monthly cycle is run by a hormonal relay race: FSH grows a follicle, rising estrogen from that follicle triggers an LH surge that pops the egg out (ovulation), and the leftover follicle (corpus luteum) then holds the uterine lining in place with progesterone—unless no fertilization happens, in which case that support gets pulled and the lining sheds. After fertilization, the resulting zygote just divides rapidly into a small ball of cells (no growth yet) until it's ready to implant and start building a placenta."
  }
];

const evolutionEcologyLessons: LessonContent[] = [
  {
    id: "evolution-genetics-ecology",
    subjectId: "evolution-ecology",
    sectionId: "bio-biochem",
    title: "Evolution, Genetics & Ecology",
    estimatedMinutes: 35,
    difficulty: "Advanced",
    prerequisiteLessonId: null,
    sections: [
      {
        heading: "Hardy-Weinberg Equilibrium",
        body: "The Hardy-Weinberg equation (p² + 2pq + q² = 1, where p + q = 1) predicts genotype frequencies in a population that is not evolving. p and q represent the frequencies of the two alleles for a gene; p² and q² represent the frequencies of the two homozygous genotypes, and 2pq represents the frequency of the heterozygous genotype. Hardy-Weinberg equilibrium only holds under five idealized assumptions: no mutation, no migration, no natural selection, random mating, and a very large population size. Comparing a real population's actual genotype frequencies to the Hardy-Weinberg prediction is a direct way to detect whether evolution is occurring.",
        keyTerms: [
          { term: "Hardy-Weinberg equation", definition: "p² + 2pq + q² = 1; predicts genotype frequencies in a non-evolving population, where p + q = 1 are allele frequencies." },
          { term: "Allele frequency", definition: "The proportion of a specific allele among all alleles for that gene in a population (p or q)." },
          { term: "Hardy-Weinberg assumptions", definition: "No mutation, no migration, no natural selection, random mating, and a very large population size." }
        ]
      },
      {
        heading: "Speciation and Mechanisms of Evolution",
        body: "Speciation is the formation of new, reproductively isolated species. Allopatric speciation occurs when a population is physically separated by a geographic barrier, evolving independently until the two groups can no longer interbreed; sympatric speciation occurs without physical separation, through mechanisms like polyploidy in plants. Beyond natural selection, allele frequencies can shift through genetic drift—random chance fluctuations, especially powerful in small populations—including the founder effect (a new, small population founded by few individuals, with unrepresentative allele frequencies) and the bottleneck effect (a population's size is drastically reduced, randomly eliminating much of its genetic variation).",
        keyTerms: [
          { term: "Allopatric speciation", definition: "Speciation driven by physical (geographic) separation of a population into reproductively isolated groups." },
          { term: "Genetic drift", definition: "Random, chance-driven fluctuation in allele frequencies, with a stronger effect in small populations." },
          { term: "Bottleneck effect", definition: "A drastic, random reduction in a population's genetic variation following a sharp drop in population size." }
        ]
      },
      {
        heading: "Community Ecology and Species Interactions",
        body: "Within a community, species interact in several defined ways. In predation, one species (the predator) consumes another (the prey). In competition, two species vie for the same limited resource, which can reduce both populations if their niches (their specific role and resource use within the ecosystem) overlap heavily. Symbiotic relationships include mutualism (both species benefit), commensalism (one benefits, the other is unaffected), and parasitism (one benefits at the other's expense). These interactions, together, help explain a community's overall structure and the relative abundance of each species within it.",
        keyTerms: [
          { term: "Niche", definition: "A species' specific role and pattern of resource use within its ecosystem." },
          { term: "Mutualism", definition: "A symbiotic relationship in which both interacting species benefit." },
          { term: "Parasitism", definition: "A symbiotic relationship in which one species benefits at the expense of the other." }
        ]
      }
    ],
    keyTakeaways: [
      "Hardy-Weinberg equilibrium (p² + 2pq + q² = 1) predicts genotype frequencies in a non-evolving population; deviation from it signals evolution is occurring.",
      "Speciation can be allopatric (geographic separation) or sympatric (without separation); genetic drift, including founder and bottleneck effects, shifts allele frequencies by chance, independent of natural selection.",
      "Community interactions—predation, competition, and symbiosis (mutualism, commensalism, parasitism)—together shape a community's structure."
    ],
    knowledgeCheck: [
      { question: "How can Hardy-Weinberg equilibrium be used to detect whether evolution is occurring in a population?", answer: "By comparing a population's actual, observed genotype frequencies to the frequencies predicted by the Hardy-Weinberg equation under the assumption of no evolution—a significant difference between observed and predicted frequencies indicates evolution is occurring." },
      { question: "What is the difference between the founder effect and the bottleneck effect?", answer: "The founder effect occurs when a small group starts a new, isolated population with unrepresentative allele frequencies; the bottleneck effect occurs when an existing population's size is drastically and suddenly reduced, randomly eliminating much of its prior genetic variation." }
    ],
    flashcards: [
      { front: "Hardy-Weinberg equation", back: "p² + 2pq + q² = 1; predicts genotype frequencies in a non-evolving population." },
      { front: "Allopatric speciation", back: "Speciation driven by geographic separation into reproductively isolated groups." },
      { front: "Genetic drift", back: "Random, chance-driven fluctuation in allele frequencies; strongest in small populations." },
      { front: "Niche", back: "A species' specific role and resource use within its ecosystem." },
      { front: "Mutualism", back: "A symbiotic relationship in which both species benefit." }
    ],
    practiceQuestions: [
      {
        question: "In a population at Hardy-Weinberg equilibrium, the frequency of the recessive allele (q) is 0.2. What is the expected frequency of homozygous recessive individuals (q²)?",
        concept: "Hardy-Weinberg equilibrium",
        options: ["0.2", "0.04", "0.4", "0.96"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—0.2 is the allele frequency (q), not the genotype frequency (q²).",
          "Correct—q² = (0.2)² = 0.04, the expected frequency of homozygous recessive individuals.",
          "Incorrect—0.4 would be 2q, not q².",
          "Incorrect—0.96 doesn't correspond to q² for this allele frequency."
        ]
      },
      {
        question: "A population's observed genotype frequencies differ significantly from those predicted by Hardy-Weinberg equilibrium. What is the most reasonable conclusion?",
        concept: "Hardy-Weinberg equilibrium",
        options: ["The population is not evolving", "The population is evolving, since at least one Hardy-Weinberg assumption is being violated", "The Hardy-Weinberg equation is incorrect", "No conclusion can be drawn from this comparison"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—a significant deviation is evidence the population is not in equilibrium, i.e., it is evolving.",
          "Correct—deviation from predicted Hardy-Weinberg frequencies indicates evolution is occurring, since one or more of the equilibrium assumptions is being violated.",
          "Incorrect—the equation itself is a well-established mathematical model, not something that becomes 'incorrect.'",
          "Incorrect—this comparison is exactly the standard method used to detect evolution in a population."
        ]
      },
      {
        question: "A small group of birds colonizes a remote island and establishes a new population with allele frequencies very different from the mainland population. This is an example of:",
        concept: "Genetic drift",
        options: ["The bottleneck effect", "The founder effect", "Natural selection", "Sympatric speciation"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—the bottleneck effect describes a drastic reduction in an existing population's size, not the founding of a new one.",
          "Correct—a small group founding a new, isolated population with unrepresentative allele frequencies is the founder effect.",
          "Incorrect—this scenario describes a random sampling effect, not selection based on differential fitness.",
          "Incorrect—sympatric speciation occurs without geographic separation, unlike this scenario."
        ]
      },
      {
        question: "Two bird species compete intensely for the same limited nesting sites but do not otherwise directly harm each other. What type of interaction is this?",
        concept: "Community ecology",
        options: ["Predation", "Mutualism", "Competition", "Parasitism"],
        correctIndex: 2,
        optionExplanations: [
          "Incorrect—predation involves one species consuming another, not competing for a shared resource.",
          "Incorrect—mutualism requires both species to benefit; competing for a limited resource benefits neither.",
          "Correct—two species vying for the same limited resource, with overlapping niches, defines competition.",
          "Incorrect—parasitism involves one species benefiting at the direct expense of the other's health, not resource competition."
        ]
      }
    ],
    simplifiedExplanation: "Hardy-Weinberg is a math baseline for a population that isn't evolving—so any real population that doesn't match it is, by definition, evolving somehow. New species form either because a mountain range or ocean splits a population apart (allopatric) or without ever separating (sympatric), and allele frequencies can shift not just from selection but from pure chance, especially in small populations—like a handful of colonists founding a new island population (founder effect) or a population's numbers crashing and taking most of its genetic variety down with it (bottleneck). Zoom out to the community level, and species interact in a few basic patterns: eating each other (predation), fighting over the same resource (competition), or some flavor of living together (mutualism, commensalism, parasitism)."
  }
];

// ---- Chemical & Physical Foundations of Biological Systems ----
// General Chemistry (10), Organic Chemistry (6), and Physics (9)—all 25
// lessons in this section, restructured into the same document-lesson
// layout as lib/documentLessons/ (see lib/documentLessons/index.ts).

const generalChemistryLessons: LessonContent[] = [
  {
    id: "atomic-structure-periodic-trends",
    subjectId: "general-chemistry",
    sectionId: "chem-phys",
    title: "Atomic Structure & Periodic Trends",
    estimatedMinutes: 25,
    difficulty: "Beginner",
    prerequisiteLessonId: null,
    sections: [
      {
        heading: "Atomic Structure and Isotopes",
        body: "An atom's identity is fixed by its number of protons (atomic number, Z); a neutral atom has equal protons and electrons, while the number of neutrons can vary without changing what element it is. Isotopes are atoms of the same element (same Z) with different numbers of neutrons, giving them different mass numbers (A = protons + neutrons)—most elements exist as a natural mix of isotopes, which is why atomic masses on the periodic table are weighted averages, not whole numbers.",
        keyTerms: [
          { term: "Atomic number (Z)", definition: "The number of protons in an atom's nucleus; defines the element." },
          { term: "Isotope", definition: "Atoms of the same element with different numbers of neutrons, and therefore different mass numbers." }
        ]
      },
      {
        heading: "Electron Configuration",
        body: "The Aufbau principle fills orbitals in order of increasing energy (1s, 2s, 2p, 3s, 3p, 4s, 3d...); Hund's rule says electrons occupy degenerate orbitals within a subshell singly, with parallel spins, before any pairing occurs. The Pauli exclusion principle limits each orbital to two electrons, and only if their spins are opposite—together these three rules let you predict an atom's full electron configuration and, from that, its valence electron count and chemical behavior.",
        keyTerms: [
          { term: "Aufbau principle", definition: "Electrons fill orbitals from lowest to highest energy." },
          { term: "Hund's rule", definition: "Electrons occupy degenerate orbitals singly, with parallel spins, before pairing." },
          { term: "Pauli exclusion principle", definition: "No orbital holds more than two electrons, and only with opposite spins." }
        ]
      },
      {
        heading: "Periodic Trends",
        body: "Moving left to right across a period, effective nuclear charge increases while electrons are added to the same shell, so atomic radius shrinks and it becomes progressively harder to remove an electron (ionization energy rises) or easier to attract one (electronegativity, electron affinity rise). Moving down a group, each new row adds an entire electron shell, so atomic radius increases and the outermost electrons—now farther from the nucleus and more shielded—are held less tightly, so ionization energy and electronegativity decrease.",
        keyTerms: [
          { term: "Effective nuclear charge", definition: "The net positive charge felt by valence electrons, after accounting for shielding by inner electrons." },
          { term: "Ionization energy", definition: "The energy required to remove an electron from a gaseous atom or ion." },
          { term: "Electronegativity", definition: "An atom's tendency to attract shared electrons in a bond." }
        ]
      }
    ],
    keyTakeaways: [
      "Atomic number (protons) defines the element; isotopes share that atomic number but differ in neutrons and therefore mass number.",
      "Aufbau (lowest energy first), Hund's rule (singly occupy degenerate orbitals before pairing), and Pauli exclusion (max two electrons per orbital, opposite spins) together determine an atom's electron configuration.",
      "Across a period, increasing effective nuclear charge shrinks atomic radius and raises ionization energy/electronegativity; down a group, added electron shells increase radius and lower them."
    ],
    knowledgeCheck: [
      { question: "What distinguishes an isotope from a completely different element?", answer: "Isotopes share the same atomic number (proton count)—what defines the element—but differ in neutron count and therefore mass number." },
      { question: "Why does ionization energy generally increase across a period from left to right?", answer: "Effective nuclear charge increases as electrons are added to the same shell, holding valence electrons more tightly and making them harder to remove." }
    ],
    flashcards: [
      { front: "Atomic number (Z)", back: "Number of protons; defines the element." },
      { front: "Isotope", back: "Same element, different neutron count and mass number." },
      { front: "Aufbau principle", back: "Fill orbitals from lowest to highest energy." },
      { front: "Hund's rule", back: "Singly occupy degenerate orbitals before pairing." },
      { front: "Electronegativity trend", back: "Increases across a period, decreases down a group." }
    ],
    practiceQuestions: [
      {
        question: "Carbon-12 and carbon-14 are both forms of carbon. What makes them isotopes of the same element rather than different elements?",
        concept: "Atomic structure and isotopes",
        options: ["They have the same mass number", "They have the same number of protons", "They have the same number of neutrons", "They have the same number of electrons in their outer shell only"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—their mass numbers actually differ (12 vs. 14), since they have different neutron counts.",
          "Correct—isotopes share the same atomic number (proton count), which is what defines the element.",
          "Incorrect—it's exactly their differing neutron counts that distinguishes carbon-12 from carbon-14.",
          "Incorrect—valence electron count doesn't define isotopes; proton count does."
        ]
      },
      {
        question: "Why does nitrogen's ground-state electron configuration place one electron in each of its three 2p orbitals rather than pairing two electrons in one orbital first?",
        concept: "Electron configuration",
        options: ["The Pauli exclusion principle forbids any pairing in p orbitals", "Hund's rule favors maximum unpaired electrons with parallel spin across degenerate orbitals before pairing", "The Aufbau principle requires filling from highest to lowest energy", "Nitrogen has too few electrons to pair any of them"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—Pauli exclusion allows pairing (with opposite spins); it just limits each orbital to two electrons.",
          "Correct—Hund's rule specifically governs distribution among orbitals of equal energy, favoring single occupancy first.",
          "Incorrect—Aufbau fills from lowest to highest energy, not highest to lowest.",
          "Incorrect—nitrogen has 7 electrons, plenty to pair if Hund's rule didn't apply."
        ]
      },
      {
        question: "Which explanation correctly accounts for why ionization energy generally increases across a period from left to right?",
        concept: "Periodic trends",
        options: ["Atomic radius increases, making electrons easier to remove", "Effective nuclear charge increases, holding valence electrons more tightly", "Electrons are added to a new, farther shell", "Shielding from inner electrons increases substantially"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—atomic radius actually decreases across a period, not increases.",
          "Correct—increasing effective nuclear charge pulls valence electrons in more tightly, raising ionization energy.",
          "Incorrect—electrons across a period fill the same shell, not a new one.",
          "Incorrect—shielding from inner electrons stays roughly constant across a period, since no new inner shell is added."
        ]
      },
      {
        question: "Comparing sodium (Na) and chlorine (Cl), both in period 3, which has the larger atomic radius and why?",
        concept: "Periodic trends",
        options: ["Chlorine, because it has a higher atomic number", "Sodium, because it has a lower effective nuclear charge pulling its valence electron in", "They have identical atomic radii since they're in the same period", "Chlorine, because it has more electron shells"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—higher atomic number in the same period corresponds to smaller radius, not larger.",
          "Correct—sodium's lower effective nuclear charge holds its valence electron less tightly, giving it a larger atomic radius than chlorine.",
          "Incorrect—atomic radius changes considerably across a period; same-period elements are not equal in size.",
          "Incorrect—both are in period 3, so they have the same number of electron shells."
        ]
      }
    ],
    simplifiedExplanation: "Think of an atom's identity card as just its proton count—everything else (neutrons, electron arrangement) can vary without changing who it is, which is exactly what isotopes are. Electrons fill up an atom the way people fill a stadium's row of seats: lowest, cheapest seats first (Aufbau), everyone tries to grab their own seat before doubling up (Hund's rule), and each seat only fits two people who don't want to sit exactly the same way (Pauli exclusion). Once you know how many electrons are in the outermost 'seats,' periodic trends fall out almost automatically: more protons pulling on the same shell (across a period) makes atoms smaller and grabbier for electrons, while adding a whole new shell (down a group) makes them bigger and looser."
  },
  {
    id: "chemical-bonding-molecular-structure",
    subjectId: "general-chemistry",
    sectionId: "chem-phys",
    title: "Chemical Bonding & Molecular Structure",
    estimatedMinutes: 25,
    difficulty: "Beginner",
    prerequisiteLessonId: "atomic-structure-periodic-trends",
    sections: [
      {
        heading: "Ionic vs. Covalent Bonding",
        body: "Ionic bonds form when one atom is electronegative enough to pull an electron away from another entirely, creating oppositely charged ions held together by electrostatic attraction—typical of a metal bonding with a nonmetal. Covalent bonds form when atoms share electrons instead of transferring them; if the atoms have similar electronegativity the sharing is roughly equal (nonpolar covalent), and if one atom is modestly more electronegative the shared electrons sit closer to it, creating a bond dipole (polar covalent).",
        keyTerms: [
          { term: "Ionic bond", definition: "A bond formed by electron transfer, creating oppositely charged ions held by electrostatic attraction." },
          { term: "Polar covalent bond", definition: "A covalent bond where shared electrons sit closer to the more electronegative atom, creating a bond dipole." }
        ]
      },
      {
        heading: "Lewis Structures and VSEPR",
        body: "Drawing a Lewis structure means arranging all valence electrons as bonding pairs and lone pairs so each atom (usually) achieves an octet; formal charge helps choose the best structure, and resonance applies when electrons can be delocalized across more than one valid arrangement. VSEPR theory starts from the Lewis structure's electron groups around the central atom and arranges them to minimize repulsion—two groups give linear geometry, three give trigonal planar, four give tetrahedral, and lone pairs compress bond angles more than bonding pairs do.",
        keyTerms: [
          { term: "Lewis structure", definition: "A diagram showing valence electrons as bonding pairs and lone pairs." },
          { term: "VSEPR theory", definition: "Predicts molecular geometry by minimizing repulsion between electron groups around a central atom." }
        ]
      },
      {
        heading: "Hybridization and Sigma/Pi Bonds",
        body: "A central atom's hybridization state matches its number of electron groups: two groups give sp (linear), three give sp2 (trigonal planar), four give sp3 (tetrahedral)—these hybrid orbitals form sigma bonds and hold lone pairs. Any bond beyond the first between two atoms is a pi bond, formed by sideways overlap of unhybridized p orbitals; pi bonds prevent free rotation around that bond axis, which is why double bonds create fixed cis/trans geometry.",
        keyTerms: [
          { term: "Sigma bond", definition: "A bond from head-on orbital overlap, allowing free rotation; present in every single bond." },
          { term: "Pi bond", definition: "A bond from sideways p-orbital overlap; restricts rotation and adds to double/triple bonds." }
        ]
      }
    ],
    keyTakeaways: [
      "Electronegativity difference predicts bond type: large differences give ionic bonds, small differences give covalent bonds (polar or nonpolar).",
      "Lewis structures show electron distribution; VSEPR uses electron-group count to predict 3D molecular geometry.",
      "Hybridization (sp/sp2/sp3) forms sigma bonds; extra bonds in double/triple bonds are pi bonds, which restrict rotation."
    ],
    knowledgeCheck: [
      { question: "What determines whether a bond between two atoms is ionic or covalent?", answer: "The electronegativity difference between the atoms—large differences favor ionic bonds (electron transfer), small differences favor covalent bonds (electron sharing)." },
      { question: "Why can't the two carbons in a C=C double bond rotate freely relative to each other?", answer: "The pi bond's sideways p-orbital overlap would be broken by rotation, so it restricts rotation around that bond axis (the sigma bond component alone would allow free rotation)." }
    ],
    flashcards: [
      { front: "Ionic bond", back: "Electron transfer; large electronegativity difference." },
      { front: "Covalent bond", back: "Electron sharing; small electronegativity difference." },
      { front: "VSEPR theory", back: "Predicts geometry by minimizing electron-group repulsion." },
      { front: "Sigma bond", back: "Head-on overlap; allows free rotation." },
      { front: "Pi bond", back: "Sideways p-orbital overlap; restricts rotation." }
    ],
    practiceQuestions: [
      {
        question: "A bond forms between an atom with low electronegativity and one with very high electronegativity. What type of bond is most likely to result?",
        concept: "Ionic vs. covalent bonding",
        options: ["Nonpolar covalent", "Polar covalent", "Ionic", "No bond will form"],
        correctIndex: 2,
        optionExplanations: [
          "Incorrect—nonpolar covalent requires very similar electronegativities, not a large difference.",
          "Incorrect—polar covalent requires a smaller, intermediate electronegativity difference.",
          "Correct—a large electronegativity difference favors essentially complete electron transfer, forming an ionic bond.",
          "Incorrect—a bond does form; the large electronegativity difference just changes its character."
        ]
      },
      {
        question: "Ammonia (NH3) has three bonding pairs and one lone pair around nitrogen. Why is its molecular geometry trigonal pyramidal rather than tetrahedral?",
        concept: "Lewis structures and VSEPR",
        options: ["Molecular geometry only counts electron groups, not atoms, so it's still tetrahedral", "The lone pair occupies one of the four positions, but molecular geometry describes only atom positions, not the lone pair", "Lone pairs don't count as electron groups", "Nitrogen doesn't obey VSEPR theory"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—molecular geometry specifically describes atom positions, which is why it differs from electron-group geometry here.",
          "Correct—the electron-group geometry is tetrahedral, but with a lone pair occupying one position, the visible atom shape is trigonal pyramidal.",
          "Incorrect—lone pairs do count as electron groups for determining electron-group geometry.",
          "Incorrect—nitrogen's arrangement in ammonia is a standard VSEPR example, not an exception."
        ]
      },
      {
        question: "Ethylene (H2C=CH2) has a carbon-carbon double bond. Why can't the two CH2 groups rotate freely around it?",
        concept: "Hybridization and sigma/pi bonds",
        options: ["Double bonds are too short and rigid to rotate", "The pi bond's sideways p-orbital overlap would be broken by rotation", "Sp2 carbons cannot rotate under any circumstances", "Double bonds contain two sigma bonds, which lock rotation"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—bond length isn't the reason rotation is restricted; the pi bond's geometry is.",
          "Correct—rotating around the double bond would misalign the p orbitals forming the pi bond, breaking that overlap.",
          "Incorrect—sp2 carbons can rotate freely around single bonds; it's the pi bond specifically that restricts rotation.",
          "Incorrect—a double bond is one sigma bond plus one pi bond, not two sigma bonds."
        ]
      },
      {
        question: "Carbon dioxide (CO2) has two electron groups around its central carbon, with no lone pairs on carbon. What molecular geometry and hybridization does this predict?",
        concept: "Lewis structures and VSEPR",
        options: ["Bent geometry, sp3 hybridization", "Trigonal planar geometry, sp2 hybridization", "Linear geometry, sp hybridization", "Tetrahedral geometry, sp3 hybridization"],
        correctIndex: 2,
        optionExplanations: [
          "Incorrect—bent geometry results from four electron groups with two lone pairs, not two electron groups with none.",
          "Incorrect—trigonal planar requires three electron groups, not two.",
          "Correct—two electron groups with no lone pairs gives linear geometry and sp hybridization, matching CO2's actual structure.",
          "Incorrect—tetrahedral requires four electron groups, not two."
        ]
      }
    ],
    simplifiedExplanation: "Bonding is basically a tug-of-war over electrons: if one atom wins outright, that's an ionic bond (a clean transfer); if the atoms share more or less evenly, that's covalent. Once you know a molecule's Lewis structure (who's bonded to whom, and where the lone pairs sit), VSEPR just arranges those electron groups as far apart as possible, the same way people spread out to avoid touching in a crowded room—lone pairs take up a bit more 'personal space' than bonding pairs, which is why they squeeze bond angles down. Hybridization and sigma/pi bonds explain the mechanics underneath that shape: sigma bonds are the sturdy, rotatable backbone, while pi bonds are extra, more fragile bonds layered on top that lock a double bond's two ends from spinning relative to each other."
  },
  {
    id: "stoichiometry-chemical-reactions",
    subjectId: "general-chemistry",
    sectionId: "chem-phys",
    title: "Stoichiometry & Chemical Reactions",
    estimatedMinutes: 25,
    difficulty: "Beginner",
    prerequisiteLessonId: "chemical-bonding-molecular-structure",
    sections: [
      {
        heading: "The Mole and Molar Mass",
        body: "A mole is simply a very large counting number, defined so that one mole of a substance's molar mass in grams contains exactly Avogadro's number (6.022 × 10^23) of particles. Molar mass (g/mol), found by summing atomic masses from the periodic table, is the conversion factor between the mass of a sample and the number of moles it contains—every stoichiometry calculation starts by converting given quantities into moles.",
        keyTerms: [
          { term: "Mole", definition: "A counting unit equal to Avogadro's number (6.022 × 10^23) of particles." },
          { term: "Molar mass", definition: "The mass in grams of one mole of a substance; converts between mass and moles." }
        ]
      },
      {
        heading: "Limiting Reactant and Yield",
        body: "A balanced equation's coefficients give the mole ratio in which reactants combine; when reactants aren't supplied in exactly that ratio, one runs out first (the limiting reactant) and stops the reaction, while the other is left over (in excess). Theoretical yield is the maximum product possible, calculated from the limiting reactant; percent yield = (actual yield / theoretical yield) × 100% reflects real-world losses.",
        keyTerms: [
          { term: "Limiting reactant", definition: "The reactant that runs out first, capping the amount of product that can form." },
          { term: "Theoretical yield", definition: "The maximum product possible, calculated from the limiting reactant." },
          { term: "Percent yield", definition: "(Actual yield / theoretical yield) × 100%; reflects real-world losses." }
        ]
      },
      {
        heading: "Classifying Reaction Types",
        body: "Synthesis (A + B → AB) combines two substances into one; decomposition (AB → A + B) breaks one substance into two or more; single displacement (A + BC → AC + B) swaps one element into a compound. Double displacement (AB + CD → AD + CB) swaps ions between two compounds, often producing a precipitate, gas, or water; combustion reactions involve a hydrocarbon reacting with O2 to produce CO2 and H2O.",
        keyTerms: [
          { term: "Double displacement", definition: "A reaction where two compounds swap ionic partners, often forming a precipitate." },
          { term: "Combustion", definition: "A hydrocarbon reacting with O2 to produce CO2 and H2O, releasing energy." }
        ]
      }
    ],
    keyTakeaways: [
      "The mole is a counting unit tied to Avogadro's number; molar mass converts between a substance's mass and its amount in moles.",
      "The limiting reactant runs out first and caps theoretical yield; percent yield compares actual product recovered to that maximum.",
      "Reaction type can be identified from the pattern of reactants and products: synthesis, decomposition, single/double displacement, and combustion."
    ],
    knowledgeCheck: [
      { question: "How do you determine which reactant is limiting in a reaction?", answer: "Convert all given quantities to moles, then compare the mole ratio actually supplied to the mole ratio required by the balanced equation—whichever reactant would run out first, based on that comparison, is limiting." },
      { question: "What information does percent yield provide that theoretical yield alone doesn't?", answer: "Percent yield reflects real-world losses (incomplete reactions, side reactions, purification losses) by comparing the actual amount of product recovered to the theoretical maximum." }
    ],
    flashcards: [
      { front: "Mole", back: "6.022 × 10^23 particles (Avogadro's number)." },
      { front: "Molar mass", back: "Grams per mole; converts mass to moles." },
      { front: "Limiting reactant", back: "Runs out first; caps the amount of product." },
      { front: "Theoretical yield", back: "Maximum possible product from the limiting reactant." },
      { front: "Combustion reaction", back: "Hydrocarbon + O2 → CO2 + H2O + energy." }
    ],
    practiceQuestions: [
      {
        question: "A sample contains 2 moles of water (H2O, molar mass 18 g/mol). What is the mass of the sample?",
        concept: "The mole and molar mass",
        options: ["9 g", "18 g", "36 g", "6.022 × 10^23 g"],
        correctIndex: 2,
        optionExplanations: [
          "Incorrect—9 g would be half of one mole's mass, not two moles.",
          "Incorrect—18 g is the mass of only 1 mole, not 2 moles.",
          "Correct—mass = moles × molar mass = 2 mol × 18 g/mol = 36 g.",
          "Incorrect—this confuses Avogadro's number (a particle count) with mass in grams."
        ]
      },
      {
        question: "In the reaction N2 + 3H2 → 2NH3, 1 mole of N2 is mixed with 2 moles of H2. Which reactant is limiting?",
        concept: "Limiting reactant and yield",
        options: ["N2, because it has a coefficient of 1", "H2, because 1 mole of N2 requires 3 moles of H2 but only 2 are available", "Neither—they are both fully consumed", "It cannot be determined without molar masses"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—a coefficient of 1 doesn't by itself determine which reactant is limiting.",
          "Correct—the equation requires 3 moles of H2 per mole of N2, but only 2 moles of H2 are available, so H2 runs out first.",
          "Incorrect—with H2 limiting, N2 will be left over (in excess), not fully consumed.",
          "Incorrect—the moles given are already sufficient to determine the limiting reactant via mole ratios; molar mass isn't needed here."
        ]
      },
      {
        question: "AgNO3(aq) + NaCl(aq) → AgCl(s) + NaNO3(aq). What type of reaction is this?",
        concept: "Classifying reaction types",
        options: ["Synthesis", "Decomposition", "Single displacement", "Double displacement"],
        correctIndex: 3,
        optionExplanations: [
          "Incorrect—synthesis combines two substances into one; here, two compounds swap partners instead.",
          "Incorrect—decomposition breaks one substance into two or more; two compounds start as reactants here.",
          "Incorrect—single displacement involves one element displacing another; no free element is involved here.",
          "Correct—the silver and sodium ions swap partners between the two compounds, defining a double displacement reaction."
        ]
      },
      {
        question: "A reaction's theoretical yield is 50 g, but only 40 g of product is actually recovered. What is the percent yield?",
        concept: "Limiting reactant and yield",
        options: ["50%", "60%", "80%", "125%"],
        correctIndex: 2,
        optionExplanations: [
          "Incorrect—50% doesn't match the given actual/theoretical values.",
          "Incorrect—60% doesn't match (40/50) × 100%.",
          "Correct—percent yield = (actual/theoretical) × 100% = (40/50) × 100% = 80%.",
          "Incorrect—125% would require actual yield to exceed theoretical yield, which shouldn't happen in a real reaction."
        ]
      }
    ],
    simplifiedExplanation: "Stoichiometry is just unit conversion with a recipe attached: the mole is the 'serving size' chemists count in, and a balanced equation is the recipe ratio telling you how many servings of each ingredient (reactant) combine to make how many servings of the finished dish (product). Run out of one ingredient before the others, and that's your limiting reactant—it doesn't matter how much of everything else you have left over, the dish can only be as big as your smallest ingredient allows. And just like a real kitchen, the recipe's 'theoretical' yield rarely matches what actually comes out, which is exactly what percent yield measures."
  },
  {
    id: "solutions-concentrations",
    subjectId: "general-chemistry",
    sectionId: "chem-phys",
    title: "Solutions & Concentrations",
    estimatedMinutes: 30,
    difficulty: "Intermediate",
    prerequisiteLessonId: "stoichiometry-chemical-reactions",
    sections: [
      {
        heading: "Concentration Units",
        body: "Molarity (M) = moles of solute / liters of solution is the standard concentration unit for reactions and titrations, but it changes slightly with temperature. Molality (m) = moles of solute / kilograms of solvent is temperature-independent and is the unit used for colligative property calculations; mole fraction (x) = moles of one component / total moles of all components is used in Raoult's law and vapor pressure problems.",
        keyTerms: [
          { term: "Molarity", definition: "Moles of solute per liter of solution; the standard reaction concentration unit." },
          { term: "Molality", definition: "Moles of solute per kilogram of solvent; temperature-independent, used for colligative properties." }
        ]
      },
      {
        heading: "Colligative Properties",
        body: "Adding solute particles to a solvent raises its boiling point (ΔTb = i·Kb·m) and lowers its freezing point (ΔTf = i·Kf·m), because dissolved particles disrupt the solvent's ability to freeze or boil normally. The van't Hoff factor (i) accounts for solutes that dissociate into multiple particles in solution—NaCl (i = 2) has twice the colligative effect of an equal molal concentration of glucose (i = 1)—and osmotic pressure (Π = iMRT) follows the same particle-counting logic.",
        keyTerms: [
          { term: "Colligative property", definition: "A property (boiling point, freezing point, osmotic pressure) that depends only on the number of dissolved particles." },
          { term: "Van't Hoff factor (i)", definition: "The number of particles a solute dissociates into in solution." }
        ]
      },
      {
        heading: "Dilutions and Solution Stoichiometry",
        body: "Diluting a solution adds solvent without adding more solute, so the moles of solute before and after dilution are equal: M1V1 = M2V2. This same mole-conservation logic extends to titrations, where the moles of titrant added at the equivalence point equal the moles of analyte originally present (adjusted for stoichiometric ratio).",
        keyTerms: [
          { term: "Dilution", definition: "Adding solvent to a solution without changing the moles of solute present." },
          { term: "M1V1 = M2V2", definition: "The dilution equation; moles of solute are conserved before and after dilution." }
        ]
      }
    ],
    keyTakeaways: [
      "Molarity (mol/L solution) is standard for reactions; molality (mol/kg solvent) is temperature-independent and used for colligative properties.",
      "Colligative properties depend on the total number of dissolved particles, scaled by the van't Hoff factor for solutes that dissociate.",
      "Dilution conserves moles of solute while changing volume and concentration, summarized by M1V1 = M2V2."
    ],
    knowledgeCheck: [
      { question: "Why is molality used instead of molarity for freezing point depression calculations?", answer: "Molality is based on mass of solvent, which doesn't change with temperature, unlike solution volume (which molarity depends on)." },
      { question: "Why does a 1 M CaCl2 solution have a greater colligative effect than a 1 M glucose solution?", answer: "CaCl2 dissociates into three ions (i = 3), while glucose doesn't dissociate at all (i = 1), so CaCl2's effective particle concentration is three times higher." }
    ],
    flashcards: [
      { front: "Molarity", back: "Moles solute / liters solution." },
      { front: "Molality", back: "Moles solute / kg solvent; temperature-independent." },
      { front: "Van't Hoff factor", back: "Number of particles a solute dissociates into." },
      { front: "Colligative property", back: "Depends only on number of dissolved particles." },
      { front: "M1V1 = M2V2", back: "Dilution equation; moles of solute conserved." }
    ],
    practiceQuestions: [
      {
        question: "Why is molality, rather than molarity, used in freezing point depression and boiling point elevation calculations?",
        concept: "Concentration units",
        options: ["Molality is always a larger number than molarity", "Molality is based on mass of solvent, which doesn't change with temperature, unlike solution volume", "Molarity cannot be calculated for aqueous solutions", "Freezing and boiling points don't depend on concentration"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—molality isn't inherently larger; it just uses a different denominator.",
          "Correct—molality's mass-based denominator is unaffected by temperature, unlike molarity's volume-based denominator.",
          "Incorrect—molarity can be calculated for aqueous solutions; it's just less convenient for temperature-changing calculations.",
          "Incorrect—these properties absolutely do depend on concentration, which is the entire premise of this topic."
        ]
      },
      {
        question: "Equal molal solutions of glucose (a nonelectrolyte) and CaCl2 (which dissociates into 3 ions) are compared. Which has the greater freezing point depression?",
        concept: "Colligative properties",
        options: ["Glucose, because smaller molecules have a bigger effect", "CaCl2, because its van't Hoff factor of 3 gives it three times the effective particle concentration", "They are equal, since molality alone determines freezing point depression", "Neither depresses freezing point; only boiling point is affected"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—molecular size isn't the deciding factor; particle count is.",
          "Correct—CaCl2's dissociation into 3 ions triples its effective particle concentration compared to non-dissociating glucose.",
          "Incorrect—molality must be multiplied by the van't Hoff factor to get effective particle concentration; they are not equal here.",
          "Incorrect—solutes depress freezing point and elevate boiling point simultaneously."
        ]
      },
      {
        question: "50 mL of a 4 M NaOH solution is diluted to a final volume of 200 mL. What is the new concentration?",
        concept: "Dilutions and solution stoichiometry",
        options: ["0.5 M", "1 M", "2 M", "4 M"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—0.5 M doesn't satisfy M1V1 = M2V2 for these values.",
          "Correct—(4 M)(50 mL) = M2(200 mL), so M2 = 200/200 = 1 M.",
          "Incorrect—2 M doesn't satisfy the dilution equation here.",
          "Incorrect—4 M was the original, undiluted concentration."
        ]
      },
      {
        question: "A solution's osmotic pressure is measured. Which factor, if doubled while all else stays constant, would double the osmotic pressure according to Π = iMRT?",
        concept: "Colligative properties",
        options: ["The container's volume", "The molar concentration (M)", "The type of solute used, regardless of dissociation", "The atmospheric pressure"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—container volume doesn't appear in the osmotic pressure equation.",
          "Correct—Π is directly proportional to M, so doubling molar concentration doubles osmotic pressure (holding i, R, T constant).",
          "Incorrect—the solute's identity matters only through its van't Hoff factor (i), not arbitrarily.",
          "Incorrect—atmospheric pressure isn't part of the osmotic pressure equation."
        ]
      }
    ],
    simplifiedExplanation: "Concentration units are just different ways of answering 'how crowded is this solution,' and which one you use depends on what you're about to calculate—molarity for reactions, molality when temperature is changing. Colligative properties are solution behavior that only cares about headcount, not who's in the room: freezing point, boiling point, and osmotic pressure all shift based purely on how many dissolved particles are present, which is why a salt that splits into three ions packs three times the punch of a sugar that stays in one piece. Dilution, meanwhile, is just adding more room to the same crowd—the number of people (moles of solute) never changes, only how spread out they are."
  },
  {
    id: "gases-liquids-solids",
    subjectId: "general-chemistry",
    sectionId: "chem-phys",
    title: "Gases, Liquids & Solids",
    estimatedMinutes: 30,
    difficulty: "Intermediate",
    prerequisiteLessonId: "solutions-concentrations",
    sections: [
      {
        heading: "Gas Laws and Kinetic Molecular Theory",
        body: "The ideal gas law, PV = nRT, combines Boyle's, Charles's, and Avogadro's laws into one equation, assuming gas particles have negligible volume and no intermolecular attraction. In a mixture of gases, Dalton's law of partial pressures says each gas contributes to the total pressure independently and proportionally to its mole fraction: Ptotal = P1 + P2 + ....",
        keyTerms: [
          { term: "Ideal gas law", definition: "PV = nRT; relates pressure, volume, moles, and temperature for an idealized gas." },
          { term: "Dalton's law", definition: "Total pressure of a gas mixture is the sum of each component's partial pressure." }
        ]
      },
      {
        heading: "Real Gases and Intermolecular Forces",
        body: "Real gases deviate from ideal behavior most at high pressure (particles are forced close together) and low temperature (particles move slowly enough for attractions to matter). Intermolecular forces increase from London dispersion forces (present in all molecules) to dipole-dipole forces (between polar molecules) to hydrogen bonding (H bonded directly to N, O, or F).",
        keyTerms: [
          { term: "London dispersion force", definition: "A weak, temporary attraction present in all molecules from momentary electron imbalance." },
          { term: "Hydrogen bonding", definition: "A strong dipole-dipole interaction when H is bonded directly to N, O, or F." }
        ]
      },
      {
        heading: "Phase Changes and Phase Diagrams",
        body: "On a heating curve, temperature plateaus during a phase change, since added heat goes into overcoming intermolecular forces rather than raising kinetic energy. A phase diagram plots pressure vs. temperature; the triple point is where all three phases coexist, and the critical point is where the liquid-gas distinction disappears.",
        keyTerms: [
          { term: "Triple point", definition: "The unique pressure/temperature condition where solid, liquid, and gas coexist in equilibrium." },
          { term: "Critical point", definition: "The point beyond which liquid and gas become indistinguishable (a supercritical fluid)." }
        ]
      }
    ],
    keyTakeaways: [
      "PV = nRT relates the four gas variables for an idealized gas; Dalton's law sums partial pressures in a gas mixture.",
      "Real gases deviate from ideal behavior at high pressure and low temperature, where intermolecular forces become significant.",
      "Heating curve plateaus mark phase changes; phase diagrams map stable phases, including the triple point and critical point."
    ],
    knowledgeCheck: [
      { question: "Under what conditions do real gases deviate most from ideal gas behavior?", answer: "At high pressure (particles are forced close together, so volume and attraction matter) and low temperature (particles move slowly enough for intermolecular attractions to have a noticeable effect)." },
      { question: "Why does temperature stay constant during a phase change even though heat is still being added?", answer: "The added heat is being used to overcome intermolecular forces and separate particles into the next phase, not to increase kinetic energy (which is what temperature measures)." }
    ],
    flashcards: [
      { front: "Ideal gas law", back: "PV = nRT" },
      { front: "Dalton's law", back: "Total pressure = sum of partial pressures." },
      { front: "London dispersion force", back: "Weakest IMF; present in all molecules." },
      { front: "Hydrogen bonding", back: "Strongest common IMF; H bonded to N, O, or F." },
      { front: "Triple point", back: "Pressure/temperature where all three phases coexist." }
    ],
    practiceQuestions: [
      {
        question: "A rigid, sealed container holds a fixed amount of gas. If the temperature is increased, what happens to the pressure?",
        concept: "Gas laws and kinetic molecular theory",
        options: ["Pressure decreases, since volume must decrease to compensate", "Pressure increases, since temperature and pressure are directly proportional at constant volume and moles", "Pressure stays the same", "It cannot be determined without knowing the specific gas"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—the container is rigid, so volume cannot change to compensate.",
          "Correct—with n and V fixed, P = (nR/V)T shows P and T are directly proportional.",
          "Incorrect—pressure does change, since temperature is changing and volume is fixed.",
          "Incorrect—the ideal gas law applies generally, without needing to know the specific gas identity."
        ]
      },
      {
        question: "Why does water (H2O, boiling point 100°C) have a much higher boiling point than H2S (boiling point -60°C), despite similar molar mass?",
        concept: "Real gases and intermolecular forces",
        options: ["H2O molecules are heavier, giving them stronger dispersion forces", "Water can form hydrogen bonds, while H2S cannot", "H2S is a much larger molecule", "Boiling point is unrelated to intermolecular forces"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—their molar masses are actually comparable, so dispersion force differences don't explain this large a gap.",
          "Correct—water's O-H bonds allow strong hydrogen bonding, while H2S's lower electronegativity means it lacks meaningful hydrogen bonding.",
          "Incorrect—H2S is not meaningfully larger than H2O; their sizes are comparable.",
          "Incorrect—boiling point is directly determined by the strength of intermolecular forces that must be overcome."
        ]
      },
      {
        question: "On a heating curve for water, temperature stays at 100°C for several minutes while heat is continuously added as the liquid boils. Where does this energy go?",
        concept: "Phase changes and phase diagrams",
        options: ["It isn't being added; the heat source has stopped", "Increasing the kinetic energy of the water molecules", "Overcoming intermolecular forces (hydrogen bonds) to separate liquid molecules into gas", "Decreasing the entropy of the system"],
        correctIndex: 2,
        optionExplanations: [
          "Incorrect—heat is genuinely still being added throughout the plateau.",
          "Incorrect—kinetic energy (and therefore temperature) stays constant during the plateau, so energy isn't going there.",
          "Correct—energy goes into breaking hydrogen bonds to separate molecules into the gas phase, not into raising temperature.",
          "Incorrect—entropy increases (not decreases) going from liquid to gas."
        ]
      },
      {
        question: "A gas sample is compressed to a very high pressure at a low temperature. Compared to ideal gas law predictions, how does the real gas's behavior likely differ?",
        concept: "Real gases and intermolecular forces",
        options: ["It will behave essentially identically to an ideal gas", "It will deviate significantly, since particle volume and intermolecular attractions become significant under these conditions", "It will deviate only if the gas is a noble gas", "Real gases only deviate from ideal behavior at very high temperature"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—high pressure and low temperature are exactly the conditions where ideal gas assumptions break down most.",
          "Correct—at high pressure and low temperature, particle volume and intermolecular attraction (both ignored by the ideal gas law) become significant.",
          "Incorrect—this deviation applies to all real gases, not just noble gases.",
          "Incorrect—deviation is greatest at low temperature, not high temperature."
        ]
      }
    ],
    simplifiedExplanation: "The ideal gas law describes a fantasy world where gas particles are infinitely small and completely ignore each other—which works fine most of the time, but breaks down exactly when you'd expect: cram particles close together (high pressure) or slow them down enough to actually notice each other (low temperature), and their real size and stickiness (intermolecular forces) start to matter. Those same intermolecular forces are the whole story behind liquids and solids too—the stronger the attraction between molecules, the more energy it takes to pull them apart into a gas, which is exactly why a heating curve pauses at each phase change: all the added energy is going into prying molecules apart, not speeding them up."
  },
  {
    id: "thermochemistry-thermodynamics",
    subjectId: "general-chemistry",
    sectionId: "chem-phys",
    title: "Thermochemistry & Thermodynamics",
    estimatedMinutes: 30,
    difficulty: "Intermediate",
    prerequisiteLessonId: "gases-liquids-solids",
    sections: [
      {
        heading: "Enthalpy and Hess's Law",
        body: "Enthalpy change (ΔH) is negative for exothermic reactions and positive for endothermic reactions; because enthalpy is a state function, ΔH depends only on initial and final states, not on the path taken. Hess's law exploits this: if a reaction can be written as the sum of two or more steps, its overall ΔH is simply the sum of each step's ΔH (reversing a step flips the sign; scaling a step scales its ΔH).",
        keyTerms: [
          { term: "Enthalpy (ΔH)", definition: "Heat exchanged at constant pressure; negative for exothermic, positive for endothermic reactions." },
          { term: "Hess's law", definition: "The ΔH of an overall reaction equals the sum of the ΔH of steps that add up to it." }
        ]
      },
      {
        heading: "Entropy and Gibbs Free Energy",
        body: "Entropy increases (ΔS > 0) when a system becomes more disordered. A reaction is spontaneous when ΔG < 0; since ΔG = ΔH - TΔS, a reaction that is exothermic and increases entropy is always spontaneous, one that is endothermic and decreases entropy is never spontaneous, and the other two combinations depend on temperature.",
        keyTerms: [
          { term: "Entropy (ΔS)", definition: "A measure of disorder/dispersal; increases when a system becomes more disordered." },
          { term: "Gibbs free energy (ΔG)", definition: "ΔG = ΔH - TΔS; determines spontaneity (spontaneous when ΔG < 0)." }
        ]
      },
      {
        heading: "Calorimetry",
        body: "The equation q = mcΔT calculates heat absorbed or released by a substance, where c (specific heat capacity) is the heat needed to raise 1 gram of the substance by 1°C. In a calorimeter, heat lost by one substance equals heat gained by another, assuming no heat escapes to the environment.",
        keyTerms: [
          { term: "Specific heat capacity (c)", definition: "The heat needed to raise 1 gram of a substance by 1°C." },
          { term: "Calorimetry", definition: "Measuring heat transfer using q = mcΔT and conservation of energy." }
        ]
      }
    ],
    keyTakeaways: [
      "Enthalpy (ΔH) is a state function measuring heat at constant pressure; Hess's law sums step ΔH values to find an overall ΔH.",
      "Gibbs free energy (ΔG = ΔH - TΔS) determines spontaneity: exothermic + entropy-increasing reactions are always spontaneous; the reverse is never spontaneous; the other two combinations depend on temperature.",
      "Calorimetry uses q = mcΔT and conservation of energy (heat lost equals heat gained) to calculate heat transfer."
    ],
    knowledgeCheck: [
      { question: "How does Hess's law let you calculate the ΔH of a reaction you can't measure directly?", answer: "By summing the ΔH values of a series of steps (reversing or scaling as needed) that add up to the overall reaction, since enthalpy is a state function depending only on initial and final states." },
      { question: "Why is a reaction that is exothermic and increases entropy always spontaneous?", answer: "Both terms in ΔG = ΔH - TΔS work in the spontaneous direction: negative ΔH and positive ΔS (making -TΔS negative) combine to guarantee ΔG is negative at any temperature." }
    ],
    flashcards: [
      { front: "Enthalpy (ΔH)", back: "Heat at constant pressure; negative for exothermic." },
      { front: "Hess's law", back: "Sum step ΔH values to get overall ΔH." },
      { front: "Entropy (ΔS)", back: "Measure of disorder; increases with more disorder." },
      { front: "Gibbs free energy", back: "ΔG = ΔH - TΔS; spontaneous when ΔG < 0." },
      { front: "q = mcΔT", back: "Calculates heat absorbed or released." }
    ],
    practiceQuestions: [
      {
        question: "Reaction 1 (A → B) has ΔH = +40 kJ. Reaction 2 (B → C) has ΔH = -60 kJ. What is ΔH for A → C?",
        concept: "Enthalpy and Hess's law",
        options: ["+100 kJ", "+20 kJ", "-20 kJ", "-100 kJ"],
        correctIndex: 2,
        optionExplanations: [
          "Incorrect—this would result from subtracting incorrectly rather than summing the two given ΔH values.",
          "Incorrect—+20 kJ doesn't match the correct sum of +40 kJ and -60 kJ.",
          "Correct—summing the two steps (A → B → C) gives +40 + (-60) = -20 kJ.",
          "Incorrect—this would require doubling one of the values, which isn't warranted here."
        ]
      },
      {
        question: "A reaction has ΔH > 0 (endothermic) and ΔS > 0 (entropy increases). Under what condition is this reaction spontaneous?",
        concept: "Entropy and Gibbs free energy",
        options: ["It is always spontaneous, regardless of temperature", "It is never spontaneous, regardless of temperature", "It is spontaneous only at high temperature", "It is spontaneous only at low temperature"],
        correctIndex: 2,
        optionExplanations: [
          "Incorrect—a positive ΔH works against spontaneity at low temperature, so it isn't always spontaneous.",
          "Incorrect—at high enough temperature, the -TΔS term can outweigh the positive ΔH, making it spontaneous.",
          "Correct—at high temperature, -TΔS becomes large and negative enough to outweigh positive ΔH, making ΔG negative.",
          "Incorrect—at low temperature, the -TΔS term is small, so ΔG stays positive (non-spontaneous)."
        ]
      },
      {
        question: "A 50 g sample of metal at 100°C is placed into 100 g of water at 20°C, and they reach a common final temperature. Which principle is used to solve for that temperature?",
        concept: "Calorimetry",
        options: ["The metal and water each independently reach equilibrium with the room", "Heat lost by the metal equals heat gained by the water (conservation of energy)", "The metal and water must end up at the same temperature they started at", "Specific heat capacity is irrelevant to this calculation"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—the problem assumes an isolated system between the metal and water, not each reaching equilibrium with an outside room.",
          "Correct—energy conservation (assuming no heat escapes) requires heat lost by the metal to equal heat gained by the water.",
          "Incorrect—the whole point is finding a new, shared final temperature different from either starting temperature.",
          "Incorrect—specific heat capacity is essential, since q = mcΔT is used for both substances."
        ]
      },
      {
        question: "Which combination of ΔH and ΔS values guarantees a reaction is non-spontaneous (ΔG > 0) at every temperature?",
        concept: "Entropy and Gibbs free energy",
        options: ["ΔH < 0, ΔS > 0", "ΔH < 0, ΔS < 0", "ΔH > 0, ΔS < 0", "ΔH > 0, ΔS > 0"],
        correctIndex: 2,
        optionExplanations: [
          "Incorrect—this combination (exothermic, entropy-increasing) is always spontaneous, not always non-spontaneous.",
          "Incorrect—this combination is temperature-dependent, not guaranteed non-spontaneous at every temperature.",
          "Correct—positive ΔH and negative ΔS both work against spontaneity (ΔG = ΔH - TΔS stays positive at any temperature).",
          "Incorrect—this combination is also temperature-dependent, not guaranteed non-spontaneous."
        ]
      }
    ],
    simplifiedExplanation: "Enthalpy is heat accounting, and because it's a state function, it doesn't matter which route you take to get from reactants to products—only where you started and ended—which is exactly why Hess's law lets you add up steps like a travel itinerary and still land on the right total. Spontaneity is a tug-of-war between two things a reaction wants: to release energy (favorable ΔH) and to spread out into more disorder (favorable ΔS)—Gibbs free energy is the referee that combines both, weighted by temperature, into a single verdict. Calorimetry is just watching that heat accounting happen in real time: whatever heat one object loses, another object in the same system must gain, no exceptions."
  },
  {
    id: "chemical-equilibrium",
    subjectId: "general-chemistry",
    sectionId: "chem-phys",
    title: "Chemical Equilibrium",
    estimatedMinutes: 35,
    difficulty: "Advanced",
    prerequisiteLessonId: "thermochemistry-thermodynamics",
    sections: [
      {
        heading: "The Equilibrium Constant and Reaction Quotient",
        body: "For a reaction aA + bB ⇌ cC + dD, the equilibrium constant K = [C]^c[D]^d / [A]^a[B]^b, with pure solids and liquids omitted. The reaction quotient Q has the same expression but uses concentrations at any point in time; comparing Q to K tells you which way the reaction will shift—if Q < K, forward; if Q > K, reverse; if Q = K, already at equilibrium.",
        keyTerms: [
          { term: "Equilibrium constant (K)", definition: "The ratio of products to reactants at equilibrium, from the law of mass action." },
          { term: "Reaction quotient (Q)", definition: "The same expression as K, but using concentrations at any point in time." }
        ]
      },
      {
        heading: "Le Chatelier's Principle",
        body: "Adding a reactant (or removing a product) shifts equilibrium forward, and vice versa; decreasing volume (increasing pressure) shifts equilibrium toward the side with fewer moles of gas. Temperature changes actually change the value of K itself: treating heat as a reactant (endothermic) or product (exothermic) predicts the shift.",
        keyTerms: [
          { term: "Le Chatelier's principle", definition: "A system at equilibrium shifts to relieve a disturbance and reestablish equilibrium." }
        ]
      },
      {
        heading: "ICE Tables and Equilibrium Calculations",
        body: "An ICE table lists each species' Initial concentration, the Change it undergoes (using stoichiometric coefficients and unknown x), and the resulting Equilibrium concentration. Substituting the Equilibrium row into the K expression gives an algebraic equation solvable for x; when K is very small, the approximation that x is negligible often simplifies the algebra.",
        keyTerms: [
          { term: "ICE table", definition: "Initial, Change, Equilibrium—organizes concentration changes toward equilibrium." }
        ]
      }
    ],
    keyTakeaways: [
      "K describes the product/reactant ratio at equilibrium; comparing Q to K predicts whether a reaction shifts forward (Q < K) or reverse (Q > K).",
      "Le Chatelier's principle predicts a system's response to disturbance: shifts to relieve concentration changes, shifts toward fewer gas moles under pressure, and K itself changes with temperature.",
      "ICE tables track Initial, Change, and Equilibrium concentrations, letting you solve for unknown equilibrium concentrations via the K expression."
    ],
    knowledgeCheck: [
      { question: "How do you predict which direction a reaction will shift to reach equilibrium?", answer: "Calculate the reaction quotient Q and compare it to K—if Q < K the reaction shifts forward, if Q > K it shifts in reverse, and if Q = K it's already at equilibrium." },
      { question: "Why is temperature different from other equilibrium disturbances (like concentration or pressure changes)?", answer: "Temperature changes actually change the value of K itself, not just shift the position of equilibrium the way concentration or pressure changes do." }
    ],
    flashcards: [
      { front: "Equilibrium constant (K)", back: "Product/reactant ratio at equilibrium." },
      { front: "Reaction quotient (Q)", back: "Same expression as K, at any point in time." },
      { front: "Le Chatelier's principle", back: "System shifts to relieve a disturbance." },
      { front: "ICE table", back: "Initial, Change, Equilibrium concentrations." },
      { front: "Q < K", back: "Reaction shifts forward toward products." }
    ],
    practiceQuestions: [
      {
        question: "For a reaction with K = 10, a reaction mixture currently has Q = 2. Which direction will the reaction proceed?",
        concept: "The equilibrium constant and reaction quotient",
        options: ["Forward, toward more products, since Q < K", "Reverse, toward more reactants, since Q < K", "The reaction is already at equilibrium", "It cannot be determined without concentrations"],
        correctIndex: 0,
        optionExplanations: [
          "Correct—since Q (2) is less than K (10), the reaction proceeds forward until Q rises to equal K.",
          "Incorrect—Q < K means the reaction needs to move toward products (forward), not reactants.",
          "Incorrect—Q and K are not equal here, so the system is not yet at equilibrium.",
          "Incorrect—Q and K alone are sufficient to determine the direction of shift."
        ]
      },
      {
        question: "For the exothermic reaction N2(g) + 3H2(g) ⇌ 2NH3(g), what happens to the equilibrium position if temperature is increased?",
        concept: "Le Chatelier's principle",
        options: ["Equilibrium shifts forward, favoring more NH3", "Equilibrium shifts in reverse, favoring N2 and H2", "No shift occurs", "The reaction stops entirely"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—for an exothermic reaction, adding heat shifts equilibrium away from products, not toward them.",
          "Correct—treating heat as a product of this exothermic reaction, adding heat shifts equilibrium in reverse, favoring reactants.",
          "Incorrect—temperature is one of the disturbances that does cause a shift (and changes K itself).",
          "Incorrect—the reaction continues; it just re-equilibrates at a new position."
        ]
      },
      {
        question: "In an ICE table for the reaction A ⇌ B + C, starting with only 1.0 M of A and no B or C, what does the 'Change' row show for each species?",
        concept: "ICE tables and equilibrium calculations",
        options: ["A: +x, B: -x, C: -x", "A: -x, B: +x, C: +x", "A: -2x, B: +x, C: +x", "All species change by the same fixed amount, unrelated to x"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—A is consumed (should be -x), not produced, as the reaction proceeds forward.",
          "Correct—A is consumed (-x) while B and C are produced (+x each), matching their 1:1:1 stoichiometry.",
          "Incorrect—A's coefficient is 1, not 2, so its change should be -x, not -2x.",
          "Incorrect—the changes are expressed in terms of the variable x, not a fixed, unrelated amount."
        ]
      },
      {
        question: "A sealed container at equilibrium contains a gas-phase reaction with more moles of gas on the product side than the reactant side. If the container's volume is suddenly decreased, which way does equilibrium shift?",
        concept: "Le Chatelier's principle",
        options: ["Toward products, since decreasing volume favors more moles of gas", "Toward reactants, since decreasing volume favors fewer moles of gas", "No shift occurs, since volume doesn't affect equilibrium", "It depends on whether the reaction is exothermic or endothermic"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—decreasing volume (increasing pressure) favors the side with fewer moles of gas, not more.",
          "Correct—decreasing volume increases pressure, and equilibrium shifts toward the side with fewer gas moles (the reactant side here) to partially relieve that increase.",
          "Incorrect—volume/pressure changes do shift equilibrium when moles of gas differ between sides.",
          "Incorrect—the pressure/volume shift depends on relative moles of gas, not on whether the reaction is exo- or endothermic (that's relevant for temperature changes instead)."
        ]
      }
    ],
    simplifiedExplanation: "Equilibrium isn't a finish line—it's a busy two-way street where forward and reverse reactions are both still happening, just at matched speeds, so nothing appears to change overall. K is the street's 'normal traffic ratio,' and Q is just a snapshot of current traffic—compare the two, and you know which direction traffic needs to shift to get back to normal. Le Chatelier's principle is that self-correcting mechanism in action: push on the system (add a reactant, squeeze the volume, change the temperature) and it pushes back, shifting to counteract whatever you just did. ICE tables are simply the bookkeeping tool that turns all of this into solvable algebra."
  },
  {
    id: "acids-bases-buffers",
    subjectId: "general-chemistry",
    sectionId: "chem-phys",
    title: "Acids, Bases & Buffers",
    estimatedMinutes: 35,
    difficulty: "Advanced",
    prerequisiteLessonId: "chemical-equilibrium",
    sections: [
      {
        heading: "Acid-Base Theories",
        body: "The Arrhenius definition (acids produce H+ in water, bases produce OH-) is the most limited; the Brønsted-Lowry definition (acids donate a proton, bases accept a proton) is more general; the Lewis definition (acids accept an electron pair, bases donate one) is the broadest. In a Brønsted-Lowry reaction, the acid becomes its conjugate base after losing H+, and the base becomes its conjugate acid after gaining H+.",
        keyTerms: [
          { term: "Brønsted-Lowry acid", definition: "A species that donates a proton (H+)." },
          { term: "Conjugate acid-base pair", definition: "Two species differing by a single proton, related by donation/acceptance of H+." }
        ]
      },
      {
        heading: "pH, pKa, and the Henderson-Hasselbalch Equation",
        body: "A lower pKa means a stronger acid; pH and pKa use the same logarithmic relationship as concentration and equilibrium constants. The Henderson-Hasselbalch equation, pH = pKa + log([A-]/[HA]), directly connects a solution's pH to the ratio of a weak acid's conjugate base to its undissociated acid; when [A-] = [HA], pH = pKa exactly.",
        keyTerms: [
          { term: "pKa", definition: "-log(Ka); a measure of acid strength—lower pKa means a stronger acid." },
          { term: "Henderson-Hasselbalch equation", definition: "pH = pKa + log([A-]/[HA]); relates pH to the conjugate base/acid ratio." }
        ]
      },
      {
        heading: "Buffers and Titration Curves",
        body: "A buffer resists pH change because it contains both a weak acid and its conjugate base; buffer capacity is greatest near its pKa. On a titration curve, the equivalence point is where titrant exactly neutralizes the analyte, and the half-equivalence point (where pH = pKa) is where exactly half the original acid has been converted to its conjugate base.",
        keyTerms: [
          { term: "Buffer", definition: "A weak acid and its conjugate base (or weak base and conjugate acid) that resists pH change." },
          { term: "Equivalence point", definition: "The point in a titration where titrant exactly neutralizes the analyte." }
        ]
      }
    ],
    keyTakeaways: [
      "Brønsted-Lowry acids donate H+ and bases accept H+, forming conjugate acid-base pairs; strong acids/bases dissociate completely, weak ones partially.",
      "The Henderson-Hasselbalch equation connects pH and pKa; when a weak acid and its conjugate base are equally concentrated, pH equals pKa.",
      "A buffer resists pH change, most effectively near its pKa; on a titration curve, pH = pKa at the half-equivalence point."
    ],
    knowledgeCheck: [
      { question: "What is the Brønsted-Lowry definition of an acid and a base?", answer: "An acid donates a proton (H+); a base accepts a proton—the resulting species after donation/acceptance are called conjugate acid-base pairs." },
      { question: "Why does a buffer resist pH change most effectively near its pKa?", answer: "Near its pKa, a buffer contains substantial, roughly equal amounts of both the weak acid and its conjugate base, so it can neutralize either added acid or added base effectively." }
    ],
    flashcards: [
      { front: "Brønsted-Lowry acid", back: "Donates a proton (H+)." },
      { front: "Conjugate base", back: "What remains after an acid donates H+." },
      { front: "pKa", back: "-log(Ka); lower pKa = stronger acid." },
      { front: "Henderson-Hasselbalch", back: "pH = pKa + log([A-]/[HA])" },
      { front: "Half-equivalence point", back: "Where pH = pKa in a titration." }
    ],
    practiceQuestions: [
      {
        question: "In the reaction NH3 + H2O ⇌ NH4+ + OH-, which species is the conjugate acid of NH3?",
        concept: "Acid-base theories",
        options: ["H2O", "OH-", "NH4+", "NH3 has no conjugate acid in this reaction"],
        correctIndex: 2,
        optionExplanations: [
          "Incorrect—H2O is the acid in this reaction, not related to NH3 as a conjugate pair.",
          "Incorrect—OH- is the conjugate base of H2O, not related to NH3.",
          "Correct—NH3 accepts a proton to become NH4+, its conjugate acid.",
          "Incorrect—NH3 does have a conjugate acid here: NH4+."
        ]
      },
      {
        question: "A weak acid has a pKa of 4.75. In a solution where [A-] = [HA], what is the solution's pH?",
        concept: "pH, pKa, and Henderson-Hasselbalch",
        options: ["0", "4.75", "7.00", "9.50"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—pH of 0 would require an extremely concentrated strong acid, not this scenario.",
          "Correct—when [A-] = [HA], log(1) = 0, so pH = pKa = 4.75.",
          "Incorrect—7.00 would be neutral pH, not what Henderson-Hasselbalch gives here.",
          "Incorrect—9.50 doesn't match pH = pKa + log(1)."
        ]
      },
      {
        question: "On a titration curve for a weak acid titrated with a strong base, why does the curve appear relatively flat near the half-equivalence point?",
        concept: "Buffers and titration curves",
        options: ["The reaction has stopped in that region", "This is the buffer region, where roughly equal amounts of weak acid and conjugate base resist pH change", "No titrant is being added during this region", "The solution is at its equivalence point throughout this region"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—the reaction continues throughout the titration, not just outside this region.",
          "Correct—substantial amounts of both the weak acid and its conjugate base near the half-equivalence point create an effective buffer.",
          "Incorrect—titrant continues to be added throughout the titration, including this region.",
          "Incorrect—the equivalence point is a single, distinct point (a steep rise), not this flat buffer region."
        ]
      },
      {
        question: "Which of the following would most increase the acidity (lower the pKa) of a carboxylic acid?",
        concept: "pH, pKa, and Henderson-Hasselbalch",
        options: ["Adding an electron-donating group near the acidic proton", "Adding an electron-withdrawing group (like a halogen) near the acidic proton", "Increasing the molecule's overall size with no functional change", "Removing all polar groups from the molecule"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—electron-donating groups would destabilize the negative charge on the conjugate base, decreasing acidity.",
          "Correct—electron-withdrawing groups stabilize the negative charge on the conjugate base inductively, increasing acidity (lowering pKa).",
          "Incorrect—size alone, without an electronic effect, doesn't meaningfully change acidity.",
          "Incorrect—removing polar groups would generally decrease, not increase, acidity."
        ]
      }
    ],
    simplifiedExplanation: "Acid-base chemistry is fundamentally about who's handing off a proton and who's catching it—Brønsted-Lowry acids give, bases receive, and whatever's left over on each side (the conjugate pair) is just the same molecule missing or holding an extra H+. pH and pKa speak the same logarithmic language, and Henderson-Hasselbalch is the translator connecting them: it tells you that when a weak acid and its conjugate base are in equal supply, the pH just is the pKa, no other math needed. A buffer is basically a shock absorber built from that same equal mixture—stock enough of both the acid and its conjugate base, and the solution can soak up a punch of added acid or base without its pH swinging wildly."
  },
  {
    id: "redox-electrochemistry",
    subjectId: "general-chemistry",
    sectionId: "chem-phys",
    title: "Redox & Electrochemistry",
    estimatedMinutes: 35,
    difficulty: "Advanced",
    prerequisiteLessonId: "acids-bases-buffers",
    sections: [
      {
        heading: "Oxidation States and Redox Reactions",
        body: "Oxidation states are assigned by rules and track how an atom's oxidation state changes across a reaction to identify whether it's being oxidized or reduced. The species oxidized (loses electrons) is the reducing agent; the species reduced (gains electrons) is the oxidizing agent.",
        keyTerms: [
          { term: "Oxidation", definition: "Loss of electrons; oxidation state increases." },
          { term: "Reducing agent", definition: "The species that is oxidized, enabling another species to be reduced." }
        ]
      },
      {
        heading: "Galvanic (Voltaic) Cells",
        body: "In a galvanic cell, oxidation happens at the anode and reduction happens at the cathode—electrons flow through the external wire from anode to cathode. Standard cell potential, E°cell = E°cathode - E°anode, is positive for a spontaneous galvanic cell, connecting to ΔG° = -nFE°cell.",
        keyTerms: [
          { term: "Anode", definition: "The electrode where oxidation occurs." },
          { term: "Cathode", definition: "The electrode where reduction occurs." }
        ]
      },
      {
        heading: "Electrolytic Cells",
        body: "Electrolytic cells require an external power source to drive a nonspontaneous redox reaction (negative E°cell), unlike galvanic cells which generate current from a spontaneous one. Oxidation still occurs at the anode and reduction at the cathode, but the polarity relative to the power source is reversed compared to a galvanic cell.",
        keyTerms: [
          { term: "Electrolysis", definition: "Using external electrical current to drive a nonspontaneous redox reaction." }
        ]
      }
    ],
    keyTakeaways: [
      "The species oxidized (loses electrons) is the reducing agent, and the species reduced (gains electrons) is the oxidizing agent.",
      "In a galvanic cell, oxidation occurs at the anode and reduction at the cathode; a positive E°cell indicates a spontaneous reaction.",
      "Electrolytic cells use external electrical energy to drive a nonspontaneous reaction, while galvanic cells generate electrical energy from a spontaneous one."
    ],
    knowledgeCheck: [
      { question: "How do you determine which species is the oxidizing agent in a redox reaction?", answer: "The oxidizing agent is the species that is reduced (gains electrons)—it's named for what it does to the other species (causes it to be oxidized), which is the opposite of what happens to itself." },
      { question: "What is the fundamental difference between a galvanic cell and an electrolytic cell?", answer: "A galvanic cell generates electrical energy from a spontaneous redox reaction; an electrolytic cell uses external electrical energy to drive a nonspontaneous redox reaction." }
    ],
    flashcards: [
      { front: "Oxidation", back: "Loss of electrons." },
      { front: "Reduction", back: "Gain of electrons." },
      { front: "Anode", back: "Where oxidation occurs." },
      { front: "Cathode", back: "Where reduction occurs." },
      { front: "Galvanic cell", back: "Generates current from a spontaneous reaction." }
    ],
    practiceQuestions: [
      {
        question: "In the reaction Zn + Cu2+ → Zn2+ + Cu, zinc's oxidation state goes from 0 to +2. What role does zinc play?",
        concept: "Oxidation states and redox reactions",
        options: ["Zinc is oxidized and acts as the oxidizing agent", "Zinc is oxidized and acts as the reducing agent", "Zinc is reduced and acts as the oxidizing agent", "Zinc is reduced and acts as the reducing agent"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—zinc is oxidized, but the species oxidized is called the reducing agent, not the oxidizing agent.",
          "Correct—zinc loses electrons (oxidized), and by enabling Cu2+ to be reduced, it acts as the reducing agent.",
          "Incorrect—zinc is oxidized (loses electrons), not reduced.",
          "Incorrect—zinc is indeed the reducing agent, but it is oxidized, not reduced."
        ]
      },
      {
        question: "In a galvanic cell built from Zn/Zn2+ and Cu/Cu2+ half-cells, electrons flow spontaneously from zinc to copper. Which electrode is the anode?",
        concept: "Galvanic (voltaic) cells",
        options: ["Copper, because reduction occurs there", "Copper, because oxidation occurs there", "Zinc, because oxidation occurs there and releases the electrons that flow through the wire", "Zinc, because reduction occurs there"],
        correctIndex: 2,
        optionExplanations: [
          "Incorrect—copper is where reduction occurs, making it the cathode, not the anode.",
          "Incorrect—oxidation occurs at zinc, not copper.",
          "Correct—zinc loses electrons (oxidation), and oxidation defines the anode.",
          "Incorrect—reduction occurs at copper, not zinc."
        ]
      },
      {
        question: "Which statement correctly distinguishes an electrolytic cell from a galvanic cell?",
        concept: "Electrolytic cells",
        options: ["Reduction occurs at the anode in an electrolytic cell but not a galvanic cell", "An electrolytic cell drives a nonspontaneous reaction using external electrical energy, while a galvanic cell generates electrical energy from a spontaneous reaction", "Electrolytic cells don't involve electron transfer", "Galvanic cells always have a negative E°cell"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—oxidation occurs at the anode in both cell types; this doesn't change between them.",
          "Correct—this spontaneity/energy-direction distinction is the defining difference between the two cell types.",
          "Incorrect—electrolytic cells absolutely involve electron transfer, driven by an external source.",
          "Incorrect—galvanic cells have a positive E°cell, since they run on spontaneous reactions."
        ]
      },
      {
        question: "A galvanic cell has E°cathode = +0.34 V and E°anode = -0.76 V. What is E°cell, and is the reaction spontaneous?",
        concept: "Galvanic (voltaic) cells",
        options: ["-0.42 V; not spontaneous", "+0.42 V; spontaneous", "+1.10 V; spontaneous", "-1.10 V; not spontaneous"],
        correctIndex: 2,
        optionExplanations: [
          "Incorrect—this doesn't match E°cell = E°cathode - E°anode with these values.",
          "Incorrect—+0.42 V doesn't match the correct subtraction.",
          "Correct—E°cell = 0.34 - (-0.76) = 1.10 V, positive and therefore spontaneous.",
          "Incorrect—the sign and magnitude here don't match E°cathode - E°anode."
        ]
      }
    ],
    simplifiedExplanation: "Redox reactions are always a paired transaction—one species loses electrons (oxidized) exactly as another gains them (reduced), and the naming convention flips what you'd expect: whichever species gets oxidized is called the reducing agent, because its sacrifice is what allows something else to be reduced. Galvanic cells physically separate that electron handoff across a wire, letting you harvest useful current from a reaction that wants to happen anyway (oxidation at the anode, reduction at the cathode, always). Electrolytic cells just run that same setup in reverse—instead of harvesting current from a willing reaction, you're forcing current into an unwilling one, spending electrical energy to make a nonspontaneous reaction happen anyway."
  },
  {
    id: "chemical-kinetics",
    subjectId: "general-chemistry",
    sectionId: "chem-phys",
    title: "Chemical Kinetics",
    estimatedMinutes: 35,
    difficulty: "Advanced",
    prerequisiteLessonId: "redox-electrochemistry",
    sections: [
      {
        heading: "Reaction Rates and Rate Laws",
        body: "The rate law's exponents (reaction orders) must be determined from experimental data, not read from the balanced equation's coefficients. The rate constant k is specific to a given reaction at a given temperature; overall reaction order is the sum of the individual orders.",
        keyTerms: [
          { term: "Rate law", definition: "rate = k[A]^m[B]^n; describes how rate depends on concentration, with orders determined experimentally." },
          { term: "Reaction order", definition: "The exponent on a reactant's concentration in the rate law." }
        ]
      },
      {
        heading: "Reaction Mechanisms and the Rate-Determining Step",
        body: "A mechanism is a series of elementary steps that sum to the overall reaction; intermediates are produced in one step and consumed in a later step. The rate-determining step (the slowest step) bottlenecks the overall rate, and the overall rate law is written directly from that step's reactants.",
        keyTerms: [
          { term: "Rate-determining step", definition: "The slowest elementary step in a mechanism; controls the overall rate law." },
          { term: "Intermediate", definition: "A species produced in one mechanism step and consumed in a later one." }
        ]
      },
      {
        heading: "Activation Energy and Catalysts",
        body: "The Arrhenius equation, k = Ae^(-Ea/RT), shows that k increases with temperature and decreases with higher activation energy. A catalyst speeds up a reaction by providing a lower-activation-energy pathway without being consumed, unlike an intermediate, which is produced and then consumed.",
        keyTerms: [
          { term: "Activation energy (Ea)", definition: "The energy barrier that must be overcome for a reaction to proceed." },
          { term: "Catalyst", definition: "A substance that lowers activation energy without being consumed in the reaction." }
        ]
      }
    ],
    keyTakeaways: [
      "Rate laws (rate = k[A]^m[B]^n) describe how rate depends on concentration, with reaction orders determined experimentally, not from the balanced equation.",
      "A mechanism's rate-determining (slowest) step controls the overall rate law, written from that step's own reactants.",
      "The Arrhenius equation shows rate increases with temperature and decreases with activation energy; catalysts lower activation energy without being consumed."
    ],
    knowledgeCheck: [
      { question: "Why can't you determine a reaction's rate law just by looking at its balanced equation?", answer: "Reaction orders (the rate law's exponents) must be determined experimentally, since they reflect the mechanism's rate-determining step, not necessarily the overall balanced equation's coefficients." },
      { question: "How does a catalyst differ from a reaction intermediate?", answer: "A catalyst is present at the start of a mechanism and regenerated unchanged by the end (lowering activation energy without being consumed), while an intermediate is produced partway through the mechanism and consumed before the end." }
    ],
    flashcards: [
      { front: "Rate law", back: "rate = k[A]^m[B]^n; orders found experimentally." },
      { front: "Rate-determining step", back: "The slowest step; controls the overall rate law." },
      { front: "Intermediate", back: "Produced then consumed within a mechanism." },
      { front: "Catalyst", back: "Lowers activation energy; not consumed." },
      { front: "Arrhenius equation", back: "k = Ae^(-Ea/RT)" }
    ],
    practiceQuestions: [
      {
        question: "For the reaction 2A + B → C, experiments show that doubling [A] alone doubles the rate, and doubling [B] alone quadruples the rate. What is the rate law?",
        concept: "Reaction rates and rate laws",
        options: ["rate = k[A]^2[B]", "rate = k[A][B]^2", "rate = k[A][B]", "rate = k[A]^2[B]^2"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—this would mean doubling [A] quadruples the rate, which contradicts the given data.",
          "Correct—doubling [A] doubles rate (order 1 in A); doubling [B] quadruples rate (2² = 4, order 2 in B).",
          "Incorrect—this would mean doubling [B] only doubles the rate, not quadruples it.",
          "Incorrect—this would mean doubling [A] alone quadruples the rate, which contradicts the given data."
        ]
      },
      {
        question: "A proposed two-step mechanism has Step 1 (slow): A + B → C, and Step 2 (fast): C + A → D. What is the rate law implied?",
        concept: "Reaction mechanisms and the rate-determining step",
        options: ["rate = k[C][A], based on step 2", "rate = k[A][B], based on the slow step (step 1)", "rate = k[A]^2[B], based on the overall reaction", "It cannot be determined without more information"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—step 2 is the fast step and doesn't limit the overall rate.",
          "Correct—the rate law is written from the rate-determining (slow) step's reactants: A and B.",
          "Incorrect—the overall reaction's coefficients aren't used to write the rate law; the RDS's reactants are.",
          "Incorrect—the given mechanism is enough information to write the rate law from the slow step."
        ]
      },
      {
        question: "A substance appears as a reactant in the first step of a mechanism and is regenerated, unchanged, as a product in the final step. What role does it play?",
        concept: "Activation energy and catalysts",
        options: ["Reactant", "Intermediate", "Catalyst", "Product"],
        correctIndex: 2,
        optionExplanations: [
          "Incorrect—a true reactant is consumed overall, not regenerated unchanged by the end.",
          "Incorrect—an intermediate is produced partway through and consumed before the end, the reverse of this pattern.",
          "Correct—present at the start and regenerated unchanged at the end describes a catalyst.",
          "Incorrect—a true product is formed, not regenerated back to its original starting form."
        ]
      },
      {
        question: "Increasing the temperature of a reaction increases its rate. According to the Arrhenius equation, what is the best explanation for this?",
        concept: "Activation energy and catalysts",
        options: ["Higher temperature decreases the activation energy", "Higher temperature increases the rate constant k, since more molecules have enough energy to overcome the activation energy barrier", "Higher temperature has no real effect on rate; only catalysts do", "Higher temperature always doubles the rate exactly"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—temperature doesn't change activation energy; that's a property of the reaction pathway itself, changed only by a catalyst.",
          "Correct—the Arrhenius equation shows k increases with temperature, since more molecules have sufficient energy to overcome Ea.",
          "Incorrect—temperature is one of the most direct ways to change reaction rate, per the Arrhenius equation.",
          "Incorrect—the relationship is exponential, not a fixed doubling regardless of the specific temperature change."
        ]
      }
    ],
    simplifiedExplanation: "Kinetics is about speed, not destination—it doesn't ask where a reaction ends up (that's equilibrium's job), just how fast it gets there, and the rate law is the experimentally-measured speedometer for that. When a reaction happens in multiple steps, its overall speed is bottlenecked by whichever step is slowest, the same way a highway's overall travel time is set by its worst traffic jam, not its fastest stretch. Temperature and catalysts both speed things up, but for different reasons: heat gives more molecules enough energy to clear the activation-energy hurdle, while a catalyst just makes the hurdle itself shorter, without getting used up in the process."
  }
];

const organicChemistryLessons: LessonContent[] = [
  {
    id: "organic-structure-functional-groups",
    subjectId: "organic-chemistry",
    sectionId: "chem-phys",
    title: "Organic Structure & Functional Groups",
    estimatedMinutes: 25,
    difficulty: "Beginner",
    prerequisiteLessonId: "chemical-kinetics",
    sections: [
      {
        heading: "Recognizing Functional Groups",
        body: "Oxygen-containing functional groups form a reactivity ladder: alcohols (-OH) and ethers (C-O-C) are the least reactive; aldehydes (terminal C=O with an H) and ketones (internal C=O) are more reactive; carboxylic acids (-COOH) and their derivatives (esters, amides) are the most reactive. Nitrogen-containing groups include amines (basic) and amides (much less basic, due to resonance delocalization of the nitrogen lone pair into the carbonyl).",
        keyTerms: [
          { term: "Functional group", definition: "A specific arrangement of atoms giving a molecule characteristic reactivity." },
          { term: "Carbonyl", definition: "A carbon double-bonded to oxygen (C=O); present in aldehydes, ketones, carboxylic acids, and derivatives." }
        ]
      },
      {
        heading: "IUPAC Nomenclature Basics",
        body: "Naming starts by finding the longest continuous carbon chain containing the highest-priority functional group, using the root matching its carbon count, then numbering the chain to give the lowest locants. The suffix indicates the highest-priority functional group present (-oic acid, -al, -one, -ol, -amine), while lower-priority groups become substituent prefixes.",
        keyTerms: [
          { term: "Parent chain", definition: "The longest continuous carbon chain containing the highest-priority functional group." },
          { term: "Suffix", definition: "The part of an IUPAC name indicating the highest-priority functional group present." }
        ]
      },
      {
        heading: "Structural Representations and Degrees of Unsaturation",
        body: "In a skeletal structure, each line endpoint or vertex represents a carbon atom, with hydrogens implied. Degrees of unsaturation (DoU) = (2C + 2 + N - H) / 2 gives the total number of rings plus pi bonds in a molecule.",
        keyTerms: [
          { term: "Skeletal structure", definition: "A structural drawing where carbons are line vertices with implied hydrogens." },
          { term: "Degrees of unsaturation", definition: "The total count of rings and pi bonds implied by a molecular formula." }
        ]
      }
    ],
    keyTakeaways: [
      "Functional groups determine a molecule's chemical behavior; oxygen-containing groups range from alcohols (least reactive) to carboxylic acid derivatives (most reactive), while amines are basic and amides are only weakly basic.",
      "IUPAC names identify the longest chain containing the highest-priority functional group and use a suffix that identifies that group.",
      "Skeletal structures show carbons as line vertices with implied hydrogens; degrees of unsaturation count the total rings and pi bonds a structure must contain."
    ],
    knowledgeCheck: [
      { question: "What distinguishes an aldehyde from a ketone structurally?", answer: "An aldehyde's carbonyl carbon is bonded to a hydrogen (terminal position); a ketone's carbonyl carbon is bonded to two other carbons (internal position, no H)." },
      { question: "What does a molecule's degrees of unsaturation tell you about its structure?", answer: "It gives the total number of rings plus pi bonds (double bonds count as 1, triple bonds count as 2) that the structure must contain." }
    ],
    flashcards: [
      { front: "Aldehyde", back: "Terminal C=O bonded to an H." },
      { front: "Ketone", back: "Internal C=O bonded to two carbons." },
      { front: "Carboxylic acid", back: "-COOH group." },
      { front: "Amine", back: "Basic nitrogen group; -NH2/-NHR/-NR2." },
      { front: "Degrees of unsaturation", back: "Total rings + pi bonds implied by molecular formula." }
    ],
    practiceQuestions: [
      {
        question: "A molecule contains a carbon double-bonded to oxygen, where that carbon is also bonded to a hydrogen and to the rest of the carbon chain. What functional group is this?",
        concept: "Recognizing functional groups",
        options: ["Ketone", "Aldehyde", "Carboxylic acid", "Ester"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—a ketone's carbonyl carbon is bonded to two carbons, not a hydrogen.",
          "Correct—a carbonyl carbon bonded to a hydrogen (terminal position) defines an aldehyde.",
          "Incorrect—carboxylic acids require an additional oxygen bonded to the carbonyl carbon.",
          "Incorrect—esters also require an additional oxygen bonded to the carbonyl carbon."
        ]
      },
      {
        question: "A molecule is named 'pentan-2-one.' What does this tell you about its structure?",
        concept: "IUPAC nomenclature basics",
        options: ["A 5-carbon chain with an alcohol at carbon 2", "A 5-carbon chain with a ketone at carbon 2", "A 2-carbon chain with 5 substituents", "A 5-carbon chain that is a carboxylic acid"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—'-ol' would indicate an alcohol; '-one' indicates a ketone instead.",
          "Correct—'pentan-' indicates 5 carbons, '-one' indicates a ketone, and '2' places the carbonyl at position 2.",
          "Incorrect—'pentan-' refers to the chain length (5 carbons), not the number of substituents.",
          "Incorrect—'-oic acid' would indicate a carboxylic acid, not '-one.'"
        ]
      },
      {
        question: "A compound has the molecular formula C6H12. How many degrees of unsaturation does it have?",
        concept: "Structural representations and degrees of unsaturation",
        options: ["0", "1", "2", "It cannot be determined without more information"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—0 degrees would require the formula C6H14 (fully saturated hexane).",
          "Correct—DoU = (2×6 + 2 - 12)/2 = 2/2 = 1, indicating one ring or double bond.",
          "Incorrect—2 degrees would require the formula C6H10.",
          "Incorrect—DoU is calculable directly from the molecular formula alone."
        ]
      },
      {
        question: "Which functional group would you expect to find in the compound named 'butanoic acid'?",
        concept: "IUPAC nomenclature basics",
        options: ["An alcohol", "A ketone", "A carboxylic acid", "An amine"],
        correctIndex: 2,
        optionExplanations: [
          "Incorrect—an alcohol would be named with the suffix '-ol,' not '-oic acid.'",
          "Incorrect—a ketone would be named with the suffix '-one,' not '-oic acid.'",
          "Correct—the suffix '-oic acid' specifically indicates a carboxylic acid.",
          "Incorrect—an amine would be named with the suffix '-amine,' not '-oic acid.'"
        ]
      }
    ],
    simplifiedExplanation: "Think of the carbon backbone as a plain string of beads and the functional group as whatever colorful charm is hanging off it—the charm is what actually does the chemistry, while the string mostly just holds it in place. IUPAC names are simply a systematic address: first find the longest street (parent chain) that passes by the most important charm, then note which house number (locant) it's at, and the suffix tells you which charm you're dealing with. Degrees of unsaturation is a neat trick that lets you count how many rings or double/triple bonds a formula must contain before you've even drawn the structure, just from the atom counts alone."
  },
  {
    id: "isomers-stereochemistry",
    subjectId: "organic-chemistry",
    sectionId: "chem-phys",
    title: "Isomers & Stereochemistry",
    estimatedMinutes: 30,
    difficulty: "Intermediate",
    prerequisiteLessonId: "organic-structure-functional-groups",
    sections: [
      {
        heading: "Structural Isomers vs. Stereoisomers",
        body: "Structural isomers have the same molecular formula but their atoms are bonded together in a genuinely different order. Stereoisomers have identical connectivity but differ in how those atoms are arranged in three-dimensional space.",
        keyTerms: [
          { term: "Structural isomer", definition: "Isomers with the same molecular formula but different atom connectivity." },
          { term: "Stereoisomer", definition: "Isomers with identical connectivity but different 3D spatial arrangement." }
        ]
      },
      {
        heading: "Chirality and R/S Configuration",
        body: "A carbon is a chiral center when bonded to four different groups; such a molecule is non-superimposable on its mirror image (an enantiomer). R/S configuration is assigned using CIP priority rules: rank groups by atomic number, orient the lowest priority away, and trace 1→2→3—clockwise is R, counterclockwise is S.",
        keyTerms: [
          { term: "Chiral center", definition: "A carbon bonded to four different groups, creating non-superimposable mirror images." },
          { term: "Enantiomers", definition: "Non-superimposable mirror-image stereoisomers." }
        ]
      },
      {
        heading: "Diastereomers and Meso Compounds",
        body: "Diastereomers are stereoisomers that differ at only some (not all) stereocenters and are not mirror images; cis/trans isomers are a specific type. A meso compound has multiple stereocenters but is achiral overall due to an internal mirror plane.",
        keyTerms: [
          { term: "Diastereomer", definition: "A stereoisomer that is not a mirror image of another stereoisomer." },
          { term: "Meso compound", definition: "A compound with multiple stereocenters that is achiral due to an internal mirror plane." }
        ]
      }
    ],
    keyTakeaways: [
      "Structural isomers differ in atom connectivity; stereoisomers share identical connectivity but differ in 3D spatial arrangement.",
      "A chiral center produces enantiomers—non-superimposable mirror images assigned R or S by CIP priority rules.",
      "Diastereomers are stereoisomers that aren't mirror images; a meso compound has multiple stereocenters but is achiral overall due to an internal mirror plane."
    ],
    knowledgeCheck: [
      { question: "What is the first question to ask when comparing two molecules with the same molecular formula?", answer: "Whether their atoms have the same connectivity—if connectivity differs, they're structural isomers; only if connectivity is identical do you move on to considering stereochemistry." },
      { question: "Why can two enantiomers of a drug have very different biological effects despite being chemically 'identical' in most respects?", answer: "Biological receptors and enzymes are themselves chiral, so they can interact very differently with each mirror-image enantiomer, much like a hand only fits one of two mirror-image gloves." }
    ],
    flashcards: [
      { front: "Structural isomer", back: "Same formula, different connectivity." },
      { front: "Stereoisomer", back: "Same connectivity, different 3D arrangement." },
      { front: "Chiral center", back: "Carbon bonded to four different groups." },
      { front: "Enantiomers", back: "Non-superimposable mirror images." },
      { front: "Meso compound", back: "Multiple stereocenters, but achiral overall." }
    ],
    practiceQuestions: [
      {
        question: "1-propanol and 2-propanol have the same molecular formula, C3H8O, but the -OH group is on a different carbon. What type of isomers are these?",
        concept: "Structural isomers vs. stereoisomers",
        options: ["Enantiomers", "Diastereomers", "Structural (constitutional) isomers", "They are not isomers at all"],
        correctIndex: 2,
        optionExplanations: [
          "Incorrect—enantiomers require identical connectivity; these two molecules have different connectivity.",
          "Incorrect—diastereomers also require identical connectivity, which isn't the case here.",
          "Correct—the -OH is bonded to a different carbon in each, meaning genuinely different connectivity.",
          "Incorrect—they do share the same molecular formula, which makes them isomers by definition."
        ]
      },
      {
        question: "Two enantiomers of the same drug are otherwise chemically identical. Why might they have dramatically different biological effects?",
        concept: "Chirality and R/S configuration",
        options: ["Enantiomers actually have different molecular formulas", "Enzymes and receptors are themselves chiral, interacting differently with each enantiomer", "Enantiomers have different boiling points, affecting absorption", "There is no possible difference in biological effect"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—enantiomers share the same molecular formula; only their 3D spatial arrangement differs.",
          "Correct—chiral biological receptors/enzymes can bind one enantiomer much more effectively than its mirror image.",
          "Incorrect—enantiomers actually share identical physical properties like boiling point.",
          "Incorrect—differences in biological effect between enantiomers are well documented and expected."
        ]
      },
      {
        question: "One stereoisomer of tartaric acid, which has two stereocenters, is optically inactive due to an internal mirror plane. What is this type of compound called?",
        concept: "Diastereomers and meso compounds",
        options: ["An enantiomer", "A diastereomer", "A meso compound", "A structural isomer"],
        correctIndex: 2,
        optionExplanations: [
          "Incorrect—an enantiomer is chiral and optically active; this compound is achiral.",
          "Incorrect—a diastereomer is a distinct stereoisomer, not a description of internal symmetry within one molecule.",
          "Correct—a compound with multiple stereocenters that is nonetheless achiral due to internal symmetry is a meso compound.",
          "Incorrect—this compound shares identical connectivity with other tartaric acid stereoisomers, so it isn't a structural isomer of them."
        ]
      },
      {
        question: "Cis-2-butene and trans-2-butene share the same connectivity but differ in the spatial arrangement of substituents around a double bond. What type of isomers are these?",
        concept: "Diastereomers and meso compounds",
        options: ["Enantiomers", "Diastereomers (specifically, cis/trans isomers)", "Structural isomers", "They are the same compound"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—enantiomers are mirror images of each other; cis and trans isomers are not mirror images.",
          "Correct—cis/trans isomers are a specific type of diastereomer, differing in spatial arrangement without being mirror images.",
          "Incorrect—they share identical connectivity, ruling out structural isomerism.",
          "Incorrect—they have genuinely different spatial arrangements and different physical properties."
        ]
      }
    ],
    simplifiedExplanation: "Isomers are a decision tree: first ask if two molecules are connected the same way at all—if not, they're structural isomers, case closed. If they are connected identically, the only remaining difference can be their 3D shape, which is where stereochemistry takes over. A chiral center is like a molecular left-vs-right hand: its mirror image (an enantiomer) looks identical on paper but can't be superimposed on the original, the same way your left and right hands look alike but never quite line up. Diastereomers are stereoisomers that aren't mirror images at all, and a meso compound is the special, symmetrical case where a molecule's own internal mirror image cancels out its handedness entirely."
  },
  {
    id: "organic-reactions",
    subjectId: "organic-chemistry",
    sectionId: "chem-phys",
    title: "Organic Reactions",
    estimatedMinutes: 35,
    difficulty: "Advanced",
    prerequisiteLessonId: "isomers-stereochemistry",
    sections: [
      {
        heading: "SN1 and SN2 Substitution",
        body: "SN2 reactions happen in one concerted step, with the nucleophile attacking opposite the leaving group, inverting stereochemistry—favored by unhindered substrates, strong nucleophiles, and polar aprotic solvents. SN1 reactions proceed through a carbocation intermediate, giving racemization—favored by stabilized (tertiary) carbocations, weak nucleophiles, and polar protic solvents.",
        keyTerms: [
          { term: "SN2 reaction", definition: "A concerted substitution with backside attack, causing stereochemical inversion." },
          { term: "SN1 reaction", definition: "A substitution proceeding through a carbocation intermediate, causing racemization." }
        ]
      },
      {
        heading: "E1 and E2 Elimination",
        body: "E2 is a concerted, one-step elimination requiring a strong, bulky base and anti-periplanar geometry; E1 proceeds through the same carbocation intermediate as SN1. Zaitsev's rule predicts the more substituted (more stable) alkene as the major elimination product.",
        keyTerms: [
          { term: "Zaitsev's rule", definition: "The major elimination product is usually the more substituted, more stable alkene." }
        ]
      },
      {
        heading: "Addition Reactions to Alkenes and Alkynes",
        body: "In electrophilic addition, the alkene's pi bond attacks an electrophile, forming a carbocation intermediate. Markovnikov's rule predicts H adds to the carbon with more existing hydrogens, since the reaction proceeds through the more stable carbocation intermediate.",
        keyTerms: [
          { term: "Markovnikov's rule", definition: "In addition of HX to an alkene, H adds to the carbon with more hydrogens, forming the more stable carbocation." }
        ]
      }
    ],
    keyTakeaways: [
      "SN2 is concerted with stereochemical inversion, favored by unhindered substrates and strong nucleophiles; SN1 proceeds through a carbocation with racemization, favored by tertiary substrates, weak nucleophiles, and polar protic solvents.",
      "E2 is concerted and requires anti-periplanar geometry; E1 shares SN1's carbocation intermediate; Zaitsev's rule predicts the more substituted alkene as the major product.",
      "Electrophilic addition to alkenes proceeds through a carbocation intermediate; Markovnikov's rule predicts the more stable carbocation forms."
    ],
    knowledgeCheck: [
      { question: "What substrate, nucleophile, and solvent conditions favor an SN1 mechanism over SN2?", answer: "Tertiary (or otherwise stabilized carbocation-forming) substrates, weak nucleophiles, and polar protic solvents all favor SN1 over SN2." },
      { question: "Why does Markovnikov's rule predict that H adds to the carbon with more existing hydrogens?", answer: "Because the reaction proceeds through whichever carbocation intermediate is more stable, and protonating that carbon leaves the more stable (more substituted) carbocation at the other carbon." }
    ],
    flashcards: [
      { front: "SN2", back: "Concerted, backside attack, stereochemical inversion." },
      { front: "SN1", back: "Carbocation intermediate, racemization." },
      { front: "Zaitsev's rule", back: "More substituted alkene is the major elimination product." },
      { front: "Markovnikov's rule", back: "H adds to the carbon with more existing hydrogens." },
      { front: "Carbocation stability", back: "Tertiary > secondary > primary." }
    ],
    practiceQuestions: [
      {
        question: "A tertiary alkyl halide is reacted with a weak nucleophile in a polar protic solvent. Which mechanism is most likely, and what stereochemical outcome is expected?",
        concept: "SN1 and SN2 substitution",
        options: ["SN2, with inversion of configuration", "SN1, with racemization", "SN2, with retention of configuration", "Neither mechanism can occur with a tertiary substrate"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—a tertiary substrate is too hindered for SN2's backside attack.",
          "Correct—tertiary substrate, weak nucleophile, and polar protic solvent all favor SN1, which proceeds through a carbocation and gives racemization.",
          "Incorrect—SN2 doesn't occur readily with tertiary substrates, and it wouldn't give retention anyway (it gives inversion).",
          "Incorrect—SN1 readily occurs with tertiary substrates; it's actually the favored pathway here."
        ]
      },
      {
        question: "According to Zaitsev's rule, when an elimination reaction can form two different alkenes, which is typically the major product?",
        concept: "E1 and E2 elimination",
        options: ["The less substituted alkene, because it is less hindered", "The more substituted alkene, because additional alkyl substitution stabilizes the double bond", "Whichever alkene forms fastest, regardless of stability", "Both alkenes form in exactly equal amounts"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—Zaitsev's rule favors the more substituted alkene, not the less substituted one, as the major product.",
          "Correct—more substituted alkenes are more thermodynamically stable, and Zaitsev's rule favors that more stable product.",
          "Incorrect—Zaitsev's rule is specifically about thermodynamic stability of the product, not reaction speed alone.",
          "Incorrect—the more substituted (Zaitsev) product is typically the major product, not an equal mixture."
        ]
      },
      {
        question: "HBr is added across the double bond of 2-methylpropene, (CH3)2C=CH2. According to Markovnikov's rule, on which carbon does bromine end up?",
        concept: "Addition reactions to alkenes and alkynes",
        options: ["The terminal CH2 carbon", "The more substituted carbon, since that forms the more stable tertiary carbocation intermediate", "It adds equally to both carbons", "Bromine does not add to alkenes under these conditions"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—hydrogen (not bromine) adds to the terminal CH2 carbon, which has more existing hydrogens.",
          "Correct—protonation at the terminal carbon generates the more stable tertiary carbocation, and bromide then attacks that more substituted carbon.",
          "Incorrect—Markovnikov's rule predicts a specific regiochemical outcome, not an equal mixture.",
          "Incorrect—electrophilic addition of HBr to alkenes is a standard, well-established reaction."
        ]
      },
      {
        question: "A primary alkyl halide is reacted with a strong, small nucleophile in a polar aprotic solvent. Which mechanism is most favored?",
        concept: "SN1 and SN2 substitution",
        options: ["SN1, since primary carbocations are especially stable", "SN2, since the unhindered primary substrate and strong nucleophile both favor a concerted backside attack", "Neither SN1 nor SN2 can occur with primary substrates", "E1, since elimination always dominates with primary substrates"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—primary carbocations are actually the least stable, making SN1 unfavorable here.",
          "Correct—an unhindered primary substrate combined with a strong, small nucleophile in polar aprotic solvent strongly favors SN2.",
          "Incorrect—SN2 readily occurs with primary substrates; it's the favored mechanism under these conditions.",
          "Incorrect—E1 requires a carbocation intermediate, which primary substrates don't readily form; SN2 dominates instead."
        ]
      }
    ],
    simplifiedExplanation: "Substitution and elimination are constantly competing for the same starting materials, and the outcome comes down to a few dials: how crowded the substrate is, how strong and bulky the incoming nucleophile/base is, and what solvent it's all happening in. SN2 is a clean, one-step swap that needs room to attack from behind (so it hates crowded, tertiary substrates), while SN1 takes the substrate apart first into a carbocation and lets the nucleophile attack from either side afterward (so it loves substrates that make a stable carbocation). Addition reactions to alkenes follow that same carbocation-stability logic in reverse—wherever the more stable carbocation would form, that's where the new bond goes, which is all Markovnikov's rule is really saying."
  },
  {
    id: "carbonyls-carboxylic-acids-derivatives",
    subjectId: "organic-chemistry",
    sectionId: "chem-phys",
    title: "Carbonyls, Carboxylic Acids & Derivatives",
    estimatedMinutes: 35,
    difficulty: "Advanced",
    prerequisiteLessonId: "organic-reactions",
    sections: [
      {
        heading: "Aldehydes, Ketones, and Nucleophilic Addition",
        body: "The C=O bond's polarity makes the carbonyl carbon electrophilic; a nucleophile attacks it, forming a tetrahedral intermediate—since there's no leaving group, the reaction is an addition, not a substitution. Aldehydes react faster than ketones due to less steric hindrance and electron donation from alkyl groups.",
        keyTerms: [
          { term: "Nucleophilic addition", definition: "A nucleophile attacks an electrophilic carbonyl carbon with no leaving group present." },
          { term: "Hemiacetal", definition: "The product of one alcohol adding to a carbonyl." }
        ]
      },
      {
        heading: "Carboxylic Acid Acidity",
        body: "Carboxylic acids are far more acidic than alcohols because their conjugate base (carboxylate) is resonance-stabilized, delocalizing the negative charge across two equivalent oxygens. Electron-withdrawing groups nearby further stabilize the negative charge, increasing acidity.",
        keyTerms: [
          { term: "Carboxylate", definition: "The resonance-stabilized conjugate base of a carboxylic acid." }
        ]
      },
      {
        heading: "Carboxylic Acid Derivatives and Reactivity",
        body: "Nucleophilic acyl substitution has a leaving group depart after the tetrahedral intermediate forms, regenerating a new carbonyl. Reactivity ranks by leaving group ability: acid halides > anhydrides > esters > amides—more reactive derivatives convert readily into less reactive ones, not efficiently the reverse.",
        keyTerms: [
          { term: "Nucleophilic acyl substitution", definition: "A carbonyl reaction where a leaving group departs after the tetrahedral intermediate forms." }
        ]
      }
    ],
    keyTakeaways: [
      "Nucleophiles attack the electrophilic carbonyl carbon of aldehydes and ketones in an addition reaction; aldehydes react faster than ketones.",
      "Carboxylic acids are far more acidic than alcohols because their conjugate base (carboxylate) is resonance-stabilized across two oxygens.",
      "Carboxylic acid derivatives interconvert via nucleophilic acyl substitution, with reactivity order acid halide > anhydride > ester > amide, reflecting leaving group ability."
    ],
    knowledgeCheck: [
      { question: "Why do aldehydes react faster than ketones in nucleophilic addition?", answer: "Ketones' two alkyl groups provide more steric hindrance and electron donation than an aldehyde's one alkyl group, both of which slow nucleophilic addition." },
      { question: "Why is acetic acid a much stronger acid than ethanol?", answer: "Acetic acid's conjugate base (acetate) is resonance-stabilized across two equivalent oxygens, while ethanol's conjugate base (ethoxide) has no comparable stabilization." }
    ],
    flashcards: [
      { front: "Nucleophilic addition", back: "Nucleophile attacks carbonyl carbon; no leaving group." },
      { front: "Carboxylate", back: "Resonance-stabilized conjugate base of a carboxylic acid." },
      { front: "Nucleophilic acyl substitution", back: "Leaving group departs after tetrahedral intermediate forms." },
      { front: "Reactivity order", back: "Acid halide > anhydride > ester > amide." },
      { front: "Amide", back: "Least reactive carboxylic acid derivative; very stable." }
    ],
    practiceQuestions: [
      {
        question: "Why do aldehydes generally react faster than ketones in nucleophilic addition reactions?",
        concept: "Aldehydes, ketones, and nucleophilic addition",
        options: ["Aldehydes have a more electronegative carbonyl oxygen than ketones", "Ketones have two alkyl groups providing more steric hindrance and electron donation, making their carbonyl less electrophilic and more shielded", "Aldehydes lack a carbonyl group entirely", "Ketones cannot undergo nucleophilic addition at all"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—the carbonyl oxygen's electronegativity doesn't differ between aldehydes and ketones.",
          "Correct—ketones' extra alkyl group both donates electron density and physically blocks nucleophilic approach.",
          "Incorrect—aldehydes do have a carbonyl group; that's the defining feature of the functional group.",
          "Incorrect—ketones do undergo nucleophilic addition, just more slowly than aldehydes."
        ]
      },
      {
        question: "Why is acetic acid (pKa ≈ 4.8) a much stronger acid than ethanol (pKa ≈ 16), despite both losing a proton from an O-H bond?",
        concept: "Carboxylic acid acidity",
        options: ["Acetic acid's conjugate base is resonance-stabilized across two oxygens, while ethanol's conjugate base has no such stabilization", "Ethanol has a higher molecular weight, making it harder to lose a proton", "Acetic acid has more carbon atoms, which inherently increases acidity", "There is no real difference in acid strength between the two"],
        correctIndex: 0,
        optionExplanations: [
          "Correct—resonance delocalization across two equivalent oxygens in the carboxylate stabilizes the negative charge far more than an alkoxide can.",
          "Incorrect—molecular weight isn't the deciding factor in acid strength here.",
          "Incorrect—carbon count alone doesn't determine acidity; the resonance stabilization of the conjugate base does.",
          "Incorrect—their pKa values differ by over 11 units, a very substantial real difference in acid strength."
        ]
      },
      {
        question: "Why can an acid chloride be readily converted into an amide, but converting an amide directly into an acid chloride is not practical?",
        concept: "Carboxylic acid derivatives and reactivity",
        options: ["Acid chlorides and amides are actually the same functional group", "Chloride is a much better leaving group than an amine, so the forward reaction is favorable while the reverse is not", "Amides are more electrophilic than acid chlorides", "Nucleophilic acyl substitution only works in one direction, regardless of leaving group"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—acid chlorides and amides are distinct functional groups with very different reactivity.",
          "Correct—chloride's superior leaving group ability makes the acid chloride → amide direction favorable, not the reverse.",
          "Incorrect—amides are actually less electrophilic (less reactive) than acid chlorides, not more.",
          "Incorrect—nucleophilic acyl substitution can go either direction; it's leaving group ability that determines which direction is favorable."
        ]
      },
      {
        question: "Which of the following carboxylic acid derivatives is generally the least reactive toward nucleophilic acyl substitution?",
        concept: "Carboxylic acid derivatives and reactivity",
        options: ["Acid chloride", "Anhydride", "Ester", "Amide"],
        correctIndex: 3,
        optionExplanations: [
          "Incorrect—acid chlorides are actually the most reactive derivative, due to chloride's excellent leaving group ability.",
          "Incorrect—anhydrides are more reactive than esters and amides, though less than acid chlorides.",
          "Incorrect—esters are more reactive than amides, though less than acid chlorides and anhydrides.",
          "Correct—amides are the least reactive derivative, since an amine is the poorest leaving group among these options."
        ]
      }
    ],
    simplifiedExplanation: "The carbonyl carbon is the single most electrophilic hotspot in most of organic chemistry, and everything in this lesson is really just different consequences of that one fact. When there's no leaving group attached (aldehydes, ketones), a nucleophile just adds on and stays—simple addition. When there is a leaving group attached (carboxylic acid derivatives), that same nucleophilic attack sets up a swap: the new group comes in, and the old one leaves, in nucleophilic acyl substitution. Carboxylic acid acidity comes from a completely different but related idea—once that acidic proton leaves, the negative charge left behind gets to spread out over two oxygens instead of being stuck on one, and spreading out a charge is always stabilizing, which is exactly why carboxylic acids give up a proton so much more easily than plain alcohols do."
  },
  {
    id: "amines-amides-biological-molecules",
    subjectId: "organic-chemistry",
    sectionId: "chem-phys",
    title: "Amines, Amides & Biological Molecules",
    estimatedMinutes: 30,
    difficulty: "Intermediate",
    prerequisiteLessonId: "carbonyls-carboxylic-acids-derivatives",
    sections: [
      {
        heading: "Amine Structure and Basicity",
        body: "An amine's nitrogen has a lone pair not involved in resonance, making it readily available to accept a proton or act as a nucleophile. Amines are classified as primary, secondary, or tertiary by how many carbon groups are attached to nitrogen.",
        keyTerms: [
          { term: "Amine", definition: "A nitrogen-containing functional group with a basic, freely available lone pair." }
        ]
      },
      {
        heading: "Amide Resonance and the Peptide Bond",
        body: "In an amide, nitrogen's lone pair delocalizes by resonance into the carbonyl, making amides far less basic than amines. This same resonance gives the C-N bond partial double-bond character, restricting rotation and forcing planarity—the direct chemical reason the peptide bond is rigid and planar.",
        keyTerms: [
          { term: "Amide resonance", definition: "Delocalization of nitrogen's lone pair into the carbonyl, reducing basicity and restricting C-N rotation." },
          { term: "Peptide bond", definition: "The amide bond linking amino acids together in a protein." }
        ]
      },
      {
        heading: "Connecting to Biological Molecules",
        body: "Amino acids contain a basic amine group, typically protonated at physiological pH. The peptide bond connecting amino acids is chemically an amide bond, and its resonance-driven planarity constrains the protein backbone's possible shapes.",
        keyTerms: [
          { term: "N-terminus", definition: "The free amine end of a peptide or protein chain." }
        ]
      }
    ],
    keyTakeaways: [
      "Amines are basic because nitrogen's freely available lone pair readily accepts a proton; classified as primary, secondary, or tertiary.",
      "Amide resonance delocalizes nitrogen's lone pair into the carbonyl, making amides far less basic than amines and giving the C-N bond restricted rotation and planarity.",
      "Amino acids' amine groups follow standard basicity rules, and the peptide bond linking amino acids is chemically an amide bond, inheriting its planarity."
    ],
    knowledgeCheck: [
      { question: "Why are amines basic while amides are only very weakly basic, despite both containing nitrogen?", answer: "An amine's nitrogen lone pair is freely available, but an amide's nitrogen lone pair is delocalized by resonance into the carbonyl, making it much less available to accept a proton." },
      { question: "What organic functional group is the peptide bond linking amino acids together?", answer: "An amide bond, formed by condensation between one amino acid's carboxylic acid and the next amino acid's amine." }
    ],
    flashcards: [
      { front: "Amine", back: "Basic nitrogen group with a freely available lone pair." },
      { front: "Amide resonance", back: "Nitrogen lone pair delocalizes into the carbonyl." },
      { front: "Peptide bond", back: "The amide bond linking amino acids." },
      { front: "Primary amine", back: "One carbon group attached to nitrogen." },
      { front: "Amide planarity", back: "Restricted C-N rotation from partial double-bond character." }
    ],
    practiceQuestions: [
      {
        question: "Why are amines generally basic, while alcohols are only very weakly basic by comparison?",
        concept: "Amine structure and basicity",
        options: ["Nitrogen is more electronegative than oxygen, making its lone pair more available", "Nitrogen is less electronegative than oxygen, so it holds its lone pair less tightly and donates it more readily", "Amines don't actually have a lone pair on nitrogen", "Alcohols have no lone pairs on oxygen at all"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—nitrogen is actually less electronegative than oxygen, not more.",
          "Correct—nitrogen's lower electronegativity means it holds its lone pair less tightly, making it more available to accept a proton.",
          "Incorrect—amines do have a nitrogen lone pair; that's exactly what makes them basic.",
          "Incorrect—oxygen does have lone pairs, just less available ones due to its higher electronegativity."
        ]
      },
      {
        question: "Why is rotation around the C-N bond in an amide much more restricted than in a typical amine C-N bond?",
        concept: "Amide resonance and the peptide bond",
        options: ["The amide C-N bond has significant double-bond character from resonance delocalization into the carbonyl", "Amide nitrogen is sp3 hybridized, unlike amine nitrogen", "There is no actual restriction on amide bond rotation", "The oxygen atom physically blocks rotation"],
        correctIndex: 0,
        optionExplanations: [
          "Correct—resonance donation of the lone pair into the carbonyl gives the C-N bond partial double-bond character, restricting rotation.",
          "Incorrect—amide nitrogen actually behaves more like sp2 due to this resonance, not simple sp3.",
          "Incorrect—amide bond rotation genuinely is restricted, which is a well-documented structural fact.",
          "Incorrect—it's an electronic effect (resonance), not physical blocking by the oxygen atom."
        ]
      },
      {
        question: "The bond linking two amino acids together in a protein chain is best described as which functional group?",
        concept: "Connecting to biological molecules",
        options: ["An ester bond", "An amide bond, formed between a carboxylic acid and an amine", "An amine bond only, with no carbonyl involved", "An ether bond"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—an ester forms from an alcohol and a carboxylic acid, not an amine and a carboxylic acid.",
          "Correct—the peptide bond forms from condensation of a carboxylic acid and an amine, forming an amide bond.",
          "Incorrect—a carbonyl is very much involved; the amide bond includes both the carbonyl and the nitrogen.",
          "Incorrect—an ether is a C-O-C linkage with no carbonyl, unrelated to the peptide bond."
        ]
      },
      {
        question: "At physiological pH, why are many amine groups on amino acid side chains typically found in their protonated form?",
        concept: "Connecting to biological molecules",
        options: ["Amines are acidic and readily lose a proton at physiological pH", "Amines are basic, and their freely available lone pair readily accepts a proton at physiological pH", "Amines don't interact with protons under any conditions", "Protonation of amines only occurs in extremely acidic environments, well below physiological pH"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—amines are basic (proton acceptors), not acidic (proton donors).",
          "Correct—amines' basicity means their lone pair readily accepts a proton, and physiological pH (around 7.4) is well below many amines' pKa, keeping them protonated.",
          "Incorrect—amines readily interact with protons; that's the basis of their basicity.",
          "Incorrect—many amines remain substantially protonated at physiological pH, not only in extremely acidic conditions."
        ]
      }
    ],
    simplifiedExplanation: "Amines and amides look like siblings—both have nitrogen bonded to carbon—but they behave completely differently because of one thing: whether that nitrogen's lone pair is free or tied up. In an amine, the lone pair is unattached and eager to grab a proton, which is exactly what makes amines basic. In an amide, that same lone pair gets pulled into the neighboring carbonyl by resonance, like being recruited into a different job—it's no longer available to grab a proton, and the amide bond becomes rigid and flat as a side effect of that recruitment. This isn't just organic chemistry trivia: it's the exact reason the peptide bond holding every protein together is rigid and planar, which in turn shapes how proteins are able to fold."
  },
  {
    id: "organic-chemistry-spectroscopy",
    subjectId: "organic-chemistry",
    sectionId: "chem-phys",
    title: "Organic Chemistry & Spectroscopy",
    estimatedMinutes: 35,
    difficulty: "Advanced",
    prerequisiteLessonId: "amines-amides-biological-molecules",
    sections: [
      {
        heading: "IR Spectroscopy",
        body: "IR spectroscopy measures which frequencies of infrared light a molecule's bonds absorb as they stretch, making the resulting spectrum a fingerprint of which functional groups are present. The highest-yield regions are a broad O-H stretch, a sharper N-H stretch, and a strong, sharp C=O stretch.",
        keyTerms: [
          { term: "IR spectroscopy", definition: "Identifies functional groups from characteristic bond-stretching absorption frequencies." }
        ]
      },
      {
        heading: "1H NMR Spectroscopy",
        body: "Chemical shift indicates a hydrogen's electronic environment; splitting follows the n+1 rule (n neighboring hydrogens split a signal into n+1 peaks); integration gives the relative ratio of hydrogens contributing to each signal.",
        keyTerms: [
          { term: "Chemical shift", definition: "A hydrogen's position (in ppm) on an NMR spectrum, reflecting its electronic environment." },
          { term: "n+1 rule", definition: "n neighboring, non-equivalent hydrogens split a signal into n+1 peaks." }
        ]
      },
      {
        heading: "Mass Spectrometry and Combining Techniques",
        body: "The molecular ion peak (M+) gives molecular weight; fragment peaks offer structural clues. No single technique fully solves a structure alone—IR, NMR, and mass spectrometry are used together to determine an unknown structure.",
        keyTerms: [
          { term: "Molecular ion peak", definition: "The mass spectrum peak corresponding to the intact, singly-ionized molecule; gives molecular weight." }
        ]
      }
    ],
    keyTakeaways: [
      "IR spectroscopy identifies functional groups by characteristic absorption frequencies—broad O-H, sharper N-H, and strong sharp C=O are the highest-yield regions.",
      "1H NMR chemical shift indicates electronic environment, splitting (n+1 rule) reveals neighboring hydrogens, and integration gives relative hydrogen ratios.",
      "Mass spectrometry's molecular ion peak reveals molecular weight; combining mass spec with IR and NMR is how an unknown structure is fully determined."
    ],
    knowledgeCheck: [
      { question: "What does the n+1 rule in 1H NMR tell you?", answer: "It predicts that a hydrogen's signal is split into n+1 peaks by n neighboring, non-equivalent hydrogens on adjacent carbons." },
      { question: "Why is no single spectroscopic technique usually sufficient to fully determine an unknown structure?", answer: "Each technique reveals different information—IR shows functional groups, NMR shows hydrogen environments and connectivity, and mass spec shows molecular weight and fragmentation—so combining them is needed for a complete structure." }
    ],
    flashcards: [
      { front: "IR spectroscopy", back: "Identifies functional groups by absorption frequency." },
      { front: "Chemical shift", back: "A hydrogen's electronic environment, in ppm." },
      { front: "n+1 rule", back: "n neighboring hydrogens split a signal into n+1 peaks." },
      { front: "Integration", back: "Relative ratio of hydrogens in each NMR signal." },
      { front: "Molecular ion peak", back: "Gives molecular weight in mass spectrometry." }
    ],
    practiceQuestions: [
      {
        question: "An IR spectrum shows a strong, sharp absorption around 1715 cm⁻¹ but no broad absorption in the O-H region. Which functional group is most consistent?",
        concept: "IR spectroscopy",
        options: ["Alcohol", "Carboxylic acid", "Ketone", "Amine"],
        correctIndex: 2,
        optionExplanations: [
          "Incorrect—an alcohol would show a broad O-H absorption, which is absent here.",
          "Incorrect—a carboxylic acid would also show a broad O-H absorption, which is absent here.",
          "Correct—the sharp C=O stretch with no O-H absorption fits a ketone (has a carbonyl but no O-H).",
          "Incorrect—an amine wouldn't produce a strong C=O stretch at all."
        ]
      },
      {
        question: "In a 1H NMR spectrum, a signal appears as a quartet. Based on the n+1 rule, how many neighboring hydrogens does this signal's hydrogen have?",
        concept: "1H NMR spectroscopy",
        options: ["1", "2", "3", "4"],
        correctIndex: 2,
        optionExplanations: [
          "Incorrect—1 neighboring hydrogen would give a doublet (n+1 = 2), not a quartet.",
          "Incorrect—2 neighboring hydrogens would give a triplet (n+1 = 3), not a quartet.",
          "Correct—a quartet has 4 peaks, so n+1 = 4, meaning n = 3 neighboring hydrogens.",
          "Incorrect—4 neighboring hydrogens would give a quintet (n+1 = 5), not a quartet."
        ]
      },
      {
        question: "A mass spectrum shows a molecular ion peak at m/z = 72. What does this value most directly tell you?",
        concept: "Mass spectrometry and combining techniques",
        options: ["The number of hydrogens it contains", "Its molecular weight (for a singly charged ion)", "The number of distinct functional groups present", "Its melting point"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—hydrogen count isn't directly given by the molecular ion peak alone.",
          "Correct—the molecular ion's mass-to-charge ratio directly equals the molecule's molecular weight, for a singly charged ion.",
          "Incorrect—functional group count comes from IR and NMR, not directly from the molecular ion peak.",
          "Incorrect—melting point isn't determined by mass spectrometry."
        ]
      },
      {
        question: "A compound's 1H NMR spectrum shows two signals with an integration ratio of 3:2. If the molecule has 10 total hydrogens, how many hydrogens does each signal represent?",
        concept: "1H NMR spectroscopy",
        options: ["3 and 2", "6 and 4", "5 and 5", "It cannot be determined from a 3:2 ratio"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—3 and 2 would only sum to 5 total hydrogens, not the given 10.",
          "Correct—scaling the 3:2 ratio to sum to 10 total hydrogens gives 6 and 4 (which simplifies back to 3:2).",
          "Incorrect—5 and 5 would be a 1:1 ratio, not 3:2.",
          "Incorrect—integration ratios combined with a known total hydrogen count are sufficient to solve for exact hydrogen counts."
        ]
      }
    ],
    simplifiedExplanation: "Spectroscopy is detective work: no single clue solves the case, but each technique narrows the suspect list in its own way. IR is a quick pat-down for which functional groups are present, based on which frequencies of light get absorbed. NMR is far more detailed—it maps out every distinct hydrogen environment in the molecule, how many neighbors each one has (splitting), and how many hydrogens of each type exist (integration), essentially sketching the molecule's hydrogen skeleton. Mass spectrometry rounds it out with the molecule's actual weight and how it breaks apart under stress—put all three clues together, and an unknown structure that seemed impossible from any single piece of evidence usually becomes solvable."
  }
];

const physicsLessons: LessonContent[] = [
  {
    id: "units-math-graphs",
    subjectId: "physics",
    sectionId: "chem-phys",
    title: "Units, Math & Graphs",
    estimatedMinutes: 20,
    difficulty: "Beginner",
    prerequisiteLessonId: "organic-chemistry-spectroscopy",
    sections: [
      {
        heading: "Units and Dimensional Analysis",
        body: "Converting between units means multiplying by conversion factors arranged so unwanted units cancel out, leaving only the desired unit. Every valid physics equation must have matching units on both sides; a units mismatch reliably signals an error somewhere in the calculation.",
        keyTerms: [
          { term: "Dimensional analysis", definition: "Converting units by canceling them algebraically, using conversion factors." }
        ]
      },
      {
        heading: "Scalars vs. Vectors",
        body: "Scalars (mass, speed, distance) have magnitude only; vectors (displacement, velocity, force) have both magnitude and direction. Adding vectors at an angle requires breaking them into perpendicular components, adding component-by-component, then recombining with the Pythagorean theorem.",
        keyTerms: [
          { term: "Scalar", definition: "A quantity with magnitude only, like speed or mass." },
          { term: "Vector", definition: "A quantity with both magnitude and direction, like velocity or force." }
        ]
      },
      {
        heading: "Interpreting Graphs",
        body: "A graph's slope represents the rate of change of the y-axis quantity with respect to the x-axis quantity (e.g., slope of position-vs-time is velocity). The area under a graph represents the accumulated product of the two axes (e.g., area under velocity-vs-time is displacement).",
        keyTerms: [
          { term: "Slope (of a graph)", definition: "The rate of change between a graph's two axes." },
          { term: "Area under a graph", definition: "The accumulated product of a graph's two axes." }
        ]
      }
    ],
    keyTakeaways: [
      "Dimensional analysis converts units by canceling them algebraically, and checking units on both sides of an equation is a quick way to catch errors.",
      "Scalars (speed, distance, mass) have magnitude only; vectors (velocity, displacement, force) have magnitude and direction, and combine via component addition.",
      "A graph's slope represents a rate of change; the area under a graph represents an accumulated product of its two axes."
    ],
    knowledgeCheck: [
      { question: "How can checking units help catch an error in a physics calculation?", answer: "Every valid equation must have matching units on both sides—if your final answer's units don't match what's expected, it signals an error somewhere in the calculation." },
      { question: "Why is displacement generally less than or equal to distance traveled?", answer: "Distance is the total scalar path length traveled, while displacement is the vector straight-line distance from start to end—any path that isn't perfectly straight makes displacement less than distance." }
    ],
    flashcards: [
      { front: "Dimensional analysis", back: "Converting units by canceling them algebraically." },
      { front: "Scalar", back: "Magnitude only (speed, mass, distance)." },
      { front: "Vector", back: "Magnitude and direction (velocity, force, displacement)." },
      { front: "Graph slope", back: "Rate of change between the two axes." },
      { front: "Area under a graph", back: "Accumulated product of the two axes." }
    ],
    practiceQuestions: [
      {
        question: "A problem asks you to calculate a velocity, but your final units come out to m/s². What does this indicate?",
        concept: "Units and dimensional analysis",
        options: ["The answer is correct; m/s² is acceptable for velocity", "An error was made, since velocity should have units of m/s, not m/s²", "Units don't need to match for velocity calculations", "The equation must have been for acceleration, so no error occurred"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—m/s² is the unit for acceleration, not velocity.",
          "Correct—getting m/s² instead of m/s signals a units mismatch and therefore an error somewhere in the setup.",
          "Incorrect—matching units is essential for verifying a calculation is set up correctly.",
          "Incorrect—the problem asked for velocity; getting acceleration's units means an error occurred, not that the goal changed."
        ]
      },
      {
        question: "A car travels 3 km east, then 4 km north. What is the magnitude of its total displacement, and how does it compare to the distance traveled?",
        concept: "Scalars vs. vectors",
        options: ["Displacement is 7 km, the same as distance", "Displacement is 5 km, less than the 7 km distance traveled", "Displacement and distance are always identical", "Displacement cannot be calculated without knowing speed"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—7 km is the total distance (path length), not the displacement.",
          "Correct—displacement is the straight-line distance: √(3² + 4²) = 5 km, less than the 7 km path length.",
          "Incorrect—they are only equal for straight-line motion; here the path isn't straight.",
          "Incorrect—displacement is a purely geometric calculation here and doesn't require speed."
        ]
      },
      {
        question: "On a velocity-vs-time graph, the area between the curve and the time axis over an interval represents which quantity?",
        concept: "Interpreting graphs",
        options: ["Acceleration during that interval", "The displacement that occurred during that interval", "The object's mass", "The instantaneous velocity at the end of the interval"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—acceleration is read from the graph's slope, not its area.",
          "Correct—area under a velocity-time graph equals velocity × time, which is displacement.",
          "Incorrect—mass isn't represented on a velocity-time graph at all.",
          "Incorrect—instantaneous velocity at a point is read directly from the curve's height, not the area."
        ]
      },
      {
        question: "Convert a speed of 20 m/s to km/h using dimensional analysis.",
        concept: "Units and dimensional analysis",
        options: ["20 km/h", "36 km/h", "72 km/h", "7200 km/h"],
        correctIndex: 2,
        optionExplanations: [
          "Incorrect—20 km/h would be the case only if no conversion were applied.",
          "Incorrect—36 km/h doesn't correctly apply both the distance and time conversion factors.",
          "Correct—20 m/s × (3600 s/h) × (1 km/1000 m) = 72 km/h.",
          "Incorrect—7200 km/h would result from forgetting to divide by 1000 m/km."
        ]
      }
    ],
    simplifiedExplanation: "These three tools aren't really separate physics topics—they're the quality-control checks you run on every other physics calculation. Dimensional analysis is a built-in error detector: track your units through a calculation, and if they don't come out matching what the question is actually asking for, something upstream went wrong. Scalars and vectors are about not losing information—direction matters, and pretending it doesn't (treating a vector like a scalar) is a classic way to get a wrong answer that looks reasonable. And graphs are just physics diagrams in disguise: once you know slope means rate and area means accumulation, you can read real physical meaning out of almost any graph the exam throws at you, no separate formula needed."
  },
  {
    id: "kinematics-newtonian-mechanics",
    subjectId: "physics",
    sectionId: "chem-phys",
    title: "Kinematics & Newtonian Mechanics",
    estimatedMinutes: 30,
    difficulty: "Intermediate",
    prerequisiteLessonId: "units-math-graphs",
    sections: [
      {
        heading: "Kinematics Equations and Projectile Motion",
        body: "For constant acceleration, four kinematics equations connect displacement, initial/final velocity, acceleration, and time. Projectile motion splits into independent horizontal (constant velocity) and vertical (constant downward acceleration g) components, connected only by shared time of flight.",
        keyTerms: [
          { term: "Kinematics equations", definition: "Equations relating displacement, velocity, acceleration, and time under constant acceleration." },
          { term: "Projectile motion", definition: "Motion with independent horizontal (constant velocity) and vertical (constant acceleration) components." }
        ]
      },
      {
        heading: "Newton's Three Laws",
        body: "Newton's first law (inertia): an object's velocity stays constant unless acted on by a net force. Second law: F = ma. Third law: every force has an equal, opposite reaction force, acting on a different object.",
        keyTerms: [
          { term: "Inertia", definition: "An object's resistance to a change in motion, proportional to mass." },
          { term: "Newton's third law", definition: "Force pairs are equal, opposite, and act on two different objects." }
        ]
      },
      {
        heading: "Free-Body Diagrams and Common Forces",
        body: "A free-body diagram isolates one object and shows every force acting on it, summed separately along perpendicular axes. Friction opposes relative motion, proportional to normal force—static friction (up to a max) prevents motion from starting; kinetic friction acts on an object already sliding.",
        keyTerms: [
          { term: "Free-body diagram", definition: "A diagram isolating one object and showing every force acting on it." },
          { term: "Friction", definition: "A force opposing relative motion between surfaces, proportional to normal force." }
        ]
      }
    ],
    keyTakeaways: [
      "The kinematics equations relate displacement, velocity, acceleration, and time under constant acceleration; projectile motion treats horizontal and vertical motion as independent.",
      "Newton's first law describes inertia, the second law is F = ma, and the third law's equal/opposite force pairs act on two different objects.",
      "A free-body diagram isolates every force on an object for Newton's second law; friction (static or kinetic) is proportional to normal force."
    ],
    knowledgeCheck: [
      { question: "Why are horizontal and vertical motion treated independently in projectile motion?", answer: "Gravity acts only vertically, so it doesn't affect horizontal velocity (which stays constant), while horizontal motion has no effect on vertical acceleration—the two are linked only through their shared total time of flight." },
      { question: "Why don't a Newton's third law force pair ever cancel out for a single object's motion analysis?", answer: "Because the two forces in a third-law pair act on two different objects, they can never be summed together to analyze the net force on either object individually." }
    ],
    flashcards: [
      { front: "Kinematics equations", back: "Relate displacement, velocity, acceleration, time." },
      { front: "Newton's first law", back: "Inertia: no net force, no change in velocity." },
      { front: "Newton's second law", back: "F = ma" },
      { front: "Newton's third law", back: "Equal, opposite forces on two different objects." },
      { front: "Static friction", back: "Prevents motion from starting; up to a maximum value." }
    ],
    practiceQuestions: [
      {
        question: "A ball is thrown horizontally off a cliff. Ignoring air resistance, what happens to its horizontal velocity as it falls?",
        concept: "Kinematics equations and projectile motion",
        options: ["It increases due to gravity", "It decreases due to gravity", "It stays constant, since gravity only acts vertically", "It becomes zero immediately"],
        correctIndex: 2,
        optionExplanations: [
          "Incorrect—gravity acts vertically, not horizontally, so it doesn't increase horizontal velocity.",
          "Incorrect—gravity doesn't decrease horizontal velocity either, for the same reason.",
          "Correct—with no horizontal force (ignoring air resistance), horizontal velocity remains constant throughout the fall.",
          "Incorrect—there's no force causing horizontal velocity to suddenly vanish."
        ]
      },
      {
        question: "A book rests on a table, with the table's normal force and the book's reaction force forming a Newton's third law pair. Why doesn't this pair explain why the book stays still?",
        concept: "Newton's three laws",
        options: ["They do cancel out, and that's why the book doesn't accelerate", "They act on two different objects, so they can't be summed to find the net force on either object", "The book's weight is unrelated to this pair", "Newton's third law doesn't apply to objects at rest"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—third law pairs act on different objects and can never be summed to explain one object's own equilibrium.",
          "Correct—the normal force on the book and the book's reaction force on the table act on two different objects.",
          "Incorrect—the book's weight is indeed a separate force, and it's what actually balances the normal force ON the book.",
          "Incorrect—Newton's third law applies universally, including to objects at rest."
        ]
      },
      {
        question: "A box sits stationary on a rough floor. A small horizontal force is applied but the box doesn't move. What force balances the applied force?",
        concept: "Free-body diagrams and common forces",
        options: ["Gravity", "Normal force", "Static friction", "Tension"],
        correctIndex: 2,
        optionExplanations: [
          "Incorrect—gravity acts vertically and balances the normal force, not the horizontal applied force.",
          "Incorrect—normal force acts vertically, balancing gravity, not the horizontal applied force.",
          "Correct—static friction adjusts to balance the applied horizontal force, up to its maximum value, keeping the box stationary.",
          "Incorrect—tension requires a string or cable, which isn't present in this scenario."
        ]
      },
      {
        question: "A ball is thrown straight up and reaches its maximum height before falling back down. What is true about its acceleration at the exact top of its path?",
        concept: "Kinematics equations and projectile motion",
        options: ["Acceleration is zero at the top", "Acceleration is g, directed downward, the same as throughout the flight", "Acceleration reverses direction to point upward momentarily", "Acceleration cannot be determined at the exact top"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—velocity (not acceleration) is momentarily zero at the top; acceleration due to gravity remains constant throughout.",
          "Correct—gravity acts continuously and uniformly downward throughout the entire flight, including at the top, where only velocity is momentarily zero.",
          "Incorrect—gravity's direction doesn't reverse; it consistently points downward throughout the motion.",
          "Incorrect—acceleration is g downward at every point of free-fall motion, including the top."
        ]
      }
    ],
    simplifiedExplanation: "Kinematics is the choreography (describing how something moves), and Newton's laws are the director explaining why it moves that way. Projectile motion looks intimidating but is really just two separate, simpler kinematics problems bolted together by a shared clock—one tracking constant horizontal speed, the other tracking a steady downward acceleration. Newton's second law (F = ma) is the engine behind almost every mechanics calculation, and a free-body diagram is simply the disciplined habit of drawing every force acting on an object before doing any math with it—skip that step, and it's easy to forget a force (or invent one that isn't really there)."
  },
  {
    id: "work-energy-momentum",
    subjectId: "physics",
    sectionId: "chem-phys",
    title: "Work, Energy & Momentum",
    estimatedMinutes: 30,
    difficulty: "Intermediate",
    prerequisiteLessonId: "kinematics-newtonian-mechanics",
    sections: [
      {
        heading: "Work and the Work-Energy Theorem",
        body: "Work is done only by the component of force acting along displacement (W = Fd cos θ). The work-energy theorem states that net work done on an object equals its change in kinetic energy.",
        keyTerms: [
          { term: "Work", definition: "W = Fd cos θ; done by the component of force along the direction of displacement." },
          { term: "Work-energy theorem", definition: "Net work done on an object equals its change in kinetic energy." }
        ]
      },
      {
        heading: "Conservation of Energy and Power",
        body: "With only conservative forces, total mechanical energy (KE + PE) stays constant; non-conservative forces like friction remove mechanical energy, converting it to heat. Power is the rate of energy transfer, P = W/t (or P = Fv).",
        keyTerms: [
          { term: "Mechanical energy", definition: "The sum of kinetic and potential energy; conserved without non-conservative forces." },
          { term: "Power", definition: "The rate of energy transfer or work done, P = W/t." }
        ]
      },
      {
        heading: "Momentum and Collisions",
        body: "Momentum (p = mv) is conserved in any closed system, regardless of collision type. Kinetic energy is additionally conserved only in elastic collisions; in inelastic collisions (including perfectly inelastic, where objects stick together), kinetic energy is lost to heat, sound, or deformation.",
        keyTerms: [
          { term: "Momentum", definition: "p = mv; conserved in any closed-system collision." },
          { term: "Elastic collision", definition: "A collision in which both momentum and kinetic energy are conserved." }
        ]
      }
    ],
    keyTakeaways: [
      "Work equals force times displacement in the direction of motion (W = Fd cos θ), and the work-energy theorem connects net work to change in kinetic energy.",
      "Total mechanical energy (kinetic + potential) is conserved without non-conservative forces like friction; power measures the rate of energy transfer.",
      "Momentum is conserved in any closed-system collision; kinetic energy is additionally conserved only in elastic collisions."
    ],
    knowledgeCheck: [
      { question: "Why does a force perpendicular to an object's motion do zero work on it?", answer: "Work is W = Fd cos θ, and cos(90°) = 0, so a force with no component along the direction of displacement does no work, regardless of its magnitude." },
      { question: "What is conserved in every closed-system collision, and what is additionally conserved only in elastic collisions?", answer: "Momentum is conserved in every closed-system collision; kinetic energy is additionally conserved only in elastic collisions, not in inelastic ones." }
    ],
    flashcards: [
      { front: "Work", back: "W = Fd cos θ" },
      { front: "Work-energy theorem", back: "Net work = change in kinetic energy." },
      { front: "Power", back: "P = W/t; rate of energy transfer." },
      { front: "Momentum", back: "p = mv; always conserved in closed systems." },
      { front: "Elastic collision", back: "Both momentum and kinetic energy conserved." }
    ],
    practiceQuestions: [
      {
        question: "A satellite orbits Earth in a perfect circle at constant speed, with gravity providing centripetal force. How much work does gravity do over one orbit?",
        concept: "Work and the work-energy theorem",
        options: ["A large positive amount", "A large negative amount", "Zero, since gravity is always perpendicular to velocity", "It depends on the satellite's mass"],
        correctIndex: 2,
        optionExplanations: [
          "Incorrect—gravity does no net work here, since it's always perpendicular to the velocity.",
          "Incorrect—for the same reason, gravity doesn't do negative work either in this circular case.",
          "Correct—centripetal force is always perpendicular to velocity in circular motion, so W = Fd cos(90°) = 0.",
          "Incorrect—the perpendicularity argument holds regardless of mass; work is zero either way."
        ]
      },
      {
        question: "A ball is dropped from height h and falls freely (no air resistance). Using conservation of energy, what is its speed just before impact?",
        concept: "Conservation of energy and power",
        options: ["v = gh", "v = √(2gh)", "v = 2gh", "v = √(gh)"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—this doesn't have the correct units or form for speed derived from energy conservation.",
          "Correct—setting mgh = ½mv² and solving gives v = √(2gh).",
          "Incorrect—this would result from an algebra error solving for v.",
          "Incorrect—this is missing the factor of 2 from the correct derivation."
        ]
      },
      {
        question: "Two identical train cars collide and lock together, moving as one unit afterward. Which quantity(ies) are conserved?",
        concept: "Momentum and collisions",
        options: ["Both momentum and kinetic energy", "Only momentum; kinetic energy is not, since this is a perfectly inelastic collision", "Only kinetic energy; momentum is not", "Neither momentum nor kinetic energy"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—kinetic energy is not conserved in a perfectly inelastic collision like this one.",
          "Correct—momentum is always conserved in a closed system, but the cars sticking together means kinetic energy is lost to heat, sound, and deformation.",
          "Incorrect—momentum, not kinetic energy, is the quantity always conserved in any closed-system collision.",
          "Incorrect—momentum is conserved in this collision, even though kinetic energy is not."
        ]
      },
      {
        question: "A machine does 500 J of work in 10 seconds. What is its power output?",
        concept: "Conservation of energy and power",
        options: ["5 W", "50 W", "500 W", "5000 W"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—5 W doesn't match P = W/t = 500/10.",
          "Correct—P = W/t = 500 J / 10 s = 50 W.",
          "Incorrect—500 W would be the case if the work were done in 1 second, not 10.",
          "Incorrect—5000 W doesn't match the given values."
        ]
      }
    ],
    simplifiedExplanation: "Work and energy are one bookkeeping system, tracking how force applied over distance converts into motion (kinetic energy) or stored potential—and as long as nothing's stealing energy away as heat (friction), that total stays perfectly constant, just trading forms back and forth. Momentum is a completely separate bookkeeping system that's even more universally reliable: it's conserved in every collision, no exceptions, whether the objects bounce apart cleanly (elastic) or crumple together (inelastic)—kinetic energy, on the other hand, only survives intact in the cleanest, bounciest collisions, and gets 'spent' as heat, sound, or deformation the rest of the time."
  },
  {
    id: "fluids-pressure",
    subjectId: "physics",
    sectionId: "chem-phys",
    title: "Fluids & Pressure",
    estimatedMinutes: 30,
    difficulty: "Intermediate",
    prerequisiteLessonId: "work-energy-momentum",
    sections: [
      {
        heading: "Hydrostatic Pressure and Pascal's Principle",
        body: "Hydrostatic pressure increases with depth (P = P0 + ρgh). Pascal's principle states that a pressure change applied anywhere in an enclosed fluid transmits equally throughout, letting hydraulic systems multiply force using a difference in piston area.",
        keyTerms: [
          { term: "Hydrostatic pressure", definition: "Pressure within a static fluid, increasing with depth: P = P0 + ρgh." },
          { term: "Pascal's principle", definition: "Pressure applied to an enclosed fluid transmits equally throughout." }
        ]
      },
      {
        heading: "Buoyancy and Archimedes' Principle",
        body: "Buoyant force equals the weight of fluid displaced (Fb = ρfluid × Vdisplaced × g). An object floats if its average density is less than the fluid's, sinks if greater, and is neutrally buoyant if equal.",
        keyTerms: [
          { term: "Buoyant force", definition: "The upward force from a fluid, equal to the weight of fluid displaced." },
          { term: "Archimedes' principle", definition: "Buoyant force equals the weight of the fluid displaced by a submerged object." }
        ]
      },
      {
        heading: "Fluid Dynamics: Continuity and Bernoulli's Equation",
        body: "The continuity equation (A1v1 = A2v2) states fluid speeds up where a pipe narrows. Bernoulli's equation shows that at constant height, faster-moving fluid has lower pressure.",
        keyTerms: [
          { term: "Continuity equation", definition: "A1v1 = A2v2; fluid speed increases where cross-sectional area decreases." },
          { term: "Bernoulli's equation", definition: "Shows that, at constant height, fluid pressure decreases as speed increases." }
        ]
      }
    ],
    keyTakeaways: [
      "Hydrostatic pressure increases with depth; Pascal's principle lets hydraulic systems multiply force using a difference in piston area.",
      "Archimedes' principle states buoyant force equals the weight of fluid displaced; density comparison predicts floating vs. sinking.",
      "The continuity equation shows fluid speeds up in narrower pipe sections; Bernoulli's equation shows faster fluid has lower pressure at constant height."
    ],
    knowledgeCheck: [
      { question: "How does a hydraulic lift use a small input force to generate a much larger output force?", answer: "By Pascal's principle, pressure is transmitted equally throughout the enclosed fluid; since pressure = force/area, a larger output piston area produces a proportionally larger output force from the same pressure." },
      { question: "What determines whether an object floats or sinks in a fluid?", answer: "Whether the object's average density is less than (floats), greater than (sinks), or equal to (neutrally buoyant) the fluid's density." }
    ],
    flashcards: [
      { front: "Hydrostatic pressure", back: "P = P0 + ρgh; increases with depth." },
      { front: "Pascal's principle", back: "Pressure transmits equally through an enclosed fluid." },
      { front: "Archimedes' principle", back: "Buoyant force = weight of fluid displaced." },
      { front: "Continuity equation", back: "A1v1 = A2v2" },
      { front: "Bernoulli's equation", back: "Faster fluid has lower pressure (constant height)." }
    ],
    practiceQuestions: [
      {
        question: "A hydraulic lift has a small piston (2 cm²) and a large piston (20 cm²). A force of 10 N is applied to the small piston. What force is generated at the large piston?",
        concept: "Hydrostatic pressure and Pascal's principle",
        options: ["10 N", "20 N", "100 N", "200 N"],
        correctIndex: 2,
        optionExplanations: [
          "Incorrect—10 N would mean no force multiplication occurred, which contradicts Pascal's principle here.",
          "Incorrect—20 N doesn't match F1/A1 = F2/A2 for these values.",
          "Correct—F1/A1 = F2/A2, so 10/2 = F2/20, giving F2 = 100 N.",
          "Incorrect—200 N would require a 20:1 area ratio scaled incorrectly."
        ]
      },
      {
        question: "A solid block has a density of 0.8 g/mL and is placed in water (density 1.0 g/mL). What happens?",
        concept: "Buoyancy and Archimedes' principle",
        options: ["It sinks to the bottom", "It floats, with part of it above the water's surface", "It remains fully submerged but neutrally buoyant", "It cannot be determined without knowing its volume"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—an object with lower density than the fluid floats; it doesn't sink.",
          "Correct—since the block's density is less than water's, it floats, displacing only enough water to equal its own weight.",
          "Incorrect—neutral buoyancy would require equal densities, which isn't the case here.",
          "Incorrect—density comparison alone (without needing volume) determines floating vs. sinking."
        ]
      },
      {
        question: "Water flows through a horizontal pipe that narrows partway along its length. In the narrower section, what happens to speed and pressure?",
        concept: "Fluid dynamics: continuity and Bernoulli's equation",
        options: ["Speed increases, pressure increases", "Speed increases, pressure decreases", "Speed decreases, pressure increases", "Speed decreases, pressure decreases"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—pressure doesn't increase alongside speed; they move in opposite directions here.",
          "Correct—continuity requires faster flow in the narrower section, and Bernoulli's equation shows that faster flow corresponds to lower pressure at constant height.",
          "Incorrect—speed increases (not decreases) in a narrower section, per the continuity equation.",
          "Incorrect—speed increases, not decreases, in the narrower section."
        ]
      },
      {
        question: "An object has exactly the same density as the fluid it's placed in. What happens to the object?",
        concept: "Buoyancy and Archimedes' principle",
        options: ["It sinks to the bottom", "It floats mostly above the surface", "It remains suspended at any depth (neutrally buoyant)", "It cannot exist stably in the fluid"],
        correctIndex: 2,
        optionExplanations: [
          "Incorrect—sinking occurs when the object's density exceeds the fluid's, not when they're equal.",
          "Incorrect—floating mostly above the surface would require a density well below the fluid's.",
          "Correct—equal densities mean the buoyant force exactly balances weight at any depth, so the object is neutrally buoyant.",
          "Incorrect—neutral buoyancy is a stable (if delicate) equilibrium, not an impossibility."
        ]
      }
    ],
    simplifiedExplanation: "Fluids at rest and fluids in motion are governed by related but distinct rules. At rest, pressure just builds up with depth (like the weight of everything above pressing down), and Pascal's principle says squeeze that pressure in anywhere and it transmits everywhere equally, which is the whole trick behind a hydraulic lift multiplying force. Buoyancy is really just 'how much fluid did you shove out of the way, and how much does that shoved-aside fluid weigh'—if your own weight is less than that, you float. Once the fluid starts moving, a new trade-off kicks in: squeeze it through a narrower opening and it has to speed up (continuity), and wherever it speeds up, its pressure drops (Bernoulli)—the same principle that gives an airplane wing lift."
  },
  {
    id: "physics-thermodynamics",
    subjectId: "physics",
    sectionId: "chem-phys",
    title: "Thermodynamics",
    estimatedMinutes: 35,
    difficulty: "Advanced",
    prerequisiteLessonId: "fluids-pressure",
    sections: [
      {
        heading: "Heat Transfer: Conduction, Convection, Radiation",
        body: "Conduction transfers heat through direct particle contact; convection transfers heat through bulk fluid movement—both require a medium. Radiation transfers heat through electromagnetic waves and requires no medium, working even through a vacuum.",
        keyTerms: [
          { term: "Conduction", definition: "Heat transfer through direct particle contact." },
          { term: "Radiation", definition: "Heat transfer via electromagnetic waves; requires no medium." }
        ]
      },
      {
        heading: "The Laws of Thermodynamics",
        body: "The first law (ΔU = Q - W) is energy conservation for a system. The second law states entropy of an isolated system never decreases, which is why no real heat engine can be 100% efficient—some heat must always be released to a cooler reservoir.",
        keyTerms: [
          { term: "First law of thermodynamics", definition: "ΔU = Q - W; energy conservation for a thermodynamic system." },
          { term: "Second law of thermodynamics", definition: "Total entropy of an isolated system never decreases." }
        ]
      },
      {
        heading: "PV Diagrams and Thermodynamic Processes",
        body: "Isobaric (constant P) traces a horizontal line; isochoric (constant V) traces a vertical line and does zero work; isothermal (constant T) and adiabatic (Q = 0) trace curves following PV relationships. The area under a process's path equals work done.",
        keyTerms: [
          { term: "Isochoric process", definition: "A constant-volume process; does zero work (W = PΔV = 0)." },
          { term: "PV diagram", definition: "A plot of pressure vs. volume for a gas, tracing a process's path." }
        ]
      }
    ],
    keyTakeaways: [
      "Conduction and convection require a medium; radiation transfers heat via electromagnetic waves and works through a vacuum.",
      "The first law (ΔU = Q - W) is energy conservation; the second law states entropy never decreases, which is why no real heat engine is 100% efficient.",
      "PV diagrams show characteristic paths for isobaric, isochoric (zero work), isothermal, and adiabatic processes, with area under the path equal to work done."
    ],
    knowledgeCheck: [
      { question: "Which heat transfer mechanism can occur through a vacuum, and why?", answer: "Radiation, because it transfers heat via electromagnetic waves, which don't require a medium to propagate, unlike conduction and convection." },
      { question: "Why can no real heat engine be 100% efficient?", answer: "The second law of thermodynamics requires that some heat always be released to a cooler reservoir in any real heat engine cycle, setting a maximum efficiency below 100%." }
    ],
    flashcards: [
      { front: "Conduction", back: "Heat transfer through direct contact." },
      { front: "Radiation", back: "Heat transfer via EM waves; works in a vacuum." },
      { front: "First law of thermodynamics", back: "ΔU = Q - W" },
      { front: "Second law of thermodynamics", back: "Entropy of an isolated system never decreases." },
      { front: "Isochoric process", back: "Constant volume; zero work done." }
    ],
    practiceQuestions: [
      {
        question: "Which mechanism of heat transfer can occur through the vacuum of space, with no matter present?",
        concept: "Heat transfer: conduction, convection, radiation",
        options: ["Conduction", "Convection", "Radiation", "None of these can transfer heat through a vacuum"],
        correctIndex: 2,
        optionExplanations: [
          "Incorrect—conduction requires direct particle contact, impossible in a vacuum.",
          "Incorrect—convection requires fluid movement, impossible in a vacuum.",
          "Correct—radiation transfers heat via electromagnetic waves, which need no medium to propagate.",
          "Incorrect—radiation does transfer heat through a vacuum; that's how sunlight reaches Earth."
        ]
      },
      {
        question: "An engineer claims a heat engine converts 100% of absorbed heat into useful work, with no heat released to a cooler reservoir. What does the second law say?",
        concept: "The laws of thermodynamics",
        options: ["It is possible with a well-designed engine", "It is impossible, since some heat must always be released to a cooler reservoir", "The first law, not the second, addresses this claim", "It is possible only at very high temperatures"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—no engineering design can overcome the second law's requirement.",
          "Correct—the second law requires some heat exhaust to a cooler reservoir, making 100% efficiency thermodynamically impossible.",
          "Incorrect—it's specifically the second law that addresses efficiency limits like this.",
          "Incorrect—higher temperature differences increase theoretical maximum efficiency but never reach 100%."
        ]
      },
      {
        question: "A gas undergoes a process during which its volume does not change, though pressure and temperature both increase. How much work is done by the gas?",
        concept: "PV diagrams and thermodynamic processes",
        options: ["A large positive amount", "A large negative amount", "Zero, since work depends on a volume change and none occurred", "It cannot be determined without knowing pressure change"],
        correctIndex: 2,
        optionExplanations: [
          "Incorrect—no work is done in an isochoric (constant-volume) process, regardless of pressure change.",
          "Incorrect—for the same reason, work isn't negative either; it's exactly zero.",
          "Correct—W = PΔV requires a volume change; with ΔV = 0, no work is done regardless of pressure or temperature changes.",
          "Incorrect—since ΔV = 0, work is zero regardless of the magnitude of pressure change."
        ]
      },
      {
        question: "On a PV diagram, which type of process traces a horizontal line?",
        concept: "PV diagrams and thermodynamic processes",
        options: ["Isochoric (constant volume)", "Isobaric (constant pressure)", "Isothermal (constant temperature)", "Adiabatic (no heat exchange)"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—an isochoric process traces a vertical line (constant volume), not horizontal.",
          "Correct—an isobaric process has constant pressure, which traces a horizontal line on a PV diagram.",
          "Incorrect—an isothermal process traces a curve following PV = constant, not a horizontal line.",
          "Incorrect—an adiabatic process traces a curve, similar to but steeper than an isothermal curve."
        ]
      }
    ],
    simplifiedExplanation: "Heat transfer has three delivery methods: conduction hands it off directly (contact required), convection carries it along in a moving fluid (also requires matter), and radiation just broadcasts it as electromagnetic waves, no delivery vehicle needed at all. The first law of thermodynamics is strict accounting—energy in, energy out, no exceptions—while the second law is the reason that accounting is never perfectly reversible: every real process leaks a little useful energy as unusable heat, which is exactly why a perfect, 100%-efficient engine is a fantasy. PV diagrams are just a visual shorthand for all of this: horizontal means pressure held steady, vertical means volume held steady (and notably, no work done), and the space traced out underneath any path is literally how much work got done along the way."
  },
  {
    id: "electrostatics",
    subjectId: "physics",
    sectionId: "chem-phys",
    title: "Electrostatics",
    estimatedMinutes: 35,
    difficulty: "Advanced",
    prerequisiteLessonId: "physics-thermodynamics",
    sections: [
      {
        heading: "Coulomb's Law and Electric Fields",
        body: "Coulomb's law, F = kq1q2/r², gives the force between point charges, falling off with the square of distance. Electric field (E = F/q) describes force per unit charge at a point; fields from multiple charges add by superposition.",
        keyTerms: [
          { term: "Coulomb's law", definition: "F = kq1q2/r²; the electrostatic force between two point charges." },
          { term: "Electric field", definition: "E = F/q; force per unit charge at a point in space." }
        ]
      },
      {
        heading: "Electric Potential and Potential Energy",
        body: "Electric potential (V = kQ/r) is potential energy per unit charge at a location; electric potential energy (U = qV) depends on the specific charge placed there. Electric field points from high to low potential, and positive charges accelerate toward lower potential.",
        keyTerms: [
          { term: "Electric potential (V)", definition: "Potential energy per unit charge at a point in space; a scalar." },
          { term: "Electric potential energy (U)", definition: "U = qV; the actual energy a specific charge has at a given potential." }
        ]
      },
      {
        heading: "Conductors and Capacitors",
        body: "Excess charge on a conductor at equilibrium resides on its outer surface, with zero electric field inside. A capacitor stores charge and energy proportional to voltage, with capacitance C = Q/V.",
        keyTerms: [
          { term: "Capacitance", definition: "C = Q/V; how much charge a capacitor stores per volt of potential difference." }
        ]
      }
    ],
    keyTakeaways: [
      "Coulomb's law gives the force between point charges, falling with the square of distance; electric field describes force per unit charge, adding by superposition.",
      "Electric potential (V) is energy per unit charge at a location; potential energy (U = qV) depends on the specific charge; field points from high to low potential.",
      "Excess charge on a conductor resides on its outer surface with zero internal field; capacitance (C = Q/V) measures charge storage per volt."
    ],
    knowledgeCheck: [
      { question: "How does distance affect the electrostatic force between two point charges?", answer: "Force is inversely proportional to the square of distance (Coulomb's law), so doubling distance reduces force to one-quarter, and tripling distance reduces it to one-ninth." },
      { question: "Why is the electric field inside a conductor at electrostatic equilibrium zero?", answer: "Any internal field would drive charges to keep moving until they redistribute to cancel it out—zero internal field is precisely the equilibrium condition." }
    ],
    flashcards: [
      { front: "Coulomb's law", back: "F = kq1q2/r²" },
      { front: "Electric field", back: "E = F/q; force per unit charge." },
      { front: "Electric potential (V)", back: "Potential energy per unit charge." },
      { front: "Electric potential energy (U)", back: "U = qV" },
      { front: "Capacitance", back: "C = Q/V" }
    ],
    practiceQuestions: [
      {
        question: "Two point charges are separated by distance r, exerting force F on each other. If the distance is tripled, what is the new force?",
        concept: "Coulomb's law and electric fields",
        options: ["F/3", "F/9", "3F", "9F"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—force falls off with the square of distance, not linearly.",
          "Correct—tripling distance divides force by 3² = 9.",
          "Incorrect—force decreases (not increases) with greater distance.",
          "Incorrect—9F would result from decreasing (not increasing) the distance by a factor of 3."
        ]
      },
      {
        question: "A positive charge is released from rest in a region where potential decreases in the direction of motion. What happens to its kinetic energy?",
        concept: "Electric potential and potential energy",
        options: ["It decreases, since potential energy increases", "It increases, since potential energy decreases as the charge moves toward lower potential", "It stays constant", "It cannot be determined without knowing mass"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—potential energy decreases (not increases) as a positive charge moves toward lower potential.",
          "Correct—a positive charge naturally accelerates toward lower potential, converting potential energy into kinetic energy.",
          "Incorrect—energy converts from potential to kinetic form, so kinetic energy does change.",
          "Incorrect—this follows directly from energy conservation without needing to know mass explicitly."
        ]
      },
      {
        question: "A solid conductor carries a net positive charge at electrostatic equilibrium. Where does this charge reside, and what is the field inside the conductor?",
        concept: "Conductors and capacitors",
        options: ["Distributed evenly throughout the volume; nonzero field inside", "Entirely on the outer surface; zero field inside the conductor", "At the exact center; maximum field inside", "Cannot be determined for a conductor"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—at equilibrium, charge resides on the surface, not distributed through the volume.",
          "Correct—excess charge moves to the outer surface, and the field inside the conducting material is zero at equilibrium.",
          "Incorrect—charge doesn't concentrate at the center; it resides on the outer surface.",
          "Incorrect—this behavior is a well-established, predictable property of conductors at equilibrium."
        ]
      },
      {
        question: "A parallel plate capacitor's plate area is doubled while the distance between plates and the voltage stay the same. What happens to the charge it stores?",
        concept: "Conductors and capacitors",
        options: ["It stays the same", "It doubles, since capacitance increases with plate area and Q = CV", "It is cut in half", "It becomes zero"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—capacitance depends on plate area, so charge stored does change here.",
          "Correct—capacitance increases with plate area; with voltage constant, Q = CV means charge doubles along with capacitance.",
          "Incorrect—increasing (not decreasing) plate area increases capacitance and therefore stored charge.",
          "Incorrect—increasing plate area increases, not eliminates, stored charge."
        ]
      }
    ],
    simplifiedExplanation: "Electric field and electric potential describe the exact same charge setup from two different angles: field tells you the push or pull a charge would feel at a point, while potential tells you the energy it would have there—and just like a ball rolling downhill under gravity, a positive charge naturally 'rolls' from high to low potential, picking up kinetic energy as it goes. Coulomb's law is simply that same push/pull, quantified, and it fades fast with distance (inverse-square), so nearby charges dominate. Conductors and capacitors round things out with a clean, useful trick: give a conductor excess charge, and it automatically shoves that charge all the way out to its surface, canceling any field inside—which is exactly the property that lets a capacitor store charge and energy in a controlled, predictable way."
  },
  {
    id: "circuits-electricity",
    subjectId: "physics",
    sectionId: "chem-phys",
    title: "Circuits & Electricity",
    estimatedMinutes: 35,
    difficulty: "Advanced",
    prerequisiteLessonId: "electrostatics",
    sections: [
      {
        heading: "Current, Resistance, and Ohm's Law",
        body: "Current (I) is the rate of charge flow; resistance (R) opposes current flow. Ohm's law, V = IR, relates voltage, current, and resistance; conventional current flows from high to low potential, opposite actual electron flow.",
        keyTerms: [
          { term: "Ohm's law", definition: "V = IR; relates voltage, current, and resistance." },
          { term: "Conventional current", definition: "Defined as flowing from high to low potential, opposite actual electron movement." }
        ]
      },
      {
        heading: "Series and Parallel Circuits",
        body: "Series resistors add directly (Req = R1 + R2 + ...) and share current; voltage divides across them. Parallel resistors combine reciprocally (1/Req = 1/R1 + 1/R2 + ...) and share voltage; equivalent resistance is always less than the smallest individual resistor.",
        keyTerms: [
          { term: "Series circuit", definition: "Components connected end-to-end; same current through each, resistances add." },
          { term: "Parallel circuit", definition: "Components connected across the same two points; same voltage, resistances combine reciprocally." }
        ]
      },
      {
        heading: "Power in Circuits and Capacitors",
        body: "Power dissipated is P = IV = I²R = V²/R. Capacitors combine oppositely to resistors: parallel capacitances add directly, series capacitances combine reciprocally.",
        keyTerms: [
          { term: "Electrical power", definition: "P = IV = I²R = V²/R; the rate of energy dissipation in a circuit." }
        ]
      }
    ],
    keyTakeaways: [
      "Ohm's law (V = IR) relates voltage, current, and resistance; conventional current flows from high to low potential.",
      "Series resistors add directly and share current; parallel resistors combine reciprocally and share voltage, with equivalent resistance always less than the smallest resistor.",
      "Power dissipated by a resistor is P = IV = I²R = V²/R; capacitors combine oppositely to resistors."
    ],
    knowledgeCheck: [
      { question: "Why does equivalent resistance in a parallel circuit end up less than the smallest individual resistor?", answer: "Parallel branches provide additional paths for current to flow, which always decreases the overall resistance to current flow below any single branch's resistance." },
      { question: "How do capacitors combine differently from resistors in series and parallel?", answer: "Capacitors combine oppositely to resistors: capacitors in parallel add directly, while capacitors in series combine reciprocally—the reverse of how resistors combine." }
    ],
    flashcards: [
      { front: "Ohm's law", back: "V = IR" },
      { front: "Series resistors", back: "Req = R1 + R2 + ...; same current." },
      { front: "Parallel resistors", back: "1/Req = 1/R1 + 1/R2 + ...; same voltage." },
      { front: "Power", back: "P = IV = I²R = V²/R" },
      { front: "Parallel capacitors", back: "Ceq = C1 + C2 + ... (add directly)." }
    ],
    practiceQuestions: [
      {
        question: "A resistor with resistance 5 Ω has a voltage of 10 V across it. What is the current through it?",
        concept: "Current, resistance, and Ohm's law",
        options: ["0.5 A", "2 A", "15 A", "50 A"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—0.5 A doesn't match I = V/R = 10/5.",
          "Correct—I = V/R = 10 V / 5 Ω = 2 A.",
          "Incorrect—15 A would result from adding V and R rather than dividing.",
          "Incorrect—50 A would result from multiplying V and R rather than dividing."
        ]
      },
      {
        question: "Two identical 10 Ω resistors are connected in parallel. What is their equivalent resistance?",
        concept: "Series and parallel circuits",
        options: ["20 Ω", "10 Ω", "5 Ω", "0.2 Ω"],
        correctIndex: 2,
        optionExplanations: [
          "Incorrect—20 Ω would be the equivalent resistance if they were in series, not parallel.",
          "Incorrect—10 Ω would be the case for just one resistor alone.",
          "Correct—1/Req = 1/10 + 1/10 = 2/10, so Req = 5 Ω, less than either individual resistor.",
          "Incorrect—0.2 Ω incorrectly reports 1/Req itself rather than Req."
        ]
      },
      {
        question: "A resistor carries 2 A of current with 6 V across it. How much power does it dissipate?",
        concept: "Power in circuits and capacitors",
        options: ["3 W", "8 W", "12 W", "24 W"],
        correctIndex: 2,
        optionExplanations: [
          "Incorrect—3 W would result from dividing V by I rather than multiplying.",
          "Incorrect—8 W doesn't match P = IV for these values.",
          "Correct—P = IV = (2 A)(6 V) = 12 W.",
          "Incorrect—24 W would result from an incorrect extra factor in the calculation."
        ]
      },
      {
        question: "Two capacitors are connected in series. Compared to either capacitor alone, what happens to the equivalent capacitance?",
        concept: "Power in circuits and capacitors",
        options: ["It increases beyond either individual capacitance", "It decreases below either individual capacitance, since series capacitances combine reciprocally", "It stays the same as either individual capacitor", "Capacitors cannot be connected in series"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—series capacitors decrease (not increase) equivalent capacitance, the opposite of series resistors.",
          "Correct—capacitors in series combine reciprocally (like resistors in parallel), always giving an equivalent capacitance less than the smallest individual one.",
          "Incorrect—equivalent capacitance changes (decreases) when capacitors are added in series.",
          "Incorrect—series capacitor connections are a standard, common circuit configuration."
        ]
      }
    ],
    simplifiedExplanation: "Ohm's law is the one equation tying together everything in this lesson—voltage, current, and resistance are always locked together by V = IR, and most circuit problems are really just about figuring out how a circuit's specific arrangement changes what 'resistance' even means for that arrangement. Series components make current squeeze through everything one after another (adding up resistance, like a longer hallway to walk through), while parallel components give current multiple doors to choose from at once (lowering overall resistance, since more paths means easier flow overall). Capacitors are the one place this lesson flips the script—they combine exactly backwards from resistors, which is worth remembering as a deliberate exception, not a typo."
  },
  {
    id: "magnetism-electromagnetic-phenomena",
    subjectId: "physics",
    sectionId: "chem-phys",
    title: "Magnetism & Electromagnetic Phenomena",
    estimatedMinutes: 35,
    difficulty: "Advanced",
    prerequisiteLessonId: "circuits-electricity",
    sections: [
      {
        heading: "Magnetic Force on Moving Charges and Currents",
        body: "A magnetic field exerts force on a moving charge (F = qvB sin θ), found using the right-hand rule; a stationary charge feels no magnetic force. The force is always perpendicular to velocity, so it never does work, only changes direction.",
        keyTerms: [
          { term: "Magnetic force", definition: "F = qvB sin θ; acts only on moving charges, always perpendicular to velocity." },
          { term: "Right-hand rule", definition: "A method for finding the direction of magnetic force or field using the right hand." }
        ]
      },
      {
        heading: "Sources of Magnetic Fields",
        body: "A current-carrying wire generates a circular magnetic field around itself, direction found by curling right-hand fingers around the current direction. A solenoid concentrates these fields into a strong, roughly uniform field resembling a bar magnet.",
        keyTerms: [
          { term: "Solenoid", definition: "A coiled wire that concentrates magnetic field into a strong, roughly uniform field inside." }
        ]
      },
      {
        heading: "Electromagnetic Induction",
        body: "Faraday's law states a changing magnetic flux through a loop induces an EMF. Lenz's law states the induced current always opposes the change in flux that created it, consistent with conservation of energy.",
        keyTerms: [
          { term: "Faraday's law", definition: "A changing magnetic flux through a loop induces an EMF." },
          { term: "Lenz's law", definition: "Induced current opposes the change in flux that created it." }
        ]
      }
    ],
    keyTakeaways: [
      "Magnetic force on a moving charge is found via the right-hand rule, acts only on moving charges, and is always perpendicular to velocity (does no work).",
      "A current-carrying wire generates a circular magnetic field; a solenoid concentrates these into a strong field resembling a bar magnet.",
      "Faraday's law states a changing magnetic flux induces an EMF; Lenz's law states the induced current opposes that change."
    ],
    knowledgeCheck: [
      { question: "Why does the magnetic force never do work on a moving charged particle?", answer: "The magnetic force is always perpendicular to the particle's velocity, and a force perpendicular to displacement does zero work (W = Fd cos 90° = 0)." },
      { question: "What does Lenz's law say about the direction of an induced current?", answer: "The induced current flows in whatever direction creates a magnetic field that opposes the change in flux that caused it, consistent with conservation of energy." }
    ],
    flashcards: [
      { front: "Magnetic force", back: "F = qvB sin θ; perpendicular to velocity." },
      { front: "Right-hand rule", back: "Finds direction of magnetic force or field." },
      { front: "Solenoid", back: "Coiled wire; strong, uniform field inside." },
      { front: "Faraday's law", back: "Changing flux induces an EMF." },
      { front: "Lenz's law", back: "Induced current opposes the change in flux." }
    ],
    practiceQuestions: [
      {
        question: "A charged particle moves through a uniform magnetic field, curving into a circular path. What happens to its speed?",
        concept: "Magnetic force on moving charges and currents",
        options: ["It increases steadily", "It decreases steadily", "It remains constant, since magnetic force is perpendicular to velocity and does no work", "It oscillates"],
        correctIndex: 2,
        optionExplanations: [
          "Incorrect—speed doesn't increase, since magnetic force does no work on the particle.",
          "Incorrect—speed doesn't decrease either, for the same reason.",
          "Correct—magnetic force is always perpendicular to velocity, doing no work and changing only direction, not speed.",
          "Incorrect—speed remains constant throughout circular motion in a uniform magnetic field."
        ]
      },
      {
        question: "Current flows upward through a straight vertical wire. What is the direction of the magnetic field at a point directly to the right of the wire?",
        concept: "Sources of magnetic fields",
        options: ["Directly away from the wire", "Directly toward the wire", "Into the page", "Out of the page"],
        correctIndex: 3,
        optionExplanations: [
          "Incorrect—the field circles around the wire; it doesn't point radially away from it.",
          "Incorrect—the field doesn't point radially toward the wire either.",
          "Incorrect—applying the right-hand rule (thumb up, fingers curling) gives out of the page at this point, not into it.",
          "Correct—pointing the thumb up (current direction) and curling the fingers shows the field pointing out of the page at a point to the right of the wire."
        ]
      },
      {
        question: "A bar magnet's north pole is pushed toward a wire loop, increasing flux through the loop. What does the induced current do, per Lenz's law?",
        concept: "Electromagnetic induction",
        options: ["Creates a field reinforcing the increasing flux", "Creates a field opposing the increasing flux, effectively repelling the magnet", "No current is induced without contact", "The current direction is random"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—Lenz's law specifically requires the induced current to oppose, not reinforce, the change in flux.",
          "Correct—the induced current opposes the increasing flux, creating a field that effectively repels the approaching magnet.",
          "Incorrect—no physical contact is needed for changing flux to induce a current.",
          "Incorrect—Lenz's law predicts a specific, non-random direction for the induced current."
        ]
      },
      {
        question: "A wire loop is held stationary in a magnetic field that is also constant (not changing) in strength, direction, and area. What EMF is induced in the loop?",
        concept: "Electromagnetic induction",
        options: ["A large EMF, proportional to field strength", "Zero EMF, since flux through the loop isn't changing", "A small, constant EMF regardless of flux", "It depends on the loop's resistance"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—EMF depends on the rate of change of flux, not field strength alone.",
          "Correct—Faraday's law requires a changing flux to induce an EMF; with nothing changing, no EMF is induced.",
          "Incorrect—EMF isn't induced at all without a change in flux, constant or otherwise.",
          "Incorrect—resistance affects induced current, not whether an EMF is induced in the first place."
        ]
      }
    ],
    simplifiedExplanation: "Moving charge and magnetism are two sides of the same coin: a moving charge creates a magnetic field around itself, and that same charge feels a force whenever it moves through someone else's magnetic field—always sideways, never speeding it up or slowing it down, just steering it. A current-carrying wire is just a stream of moving charges, so naturally it builds its own magnetic field too, and coiling that wire into a solenoid concentrates all those little fields into one strong, unified one, just like a bar magnet. Induction runs this whole relationship in reverse: instead of current making a magnetic field, a changing magnetic field makes current—and Lenz's law is nature's built-in stubbornness, with that induced current always fighting back against whatever change caused it in the first place."
  },
  {
    id: "waves-sound-light-optics",
    subjectId: "physics",
    sectionId: "chem-phys",
    title: "Waves, Sound, Light & Optics",
    estimatedMinutes: 30,
    difficulty: "Intermediate",
    prerequisiteLessonId: "magnetism-electromagnetic-phenomena",
    sections: [
      {
        heading: "Wave Properties",
        body: "Wave speed relates to frequency and wavelength by v = fλ. Transverse waves oscillate perpendicular to travel direction; longitudinal waves (like sound) oscillate parallel to it, creating compressions and rarefactions.",
        keyTerms: [
          { term: "v = fλ", definition: "Relates wave speed, frequency, and wavelength." },
          { term: "Longitudinal wave", definition: "A wave (like sound) that oscillates parallel to its direction of travel." }
        ]
      },
      {
        heading: "Sound Waves: Doppler Effect and Resonance",
        body: "The Doppler effect raises observed frequency when source and observer approach each other and lowers it when they separate. Resonance occurs when a system is driven at a natural frequency, producing large-amplitude standing waves.",
        keyTerms: [
          { term: "Doppler effect", definition: "A shift in observed wave frequency due to relative motion between source and observer." },
          { term: "Resonance", definition: "Large-amplitude response when a system is driven at one of its natural frequencies." }
        ]
      },
      {
        heading: "Light and Optics",
        body: "Snell's law (n1 sin θ1 = n2 sin θ2) governs refraction; light bends toward the normal entering a higher-index medium, away from the normal entering a lower-index medium. The thin lens equation (1/f = 1/do + 1/di) predicts image location for mirrors and lenses.",
        keyTerms: [
          { term: "Snell's law", definition: "n1 sin θ1 = n2 sin θ2; governs refraction at a boundary between media." },
          { term: "Thin lens equation", definition: "1/f = 1/do + 1/di; relates focal length to object and image distance." }
        ]
      }
    ],
    keyTakeaways: [
      "Wave speed, frequency, and wavelength are related by v = fλ; transverse waves oscillate perpendicular to travel, longitudinal waves parallel.",
      "The Doppler effect raises observed frequency when source and observer approach and lowers it when they separate; resonance produces large-amplitude standing waves at natural frequencies.",
      "Snell's law governs how light bends at a boundary; the thin lens equation predicts image location for mirrors and lenses."
    ],
    knowledgeCheck: [
      { question: "If a wave's frequency doubles while its speed stays constant, what happens to its wavelength?", answer: "Wavelength is cut in half, since v = fλ requires frequency and wavelength to be inversely proportional when speed is held constant." },
      { question: "Which direction does light bend when entering a medium with a higher index of refraction?", answer: "Toward the normal, since a higher index of refraction means the light slows down, and Snell's law predicts bending toward the normal when slowing down." }
    ],
    flashcards: [
      { front: "v = fλ", back: "Wave speed = frequency × wavelength." },
      { front: "Transverse wave", back: "Oscillates perpendicular to travel direction." },
      { front: "Doppler effect", back: "Frequency shift from relative motion." },
      { front: "Snell's law", back: "n1 sin θ1 = n2 sin θ2" },
      { front: "Thin lens equation", back: "1/f = 1/do + 1/di" }
    ],
    practiceQuestions: [
      {
        question: "A wave traveling through a fixed medium has its frequency doubled. What happens to its wavelength, assuming wave speed stays constant?",
        concept: "Wave properties",
        options: ["It doubles", "It is cut in half", "It stays the same", "It cannot be determined"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—doubling frequency would double wavelength only if speed also doubled, which it doesn't here.",
          "Correct—since v = fλ and v is constant, frequency and wavelength are inversely proportional; doubling frequency halves wavelength.",
          "Incorrect—wavelength must change to keep the product fλ (speed) constant.",
          "Incorrect—v = fλ directly determines the new wavelength given constant speed."
        ]
      },
      {
        question: "A sound source moves toward a stationary observer. Compared to the frequency the source emits, what frequency does the observer hear?",
        concept: "Sound waves: Doppler effect and resonance",
        options: ["A lower frequency than emitted", "The same frequency as emitted", "A higher frequency than emitted", "No sound is heard until the source stops"],
        correctIndex: 2,
        optionExplanations: [
          "Incorrect—a lower frequency would be heard if the source were moving away, not toward, the observer.",
          "Incorrect—relative motion between source and observer does shift the observed frequency from the emitted frequency.",
          "Correct—a source approaching an observer effectively compresses the wavelength reaching them, raising the observed frequency.",
          "Incorrect—sound is heard continuously; only its frequency is shifted by the Doppler effect."
        ]
      },
      {
        question: "Light travels from air into glass (higher index of refraction), striking the surface at an angle. How does the ray bend?",
        concept: "Light and optics",
        options: ["It bends away from the normal", "It bends toward the normal", "It does not bend", "It reflects entirely back into the air"],
        correctIndex: 1,
        optionExplanations: [
          "Incorrect—bending away from the normal would occur going from higher to lower index, the opposite of this scenario.",
          "Correct—entering a higher-index medium slows the light, and Snell's law predicts bending toward the normal in that case.",
          "Incorrect—refraction does bend the ray when crossing between media of different indices at an angle.",
          "Incorrect—some light does refract into the glass; total internal reflection isn't relevant going from lower to higher index."
        ]
      },
      {
        question: "A system is driven at a frequency that matches one of its natural frequencies, producing a standing wave of unusually large amplitude. What is this phenomenon called?",
        concept: "Sound waves: Doppler effect and resonance",
        options: ["The Doppler effect", "Refraction", "Resonance", "Reflection"],
        correctIndex: 2,
        optionExplanations: [
          "Incorrect—the Doppler effect involves a frequency shift from relative motion, not amplitude buildup from matching natural frequency.",
          "Incorrect—refraction is about light bending at a boundary between media, unrelated to this scenario.",
          "Correct—driving a system at one of its natural frequencies, producing a large-amplitude standing wave, defines resonance.",
          "Incorrect—reflection is a wave bouncing off a boundary, not a description of amplitude buildup at natural frequency."
        ]
      }
    ],
    simplifiedExplanation: "Every wave in this lesson—whether it's sound, light, or a wave on a string—obeys the same basic relationship (v = fλ), and most of what feels like separate topics is really just that relationship meeting a boundary or a moving source. The Doppler effect is what happens when the source itself is on the move, effectively bunching up or stretching out the waves reaching you, which your ear hears as a pitch shift. Resonance is what happens when you keep pushing a system at exactly the rhythm it already wants to vibrate at, building up amplitude the way pushing a swing at just the right moments builds up its height. And optics is just what waves do at a boundary between two materials—bending predictably (refraction) based on how much the material slows the wave down, which the thin lens equation then uses to predict exactly where an image will form."
  }
];

const lessonContentList: LessonContent[] = [...biologyLessons, ...cellBiologyLessons, ...geneticsLessons, ...biochemistryLessons, ...organSystemsLessons, ...evolutionEcologyLessons, ...generalChemistryLessons, ...organicChemistryLessons, ...physicsLessons];

export const lessonContentMap: Record<string, LessonContent> = Object.fromEntries(lessonContentList.map(l => [l.id, l]));

export function getLessonContent(lessonId: string): LessonContent | undefined {
  return lessonContentMap[lessonId];
}

// Real lesson content with its section/subject display names resolved—for
// any Library/search view that needs to show "MCAT · Biology" alongside a
// lesson without every caller re-deriving it from sectionId/subjectId by
// hand. Only lessons with real LessonContent are included (the other ~90%
// of mcatSections' lesson summaries are title-only stubs with no body to
// browse yet—see the "empty = content not written yet" comment on
// SubjectDef above).
export type BrowsableLesson = { content: LessonContent; sectionTitle: string; subjectName: string };

export function getAllRealLessons(): BrowsableLesson[] {
  return lessonContentList.map(content => ({
    content,
    sectionTitle: findSection(content.sectionId)?.shortTitle ?? content.sectionId,
    subjectName: findSubject(content.sectionId, content.subjectId)?.name ?? content.subjectId
  }));
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
export const BOOKMARKED_CARDS_EVENT = "studium:lessonBookmarksChange";

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
  window.dispatchEvent(new CustomEvent(BOOKMARKED_CARDS_EVENT));
}

export type BookmarkedCard = { lessonId: string; cardIndex: number };

// Flattened, cross-lesson view of every bookmarked flashcard—the map above
// is keyed by lesson for fast per-lesson lookup during a study session, but
// anything listing bookmarks app-wide (My Library) needs every lesson's
// entries together.
export function getAllBookmarkedCards(): BookmarkedCard[] {
  const map = getBookmarksMap();
  return Object.entries(map).flatMap(([lessonId, indices]) => indices.map(cardIndex => ({ lessonId, cardIndex })));
}
