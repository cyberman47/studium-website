// Document-lesson content for "Organic Chemistry & Spectroscopy"
// (lib/mcatPath.ts's organic-chemistry-spectroscopy LessonContent entry).
// See lib/documentLesson.ts for the shared shape.
import { DocumentLessonContent } from "../documentLesson";

export const organicChemistrySpectroscopyContent: DocumentLessonContent = {
  lessonIntro: {
    description: "Spectroscopy is how chemists figure out an unknown molecule's structure without ever seeing it directly—by reading how it interacts with radiation or a magnetic field. This lesson covers IR spectroscopy for identifying functional groups, 1H NMR for mapping out a molecule's hydrogen environments, and how mass spectrometry rounds out the picture with molecular weight and fragmentation data.",
    objectives: [
      "Identify functional groups from characteristic IR absorption bands",
      "Interpret 1H NMR spectra using chemical shift, splitting (n+1 rule), and integration",
      "Interpret basic mass spectrometry data, including the molecular ion peak",
      "Combine multiple spectroscopic techniques to determine an unknown structure"
    ]
  },
  bigPicture: {
    flow: ["IR: which functional groups are present", "1H NMR: how many distinct hydrogen environments, and their neighbors", "Mass spec: molecular weight and fragments", "Combine all three to determine structure"],
    caption: "No single spectroscopic technique gives you the whole structure—IR narrows down functional groups, NMR maps out the hydrogen framework, and mass spec pins down molecular weight, and reading them together is how the full structure gets solved."
  },
  concepts: [
    {
      number: "01",
      id: "ir-spectroscopy",
      title: "IR Spectroscopy",
      difficulty: "IDENTIFY",
      coreIdea: "Infrared spectroscopy identifies functional groups by their characteristic bond-stretching absorption frequencies, most usefully in the O-H, N-H, and C=O regions.",
      learn: [
        "IR spectroscopy measures which frequencies of infrared light a molecule's bonds absorb as they stretch and bend; each type of bond absorbs in a characteristic, largely predictable frequency range, making the resulting spectrum a fingerprint of which functional groups are present.",
        "The highest-yield regions to recognize are a broad O-H stretch (around 3200-3550 cm⁻¹, broadened further by hydrogen bonding), a sharper N-H stretch (around 3300-3500 cm⁻¹), and a strong, sharp C=O stretch (around 1650-1750 cm⁻¹, present in aldehydes, ketones, carboxylic acids, esters, and amides alike)."
      ],
      mcatConnection: "IR is mainly a presence/absence tool—the exam typically shows you a spectrum and asks which functional group must (or can't) be present, so knowing the O-H/N-H/C=O regions covers the large majority of what's actually tested.",
      quickCheck: {
        prompt: "An IR spectrum shows a strong, sharp absorption around 1715 cm⁻¹ but no broad absorption in the 3200-3550 cm⁻¹ O-H region. Which functional group is most consistent with this data?",
        options: ["Alcohol", "Carboxylic acid", "Ketone", "Amine"],
        correctIndex: 2,
        explanation: "The sharp absorption near 1715 cm⁻¹ is characteristic of a C=O stretch, indicating a carbonyl-containing group—the absence of a broad O-H absorption rules out an alcohol or carboxylic acid (both of which would show that broad O-H band), leaving a ketone (which has a C=O but no O-H) as the best fit; an amine wouldn't show a strong C=O stretch at all."
      },
      keyTakeaway: "IR spectroscopy identifies functional groups by characteristic absorption frequencies—broad O-H, sharper N-H, and strong sharp C=O are the highest-yield regions to recognize."
    },
    {
      number: "02",
      id: "nmr-spectroscopy",
      title: "1H NMR Spectroscopy",
      difficulty: "REASON",
      coreIdea: "1H NMR reveals distinct hydrogen environments by chemical shift, the number of neighboring hydrogens by splitting (the n+1 rule), and the relative number of each type of hydrogen by integration.",
      learn: [
        "Chemical shift (measured in ppm) indicates a hydrogen's electronic environment: hydrogens near electronegative atoms or deshielding groups (like a carbonyl or aromatic ring) appear further downfield (higher ppm), while hydrogens in more electron-rich, shielded environments appear further upfield (lower ppm)—each distinct chemical environment produces its own signal.",
        "Splitting follows the n+1 rule: a hydrogen's signal is split into n+1 peaks by n neighboring, non-equivalent hydrogens on adjacent carbons (a hydrogen with two neighboring hydrogens appears as a triplet, for example); integration (the relative area under each signal) gives the relative ratio of hydrogens contributing to each signal, not the absolute count."
      ],
      mcatConnection: "The n+1 rule is worth being completely automatic with—count only hydrogens on directly adjacent carbons (not the hydrogens in the signal's own group), and remember integration gives ratios, so you often need the molecular formula to convert those ratios into actual hydrogen counts.",
      quickCheck: {
        prompt: "In a 1H NMR spectrum, a particular hydrogen signal appears as a quartet (four peaks). Based on the n+1 rule, how many non-equivalent hydrogens are on the carbon(s) adjacent to this hydrogen?",
        options: ["1", "2", "3", "4"],
        correctIndex: 2,
        explanation: "The n+1 rule states that a signal is split into n+1 peaks by n neighboring hydrogens—a quartet has 4 peaks, so n+1 = 4, meaning n = 3 neighboring hydrogens (a classic example is the CH2 of an ethyl group, split into a quartet by the adjacent CH3's three hydrogens)."
      },
      keyTakeaway: "1H NMR chemical shift indicates a hydrogen's electronic environment, splitting (n+1 rule) reveals the number of neighboring hydrogens, and integration gives the relative ratio of hydrogens in each signal."
    },
    {
      number: "03",
      id: "mass-spec-combining-techniques",
      title: "Mass Spectrometry and Combining Techniques",
      difficulty: "IDENTIFY",
      coreIdea: "Mass spectrometry ionizes and fragments a molecule, with the molecular ion peak revealing molecular weight and fragment peaks offering structural clues; combining IR, NMR, and mass spec together is how an unknown structure gets solved.",
      learn: [
        "Mass spectrometry ionizes a molecule and measures the mass-to-charge ratio of the resulting ions; the molecular ion peak (M+) corresponds to the intact, singly-ionized molecule and directly gives the molecular weight, while smaller peaks correspond to characteristic fragments formed when the molecular ion breaks apart, offering additional structural clues.",
        "No single technique fully solves a structure alone: IR narrows down which functional groups are present, 1H NMR maps the number, environment, and connectivity of hydrogens, and mass spectrometry pins down molecular weight and fragmentation pattern—used together, they let you assemble and confirm a complete structure."
      ],
      mcatConnection: "When a passage presents multiple spectra together, work through them in the order that narrows possibilities fastest: molecular weight (mass spec) constrains the possible molecular formulas, functional groups (IR) narrow down which of those formulas are chemically reasonable, and NMR confirms the specific arrangement.",
      quickCheck: {
        prompt: "A mass spectrum shows a molecular ion peak at m/z = 72. What does this value most directly tell you about the unknown compound?",
        options: ["The number of hydrogens it contains", "Its molecular weight (for a singly charged ion)", "The number of distinct functional groups present", "Its melting point"],
        correctIndex: 1,
        explanation: "The molecular ion peak represents the intact molecule, ionized with a single charge, so its mass-to-charge ratio directly equals the molecule's molecular weight (72, in this case)—it doesn't by itself specify hydrogen count, functional groups, or melting point, which require combining this data with IR and NMR."
      },
      keyTakeaway: "Mass spectrometry's molecular ion peak reveals molecular weight, and fragment peaks offer structural clues; combining mass spec with IR (functional groups) and NMR (hydrogen environments/connectivity) is how an unknown structure is fully determined."
    }
  ]
};
