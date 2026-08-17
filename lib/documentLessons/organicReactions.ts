// Document-lesson content for "Organic Reactions"
// (lib/mcatPath.ts's organic-reactions LessonContent entry).
// See lib/documentLesson.ts for the shared shape.
import { DocumentLessonContent } from "../documentLesson";

export const organicReactionsContent: DocumentLessonContent = {
  lessonIntro: {
    description: "Three reaction families—substitution, elimination, and addition—cover the large majority of organic mechanisms tested on the MCAT. This lesson covers how SN1 and SN2 substitution differ, how E1 and E2 elimination compete with substitution, and how electrophilic addition to alkenes follows Markovnikov's rule.",
    objectives: [
      "Compare SN1 and SN2 mechanisms, including their stereochemistry and rate dependence",
      "Compare E1 and E2 elimination mechanisms and predict the major product using Zaitsev's rule",
      "Identify the factors (substrate, nucleophile/base, solvent, leaving group) that favor substitution vs. elimination",
      "Apply Markovnikov's rule to predict the product of electrophilic addition to alkenes"
    ]
  },
  bigPicture: {
    flow: ["Nucleophile/base + substrate with a leaving group", "Compete: substitution (SN1/SN2) vs. elimination (E1/E2)", "Substrate structure, nucleophile strength, and solvent decide which wins"],
    caption: "Substitution and elimination are constantly competing for the same starting materials—predicting organic reaction outcomes is really about predicting which of the two wins under a given set of conditions."
  },
  concepts: [
    {
      number: "01",
      id: "sn1-sn2-substitution",
      title: "SN1 and SN2 Substitution",
      difficulty: "REASON",
      coreIdea: "SN2 is a single concerted step (backside attack, inversion of stereochemistry, favored by unhindered substrates and strong nucleophiles); SN1 proceeds through a carbocation intermediate (racemization, favored by stabilized carbocations and polar protic solvents).",
      learn: [
        "SN2 reactions happen in one concerted step: the nucleophile attacks the carbon from the side opposite the leaving group as it departs, inverting the stereochemistry at that carbon (like an umbrella flipping inside out)—SN2 is favored by unhindered (methyl/primary) substrates, strong nucleophiles, and polar aprotic solvents, and its rate depends on both nucleophile and substrate concentration.",
        "SN1 reactions happen in two steps: the leaving group departs first, forming a planar carbocation intermediate, which the nucleophile then attacks from either face—this gives a racemic mixture (loss of stereochemical information) and is favored by stabilized (tertiary) carbocations, weak nucleophiles, and polar protic solvents; its rate depends only on substrate concentration, since carbocation formation is the slow step."
      ],
      mcatConnection: "The most reliable way to predict SN1 vs. SN2 is substrate structure first: tertiary substrates can't undergo SN2 (too sterically hindered for backside attack) and strongly favor SN1 (stable tertiary carbocation); primary substrates can't stabilize a carbocation and strongly favor SN2 instead.",
      flowDiagram: ["Leaving group departs", "Carbocation intermediate forms (planar)", "Nucleophile attacks from either face", "Racemic mixture of products (SN1)"],
      quickCheck: {
        prompt: "A tertiary alkyl halide is reacted with a weak nucleophile in a polar protic solvent. Which mechanism is most likely, and what stereochemical outcome is expected?",
        options: ["SN2, with inversion of configuration", "SN1, with racemization", "SN2, with retention of configuration", "Neither mechanism can occur with a tertiary substrate"],
        correctIndex: 1,
        explanation: "A tertiary substrate is too sterically hindered for SN2's backside attack but readily forms a stable tertiary carbocation, and the weak nucleophile and polar protic solvent both favor SN1—this proceeds through a planar carbocation intermediate that can be attacked from either face, producing a racemic (not purely inverted) mixture."
      },
      keyTakeaway: "SN2 is a concerted, one-step mechanism causing stereochemical inversion, favored by unhindered substrates and strong nucleophiles; SN1 proceeds through a carbocation intermediate causing racemization, favored by stabilized (tertiary) substrates, weak nucleophiles, and polar protic solvents."
    },
    {
      number: "02",
      id: "e1-e2-elimination",
      title: "E1 and E2 Elimination",
      difficulty: "REASON",
      coreIdea: "Elimination reactions form an alkene by removing a leaving group and a beta-hydrogen; Zaitsev's rule predicts the more substituted (more stable) alkene as the major product, and E1/E2 compete directly with SN1/SN2 under similar conditions.",
      learn: [
        "E2 is a concerted, one-step elimination requiring a strong, bulky base and anti-periplanar geometry between the leaving group and the beta-hydrogen being removed; E1 proceeds through the same carbocation intermediate as SN1, followed by loss of a beta-hydrogen to form the alkene, and so shares SN1's substrate and solvent preferences.",
        "Zaitsev's rule predicts that the major elimination product is usually the more substituted (more stable) alkene, since more substituted alkenes are stabilized by more alkyl groups donating electron density into the pi system—though a bulky base can favor the less-substituted alkene instead (Hofmann product) by preferentially removing a more accessible hydrogen."
      ],
      mcatConnection: "Substitution and elimination are governed by the same underlying substrate/nucleophile factors, so the real skill is predicting which one wins: strong, bulky bases favor elimination (especially E2) over substitution, while strong small nucleophiles favor SN2.",
      quickCheck: {
        prompt: "According to Zaitsev's rule, when an elimination reaction can form two different alkenes, which is typically the major product?",
        options: ["The less substituted alkene, because it is less sterically hindered", "The more substituted alkene, because additional alkyl substitution stabilizes the double bond", "Whichever alkene forms fastest, regardless of stability", "Both alkenes form in exactly equal amounts"],
        correctIndex: 1,
        explanation: "Zaitsev's rule favors the more thermodynamically stable alkene as the major product, and alkyl substitution stabilizes a double bond by hyperconjugation and induction—more substituted alkenes are more stable, and therefore the major product, unless a bulky base specifically favors the less hindered (Hofmann) alkene instead."
      },
      keyTakeaway: "E2 is concerted and requires anti-periplanar geometry with a strong base; E1 goes through the same carbocation intermediate as SN1; Zaitsev's rule predicts the more substituted alkene as the major elimination product."
    },
    {
      number: "03",
      id: "addition-reactions-alkenes",
      title: "Addition Reactions to Alkenes and Alkynes",
      difficulty: "IDENTIFY",
      coreIdea: "Electrophilic addition adds two new groups across a double or triple bond; Markovnikov's rule predicts that in addition of an asymmetric reagent like HX, the hydrogen adds to the carbon that already has more hydrogens (and the other group adds to the more substituted carbon, forming the more stable carbocation intermediate).",
      learn: [
        "In electrophilic addition, the alkene's pi bond acts as a nucleophile, attacking an electrophile (like H+ from HX) to form a carbocation intermediate, which is then attacked by the remaining nucleophile (like X-)—this converts a double bond into two new single bonds.",
        "Markovnikov's rule predicts that H adds to the carbon with more existing hydrogens, placing the other substituent on the more substituted carbon—this happens because the reaction proceeds through whichever carbocation intermediate is more stable (more substituted carbocations are more stable), and that more-substituted carbon is where the second group ends up attaching."
      ],
      mcatConnection: "Markovnikov's rule is really just carbocation stability in disguise—if you understand that tertiary carbocations are more stable than secondary, which are more stable than primary, you can derive Markovnikov's rule instead of memorizing it as an isolated fact.",
      quickCheck: {
        prompt: "HBr is added across the double bond of 2-methylpropene, (CH3)2C=CH2. According to Markovnikov's rule, on which carbon does the bromine end up?",
        options: ["The terminal CH2 carbon, since it has more hydrogens already", "The more substituted carbon (bonded to two methyl groups), since that forms the more stable tertiary carbocation intermediate", "It adds equally to both carbons", "Bromine does not add to alkenes under these conditions"],
        correctIndex: 1,
        explanation: "Protonation occurs at the terminal CH2 (adding H to the carbon with more existing hydrogens), which generates a tertiary carbocation at the more substituted carbon—since tertiary carbocations are more stable than primary ones, this is the pathway that's favored, and bromide then attacks that more substituted, carbocation-bearing carbon."
      },
      keyTakeaway: "Electrophilic addition to alkenes proceeds through a carbocation intermediate; Markovnikov's rule predicts the more stable (more substituted) carbocation forms, placing the non-hydrogen group on the more substituted carbon."
    }
  ]
};
