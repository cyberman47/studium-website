// Document-lesson content for "Reproductive System & Development"
// (lib/mcatPath.ts's reproductive-system-development LessonContent entry)—
// restructured from that same real entry. See lib/documentLesson.ts for the
// shared shape.
import { DocumentLessonContent } from "../documentLesson";

export const reproductiveSystemDevelopmentContent: DocumentLessonContent = {
  lessonIntro: {
    description: "Reproduction depends on precisely timed hormone signaling, from gamete production through fertilization and the earliest stages of development. This lesson covers how sperm and egg production differ, the hormonal cycle that governs ovulation, and what happens in the days right after fertilization.",
    objectives: [
      "Distinguish spermatogenesis from oogenesis",
      "Trace the HPG axis's control of the menstrual cycle",
      "Explain what triggers ovulation",
      "Describe the stages from fertilization through implantation"
    ]
  },
  bigPicture: {
    flow: ["FSH: follicle develops", "Estrogen rises", "LH surge → ovulation", "Corpus luteum: progesterone"],
    caption: "The menstrual cycle is one continuous hormonal relay—each hormone's rise is what triggers the next stage, right up until the corpus luteum either sustains a pregnancy or degrades and restarts the cycle."
  },
  concepts: [
    {
      number: "01",
      id: "gametogenesis",
      title: "Reproductive Anatomy and Gametogenesis",
      difficulty: "UNDERSTAND",
      coreIdea: "Spermatogenesis is continuous, producing many small sperm; oogenesis is cyclical, producing one large egg per cycle from a fixed pool set at birth.",
      learn: [
        "Spermatogenesis occurs continuously in the testes, where diploid germ cells undergo meiosis to produce large numbers of small, motile haploid sperm cells.",
        "Oogenesis occurs in the ovaries: a female is born with all the primary oocytes she will ever have, and meiosis is arrested partway through until a single egg is selected for release (ovulation) during each cycle, producing one much larger haploid egg per cycle rather than many. Both processes use meiosis to halve the chromosome number, but differ substantially in timing and number of gametes produced."
      ],
      mcatConnection: "The exam likes to test the contrast directly: continuous/many/small (sperm) vs. cyclical/one/large, fixed-pool-at-birth (egg)—both still use meiosis, so don't mistake this for a mitosis-vs-meiosis question.",
      quickCheck: {
        prompt: "What is a key difference between spermatogenesis and oogenesis?",
        options: ["Spermatogenesis produces one large gamete per cycle; oogenesis produces many small ones", "Spermatogenesis is continuous and produces many gametes; oogenesis is cyclical and produces one gamete per cycle", "Neither process involves meiosis", "Oogenesis occurs continuously throughout adult life at the same rate as spermatogenesis"],
        correctIndex: 1,
        explanation: "Spermatogenesis is continuous, producing large numbers of small sperm, while oogenesis is cyclical, producing one large egg per cycle—both processes use meiosis, and oogenesis is cyclical and arrested, unlike continuous spermatogenesis."
      },
      keyTakeaway: "Spermatogenesis (continuous, many, small) and oogenesis (cyclical, one per cycle, large, fixed pool from birth) both use meiosis but differ substantially in pattern and output."
    },
    {
      number: "02",
      id: "menstrual-cycle-hormones",
      title: "Hormonal Regulation of the Menstrual Cycle",
      difficulty: "IDENTIFY",
      coreIdea: "The HPG axis drives the cycle: FSH grows a follicle, rising estrogen triggers an LH surge causing ovulation, and the resulting corpus luteum secretes progesterone.",
      learn: [
        "The menstrual cycle is regulated by the hypothalamic-pituitary-gonadal (HPG) axis. The hypothalamus releases GnRH, stimulating the pituitary to release FSH (stimulating follicle development in the ovary) and LH. Rising estrogen from the developing follicle eventually triggers a sharp LH surge, which causes ovulation.",
        "After ovulation, the ruptured follicle becomes the corpus luteum, which secretes progesterone to maintain the uterine lining; if fertilization doesn't occur, the corpus luteum degrades, progesterone falls, and the uterine lining sheds (menstruation), restarting the cycle."
      ],
      mcatConnection: "The exact trigger sequence for ovulation—rising estrogen → LH surge → ovulation—is the single most tested fact in this topic; the exam frequently gives a hormone-level graph and asks you to identify the day of ovulation from the LH spike.",
      quickCheck: {
        prompt: "What event directly triggers ovulation?",
        options: ["A drop in FSH", "A sharp LH surge, triggered by rising estrogen", "A rise in progesterone before the follicle develops", "Implantation of the blastocyst"],
        correctIndex: 1,
        explanation: "Rising estrogen from the developing follicle triggers a sharp LH surge, which directly causes ovulation—progesterone rises after ovulation from the corpus luteum, and implantation occurs well after ovulation, not before it."
      },
      keyTakeaway: "The HPG axis drives the cycle: FSH develops a follicle, rising estrogen triggers an LH surge causing ovulation, and the resulting corpus luteum's progesterone maintains the uterine lining afterward."
    },
    {
      number: "03",
      id: "fertilization-early-development",
      title: "Fertilization and Early Development",
      difficulty: "REASON",
      coreIdea: "Fertilization forms a diploid zygote, which undergoes cleavage (division without growth) into a blastocyst that implants in the uterine wall.",
      learn: [
        "Fertilization occurs when a sperm cell fuses with an egg, typically in the fallopian tube, restoring the diploid chromosome number and forming a zygote. The zygote undergoes rapid mitotic divisions (cleavage) without overall growth in size, forming a solid ball of cells (morula) and then a hollow ball (blastocyst).",
        "The blastocyst implants into the uterine wall (implantation), after which the placenta develops to support ongoing nutrient and gas exchange between mother and developing embryo."
      ],
      mcatConnection: "Cleavage's defining feature—division without growth—is a specific, testable detail that distinguishes it from ordinary mitotic growth elsewhere in the body; expect a question asking why the morula isn't larger than the original zygote.",
      quickCheck: {
        prompt: "What process immediately follows fertilization, transforming the zygote into a blastocyst?",
        options: ["Implantation", "Cleavage (rapid mitotic division without growth)", "Ovulation", "Gastrulation only, with no prior division"],
        correctIndex: 1,
        explanation: "Cleavage is rapid mitotic division without overall growth, transforming the zygote into a morula and then a blastocyst—implantation occurs after the blastocyst has already formed, and ovulation occurs before fertilization."
      },
      keyTakeaway: "Fertilization restores the diploid number, forming a zygote that undergoes cleavage (division without growth) into a blastocyst, which then implants and triggers placental development."
    }
  ]
};
