// Document-lesson content for "Fluids & Pressure"
// (lib/mcatPath.ts's fluids-pressure LessonContent entry).
// See lib/documentLesson.ts for the shared shape.
import { DocumentLessonContent } from "../documentLesson";

export const fluidsPressureContent: DocumentLessonContent = {
  lessonIntro: {
    description: "Fluid mechanics explains everything from why objects float to how blood pressure works, and it's built on just a handful of principles. This lesson covers hydrostatic pressure and Pascal's principle, buoyancy via Archimedes' principle, and the basics of fluid flow through the continuity equation and Bernoulli's equation.",
    objectives: [
      "Calculate hydrostatic pressure and apply Pascal's principle to hydraulic systems",
      "Apply Archimedes' principle to determine buoyant force and predict floating vs. sinking",
      "Apply the continuity equation to relate fluid velocity and cross-sectional area",
      "Apply Bernoulli's equation to relate pressure, velocity, and height in a flowing fluid"
    ]
  },
  bigPicture: {
    flow: ["Fluid at rest: hydrostatic pressure and Pascal's principle", "Object submerged: buoyant force (Archimedes)", "Fluid in motion: continuity equation constrains velocity", "Bernoulli's equation relates pressure, velocity, and height along the flow"],
    caption: "Fluids at rest and fluids in motion are governed by different (though related) principles—pressure and buoyancy describe a static fluid, while continuity and Bernoulli's equation take over once that fluid starts flowing."
  },
  concepts: [
    {
      number: "01",
      id: "hydrostatic-pressure-pascals-principle",
      title: "Hydrostatic Pressure and Pascal's Principle",
      difficulty: "UNDERSTAND",
      coreIdea: "Hydrostatic pressure increases with depth (P = ρgh); Pascal's principle states that a pressure change applied anywhere in an enclosed fluid is transmitted equally throughout the fluid.",
      learn: [
        "Pressure is force per unit area (P = F/A); within a static fluid, hydrostatic pressure increases with depth according to P = P0 + ρgh, where ρ is fluid density, g is gravitational acceleration, and h is depth—pressure at a given depth doesn't depend on the container's shape or the total amount of fluid, only on depth and density.",
        "Pascal's principle states that a pressure applied to an enclosed, incompressible fluid is transmitted undiminished to every point in the fluid and to the walls of its container—this is the operating principle behind hydraulic systems, where a small force applied over a small area can generate a much larger force over a larger area, since the pressure (not the force) is what's transmitted equally."
      ],
      mcatConnection: "Hydraulic lift problems are testing whether you recognize that pressure (not force) is equal on both sides of the system: F1/A1 = F2/A2, which is why a small input force over a small area can lift a much larger weight over a larger area.",
      quickCheck: {
        prompt: "A hydraulic lift has a small piston with area 2 cm² and a large piston with area 20 cm². A force of 10 N is applied to the small piston. What force is generated at the large piston?",
        options: ["10 N", "20 N", "100 N", "200 N"],
        correctIndex: 2,
        explanation: "By Pascal's principle, pressure is equal throughout: P = F1/A1 = F2/A2, so 10 N / 2 cm² = F2 / 20 cm², giving F2 = 100 N—the larger piston's larger area multiplies the output force, which is the entire point of a hydraulic system."
      },
      keyTakeaway: "Hydrostatic pressure increases with depth (P = ρgh); Pascal's principle states that pressure applied to an enclosed fluid transmits equally throughout, letting hydraulic systems multiply force using a difference in piston area."
    },
    {
      number: "02",
      id: "buoyancy-archimedes-principle",
      title: "Buoyancy and Archimedes' Principle",
      difficulty: "REASON",
      coreIdea: "Archimedes' principle states that the buoyant force on a submerged (or floating) object equals the weight of the fluid it displaces; an object floats if its average density is less than the fluid's density.",
      learn: [
        "Buoyant force arises because fluid pressure increases with depth, so the upward pressure on an object's bottom surface is greater than the downward pressure on its top surface—Archimedes' principle simplifies this into Fb = ρfluid × Vdisplaced × g, the weight of the fluid displaced by the submerged portion of the object.",
        "An object floats when its average density is less than the fluid's density (it displaces its own weight in fluid before being fully submerged) and sinks when its average density is greater (buoyant force can never equal its weight, even fully submerged)—an object with exactly equal density is neutrally buoyant and can remain suspended at any depth."
      ],
      mcatConnection: "The floating/sinking question always reduces to a simple density comparison—if you can estimate whether an object's average density is above or below the fluid's density, you already know whether it floats, without needing to calculate an exact buoyant force.",
      quickCheck: {
        prompt: "A solid block has a density of 0.8 g/mL and is placed in water (density 1.0 g/mL). What happens to the block?",
        options: ["It sinks to the bottom, since it has mass", "It floats, with part of it above the water's surface, since its density is less than water's", "It remains fully submerged but neutrally buoyant", "It cannot be determined without knowing its exact volume"],
        correctIndex: 1,
        explanation: "Since the block's density (0.8 g/mL) is less than water's density (1.0 g/mL), it floats—it will sink only until it displaces a volume of water whose weight equals its own weight, which happens before the block is fully submerged, leaving part of it above the surface."
      },
      keyTakeaway: "Archimedes' principle states buoyant force equals the weight of fluid displaced; an object floats if its average density is less than the fluid's, sinks if greater, and is neutrally buoyant if equal."
    },
    {
      number: "03",
      id: "fluid-dynamics",
      title: "Fluid Dynamics: Continuity and Bernoulli's Equation",
      difficulty: "REASON",
      coreIdea: "The continuity equation (A1v1 = A2v2) states that fluid speeds up where a pipe narrows; Bernoulli's equation shows that fluid pressure decreases where its speed increases, at the same height.",
      learn: [
        "For an incompressible fluid flowing through a pipe, the continuity equation (A1v1 = A2v2) states that volume flow rate must stay constant throughout the pipe—so fluid velocity increases where the pipe's cross-sectional area decreases (narrows), and decreases where it widens.",
        "Bernoulli's equation (P + ½ρv² + ρgh = constant along a streamline) is a statement of energy conservation for flowing fluid; at constant height, this means that as fluid speed increases, pressure must decrease to keep the total constant—this pressure drop in faster-moving regions explains phenomena like lift on an airplane wing and the Venturi effect."
      ],
      mcatConnection: "Combine continuity and Bernoulli's equation as one chain of reasoning: a narrower pipe segment (continuity) forces faster flow, and that faster flow (Bernoulli) corresponds to lower pressure at that same narrow point—recognizing this chain covers most fluid dynamics passages without needing to solve either equation numerically.",
      quickCheck: {
        prompt: "Water flows through a horizontal pipe that narrows partway along its length. Compared to the wider section, what happens to the water's speed and pressure in the narrower section?",
        options: ["Speed increases and pressure increases", "Speed increases and pressure decreases", "Speed decreases and pressure increases", "Speed decreases and pressure decreases"],
        correctIndex: 1,
        explanation: "By the continuity equation, a narrower cross-sectional area requires higher fluid velocity to maintain constant flow rate; by Bernoulli's equation, at the same height, that increased velocity corresponds to decreased pressure—speed up and pressure down together, not in the same direction."
      },
      keyTakeaway: "The continuity equation shows fluid speeds up in narrower sections of a pipe to conserve flow rate; Bernoulli's equation shows that, at constant height, faster-moving fluid has lower pressure."
    }
  ]
};
