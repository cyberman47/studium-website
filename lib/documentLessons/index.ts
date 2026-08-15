// The lesson-id → content lookup that gates which lessons render through
// the shared document-lesson experience (components/scientific-method/
// scientific-method-lesson.tsx). See lib/documentLesson.ts for the shared
// content shape.
//
// Scope: all 33 lessons across every subject in the MCAT "Biological &
// Biochemical Foundations" section (lib/mcatPath.ts's lessonContentList)—
// Biology (9), Cell Biology (4), Genetics & Molecular Biology (5),
// Biochemistry (8), Organ Systems (6), and Evolution & Ecology (1). Every
// entry here has real, MCAT-accurate LessonContent behind it in
// lib/mcatPath.ts. Other MCAT sections (Chem/Phys, Psych/Social, CARS) still
// have title-only lesson stubs with no written content and aren't included.
import { DocumentLessonContent } from "../documentLesson";
import { scientificMethodContent } from "../scientificMethodLesson";
import { biomoleculesContent } from "./biomolecules";
import { cellStructureContent } from "./cellStructure";
import { cellDivisionContent } from "./cellDivision";
import { dnaContent } from "./dna";
import { rnaContent } from "./rna";
import { proteinSynthesisContent } from "./proteinSynthesis";
import { evolutionContent } from "./evolution";
import { ecologyContent } from "./ecology";
import { cellStructureOrganellesContent } from "./cellStructureOrganelles";
import { cellMembranesTransportContent } from "./cellMembranesTransport";
import { cellCommunicationSignalingContent } from "./cellCommunicationSignaling";
import { cellCycleMitosisMeiosisContent } from "./cellCycleMitosisMeiosis";
import { mendelianGeneticsContent } from "./mendelianGenetics";
import { dnaReplicationRepairContent } from "./dnaReplicationRepair";
import { transcriptionRnaContent } from "./transcriptionRna";
import { translationProteinSynthesisContent } from "./translationProteinSynthesis";
import { geneRegulationMutationsContent } from "./geneRegulationMutations";
import { aminoAcidsProteinStructureContent } from "./aminoAcidsProteinStructure";
import { enzymesEnzymeKineticsContent } from "./enzymesEnzymeKinetics";
import { carbohydratesLipidsContent } from "./carbohydratesLipids";
import { nucleicAcidsContent } from "./nucleicAcids";
import { bioenergeticsAtpContent } from "./bioenergeticsAtp";
import { glycolysisCitricAcidCycleContent } from "./glycolysisCitricAcidCycle";
import { oxidativePhosphorylationContent } from "./oxidativePhosphorylation";
import { metabolismRegulationContent } from "./metabolismRegulation";
import { nervousEndocrineSystemsContent } from "./nervousEndocrineSystems";
import { cardiovascularRespiratorySystemsContent } from "./cardiovascularRespiratorySystems";
import { renalFluidBalanceContent } from "./renalFluidBalance";
import { digestiveSystemNutritionContent } from "./digestiveSystemNutrition";
import { immuneSystemContent } from "./immuneSystem";
import { reproductiveSystemDevelopmentContent } from "./reproductiveSystemDevelopment";
import { evolutionGeneticsEcologyContent } from "./evolutionGeneticsEcology";

export const documentLessonContentByLessonId: Record<string, DocumentLessonContent> = {
  "scientific-method": scientificMethodContent,
  "biomolecules": biomoleculesContent,
  "cell-structure": cellStructureContent,
  "cell-division": cellDivisionContent,
  "dna": dnaContent,
  "rna": rnaContent,
  "protein-synthesis": proteinSynthesisContent,
  "evolution": evolutionContent,
  "ecology": ecologyContent,
  "cell-structure-organelles": cellStructureOrganellesContent,
  "cell-membranes-transport": cellMembranesTransportContent,
  "cell-communication-signaling": cellCommunicationSignalingContent,
  "cell-cycle-mitosis-meiosis": cellCycleMitosisMeiosisContent,
  "mendelian-genetics-inheritance": mendelianGeneticsContent,
  "dna-replication-repair": dnaReplicationRepairContent,
  "transcription-rna": transcriptionRnaContent,
  "translation-protein-synthesis": translationProteinSynthesisContent,
  "gene-regulation-mutations": geneRegulationMutationsContent,
  "amino-acids-protein-structure": aminoAcidsProteinStructureContent,
  "enzymes-enzyme-kinetics": enzymesEnzymeKineticsContent,
  "carbohydrates-lipids": carbohydratesLipidsContent,
  "nucleic-acids": nucleicAcidsContent,
  "bioenergetics-atp": bioenergeticsAtpContent,
  "glycolysis-citric-acid-cycle": glycolysisCitricAcidCycleContent,
  "oxidative-phosphorylation": oxidativePhosphorylationContent,
  "metabolism-regulation": metabolismRegulationContent,
  "nervous-endocrine-systems": nervousEndocrineSystemsContent,
  "cardiovascular-respiratory-systems": cardiovascularRespiratorySystemsContent,
  "renal-fluid-balance": renalFluidBalanceContent,
  "digestive-system-nutrition": digestiveSystemNutritionContent,
  "immune-system": immuneSystemContent,
  "reproductive-system-development": reproductiveSystemDevelopmentContent,
  "evolution-genetics-ecology": evolutionGeneticsEcologyContent
};
