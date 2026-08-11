// Real, standard MCAT content-outline taxonomy for the Create-a-Quiz topic
// picker—Section → Topic → optional Subtopics. This is real, public exam
// structure (the same category of "real fact about the exam" already used
// for the USMLE/Pharmacology learning-path trees), not fabricated content.
// It owns no question content and no progress logic of its own; it's a
// selection menu. Matching selections against the app's real written
// question bank happens in matchRealQuestions() below, which reuses
// lib/mcatConcepts.ts rather than inventing new questions.

import { getAllMcatPracticeQuestions, SectionPracticeQuestion } from "./mcatConcepts";

export type QuizSubtopic = { id: string; name: string };
export type QuizTopic = { id: string; name: string; subtopics?: QuizSubtopic[] };
export type QuizSection = { id: string; name: string; shortName: string; description: string; topics: QuizTopic[] };

function sub(name: string): QuizSubtopic {
  return { id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""), name };
}

function topic(name: string, subtopics?: string[]): QuizTopic {
  return { id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""), name, subtopics: subtopics?.map(sub) };
}

export const mcatQuizSections: QuizSection[] = [
  {
    id: "bio-biochem",
    name: "Biological and Biochemical Foundations of Living Systems",
    shortName: "Biological & Biochemical",
    description: "Biology, biochemistry, molecular biology, genetics, physiology, and related concepts.",
    topics: [
      topic("Biomolecules", ["Amino acids & proteins", "Protein structure", "Carbohydrate structure & function", "Lipid structure & function", "Nucleic acid structure", "Vitamins & cofactors"]),
      topic("Cell Biology", ["Prokaryotic vs. eukaryotic cells", "Cell membrane structure & transport", "Organelle function", "Cytoskeleton", "Cell cycle & mitosis", "Meiosis", "Cell signaling"]),
      topic("Genetics", ["Mendelian genetics", "Punnett squares", "Pedigrees", "Linkage and recombination", "Mutations", "Gene expression", "Chromosomes", "Population genetics"]),
      topic("Enzymes", ["Enzyme structure", "Active sites", "Enzyme kinetics", "Michaelis-Menten kinetics", "Km and Vmax", "Competitive inhibition", "Noncompetitive inhibition", "Allosteric regulation"]),
      topic("Metabolism", ["Glycolysis", "Citric acid cycle", "Oxidative phosphorylation", "Gluconeogenesis", "Fatty acid oxidation", "Glycogen metabolism", "Metabolic regulation"]),
      topic("Molecular Biology", ["DNA replication", "Transcription", "Translation", "Gene regulation (operons)", "Recombinant DNA techniques", "PCR & gel electrophoresis"]),
      topic("Evolution", ["Natural selection", "Evidence for evolution", "Speciation", "Hardy-Weinberg equilibrium", "Phylogenetics"]),
      topic("Reproduction", ["Gametogenesis", "Fertilization", "Embryonic development", "Hormonal control of reproduction"]),
      topic("Nervous System", ["Neuron structure & function", "Action potentials", "Synaptic transmission", "CNS organization", "PNS organization", "Reflex arcs"]),
      topic("Endocrine System", ["Major endocrine glands", "Hormone types & mechanisms", "Feedback loops", "Hormonal regulation of metabolism"]),
      topic("Cardiovascular System", ["Cardiac cycle", "Heart anatomy", "Blood vessels & circulation", "Blood components", "Hemoglobin & oxygen transport"]),
      topic("Immune System", ["Innate immunity", "Adaptive immunity", "Antibodies", "Immune response to pathogens"]),
      topic("Digestive System", ["GI tract organization", "Digestive enzymes", "Nutrient absorption"]),
      topic("Respiratory System", ["Lung anatomy", "Gas exchange", "Ventilation mechanics"]),
      topic("Excretory System", ["Nephron structure & function", "Filtration, reabsorption, secretion", "Water & electrolyte balance"]),
      topic("Musculoskeletal System", ["Muscle contraction", "Types of muscle tissue", "Bone structure & remodeling"])
    ]
  },
  {
    id: "chem-phys",
    name: "Chemical and Physical Foundations of Biological Systems",
    shortName: "Chemical & Physical",
    description: "General chemistry, organic chemistry, physics, biochemistry, and quantitative concepts.",
    topics: [
      topic("Atomic & Molecular Structure", ["Atomic structure", "Periodic trends", "Chemical bonding", "Molecular geometry (VSEPR)"]),
      topic("Stoichiometry & Reactions", ["Moles & stoichiometry", "Types of reactions", "Reaction rates & kinetics", "Chemical equilibrium"]),
      topic("Thermodynamics", ["Laws of thermodynamics", "Enthalpy & entropy", "Gibbs free energy", "Thermochemistry"]),
      topic("Acids, Bases & Solutions", ["pH and pKa", "Titrations & buffers", "Solubility", "Le Chatelier's principle"]),
      topic("Electrochemistry", ["Redox reactions", "Galvanic & electrolytic cells", "Electrode potentials"]),
      topic("Organic Chemistry Fundamentals", ["Nomenclature", "Functional groups", "Isomerism", "Resonance & aromaticity"]),
      topic("Organic Reactions", ["Substitution reactions", "Elimination reactions", "Addition reactions", "Oxidation/reduction of organics"]),
      topic("Separations & Spectroscopy", ["Chromatography", "Distillation & extraction", "NMR spectroscopy", "IR spectroscopy & mass spectrometry"]),
      topic("Mechanics", ["Kinematics", "Newton's laws", "Work, energy, power", "Momentum"]),
      topic("Fluids", ["Fluid statics", "Fluid dynamics", "Circulatory system physics"]),
      topic("Electricity & Magnetism", ["Electrostatics", "Circuits", "Magnetism"]),
      topic("Waves, Sound & Light", ["Wave properties", "Sound & the Doppler effect", "Geometric optics", "Physiological optics"]),
      topic("Atomic & Nuclear Phenomena", ["Radioactive decay", "Nuclear reactions", "Photoelectric effect"])
    ]
  },
  {
    id: "psych-social",
    name: "Psychological, Social, and Biological Foundations of Behavior",
    shortName: "Psych/Social",
    description: "Psychology, sociology, behavior, and biological foundations of behavior.",
    topics: [
      topic("Sensation & Perception", ["Sensory receptors", "Vision & hearing", "Perceptual organization", "Attention"]),
      topic("Learning & Memory", ["Classical conditioning", "Operant conditioning", "Observational learning", "Memory encoding & retrieval", "Forgetting"]),
      topic("Cognition", ["Problem solving & decision making", "Intelligence", "Language & cognition"]),
      topic("Motivation & Emotion", ["Theories of motivation", "Theories of emotion", "Stress & coping"]),
      topic("Identity & Personality", ["Personality theories", "Self-concept & self-esteem", "Identity development"]),
      topic("Psychological Disorders", ["Mood disorders", "Anxiety disorders", "Schizophrenia spectrum disorders", "Personality disorders"]),
      topic("Social Psychology", ["Attribution theory", "Attitudes & persuasion", "Conformity, compliance, obedience", "Group behavior"]),
      topic("Social Structure & Demographics", ["Social institutions", "Culture", "Social stratification", "Demographic shifts"]),
      topic("Biological Bases of Behavior", ["Nervous system & behavior", "Endocrine influences on behavior", "Genetic influences on behavior"]),
      topic("Health & Disparities", ["Social determinants of health", "Healthcare disparities", "Spirituality & religion in health"])
    ]
  },
  {
    id: "cars",
    name: "Critical Analysis and Reasoning Skills",
    shortName: "CARS",
    description: "Reading comprehension, reasoning, argument analysis, and passage-based reasoning.",
    topics: [
      topic("Reading Comprehension", ["Identifying main ideas", "Supporting details", "Author's tone & purpose"]),
      topic("Reasoning Within the Text", ["Inference", "Implication"]),
      topic("Reasoning Beyond the Text", ["Applying new information", "Evaluating arguments"]),
      topic("Argument-Based Questions", ["Identifying assumptions", "Strengthen/weaken questions"])
    ]
  }
];

export function findQuizSection(id: string): QuizSection | undefined {
  return mcatQuizSections.find(s => s.id === id);
}

// Every leaf label in a section (topics without subtopics, plus every
// subtopic of topics that have them)—used by "Select all" and search.
export function getLeafNames(section: QuizSection): string[] {
  return section.topics.flatMap(t => t.subtopics ? t.subtopics.map(s => s.name) : [t.name]);
}

export type QuizConfig = {
  sections: { section: string; topics: string[] }[];
  questionCount: number;
  difficulty: "easy" | "medium" | "hard" | "adaptive";
  formats: string[];
  focus: string[];
};

// Honest fallback, not real generation: fuzzy-matches selected leaf topic
// names against the *real* concept tags already on the ~45 real practice
// questions in this app (see lib/mcatConcepts.ts). No new question content
// is invented—this only surfaces what's already genuinely written.
export function matchRealQuestions(selectedLeafNames: string[]): SectionPracticeQuestion[] {
  if (selectedLeafNames.length === 0) return [];
  const needles = selectedLeafNames.map(n => n.toLowerCase());
  const pool = getAllMcatPracticeQuestions();
  return pool.filter(q => {
    const concept = q.question.concept.toLowerCase();
    return needles.some(needle => concept.includes(needle) || needle.includes(concept) || wordsOverlap(concept, needle));
  });
}

// Loose "share a real word" match (e.g. "DNA replication" selected vs. a
// real question concept-tagged "DNA structure")—catches genuinely related
// real content without claiming an exact topic match.
function wordsOverlap(a: string, b: string): boolean {
  const wordsA = new Set(a.split(/\W+/).filter(w => w.length > 3));
  const wordsB = b.split(/\W+/).filter(w => w.length > 3);
  return wordsB.some(w => wordsA.has(w));
}
