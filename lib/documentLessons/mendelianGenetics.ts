// Document-lesson content for "Mendelian Genetics & Inheritance"
// (lib/mcatPath.ts's mendelian-genetics-inheritance LessonContent entry)—
// restructured from that same real entry. See lib/documentLesson.ts for the
// shared shape.
import { DocumentLessonContent } from "../documentLesson";

export const mendelianGeneticsContent: DocumentLessonContent = {
  lessonIntro: {
    description: "Gregor Mendel's pea-plant experiments gave biology its first rigorous rules for inheritance. This lesson covers his two laws, how genotype and phenotype relate through Punnett squares, and the real inheritance patterns—incomplete dominance, codominance, and sex-linkage—that go beyond simple dominant/recessive.",
    objectives: [
      "State the law of segregation and the law of independent assortment",
      "Distinguish genotype from phenotype, and homozygous from heterozygous",
      "Use a Punnett square to predict offspring ratios",
      "Distinguish incomplete dominance, codominance, and sex-linked inheritance"
    ]
  },
  bigPicture: {
    flow: ["Parent alleles", "Segregate into gametes", "Combine at fertilization", "Offspring genotype/phenotype"],
    caption: "Every inheritance pattern in this lesson builds on the same two rules: alleles separate into gametes (segregation), and different genes assort independently of each other."
  },
  concepts: [
    {
      number: "01",
      id: "mendels-laws",
      title: "Mendel's Laws",
      difficulty: "UNDERSTAND",
      coreIdea: "The law of segregation says an organism's two alleles separate into different gametes; the law of independent assortment says different genes assort independently of each other.",
      learn: [
        "Gregor Mendel's pea-plant experiments established two foundational laws. The law of segregation states that an organism's two alleles for a gene separate during gamete formation, so each gamete carries only one allele.",
        "The law of independent assortment states that alleles for different genes—located on different chromosomes—segregate independently of one another during gamete formation, so the inheritance of one trait doesn't affect the inheritance of another."
      ],
      mcatConnection: "The exam sometimes presents a modern exception (genes on the same chromosome, which don't assort independently—linkage) precisely to test whether you understand independent assortment applies to genes on different chromosomes, not all genes universally.",
      quickCheck: {
        prompt: "What is the difference between the law of segregation and the law of independent assortment?",
        options: ["They describe the same process", "Segregation concerns one gene's two alleles; independent assortment concerns different genes on different chromosomes", "Segregation only applies to dominant alleles", "Independent assortment only applies during mitosis"],
        correctIndex: 1,
        explanation: "Segregation describes how a single gene's two alleles separate into different gametes; independent assortment describes how alleles of different genes on different chromosomes assort independently of each other."
      },
      keyTakeaway: "Segregation separates a gene's two alleles into different gametes; independent assortment lets different genes' alleles combine independently."
    },
    {
      number: "02",
      id: "genotype-phenotype-punnett",
      title: "Genotype, Phenotype, and Punnett Squares",
      difficulty: "IDENTIFY",
      coreIdea: "Genotype is the allele combination; phenotype is the resulting observable trait—a Punnett square predicts the ratios of both among offspring.",
      learn: [
        "Genotype is an organism's actual allele combination (e.g., Aa); phenotype is the observable trait that results (e.g., purple flowers). An organism is homozygous if it carries two identical alleles for a gene (AA or aa) and heterozygous if it carries two different alleles (Aa).",
        "For a dominant allele (A), only one copy is needed to produce the dominant phenotype; a recessive allele (a) only shows its phenotype when homozygous (aa). A Punnett square predicts the genotype and phenotype ratios of offspring from a given cross."
      ],
      mcatConnection: "A classic Aa × Aa cross producing a 1:2:1 genotype ratio (3:1 phenotype ratio) is worth having memorized cold—it's the fastest way to sanity-check any Punnett square question under time pressure.",
      quickCheck: {
        prompt: "Two heterozygous (Aa) pea plants are crossed. What fraction of offspring is expected to be homozygous recessive (aa)?",
        options: ["1/4", "1/2", "3/4", "1"],
        correctIndex: 0,
        explanation: "An Aa × Aa cross produces a 1:2:1 genotype ratio (AA:Aa:aa), so 1/4 of offspring are aa—1/2 are heterozygous, and 3/4 show the dominant phenotype overall."
      },
      keyTakeaway: "Genotype is the allele combination (homozygous or heterozygous); phenotype is what's observed—a dominant allele only needs one copy to show, a recessive allele needs two."
    },
    {
      number: "03",
      id: "beyond-simple-dominance",
      title: "Beyond Simple Dominance",
      difficulty: "REASON",
      coreIdea: "Incomplete dominance blends phenotypes, codominance expresses both fully, multiple alleles expand the options, and sex-linked traits inherit differently by sex.",
      learn: [
        "Not all inheritance follows simple dominant/recessive patterns. In incomplete dominance, heterozygotes show a blended intermediate phenotype (e.g., red x white = pink flowers). In codominance, heterozygotes show both parental phenotypes fully and simultaneously (e.g., AB blood type).",
        "Some genes have more than two possible alleles in a population (multiple alleles), as with the ABO blood group. Sex-linked traits are carried on the X or Y chromosome, causing them to be inherited differently in males and females—since males have only one X, a single recessive X-linked allele produces the recessive phenotype."
      ],
      mcatConnection: "Distinguishing incomplete dominance (a blend, like pink) from codominance (both fully expressed at once, like AB blood type or spotted coat color) is one of the most commonly confused pairs on the exam—the test is whether the heterozygote phenotype is a blend or a combination.",
      quickCheck: {
        prompt: "In snapdragons, a cross between red-flowered (RR) and white-flowered (WW) plants produces all pink-flowered offspring. This is an example of:",
        options: ["Codominance", "Incomplete dominance", "Sex linkage", "Multiple alleles"],
        correctIndex: 1,
        explanation: "A blended, intermediate phenotype (pink) is the hallmark of incomplete dominance—codominance would show both red and white simultaneously rather than blended, and no sex chromosomes or extra alleles are involved here."
      },
      keyTakeaway: "Incomplete dominance blends phenotypes, codominance expresses both fully, and sex-linked traits (like X-linked recessive conditions) affect males and females differently because males carry only one X."
    }
  ]
};
