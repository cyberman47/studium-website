import { awardLessonKP, claimTerminologyGoal, ClaimResult, logFlashcards, recordNoteCreated } from "./progress";

// ---- Categories & terms ----

export type TermCategory = { id: string; name: string };

export const termCategories: TermCategory[] = [
  { id: "anatomy", name: "Anatomy Terms" },
  { id: "biology", name: "Biology Terms" },
  { id: "microbiology", name: "Microbiology Terms" },
  { id: "pharmacology", name: "Pharmacology Terms" },
  { id: "pathology", name: "Pathology Terms" },
  { id: "clinical", name: "Clinical Terms" },
  { id: "abbreviations", name: "Medical Abbreviations" }
];

export type WordPart = { part: string; meaning: string };

export type Term = {
  id: string;
  categoryId: string;
  name: string;
  definition: string;
  wordBreakdown: WordPart[];
  relatedTermIds: string[];
  aiExplanation: string;
  exampleSentence: string;
  clinicalRelevance: string;
  // Optional CMS fields (added for the admin Vocabulary editor). Optional so
  // none of the 189 existing built-in terms need backfilling—every real
  // reader treats a missing value as "not set," not as a fabricated default.
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
  tags?: string[];
  imageUrl?: string;
};

export const terms: Term[] = [
  {
    id: "myocardium",
    categoryId: "anatomy",
    name: "Myocardium",
    definition: "The muscular tissue of the heart responsible for contraction.",
    wordBreakdown: [{ part: "Myo-", meaning: "muscle" }, { part: "Cardium (cardio)", meaning: "heart" }],
    relatedTermIds: ["endocardium", "pericardium"],
    aiExplanation: "The myocardium is the heart's muscle layer that contracts to pump blood.",
    exampleSentence: "The infarct had damaged a large section of the myocardium.",
    clinicalRelevance: "Damage to the myocardium (as in a heart attack) directly reduces the heart's pumping ability and can lead to heart failure or arrhythmias."
  },
  {
    id: "endocardium",
    categoryId: "anatomy",
    name: "Endocardium",
    definition: "The smooth inner layer lining the chambers and valves of the heart.",
    wordBreakdown: [{ part: "Endo-", meaning: "inner, within" }, { part: "Cardium (cardio)", meaning: "heart" }],
    relatedTermIds: ["myocardium", "pericardium"],
    aiExplanation: "The endocardium is the smooth inner lining that blood directly touches as it moves through the heart.",
    exampleSentence: "Bacteria settled on a heart valve, causing endocarditis, an infection of the endocardium.",
    clinicalRelevance: "Infection of the endocardium (endocarditis) can damage heart valves and let bacteria spread through the bloodstream—a life-threatening emergency."
  },
  {
    id: "pericardium",
    categoryId: "anatomy",
    name: "Pericardium",
    definition: "The double-layered membranous sac that surrounds and protects the heart.",
    wordBreakdown: [{ part: "Peri-", meaning: "around" }, { part: "Cardium (cardio)", meaning: "heart" }],
    relatedTermIds: ["myocardium", "endocardium"],
    aiExplanation: "The pericardium is a protective sac that wraps around the heart and reduces friction as it beats.",
    exampleSentence: "Fluid accumulated between the layers of the pericardium, causing a pericardial effusion.",
    clinicalRelevance: "Fluid or infection in the pericardium can restrict the heart's ability to fill (cardiac tamponade), a medical emergency."
  },
  {
    id: "osteoporosis",
    categoryId: "anatomy",
    name: "Osteoporosis",
    definition: "A condition of reduced bone density that makes bones fragile and prone to fracture.",
    wordBreakdown: [{ part: "Osteo-", meaning: "bone" }, { part: "-porosis", meaning: "porous condition" }],
    relatedTermIds: ["osteoblast", "osteoclast"],
    aiExplanation: "Osteoporosis means your bones have become thinner and weaker than normal, making them easier to break.",
    exampleSentence: "Her DEXA scan confirmed osteoporosis, putting her at high risk for a hip fracture.",
    clinicalRelevance: "Osteoporosis dramatically raises fracture risk from minor falls, especially hip and vertebral fractures in older adults."
  },
  {
    id: "osteoblast",
    categoryId: "anatomy",
    name: "Osteoblast",
    definition: "A cell responsible for building new bone tissue.",
    wordBreakdown: [{ part: "Osteo-", meaning: "bone" }, { part: "-blast", meaning: "immature, building cell" }],
    relatedTermIds: ["osteoclast", "osteoporosis"],
    aiExplanation: "An osteoblast is a cell that builds new bone, like a construction worker for your skeleton.",
    exampleSentence: "Osteoblasts were actively laying down new bone matrix at the fracture site.",
    clinicalRelevance: "Understanding osteoblast activity helps explain how bone-building drugs and healing after fractures actually work."
  },
  {
    id: "osteoclast",
    categoryId: "anatomy",
    name: "Osteoclast",
    definition: "A cell that breaks down (resorbs) bone tissue.",
    wordBreakdown: [{ part: "Osteo-", meaning: "bone" }, { part: "-clast", meaning: "to break" }],
    relatedTermIds: ["osteoblast", "osteoporosis"],
    aiExplanation: "An osteoclast is a cell that breaks down old bone, working opposite osteoblasts to keep bone in balance.",
    exampleSentence: "Increased osteoclast activity was resorbing bone faster than it could be replaced.",
    clinicalRelevance: "Overactive osteoclasts drive conditions like osteoporosis; many osteoporosis drugs work by directly inhibiting them."
  },
  {
    id: "neuroglia",
    categoryId: "anatomy",
    name: "Neuroglia",
    definition: "Supportive cells of the nervous system that protect, insulate, and nourish neurons.",
    wordBreakdown: [{ part: "Neuro-", meaning: "nerve" }, { part: "-glia", meaning: "glue" }],
    relatedTermIds: ["axon", "dendrite"],
    aiExplanation: "Neuroglia are the support cells that protect, feed, and insulate neurons, without transmitting signals themselves.",
    exampleSentence: "Neuroglia outnumber neurons in the brain but don't transmit electrical signals themselves.",
    clinicalRelevance: "Neuroglial dysfunction is implicated in conditions like multiple sclerosis (demyelination) and some brain tumors (gliomas)."
  },
  {
    id: "axon",
    categoryId: "anatomy",
    name: "Axon",
    definition: "The long projection of a neuron that transmits electrical impulses away from the cell body.",
    wordBreakdown: [{ part: "Axon", meaning: "axis (Greek)" }],
    relatedTermIds: ["dendrite", "neuroglia"],
    aiExplanation: "An axon is like a wire that carries a nerve signal away from the neuron toward the next cell.",
    exampleSentence: "The axon extended over a meter, carrying signals from the spinal cord to the foot.",
    clinicalRelevance: "Axon damage—from trauma, MS, or neuropathy—disrupts nerve signal transmission and can cause permanent sensory or motor loss."
  },
  {
    id: "dendrite",
    categoryId: "anatomy",
    name: "Dendrite",
    definition: "A branched extension of a neuron that receives signals from other neurons.",
    wordBreakdown: [{ part: "Dendr-", meaning: "tree" }, { part: "-ite", meaning: "small, resembling" }],
    relatedTermIds: ["axon", "neuroglia"],
    aiExplanation: "Dendrites are the branches of a neuron that receive incoming signals from other neurons.",
    exampleSentence: "Dendrites on the neuron received signals from dozens of neighboring cells.",
    clinicalRelevance: "Loss of dendritic connections is linked to cognitive decline in conditions like Alzheimer's disease."
  },
  {
    id: "peritoneum",
    categoryId: "anatomy",
    name: "Peritoneum",
    definition: "The membrane lining the abdominal cavity and covering most of the abdominal organs.",
    wordBreakdown: [{ part: "Peri-", meaning: "around" }, { part: "-toneum (tonos)", meaning: "stretched" }],
    relatedTermIds: ["diaphragm"],
    aiExplanation: "The peritoneum is a thin membrane that lines your belly and wraps around most abdominal organs.",
    exampleSentence: "Inflammation of the peritoneum, or peritonitis, caused severe abdominal rigidity.",
    clinicalRelevance: "Peritonitis (an inflamed peritoneum) causes severe abdominal pain and rigidity and is a surgical emergency if untreated."
  },
  {
    id: "diaphragm",
    categoryId: "anatomy",
    name: "Diaphragm",
    definition: "The dome-shaped muscle beneath the lungs that drives breathing.",
    wordBreakdown: [{ part: "Dia-", meaning: "across" }, { part: "-phragma", meaning: "fence, wall" }],
    relatedTermIds: ["peritoneum", "cranium"],
    aiExplanation: "The diaphragm is the main muscle you use to breathe—it flattens when you inhale and relaxes when you exhale.",
    exampleSentence: "The diaphragm contracted and flattened with each inhalation.",
    clinicalRelevance: "Diaphragm paralysis or injury (e.g. from phrenic nerve damage) can cause significant breathing difficulty."
  },
  {
    id: "cranium",
    categoryId: "anatomy",
    name: "Cranium",
    definition: "The part of the skull that encloses and protects the brain.",
    wordBreakdown: [{ part: "Cranium", meaning: "skull (Greek: kranion)" }],
    relatedTermIds: ["diaphragm"],
    aiExplanation: "The cranium is the bony case that surrounds and protects your brain.",
    exampleSentence: "The CT scan showed no fractures of the cranium.",
    clinicalRelevance: "Cranium fractures raise concern for underlying brain injury and require careful neurological monitoring."
  },
  {
    id: "myocardial-infarction",
    categoryId: "clinical",
    name: "Myocardial Infarction",
    definition: "Damage to heart muscle caused by a sudden loss of blood supply, commonly called a heart attack.",
    wordBreakdown: [{ part: "Myo-", meaning: "muscle" }, { part: "Cardio-", meaning: "heart" }, { part: "Infarction", meaning: "tissue death from lost blood supply" }],
    relatedTermIds: ["myocardium", "atherosclerosis"],
    aiExplanation: "A myocardial infarction happens when blood flow to part of the heart muscle is blocked, so that tissue starts to die from lack of oxygen.",
    exampleSentence: "He was diagnosed with a myocardial infarction after presenting with crushing chest pain and ST elevation.",
    clinicalRelevance: "Recognizing a myocardial infarction quickly is critical—restoring blood flow within hours preserves heart muscle and saves lives."
  },
  {
    id: "arrhythmia",
    categoryId: "clinical",
    name: "Arrhythmia",
    definition: "An abnormal heart rhythm, where the heart beats too fast, too slow, or irregularly.",
    wordBreakdown: [{ part: "A-", meaning: "without" }, { part: "Rhythmia (rhythmos)", meaning: "rhythm" }],
    relatedTermIds: ["myocardial-infarction"],
    aiExplanation: "An arrhythmia is when your heart's electrical signals misfire, causing it to beat out of its normal steady rhythm.",
    exampleSentence: "The irregular pulse on exam turned out to be an arrhythmia caused by atrial fibrillation.",
    clinicalRelevance: "Some arrhythmias are harmless, but others (like ventricular fibrillation) are immediately life-threatening and need emergency treatment."
  },
  {
    id: "atherosclerosis",
    categoryId: "clinical",
    name: "Atherosclerosis",
    definition: "A buildup of fatty plaques inside artery walls that narrows and stiffens the arteries over time.",
    wordBreakdown: [{ part: "Athero-", meaning: "porridge, gruel (plaque)" }, { part: "Sclerosis", meaning: "hardening" }],
    relatedTermIds: ["myocardial-infarction"],
    aiExplanation: "Atherosclerosis is a slow buildup of fatty deposits inside artery walls that narrows them and can eventually block blood flow.",
    exampleSentence: "Decades of atherosclerosis had narrowed his coronary arteries significantly.",
    clinicalRelevance: "Atherosclerosis is the underlying cause of most heart attacks and strokes, making it one of the most important preventable disease processes in medicine."
  },
  {
    id: "diabetes",
    categoryId: "clinical",
    name: "Diabetes",
    definition: "A chronic condition in which the body cannot properly regulate blood glucose, due to insufficient insulin production, insulin resistance, or both.",
    wordBreakdown: [{ part: "Dia-", meaning: "through" }, { part: "-betes", meaning: "to pass (Greek: diabainein, to pass through)" }],
    relatedTermIds: ["atherosclerosis"],
    aiExplanation: "Diabetes means the body struggles to keep blood sugar in a normal range, either because it doesn't make enough insulin or its cells don't respond to insulin properly.",
    exampleSentence: "His poorly controlled diabetes was a major risk factor for the infection.",
    clinicalRelevance: "Poorly controlled diabetes damages blood vessels and nerves throughout the body, raising the risk of infection, heart disease, kidney failure, and vision loss."
  },
  {
    id: "febrile",
    categoryId: "clinical",
    name: "Febrile",
    definition: "Having a fever; showing an elevated body temperature, typically due to infection or inflammation.",
    wordBreakdown: [{ part: "Febr-", meaning: "fever (Latin: febris)" }, { part: "-ile", meaning: "pertaining to" }],
    relatedTermIds: ["afebrile", "pyrexia", "hyperthermia"],
    aiExplanation: "A febrile patient has a fever, usually because the body is responding to an infection or inflammation.",
    exampleSentence: "The patient was febrile with a temperature of 39.2°C.",
    clinicalRelevance: "Fever is often the first clue to an underlying infection, and its pattern and severity help guide diagnosis and urgency of treatment."
  },
  {
    id: "afebrile",
    categoryId: "clinical",
    name: "Afebrile",
    definition: "Without fever; having a normal body temperature.",
    wordBreakdown: [{ part: "A-", meaning: "without" }, { part: "Febr-", meaning: "fever" }, { part: "-ile", meaning: "pertaining to" }],
    relatedTermIds: ["febrile"],
    aiExplanation: "Afebrile simply means the opposite of febrile—no fever, temperature within the normal range.",
    exampleSentence: "By the third hospital day, he was afebrile and clinically improving.",
    clinicalRelevance: "Confirming a patient is afebrile helps rule out active infection and can signal that treatment is working."
  },
  {
    id: "pyrexia",
    categoryId: "clinical",
    name: "Pyrexia",
    definition: "Another medical term for fever; an elevated body temperature above the normal range.",
    wordBreakdown: [{ part: "Pyr-", meaning: "fire, heat (Greek: pyr)" }, { part: "-exia", meaning: "condition" }],
    relatedTermIds: ["febrile", "hyperthermia"],
    aiExplanation: "Pyrexia is just another word for fever—it's used interchangeably with 'febrile' in clinical notes.",
    exampleSentence: "The nursing note documented pyrexia of 38.6°C overnight.",
    clinicalRelevance: "Tracking pyrexia trends over time helps clinicians judge whether an infection is responding to treatment."
  },
  {
    id: "hyperthermia",
    categoryId: "clinical",
    name: "Hyperthermia",
    definition: "An abnormally high body temperature caused by the body's failure to regulate heat, rather than the immune system resetting its temperature set point as in fever.",
    wordBreakdown: [{ part: "Hyper-", meaning: "above, excessive" }, { part: "-thermia", meaning: "heat condition" }],
    relatedTermIds: ["febrile", "pyrexia"],
    aiExplanation: "Unlike a fever, hyperthermia isn't the immune system raising the body's 'thermostat'—it's the body overheating faster than it can cool down, as in heat stroke.",
    exampleSentence: "The marathon runner was brought in with hyperthermia and confusion after collapsing in the heat.",
    clinicalRelevance: "Unlike fever, hyperthermia doesn't respond to fever-reducing medication and requires active cooling—recognizing the difference changes treatment."
  },
  {
    id: "crepitus",
    categoryId: "clinical",
    name: "Crepitus",
    definition: "A crackling or grating sensation or sound, often felt or heard on palpation of tissue containing gas, or in joints with cartilage damage.",
    wordBreakdown: [{ part: "Crepitus", meaning: "a rattling, creaking (Latin: crepare, to crackle)" }],
    relatedTermIds: ["palpable"],
    aiExplanation: "Crepitus feels like a crackling under the skin—when it's from gas trapped in soft tissue, it's a red flag for a serious infection.",
    exampleSentence: "Crepitus was palpable over the affected area, raising concern for a gas-forming infection.",
    clinicalRelevance: "Crepitus in soft tissue can signal a gas-forming infection like necrotizing fasciitis, a surgical emergency requiring immediate debridement."
  },
  {
    id: "palpable",
    categoryId: "clinical",
    name: "Palpable",
    definition: "Able to be felt by touch during a physical examination.",
    wordBreakdown: [{ part: "Palp-", meaning: "to touch, feel (Latin: palpare)" }, { part: "-able", meaning: "capable of" }],
    relatedTermIds: ["crepitus"],
    aiExplanation: "If something is palpable, a clinician can feel it directly with their hands during an exam—like a lump, a pulse, or crepitus.",
    exampleSentence: "A palpable mass was noted in the right upper quadrant on abdominal exam.",
    clinicalRelevance: "What's palpable on exam—a mass, an enlarged organ, crepitus—often determines which diagnosis to pursue first."
  },
  {
    id: "tachycardia",
    categoryId: "clinical",
    name: "Tachycardia",
    definition: "An abnormally fast heart rate, typically defined as greater than 100 beats per minute in adults.",
    wordBreakdown: [{ part: "Tachy-", meaning: "fast" }, { part: "-cardia", meaning: "heart condition" }],
    relatedTermIds: ["bradycardia", "arrhythmia"],
    aiExplanation: "Tachycardia just means the heart is beating faster than normal—it can be a normal response to exercise or stress, or a sign of an underlying problem.",
    exampleSentence: "Her heart rate was 132 bpm, consistent with tachycardia.",
    clinicalRelevance: "Tachycardia can be a normal stress response or a sign of serious conditions like sepsis or blood loss—context determines urgency."
  },
  {
    id: "bradycardia",
    categoryId: "clinical",
    name: "Bradycardia",
    definition: "An abnormally slow heart rate, typically defined as fewer than 60 beats per minute in adults.",
    wordBreakdown: [{ part: "Brady-", meaning: "slow" }, { part: "-cardia", meaning: "heart condition" }],
    relatedTermIds: ["tachycardia", "arrhythmia"],
    aiExplanation: "Bradycardia means the heart is beating slower than normal—it can be totally normal in athletes, or a sign of a conduction problem elsewhere.",
    exampleSentence: "His resting heart rate of 45 bpm was diagnostic of bradycardia.",
    clinicalRelevance: "Severe symptomatic bradycardia can require a pacemaker, especially when caused by a conduction problem rather than normal athletic conditioning."
  },
  // ---- Expanded set covering the full Clinical Cases library (added after
  // discovering the original 24 terms only covered the necrotizing-fasciitis
  // case—every other daily case rendered with zero interactive terms). ----
  {
    id: "substernal",
    categoryId: "clinical",
    name: "Substernal",
    definition: "Located beneath the sternum (breastbone); typically used to describe the location of chest pain.",
    wordBreakdown: [{ part: "Sub-", meaning: "below" }, { part: "Sternum", meaning: "breastbone" }],
    relatedTermIds: ["chest-pain"],
    aiExplanation: "Substernal just means 'behind the breastbone'—it's the classic location for cardiac chest pain.",
    exampleSentence: "He described crushing substernal chest pain radiating to his left arm.",
    clinicalRelevance: "Substernal chest pain is the classic location for cardiac ischemia and should always prompt an ECG to rule out a heart attack."
  },
  {
    id: "chest-pain",
    categoryId: "clinical",
    name: "Chest Pain",
    definition: "Discomfort or pain felt anywhere in the chest, which can arise from the heart, lungs, esophagus, muscles, or other structures.",
    wordBreakdown: [],
    relatedTermIds: ["substernal", "radiating"],
    aiExplanation: "Chest pain is a broad symptom with many possible causes, ranging from harmless muscle strain to a life-threatening heart attack.",
    exampleSentence: "Crushing substernal chest pain radiating to the left arm is a classic presentation of a heart attack.",
    clinicalRelevance: "Distinguishing dangerous causes of chest pain (heart attack, pulmonary embolism, aortic dissection) from benign ones is one of the most important skills in emergency medicine."
  },
  {
    id: "radiating",
    categoryId: "clinical",
    name: "Radiating",
    definition: "Spreading outward from the original site, as pain that travels from one body area to another.",
    wordBreakdown: [],
    relatedTermIds: ["chest-pain"],
    aiExplanation: "When pain 'radiates,' it means it's felt spreading beyond where it started—like chest pain that's also felt in the arm or jaw.",
    exampleSentence: "His chest pain was radiating to his left arm and jaw.",
    clinicalRelevance: "The pattern of radiation can point to the cause—pain radiating to the left arm or jaw is classic for cardiac ischemia, while pain radiating to the back can suggest aortic dissection."
  },
  {
    id: "diaphoresis",
    categoryId: "clinical",
    name: "Diaphoresis",
    definition: "Excessive or profuse sweating, often occurring suddenly.",
    wordBreakdown: [{ part: "Dia-", meaning: "through" }, { part: "-phoresis", meaning: "carrying, bearing (Greek: phorein)" }],
    relatedTermIds: [],
    aiExplanation: "Diaphoresis is just medical language for heavy sweating, often a sign the body is under significant physical stress.",
    exampleSentence: "He was pale and cool with diaphoresis, associated with nausea.",
    clinicalRelevance: "Diaphoresis alongside chest pain is a red flag for a heart attack, since it reflects a surge of sympathetic nervous system activity during cardiac distress."
  },
  {
    id: "nausea",
    categoryId: "clinical",
    name: "Nausea",
    definition: "An uncomfortable sensation of needing to vomit.",
    wordBreakdown: [],
    relatedTermIds: [],
    aiExplanation: "Nausea is the queasy feeling that often comes before vomiting.",
    exampleSentence: "He reported nausea and vomiting along with abdominal pain.",
    clinicalRelevance: "Nausea accompanying chest pain (rather than isolated stomach upset) raises suspicion for a heart attack, especially in women and diabetics who often present atypically."
  },
  {
    id: "ecg",
    categoryId: "abbreviations",
    name: "ECG",
    definition: "Electrocardiogram; a recording of the heart's electrical activity used to diagnose arrhythmias, ischemia, and infarction.",
    wordBreakdown: [],
    relatedTermIds: ["st-segment-elevation", "atrial-fibrillation"],
    aiExplanation: "An ECG (or EKG) is a quick, painless test that traces the heart's electrical signals on paper or a screen.",
    exampleSentence: "His ECG showed ST-segment elevation in leads II, III, and aVF.",
    clinicalRelevance: "The ECG is often the single fastest, most important test for diagnosing a heart attack or dangerous arrhythmia in the emergency department."
  },
  {
    id: "st-segment-elevation",
    categoryId: "clinical",
    name: "ST-Segment Elevation",
    definition: "An abnormal upward shift of the ST segment on an ECG, most often indicating an acute, full-thickness heart attack (STEMI).",
    wordBreakdown: [],
    relatedTermIds: ["ecg", "infarction"],
    aiExplanation: "ST-segment elevation is an ECG pattern that's a strong signal the heart muscle is actively being starved of blood flow.",
    exampleSentence: "ST-segment elevation in leads II, III, and aVF pointed to an inferior wall heart attack.",
    clinicalRelevance: "Recognizing ST-segment elevation triggers an immediate, time-critical response—every minute of delay in restoring blood flow costs heart muscle."
  },
  {
    id: "coronary-artery",
    categoryId: "clinical",
    name: "Coronary Artery",
    definition: "One of the blood vessels that supplies oxygenated blood directly to the heart muscle.",
    wordBreakdown: [],
    relatedTermIds: ["infarction", "atherosclerosis"],
    aiExplanation: "Coronary arteries are the heart's own blood supply—when one gets blocked, the part of the heart it feeds starts to die.",
    exampleSentence: "The right coronary artery supplies the inferior wall of the heart in most people.",
    clinicalRelevance: "Identifying which coronary artery is blocked helps predict which complications to watch for and guides emergency treatment."
  },
  {
    id: "occluded",
    categoryId: "clinical",
    name: "Occluded",
    definition: "Blocked or closed off, most often used to describe a blood vessel obstructed by a clot or plaque.",
    wordBreakdown: [{ part: "Ob-", meaning: "against" }, { part: "-clude", meaning: "to close (Latin: claudere)" }],
    relatedTermIds: ["coronary-artery", "atherosclerosis"],
    aiExplanation: "An occluded vessel is one that's blocked, so blood can't flow through it normally.",
    exampleSentence: "The right coronary artery was occluded, causing an inferior wall heart attack.",
    clinicalRelevance: "An occluded coronary artery is a medical emergency—restoring flow quickly (via clot-busting drugs or a stent) limits permanent heart damage."
  },
  {
    id: "infarction",
    categoryId: "pathology",
    name: "Infarction",
    definition: "Tissue death caused by an interrupted blood supply.",
    wordBreakdown: [{ part: "In-", meaning: "in, into" }, { part: "Farctus", meaning: "stuffed, packed (Latin)" }],
    relatedTermIds: ["myocardial-infarction", "coronary-artery", "occluded"],
    aiExplanation: "An infarction is what happens when tissue loses its blood supply for too long and starts to die—like in a heart attack or stroke.",
    exampleSentence: "ST elevation in the inferior leads reflects an inferior wall infarction.",
    clinicalRelevance: "The term 'infarction' applies beyond the heart—understanding it helps make sense of heart attacks, strokes, and pulmonary emboli alike."
  },
  {
    id: "photophobia",
    categoryId: "clinical",
    name: "Photophobia",
    definition: "Unusual sensitivity to, or discomfort from, light.",
    wordBreakdown: [{ part: "Photo-", meaning: "light" }, { part: "-phobia", meaning: "fear, aversion" }],
    relatedTermIds: ["neck-stiffness"],
    aiExplanation: "Photophobia means light hurts or bothers the eyes more than normal.",
    exampleSentence: "She had photophobia and neck stiffness but no focal neurologic deficits.",
    clinicalRelevance: "Photophobia alongside headache and neck stiffness is a classic combination pointing to meningitis or subarachnoid hemorrhage—both emergencies."
  },
  {
    id: "neck-stiffness",
    categoryId: "clinical",
    name: "Neck Stiffness",
    definition: "Resistance or pain when trying to bend the neck forward, often a sign of irritation around the brain or spinal cord.",
    wordBreakdown: [],
    relatedTermIds: ["photophobia", "meningitis"],
    aiExplanation: "Neck stiffness (nuchal rigidity) happens when the tissues around the brain and spinal cord are inflamed or irritated, making neck flexion painful.",
    exampleSentence: "He presented with fever, severe headache, and neck stiffness.",
    clinicalRelevance: "New neck stiffness with fever or a severe headache should immediately raise concern for meningitis or subarachnoid hemorrhage."
  },
  {
    id: "focal-neurologic-deficit",
    categoryId: "clinical",
    name: "Focal Neurologic Deficit",
    definition: "A localized loss of neurologic function—such as weakness, numbness, or vision loss—affecting a specific part of the body.",
    wordBreakdown: [],
    relatedTermIds: [],
    aiExplanation: "A focal neurologic deficit is a problem with the nervous system that affects one specific area, like weakness in just one arm, rather than the whole body.",
    exampleSentence: "She had no focal neurologic deficits despite her severe headache.",
    clinicalRelevance: "The presence or absence of focal neurologic deficits helps narrow down whether a headache is a benign condition or something more dangerous, like a stroke or bleed."
  },
  {
    id: "lumbar-puncture",
    categoryId: "clinical",
    name: "Lumbar Puncture",
    definition: "A procedure that collects cerebrospinal fluid from the lower spine using a needle, used to diagnose infections, bleeding, and other neurologic conditions.",
    wordBreakdown: [],
    relatedTermIds: ["xanthochromia", "subarachnoid-hemorrhage"],
    aiExplanation: "A lumbar puncture (spinal tap) samples the fluid around the spinal cord and brain to look for signs of infection or bleeding.",
    exampleSentence: "A lumbar puncture was performed to look for xanthochromia.",
    clinicalRelevance: "A lumbar puncture is often the deciding test when a CT scan is negative but a dangerous bleed or infection is still suspected."
  },
  {
    id: "xanthochromia",
    categoryId: "clinical",
    name: "Xanthochromia",
    definition: "A yellowish discoloration of cerebrospinal fluid caused by the breakdown of blood, indicating bleeding has been present for some time.",
    wordBreakdown: [{ part: "Xantho-", meaning: "yellow" }, { part: "-chromia", meaning: "color" }],
    relatedTermIds: ["lumbar-puncture", "subarachnoid-hemorrhage"],
    aiExplanation: "Xanthochromia is a yellow tint in spinal fluid that shows up hours after a bleed, as blood breaks down.",
    exampleSentence: "Lumbar puncture revealed xanthochromia, confirming a subarachnoid hemorrhage.",
    clinicalRelevance: "Xanthochromia helps distinguish a true subarachnoid hemorrhage from blood introduced accidentally by the needle during the procedure."
  },
  {
    id: "subarachnoid-hemorrhage",
    categoryId: "pathology",
    name: "Subarachnoid Hemorrhage",
    definition: "Bleeding into the space surrounding the brain, classically causing a sudden, severe 'thunderclap' headache.",
    wordBreakdown: [],
    relatedTermIds: ["xanthochromia", "lumbar-puncture"],
    aiExplanation: "A subarachnoid hemorrhage is bleeding around the brain's surface, often from a burst aneurysm, causing the worst headache of someone's life.",
    exampleSentence: "This presentation was a classic subarachnoid hemorrhage.",
    clinicalRelevance: "Subarachnoid hemorrhage is a neurosurgical emergency—missing it can be fatal, which is why a negative CT still requires a lumbar puncture if suspicion is high."
  },
  {
    id: "analgesic",
    categoryId: "pharmacology",
    name: "Analgesic",
    definition: "A medication used to relieve pain.",
    wordBreakdown: [{ part: "An-", meaning: "without" }, { part: "-algesic", meaning: "pain (Greek: algos)" }],
    relatedTermIds: [],
    aiExplanation: "An analgesic is simply a painkiller, ranging from over-the-counter drugs to strong prescription opioids.",
    exampleSentence: "Discharging her home with analgesics alone would miss a dangerous diagnosis.",
    clinicalRelevance: "Treating pain with analgesics without first ruling out a dangerous cause—like a subarachnoid hemorrhage—can be a critical, sometimes fatal, mistake."
  },
  {
    id: "triptan",
    categoryId: "pharmacology",
    name: "Triptan",
    definition: "A class of medication used to treat migraine headaches by narrowing blood vessels in the brain.",
    wordBreakdown: [],
    relatedTermIds: [],
    aiExplanation: "Triptans are migraine-specific medications—but they're the wrong choice if the headache is actually from bleeding, not a migraine.",
    exampleSentence: "Starting triptan therapy would be inappropriate without first ruling out a subarachnoid hemorrhage.",
    clinicalRelevance: "Prescribing a triptan assumes a migraine diagnosis—giving one before excluding a thunderclap headache's dangerous causes could delay life-saving treatment."
  },
  {
    id: "postpartum",
    categoryId: "clinical",
    name: "Postpartum",
    definition: "The period of time following childbirth, typically the first six weeks.",
    wordBreakdown: [{ part: "Post-", meaning: "after" }, { part: "Partum", meaning: "birth (Latin: parere)" }],
    relatedTermIds: ["pulmonary-embolism", "hypercoagulable"],
    aiExplanation: "Postpartum just means 'after giving birth'—a period when the body is still adjusting and at higher risk for certain complications.",
    exampleSentence: "She was 2 weeks postpartum when she developed sudden breathlessness.",
    clinicalRelevance: "The postpartum period carries a significantly elevated risk of blood clots, so new chest pain or breathlessness in this window should never be dismissed."
  },
  {
    id: "pleuritic",
    categoryId: "clinical",
    name: "Pleuritic",
    definition: "Describing pain that worsens with breathing, coughing, or movement of the chest wall, often from irritation of the lung's lining.",
    wordBreakdown: [{ part: "Pleur-", meaning: "rib, side (the pleura)" }, { part: "-itic", meaning: "pertaining to" }],
    relatedTermIds: ["pulmonary-embolism"],
    aiExplanation: "Pleuritic pain is sharp chest pain that gets worse when you take a deep breath, often from inflammation around the lungs.",
    exampleSentence: "She presented with sudden-onset pleuritic chest pain and shortness of breath.",
    clinicalRelevance: "Pleuritic chest pain is a hallmark of pulmonary embolism, but can also come from pneumonia or pleurisy—context determines which is likely."
  },
  {
    id: "dyspnea",
    categoryId: "clinical",
    name: "Dyspnea",
    definition: "The medical term for shortness of breath or difficulty breathing.",
    wordBreakdown: [{ part: "Dys-", meaning: "difficult, abnormal" }, { part: "-pnea", meaning: "breathing" }],
    relatedTermIds: ["hypoxia", "pulmonary-embolism"],
    aiExplanation: "Dyspnea is just the medical word for feeling short of breath.",
    exampleSentence: "She reported palpitations and mild dyspnea for the past three hours.",
    clinicalRelevance: "New dyspnea has a huge range of causes—from anxiety to pulmonary embolism to heart failure—making the accompanying symptoms crucial to interpreting it."
  },
  {
    id: "hypoxia",
    categoryId: "pathology",
    name: "Hypoxia",
    definition: "A deficiency of oxygen reaching the body's tissues.",
    wordBreakdown: [{ part: "Hypo-", meaning: "below, deficient" }, { part: "-oxia", meaning: "oxygen condition" }],
    relatedTermIds: ["dyspnea", "pulmonary-embolism"],
    aiExplanation: "Hypoxia means the body's tissues aren't getting enough oxygen, which can quickly become dangerous.",
    exampleSentence: "Her SpO2 was 91% on room air, indicating hypoxia.",
    clinicalRelevance: "Hypoxia is an urgent finding that demands immediate investigation—it's one of the key clues pointing to pulmonary embolism in this case."
  },
  {
    id: "hypercoagulable",
    categoryId: "pathology",
    name: "Hypercoagulable",
    definition: "Having an increased tendency for blood to clot abnormally.",
    wordBreakdown: [{ part: "Hyper-", meaning: "above, excessive" }, { part: "Coagulare", meaning: "to clot (Latin)" }],
    relatedTermIds: ["postpartum", "pulmonary-embolism"],
    aiExplanation: "Being hypercoagulable means your blood clots more easily than it should, raising the risk of dangerous blood clots.",
    exampleSentence: "The postpartum period is a hypercoagulable state.",
    clinicalRelevance: "Recognizing hypercoagulable states—like pregnancy, postpartum, cancer, or surgery—helps clinicians anticipate and prevent blood clots before they cause harm."
  },
  {
    id: "deep-vein-thrombosis",
    categoryId: "pathology",
    name: "Deep Vein Thrombosis",
    definition: "A blood clot that forms in a deep vein, most commonly in the leg.",
    wordBreakdown: [],
    relatedTermIds: ["pulmonary-embolism", "hypercoagulable"],
    aiExplanation: "A deep vein thrombosis (DVT) is a blood clot in a deep leg vein that can break off and travel to the lungs.",
    exampleSentence: "She had unilateral calf swelling, a sign of a DVT.",
    clinicalRelevance: "An untreated DVT can break loose and travel to the lungs as a pulmonary embolism, which is why leg swelling with breathlessness is taken so seriously."
  },
  {
    id: "pulmonary-embolism",
    categoryId: "pathology",
    name: "Pulmonary Embolism",
    definition: "A blockage in an artery of the lungs, usually caused by a blood clot that traveled from elsewhere in the body (commonly the legs).",
    wordBreakdown: [],
    relatedTermIds: ["deep-vein-thrombosis", "hypoxia", "pleuritic"],
    aiExplanation: "A pulmonary embolism happens when a blood clot travels to the lungs and blocks blood flow there, which can be life-threatening.",
    exampleSentence: "Pleuritic pain, tachycardia, hypoxia, and signs of a DVT together pointed strongly to pulmonary embolism.",
    clinicalRelevance: "Pulmonary embolism can be rapidly fatal, so recognizing its subtle presentation—sudden breathlessness, pleuritic pain, tachycardia—is a critical emergency medicine skill."
  },
  {
    id: "periumbilical",
    categoryId: "clinical",
    name: "Periumbilical",
    definition: "Located around or near the umbilicus (belly button).",
    wordBreakdown: [{ part: "Peri-", meaning: "around" }, { part: "Umbilicus", meaning: "navel" }],
    relatedTermIds: ["appendicitis"],
    aiExplanation: "Periumbilical just means 'around the belly button'—a classic starting location for the pain of early appendicitis.",
    exampleSentence: "He presented with periumbilical pain that migrated to the right lower quadrant.",
    clinicalRelevance: "Pain that starts periumbilically and migrates to the right lower quadrant is the textbook pattern of appendicitis."
  },
  {
    id: "anorexia",
    categoryId: "clinical",
    name: "Anorexia",
    definition: "Loss of appetite, or an unwillingness to eat (in the general medical sense, not the eating disorder).",
    wordBreakdown: [{ part: "An-", meaning: "without" }, { part: "-orexia", meaning: "appetite (Greek: orexis)" }],
    relatedTermIds: ["appendicitis"],
    aiExplanation: "In a medical context, anorexia just means loss of appetite—a common accompanying symptom in many acute illnesses, including appendicitis.",
    exampleSentence: "His pain was accompanied by anorexia and a low-grade fever.",
    clinicalRelevance: "Anorexia alongside migrating abdominal pain strengthens the suspicion for appendicitis, helping distinguish it from other causes of belly pain."
  },
  {
    id: "rebound-tenderness",
    categoryId: "clinical",
    name: "Rebound Tenderness",
    definition: "Pain that occurs (or worsens) when pressure on the abdomen is suddenly released, suggesting irritation of the peritoneum.",
    wordBreakdown: [],
    relatedTermIds: ["appendicitis", "peritoneum"],
    aiExplanation: "Rebound tenderness is worse pain when a doctor's hand is quickly lifted off the belly rather than while pressing in—it's a sign the lining of the abdomen is inflamed.",
    exampleSentence: "He had rebound tenderness at McBurney's point.",
    clinicalRelevance: "Rebound tenderness is a key physical exam sign of peritoneal irritation, raising concern for a surgical abdomen like appendicitis."
  },
  {
    id: "mcburneys-point",
    categoryId: "clinical",
    name: "McBurney's Point",
    definition: "A specific point in the right lower abdomen, about a third of the way from the hip bone to the belly button, where tenderness classically indicates appendicitis.",
    wordBreakdown: [],
    relatedTermIds: ["appendicitis", "rebound-tenderness"],
    aiExplanation: "McBurney's point is a named spot on the abdomen doctors press on specifically to check for appendicitis.",
    exampleSentence: "He had rebound tenderness at McBurney's point.",
    clinicalRelevance: "Tenderness at McBurney's point is one of the most classic, testable physical exam findings for diagnosing appendicitis."
  },
  {
    id: "appendicitis",
    categoryId: "pathology",
    name: "Appendicitis",
    definition: "Inflammation of the appendix, a small pouch attached to the large intestine, usually requiring surgical removal.",
    wordBreakdown: [{ part: "Appendix", meaning: "the appendix organ" }, { part: "-itis", meaning: "inflammation" }],
    relatedTermIds: ["mcburneys-point", "rebound-tenderness", "periumbilical"],
    aiExplanation: "Appendicitis is inflammation of the appendix—if it isn't removed in time, it can rupture and cause a dangerous abdominal infection.",
    exampleSentence: "The classic presentation—periumbilical pain migrating to the RLQ with McBurney's point tenderness—is textbook acute appendicitis.",
    clinicalRelevance: "Appendicitis is one of the most common surgical emergencies, and recognizing its classic pattern quickly can prevent rupture and serious infection."
  },
  {
    id: "dehydrated",
    categoryId: "clinical",
    name: "Dehydrated",
    definition: "Having a deficit of body water, often from insufficient intake or excess losses through vomiting, sweating, or urination.",
    wordBreakdown: [],
    relatedTermIds: ["diabetic-ketoacidosis"],
    aiExplanation: "Being dehydrated means the body doesn't have enough fluid, which can happen quickly with vomiting, fever, or uncontrolled diabetes.",
    exampleSentence: "She appeared dehydrated with deep, rapid breathing.",
    clinicalRelevance: "Severe dehydration in diabetic ketoacidosis is why fluid resuscitation comes before insulin in treatment—restoring circulation is the first priority."
  },
  {
    id: "kussmaul-breathing",
    categoryId: "clinical",
    name: "Kussmaul Breathing",
    definition: "A pattern of deep, labored breathing that occurs as the body tries to blow off excess acid, classically seen in diabetic ketoacidosis.",
    wordBreakdown: [],
    relatedTermIds: ["diabetic-ketoacidosis", "bicarbonate"],
    aiExplanation: "Kussmaul breathing is deep, rapid breathing that's the body's way of trying to correct severe blood acidity.",
    exampleSentence: "She appeared dehydrated with deep, rapid breathing—a sign of Kussmaul respirations.",
    clinicalRelevance: "Kussmaul breathing is a visible clue that a patient is in significant metabolic acidosis, often from diabetic ketoacidosis."
  },
  {
    id: "bicarbonate",
    categoryId: "pharmacology",
    name: "Bicarbonate",
    definition: "A natural buffer in the blood that neutralizes acid; low levels indicate metabolic acidosis.",
    wordBreakdown: [],
    relatedTermIds: ["diabetic-ketoacidosis", "kussmaul-breathing"],
    aiExplanation: "Bicarbonate is the blood's natural acid buffer—when it's low, the blood has become too acidic.",
    exampleSentence: "Her serum bicarbonate was 10 mEq/L, confirming severe metabolic acidosis.",
    clinicalRelevance: "A low bicarbonate level confirms the severity of acidosis in DKA, though giving bicarbonate as treatment is reserved only for the most severe, refractory cases."
  },
  {
    id: "diabetic-ketoacidosis",
    categoryId: "pathology",
    name: "Diabetic Ketoacidosis",
    definition: "A dangerous complication of diabetes where the body, lacking enough insulin, breaks down fat for fuel and produces acidic ketones, causing high blood sugar and blood acidity.",
    wordBreakdown: [],
    relatedTermIds: ["diabetes", "bicarbonate", "kussmaul-breathing", "insulin"],
    aiExplanation: "Diabetic ketoacidosis (DKA) happens when the body, starved of insulin, starts burning fat and produces acid as a byproduct—it's a medical emergency.",
    exampleSentence: "Her glucose of 480 mg/dL and bicarbonate of 10 mEq/L were consistent with diabetic ketoacidosis.",
    clinicalRelevance: "DKA is treated with IV fluids first, then insulin—giving insulin too early, before fluids, can dangerously worsen electrolyte shifts."
  },
  {
    id: "insulin",
    categoryId: "pharmacology",
    name: "Insulin",
    definition: "A hormone, produced by the pancreas, that allows cells to take in glucose from the blood for energy.",
    wordBreakdown: [],
    relatedTermIds: ["diabetes", "diabetic-ketoacidosis"],
    aiExplanation: "Insulin is the hormone that lets sugar move out of the blood and into cells—without enough of it, blood sugar rises dangerously.",
    exampleSentence: "Insulin therapy was started shortly after fluid resuscitation began.",
    clinicalRelevance: "Insulin is the cornerstone treatment for type 1 diabetes and DKA, but must be given carefully and only after fluid resuscitation in DKA."
  },
  {
    id: "fluid-resuscitation",
    categoryId: "pharmacology",
    name: "Fluid Resuscitation",
    definition: "The administration of intravenous fluids to restore blood volume and circulation.",
    wordBreakdown: [],
    relatedTermIds: ["dehydration", "diabetic-ketoacidosis"],
    aiExplanation: "Fluid resuscitation just means giving IV fluids to help restore normal blood volume and circulation.",
    exampleSentence: "IV isotonic fluids were started first, with insulin following shortly after.",
    clinicalRelevance: "In DKA, fluid resuscitation comes before insulin because restoring perfusion is the immediate priority for a dehydrated, acidotic patient."
  },
  {
    id: "hyperglycemia",
    categoryId: "pathology",
    name: "Hyperglycemia",
    definition: "An abnormally high level of glucose (sugar) in the blood.",
    wordBreakdown: [{ part: "Hyper-", meaning: "above, excessive" }, { part: "Glyc-", meaning: "sugar" }, { part: "-emia", meaning: "blood condition" }],
    relatedTermIds: ["diabetes", "diabetic-ketoacidosis"],
    aiExplanation: "Hyperglycemia is just high blood sugar—when severe and combined with acidosis, it points to diabetic ketoacidosis.",
    exampleSentence: "Her glucose of 480 mg/dL confirmed severe hyperglycemia.",
    clinicalRelevance: "Severe hyperglycemia combined with acidosis and dehydration is the hallmark of diabetic ketoacidosis, a true endocrine emergency."
  },
  {
    id: "petechial-rash",
    categoryId: "clinical",
    name: "Petechial Rash",
    definition: "A rash made up of tiny, pinpoint red or purple spots caused by bleeding under the skin.",
    wordBreakdown: [],
    relatedTermIds: ["meningitis"],
    aiExplanation: "A petechial rash is made of tiny red or purple dots from small blood vessels leaking under the skin—it can be a warning sign of serious infection.",
    exampleSentence: "A petechial rash was noted on his trunk and legs.",
    clinicalRelevance: "A petechial rash with fever and neck stiffness is a red flag for meningococcemia, a rapidly fatal infection if not treated immediately."
  },
  {
    id: "meningitis",
    categoryId: "pathology",
    name: "Meningitis",
    definition: "Inflammation of the protective membranes covering the brain and spinal cord, usually caused by infection.",
    wordBreakdown: [{ part: "Mening-", meaning: "membrane (meninges)" }, { part: "-itis", meaning: "inflammation" }],
    relatedTermIds: ["neck-stiffness", "petechial-rash", "photophobia"],
    aiExplanation: "Meningitis is inflammation of the coverings of the brain and spinal cord, most often from a bacterial or viral infection.",
    exampleSentence: "This presentation was concerning for meningococcal meningitis, a life-threatening emergency.",
    clinicalRelevance: "Bacterial meningitis can kill within hours, so empiric antibiotics are started immediately—never delayed for imaging or lumbar puncture results."
  },
  {
    id: "empiric-antibiotics",
    categoryId: "pharmacology",
    name: "Empiric Antibiotics",
    definition: "Antibiotic treatment started based on the most likely diagnosis, before test results confirming the exact organism are available.",
    wordBreakdown: [],
    relatedTermIds: ["meningitis"],
    aiExplanation: "Empiric antibiotics are given right away based on a strong clinical suspicion, without waiting for lab confirmation, because delay could be fatal.",
    exampleSentence: "Empiric IV antibiotics should be started immediately for suspected meningococcal meningitis.",
    clinicalRelevance: "In suspected bacterial meningitis, starting empiric antibiotics immediately—before confirmatory tests return—saves lives."
  },
  {
    id: "fever",
    categoryId: "clinical",
    name: "Fever",
    definition: "A temporary rise in body temperature, usually as part of the body's response to infection.",
    wordBreakdown: [],
    relatedTermIds: ["febrile", "pyrexia"],
    aiExplanation: "Fever is the body deliberately raising its temperature to help fight off infection.",
    exampleSentence: "He presented with fever, severe headache, neck stiffness, and photophobia.",
    clinicalRelevance: "Fever combined with other red-flag symptoms (like neck stiffness or a rash) can point toward serious infections requiring emergency treatment."
  },
  {
    id: "joint-aspiration",
    categoryId: "clinical",
    name: "Joint Aspiration",
    definition: "A procedure that uses a needle to withdraw fluid from a joint, often to diagnose the cause of joint swelling and pain.",
    wordBreakdown: [],
    relatedTermIds: ["gout", "monosodium-urate"],
    aiExplanation: "Joint aspiration means drawing fluid out of a swollen joint with a needle to examine it under a microscope.",
    exampleSentence: "Joint aspiration would confirm the diagnosis by revealing needle-shaped crystals.",
    clinicalRelevance: "Joint aspiration is the gold-standard way to distinguish gout from other causes of a hot, swollen joint, including infection."
  },
  {
    id: "gout",
    categoryId: "pathology",
    name: "Gout",
    definition: "A form of arthritis caused by the buildup of monosodium urate crystals in a joint, causing sudden, severe pain and swelling.",
    wordBreakdown: [],
    relatedTermIds: ["monosodium-urate", "joint-aspiration"],
    aiExplanation: "Gout is a type of arthritis where sharp uric acid crystals build up in a joint—classically the big toe—causing intense pain.",
    exampleSentence: "This is a classic case of podagra from gout.",
    clinicalRelevance: "Gout is very common and very treatable, but must be distinguished from septic arthritis, which can destroy a joint if missed."
  },
  {
    id: "monosodium-urate",
    categoryId: "pathology",
    name: "Monosodium Urate",
    definition: "The crystal form of uric acid that deposits in joints and causes gout.",
    wordBreakdown: [],
    relatedTermIds: ["gout", "joint-aspiration"],
    aiExplanation: "Monosodium urate crystals are the needle-shaped culprits behind a gout attack.",
    exampleSentence: "Needle-shaped, negatively birefringent monosodium urate crystals confirmed the diagnosis of gout.",
    clinicalRelevance: "Identifying monosodium urate crystals under a microscope is the definitive way to diagnose gout and distinguish it from pseudogout."
  },
  {
    id: "pseudogout",
    categoryId: "pathology",
    name: "Pseudogout",
    definition: "A form of arthritis caused by calcium pyrophosphate (CPPD) crystals, which mimics gout but has differently shaped crystals.",
    wordBreakdown: [],
    relatedTermIds: ["gout", "monosodium-urate"],
    aiExplanation: "Pseudogout looks a lot like gout but is caused by a different crystal (CPPD instead of urate), so it needs a microscope to tell them apart.",
    exampleSentence: "Rhomboid, positively birefringent crystals would instead suggest pseudogout.",
    clinicalRelevance: "Distinguishing gout from pseudogout under the microscope matters because their long-term management differs."
  },
  {
    id: "palpitations",
    categoryId: "clinical",
    name: "Palpitations",
    definition: "An uncomfortable awareness of one's own heartbeat—racing, pounding, or irregular.",
    wordBreakdown: [],
    relatedTermIds: ["atrial-fibrillation", "tachycardia"],
    aiExplanation: "Palpitations are simply the sensation of noticing your heart beating—too fast, too hard, or irregularly.",
    exampleSentence: "She presented with palpitations and mild dyspnea for the past three hours.",
    clinicalRelevance: "New palpitations, especially with an irregular pulse, should prompt an ECG to check for atrial fibrillation or another arrhythmia."
  },
  {
    id: "p-waves",
    categoryId: "clinical",
    name: "P Waves",
    definition: "The part of an ECG tracing that represents electrical activation of the atria (the heart's upper chambers).",
    wordBreakdown: [],
    relatedTermIds: ["ecg", "atrial-fibrillation"],
    aiExplanation: "P waves are the small bumps on an ECG that show the top chambers of the heart contracting.",
    exampleSentence: "Her ECG showed no discernible P waves with an irregular ventricular response.",
    clinicalRelevance: "The absence of organized P waves on an ECG is a defining feature of atrial fibrillation."
  },
  {
    id: "atrial-fibrillation",
    categoryId: "pathology",
    name: "Atrial Fibrillation",
    definition: "An irregular, often rapid heart rhythm caused by chaotic electrical activity in the heart's upper chambers.",
    wordBreakdown: [],
    relatedTermIds: ["p-waves", "palpitations", "arrhythmia"],
    aiExplanation: "Atrial fibrillation is a common irregular heart rhythm where the upper chambers quiver instead of beating in an organized way.",
    exampleSentence: "An irregularly irregular rhythm with absent P waves is the hallmark of atrial fibrillation.",
    clinicalRelevance: "Atrial fibrillation raises stroke risk because blood can pool and clot in the poorly-contracting atria, so many patients need blood thinners."
  },
  {
    id: "syncope",
    categoryId: "clinical",
    name: "Syncope",
    definition: "A temporary, sudden loss of consciousness, usually from a brief drop in blood flow to the brain.",
    wordBreakdown: [],
    relatedTermIds: ["vasovagal-syncope", "orthostatic-hypotension"],
    aiExplanation: "Syncope is the medical word for fainting—a brief blackout usually caused by a temporary drop in blood flow to the brain.",
    exampleSentence: "He fainted after standing for a long time at a crowded event.",
    clinicalRelevance: "Distinguishing benign causes of syncope (like vasovagal fainting) from dangerous ones (like a heart arrhythmia) is a key emergency medicine task."
  },
  {
    id: "orthostatic-hypotension",
    categoryId: "pathology",
    name: "Orthostatic Hypotension",
    definition: "A drop in blood pressure that occurs when standing up, which can cause dizziness or fainting.",
    wordBreakdown: [],
    relatedTermIds: ["syncope"],
    aiExplanation: "Orthostatic hypotension means blood pressure drops when you stand up, which can make you feel dizzy or even pass out.",
    exampleSentence: "Orthostatic hypotension from medication was considered as another possible cause of his syncope.",
    clinicalRelevance: "Orthostatic hypotension is a common, often medication-related cause of fainting, especially in older adults."
  },
  {
    id: "seizure",
    categoryId: "pathology",
    name: "Seizure",
    definition: "A sudden burst of abnormal electrical activity in the brain, which can cause convulsions, altered awareness, or unusual movements.",
    wordBreakdown: [],
    relatedTermIds: [],
    aiExplanation: "A seizure is a sudden electrical 'storm' in the brain that can cause shaking, staring spells, or loss of awareness.",
    exampleSentence: "A seizure was considered but ruled unlikely given his rapid, clear recovery.",
    clinicalRelevance: "Distinguishing a seizure from simple fainting matters because they're treated completely differently—confusion afterward and tongue-biting favor a seizure."
  },
  {
    id: "vasovagal-syncope",
    categoryId: "pathology",
    name: "Vasovagal Syncope",
    definition: "The most common cause of fainting, triggered by a reflex that suddenly slows the heart rate and drops blood pressure.",
    wordBreakdown: [],
    relatedTermIds: ["syncope"],
    aiExplanation: "Vasovagal syncope is the classic 'fainting' reflex—often triggered by standing too long, pain, or emotional stress—where the heart rate and blood pressure both drop suddenly.",
    exampleSentence: "Prolonged standing, a clear prodrome, and rapid recovery without confusion are typical of vasovagal syncope.",
    clinicalRelevance: "Vasovagal syncope is benign and extremely common, but it should only be diagnosed after more dangerous causes of fainting are considered and excluded."
  },
  {
    id: "necrotizing-fasciitis",
    categoryId: "pathology",
    name: "Necrotizing Fasciitis",
    definition: "A rapidly spreading, life-threatening bacterial infection that destroys skin, fat, and the tissue covering muscle.",
    wordBreakdown: [{ part: "Necro-", meaning: "death" }, { part: "Fascia", meaning: "the tissue layer covering muscle" }, { part: "-itis", meaning: "inflammation" }],
    relatedTermIds: ["crepitus", "debridement", "cellulitis"],
    aiExplanation: "Necrotizing fasciitis is a 'flesh-eating' bacterial infection that spreads fast along tissue planes and destroys everything in its path.",
    exampleSentence: "Pain out of proportion to exam findings plus crepitus pointed to necrotizing fasciitis.",
    clinicalRelevance: "Necrotizing fasciitis is a true surgical emergency—every hour of delay in getting to the operating room significantly increases the risk of death."
  },
  {
    id: "debridement",
    categoryId: "clinical",
    name: "Debridement",
    definition: "The surgical removal of dead, damaged, or infected tissue to allow the remaining healthy tissue to heal.",
    wordBreakdown: [],
    relatedTermIds: ["necrotizing-fasciitis"],
    aiExplanation: "Debridement means surgically cutting away dead or infected tissue so the body can heal the area that's left.",
    exampleSentence: "Necrotizing fasciitis requires urgent surgical debridement.",
    clinicalRelevance: "Rapid debridement is the single most important treatment for necrotizing fasciitis—antibiotics alone cannot control it."
  },
  {
    id: "vomiting",
    categoryId: "clinical",
    name: "Vomiting",
    definition: "The forceful expulsion of stomach contents through the mouth.",
    wordBreakdown: [],
    relatedTermIds: ["nausea", "diabetic-ketoacidosis"],
    aiExplanation: "Vomiting is the body forcefully emptying the stomach, often triggered by illness, irritation, or metabolic imbalance.",
    exampleSentence: "She presented with 2 days of nausea, vomiting, and abdominal pain.",
    clinicalRelevance: "Persistent vomiting can itself cause dangerous dehydration and electrolyte loss, on top of whatever triggered it in the first place."
  },
  {
    id: "irregularly-irregular",
    categoryId: "clinical",
    name: "Irregularly Irregular",
    definition: "A pulse or rhythm with no consistent pattern at all—neither regular nor predictably irregular—classically caused by atrial fibrillation.",
    wordBreakdown: [],
    relatedTermIds: ["atrial-fibrillation", "p-waves"],
    aiExplanation: "'Irregularly irregular' describes a pulse that has no pattern whatsoever from beat to beat—it's the classic way atrial fibrillation feels on exam.",
    exampleSentence: "Her pulse was irregularly irregular at 132 bpm.",
    clinicalRelevance: "Feeling an irregularly irregular pulse on a routine exam is often the first clue to atrial fibrillation, prompting an ECG to confirm it."
  },
  {
    id: "podagra",
    categoryId: "pathology",
    name: "Podagra",
    definition: "An acute gout attack affecting the joint at the base of the big toe.",
    wordBreakdown: [{ part: "Pod-", meaning: "foot" }, { part: "-agra", meaning: "seizure, sudden pain (Greek)" }],
    relatedTermIds: ["gout", "metatarsophalangeal-joint"],
    aiExplanation: "Podagra is just the name for a gout attack when it hits its most classic location—the big toe.",
    exampleSentence: "This is a classic case of podagra from gout.",
    clinicalRelevance: "Podagra is such a recognizable presentation that it's often diagnosed on history and exam alone, without needing joint aspiration."
  },
  {
    id: "metatarsophalangeal-joint",
    categoryId: "clinical",
    name: "Metatarsophalangeal Joint",
    definition: "The joint connecting a toe (or finger) to the foot (or hand); the first metatarsophalangeal joint is the base of the big toe, the classic site of gout.",
    wordBreakdown: [{ part: "Meta-", meaning: "beyond" }, { part: "Tarso-", meaning: "the foot's midsection" }, { part: "Phalanx", meaning: "toe or finger bone" }],
    relatedTermIds: ["podagra", "gout"],
    aiExplanation: "The metatarsophalangeal (MTP) joint is where the toe bones meet the long bones of the foot—the first MTP joint is the big toe knuckle.",
    exampleSentence: "He had sudden, severe pain and swelling of his right first metatarsophalangeal joint.",
    clinicalRelevance: "The first metatarsophalangeal joint is involved in the large majority of first gout attacks, making it a key exam landmark."
  },
  {
    id: "birefringent",
    categoryId: "clinical",
    name: "Birefringent",
    definition: "Describing a crystal that bends and splits light in a way visible under polarized microscopy, used to identify and distinguish crystal types in joint fluid.",
    wordBreakdown: [{ part: "Bi-", meaning: "two" }, { part: "Refringere", meaning: "to break, refract (Latin)" }],
    relatedTermIds: ["monosodium-urate", "pseudogout"],
    aiExplanation: "Birefringence is how crystals bend light differently depending on their orientation—under a special microscope, it's used to tell gout crystals from pseudogout crystals.",
    exampleSentence: "Monosodium urate crystals are needle-shaped and negatively birefringent, distinguishing gout from pseudogout.",
    clinicalRelevance: "Checking whether crystals are negatively or positively birefringent under polarized light is the definitive way to tell gout and pseudogout apart."
  },
  {
    id: "prodrome",
    categoryId: "clinical",
    name: "Prodrome",
    definition: "An early symptom or group of symptoms that signals the onset of a condition, before its main features appear.",
    wordBreakdown: [{ part: "Pro-", meaning: "before" }, { part: "-drome", meaning: "running, course (Greek: dromos)" }],
    relatedTermIds: ["vasovagal-syncope", "syncope"],
    aiExplanation: "A prodrome is the warning phase before the main event—like feeling queasy and lightheaded right before fainting.",
    exampleSentence: "A clear prodrome of nausea and tunnel vision preceded his loss of consciousness.",
    clinicalRelevance: "A classic prodrome (nausea, tunnel vision, lightheadedness) before fainting strongly supports vasovagal syncope over a more dangerous cardiac cause."
  },
  {
    id: "tunnel-vision",
    categoryId: "clinical",
    name: "Tunnel Vision",
    definition: "A narrowing of the visual field so that only what's directly ahead can be seen, often occurring just before fainting.",
    wordBreakdown: [],
    relatedTermIds: ["prodrome", "vasovagal-syncope"],
    aiExplanation: "Tunnel vision is when your peripheral vision fades out and you can only see straight ahead—a common warning sign right before fainting.",
    exampleSentence: "He reported nausea and tunnel vision just before losing consciousness.",
    clinicalRelevance: "Tunnel vision is part of the classic vasovagal prodrome, reflecting a temporary drop in blood flow to the brain and eyes."
  },
  {
    id: "faints",
    categoryId: "clinical",
    name: "Faints",
    definition: "Briefly and suddenly loses consciousness and muscle strength, usually followed by a quick, complete recovery.",
    wordBreakdown: [],
    relatedTermIds: ["syncope", "vasovagal-syncope"],
    aiExplanation: "Fainting is the everyday word for syncope—a short blackout that resolves on its own.",
    exampleSentence: "A 19-year-old man faints after standing for a long time at a crowded event.",
    clinicalRelevance: "Not all fainting is benign—ruling out a cardiac arrhythmia as the cause is an essential first step before attributing it to a vasovagal reflex."
  },
  {
    id: "cellulitis",
    categoryId: "pathology",
    name: "Cellulitis",
    definition: "A common bacterial skin infection causing redness, warmth, and swelling, without the deep tissue destruction seen in necrotizing fasciitis.",
    wordBreakdown: [{ part: "Cellul-", meaning: "small cell, tissue" }, { part: "-itis", meaning: "inflammation" }],
    relatedTermIds: ["necrotizing-fasciitis"],
    aiExplanation: "Cellulitis is a skin infection that causes redness and warmth, similar-looking to necrotizing fasciitis at first but far less dangerous.",
    exampleSentence: "Simple cellulitis was considered but ruled out given the severity of pain and presence of crepitus.",
    clinicalRelevance: "Telling ordinary cellulitis apart from necrotizing fasciitis is critical, since one needs antibiotics alone and the other needs emergency surgery."
  },
  // ---- Physiology / enzyme kinetics set (added for the Terminology
  // vocabulary system)—these are real, standard MCAT biochemistry terms,
  // not placeholders.
  {
    id: "hemostasis",
    categoryId: "biology",
    name: "Hemostasis",
    definition: "The process by which bleeding is stopped following vascular injury, involving vascular spasm, platelet plug formation, and coagulation.",
    wordBreakdown: [{ part: "Hemo-", meaning: "blood" }, { part: "-stasis", meaning: "stopping, standing still" }],
    relatedTermIds: [],
    aiExplanation: "Hemostasis is the body's sequence of steps for sealing off a cut blood vessel, from the vessel squeezing shut to platelets clumping to a clot forming.",
    exampleSentence: "Primary hemostasis begins within seconds of vessel injury as platelets adhere to the exposed collagen.",
    clinicalRelevance: "Disorders of hemostasis—like hemophilia or von Willebrand disease—cause abnormal bleeding, while excessive hemostasis can cause dangerous clots."
  },
  {
    id: "gluconeogenesis",
    categoryId: "biology",
    name: "Gluconeogenesis",
    definition: "The metabolic pathway through which glucose is synthesized from non-carbohydrate precursors such as amino acids, lactate, and glycerol.",
    wordBreakdown: [{ part: "Gluco-", meaning: "glucose" }, { part: "Neo-", meaning: "new" }, { part: "-genesis", meaning: "formation" }],
    relatedTermIds: [],
    aiExplanation: "Gluconeogenesis is how the body makes new glucose from scratch—using building blocks like amino acids—once it's run out of stored carbohydrates.",
    exampleSentence: "During prolonged fasting, gluconeogenesis in the liver becomes the primary source of blood glucose.",
    clinicalRelevance: "Gluconeogenesis keeps blood glucose stable during fasting; its dysregulation contributes to the elevated blood sugar seen in diabetes."
  },
  {
    id: "homeostasis",
    categoryId: "biology",
    name: "Homeostasis",
    definition: "The maintenance of relatively stable internal conditions despite external changes.",
    wordBreakdown: [{ part: "Homeo-", meaning: "similar, same" }, { part: "-stasis", meaning: "stopping, standing still" }],
    relatedTermIds: [],
    aiExplanation: "Homeostasis is the body's constant background work to keep things like temperature, pH, and blood sugar within a narrow, stable range.",
    exampleSentence: "The hypothalamus plays a central role in maintaining homeostasis by regulating temperature, hunger, and thirst.",
    clinicalRelevance: "Nearly every organ system exists to support homeostasis; disease is often what happens when a homeostatic mechanism fails or is overwhelmed."
  },
  {
    id: "enzyme",
    categoryId: "biology",
    name: "Enzyme",
    definition: "A protein (or occasionally RNA) that catalyzes a specific biochemical reaction by lowering its activation energy.",
    wordBreakdown: [{ part: "En-", meaning: "in" }, { part: "Zyme", meaning: "leaven (Greek: zyme)" }],
    relatedTermIds: ["enzyme-kinetics", "competitive-inhibition"],
    aiExplanation: "An enzyme is a biological catalyst—it speeds up a specific reaction without being used up itself, usually by binding the reactant at its active site.",
    exampleSentence: "The enzyme amylase begins breaking down starch into sugars as soon as food enters the mouth.",
    clinicalRelevance: "Enzyme deficiencies or malfunctions underlie many inherited metabolic disorders, and many drugs work by inhibiting a specific enzyme."
  },
  {
    id: "enzyme-kinetics",
    categoryId: "biology",
    name: "Enzyme Kinetics",
    definition: "The study of the rates of enzyme-catalyzed reactions and how factors like substrate concentration and inhibitors affect them.",
    wordBreakdown: [],
    relatedTermIds: ["enzyme", "michaelis-menten-kinetics", "km-and-vmax"],
    aiExplanation: "Enzyme kinetics is the math and graphs behind how fast an enzyme works under different conditions, especially as substrate concentration changes.",
    exampleSentence: "Enzyme kinetics experiments plot reaction velocity against substrate concentration to characterize how an enzyme behaves.",
    clinicalRelevance: "Understanding enzyme kinetics explains how many drugs work, since inhibitors are classified by exactly how they change an enzyme's kinetic behavior."
  },
  {
    id: "michaelis-menten-kinetics",
    categoryId: "biology",
    name: "Michaelis-Menten Kinetics",
    definition: "A mathematical model describing how the rate of an enzymatic reaction depends on substrate concentration, characterized by the constants Km and Vmax.",
    wordBreakdown: [],
    relatedTermIds: ["enzyme-kinetics", "km-and-vmax"],
    aiExplanation: "Michaelis-Menten kinetics is the classic curve showing that reaction speed rises with substrate concentration, then levels off once the enzyme is saturated.",
    exampleSentence: "A Michaelis-Menten plot of reaction velocity versus substrate concentration produces a characteristic hyperbolic curve.",
    clinicalRelevance: "Most enzymes in the body follow Michaelis-Menten kinetics, making it the standard framework for describing how drugs that target enzymes behave."
  },
  {
    id: "km-and-vmax",
    categoryId: "biology",
    name: "Km and Vmax",
    definition: "Km is the substrate concentration at which an enzyme reaches half its maximum reaction velocity; Vmax is the maximum reaction velocity itself, reached once the enzyme is fully saturated with substrate.",
    wordBreakdown: [],
    relatedTermIds: ["michaelis-menten-kinetics", "enzyme-kinetics", "competitive-inhibition"],
    aiExplanation: "Km tells you how much substrate an enzyme needs to work at half-speed (a proxy for how tightly it binds substrate), while Vmax is its top speed once fully saturated.",
    exampleSentence: "A low Km indicates the enzyme reaches half its maximum velocity at a low substrate concentration, implying high substrate affinity.",
    clinicalRelevance: "Comparing how a drug changes an enzyme's Km and Vmax is exactly how competitive and noncompetitive inhibition are told apart in pharmacology."
  },
  {
    id: "competitive-inhibition",
    categoryId: "biology",
    name: "Competitive Inhibition",
    definition: "A form of enzyme inhibition in which an inhibitor competes with the substrate for binding to the enzyme's active site.",
    wordBreakdown: [],
    relatedTermIds: ["enzyme-kinetics", "km-and-vmax", "michaelis-menten-kinetics", "noncompetitive-inhibition"],
    aiExplanation: "A competitive inhibitor looks enough like the real substrate that it can slide into the enzyme's active site instead—but adding more real substrate can out-compete it and restore full speed.",
    exampleSentence: "Because the inhibitor is competitive, increasing substrate concentration can eventually overcome its effect and restore Vmax.",
    clinicalRelevance: "Many drugs are designed as competitive inhibitors—their effect being overcome by excess substrate explains both how they work and how overdose of the natural substrate can blunt them."
  },
  {
    id: "noncompetitive-inhibition",
    categoryId: "biology",
    name: "Noncompetitive Inhibition",
    definition: "A form of enzyme inhibition in which an inhibitor binds a site other than the active site, reducing enzyme activity regardless of substrate concentration.",
    wordBreakdown: [],
    relatedTermIds: ["competitive-inhibition", "enzyme-kinetics"],
    aiExplanation: "A noncompetitive inhibitor doesn't fight for the active site—it binds somewhere else and changes the enzyme's shape, so adding more substrate can't rescue the reaction.",
    exampleSentence: "Unlike competitive inhibition, noncompetitive inhibition lowers Vmax while leaving Km unchanged.",
    clinicalRelevance: "Distinguishing competitive from noncompetitive inhibition by their effect on Km and Vmax is a classic, testable pharmacology and biochemistry concept."
  },
  // Scientific-method / experimental-design vocabulary—added for the
  // Scientific Method lesson's interactive terminology (see
  // app/dashboard/learning-paths/mcat/[section]/[subject]/[lesson]/page.tsx,
  // the scientific-method branch), but genuinely shared data: any lesson or
  // clinical case body containing these words gets the same real
  // InteractiveText popover, not a lesson-specific duplicate.
  {
    id: "hypothesis",
    categoryId: "biology",
    name: "Hypothesis",
    definition: "A testable, falsifiable statement predicting the relationship between variables.",
    wordBreakdown: [],
    relatedTermIds: ["prediction", "independent-variable"],
    aiExplanation: "A hypothesis is your best, testable guess at how two things are related—stated so an experiment could actually prove it wrong if it's false.",
    exampleSentence: "Her hypothesis was that increased exercise reduces blood pressure.",
    clinicalRelevance: "MCAT science-reasoning passages routinely ask you to pick the hypothesis out of a wall of experimental description—distinguishing it from the prediction or the conclusion."
  },
  {
    id: "prediction",
    categoryId: "biology",
    name: "Prediction",
    definition: "A specific, testable outcome expected if the hypothesis is true.",
    wordBreakdown: [],
    relatedTermIds: ["hypothesis"],
    aiExplanation: "If the hypothesis is the general claim, the prediction is the specific 'if this, then that' outcome an experiment can actually check.",
    exampleSentence: "If exercise really reduces blood pressure, the prediction is that the exercising group's readings will be lower after eight weeks.",
    clinicalRelevance: "MCAT questions often test whether you can tell a hypothesis (the general claim) apart from a prediction (the specific measurable outcome it implies)."
  },
  {
    id: "independent-variable",
    categoryId: "biology",
    name: "Independent Variable",
    definition: "The variable a researcher deliberately manipulates.",
    wordBreakdown: [],
    relatedTermIds: ["dependent-variable", "confounding-variable", "control-group"],
    aiExplanation: "The independent variable is whatever the experimenter changes on purpose—the thing being tested.",
    exampleSentence: "In the fertilizer study, the type of fertilizer was the independent variable.",
    clinicalRelevance: "Identifying the independent variable—the one thing the researcher is choosing to change—is the single most common MCAT experimental-design question."
  },
  {
    id: "dependent-variable",
    categoryId: "biology",
    name: "Dependent Variable",
    definition: "The variable that is measured to see how it responds to the independent variable.",
    wordBreakdown: [],
    relatedTermIds: ["independent-variable"],
    aiExplanation: "The dependent variable is the outcome you measure—it 'depends on' whatever the independent variable does.",
    exampleSentence: "Plant height was the dependent variable, measured after each fertilizer treatment.",
    clinicalRelevance: "Confusing the independent and dependent variable is one of the most common MCAT experimental-design traps—remember: independent is changed, dependent is measured."
  },
  {
    id: "confounding-variable",
    categoryId: "biology",
    name: "Confounding Variable",
    definition: "An uncontrolled factor that could affect the outcome and obscure the true relationship being tested.",
    wordBreakdown: [],
    relatedTermIds: ["independent-variable", "control-group", "correlation"],
    aiExplanation: "A confounding variable is an uninvited guest in the experiment—something the researcher didn't account for that could be the real reason for the result.",
    exampleSentence: "Warm weather is a confounding variable behind the correlation between ice cream sales and drowning rates.",
    clinicalRelevance: "MCAT passages love to bury a plausible confounding variable in the setup—spotting it is often the difference between the trap answer and the correct one."
  },
  {
    id: "control-group",
    categoryId: "biology",
    name: "Control Group",
    definition: "A group that does not receive the experimental treatment, used as a baseline for comparison.",
    wordBreakdown: [],
    relatedTermIds: ["independent-variable", "confounding-variable"],
    aiExplanation: "The control group is the 'nothing changed' comparison point that lets you tell whether the treatment actually did anything.",
    exampleSentence: "Participants in the control group followed their normal routine with no exercise intervention.",
    clinicalRelevance: "Without a real control group, an MCAT passage's experiment can't rule out that the result would have happened anyway—a frequent basis for 'flaw in this study' questions."
  },
  {
    id: "correlation",
    categoryId: "biology",
    name: "Correlation",
    definition: "A statistical relationship where two variables tend to change together.",
    wordBreakdown: [],
    relatedTermIds: ["causation", "confounding-variable"],
    aiExplanation: "Correlation just means two things move together in the data—it says nothing on its own about why.",
    exampleSentence: "Ice cream sales and drowning incidents are correlated: both rise in summer.",
    clinicalRelevance: "The MCAT tests correlation constantly because it's so easy to misread as proof of causation—training yourself to pause on 'these two things moved together' is high-yield."
  },
  {
    id: "causation",
    categoryId: "biology",
    name: "Causation",
    definition: "A relationship where a change in one variable directly produces a change in another.",
    wordBreakdown: [],
    relatedTermIds: ["correlation", "confounding-variable"],
    aiExplanation: "Causation means one thing actually makes the other happen—not just that they tend to show up together.",
    exampleSentence: "A well-controlled experiment showing the fertilizer group grew taller supports causation, not just correlation.",
    clinicalRelevance: "Only a properly controlled experiment—not an observed correlation—can support a causal claim, a distinction the MCAT tests directly and often."
  }
];

// ---- Custom terms (Admin) ----
// Studium has no real backend—terms above are static code, not database
// rows. Admin-added terms live in their own localStorage layer instead of
// pretending to write back to the source file, but they're genuinely
// merged into every real consumer (detection/highlighting, category
// browsing, term lookup, learned/mastery counts), so adding one from the
// admin panel actually makes it highlightable across the whole app.

export type CustomTerm = Term & { createdAt: string };

const CUSTOM_TERMS_KEY = "studium_custom_terms";
// Mirrors the CURRENT_PATH_EVENT/TERM_PROGRESS_EVENT pattern elsewhere in
// the app: components that display a term count (e.g. the admin Stats Bar)
// subscribe to this so an add/remove is reflected live, not just on reload.
export const CUSTOM_TERMS_EVENT = "studium:customTermsChange";

function getCustomTermsRaw(): CustomTerm[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(CUSTOM_TERMS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function getCustomTerms(): CustomTerm[] {
  return getCustomTermsRaw();
}

export function isCustomTerm(termId: string): boolean {
  return getCustomTermsRaw().some(t => t.id === termId);
}

function slugify(name: string): string {
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function addCustomTerm(input: Omit<Term, "id"> & { id?: string }): { ok: true; term: CustomTerm } | { ok: false; error: string } {
  if (typeof window === "undefined") return { ok: false, error: "Not available" };
  if (!input.name.trim()) return { ok: false, error: "Name is required." };
  if (!input.definition.trim()) return { ok: false, error: "Definition is required." };
  const id = input.id?.trim() || slugify(input.name);
  if (!id) return { ok: false, error: "Couldn't derive a valid id from that name." };
  if (getAllTerms().some(t => t.id === id)) return { ok: false, error: `A term with id "${id}" already exists.` };
  const term: CustomTerm = { ...input, id, createdAt: new Date().toISOString() };
  const next = [...getCustomTermsRaw(), term];
  localStorage.setItem(CUSTOM_TERMS_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent(CUSTOM_TERMS_EVENT));
  return { ok: true, term };
}

export function removeCustomTerm(termId: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CUSTOM_TERMS_KEY, JSON.stringify(getCustomTermsRaw().filter(t => t.id !== termId)));
  window.dispatchEvent(new CustomEvent(CUSTOM_TERMS_EVENT));
}

export function updateCustomTerm(termId: string, updates: Partial<Omit<Term, "id">>): { ok: true } | { ok: false; error: string } {
  if (typeof window === "undefined") return { ok: false, error: "Not available" };
  const existing = getCustomTermsRaw();
  const idx = existing.findIndex(t => t.id === termId);
  if (idx === -1) return { ok: false, error: "Only admin-created custom terms can be edited—built-in terms are static code." };
  const next = [...existing];
  next[idx] = { ...next[idx], ...updates };
  localStorage.setItem(CUSTOM_TERMS_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent(CUSTOM_TERMS_EVENT));
  return { ok: true };
}

// The single source of truth every real consumer should read from—built-in
// (static) terms plus whatever an admin has added this session/browser.
export function getAllTerms(): Term[] {
  return [...terms, ...getCustomTermsRaw()];
}

export function getTermsByCategory(categoryId: string): Term[] {
  return getAllTerms().filter(t => t.categoryId === categoryId);
}

export function getTerm(termId: string): Term | undefined {
  return getAllTerms().find(t => t.id === termId);
}

export function findTermCategory(categoryId: string): TermCategory | undefined {
  return termCategories.find(c => c.id === categoryId);
}

// ---- Word Builder roots ----

export type WordRoot = { id: string; part: string; meaning: string; examples: string[] };

export const wordRoots: WordRoot[] = [
  { id: "hyper", part: "Hyper-", meaning: "above, excessive", examples: ["Hypertension", "Hyperglycemia", "Hyperthyroidism"] },
  { id: "hypo", part: "Hypo-", meaning: "below, deficient", examples: ["Hypotension", "Hypoglycemia", "Hypothyroidism"] },
  { id: "neuro", part: "Neuro-", meaning: "nerve", examples: ["Neurology", "Neuropathy", "Neuroscience"] },
  { id: "cardio", part: "Cardio-", meaning: "heart", examples: ["Cardiology", "Cardiomyopathy", "Cardiovascular"] },
  { id: "osteo", part: "Osteo-", meaning: "bone", examples: ["Osteoporosis", "Osteoarthritis", "Osteomyelitis"] },
  { id: "myo", part: "Myo-", meaning: "muscle", examples: ["Myocardium", "Myopathy", "Myalgia"] },
  { id: "itis", part: "-itis", meaning: "inflammation", examples: ["Arthritis", "Bronchitis", "Dermatitis"] },
  { id: "ology", part: "-ology", meaning: "study of", examples: ["Cardiology", "Neurology", "Pathology"] },
  { id: "ectomy", part: "-ectomy", meaning: "surgical removal", examples: ["Appendectomy", "Tonsillectomy", "Mastectomy"] },
  { id: "otomy", part: "-otomy", meaning: "surgical incision", examples: ["Tracheotomy", "Craniotomy"] },
  { id: "pathy", part: "-pathy", meaning: "disease", examples: ["Neuropathy", "Cardiomyopathy", "Myopathy"] },
  { id: "brady", part: "Brady-", meaning: "slow", examples: ["Bradycardia", "Bradypnea"] },
  { id: "tachy", part: "Tachy-", meaning: "fast", examples: ["Tachycardia", "Tachypnea"] },
  { id: "dys", part: "Dys-", meaning: "difficult, abnormal", examples: ["Dysphagia", "Dyspnea", "Dysfunction"] },
  { id: "algia", part: "-algia", meaning: "pain", examples: ["Myalgia", "Neuralgia", "Arthralgia"] }
];

// ---- Spaced repetition progress (Leitner-style, 5 boxes) ----

const TERM_PROGRESS_KEY = "studium_term_progress";
const TERM_DAILY_KEY = "studium_term_daily";

export const DAILY_TERM_GOAL = 20;
const MAX_BOX = 5;
const boxIntervalDays = [1, 2, 4, 8, 16];

// Again/Hard/Good/Easy—the same real four-point scale lib/spacedRepetitionCore.ts
// uses (this file deliberately keeps its own copy rather than importing that
// one; see the box-math comment on nextBox below for the identical rules).
export type Rating = "again" | "hard" | "good" | "easy";

export type TermProgressEntry = {
  box: number;
  nextReview: string;
  timesReviewed: number;
  lastRating: Rating | null;
  learnedAt: string;
  // Optional so existing entries need no backfill—only set going forward.
  // Powers "Recently learned" (real recency of the last rating change),
  // distinct from learnedAt which only ever records the *first* time a term
  // was learned.
  lastRatedAt?: string;
};

function toDateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function addDays(d: Date, days: number): Date {
  const next = new Date(d);
  next.setDate(next.getDate() + days);
  return next;
}

// Again — didn't recall it → back to box 1. Hard — recalled with real effort
// → drop one box. Good — recalled it → advance one box. Easy — recalled it
// instantly → advance two boxes. Identical rules to spacedRepetitionCore.ts's
// nextBox, kept as a separate copy for this file's own keyspace.
function nextBox(box: number, rating: Rating): number {
  if (rating === "again") return 1;
  if (rating === "hard") return Math.max(1, box - 1);
  if (rating === "good") return Math.min(MAX_BOX, box + 1);
  return Math.min(MAX_BOX, box + 2); // easy
}

function getProgressMap(): Record<string, TermProgressEntry> {
  if (typeof window === "undefined") return {};
  const raw = localStorage.getItem(TERM_PROGRESS_KEY);
  return raw ? JSON.parse(raw) : {};
}

function saveProgressMap(map: Record<string, TermProgressEntry>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TERM_PROGRESS_KEY, JSON.stringify(map));
}

export function getTermProgress(termId: string): TermProgressEntry | null {
  return getProgressMap()[termId] ?? null;
}

export function isTermLearned(termId: string): boolean {
  return !!getProgressMap()[termId];
}

export function isTermMastered(termId: string): boolean {
  return (getProgressMap()[termId]?.box ?? 0) >= MAX_BOX;
}

export function getLearnedTerms(): Term[] {
  const map = getProgressMap();
  return getAllTerms().filter(t => map[t.id]);
}

export function getMasteredCount(): number {
  return Object.values(getProgressMap()).filter(p => p.box >= MAX_BOX).length;
}

export function getDueTerms(): Term[] {
  const map = getProgressMap();
  const today = toDateKey(new Date());
  return getAllTerms().filter(t => {
    const p = map[t.id];
    return !!p && p.nextReview <= today;
  });
}

function getDailyMap(): Record<string, number> {
  if (typeof window === "undefined") return {};
  const raw = localStorage.getItem(TERM_DAILY_KEY);
  return raw ? JSON.parse(raw) : {};
}

function bumpDaily(): number {
  if (typeof window === "undefined") return 0;
  const map = getDailyMap();
  const today = toDateKey(new Date());
  map[today] = (map[today] ?? 0) + 1;
  localStorage.setItem(TERM_DAILY_KEY, JSON.stringify(map));
  return map[today];
}

export function getTodaysCount(): number {
  return getDailyMap()[toDateKey(new Date())] ?? 0;
}

function checkDailyGoal(): ClaimResult | null {
  return getTodaysCount() >= DAILY_TERM_GOAL ? claimTerminologyGoal() : null;
}

// Fired whenever a term's progress/confidence changes, so every mounted
// HighlightedTerm instance across the current page (there can be several,
// one per InteractiveText block) can re-derive its own highlight state
// live—without this, updating confidence for a term wouldn't be reflected
// in already-rendered lesson/case text until a full reload.
export const TERM_PROGRESS_EVENT = "studium:termProgressChange";

function notifyTermProgressChange(termId: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(TERM_PROGRESS_EVENT, { detail: termId }));
}

// Called from a term's page when the user saves it for review (Learn Mode).
export function learnTerm(termId: string): ClaimResult | null {
  if (typeof window === "undefined") return null;
  const map = getProgressMap();
  if (!map[termId]) {
    map[termId] = { box: 1, nextReview: toDateKey(addDays(new Date(), boxIntervalDays[0])), timesReviewed: 0, lastRating: null, learnedAt: toDateKey(new Date()) };
    saveProgressMap(map);
  }
  bumpDaily();
  logFlashcards(1);
  notifyTermProgressChange(termId);
  return checkDailyGoal();
}

// Called from Review Mode after the user rates a due term.
export function reviewTerm(termId: string, rating: Rating): ClaimResult | null {
  if (typeof window === "undefined") return null;
  const map = getProgressMap();
  const existing = map[termId] ?? { box: 1, nextReview: toDateKey(new Date()), timesReviewed: 0, lastRating: null, learnedAt: toDateKey(new Date()) };
  const box = nextBox(existing.box, rating);
  const interval = boxIntervalDays[Math.min(box, boxIntervalDays.length) - 1];
  map[termId] = { box, nextReview: toDateKey(addDays(new Date(), interval)), timesReviewed: existing.timesReviewed + 1, lastRating: rating, learnedAt: existing.learnedAt, lastRatedAt: new Date().toISOString() };
  saveProgressMap(map);
  bumpDaily();
  logFlashcards(1);
  notifyTermProgressChange(termId);
  return checkDailyGoal();
}

// Real undo for the Focus Mode session: restores a term's exact Leitner-box
// state to a snapshot taken before a rating was applied (the caller reads
// getTermProgress(termId) *before* calling reviewTerm, then passes that
// snapshot back here if the student hits Undo). KP/streak claims are
// intentionally NOT reversed—consistent with how achievements and daily
// claims work everywhere else in this app (once earned, always earned)—so
// undo restores the learning state, not already-awarded rewards.
export function restoreTermProgress(termId: string, snapshot: TermProgressEntry | null) {
  if (typeof window === "undefined") return;
  const map = getProgressMap();
  if (snapshot) map[termId] = snapshot;
  else delete map[termId];
  saveProgressMap(map);
  notifyTermProgressChange(termId);
}

export type TerminologyStats = {
  totalLearned: number;
  masteredCount: number;
  dueForReview: number;
  masteryPercent: number;
  todayCount: number;
  dailyGoal: number;
};

export function getTerminologyStats(): TerminologyStats {
  const learned = getLearnedTerms();
  const mastered = getMasteredCount();
  return {
    totalLearned: learned.length,
    masteredCount: mastered,
    dueForReview: getDueTerms().length,
    masteryPercent: learned.length ? Math.round((mastered / learned.length) * 100) : 0,
    todayCount: getTodaysCount(),
    dailyGoal: DAILY_TERM_GOAL
  };
}

// ---- Confidence rating (Interactive Medical Terms) ----
// Lets a student self-rate a term straight from a highlighted-term panel. This
// writes into the same Leitner-box progress used everywhere else in Terminology,
// so "I Don't Know This Yet" genuinely resurfaces sooner in review/flashcard
// sessions, and "I Know This Well" pushes it further out—no separate system.

export type ConfidenceLevel = "know-well" | "somewhat" | "dont-know";

const confidenceBox: Record<ConfidenceLevel, number> = { "know-well": MAX_BOX, somewhat: 3, "dont-know": 1 };
const confidenceRating: Record<ConfidenceLevel, Rating> = { "know-well": "easy", somewhat: "good", "dont-know": "again" };

export function setTermConfidence(termId: string, level: ConfidenceLevel): ClaimResult | null {
  if (typeof window === "undefined") return null;
  const map = getProgressMap();
  const existing = map[termId] ?? { box: 1, nextReview: toDateKey(new Date()), timesReviewed: 0, lastRating: null, learnedAt: toDateKey(new Date()) };
  const box = confidenceBox[level];
  const interval = boxIntervalDays[Math.min(box, boxIntervalDays.length) - 1];
  map[termId] = { box, nextReview: toDateKey(addDays(new Date(), interval)), timesReviewed: existing.timesReviewed + 1, lastRating: confidenceRating[level], learnedAt: existing.learnedAt, lastRatedAt: new Date().toISOString() };
  saveProgressMap(map);
  bumpDaily();
  logFlashcards(1);
  notifyTermProgressChange(termId);
  return checkDailyGoal();
}

// Derived from the current box (not the last single rating word)—matches the
// same box-based approach spacedRepetitionCore.ts's getEntryStatus uses, and
// stays correct across the fuller again/hard/good/easy scale without a lossy
// 4-into-3 collapse of whichever rating was tapped most recently.
export function getTermConfidence(termId: string): ConfidenceLevel | null {
  const entry = getProgressMap()[termId];
  if (!entry || !entry.lastRating) return null;
  if (entry.box >= MAX_BOX) return "know-well";
  if (entry.box <= 1) return "dont-know";
  return "somewhat";
}

// ---- Personalized highlighting (Interactive Medical Terms) ----
// Drives which of the three highlight states a term shows in lesson/case
// text. Unknown (yellow) = not yet in your terminology library at all—
// clicking it is what adds it (see HighlightedTerm's togglePopup, which
// calls learnTerm on open) and immediately clears this state, regardless of
// what the student rates it afterward. Learning = in your library but not
// yet rated "I know this well" (covers "I don't know this", "I'm learning
// this", and simply not rated yet). Mastered = "I know this well"—these
// terms stop being highlighted entirely and blend into normal reading text.

export type MasteryState = "unknown" | "learning" | "mastered";

export function getTermMasteryState(termId: string): MasteryState {
  if (!getTermProgress(termId)) return "unknown";
  return getTermConfidence(termId) === "know-well" ? "mastered" : "learning";
}

// Forces a term to be due today, regardless of its current box—used by the
// "Add to Review Queue" action so it shows up in the very next review session.
export function queueForReview(termId: string) {
  if (typeof window === "undefined") return;
  const map = getProgressMap();
  const existing = map[termId] ?? { box: 1, nextReview: toDateKey(new Date()), timesReviewed: 0, lastRating: null, learnedAt: toDateKey(new Date()) };
  map[termId] = { ...existing, nextReview: toDateKey(new Date()) };
  saveProgressMap(map);
}

// ---- Discovery & personalization signals (Terminology vocabulary system) ----
// Real computations over the real progress map above—no AI, no invented
// scores. These exist so other systems (quiz generation, flashcard
// recommendations, Learning Paths, the AI Tutor) can eventually read a
// student's real weak areas; today only the Terminology homepage itself
// consumes them, but the functions are the reusable, connectable surface.

// Status recently *became* known—distinct from learnedAt (first-ever-learned).
export function getRecentlyLearnedTerms(limit = 8): Term[] {
  const map = getProgressMap();
  const ids = Object.entries(map)
    .filter(([, p]) => p.box >= MAX_BOX && !!p.lastRatedAt)
    .sort(([, a], [, b]) => new Date(b.lastRatedAt!).getTime() - new Date(a.lastRatedAt!).getTime())
    .map(([id]) => id)
    .slice(0, limit);
  const byId = new Map(getAllTerms().map(t => [t.id, t]));
  return ids.map(id => byId.get(id)).filter((t): t is Term => !!t);
}

export type WeakCategory = { category: TermCategory; dontKnowCount: number; learningCount: number; ratedCount: number };

// A category counts as a real weak area once at least 2 of its rated terms
// are "don't know"—same "not just one slip" bar practiceHistory.ts uses for
// weak MCAT concepts, applied here to terminology instead.
export function getWeakCategories(): WeakCategory[] {
  const map = getProgressMap();
  const byCategory = new Map<string, { dontKnow: number; learning: number; rated: number }>();
  for (const term of getAllTerms()) {
    const entry = map[term.id];
    if (!entry || !entry.lastRating) continue;
    const bucket = byCategory.get(term.categoryId) ?? { dontKnow: 0, learning: 0, rated: 0 };
    bucket.rated++;
    // Box-based, not last-rating-word-based (matches getTermConfidence): a
    // box-1 term reads as "don't know" regardless of whether an again or a
    // hard most recently put it there.
    if (entry.box <= 1) bucket.dontKnow++;
    else if (entry.box < MAX_BOX) bucket.learning++;
    byCategory.set(term.categoryId, bucket);
  }
  const weak: WeakCategory[] = [];
  for (const [categoryId, counts] of Array.from(byCategory)) {
    const category = findTermCategory(categoryId);
    if (category && counts.dontKnow >= 2) weak.push({ category, dontKnowCount: counts.dontKnow, learningCount: counts.learning, ratedCount: counts.rated });
  }
  return weak.sort((a, b) => b.dontKnowCount - a.dontKnowCount);
}

// Simple, real, non-AI recommendation: related terms of what the student is
// actively struggling with, so reinforcing a weak concept surfaces its
// neighbors too. Falls back to terms in whatever category maps to the
// student's current Learning Path once they have no rating history yet.
export function getRecommendedTerms(limit = 6): Term[] {
  const map = getProgressMap();
  const allTerms = getAllTerms();
  const byId = new Map(allTerms.map(t => [t.id, t]));
  const struggling = allTerms.filter(t => !!map[t.id] && map[t.id].box < MAX_BOX);

  const seen = new Set(struggling.map(t => t.id));
  const related: Term[] = [];
  for (const t of struggling) {
    for (const relatedId of t.relatedTermIds) {
      const relatedTerm = byId.get(relatedId);
      if (relatedTerm && !seen.has(relatedId) && (map[relatedId]?.box ?? 0) < MAX_BOX) {
        related.push(relatedTerm);
        seen.add(relatedId);
      }
    }
  }
  if (related.length > 0) return related.slice(0, limit);

  // No rating history yet—honest fallback, not a guess: terms never rated at all.
  return allTerms.filter(t => !map[t.id]).slice(0, limit);
}

// ---- Term views (Interactive Medical Terms) ----

const TERM_VIEWS_KEY = "studium_term_views";

type TermViewEntry = { count: number; lastViewedAt: string };

// Reads tolerate the older count-only shape (a bare number) so nobody's
// existing view history is wiped by this upgrade—it's just treated as
// "viewed, but no known timestamp yet" until the next real view.
function getViewsMap(): Record<string, TermViewEntry> {
  if (typeof window === "undefined") return {};
  const raw = localStorage.getItem(TERM_VIEWS_KEY);
  const parsed: Record<string, TermViewEntry | number> = raw ? JSON.parse(raw) : {};
  const normalized: Record<string, TermViewEntry> = {};
  for (const [id, value] of Object.entries(parsed)) {
    normalized[id] = typeof value === "number" ? { count: value, lastViewedAt: new Date(0).toISOString() } : value;
  }
  return normalized;
}

export function recordTermView(termId: string) {
  if (typeof window === "undefined") return;
  const map = getViewsMap();
  map[termId] = { count: (map[termId]?.count ?? 0) + 1, lastViewedAt: new Date().toISOString() };
  localStorage.setItem(TERM_VIEWS_KEY, JSON.stringify(map));
}

export function getTermViewCount(termId: string): number {
  return getViewsMap()[termId]?.count ?? 0;
}

// Real recency, not just a tally—powers the homepage's "Recently viewed" rail.
export function getRecentlyViewedTerms(limit = 8): Term[] {
  const map = getViewsMap();
  const ids = Object.entries(map)
    .sort(([, a], [, b]) => new Date(b.lastViewedAt).getTime() - new Date(a.lastViewedAt).getTime())
    .map(([id]) => id)
    .slice(0, limit);
  const byId = new Map(getAllTerms().map(t => [t.id, t]));
  return ids.map(id => byId.get(id)).filter((t): t is Term => !!t);
}

export function getTotalTermViews(): number {
  return Object.values(getViewsMap()).reduce((a, b) => a + b.count, 0);
}

// ---- Click reward (Interactive Medical Terms) ----
// Awards 1 KP the first time a student ever opens a given term's popup—once
// per term, not once per click, so repeatedly clicking the same word can't
// be farmed for infinite KP. Separate from (and stacks with) the larger
// daily Terminology goal reward.

const TERM_CLICK_KP_KEY = "studium_term_click_kp";

function getClickKPSet(): Set<string> {
  if (typeof window === "undefined") return new Set();
  const raw = localStorage.getItem(TERM_CLICK_KP_KEY);
  return new Set(raw ? JSON.parse(raw) : []);
}

export function awardTermClickKP(termId: string): ClaimResult | null {
  if (typeof window === "undefined") return null;
  const set = getClickKPSet();
  if (set.has(termId)) return null;
  set.add(termId);
  localStorage.setItem(TERM_CLICK_KP_KEY, JSON.stringify(Array.from(set)));
  return awardLessonKP(1);
}

// ---- Favorites (Interactive Medical Terms) ----

const TERM_FAVORITES_KEY = "studium_term_favorites";

function getFavoritesSet(): Set<string> {
  if (typeof window === "undefined") return new Set();
  const raw = localStorage.getItem(TERM_FAVORITES_KEY);
  return new Set(raw ? JSON.parse(raw) : []);
}

export function isTermFavorited(termId: string): boolean {
  return getFavoritesSet().has(termId);
}

export function toggleTermFavorite(termId: string): boolean {
  if (typeof window === "undefined") return false;
  const set = getFavoritesSet();
  const next = set.has(termId);
  if (next) set.delete(termId); else set.add(termId);
  localStorage.setItem(TERM_FAVORITES_KEY, JSON.stringify(Array.from(set)));
  return !next;
}

// ---- Per-term notes (Interactive Medical Terms) ----
// Real, persisted, and genuinely counted in the same lifetime "Notes
// Created" stat shown on the Progress page—there's no separate notes app
// yet, so this is scoped to "a quick note about this term" rather than
// pretending a full notebook feature exists.

const TERM_NOTES_KEY = "studium_term_notes";

function getNotesMap(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const raw = localStorage.getItem(TERM_NOTES_KEY);
  return raw ? JSON.parse(raw) : {};
}

export function getTermNote(termId: string): string {
  return getNotesMap()[termId] ?? "";
}

export function saveTermNote(termId: string, text: string): void {
  if (typeof window === "undefined") return;
  const map = getNotesMap();
  const isNew = !map[termId] && text.trim().length > 0;
  map[termId] = text;
  localStorage.setItem(TERM_NOTES_KEY, JSON.stringify(map));
  if (isNew) recordNoteCreated();
}
