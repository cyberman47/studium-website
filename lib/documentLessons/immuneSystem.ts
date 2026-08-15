// Document-lesson content for "Immune System" (lib/mcatPath.ts's
// immune-system LessonContent entry)—restructured from that same real
// entry. See lib/documentLesson.ts for the shared shape.
import { DocumentLessonContent } from "../documentLesson";

export const immuneSystemContent: DocumentLessonContent = {
  lessonIntro: {
    description: "The immune system runs a fast, generic defense and a slower, highly specific one at the same time. This lesson covers innate immunity's barriers and phagocytes, the humoral (antibody) arm of adaptive immunity, and the cell-mediated (T cell) arm that kills infected cells directly.",
    objectives: [
      "Distinguish innate from adaptive immunity",
      "Explain how B cells produce antigen-specific antibodies",
      "Distinguish helper T cells from cytotoxic T cells",
      "Explain how memory cells enable a faster secondary response"
    ]
  },
  bigPicture: {
    flow: ["Pathogen breaches barrier", "Innate response (fast, generic)", "Adaptive response (slow, specific)", "Memory cells persist"],
    caption: "Innate immunity buys time with an immediate, nonspecific response, while adaptive immunity builds a precise, pathogen-specific response that's slower the first time but nearly instant on repeat exposure."
  },
  concepts: [
    {
      number: "01",
      id: "innate-immunity",
      title: "Innate Immunity",
      difficulty: "UNDERSTAND",
      coreIdea: "Innate immunity is the body's fast, nonspecific first line of defense—barriers, phagocytes, and inflammation—identical for every pathogen.",
      learn: [
        "Innate immunity is the body's fast, nonspecific first line of defense, present from birth and identical for every kind of pathogen. Physical barriers (skin, mucous membranes) and chemical barriers (stomach acid, enzymes in tears/saliva) block most pathogens from entering.",
        "If a pathogen breaches these barriers, phagocytes (like macrophages and neutrophils) engulf and destroy it, and the inflammatory response—triggered by chemical signals like histamine—increases blood flow and immune cell recruitment to the site, producing the classic signs of redness, heat, swelling, and pain."
      ],
      mcatConnection: "The four classic signs of inflammation (redness, heat, swelling, pain) are a compact, high-yield fact pattern connecting immunology to any passage describing an injury or infection site.",
      quickCheck: {
        prompt: "Which best distinguishes innate immunity from adaptive immunity?",
        options: ["Innate immunity is specific to one pathogen; adaptive is nonspecific", "Innate immunity is fast and nonspecific; adaptive immunity is slower but specific and builds memory", "Only adaptive immunity involves any immune cells at all", "Innate immunity only occurs after vaccination"],
        correctIndex: 1,
        explanation: "Innate immunity responds quickly and identically to any pathogen, while adaptive immunity is slower but pathogen-specific and builds memory—innate immunity also involves cells (like phagocytes) and is present from birth, unrelated to vaccination."
      },
      keyTakeaway: "Innate immunity—barriers, phagocytes, inflammation—responds fast and identically to every pathogen, buying time for the slower, specific adaptive response."
    },
    {
      number: "02",
      id: "humoral-immunity",
      title: "Adaptive Immunity: Humoral Response",
      difficulty: "IDENTIFY",
      coreIdea: "B cells that encounter their matching antigen become plasma cells, which secrete antigen-specific antibodies; some become long-lived memory B cells.",
      learn: [
        "Adaptive immunity is slower to activate than innate immunity but is specific to a particular pathogen and builds lasting memory. The humoral response is mediated by B cells: when a B cell encounters its matching antigen (a specific molecular marker on a pathogen), it proliferates and differentiates into plasma cells, which secrete large quantities of antibodies specific to that antigen.",
        "Antibodies neutralize pathogens directly or mark them for destruction by other immune cells. Some activated B cells become memory B cells, persisting long-term and enabling a faster, stronger response if the same pathogen is encountered again."
      ],
      mcatConnection: "Plasma cells are the antibody factories—being able to state plainly that plasma cells are differentiated B cells (not a separate cell lineage) is a distinction the exam tests directly.",
      quickCheck: {
        prompt: "A plasma cell is a differentiated form of which immune cell type?",
        options: ["Helper T cell", "Cytotoxic T cell", "B cell", "Macrophage"],
        correctIndex: 2,
        explanation: "Plasma cells are differentiated B cells that secrete antibodies specific to an encountered antigen—helper and cytotoxic T cells are separate lineages, and macrophages are innate immune phagocytes."
      },
      keyTakeaway: "B cells that recognize their matching antigen become plasma cells (antibody factories) or memory B cells (long-term, faster future response)."
    },
    {
      number: "03",
      id: "cell-mediated-immunity",
      title: "Adaptive Immunity: Cell-Mediated Response",
      difficulty: "REASON",
      coreIdea: "Helper T cells coordinate the immune response via cytokines; cytotoxic T cells directly kill infected or abnormal cells.",
      learn: [
        "The cell-mediated response is carried out primarily by T cells. Helper T cells coordinate the immune response by releasing signaling molecules (cytokines) that activate B cells, cytotoxic T cells, and macrophages.",
        "Cytotoxic T cells directly kill infected or abnormal cells (such as virus-infected cells or cancer cells) by recognizing antigen fragments displayed on the infected cell's surface. Like the humoral response, this arm also generates memory T cells, providing long-term, faster protection against future exposure to the same pathogen."
      ],
      mcatConnection: "Helper vs. cytotoxic T cell roles are commonly confused—helper T cells coordinate (via cytokines, activating other cells) while cytotoxic T cells execute (directly killing infected cells)—keep the coordinator/executor framing straight.",
      quickCheck: {
        prompt: "What is the primary role of a helper T cell in the adaptive immune response?",
        options: ["Directly killing infected cells", "Producing antibodies", "Releasing cytokines to coordinate and activate other immune cells", "Serving as a physical barrier to infection"],
        correctIndex: 2,
        explanation: "Helper T cells release cytokines that coordinate and activate B cells, cytotoxic T cells, and macrophages—directly killing infected cells is the role of cytotoxic T cells, and antibody production is done by plasma cells."
      },
      keyTakeaway: "Helper T cells coordinate the immune response via cytokines; cytotoxic T cells directly kill infected/abnormal cells—both arms generate memory T cells for faster future responses."
    }
  ]
};
