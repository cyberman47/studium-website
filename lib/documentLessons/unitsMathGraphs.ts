// Document-lesson content for "Units, Math & Graphs"
// (lib/mcatPath.ts's units-math-graphs LessonContent entry).
// See lib/documentLesson.ts for the shared shape.
import { DocumentLessonContent } from "../documentLesson";

export const unitsMathGraphsContent: DocumentLessonContent = {
  lessonIntro: {
    description: "Physics on the MCAT isn't a calculator exam—it's testing whether you can reason through units, vectors, and graphs quickly and correctly. This lesson covers dimensional analysis as an error-checking tool, the distinction between scalar and vector quantities, and how to pull real physical meaning out of a graph's slope and area.",
    objectives: [
      "Use dimensional analysis to convert units and check whether an equation is set up correctly",
      "Distinguish scalar quantities from vector quantities and perform basic vector addition",
      "Interpret a graph's slope as a rate and its area as an accumulated quantity",
      "Apply these tools together to sanity-check physics calculations quickly"
    ]
  },
  bigPicture: {
    flow: ["Identify the quantity's units", "Check the equation's units match on both sides", "If vector, break into components", "Read graphs for slope (rate) and area (accumulation)"],
    caption: "These aren't separate topics so much as a toolkit—dimensional analysis, vectors, and graph reading are the three checks you run on almost every other physics problem on the exam."
  },
  concepts: [
    {
      number: "01",
      id: "units-dimensional-analysis",
      title: "Units and Dimensional Analysis",
      difficulty: "UNDERSTAND",
      coreIdea: "Dimensional analysis converts between units by canceling them like algebraic factors, and checking that units match on both sides of an equation is a fast way to catch a wrong formula.",
      learn: [
        "Converting between units means multiplying by conversion factors (fractions equal to 1, like 1000 m / 1 km) arranged so that unwanted units cancel out, leaving only the desired unit—this same technique works whether converting a single unit or working through a multi-step calculation.",
        "Every valid physics equation must have matching units on both sides; if your calculated units don't match what the answer should be (for example, getting m/s when the question asks for a distance in meters), that's a reliable sign that a step in the calculation or the equation itself is wrong."
      ],
      mcatConnection: "Under time pressure, doing a quick units check on your final answer is one of the fastest ways to catch an error before submitting—if the units don't match what's being asked for, something upstream in the calculation went wrong.",
      quickCheck: {
        prompt: "A problem asks you to calculate a velocity, but after plugging numbers into your equation, your final units come out to m/s². What does this indicate?",
        options: ["The answer is correct; m/s² is an acceptable unit for velocity", "An error was made somewhere, since velocity should have units of m/s, not m/s²", "Units don't need to match for velocity calculations", "The equation must have been for acceleration all along, so no error occurred"],
        correctIndex: 1,
        explanation: "Velocity has units of distance/time (m/s); getting m/s² (distance/time²) signals a units mismatch, which reliably indicates a setup or arithmetic error somewhere in the calculation—recognizing that mismatch immediately, rather than only at the end, is exactly what makes dimensional analysis a fast error-catching tool."
      },
      keyTakeaway: "Dimensional analysis converts units by canceling them algebraically, and checking that units match on both sides of an equation is a quick, reliable way to catch calculation errors."
    },
    {
      number: "02",
      id: "scalars-vectors",
      title: "Scalars vs. Vectors",
      difficulty: "IDENTIFY",
      coreIdea: "Scalar quantities have only magnitude (like speed or mass); vector quantities have both magnitude and direction (like velocity or force), and must be added using components, not simple arithmetic.",
      learn: [
        "Scalars (mass, speed, distance, energy, temperature) are fully described by a single number and unit; vectors (displacement, velocity, acceleration, force, momentum) require both a magnitude and a direction to be fully described—confusing a vector with its scalar counterpart (like velocity vs. speed) is a common source of error.",
        "Adding vectors requires accounting for direction: vectors pointing in the same direction add directly, opposite-direction vectors subtract, and vectors at an angle are typically broken into perpendicular (usually x and y) components first, added component-by-component, then recombined using the Pythagorean theorem for magnitude."
      ],
      mcatConnection: "Distance vs. displacement and speed vs. velocity are the most commonly tested scalar/vector pairs—a runner completing a full lap has traveled a real, nonzero distance but has zero net displacement, since they end up back where they started.",
      quickCheck: {
        prompt: "A car travels 3 km east, then 4 km north. What is the magnitude of its total displacement (as a vector), and how does this compare to the total distance traveled?",
        options: ["Displacement is 7 km, the same as the distance traveled", "Displacement is 5 km, less than the 7 km distance traveled, since displacement accounts for direction", "Displacement and distance are always identical", "Displacement cannot be calculated without knowing the car's speed"],
        correctIndex: 1,
        explanation: "Distance traveled (a scalar) is simply the total path length: 3 + 4 = 7 km; displacement (a vector) is the straight-line distance from start to end, found using the Pythagorean theorem: √(3² + 4²) = √25 = 5 km—displacement is generally less than or equal to distance, since it accounts for direction rather than just path length."
      },
      keyTakeaway: "Scalars (speed, distance, mass) have magnitude only; vectors (velocity, displacement, force) have magnitude and direction, and must be combined using component addition rather than simple arithmetic."
    },
    {
      number: "03",
      id: "graph-interpretation",
      title: "Interpreting Graphs",
      difficulty: "REASON",
      coreIdea: "A graph's slope represents the rate of change between the y- and x-axis quantities, and the area under a graph represents the accumulated product of those two quantities.",
      learn: [
        "The slope of a graph (rise/run) equals the rate of change of the y-axis quantity with respect to the x-axis quantity—on a position-vs-time graph, slope is velocity; on a velocity-vs-time graph, slope is acceleration; recognizing this pattern lets you extract rates from any graph without needing a separate formula for each one.",
        "The area under a graph equals the accumulated product of the y-axis and x-axis quantities—on a velocity-vs-time graph, the area under the curve equals displacement; on a force-vs-displacement graph, the area under the curve equals work done."
      ],
      mcatConnection: "This slope/area pattern generalizes across the entire physics section (and into other sciences), so instead of memorizing 'area under a v-t graph is displacement' as an isolated fact, recognize it as one instance of the general 'area = accumulated product of the two axes' rule.",
      quickCheck: {
        prompt: "On a velocity-vs-time graph, the region between the curve and the time axis over a certain interval represents which physical quantity?",
        options: ["Acceleration during that interval", "The displacement that occurred during that interval", "The object's mass", "The instantaneous velocity at the end of the interval"],
        correctIndex: 1,
        explanation: "The area under a velocity-vs-time graph equals velocity multiplied by time, which is displacement—acceleration would instead be read from the graph's slope, not its area, and mass isn't represented on this graph at all."
      },
      keyTakeaway: "A graph's slope represents the rate of change between its two axes (like velocity from a position-time graph); the area under a graph represents the accumulated product of its two axes (like displacement from a velocity-time graph)."
    }
  ]
};
