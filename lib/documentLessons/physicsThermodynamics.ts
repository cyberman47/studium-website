// Document-lesson content for "Thermodynamics" (physics)
// (lib/mcatPath.ts's physics-thermodynamics LessonContent entry).
// See lib/documentLesson.ts for the shared shape.
import { DocumentLessonContent } from "../documentLesson";

export const physicsThermodynamicsContent: DocumentLessonContent = {
  lessonIntro: {
    description: "Physics thermodynamics revisits energy, heat, and temperature from a systems perspective—how heat moves, how energy is conserved (or isn't perfectly usable), and how to read the processes gases undergo on a PV diagram. This lesson covers heat transfer mechanisms, the laws of thermodynamics, and interpreting PV diagrams.",
    objectives: [
      "Distinguish conduction, convection, and radiation as mechanisms of heat transfer",
      "State the first and second laws of thermodynamics and apply ΔU = Q - W",
      "Explain why no heat engine can be perfectly (100%) efficient",
      "Interpret isothermal, adiabatic, isobaric, and isochoric processes on a PV diagram"
    ]
  },
  bigPicture: {
    flow: ["Heat transfers via conduction, convection, or radiation", "System's internal energy changes (first law: ΔU = Q - W)", "Some energy is inevitably unusable for work (second law)", "Process type (isothermal/adiabatic/isobaric/isochoric) shown on a PV diagram"],
    caption: "The first law is pure bookkeeping—energy in equals energy out, no exceptions—while the second law is the reason that bookkeeping is never perfectly reversible: some energy always ends up as unusable heat."
  },
  concepts: [
    {
      number: "01",
      id: "heat-transfer-mechanisms",
      title: "Heat Transfer: Conduction, Convection, Radiation",
      difficulty: "UNDERSTAND",
      coreIdea: "Heat transfers by conduction (direct contact, molecule-to-molecule), convection (movement of fluid carrying heat), or radiation (electromagnetic waves, requiring no medium).",
      learn: [
        "Conduction transfers heat through direct contact between particles (like heat traveling through a metal rod being heated at one end); convection transfers heat through the bulk movement of a fluid (like warm air rising and being replaced by cooler air)—both require a medium (matter) to occur.",
        "Radiation transfers heat through electromagnetic waves and requires no medium at all—it's how the Sun's energy reaches Earth through the vacuum of space, and every object above absolute zero radiates some thermal energy this way."
      ],
      mcatConnection: "Radiation being the only mechanism that works through a vacuum is a frequently tested distinction—if a passage describes heat transfer with no matter present between two objects, it must be radiation, since conduction and convection both require a physical medium.",
      quickCheck: {
        prompt: "Which mechanism of heat transfer can occur through the vacuum of space, with no matter present between the heat source and the object being warmed?",
        options: ["Conduction", "Convection", "Radiation", "None of these can transfer heat through a vacuum"],
        correctIndex: 2,
        explanation: "Radiation transfers heat via electromagnetic waves, which don't require a medium to propagate—conduction and convection both require direct particle contact or fluid movement, neither of which is possible in a vacuum."
      },
      keyTakeaway: "Conduction (direct contact) and convection (fluid movement) both require a medium; radiation (electromagnetic waves) does not and can transfer heat through a vacuum."
    },
    {
      number: "02",
      id: "laws-of-thermodynamics",
      title: "The Laws of Thermodynamics",
      difficulty: "REASON",
      coreIdea: "The first law of thermodynamics (ΔU = Q - W) is energy conservation for a system; the second law states that total entropy of an isolated system never decreases, which is why no heat engine can be 100% efficient.",
      learn: [
        "The first law of thermodynamics, ΔU = Q - W, states that a system's change in internal energy equals heat added to the system minus work done by the system—this is simply energy conservation applied to thermodynamic systems, and it holds regardless of the specific process involved.",
        "The second law of thermodynamics states that the total entropy of an isolated system never decreases over time (it stays the same for a reversible process, or increases for a real, irreversible one)—a direct consequence is that no heat engine can convert 100% of input heat into useful work; some heat must always be released to a cooler reservoir, setting a maximum possible efficiency for any real engine."
      ],
      mcatConnection: "The second law's most testable consequence is simply that perfect efficiency (100%) is thermodynamically impossible for any real engine or process—if an answer choice implies otherwise, it violates the second law and can be eliminated on that basis alone.",
      quickCheck: {
        prompt: "An engineer claims to have designed a heat engine that converts 100% of the heat it absorbs into useful work, with no heat released to a cooler reservoir. What does the second law of thermodynamics say about this claim?",
        options: ["It is possible with a sufficiently well-designed engine", "It is impossible, since some heat must always be released to a cooler reservoir, limiting efficiency to below 100%", "The first law of thermodynamics, not the second, addresses this claim", "It is possible only for engines operating at very high temperatures"],
        correctIndex: 1,
        explanation: "The second law of thermodynamics requires that some heat always be exhausted to a cooler reservoir in any real heat engine cycle, making 100% efficiency thermodynamically impossible—this holds true regardless of engineering quality or operating temperature, though higher temperature differences can increase the theoretical maximum efficiency."
      },
      keyTakeaway: "The first law (ΔU = Q - W) is energy conservation for thermodynamic systems; the second law states entropy never decreases in an isolated system, which is why no real heat engine can be 100% efficient."
    },
    {
      number: "03",
      id: "pv-diagrams-processes",
      title: "PV Diagrams and Thermodynamic Processes",
      difficulty: "IDENTIFY",
      coreIdea: "A PV diagram plots pressure vs. volume for a gas; isothermal (constant T), adiabatic (no heat exchange), isobaric (constant P), and isochoric (constant V) processes each trace a characteristic path, and the area under the curve equals work done.",
      learn: [
        "On a PV diagram, an isobaric process traces a horizontal line (constant pressure) and an isochoric process traces a vertical line (constant volume, so no work is done, since W = PΔV = 0); an isothermal process (constant temperature) traces a curve following PV = constant, and an adiabatic process (Q = 0, no heat exchange) traces a similar but steeper curve.",
        "The area under a process's path on a PV diagram equals the work done by the gas during that process (W = ∫PdV)—for a full cycle that returns to its starting point, the enclosed area of the loop equals the net work done over that cycle."
      ],
      mcatConnection: "Recognizing a process type from its shape on a PV diagram (horizontal = isobaric, vertical = isochoric) is usually faster than working through the underlying equations—and remembering that isochoric processes do zero work (no volume change) is a frequent shortcut for eliminating answer choices.",
      quickCheck: {
        prompt: "A gas undergoes a process during which its volume does not change at all, though its pressure and temperature both increase. How much work is done by the gas during this process?",
        options: ["A large positive amount of work", "A large negative amount of work", "Zero work, since work depends on a change in volume and none occurred", "It cannot be determined without knowing the exact pressure change"],
        correctIndex: 2,
        explanation: "Work done by a gas is W = ∫PdV (or PΔV for a constant-pressure process); with no change in volume (an isochoric process), ΔV = 0, so no work is done regardless of how much pressure or temperature changes."
      },
      keyTakeaway: "PV diagrams show characteristic paths for isobaric (horizontal), isochoric (vertical, zero work), isothermal (PV = constant curve), and adiabatic (steeper curve, no heat exchange) processes, with the area under the path equal to work done."
    }
  ]
};
