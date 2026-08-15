// Document-lesson content for "Cardiovascular & Respiratory Systems"
// (lib/mcatPath.ts's cardiovascular-respiratory-systems LessonContent
// entry)—restructured from that same real entry. See lib/documentLesson.ts
// for the shared shape.
import { DocumentLessonContent } from "../documentLesson";

export const cardiovascularRespiratorySystemsContent: DocumentLessonContent = {
  lessonIntro: {
    description: "Getting oxygen from the air into working tissue takes two closely coordinated systems. This lesson covers the heart's dual-circuit pumping, how blood vessels are built for their specific jobs, and how breathing mechanics and gas diffusion get oxygen where it's needed—faster, thanks to the Bohr effect.",
    objectives: [
      "Trace blood through the pulmonary and systemic circuits",
      "Distinguish arteries, veins, and capillaries by structure and function",
      "Explain what drives inhalation and exhalation",
      "Explain the Bohr effect and why it benefits active tissue"
    ]
  },
  bigPicture: {
    flow: ["Right ventricle", "Lungs (pick up O2)", "Left ventricle", "Body (deliver O2)"],
    caption: "Blood runs two circuits in series, not parallel—it must complete the short pulmonary loop to pick up oxygen before the long systemic loop can deliver it anywhere."
  },
  concepts: [
    {
      number: "01",
      id: "heart-cardiac-cycle",
      title: "Heart Structure and the Cardiac Cycle",
      difficulty: "UNDERSTAND",
      coreIdea: "Blood follows two circuits in series: pulmonary (heart→lungs→heart, picking up oxygen) and systemic (heart→body→heart, delivering it).",
      learn: [
        "The heart has four chambers: two atria (receiving blood) and two ventricles (pumping blood out), separated by one-way valves that prevent backflow. Deoxygenated blood returns to the right atrium, passes to the right ventricle, and is pumped to the lungs (pulmonary circuit) to pick up oxygen.",
        "Oxygenated blood returns to the left atrium, passes to the left ventricle, and is pumped to the body (systemic circuit). The cardiac cycle alternates between systole (ventricular contraction, ejecting blood) and diastole (ventricular relaxation, filling with blood)."
      ],
      mcatConnection: "Tracing a blood cell's exact path through all four chambers and both circuits, in order, is a foundational skill the exam assumes—being able to state it without hesitation saves real time on cardiovascular passages.",
      quickCheck: {
        prompt: "Which chamber of the heart pumps blood into the systemic circuit?",
        options: ["Right atrium", "Right ventricle", "Left atrium", "Left ventricle"],
        correctIndex: 3,
        explanation: "The left ventricle pumps oxygenated blood out into the systemic circuit to the body—the right ventricle instead pumps into the pulmonary circuit, and the atria receive blood rather than pumping it out to the body."
      },
      keyTakeaway: "Blood moves through two circuits in series: the pulmonary circuit (right heart→lungs, picks up O2) then the systemic circuit (left heart→body, delivers O2)."
    },
    {
      number: "02",
      id: "blood-vessels-pressure",
      title: "Blood Vessels and Blood Pressure",
      difficulty: "IDENTIFY",
      coreIdea: "Arteries (thick, high-pressure) carry blood from the heart; capillaries (thin) enable exchange; veins (low-pressure, valved) return blood to the heart.",
      learn: [
        "Arteries carry blood away from the heart under high pressure, with thick, elastic, muscular walls; veins carry blood back to the heart under low pressure, with thinner walls and one-way valves to prevent backflow.",
        "Capillaries, the thinnest vessels, are the actual site of gas and nutrient exchange with tissues, thanks to their single-cell-thick walls. Blood pressure is regulated by multiple systems, including baroreceptors (which detect pressure changes and adjust heart rate/vessel diameter) and the kidneys (via blood volume regulation)."
      ],
      mcatConnection: "Each vessel type's structure directly explains its function—expect the exam to describe a structural feature (thin walls, valves, muscular walls) and ask you to infer the vessel type or its role from that alone.",
      quickCheck: {
        prompt: "Why are capillary walls only one cell thick, unlike arteries and veins?",
        options: ["To withstand high pressure", "To allow efficient diffusion of gases and nutrients across the wall", "To store blood between heartbeats", "To prevent backflow of blood"],
        correctIndex: 1,
        explanation: "Thin, single-cell walls minimize the diffusion distance, enabling efficient gas and nutrient exchange with tissue—capillaries operate under low pressure, aren't a storage site, and preventing backflow is the role of venous valves instead."
      },
      keyTakeaway: "Vessel structure matches function: thick, muscular arteries handle high pressure, thin capillaries enable exchange, and valved veins return low-pressure blood to the heart."
    },
    {
      number: "03",
      id: "respiratory-gas-exchange",
      title: "Respiratory Mechanics and Gas Exchange",
      difficulty: "REASON",
      coreIdea: "Ventilation moves air via pressure changes from the diaphragm; gas exchange at alveoli follows partial pressure gradients, and the Bohr effect boosts oxygen delivery to active tissue.",
      learn: [
        "Breathing (ventilation) is driven by the diaphragm and intercostal muscles: contraction expands the chest cavity, lowering pressure inside the lungs and drawing air in; relaxation reverses this, pushing air out. Gas exchange occurs at the alveoli, tiny air sacs surrounded by capillaries, where oxygen and carbon dioxide diffuse down their partial pressure gradients.",
        "The Bohr effect describes how lower pH (higher CO2, as in actively respiring tissue) shifts hemoglobin's oxygen-binding curve to release oxygen more readily exactly where it's needed most."
      ],
      mcatConnection: "The Bohr effect is a favorite because it links three systems at once—respiratory (CO2/pH), cardiovascular (hemoglobin), and metabolism (active tissue producing CO2)—so passages often use it as the payoff insight tying a whole question set together.",
      quickCheck: {
        prompt: "During exercise, actively respiring muscle tissue produces more CO2, lowering local pH. What effect does this have on oxygen delivery, according to the Bohr effect?",
        options: ["Hemoglobin binds oxygen more tightly, reducing delivery", "Hemoglobin releases oxygen more readily, increasing delivery to the tissue", "Oxygen delivery is unaffected by pH changes", "CO2 directly replaces oxygen in the blood"],
        correctIndex: 1,
        explanation: "The Bohr effect describes lower pH shifting hemoglobin to release oxygen more readily, delivering more oxygen to actively respiring tissue—the opposite (tighter binding) is not what occurs, and pH does measurably affect hemoglobin's oxygen affinity."
      },
      keyTakeaway: "Ventilation is driven by pressure changes from diaphragm movement; gas exchange follows partial pressure gradients at the alveoli, and the Bohr effect tunes oxygen release toward tissue that needs it most."
    }
  ]
};
