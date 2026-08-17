// Document-lesson content for "Chemical Bonding & Molecular Structure"
// (lib/mcatPath.ts's chemical-bonding-molecular-structure LessonContent entry).
// See lib/documentLesson.ts for the shared shape.
import { DocumentLessonContent } from "../documentLesson";

export const chemicalBondingMolecularStructureContent: DocumentLessonContent = {
  lessonIntro: {
    description: "Once you know how electrons are arranged in an atom, the next question is what happens when atoms meet. This lesson covers ionic vs. covalent bonding, how to draw Lewis structures and predict 3D molecular geometry with VSEPR, and how hybridization explains the sigma and pi bonds that hold molecules together.",
    objectives: [
      "Distinguish ionic, polar covalent, and nonpolar covalent bonds by electronegativity difference",
      "Draw Lewis structures, including resonance structures and formal charge",
      "Predict molecular geometry and polarity using VSEPR theory",
      "Connect hybridization (sp, sp2, sp3) to sigma and pi bond formation"
    ]
  },
  bigPicture: {
    flow: ["Electronegativity difference", "Bond type (ionic/covalent)", "Lewis structure", "VSEPR geometry", "Molecular polarity"],
    caption: "Bonding is a chain of predictions: the electronegativity difference between two atoms sets the bond type, which sets the Lewis structure, which sets the 3D shape, which sets whether the whole molecule is polar."
  },
  concepts: [
    {
      number: "01",
      id: "ionic-covalent-bonding",
      title: "Ionic vs. Covalent Bonding",
      difficulty: "UNDERSTAND",
      coreIdea: "Large electronegativity differences (roughly >1.7) favor ionic bonds (electron transfer); smaller differences favor covalent bonds (electron sharing), which are further split into polar and nonpolar.",
      learn: [
        "Ionic bonds form when one atom is electronegative enough to pull an electron away from another entirely, creating oppositely charged ions held together by electrostatic attraction—typical of a metal bonding with a nonmetal.",
        "Covalent bonds form when atoms share electrons instead of transferring them; if the atoms have similar electronegativity the sharing is roughly equal (nonpolar covalent), and if one atom is modestly more electronegative the shared electrons sit closer to it, creating a bond dipole (polar covalent)."
      ],
      mcatConnection: "Electronegativity difference is the single fastest way to classify a bond on the exam—no need to memorize which specific compounds are ionic vs. covalent if you can reason from the periodic trend you already know.",
      quickCheck: {
        prompt: "A bond forms between an atom with low electronegativity and one with very high electronegativity. What type of bond is most likely to result?",
        options: ["Nonpolar covalent", "Polar covalent", "Ionic", "No bond will form"],
        correctIndex: 2,
        explanation: "A large electronegativity difference favors essentially complete electron transfer rather than sharing, which is the definition of an ionic bond—nonpolar covalent requires very similar electronegativities, and polar covalent requires a smaller, intermediate difference."
      },
      keyTakeaway: "Electronegativity difference predicts bond type: large differences give ionic bonds (electron transfer), small differences give covalent bonds (electron sharing, polar or nonpolar)."
    },
    {
      number: "02",
      id: "lewis-structures-vsepr",
      title: "Lewis Structures and VSEPR",
      difficulty: "IDENTIFY",
      coreIdea: "Lewis structures show how valence electrons are distributed as bonds and lone pairs; VSEPR theory predicts 3D molecular geometry by minimizing repulsion between electron groups around the central atom.",
      learn: [
        "Drawing a Lewis structure means arranging all valence electrons as bonding pairs and lone pairs so each atom (usually) achieves an octet; formal charge helps choose the best structure among multiple valid options, and resonance structures apply when electrons can be delocalized across more than one valid arrangement.",
        "VSEPR (Valence Shell Electron Pair Repulsion) theory starts from the Lewis structure's electron groups around the central atom and arranges them to minimize repulsion—two groups give linear geometry, three give trigonal planar, four give tetrahedral, and lone pairs compress bond angles more than bonding pairs do."
      ],
      mcatConnection: "The exam frequently gives you a molecular formula and expects you to reason out geometry and polarity from scratch—practice going Lewis structure → electron groups → VSEPR shape → polarity as one continuous chain rather than memorizing shapes in isolation.",
      quickCheck: {
        prompt: "Ammonia (NH3) has three bonding pairs and one lone pair around nitrogen. Why is its molecular geometry trigonal pyramidal rather than the tetrahedral arrangement its four electron groups would suggest?",
        options: ["Molecular geometry only counts the electron groups, not the atoms, so it's still tetrahedral", "The lone pair still occupies one of the four tetrahedral positions, but molecular geometry describes only the positions of the atoms, not the lone pair", "Lone pairs don't count as electron groups at all", "Nitrogen doesn't obey VSEPR theory"],
        correctIndex: 1,
        explanation: "The electron-group (or 'electronic') geometry is tetrahedral, but molecular geometry describes where the atoms are—since one of the four positions is occupied by a lone pair rather than an atom, the visible shape traced by the three N-H bonds is trigonal pyramidal."
      },
      keyTakeaway: "Lewis structures show electron distribution (bonds and lone pairs); VSEPR uses the count of electron groups around the central atom to predict 3D geometry, with lone pairs counted for shape but not shown as atoms in the final molecular shape."
    },
    {
      number: "03",
      id: "hybridization-bonds",
      title: "Hybridization and Sigma/Pi Bonds",
      difficulty: "REASON",
      coreIdea: "Hybridization (sp, sp2, sp3) describes mixed orbitals used for sigma bonding and lone pairs; every single bond is one sigma bond, and double/triple bonds add one or two pi bonds from unhybridized p orbitals.",
      learn: [
        "A central atom's hybridization state matches its number of electron groups: two groups → sp (linear), three groups → sp2 (trigonal planar), four groups → sp3 (tetrahedral)—these hybrid orbitals form sigma bonds (head-on overlap, free rotation) and hold lone pairs.",
        "Any bond beyond the first between two atoms is a pi bond, formed by sideways overlap of unhybridized p orbitals; a double bond is one sigma plus one pi bond, and a triple bond is one sigma plus two pi bonds—pi bonds prevent free rotation around that bond axis, which is why double bonds create fixed cis/trans geometry."
      ],
      mcatConnection: "Recognizing that pi bonds block rotation (but sigma bonds alone allow it) explains cis/trans isomerism in alkenes and the planarity of the peptide bond—both are recurring MCAT topics in organic chemistry and biochemistry passages.",
      quickCheck: {
        prompt: "Ethylene (H2C=CH2) has a carbon-carbon double bond. Why can't the two CH2 groups rotate freely around that double bond the way they could around a single bond?",
        options: ["Double bonds are shorter and therefore too rigid to rotate", "The pi bond's sideways p-orbital overlap would be broken by rotation", "Sp2 carbons cannot rotate under any circumstances", "Double bonds contain two sigma bonds, which lock rotation"],
        correctIndex: 1,
        explanation: "Rotating around the double bond would misalign the p orbitals forming the pi bond, breaking that sideways overlap—a double bond is one sigma bond (free rotation on its own) plus one pi bond (which is what actually restricts rotation), not two sigma bonds."
      },
      keyTakeaway: "Hybridization (sp/sp2/sp3) matches electron-group count and forms sigma bonds; extra bonds in double/triple bonds are pi bonds from unhybridized p orbitals, which restrict rotation around that bond."
    }
  ]
};
