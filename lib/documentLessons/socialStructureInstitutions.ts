// Document-lesson content for "Social Structure & Institutions"
// (lib/mcatPath.ts's social-structure-institutions LessonContent entry).
// See lib/documentLesson.ts for the shared shape.
import { DocumentLessonContent } from "../documentLesson";

export const socialStructureInstitutionsContent: DocumentLessonContent = {
  lessonIntro: {
    description: "Sociology looks at behavior from a wider lens than psychology—not just individual minds, but the larger social structures and institutions people move through. This lesson covers the basic building blocks of social structure, the three major sociological perspectives, and the core social institutions every society organizes around.",
    objectives: [
      "Define status, role, and social institution",
      "Compare functionalism, conflict theory, and symbolic interactionism as sociological perspectives",
      "Distinguish ascribed from achieved status",
      "Identify the major social institutions and their functions"
    ]
  },
  bigPicture: {
    flow: ["Individuals occupy statuses", "Statuses come with expected roles", "Roles are organized within social institutions", "Institutions maintain (functionalism) or reproduce inequality (conflict theory) or are enacted through everyday interaction (symbolic interactionism)"],
    caption: "The three major sociological perspectives aren't testing different facts—they're different lenses for looking at the exact same social structure, and the exam mostly tests whether you can tell which lens a described explanation is using."
  },
  concepts: [
    {
      number: "01",
      id: "status-role-institutions",
      title: "Status, Role, and Social Institutions",
      difficulty: "IDENTIFY",
      coreIdea: "A status is a recognized social position (ascribed, given at birth, or achieved, earned through effort); a role is the expected behavior associated with a status; a social institution is an established pattern of roles and norms organized around a core societal function.",
      learn: [
        "An ascribed status is assigned at birth or involuntarily, without choice or effort (like being born into a particular family or, in many contexts, one's sex); an achieved status is earned through a person's own actions, choices, or efforts (like becoming a doctor or a parent); a role is the set of behaviors expected of someone occupying a given status.",
        "A social institution is an established, organized system of roles, norms, and relationships built around meeting a fundamental need of society—family, education, religion, government, and the economy are the major social institutions, each organizing a distinct set of statuses and roles around its core societal function."
      ],
      mcatConnection: "Ascribed vs. achieved status is a quick, reliable distinction the exam tests directly—the deciding question is simply whether the status was chosen/earned (achieved) or assigned without choice, typically at birth (ascribed).",
      quickCheck: {
        prompt: "Being born into a royal family is an example of which type of status, and becoming a licensed physician after years of training is an example of which?",
        options: ["Both are achieved statuses", "Both are ascribed statuses", "Royal family membership is ascribed; becoming a physician is achieved", "Royal family membership is achieved; becoming a physician is ascribed"],
        correctIndex: 2,
        explanation: "Being born into a royal family is assigned at birth without choice or effort, making it an ascribed status; becoming a physician requires years of deliberate effort and training, making it an achieved status."
      },
      keyTakeaway: "Ascribed status is assigned at birth or without choice; achieved status is earned through effort. A role is the expected behavior for a status, and social institutions are organized systems of roles and norms built around a core societal function."
    },
    {
      number: "02",
      id: "sociological-perspectives",
      title: "The Three Major Sociological Perspectives",
      difficulty: "REASON",
      coreIdea: "Functionalism views society as an interconnected system of parts working together for stability; conflict theory views society as shaped by competition and inequality between groups; symbolic interactionism views society as built up from everyday, meaning-making interactions between individuals.",
      learn: [
        "Functionalism (a macro-level, 'big picture' view) sees society as a system of interdependent parts, each serving a function that contributes to overall social stability—an institution persists because it serves some useful purpose for the whole system; conflict theory (also macro-level) instead sees society as shaped by ongoing competition between groups with unequal power and resources, with social structures often serving to maintain the advantage of already-powerful groups.",
        "Symbolic interactionism is a micro-level perspective, focused on how individuals create and interpret meaning through everyday face-to-face interaction and symbols (like language and gestures)—rather than analyzing large-scale social structures directly, it studies how those structures are actually built up from, and experienced through, countless small individual interactions."
      ],
      mcatConnection: "The exam frequently describes a sociological explanation for some social phenomenon and asks which perspective it reflects—functionalism explains via the function/purpose something serves for society, conflict theory explains via power/inequality between groups, and symbolic interactionism explains via meaning created in individual interactions.",
      quickCheck: {
        prompt: "A sociologist argues that the education system persists largely because wealthy, powerful groups use it to maintain their own social and economic advantage across generations. This explanation best reflects which perspective?",
        options: ["Functionalism", "Conflict theory", "Symbolic interactionism", "None of these perspectives address education"],
        correctIndex: 1,
        explanation: "Explaining a social institution's persistence in terms of power and the maintenance of advantage for already-powerful groups is the defining lens of conflict theory—functionalism would instead explain the institution's persistence in terms of the beneficial function it serves for society as a whole."
      },
      keyTakeaway: "Functionalism explains society via the function parts serve for overall stability; conflict theory explains it via competition and inequality between groups; symbolic interactionism explains it via meaning built up from everyday individual interactions."
    },
    {
      number: "03",
      id: "major-social-institutions",
      title: "Major Social Institutions",
      difficulty: "UNDERSTAND",
      coreIdea: "Family, education, religion, government, and the economy are the major social institutions, each organized around meeting a distinct, fundamental need of society.",
      learn: [
        "The family institution handles reproduction, early socialization, and emotional/economic support; the education institution transmits knowledge, skills, and cultural values across generations, and also serves a socializing and credentialing function; religion provides shared meaning, moral guidance, and social cohesion around a community's beliefs and rituals.",
        "Government provides social order, organizes collective decision-making, and enforces rules; the economy organizes the production, distribution, and consumption of goods and services—all five institutions are interconnected in practice (for example, the economy shapes what kind of education is valued, and government policy shapes family structure), which is exactly the kind of interdependence functionalism emphasizes."
      ],
      mcatConnection: "The exam sometimes gives a scenario and asks which social institution is most directly implicated—the fastest approach is asking which fundamental societal need (reproduction/socialization, knowledge transmission, shared meaning, social order, or resource distribution) the scenario is really about.",
      quickCheck: {
        prompt: "A society's schools are responsible for transmitting literacy, job-relevant skills, and shared cultural knowledge to each new generation. This describes the core function of which social institution?",
        options: ["Family", "Education", "Religion", "Government"],
        correctIndex: 1,
        explanation: "Transmitting knowledge, skills, and cultural values across generations is the defining core function of the education institution—family instead centers on reproduction and early socialization, religion on shared meaning and moral guidance, and government on social order and collective decision-making."
      },
      keyTakeaway: "Family, education, religion, government, and the economy are the major social institutions, each organized around a distinct fundamental societal need, and all interconnected with one another."
    }
  ]
};
