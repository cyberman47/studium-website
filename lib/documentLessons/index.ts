// The lesson-id → content lookup that gates which lessons render through
// the shared document-lesson experience (components/scientific-method/
// scientific-method-lesson.tsx). See lib/documentLesson.ts for the shared
// content shape.
//
// Scope: all 33 lessons across every subject in the MCAT "Biological &
// Biochemical Foundations" section, plus all 25 lessons across every subject
// in the "Chemical & Physical Foundations of Biological Systems" section
// (lib/mcatPath.ts's lessonContentList)—Biology (9), Cell Biology (4),
// Genetics & Molecular Biology (5), Biochemistry (8), Organ Systems (6),
// Evolution & Ecology (1), General Chemistry (10), Organic Chemistry (6),
// and Physics (9). Every entry here has real, MCAT-accurate LessonContent
// behind it in lib/mcatPath.ts. The remaining MCAT sections (Psych/Social,
// CARS) still have title-only lesson stubs with no written content and
// aren't included.
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
import { atomicStructurePeriodicTrendsContent } from "./atomicStructurePeriodicTrends";
import { chemicalBondingMolecularStructureContent } from "./chemicalBondingMolecularStructure";
import { stoichiometryChemicalReactionsContent } from "./stoichiometryChemicalReactions";
import { solutionsConcentrationsContent } from "./solutionsConcentrations";
import { gasesLiquidsSolidsContent } from "./gasesLiquidsSolids";
import { thermochemistryThermodynamicsContent } from "./thermochemistryThermodynamics";
import { chemicalEquilibriumContent } from "./chemicalEquilibrium";
import { acidsBasesBuffersContent } from "./acidsBasesBuffers";
import { redoxElectrochemistryContent } from "./redoxElectrochemistry";
import { chemicalKineticsContent } from "./chemicalKinetics";
import { organicStructureFunctionalGroupsContent } from "./organicStructureFunctionalGroups";
import { isomersStereochemistryContent } from "./isomersStereochemistry";
import { organicReactionsContent } from "./organicReactions";
import { carbonylsCarboxylicAcidsDerivativesContent } from "./carbonylsCarboxylicAcidsDerivatives";
import { aminesAmidesBiologicalMoleculesContent } from "./aminesAmidesBiologicalMolecules";
import { organicChemistrySpectroscopyContent } from "./organicChemistrySpectroscopy";
import { unitsMathGraphsContent } from "./unitsMathGraphs";
import { kinematicsNewtonianMechanicsContent } from "./kinematicsNewtonianMechanics";
import { workEnergyMomentumContent } from "./workEnergyMomentum";
import { fluidsPressureContent } from "./fluidsPressure";
import { physicsThermodynamicsContent } from "./physicsThermodynamics";
import { electrostaticsContent } from "./electrostatics";
import { circuitsElectricityContent } from "./circuitsElectricity";
import { magnetismElectromagneticPhenomenaContent } from "./magnetismElectromagneticPhenomena";
import { wavesSoundLightOpticsContent } from "./wavesSoundLightOptics";

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
  "evolution-genetics-ecology": evolutionGeneticsEcologyContent,
  "atomic-structure-periodic-trends": atomicStructurePeriodicTrendsContent,
  "chemical-bonding-molecular-structure": chemicalBondingMolecularStructureContent,
  "stoichiometry-chemical-reactions": stoichiometryChemicalReactionsContent,
  "solutions-concentrations": solutionsConcentrationsContent,
  "gases-liquids-solids": gasesLiquidsSolidsContent,
  "thermochemistry-thermodynamics": thermochemistryThermodynamicsContent,
  "chemical-equilibrium": chemicalEquilibriumContent,
  "acids-bases-buffers": acidsBasesBuffersContent,
  "redox-electrochemistry": redoxElectrochemistryContent,
  "chemical-kinetics": chemicalKineticsContent,
  "organic-structure-functional-groups": organicStructureFunctionalGroupsContent,
  "isomers-stereochemistry": isomersStereochemistryContent,
  "organic-reactions": organicReactionsContent,
  "carbonyls-carboxylic-acids-derivatives": carbonylsCarboxylicAcidsDerivativesContent,
  "amines-amides-biological-molecules": aminesAmidesBiologicalMoleculesContent,
  "organic-chemistry-spectroscopy": organicChemistrySpectroscopyContent,
  "units-math-graphs": unitsMathGraphsContent,
  "kinematics-newtonian-mechanics": kinematicsNewtonianMechanicsContent,
  "work-energy-momentum": workEnergyMomentumContent,
  "fluids-pressure": fluidsPressureContent,
  "physics-thermodynamics": physicsThermodynamicsContent,
  "electrostatics": electrostaticsContent,
  "circuits-electricity": circuitsElectricityContent,
  "magnetism-electromagnetic-phenomena": magnetismElectromagneticPhenomenaContent,
  "waves-sound-light-optics": wavesSoundLightOpticsContent
};
