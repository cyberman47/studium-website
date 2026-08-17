// Document-lesson content for "Isomers & Stereochemistry"
// (lib/mcatPath.ts's isomers-stereochemistry LessonContent entry).
// See lib/documentLesson.ts for the shared shape.
import { DocumentLessonContent } from "../documentLesson";

export const isomersStereochemistryContent: DocumentLessonContent = {
  lessonIntro: {
    description: "Two molecules can share an identical molecular formula and yet behave completely differently—stereochemistry is the study of exactly how and why. This lesson covers the difference between structural and stereoisomers, how chirality and R/S configuration describe 3D arrangement around a carbon, and how diastereomers and meso compounds extend those ideas to molecules with multiple stereocenters.",
    objectives: [
      "Distinguish structural (constitutional) isomers from stereoisomers",
      "Identify chiral centers and assign R/S configuration using CIP priority rules",
      "Distinguish enantiomers from diastereomers, including cis/trans (E/Z) isomers",
      "Identify meso compounds and explain their lack of optical activity"
    ]
  },
  bigPicture: {
    flow: ["Same molecular formula", "Structural isomers (different connectivity) or stereoisomers (same connectivity, different 3D arrangement)", "Stereoisomers split into enantiomers (mirror images) and diastereomers (not mirror images)"],
    caption: "Isomers are a branching tree of 'same formula, different molecule'—the first branch is whether the atoms are connected differently at all, and only if they're connected identically do you get into the 3D arrangement questions stereochemistry is built around."
  },
  concepts: [
    {
      number: "01",
      id: "structural-vs-stereoisomers",
      title: "Structural Isomers vs. Stereoisomers",
      difficulty: "UNDERSTAND",
      coreIdea: "Structural (constitutional) isomers share a molecular formula but differ in atom connectivity; stereoisomers share both formula and connectivity but differ in 3D spatial arrangement.",
      learn: [
        "Structural isomers have the same molecular formula but their atoms are bonded together in a genuinely different order—different functional groups, different carbon skeletons, or the same functional group in a different position all count as structural isomerism.",
        "Stereoisomers have identical connectivity (the same atoms bonded to the same atoms) but differ in how those atoms are arranged in three-dimensional space—this is a fundamentally different, subtler kind of isomerism that requires thinking in 3D rather than just tracing bonds."
      ],
      mcatConnection: "The first question to ask when comparing two structures is always connectivity: if the bonds are arranged differently, it's a structural isomer (often with different physical/chemical properties); only if the connectivity is identical do you move on to stereochemistry.",
      quickCheck: {
        prompt: "1-propanol (CH3CH2CH2OH) and 2-propanol (CH3CH(OH)CH3) have the same molecular formula, C3H8O, but the -OH group is attached to a different carbon in each. What type of isomers are these?",
        options: ["Enantiomers", "Diastereomers", "Structural (constitutional) isomers", "They are not isomers at all"],
        correctIndex: 2,
        explanation: "The -OH group is bonded to a different carbon in each molecule, meaning the atoms have genuinely different connectivity—that's the definition of structural isomerism, not stereoisomerism (which requires identical connectivity)."
      },
      keyTakeaway: "Structural isomers differ in atom connectivity; stereoisomers share identical connectivity but differ in 3D spatial arrangement—connectivity is always the first thing to check."
    },
    {
      number: "02",
      id: "chirality-rs-configuration",
      title: "Chirality and R/S Configuration",
      difficulty: "REASON",
      coreIdea: "A chiral center (typically a carbon bonded to four different groups) creates non-superimposable mirror-image molecules called enantiomers, assigned R or S configuration using CIP priority rules.",
      learn: [
        "A carbon is a chiral (stereo) center when it's bonded to four different groups; such a molecule is non-superimposable on its mirror image, and the two mirror-image forms are called enantiomers—identical in most physical properties but rotating plane-polarized light in opposite directions.",
        "R/S configuration is assigned using CIP (Cahn-Ingold-Prelog) priority rules: rank the four groups by atomic number at the first point of difference (higher atomic number = higher priority), orient the lowest-priority group away from you, and trace 1→2→3 priority—clockwise is R (rectus), counterclockwise is S (sinister)."
      ],
      mcatConnection: "You're rarely asked to fully assign R/S from a 3D drawing under time pressure—more often the exam tests the concept (enantiomers have identical physical properties except optical rotation and interaction with other chiral molecules, like enzymes) rather than the mechanical assignment itself.",
      quickCheck: {
        prompt: "Two enantiomers of the same drug are otherwise chemically identical. Why might they have dramatically different biological effects in the body?",
        options: ["Enantiomers actually have different molecular formulas", "Enzymes and receptors are themselves chiral, so they can interact very differently with each enantiomer, like a hand fitting only one of two mirror-image gloves", "Enantiomers have different boiling points, which affects absorption", "There is no possible difference; enantiomers always behave identically in biological systems"],
        correctIndex: 1,
        explanation: "Because biological receptors and enzymes are themselves chiral molecules, they can bind one enantiomer much more effectively than its mirror image—a classic analogy is that a right hand fits comfortably only into a right-handed glove, not its mirror-image left-handed glove, even though the two gloves are otherwise identical."
      },
      keyTakeaway: "A chiral center (carbon with four different groups) produces enantiomers—non-superimposable mirror images assigned R or S by CIP priority rules—which share physical properties but can interact very differently with other chiral molecules like enzymes."
    },
    {
      number: "03",
      id: "diastereomers-meso-compounds",
      title: "Diastereomers and Meso Compounds",
      difficulty: "IDENTIFY",
      coreIdea: "Diastereomers are stereoisomers that are not mirror images of each other (including cis/trans isomers); a meso compound has multiple stereocenters but is achiral overall due to an internal plane of symmetry.",
      learn: [
        "When a molecule has two or more stereocenters, not every stereoisomer pair is an enantiomer—diastereomers are stereoisomers that differ at only some (not all) stereocenters, and are not mirror images; cis/trans (or E/Z) isomers around a double bond or ring are a specific type of diastereomer.",
        "A meso compound has two or more stereocenters but is achiral (optically inactive) because it contains an internal mirror plane that makes one half of the molecule the mirror image of the other half—the molecule is, overall, superimposable on its own mirror image, despite containing individual chiral centers."
      ],
      mcatConnection: "Meso compounds are a favorite exam trap: seeing multiple stereocenters might tempt you to assume optical activity, but if there's an internal symmetry plane, the compound is achiral overall—always check for that internal mirror plane before concluding a multi-stereocenter molecule is optically active.",
      quickCheck: {
        prompt: "Tartaric acid has two stereocenters. One stereoisomer of it is optically inactive despite having two stereocenters, because the molecule has an internal mirror plane making one half the mirror image of the other. What is this type of compound called?",
        options: ["An enantiomer", "A diastereomer", "A meso compound", "A structural isomer"],
        correctIndex: 2,
        explanation: "A compound with multiple stereocenters that is nonetheless achiral (optically inactive) due to an internal plane of symmetry is, by definition, a meso compound—it's a special case where the molecule is actually superimposable on its own mirror image."
      },
      keyTakeaway: "Diastereomers are stereoisomers that aren't mirror images (including cis/trans isomers); a meso compound has multiple stereocenters but is achiral overall due to an internal mirror plane of symmetry."
    }
  ]
};
