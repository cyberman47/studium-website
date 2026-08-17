// Document-lesson content for "Redox & Electrochemistry"
// (lib/mcatPath.ts's redox-electrochemistry LessonContent entry).
// See lib/documentLesson.ts for the shared shape.
import { DocumentLessonContent } from "../documentLesson";

export const redoxElectrochemistryContent: DocumentLessonContent = {
  lessonIntro: {
    description: "Electrochemistry connects chemical reactions directly to electrical energy, whether that's a battery producing current or an external current forcing an otherwise unfavorable reaction to occur. This lesson covers assigning oxidation states and balancing redox reactions, how galvanic cells generate spontaneous current, and how electrolytic cells use current to drive nonspontaneous reactions.",
    objectives: [
      "Assign oxidation states and identify oxidizing and reducing agents",
      "Describe the components and electron flow of a galvanic (voltaic) cell",
      "Calculate standard cell potential and relate it to spontaneity via ΔG = -nFE°cell",
      "Contrast galvanic cells with electrolytic cells"
    ]
  },
  bigPicture: {
    flow: ["Oxidation at anode (electrons lost)", "Electrons flow through external circuit", "Reduction at cathode (electrons gained)", "Current generated (galvanic) or driven by external source (electrolytic)"],
    caption: "Every electrochemical cell, whether generating current or consuming it, is built from the same two half-reactions—oxidation at the anode and reduction at the cathode—connected by a wire that lets electrons flow between them."
  },
  concepts: [
    {
      number: "01",
      id: "oxidation-states-redox",
      title: "Oxidation States and Redox Reactions",
      difficulty: "UNDERSTAND",
      coreIdea: "Oxidation states track how electrons are distributed in a compound; a redox reaction involves one species being oxidized (oxidation state increases, loses electrons) while another is reduced (oxidation state decreases, gains electrons).",
      learn: [
        "Oxidation states are assigned by rules (elements in their pure form are 0, oxygen is usually -2, hydrogen is usually +1, and the sum of oxidation states in a neutral compound is 0 or equals the charge in an ion)—tracking how an atom's oxidation state changes across a reaction identifies whether it's being oxidized or reduced.",
        "The species that is oxidized (loses electrons) is called the reducing agent, because it causes another species to be reduced; the species that is reduced (gains electrons) is called the oxidizing agent, because it causes another species to be oxidized—every redox reaction has exactly one of each."
      ],
      mcatConnection: "Confusing which species is the 'agent' versus which one is oxidized/reduced is a classic trap—remember the agent is named for what it does to the other species, which is the opposite of what happens to itself.",
      quickCheck: {
        prompt: "In the reaction Zn + Cu2+ → Zn2+ + Cu, zinc's oxidation state goes from 0 to +2. What role does zinc play in this reaction?",
        options: ["Zinc is oxidized and acts as the oxidizing agent", "Zinc is oxidized and acts as the reducing agent", "Zinc is reduced and acts as the oxidizing agent", "Zinc is reduced and acts as the reducing agent"],
        correctIndex: 1,
        explanation: "Zinc's oxidation state increasing from 0 to +2 means it lost electrons, i.e., it was oxidized—and because losing those electrons is what allows Cu2+ to be reduced to Cu, zinc is the reducing agent (the species that enables reduction elsewhere by itself being oxidized)."
      },
      keyTakeaway: "Oxidation states track electron distribution; the species oxidized (loses electrons) is the reducing agent, and the species reduced (gains electrons) is the oxidizing agent."
    },
    {
      number: "02",
      id: "galvanic-cells",
      title: "Galvanic (Voltaic) Cells",
      difficulty: "REASON",
      coreIdea: "A galvanic cell generates electrical current from a spontaneous redox reaction, with oxidation occurring at the anode and reduction at the cathode; a positive standard cell potential (E°cell) confirms spontaneity.",
      learn: [
        "In a galvanic cell, oxidation happens at the anode (electrons are released into the external circuit) and reduction happens at the cathode (electrons are consumed)—electrons flow through the external wire from anode to cathode, while ions flow through a salt bridge to maintain charge neutrality in each half-cell.",
        "Standard cell potential, E°cell = E°cathode - E°anode (using standard reduction potentials for both), is positive for a spontaneous galvanic cell; this connects directly to thermodynamics through ΔG° = -nFE°cell, where a positive E°cell gives a negative ΔG°, confirming the reaction is spontaneous."
      ],
      mcatConnection: "Anode/cathode assignment is easiest to remember through the mnemonic 'AN OX, RED CAT' (ANode = OXidation, REDuction = CAThode)—and remember electrons always flow anode to cathode through the external circuit, regardless of which specific metals are involved.",
      quickCheck: {
        prompt: "In a galvanic cell built from Zn/Zn2+ and Cu/Cu2+ half-cells, electrons flow spontaneously from the zinc electrode to the copper electrode through the external wire. Which electrode is the anode?",
        options: ["Copper, because reduction occurs there", "Copper, because oxidation occurs there", "Zinc, because oxidation occurs there and releases the electrons that flow through the wire", "Zinc, because reduction occurs there"],
        correctIndex: 2,
        explanation: "Since electrons flow away from the zinc electrode, zinc must be losing electrons—that's oxidation, and by definition oxidation occurs at the anode; copper is gaining those electrons (reduction), making it the cathode, not the anode."
      },
      keyTakeaway: "In a galvanic cell, oxidation occurs at the anode and reduction at the cathode; a positive E°cell indicates a spontaneous reaction, consistent with ΔG° = -nFE°cell being negative."
    },
    {
      number: "03",
      id: "electrolytic-cells",
      title: "Electrolytic Cells",
      difficulty: "IDENTIFY",
      coreIdea: "An electrolytic cell uses an external electrical current to force a nonspontaneous redox reaction to occur (electrolysis); unlike a galvanic cell, it consumes electrical energy rather than producing it.",
      learn: [
        "Electrolytic cells require an external power source (like a battery) to push electrons in a direction they wouldn't flow spontaneously, driving a reaction with a negative E°cell (positive ΔG°) that would not occur on its own—common examples include electroplating and the electrolysis of water into H2 and O2.",
        "Oxidation still occurs at the anode and reduction still occurs at the cathode in an electrolytic cell (that part doesn't change), but because the process is nonspontaneous rather than spontaneous, the anode and cathode's charge polarity relative to the external power source is reversed compared to a galvanic cell."
      ],
      mcatConnection: "The MCAT often tests the contrast directly: galvanic cells are spontaneous and generate current (like a battery); electrolytic cells are nonspontaneous and consume current (like charging a battery or electroplating)—same anode/cathode definitions, opposite spontaneity.",
      quickCheck: {
        prompt: "Which statement correctly distinguishes an electrolytic cell from a galvanic cell?",
        options: ["Reduction occurs at the anode in an electrolytic cell but not a galvanic cell", "An electrolytic cell drives a nonspontaneous reaction using external electrical energy, while a galvanic cell generates electrical energy from a spontaneous reaction", "Electrolytic cells don't involve any electron transfer", "Galvanic cells always have a negative E°cell"],
        correctIndex: 1,
        explanation: "The defining difference is spontaneity and energy direction: galvanic cells harness a spontaneous reaction (positive E°cell) to produce current, while electrolytic cells use an external current to force a nonspontaneous reaction (negative E°cell) forward—oxidation still occurs at the anode and reduction at the cathode in both types."
      },
      keyTakeaway: "Electrolytic cells use external electrical energy to drive a nonspontaneous redox reaction, while galvanic cells generate electrical energy from a spontaneous one; oxidation is always at the anode and reduction always at the cathode in both."
    }
  ]
};
