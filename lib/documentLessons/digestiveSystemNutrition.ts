// Document-lesson content for "Digestive System & Nutrition"
// (lib/mcatPath.ts's digestive-system-nutrition LessonContent entry)—
// restructured from that same real entry. See lib/documentLesson.ts for the
// shared shape.
import { DocumentLessonContent } from "../documentLesson";

export const digestiveSystemNutritionContent: DocumentLessonContent = {
  lessonIntro: {
    description: "Digestion turns whole food into molecules small enough to absorb, using two distinct strategies at every step. This lesson covers mechanical vs. chemical digestion, the dedicated enzyme systems for carbs, protein, and fat, and how the small intestine is built to absorb the results.",
    objectives: [
      "Distinguish mechanical from chemical digestion",
      "Name the main enzyme responsible for digesting each macronutrient and where it acts",
      "Explain bile's role in fat digestion",
      "Explain why absorbed fats travel a different route than absorbed sugars and amino acids"
    ]
  },
  bigPicture: {
    flow: ["Mouth (mechanical + amylase)", "Stomach (acid + pepsin)", "Small intestine (bile + enzymes)", "Absorption (villi)"],
    caption: "Each organ along the digestive tract has a specific job—by the time food reaches the small intestine, it's been mechanically broken down and partially digested, ready for the final enzymatic breakdown and absorption."
  },
  concepts: [
    {
      number: "01",
      id: "digestive-tract-overview",
      title: "Overview of the Digestive Tract",
      difficulty: "UNDERSTAND",
      coreIdea: "Mechanical digestion breaks food into smaller pieces to increase surface area; chemical digestion (enzymes, acid) breaks the actual chemical bonds.",
      learn: [
        "The digestive tract is a continuous tube from mouth to anus, with each organ playing a specific role. Mechanical digestion (chewing in the mouth, churning in the stomach) physically breaks food into smaller pieces, increasing surface area.",
        "Chemical digestion uses enzymes and acid to break chemical bonds in food molecules. The stomach's highly acidic environment (pH ~1.5-3.5) denatures proteins and activates pepsin for protein digestion, while also killing most ingested bacteria."
      ],
      mcatConnection: "Mechanical vs. chemical digestion is a simple distinction the exam likes to test by describing a specific process (chewing, pepsin activation) and asking you to classify which category it falls into.",
      quickCheck: {
        prompt: "Which best describes the difference between mechanical and chemical digestion?",
        options: ["Mechanical digestion breaks chemical bonds; chemical digestion breaks food into smaller pieces", "Mechanical digestion physically breaks food apart; chemical digestion breaks chemical bonds via enzymes/acid", "They are the same process under different names", "Only chemical digestion occurs in the stomach"],
        correctIndex: 1,
        explanation: "Mechanical digestion physically breaks food into smaller pieces (increasing surface area); chemical digestion uses enzymes and acid to break the actual chemical bonds within food molecules—both occur in the stomach, not just one."
      },
      keyTakeaway: "Mechanical digestion increases surface area by physical breakdown; chemical digestion (enzymes, acid) breaks the chemical bonds within food."
    },
    {
      number: "02",
      id: "enzymatic-digestion",
      title: "Enzymatic Digestion",
      difficulty: "IDENTIFY",
      coreIdea: "Carbohydrates get amylase, proteins get pepsin/trypsin, and fats get a two-step process—bile emulsifies them so pancreatic lipase can act.",
      learn: [
        "Carbohydrate digestion begins in the mouth with salivary amylase (breaking down starch) and continues in the small intestine with pancreatic amylase. Protein digestion begins in the stomach with pepsin and continues in the small intestine with pancreatic proteases (like trypsin and chymotrypsin).",
        "Lipid digestion occurs almost entirely in the small intestine: bile (produced by the liver, stored in the gallbladder) emulsifies fats into smaller droplets, increasing surface area for pancreatic lipase to break them down into fatty acids and monoglycerides."
      ],
      mcatConnection: "Bile is not itself an enzyme—a distinction the exam likes to test directly, since it's a common misconception. Bile only emulsifies fat; lipase does the actual chemical breakdown.",
      quickCheck: {
        prompt: "What is the primary function of bile in fat digestion?",
        options: ["Directly breaking chemical bonds in fat molecules", "Emulsifying fat droplets to increase surface area for lipase", "Neutralizing stomach acid", "Producing pancreatic enzymes"],
        correctIndex: 1,
        explanation: "Bile emulsifies fat into smaller droplets, increasing surface area for pancreatic lipase to act on—bile itself doesn't break chemical bonds, and it's produced by the liver, not the pancreas."
      },
      keyTakeaway: "Each macronutrient has a dedicated digestion pathway: amylase for carbs, pepsin/trypsin for protein, and bile (emulsification) plus lipase for fat."
    },
    {
      number: "03",
      id: "absorption-nutrition",
      title: "Absorption and Nutrition",
      difficulty: "REASON",
      coreIdea: "Villi/microvilli maximize small intestine surface area—sugars/amino acids absorb directly into capillaries, while fats absorb into lacteals via the lymphatic system.",
      learn: [
        "The small intestine is the primary site of nutrient absorption, with its inner surface covered in villi and microvilli that dramatically increase surface area. Monosaccharides and amino acids are absorbed into capillaries within each villus and enter the bloodstream directly.",
        "Fatty acids and monoglycerides are absorbed into lacteals (lymphatic vessels within each villus) as chylomicrons, entering the lymphatic system before eventually reaching the bloodstream. The large intestine mainly absorbs water and electrolytes from the remaining, largely undigested material."
      ],
      mcatConnection: "The fat-takes-the-lymphatic-route detail is a favorite because it connects digestion to the broader circulatory/lymphatic system—expect it tested alongside chylomicron structure or lymphatic anatomy in integrated passages.",
      quickCheck: {
        prompt: "Absorbed fatty acids and monoglycerides enter which system first, before eventually reaching the bloodstream?",
        options: ["The circulatory system directly", "The lymphatic system, via lacteals", "The nervous system", "The renal system"],
        correctIndex: 1,
        explanation: "Unlike sugars and amino acids, fatty acids and monoglycerides are absorbed into lacteals as chylomicrons, entering the lymphatic system first—neither the nervous nor renal system is involved in this initial absorption step."
      },
      keyTakeaway: "Villi/microvilli maximize absorption surface area; water-soluble sugars and amino acids go straight to capillaries, while fats take a lymphatic detour via lacteals first."
    }
  ]
};
