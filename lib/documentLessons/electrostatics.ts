// Document-lesson content for "Electrostatics"
// (lib/mcatPath.ts's electrostatics LessonContent entry).
// See lib/documentLesson.ts for the shared shape.
import { DocumentLessonContent } from "../documentLesson";

export const electrostaticsContent: DocumentLessonContent = {
  lessonIntro: {
    description: "Electrostatics is the foundation for every circuits and electricity topic that follows—charges at rest, the fields they create, and the potential energy stored between them. This lesson covers Coulomb's law and electric fields, electric potential and potential energy, and the basics of conductors and capacitors.",
    objectives: [
      "Apply Coulomb's law to calculate the force between two point charges",
      "Calculate electric field strength and use superposition for multiple charges",
      "Distinguish electric potential (V) from electric potential energy (U), and relate both to electric field",
      "Explain charge distribution on conductors and calculate capacitance"
    ]
  },
  bigPicture: {
    flow: ["Charge creates an electric field around it", "A second charge in that field experiences a force (Coulomb's law)", "Moving a charge through the field changes its potential energy", "Electric potential (V) describes this per unit charge"],
    caption: "Electric field and electric potential describe the same underlying situation from two angles—field tells you the force a charge would feel, potential tells you the energy it would have—and nearly every electrostatics problem is really about picking whichever lens makes the math easier."
  },
  concepts: [
    {
      number: "01",
      id: "coulombs-law-electric-fields",
      title: "Coulomb's Law and Electric Fields",
      difficulty: "UNDERSTAND",
      coreIdea: "Coulomb's law (F = kq1q2/r²) gives the force between two point charges; electric field (E = F/q) describes the force per unit charge that would be felt at a point in space, and fields from multiple charges add by superposition.",
      learn: [
        "Coulomb's law, F = kq1q2/r², gives the electrostatic force between two point charges, which is attractive for opposite charges and repulsive for like charges, and falls off with the square of the distance between them—doubling the distance reduces the force to one-quarter of its original value.",
        "Electric field (E = F/q, or directly E = kQ/r² from a source charge Q) describes the force per unit positive test charge at a given point in space, independent of whether a charge is actually there to feel it; when multiple charges are present, the net electric field at a point is the vector sum of each individual charge's field (superposition)."
      ],
      mcatConnection: "Electric field problems are often disguised superposition problems—when multiple charges are involved, calculate each one's individual field contribution first, then add them as vectors (accounting for direction), rather than trying to combine charges before calculating.",
      quickCheck: {
        prompt: "Two point charges are separated by a distance r, exerting a force F on each other. If the distance between them is tripled, what is the new force, in terms of F?",
        options: ["F/3", "F/9", "3F", "9F"],
        correctIndex: 1,
        explanation: "Coulomb's law shows force is inversely proportional to the square of distance; tripling the distance means the force is divided by 3² = 9, giving a new force of F/9."
      },
      keyTakeaway: "Coulomb's law (F = kq1q2/r²) gives the force between point charges, falling off with the square of distance; electric field (E = F/q) describes force per unit charge at a point, and fields from multiple sources add by superposition."
    },
    {
      number: "02",
      id: "electric-potential-energy",
      title: "Electric Potential and Potential Energy",
      difficulty: "REASON",
      coreIdea: "Electric potential (V = kQ/r) is potential energy per unit charge; electric potential energy (U = qV) is the actual energy a specific charge has at a location, and electric field points from high to low potential.",
      learn: [
        "Electric potential (V) is a property of a location in space set up by source charges, describing potential energy per unit charge (V = kQ/r for a point charge)—it's a scalar, not a vector, which often makes it easier to work with than electric field when combining contributions from multiple charges.",
        "Electric potential energy (U = qV) is the actual energy a specific charge q would have at a point with potential V; a positive charge naturally moves from high to low potential (releasing energy, like a ball rolling downhill), while a negative charge naturally moves from low to high potential—electric field lines always point in the direction of decreasing potential."
      ],
      mcatConnection: "Distinguishing potential (V, a property of a location, scalar) from potential energy (U, dependent on the specific charge placed there) is a frequent point of confusion—remember U = qV connects them, the same way gravitational PE = mgh connects height to a specific object's mass.",
      quickCheck: {
        prompt: "A positive charge is released from rest in a region with a decreasing electric potential in the direction of motion. What happens to its kinetic energy as it moves in that direction?",
        options: ["It decreases, since potential energy increases", "It increases, since potential energy decreases as the positive charge moves toward lower potential", "It stays constant, since energy is conserved", "It cannot be determined without knowing the charge's mass"],
        correctIndex: 1,
        explanation: "A positive charge naturally accelerates toward lower potential (analogous to a ball rolling downhill under gravity), converting potential energy into kinetic energy as it does so—by conservation of energy, its kinetic energy increases exactly as much as its potential energy (U = qV) decreases."
      },
      keyTakeaway: "Electric potential (V) is potential energy per unit charge at a location; electric potential energy (U = qV) depends on the actual charge placed there; electric field points from high to low potential, and positive charges accelerate toward lower potential."
    },
    {
      number: "03",
      id: "conductors-capacitors",
      title: "Conductors and Capacitors",
      difficulty: "IDENTIFY",
      coreIdea: "Charge on a conductor at equilibrium resides entirely on its outer surface, with zero electric field inside; a capacitor stores charge and energy proportional to voltage, with capacitance C = Q/V.",
      learn: [
        "In electrostatic equilibrium, excess charge on a conductor resides entirely on its outer surface, and the electric field inside the conductor's material is zero—any internal field would drive charges to keep moving until they redistribute to cancel it out, which is the equilibrium condition itself.",
        "A capacitor stores charge and electrical energy between two conductive plates separated by an insulator; capacitance (C = Q/V) measures how much charge a capacitor stores per volt of potential difference across it, and for a parallel plate capacitor, capacitance increases with plate area and decreases with the distance between plates."
      ],
      mcatConnection: "The 'zero field inside a conductor' fact is the basis for electrostatic shielding (a Faraday cage)—a conductor's interior is protected from external electric fields, since charges on its surface rearrange to cancel any field that would otherwise penetrate inside.",
      quickCheck: {
        prompt: "A solid conductor carries a net positive charge and is in electrostatic equilibrium. Where does this excess charge reside, and what is the electric field inside the conductor's material?",
        options: ["The charge is distributed evenly throughout the conductor's volume; the field inside is nonzero", "The charge resides entirely on the outer surface; the field inside the conductor's material is zero", "The charge resides at the exact center; the field inside is at a maximum", "The charge and field distribution cannot be determined for a conductor"],
        correctIndex: 1,
        explanation: "At electrostatic equilibrium, excess charge on a conductor moves to the outer surface, and the electric field within the conducting material itself is zero—any nonzero internal field would continue pushing charges until equilibrium (zero internal field) is reached."
      },
      keyTakeaway: "Excess charge on a conductor at equilibrium resides on its outer surface, with zero electric field inside; a capacitor stores charge proportional to voltage (C = Q/V), with capacitance depending on plate geometry."
    }
  ]
};
