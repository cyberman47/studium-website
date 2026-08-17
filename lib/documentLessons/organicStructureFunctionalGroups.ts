// Document-lesson content for "Organic Structure & Functional Groups"
// (lib/mcatPath.ts's organic-structure-functional-groups LessonContent entry).
// See lib/documentLesson.ts for the shared shape.
import { DocumentLessonContent } from "../documentLesson";

export const organicStructureFunctionalGroupsContent: DocumentLessonContent = {
  lessonIntro: {
    description: "Organic chemistry can feel like an enormous number of reactions to memorize, but nearly all of it is organized around functional groups—the reactive part of a molecule that determines how it behaves. This lesson covers recognizing the major functional groups, basic IUPAC nomenclature, and the shorthand structural representations organic chemists use instead of drawing every atom.",
    objectives: [
      "Identify the major functional groups by structure: alcohols, ethers, aldehydes, ketones, carboxylic acids, esters, amines, and amides",
      "Apply basic IUPAC nomenclature rules to name simple organic molecules",
      "Read and draw skeletal (line) structures and condensed formulas",
      "Calculate degrees of unsaturation from a molecular formula"
    ]
  },
  bigPicture: {
    flow: ["Carbon skeleton (backbone)", "Functional group attached", "Functional group determines reactivity", "Reactivity determines the molecule's chemistry"],
    caption: "The carbon backbone is mostly just scaffolding—it's the functional group sitting on it that does almost all the chemistry, which is why organic chemistry is organized by functional group rather than by molecule."
  },
  concepts: [
    {
      number: "01",
      id: "functional-groups",
      title: "Recognizing Functional Groups",
      difficulty: "UNDERSTAND",
      coreIdea: "A functional group is a specific arrangement of atoms (like -OH, -COOH, or C=O) that gives a molecule characteristic reactivity, largely independent of the rest of the carbon skeleton it's attached to.",
      learn: [
        "Oxygen-containing functional groups form a reactivity ladder: alcohols (-OH) and ethers (C-O-C) are the least reactive; aldehydes (terminal C=O with an H) and ketones (internal C=O) are more reactive at the carbonyl carbon; carboxylic acids (-COOH) and their derivatives (esters, amides) are the most oxidized and reactive.",
        "Nitrogen-containing functional groups include amines (basic, -NH2/-NHR/-NR2) and amides (a carbonyl bonded to nitrogen, much less basic than amines due to resonance delocalization of the nitrogen lone pair into the carbonyl)."
      ],
      mcatConnection: "Being able to spot a functional group at a glance, in a skeletal structure buried in a long passage, is the single most time-saving organic chemistry skill on the exam—reactions and spectroscopy questions all start from correctly identifying what group you're looking at.",
      quickCheck: {
        prompt: "A molecule contains a carbon double-bonded to an oxygen (C=O), where that carbon is also bonded to a hydrogen and to the rest of the carbon chain. What functional group is this?",
        options: ["Ketone", "Aldehyde", "Carboxylic acid", "Ester"],
        correctIndex: 1,
        explanation: "A carbonyl carbon bonded to a hydrogen (making it a terminal, end-of-chain group) defines an aldehyde—a ketone's carbonyl carbon is bonded to two other carbons (no H), and carboxylic acids/esters require an additional oxygen bonded to the carbonyl carbon."
      },
      keyTakeaway: "Functional groups determine a molecule's chemical behavior; oxygen-containing groups range from alcohols (least reactive) through aldehydes/ketones to carboxylic acids and derivatives (most reactive), while amines (basic) and amides (weakly basic due to resonance) are the key nitrogen-containing groups."
    },
    {
      number: "02",
      id: "iupac-nomenclature",
      title: "IUPAC Nomenclature Basics",
      difficulty: "IDENTIFY",
      coreIdea: "IUPAC names identify the longest carbon chain (the parent), number it to give substituents the lowest possible locants, and use suffixes that indicate the highest-priority functional group present.",
      learn: [
        "Naming starts by finding the longest continuous carbon chain containing the highest-priority functional group, using the root that matches its carbon count (meth-, eth-, prop-, but-, pent-, etc.), then numbering the chain from whichever end gives the lowest locant numbers to substituents and the principal functional group.",
        "The suffix indicates the highest-priority functional group present (-oic acid for carboxylic acids, -al for aldehydes, -one for ketones, -ol for alcohols, -amine for amines), while lower-priority groups are named as substituent prefixes (like hydroxy- or oxo-) when a higher-priority group is also present."
      ],
      mcatConnection: "You won't be asked to name complex molecules from scratch, but recognizing a name's suffix (like -oic acid vs. -one) tells you the functional group instantly—useful for quickly parsing a passage's chemical names without having to draw out the structure first.",
      quickCheck: {
        prompt: "A molecule is named 'pentan-2-one.' What does this name tell you about its structure?",
        options: ["A 5-carbon chain with an alcohol at carbon 2", "A 5-carbon chain with a ketone (carbonyl) at carbon 2", "A 2-carbon chain with 5 substituents", "A 5-carbon chain that is a carboxylic acid"],
        correctIndex: 1,
        explanation: "The root 'pentan-' indicates a 5-carbon chain, and the suffix '-one' indicates a ketone; the '2' locant places the carbonyl carbon at position 2 in the chain—'-ol' would indicate an alcohol, and '-oic acid' would indicate a carboxylic acid, neither of which matches this name."
      },
      keyTakeaway: "IUPAC names identify the longest chain containing the highest-priority functional group, number it for lowest locants, and use a suffix (-ol, -al, -one, -oic acid, -amine, etc.) that identifies that functional group."
    },
    {
      number: "03",
      id: "structural-representations",
      title: "Structural Representations and Degrees of Unsaturation",
      difficulty: "REASON",
      coreIdea: "Skeletal (line) structures represent carbon chains as line vertices with implied hydrogens, and degrees of unsaturation, calculated from a molecular formula, count the total number of rings and pi bonds in a molecule.",
      learn: [
        "In a skeletal structure, each line endpoint or vertex represents a carbon atom, and hydrogens are not drawn explicitly but assumed to fill each carbon's remaining bonds up to four total bonds—only atoms other than carbon and their attached hydrogens are written out explicitly.",
        "Degrees of unsaturation (DoU) = (2C + 2 + N - H) / 2 (for a molecule with C carbons, H hydrogens, and N nitrogens; halogens count like hydrogens, and oxygen/sulfur don't affect the count) gives the total number of rings plus pi bonds (each double bond or ring = 1 degree, each triple bond = 2 degrees)."
      ],
      mcatConnection: "Degrees of unsaturation is a fast way to check whether a proposed structure is even possible for a given molecular formula—if a molecular formula gives 4 degrees of unsaturation, you should expect to see 4 total rings/double bonds/triple-bond-equivalents somewhere in the structure, which is a great sanity check for spectroscopy problems too.",
      quickCheck: {
        prompt: "A compound has the molecular formula C6H12. How many degrees of unsaturation does it have, and what does that indicate?",
        options: ["0 degrees; the molecule is fully saturated with no rings or pi bonds", "1 degree; the molecule contains exactly one ring or one double bond", "2 degrees; the molecule contains two rings or double bonds", "It cannot be determined without more structural information"],
        correctIndex: 1,
        explanation: "DoU = (2×6 + 2 - 12) / 2 = (12 + 2 - 12) / 2 = 2/2 = 1, meaning the molecule contains exactly one ring or one double bond (for example, cyclohexane has one ring, and 1-hexene has one double bond—both fit C6H12)."
      },
      keyTakeaway: "Skeletal structures show carbons as line vertices with implied hydrogens; degrees of unsaturation, calculated from the molecular formula, count the total rings and pi bonds a structure must contain."
    }
  ]
};
