// Document-lesson content for "Kinematics & Newtonian Mechanics"
// (lib/mcatPath.ts's kinematics-newtonian-mechanics LessonContent entry).
// See lib/documentLesson.ts for the shared shape.
import { DocumentLessonContent } from "../documentLesson";

export const kinematicsNewtonianMechanicsContent: DocumentLessonContent = {
  lessonIntro: {
    description: "Kinematics describes how objects move; Newton's laws explain why they move that way. This lesson covers the kinematics equations for constant acceleration (including projectile motion), Newton's three laws of motion, and how to use free-body diagrams to apply those laws to real forces like friction, tension, and normal force.",
    objectives: [
      "Apply the kinematics equations to solve for displacement, velocity, acceleration, or time under constant acceleration",
      "Analyze projectile motion by separating it into independent horizontal and vertical components",
      "State and apply Newton's first, second, and third laws",
      "Draw free-body diagrams and apply Newton's second law to systems involving friction, tension, and normal force"
    ]
  },
  bigPicture: {
    flow: ["Identify all forces on an object (free-body diagram)", "Net force via Newton's second law (F = ma)", "Resulting acceleration", "Kinematics equations describe the resulting motion"],
    caption: "Mechanics problems generally run in one direction: figure out the net force, get an acceleration from F = ma, then let the kinematics equations describe how position and velocity change over time."
  },
  concepts: [
    {
      number: "01",
      id: "kinematics-equations-projectile-motion",
      title: "Kinematics Equations and Projectile Motion",
      difficulty: "IDENTIFY",
      coreIdea: "The kinematics equations relate displacement, initial/final velocity, acceleration, and time under constant acceleration; projectile motion treats horizontal and vertical motion as independent, connected only by time.",
      learn: [
        "For constant acceleration, four kinematics equations connect displacement (Δx), initial velocity (v0), final velocity (v), acceleration (a), and time (t)—given any three of these variables, one of the four equations can solve for a fourth, making it important to identify which variables a problem gives you and which equation omits the one you don't have.",
        "Projectile motion (like a ball thrown at an angle) is solved by splitting velocity into horizontal and vertical components: horizontal velocity is constant (no horizontal acceleration, ignoring air resistance), while vertical motion accelerates constantly downward at g (9.8 m/s²)—the two components are independent except that they share the same total time of flight."
      ],
      mcatConnection: "Projectile motion problems are really just two separate 1D kinematics problems happening at once, connected only by a shared time variable—solve the vertical motion first (often to find total time in the air), then use that time in the horizontal equation.",
      quickCheck: {
        prompt: "A ball is thrown horizontally off a cliff with some initial horizontal velocity. Ignoring air resistance, what happens to its horizontal velocity as it falls?",
        options: ["It increases due to gravity", "It decreases due to gravity", "It stays constant, since gravity only acts vertically", "It becomes zero immediately after being thrown"],
        correctIndex: 2,
        explanation: "Gravity acts only in the vertical direction, so it has no effect on horizontal velocity, which remains constant throughout the fall (ignoring air resistance)—only the vertical velocity component changes, accelerating downward at g."
      },
      keyTakeaway: "The kinematics equations relate displacement, velocity, acceleration, and time under constant acceleration; projectile motion treats horizontal (constant velocity) and vertical (constant downward acceleration) motion as independent, linked only through shared time."
    },
    {
      number: "02",
      id: "newtons-laws",
      title: "Newton's Three Laws",
      difficulty: "UNDERSTAND",
      coreIdea: "Newton's first law (inertia): an object's velocity stays constant unless acted on by a net force. Second law: F = ma. Third law: every force has an equal, opposite reaction force.",
      learn: [
        "Newton's first law states that an object at rest stays at rest, and an object in motion stays in motion at constant velocity, unless acted on by a net external force—this property of resisting a change in motion is called inertia, and it's proportional to an object's mass.",
        "Newton's second law, F = ma, states that the net force on an object equals its mass times its acceleration; Newton's third law states that when one object exerts a force on a second object, the second object exerts an equal and opposite force back on the first—these two forces act on different objects, so they never cancel each other out."
      ],
      mcatConnection: "The third law is the one most often misapplied—remember the action and reaction forces act on two different objects (not the same object), so they can never be added together to find a net force on either object individually.",
      quickCheck: {
        prompt: "A book rests on a table. The table exerts an upward normal force on the book, and by Newton's third law, the book exerts an equal, opposite downward force on the table. Why don't these two forces cancel out and allow the book to remain motionless without needing to consider them further?",
        options: ["They do cancel out, and that's exactly why the book doesn't accelerate", "They act on two different objects (the book and the table), so they can't be summed to find the net force on either individual object", "The book's weight is a separate, third force not related to this pair", "Newton's third law doesn't apply to objects at rest"],
        correctIndex: 1,
        explanation: "Newton's third law pairs always act on two different objects—the normal force on the book (from the table) and the reaction force on the table (from the book) can never be added together to analyze either object alone; the book itself is in equilibrium because the normal force on it balances its own weight (gravity), a completely separate pair of forces both acting on the book."
      },
      keyTakeaway: "Newton's first law describes inertia (no net force, no change in velocity), the second law is F = ma, and the third law states that force pairs are equal, opposite, and act on two different objects (so they never cancel for a single object's motion analysis)."
    },
    {
      number: "03",
      id: "free-body-diagrams-forces",
      title: "Free-Body Diagrams and Common Forces",
      difficulty: "REASON",
      coreIdea: "A free-body diagram isolates one object and shows every force acting on it; applying Newton's second law to that diagram (summing forces in each direction) is the standard method for solving force problems involving friction, tension, and normal force.",
      learn: [
        "A free-body diagram represents an object as a single point with arrows for every force acting on it (gravity, normal force, tension, friction, applied force), each drawn in its correct direction and roughly correct relative magnitude—forces are then summed separately along perpendicular axes (usually horizontal and vertical, or parallel/perpendicular to an incline).",
        "Friction opposes relative motion (or attempted motion) between two surfaces: static friction (up to a maximum value) prevents an object from starting to move, while kinetic friction (generally smaller than the maximum static friction) acts on an object already sliding, both proportional to the normal force between the surfaces."
      ],
      mcatConnection: "The habit worth building is always drawing the free-body diagram before writing any equations—it's easy to forget a force (or add one that isn't really there) when working purely symbolically, and the diagram forces you to account for everything acting on the object.",
      quickCheck: {
        prompt: "A box sits stationary on a rough, level floor. A small horizontal force is applied to it, but the box does not move. What force is balancing the applied force?",
        options: ["Gravity", "Normal force", "Static friction", "Tension"],
        correctIndex: 2,
        explanation: "Since the box remains stationary despite an applied horizontal force, static friction must be exactly balancing it (static friction adjusts up to its maximum value to prevent motion)—normal force balances gravity vertically, but the applied force and its opposing force here are both horizontal, which is exactly friction's role."
      },
      keyTakeaway: "A free-body diagram isolates every force on an object, letting Newton's second law be applied separately along each axis; friction (static up to a max, kinetic while sliding) is proportional to normal force and opposes relative motion between surfaces."
    }
  ]
};
