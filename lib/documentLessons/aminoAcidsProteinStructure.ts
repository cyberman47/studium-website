// Document-lesson content for "Amino Acids & Protein Structure"
// (lib/mcatPath.ts's amino-acids-protein-structure LessonContent entry)—
// restructured from that same real entry. See lib/documentLesson.ts for the
// shared shape.
import { DocumentLessonContent } from "../documentLesson";

export const aminoAcidsProteinStructureContent: DocumentLessonContent = {
  lessonIntro: {
    description: "Every protein in the body—enzymes, antibodies, structural fibers—is built from the same 20 amino acid building blocks, folded in increasingly complex layers. This lesson covers what makes each amino acid unique, how they link into chains, and the four levels of structure that turn a chain into a working protein.",
    objectives: [
      "Identify the parts of an amino acid and what the R group determines",
      "Explain how a peptide bond forms and what primary structure means",
      "Distinguish secondary, tertiary, and quaternary structure",
      "Explain what stabilizes each level of protein structure"
    ]
  },
  bigPicture: {
    flow: ["Primary (sequence)", "Secondary (local folds)", "Tertiary (3D shape)", "Quaternary (subunits)"],
    caption: "Protein structure builds in layers—each level is a more complex fold on top of the one before it, from a flat sequence to a fully assembled, multi-subunit machine."
  },
  concepts: [
    {
      number: "01",
      id: "amino-acid-structure",
      title: "Amino Acid Structure and Classification",
      difficulty: "UNDERSTAND",
      coreIdea: "All 20 amino acids share the same core structure; only the R group (side chain) differs, determining each one's chemical identity.",
      learn: [
        "Every amino acid shares the same core: a central (alpha) carbon bonded to an amino group, a carboxyl group, a hydrogen, and a variable side chain (R group) that gives each of the 20 amino acids its distinct identity.",
        "R groups fall into broad categories—nonpolar/hydrophobic, polar/uncharged, acidic (negatively charged), and basic (positively charged)—and that category largely determines where an amino acid ends up in a folded protein and how it behaves chemically."
      ],
      mcatConnection: "Knowing an amino acid's R-group category (without memorizing all 20 structures) is usually enough—passages typically tell you which category matters, and expect you to reason about hydrophobic clustering or charge interactions from there.",
      quickCheck: {
        prompt: "What determines the difference between the 20 amino acids?",
        options: ["The alpha carbon", "The R group (side chain)", "The carboxyl group", "The amino group"],
        correctIndex: 1,
        explanation: "The R group (side chain) is the only variable part—the alpha carbon, carboxyl group, and amino group are identical across all 20 amino acids."
      },
      keyTakeaway: "All amino acids share an alpha carbon, amino group, and carboxyl group—only the R group varies, and its category (nonpolar, polar, acidic, basic) determines behavior."
    },
    {
      number: "02",
      id: "peptide-bonds-primary-structure",
      title: "Peptide Bonds and Primary Structure",
      difficulty: "IDENTIFY",
      coreIdea: "A peptide bond forms via dehydration between amino acids; primary structure is simply the resulting linear sequence, read N-to-C.",
      learn: [
        "A peptide bond forms between the carboxyl group of one amino acid and the amino group of the next, through a condensation (dehydration) reaction that releases a water molecule.",
        "A chain of amino acids linked this way is a polypeptide, always synthesized and read from its N-terminus (free amino group end) to its C-terminus (free carboxyl group end). The primary structure of a protein is simply this specific linear sequence of amino acids."
      ],
      mcatConnection: "Peptide bond formation (dehydration, releasing water) versus breakdown (hydrolysis, consuming water) is a reliable pair of opposite-direction questions—know which reaction is which, since they're tested as a matched set.",
      quickCheck: {
        prompt: "What type of reaction forms a peptide bond between two amino acids?",
        options: ["Hydrolysis", "Dehydration (condensation) reaction", "Oxidation", "Phosphorylation"],
        correctIndex: 1,
        explanation: "A dehydration reaction releases water and forms the peptide bond—hydrolysis is the reverse reaction that breaks peptide bonds using water, not the reaction that forms them."
      },
      keyTakeaway: "Peptide bonds form via dehydration reactions, linking amino acids N-to-C into a polypeptide—primary structure is just that resulting sequence."
    },
    {
      number: "03",
      id: "secondary-tertiary-quaternary",
      title: "Secondary, Tertiary, and Quaternary Structure",
      difficulty: "REASON",
      coreIdea: "Secondary structure is backbone hydrogen bonding, tertiary is overall shape from R-group interactions, and quaternary is multiple subunits assembled together.",
      learn: [
        "Secondary structure describes local folding patterns—alpha helices and beta sheets—held together by hydrogen bonds between atoms in the polypeptide backbone. Tertiary structure is the overall three-dimensional shape of a single polypeptide, stabilized by interactions between R groups: hydrophobic interactions, hydrogen bonds, ionic bonds, and covalent disulfide bridges between cysteine residues.",
        "Quaternary structure applies only to proteins made of more than one polypeptide chain (subunit), describing how those subunits assemble together—hemoglobin's four subunits are a classic example."
      ],
      mcatConnection: "Denaturation questions test this hierarchy directly: heat or extreme pH disrupts secondary/tertiary/quaternary structure (the noncovalent and disulfide interactions) while leaving primary structure (peptide bonds) completely intact—a frequently tested distinction.",
      quickCheck: {
        prompt: "A protein is heated, disrupting its hydrogen bonds and disulfide bridges but not its peptide bonds. What has occurred?",
        options: ["The primary structure is destroyed", "The protein is denatured, losing higher-order structure but not primary structure", "The amino acid sequence is altered", "A new protein is synthesized"],
        correctIndex: 1,
        explanation: "Denaturation disrupts secondary, tertiary, and quaternary structure while leaving the primary sequence (peptide bonds) intact—the amino acid sequence itself doesn't change, and no new synthesis occurs."
      },
      keyTakeaway: "Secondary structure is backbone H-bonding (helices/sheets); tertiary structure is a single chain's overall shape from R-group interactions; quaternary structure is multiple subunits assembled together."
    }
  ]
};
