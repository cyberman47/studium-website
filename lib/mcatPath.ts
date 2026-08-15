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

const lessonContentList: LessonContent[] = [...biologyLessons, ...cellBiologyLessons, ...geneticsLessons, ...biochemistryLessons, ...organSystemsLessons, ...evolutionEcologyLessons];

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
