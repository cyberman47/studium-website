// Document-lesson content for "Carbonyls, Carboxylic Acids & Derivatives"
// (lib/mcatPath.ts's carbonyls-carboxylic-acids-derivatives LessonContent entry).
// See lib/documentLesson.ts for the shared shape.
import { DocumentLessonContent } from "../documentLesson";

export const carbonylsCarboxylicAcidsDerivativesContent: DocumentLessonContent = {
  lessonIntro: {
    description: "The carbonyl group (C=O) is arguably the single most important functional group in organic chemistry, showing up in aldehydes, ketones, carboxylic acids, and every one of the carboxylic acid derivatives. This lesson covers how nucleophiles attack carbonyls, why carboxylic acids are unusually acidic, and how the different carboxylic acid derivatives interconvert through nucleophilic acyl substitution.",
    objectives: [
      "Explain nucleophilic addition to aldehyde and ketone carbonyls, including hemiacetal/acetal formation",
      "Explain why carboxylic acids are more acidic than alcohols",
      "Rank carboxylic acid derivatives by reactivity toward nucleophilic acyl substitution",
      "Predict products of interconversion between acid derivatives (acid halides, anhydrides, esters, amides)"
    ]
  },
  bigPicture: {
    flow: ["Nucleophile attacks electrophilic carbonyl carbon", "Tetrahedral intermediate forms", "Leaving group present? Yes: substitution (acyl derivatives). No: stays an addition product (aldehydes/ketones)"],
    caption: "Whether a carbonyl reaction ends as an addition or a substitution comes down to one question: is there a leaving group attached to that carbon that can depart afterward?"
  },
  concepts: [
    {
      number: "01",
      id: "aldehydes-ketones-nucleophilic-addition",
      title: "Aldehydes, Ketones, and Nucleophilic Addition",
      difficulty: "REASON",
      coreIdea: "The carbonyl carbon in aldehydes and ketones is electrophilic (partial positive charge from oxygen's electronegativity), attracting nucleophiles in addition reactions; aldehydes are more reactive than ketones due to less steric hindrance and less alkyl-group electron donation.",
      learn: [
        "The C=O bond's polarity makes the carbonyl carbon electrophilic and the oxygen nucleophilic; a nucleophile attacks the carbonyl carbon, pushing electrons onto oxygen and forming a tetrahedral alkoxide intermediate, which is then typically protonated—since there's no leaving group on the carbonyl carbon itself, the overall reaction is an addition, not a substitution.",
        "Aldehydes react faster than ketones in nucleophilic addition because they have only one alkyl group (versus two for ketones) providing steric bulk and electron donation that stabilizes the carbonyl and shields it from attack; a classic example is hemiacetal/acetal formation, where an alcohol adds to a carbonyl (forming a hemiacetal), and a second alcohol can then substitute in to form an acetal."
      ],
      mcatConnection: "Recognizing the carbonyl carbon as the electrophilic site is the entry point for essentially every carbonyl mechanism question—train yourself to immediately spot it and ask 'what's attacking it, and is there a leaving group here or not.'",
      quickCheck: {
        prompt: "Why do aldehydes generally react faster than ketones in nucleophilic addition reactions?",
        options: ["Aldehydes have a more electronegative carbonyl oxygen than ketones", "Ketones have two alkyl groups providing more steric hindrance and electron donation, making their carbonyl carbon less electrophilic and more shielded", "Aldehydes lack a carbonyl group entirely", "Ketones cannot undergo nucleophilic addition at all"],
        correctIndex: 1,
        explanation: "Ketones' two alkyl groups (versus one for aldehydes) both donate electron density into the carbonyl (reducing its electrophilicity) and physically block nucleophilic approach—both effects slow nucleophilic addition compared to the less-hindered, more electrophilic aldehyde carbonyl."
      },
      keyTakeaway: "Nucleophiles attack the electrophilic carbonyl carbon of aldehydes and ketones in an addition reaction (no leaving group present); aldehydes react faster than ketones due to less steric hindrance and electron donation from alkyl groups."
    },
    {
      number: "02",
      id: "carboxylic-acid-acidity",
      title: "Carboxylic Acid Acidity",
      difficulty: "UNDERSTAND",
      coreIdea: "Carboxylic acids are far more acidic than alcohols because their conjugate base (carboxylate) is resonance-stabilized, delocalizing the negative charge across two equivalent oxygens.",
      learn: [
        "When a carboxylic acid (-COOH) loses its proton, the resulting carboxylate anion (-COO-) has its negative charge delocalized equally across both oxygens through resonance—this substantial stabilization of the conjugate base is what makes carboxylic acids far more acidic (lower pKa, typically around 4-5) than alcohols (pKa around 16-18), whose conjugate base (an alkoxide) has no comparable resonance stabilization.",
        "Electron-withdrawing groups near the carboxylic acid (like additional halogens or other electronegative atoms) further stabilize the negative charge inductively, increasing acidity even more (lowering pKa further) as they're placed closer to the carboxyl group."
      ],
      mcatConnection: "The general principle—more resonance/inductive stabilization of a conjugate base means a stronger acid—applies far beyond carboxylic acids (it also explains phenol's acidity relative to plain alcohols), so understanding the mechanism behind carboxylic acid acidity pays off across many acid-base comparisons.",
      quickCheck: {
        prompt: "Why is acetic acid (CH3COOH, pKa ≈ 4.8) a much stronger acid than ethanol (CH3CH2OH, pKa ≈ 16), despite both losing a proton from an oxygen-hydrogen bond?",
        options: ["Acetic acid's conjugate base (acetate) is resonance-stabilized across two oxygens, while ethanol's conjugate base (ethoxide) has no such stabilization", "Ethanol has a higher molecular weight, which makes it harder to lose a proton", "Acetic acid has more carbon atoms, which inherently increases acidity", "There is no real difference in acid strength between the two"],
        correctIndex: 0,
        explanation: "Resonance delocalization of the negative charge across two equivalent oxygens in the carboxylate anion provides substantial stabilization not available to the alkoxide from deprotonating an alcohol—stronger conjugate base stabilization directly corresponds to a stronger acid, which is exactly the pKa gap seen here."
      },
      keyTakeaway: "Carboxylic acids are far more acidic than alcohols because their conjugate base (carboxylate) is resonance-stabilized across two equivalent oxygens; electron-withdrawing groups nearby further increase acidity."
    },
    {
      number: "03",
      id: "carboxylic-acid-derivatives",
      title: "Carboxylic Acid Derivatives and Reactivity",
      difficulty: "REASON",
      coreIdea: "Carboxylic acid derivatives (acid halides, anhydrides, esters, amides) interconvert through nucleophilic acyl substitution, with reactivity ranked by leaving group ability: acid halides > anhydrides > esters > amides.",
      learn: [
        "Nucleophilic acyl substitution follows the same general pattern as carbonyl addition, except the tetrahedral intermediate has a leaving group that departs afterward, regenerating a new carbonyl—a nucleophile attacks the carbonyl carbon, forms a tetrahedral intermediate, and then the original leaving group (or the incoming nucleophile, if it's a worse leaving group) leaves.",
        "Reactivity toward nucleophilic acyl substitution follows the leaving group's ability to stabilize negative charge once it departs: acid halides (best leaving group, most reactive) > anhydrides > esters > amides (worst leaving group, least reactive)—a more reactive derivative can generally be converted into a less reactive one (e.g., an acid halide into an ester), but not efficiently the reverse."
      ],
      mcatConnection: "The reactivity order (acid halide > anhydride > ester > amide) is worth memorizing directly, since it predicts both which interconversions are feasible and which derivative is most susceptible to hydrolysis—amides, at the bottom, are notably stable, which is exactly why peptide bonds (amides) don't spontaneously fall apart in the body.",
      quickCheck: {
        prompt: "Why can an acid chloride be readily converted into an amide, but converting an amide directly into an acid chloride is not practical?",
        options: ["Acid chlorides and amides are actually the same functional group", "Chloride is a much better leaving group than an amine, so the forward reaction is favorable while the reverse is not", "Amides are more electrophilic than acid chlorides", "Nucleophilic acyl substitution only works in one direction, regardless of leaving group"],
        correctIndex: 1,
        explanation: "The reaction proceeds favorably toward whichever direction expels the better leaving group—chloride is a far better leaving group than an amine (nitrogen holds onto electrons poorly as a leaving group but is a great nucleophile), so acid chloride → amide is favorable, while the reverse would require expelling a poor leaving group and isn't practical this way."
      },
      keyTakeaway: "Carboxylic acid derivatives interconvert via nucleophilic acyl substitution, and their reactivity order (acid halide > anhydride > ester > amide) reflects leaving group ability—a more reactive derivative converts readily into a less reactive one, not efficiently the reverse."
    }
  ]
};
