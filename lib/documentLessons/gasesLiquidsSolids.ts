// Document-lesson content for "Gases, Liquids & Solids"
// (lib/mcatPath.ts's gases-liquids-solids LessonContent entry).
// See lib/documentLesson.ts for the shared shape.
import { DocumentLessonContent } from "../documentLesson";

export const gasesLiquidsSolidsContent: DocumentLessonContent = {
  lessonIntro: {
    description: "Matter's three common phases behave predictably once you understand the forces holding particles together. This lesson covers the ideal gas law and kinetic molecular theory, the intermolecular forces that explain why real gases and liquids deviate from ideal behavior, and how phase changes and phase diagrams map out when a substance is solid, liquid, or gas.",
    objectives: [
      "Apply the ideal gas law (PV = nRT) and Dalton's law of partial pressures",
      "Explain when and why real gases deviate from ideal behavior",
      "Rank and identify intermolecular forces: London dispersion, dipole-dipole, and hydrogen bonding",
      "Interpret heating curves and phase diagrams, including triple and critical points"
    ]
  },
  bigPicture: {
    flow: ["Kinetic molecular theory (ideal gas assumptions)", "Real gases deviate at high P / low T", "Intermolecular forces explain the deviation", "Same forces determine liquid/solid behavior and phase changes"],
    caption: "Gas laws describe an idealized world with no intermolecular forces; the moment you ask why real substances condense into liquids and solids, intermolecular forces become the whole explanation."
  },
  concepts: [
    {
      number: "01",
      id: "gas-laws",
      title: "Gas Laws and Kinetic Molecular Theory",
      difficulty: "UNDERSTAND",
      coreIdea: "The ideal gas law (PV = nRT) relates pressure, volume, moles, and temperature for an idealized gas; Dalton's law states that total pressure is the sum of each gas's partial pressure in a mixture.",
      learn: [
        "The ideal gas law, PV = nRT, combines Boyle's law (P and V inversely related at constant T, n), Charles's law (V and T directly related at constant P, n), and Avogadro's law (V and n directly related) into one equation, assuming gas particles have negligible volume and no intermolecular attraction.",
        "In a mixture of gases, Dalton's law of partial pressures says each gas contributes to the total pressure independently and proportionally to its mole fraction: Ptotal = P1 + P2 + ... , with each Pi = (mole fraction of gas i) × Ptotal."
      ],
      mcatConnection: "Gas law problems often hide a units trap (temperature must be in Kelvin, pressure and volume units must match R's units)—converting units correctly before plugging into PV = nRT is worth more points than memorizing the constant's exact value.",
      quickCheck: {
        prompt: "A rigid, sealed container holds a fixed amount of gas. If the temperature is increased, what happens to the pressure, according to the ideal gas law?",
        options: ["Pressure decreases, since volume must decrease to compensate", "Pressure increases, since temperature and pressure are directly proportional at constant volume and moles", "Pressure stays the same, since only volume changes with temperature", "It cannot be determined without knowing the specific gas"],
        correctIndex: 1,
        explanation: "With n and V fixed, PV = nRT rearranges to P = (nR/V)T, showing P and T are directly proportional—increasing temperature increases the average kinetic energy and collision force of gas particles against the rigid walls, raising pressure; volume can't change since the container is rigid."
      },
      keyTakeaway: "PV = nRT relates the four gas variables for an idealized gas; Dalton's law states that total pressure in a gas mixture is the sum of each component's partial pressure."
    },
    {
      number: "02",
      id: "real-gases-imf",
      title: "Real Gases and Intermolecular Forces",
      difficulty: "REASON",
      coreIdea: "Real gases deviate from ideal behavior most at high pressure and low temperature, where intermolecular forces (London dispersion, dipole-dipole, hydrogen bonding) become significant.",
      learn: [
        "The ideal gas law assumes no intermolecular attraction and negligible particle volume; real gases deviate from this most at high pressure (particles are forced close together, so their actual volume and attractions matter) and low temperature (particles move slowly enough for attractive forces to have a noticeable effect).",
        "Intermolecular forces increase in strength from London dispersion forces (present in all molecules, from temporary dipoles; strength increases with more electrons/surface area) to dipole-dipole forces (between polar molecules) to hydrogen bonding (a strong dipole-dipole interaction present only when H is bonded directly to N, O, or F)."
      ],
      mcatConnection: "The exam often asks you to rank compounds by boiling point, which is really asking you to rank intermolecular force strength—identify the strongest IMF present in each molecule first (hydrogen bonding beats dipole-dipole beats dispersion), then break ties with molecular size for dispersion forces.",
      quickCheck: {
        prompt: "Why does water (H2O, boiling point 100°C) have a much higher boiling point than H2S (boiling point -60°C), despite both having similar molecular shapes and comparable molar mass?",
        options: ["H2O molecules are heavier, giving them stronger London dispersion forces", "Water can form hydrogen bonds (H bonded to O), while H2S cannot form meaningful hydrogen bonds", "H2S is a much larger molecule", "Boiling point is unrelated to intermolecular forces"],
        correctIndex: 1,
        explanation: "Water's H-O bonds allow strong hydrogen bonding between molecules, while sulfur's lower electronegativity means H2S only has weaker dipole-dipole and dispersion forces—far more energy is needed to overcome water's hydrogen bonds, raising its boiling point significantly despite similar molar mass."
      },
      keyTakeaway: "Real gases deviate from ideal behavior at high pressure and low temperature, where intermolecular forces (dispersion < dipole-dipole < hydrogen bonding, in increasing strength) become significant enough to matter."
    },
    {
      number: "03",
      id: "phase-changes-diagrams",
      title: "Phase Changes and Phase Diagrams",
      difficulty: "IDENTIFY",
      coreIdea: "A heating curve shows temperature plateaus during phase changes (energy goes into breaking intermolecular forces, not raising temperature); a phase diagram maps which phase is stable at each pressure/temperature, including the triple point and critical point.",
      learn: [
        "On a heating curve, temperature rises steadily while a substance stays in one phase, but plateaus during a phase change (melting or boiling)—during the plateau, added heat is being used entirely to overcome intermolecular forces and separate particles, not to increase kinetic energy/temperature.",
        "A phase diagram plots pressure vs. temperature, with regions showing which phase (solid, liquid, gas) is stable; the triple point is the unique condition where all three phases coexist in equilibrium, and the critical point is where the liquid-gas boundary ends, beyond which liquid and gas become indistinguishable (a supercritical fluid)."
      ],
      mcatConnection: "Heating curve plateau questions test whether you understand that temperature is a measure of kinetic energy, not total energy—during a phase change, energy is absolutely still being added, it's just going toward breaking intermolecular attractions instead of speeding particles up.",
      quickCheck: {
        prompt: "On a heating curve for water, the temperature remains at 100°C for several minutes while heat is continuously added as the liquid boils into vapor. Where is this added energy going?",
        options: ["It isn't being added; the heat source has stopped", "Increasing the kinetic energy of the water molecules", "Overcoming intermolecular forces (hydrogen bonds) to separate liquid molecules into gas", "Decreasing the entropy of the system"],
        correctIndex: 2,
        explanation: "During a phase change, added energy goes into breaking intermolecular forces to separate particles into the next phase, not into raising kinetic energy (which is what temperature measures)—that's exactly why temperature plateaus instead of continuing to rise, and entropy increases (not decreases) going from liquid to gas."
      },
      keyTakeaway: "Heating curve plateaus mark phase changes, where added energy overcomes intermolecular forces rather than raising temperature; phase diagrams map stable phases by pressure and temperature, including the triple point (all three phases coexist) and critical point (liquid/gas distinction disappears)."
    }
  ]
};
