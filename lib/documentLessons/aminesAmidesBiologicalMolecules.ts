// Document-lesson content for "Amines, Amides & Biological Molecules"
// (lib/mcatPath.ts's amines-amides-biological-molecules LessonContent entry).
// See lib/documentLesson.ts for the shared shape.
import { DocumentLessonContent } from "../documentLesson";

export const aminesAmidesBiologicalMoleculesContent: DocumentLessonContent = {
  lessonIntro: {
    description: "Nitrogen-containing functional groups are the bridge between organic chemistry and biochemistry: amines make neurotransmitters and amino acids basic, and amide bonds hold every protein's backbone together. This lesson covers amine basicity, why amides are exceptionally weak bases and chemically stable, and how these groups connect directly to the biological molecules covered elsewhere in the MCAT.",
    objectives: [
      "Explain what makes amines basic and how substitution affects their basicity",
      "Explain why amides are far less basic than amines, and why the amide bond is planar",
      "Connect amine and amide chemistry to amino acids and the peptide bond",
      "Identify amine and amide functional groups within larger biological molecules"
    ]
  },
  bigPicture: {
    flow: ["Amine nitrogen lone pair available to accept H+", "Amine is basic", "In an amide, that lone pair delocalizes into the carbonyl by resonance", "Amide is a much weaker base, and the C-N bond is planar/rigid"],
    caption: "Amines and amides look similar—both have nitrogen bonded to carbon—but resonance with the carbonyl in an amide changes the nitrogen's behavior almost completely, which is the single idea this whole lesson builds from."
  },
  concepts: [
    {
      number: "01",
      id: "amine-basicity",
      title: "Amine Structure and Basicity",
      difficulty: "UNDERSTAND",
      coreIdea: "Amines are basic because nitrogen's lone pair is freely available to accept a proton; classified as primary, secondary, or tertiary by how many carbon groups are attached to nitrogen.",
      learn: [
        "An amine's nitrogen has a lone pair of electrons not involved in any resonance or delocalization, making it readily available to accept a proton (act as a Brønsted-Lowry base) or donate into a new bond (act as a nucleophile)—this is why amines are the most common basic and nucleophilic functional group in organic molecules.",
        "Amines are classified by substitution: primary (one carbon group on N), secondary (two), or tertiary (three)—alkyl groups are weakly electron-donating, which can modestly increase basicity, but steric hindrance and solvation effects also play a role, so basicity doesn't increase in a perfectly simple order with more substitution."
      ],
      mcatConnection: "The core idea to hold onto is simply 'amine nitrogen lone pair = available = basic'—that single fact explains why amines are protonated at physiological pH (relevant to drug absorption and neurotransmitter behavior) far more often than it requires memorizing precise basicity rankings.",
      quickCheck: {
        prompt: "Why are amines generally basic, while alcohols (also containing a lone-pair-bearing heteroatom, oxygen) are only very weakly basic by comparison?",
        options: ["Nitrogen is more electronegative than oxygen, making its lone pair more available", "Nitrogen is less electronegative than oxygen, so it holds its lone pair less tightly and donates it more readily to a proton", "Amines don't actually have a lone pair on nitrogen", "Alcohols have no lone pairs on oxygen at all"],
        correctIndex: 1,
        explanation: "Nitrogen is less electronegative than oxygen, so it holds its lone pair less tightly and is more willing to donate it to an incoming proton—oxygen's higher electronegativity makes its lone pairs less available, which is why alcohols are only very weakly basic in comparison."
      },
      keyTakeaway: "Amines are basic because nitrogen's freely available lone pair readily accepts a proton; they're classified as primary, secondary, or tertiary based on the number of attached carbon groups."
    },
    {
      number: "02",
      id: "amide-resonance-stability",
      title: "Amide Resonance and the Peptide Bond",
      difficulty: "REASON",
      coreIdea: "In an amide, nitrogen's lone pair delocalizes by resonance into the adjacent carbonyl, making amides far less basic than amines and giving the C-N bond significant double-bond character and planarity.",
      learn: [
        "Unlike a free amine, an amide's nitrogen lone pair is stabilized by resonance delocalization into the carbonyl's pi system—this resonance donation makes that lone pair much less available to accept a proton, which is why amides are only very weakly basic (essentially neutral) compared to amines.",
        "That same resonance delocalization gives the C-N bond partial double-bond character, restricting rotation around it and forcing the amide group (and its immediately attached atoms) to be planar—this is the direct chemical reason the peptide bond in proteins is rigid and planar, a fact used throughout protein structure and secondary structure (alpha helices, beta sheets) discussions."
      ],
      mcatConnection: "This lesson's biggest cross-topic payoff is realizing that 'why is the peptide bond planar' (a biochemistry/protein structure question) and 'why are amides weakly basic' (an organic chemistry question) are the exact same underlying fact—amide resonance—tested from two different angles.",
      quickCheck: {
        prompt: "Why is rotation around the C-N bond in an amide (including the peptide bond in proteins) much more restricted than rotation around a typical C-N single bond in an amine?",
        options: ["The amide C-N bond has significant double-bond character from resonance delocalization of nitrogen's lone pair into the carbonyl", "Amide nitrogen is sp3 hybridized, unlike amine nitrogen", "There is no actual restriction on amide bond rotation", "The oxygen atom physically blocks rotation"],
        correctIndex: 0,
        explanation: "Resonance donation of the nitrogen lone pair into the carbonyl pi system gives the C-N bond partial double-bond character, and double bonds resist rotation (since rotating would break the pi-orbital overlap)—this is the same resonance effect that also explains why amides are weak bases, not a separate, unrelated phenomenon."
      },
      keyTakeaway: "Amide resonance delocalizes nitrogen's lone pair into the carbonyl, making amides far less basic than amines and giving the C-N bond partial double-bond character, which restricts rotation and makes the amide (and peptide) bond planar."
    },
    {
      number: "03",
      id: "connecting-to-biological-molecules",
      title: "Connecting to Biological Molecules",
      difficulty: "IDENTIFY",
      coreIdea: "Amine and amide chemistry directly explains key biological structures: amino acids' side chains and backbone amine, the amide (peptide) bond linking amino acids into proteins, and basic side chains that are protonated at physiological pH.",
      learn: [
        "Every amino acid contains a basic amine group (the N-terminus, or basic side chains like lysine's or arginine's), which behaves according to the same basicity rules covered here—these groups are typically protonated (positively charged) at physiological pH, which is central to protein folding, charge distribution, and enzyme active site chemistry.",
        "The peptide bond connecting amino acids into a protein chain is chemically an amide bond, formed by a condensation reaction between one amino acid's carboxylic acid and the next amino acid's amine—its resonance-driven planarity and rigidity (from the previous concept) is exactly what constrains the protein backbone's possible shapes, underlying the Ramachandran-style geometric restrictions on secondary structure."
      ],
      mcatConnection: "Organic chemistry passages on amines/amides and biochemistry passages on protein structure are often testing the identical underlying concept from different directions—recognizing the peptide bond as 'just an amide bond' lets you transfer everything you know about amide reactivity and planarity directly into protein structure questions.",
      quickCheck: {
        prompt: "The bond linking two amino acids together in a protein chain (the peptide bond) is best described, in terms of organic functional groups, as which of the following?",
        options: ["An ester bond", "An amide bond, formed between a carboxylic acid and an amine", "An amine bond only, with no carbonyl involved", "An ether bond"],
        correctIndex: 1,
        explanation: "The peptide bond forms when one amino acid's carboxylic acid group condenses with the next amino acid's amine group, releasing water and forming a carbonyl bonded to nitrogen—that carbonyl-nitrogen linkage is, by definition, an amide bond, carrying all the resonance and planarity properties of amides generally."
      },
      keyTakeaway: "Amino acids' basic amine groups follow standard amine basicity rules, and the peptide bond linking amino acids together is chemically an amide bond, inheriting the planarity and rigidity that amide resonance produces."
    }
  ]
};
