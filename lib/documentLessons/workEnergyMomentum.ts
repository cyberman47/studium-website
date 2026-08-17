// Document-lesson content for "Work, Energy & Momentum"
// (lib/mcatPath.ts's work-energy-momentum LessonContent entry).
// See lib/documentLesson.ts for the shared shape.
import { DocumentLessonContent } from "../documentLesson";

export const workEnergyMomentumContent: DocumentLessonContent = {
  lessonIntro: {
    description: "Energy and momentum are two different conserved quantities that describe the same physical events from different angles, and knowing which one to reach for is half the battle. This lesson covers work and the work-energy theorem, conservation of mechanical energy and power, and how momentum conservation solves collision problems that energy alone can't.",
    objectives: [
      "Calculate work done by a force and apply the work-energy theorem",
      "Apply conservation of mechanical energy to systems with kinetic and potential energy",
      "Calculate power as the rate of work done",
      "Apply conservation of momentum to distinguish elastic from inelastic collisions"
    ]
  },
  bigPicture: {
    flow: ["Force acts over a distance", "Work done", "Changes kinetic and/or potential energy", "Total mechanical energy conserved (if no non-conservative forces)"],
    caption: "Energy conservation and momentum conservation are two independent bookkeeping systems for the same event—energy problems track how kinetic and potential energy trade off, while momentum problems track total motion before and after, and collisions typically need both."
  },
  concepts: [
    {
      number: "01",
      id: "work-energy-theorem",
      title: "Work and the Work-Energy Theorem",
      difficulty: "UNDERSTAND",
      coreIdea: "Work equals force times displacement in the direction of the force (W = Fd cos θ); the work-energy theorem states that net work done on an object equals its change in kinetic energy.",
      learn: [
        "Work is done only by the component of force that acts along the direction of displacement—W = Fd cos θ, where θ is the angle between the force and displacement vectors, so a force perpendicular to motion (like the normal force on a horizontally moving object) does zero work.",
        "The work-energy theorem states that the net work done on an object equals its change in kinetic energy (Wnet = ΔKE = ½mv² final - ½mv² initial)—this holds regardless of how complicated the forces involved are, since it only depends on the total (net) work done."
      ],
      mcatConnection: "The 'force perpendicular to motion does zero work' rule is a fast way to eliminate forces from a work calculation—for circular motion, this is exactly why centripetal force does zero work on an object moving at constant speed.",
      quickCheck: {
        prompt: "A satellite orbits the Earth in a perfect circle at constant speed. Gravity provides the centripetal force keeping it in orbit. How much work does gravity do on the satellite over one complete orbit?",
        options: ["A large positive amount, since gravity is a strong force", "A large negative amount, since gravity pulls inward", "Zero, since the gravitational force is always perpendicular to the satellite's velocity", "It depends on the satellite's mass"],
        correctIndex: 2,
        explanation: "In circular motion, the centripetal force (here, gravity) always points toward the center, perpendicular to the velocity (which is tangent to the circle)—since W = Fd cos θ and θ = 90° throughout, cos(90°) = 0, so gravity does zero net work over the orbit, consistent with the satellite's constant speed (and therefore constant kinetic energy)."
      },
      keyTakeaway: "Work equals force times displacement in the direction of motion (W = Fd cos θ), and the work-energy theorem states that net work done on an object equals its change in kinetic energy."
    },
    {
      number: "02",
      id: "conservation-of-energy-power",
      title: "Conservation of Energy and Power",
      difficulty: "REASON",
      coreIdea: "Total mechanical energy (kinetic + potential) is conserved in the absence of non-conservative forces like friction; power is the rate at which work is done or energy is transferred.",
      learn: [
        "In a system with only conservative forces (like gravity or an ideal spring), total mechanical energy (KE + PE) stays constant—energy converts between kinetic and potential forms (for example, a falling object trades gravitational potential energy for kinetic energy) but the total never changes; non-conservative forces like friction remove mechanical energy from the system, converting it to heat.",
        "Power is the rate of energy transfer or work done over time, P = W/t (or equivalently P = Fv for a constant force), measured in watts—two processes can do the same total amount of work, but the one that does it faster has a higher power output."
      ],
      mcatConnection: "Energy conservation problems are usually fastest solved by setting total mechanical energy at one point in the motion equal to total mechanical energy at another point, rather than tracking forces and accelerations through the whole path.",
      quickCheck: {
        prompt: "A ball is dropped from a height h and falls freely (no air resistance) to the ground. Using conservation of energy, what is its speed just before impact, in terms of h and g?",
        options: ["v = gh", "v = √(2gh)", "v = 2gh", "v = √(gh)"],
        correctIndex: 1,
        explanation: "Setting initial potential energy equal to final kinetic energy (since mechanical energy is conserved with no air resistance): mgh = ½mv², which simplifies to v = √(2gh)—mass cancels out entirely, which is why all objects (ignoring air resistance) fall at the same rate regardless of mass."
      },
      keyTakeaway: "Total mechanical energy (kinetic + potential) is conserved without non-conservative forces like friction; power (P = W/t) measures the rate of energy transfer or work done."
    },
    {
      number: "03",
      id: "momentum-collisions",
      title: "Momentum and Collisions",
      difficulty: "REASON",
      coreIdea: "Momentum (p = mv) is always conserved in a closed system (no external forces); kinetic energy is additionally conserved only in elastic collisions, not in inelastic collisions.",
      learn: [
        "Momentum (p = mv, a vector) is conserved for any closed system regardless of what type of collision occurs—total momentum before a collision equals total momentum after, even though individual objects' momenta can change dramatically.",
        "In an elastic collision, kinetic energy is also conserved (objects bounce off each other without permanent deformation or heat loss); in an inelastic collision, kinetic energy is not conserved (some converts to heat, sound, or deformation)—a perfectly inelastic collision is the extreme case where the objects stick together and move with a shared final velocity."
      ],
      mcatConnection: "The key distinguishing question for any collision problem is whether momentum alone is conserved (always true) or whether kinetic energy is also conserved (only true for elastic collisions)—assuming kinetic energy conservation in an inelastic collision is one of the most common setup errors.",
      quickCheck: {
        prompt: "Two identical train cars collide and lock together, moving as one unit after the collision. Which quantity(ies) are conserved in this collision?",
        options: ["Both momentum and kinetic energy are conserved", "Only momentum is conserved; kinetic energy is not, since this is a perfectly inelastic collision", "Only kinetic energy is conserved; momentum is not", "Neither momentum nor kinetic energy is conserved"],
        correctIndex: 1,
        explanation: "Momentum is conserved in any closed-system collision, including this one—but the cars sticking together (a perfectly inelastic collision) means kinetic energy is not conserved; some of it converts to heat, sound, and deformation during the collision."
      },
      keyTakeaway: "Momentum (p = mv) is conserved in any closed-system collision; kinetic energy is additionally conserved only in elastic collisions, while inelastic collisions (including perfectly inelastic, where objects stick together) lose kinetic energy to heat, sound, or deformation."
    }
  ]
};
