// Document-lesson content for "Circuits & Electricity"
// (lib/mcatPath.ts's circuits-electricity LessonContent entry).
// See lib/documentLesson.ts for the shared shape.
import { DocumentLessonContent } from "../documentLesson";

export const circuitsElectricityContent: DocumentLessonContent = {
  lessonIntro: {
    description: "Circuits take the charges and fields from electrostatics and put them in motion, using resistors and capacitors arranged in series and parallel to control current flow. This lesson covers Ohm's law, how resistors combine differently in series versus parallel circuits, and how power and capacitors fit into circuit calculations.",
    objectives: [
      "Apply Ohm's law (V = IR) to relate voltage, current, and resistance",
      "Calculate equivalent resistance for resistors in series and in parallel",
      "Calculate power dissipated in a circuit using P = IV = I²R",
      "Calculate equivalent capacitance for capacitors in series and in parallel"
    ]
  },
  bigPicture: {
    flow: ["Voltage source drives current", "Current flows through resistors (Ohm's law: V = IR)", "Series vs. parallel arrangement determines equivalent resistance", "Power dissipated as heat (P = IV)"],
    caption: "Every circuit calculation is built from the same three variables—voltage, current, resistance—related by Ohm's law; the only real complexity is figuring out how a circuit's specific arrangement of components combines them."
  },
  concepts: [
    {
      number: "01",
      id: "ohms-law-current-resistance",
      title: "Current, Resistance, and Ohm's Law",
      difficulty: "UNDERSTAND",
      coreIdea: "Ohm's law (V = IR) relates voltage, current, and resistance; conventional current flows from high to low potential (opposite the actual direction of electron flow).",
      learn: [
        "Current (I) is the rate of charge flow, measured in amperes; resistance (R) opposes current flow, measured in ohms, and depends on a material's resistivity, length, and cross-sectional area (longer, thinner, or more resistive wires have higher resistance).",
        "Ohm's law, V = IR, relates voltage (potential difference) across a component to the current through it and its resistance—conventional current is defined as flowing from higher to lower potential, which is the opposite direction that the actual negatively charged electrons move."
      ],
      mcatConnection: "Conventional current direction (positive-charge convention, opposite actual electron flow) is a frequent point of confusion—circuit diagrams and calculations universally use conventional current, so default to that unless a question specifically asks about electron movement.",
      quickCheck: {
        prompt: "A resistor with resistance 5 Ω has a voltage of 10 V across it. What is the current flowing through it?",
        options: ["0.5 A", "2 A", "15 A", "50 A"],
        correctIndex: 1,
        explanation: "By Ohm's law, I = V/R = 10 V / 5 Ω = 2 A."
      },
      keyTakeaway: "Ohm's law (V = IR) relates voltage, current, and resistance; conventional current flows from high to low potential, opposite the actual direction of electron flow."
    },
    {
      number: "02",
      id: "series-parallel-circuits",
      title: "Series and Parallel Circuits",
      difficulty: "REASON",
      coreIdea: "Resistors in series add directly (Req = R1 + R2 + ...) and share the same current; resistors in parallel combine reciprocally (1/Req = 1/R1 + 1/R2 + ...) and share the same voltage.",
      learn: [
        "In a series circuit, components are connected end-to-end along a single path, so the same current flows through each one, and their resistances simply add: Req = R1 + R2 + ...—voltage divides across series components proportionally to their resistance.",
        "In a parallel circuit, components are connected across the same two points, so each branch has the same voltage across it, but current divides among the branches (more current flows through the lower-resistance branch); equivalent resistance is found from 1/Req = 1/R1 + 1/R2 + ..., which is always less than the smallest individual resistance in the parallel combination."
      ],
      mcatConnection: "A fast sanity check: adding a resistor in parallel always decreases equivalent resistance (adding another path for current to flow), while adding a resistor in series always increases it—if a calculated equivalent resistance doesn't follow that pattern, revisit the setup.",
      quickCheck: {
        prompt: "Two identical 10 Ω resistors are connected in parallel. What is their equivalent resistance?",
        options: ["20 Ω", "10 Ω", "5 Ω", "0.2 Ω"],
        correctIndex: 2,
        explanation: "For resistors in parallel: 1/Req = 1/10 + 1/10 = 2/10, so Req = 10/2 = 5 Ω—equivalent resistance in parallel is always less than either individual resistor, consistent with providing an additional path for current."
      },
      keyTakeaway: "Series resistors add directly (Req = R1 + R2 + ...) and share current; parallel resistors combine reciprocally (1/Req = 1/R1 + 1/R2 + ...) and share voltage, with equivalent resistance always less than the smallest individual resistor."
    },
    {
      number: "03",
      id: "power-capacitor-circuits",
      title: "Power in Circuits and Capacitors",
      difficulty: "IDENTIFY",
      coreIdea: "Electrical power dissipated by a resistor is P = IV = I²R = V²/R; capacitors in circuits combine oppositely to resistors—parallel capacitances add directly, series capacitances combine reciprocally.",
      learn: [
        "Power dissipated by a resistive component can be calculated three equivalent ways depending on which variables are known: P = IV, P = I²R, or P = V²/R—all three come from combining the basic power definition with Ohm's law, and give the same answer for the same component.",
        "Capacitors combine the opposite way resistors do: capacitors in parallel add directly (Ceq = C1 + C2 + ..., since parallel plates effectively increase total plate area), while capacitors in series combine reciprocally (1/Ceq = 1/C1 + 1/C2 + ..., since series capacitors effectively increase the distance between the outermost plates)."
      ],
      mcatConnection: "Remembering that capacitors combine oppositely to resistors (parallel capacitors add like series resistors do, and vice versa) is worth memorizing as a pair, since it's an easy detail to mix up under time pressure.",
      quickCheck: {
        prompt: "A resistor carries a current of 2 A and has a voltage of 6 V across it. How much power does it dissipate?",
        options: ["3 W", "8 W", "12 W", "24 W"],
        correctIndex: 2,
        explanation: "Power is P = IV = (2 A)(6 V) = 12 W."
      },
      keyTakeaway: "Power dissipated by a resistor can be calculated as P = IV = I²R = V²/R; capacitors combine oppositely to resistors—parallel capacitances add directly, series capacitances combine reciprocally."
    }
  ]
};
