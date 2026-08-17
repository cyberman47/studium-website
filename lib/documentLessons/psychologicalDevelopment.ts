// Document-lesson content for "Psychological Development"
// (lib/mcatPath.ts's psychological-development LessonContent entry).
// See lib/documentLesson.ts for the shared shape.
import { DocumentLessonContent } from "../documentLesson";

export const psychologicalDevelopmentContent: DocumentLessonContent = {
  lessonIntro: {
    description: "Development doesn't stop at childhood, but the classic developmental theories mostly focus on how cognition, social bonds, and identity unfold across the lifespan in a predictable sequence. This lesson covers Piaget's stages of cognitive development, Erikson's psychosocial stages, and attachment theory.",
    objectives: [
      "Describe Piaget's four stages of cognitive development and their key milestones",
      "Describe Erikson's psychosocial stages and the central conflict at each",
      "Explain attachment styles and their basis in the Strange Situation procedure",
      "Compare Piaget's and Erikson's stage theories in terms of what they each track"
    ]
  },
  bigPicture: {
    flow: ["Sensorimotor (object permanence)", "Preoperational (symbolic thought, egocentrism)", "Concrete operational (conservation, logical thought about concrete objects)", "Formal operational (abstract reasoning)"],
    caption: "Piaget's stages track how a child's thinking itself changes—not just what a child knows, but the fundamentally different way each stage's child is capable of reasoning about the world at all."
  },
  concepts: [
    {
      number: "01",
      id: "piagets-cognitive-development",
      title: "Piaget's Stages of Cognitive Development",
      difficulty: "IDENTIFY",
      coreIdea: "Piaget proposed four stages of cognitive development—sensorimotor, preoperational, concrete operational, and formal operational—each marked by a qualitatively different way of thinking, not just more knowledge.",
      learn: [
        "In the sensorimotor stage (birth to ~2 years), infants learn through senses and motor actions and develop object permanence (understanding that objects continue to exist even when out of sight); in the preoperational stage (~2-7 years), children develop symbolic thought and language but display egocentrism (difficulty seeing a situation from another's perspective) and lack conservation (understanding that quantity stays the same despite a change in shape or appearance).",
        "In the concrete operational stage (~7-11 years), children gain conservation and can reason logically about concrete, physical objects and events, but still struggle with abstract or hypothetical reasoning; in the formal operational stage (~12+ years), adolescents and adults gain the capacity for abstract, hypothetical, and systematic logical reasoning."
      ],
      mcatConnection: "Conservation and object permanence are the two most frequently tested single concepts from Piaget—a child failing to understand that a tall, thin glass and a short, wide glass can hold the same amount of liquid is the textbook conservation task, and it's exactly the kind of scenario the exam uses to test whether you recognize the preoperational stage.",
      quickCheck: {
        prompt: "A young child watches water poured from a short, wide glass into a tall, thin glass and insists the tall glass now has 'more' water, despite the amount being unchanged. This failure to understand conservation is most characteristic of which stage?",
        options: ["Sensorimotor", "Preoperational", "Concrete operational", "Formal operational"],
        correctIndex: 1,
        explanation: "Lacking conservation—the understanding that quantity remains constant despite a change in appearance—is a defining limitation of the preoperational stage; children typically gain conservation upon entering the concrete operational stage."
      },
      keyTakeaway: "Piaget's four stages (sensorimotor, preoperational, concrete operational, formal operational) each represent a qualitatively different mode of thinking, marked by milestones like object permanence, conservation, and abstract reasoning."
    },
    {
      number: "02",
      id: "eriksons-psychosocial-stages",
      title: "Erikson's Psychosocial Stages",
      difficulty: "REASON",
      coreIdea: "Erikson proposed eight psychosocial stages across the entire lifespan, each centered on a specific social/emotional conflict that must be navigated, unlike Piaget's stages, which focus specifically on cognitive development in childhood and adolescence.",
      learn: [
        "Erikson's stages span the whole lifespan (unlike Piaget's, which end in adolescence), each defined by a central conflict: infancy's trust vs. mistrust (does the world feel safe and reliable), early childhood's autonomy vs. shame/doubt, and adolescence's identity vs. role confusion (developing a coherent sense of self) are among the most frequently tested.",
        "Later stages include young adulthood's intimacy vs. isolation (forming close, committed relationships), middle adulthood's generativity vs. stagnation (contributing to future generations vs. feeling unproductive), and late adulthood's integrity vs. despair (looking back on life with satisfaction vs. regret)—successfully resolving each stage's conflict builds a foundation for navigating the next."
      ],
      mcatConnection: "Erikson's stages are frequently confused with Piaget's on the exam because both are ordered developmental stage theories—the reliable way to tell them apart is that Erikson's are about social/emotional conflicts and span the whole lifespan, while Piaget's are about cognitive reasoning ability and stop at adolescence.",
      quickCheck: {
        prompt: "A teenager is actively exploring different career paths, belief systems, and social roles while trying to figure out 'who they are.' According to Erikson, this reflects the central conflict of which stage?",
        options: ["Trust vs. mistrust", "Identity vs. role confusion", "Intimacy vs. isolation", "Generativity vs. stagnation"],
        correctIndex: 1,
        explanation: "Adolescence's central conflict, per Erikson, is identity vs. role confusion—actively exploring roles, values, and beliefs to form a coherent sense of self is exactly this stage's developmental task."
      },
      keyTakeaway: "Erikson's eight psychosocial stages span the entire lifespan, each centered on a specific social/emotional conflict (like trust vs. mistrust, identity vs. role confusion, intimacy vs. isolation)—distinct from Piaget's cognitive stages, which end in adolescence."
    },
    {
      number: "03",
      id: "attachment-theory",
      title: "Attachment Theory",
      difficulty: "IDENTIFY",
      coreIdea: "Attachment theory (Bowlby, Ainsworth) describes the emotional bond between infant and caregiver; the Strange Situation procedure identifies distinct attachment styles—secure, avoidant, anxious/ambivalent, and disorganized.",
      learn: [
        "Bowlby proposed that infants have an innate drive to form an attachment bond with a primary caregiver, which serves as a secure base for exploring the world; Ainsworth's Strange Situation procedure observes how an infant reacts to their caregiver leaving and returning (along with a stranger's presence) to classify attachment style.",
        "Securely attached infants are distressed when the caregiver leaves but are readily comforted upon their return; avoidant infants show little distress at separation and largely ignore the caregiver upon return; anxious/ambivalent infants are highly distressed at separation but show mixed, hard-to-soothe reactions upon return (seeking contact while also resisting it); disorganized attachment shows inconsistent, sometimes contradictory behavior with no clear coping strategy."
      ],
      mcatConnection: "The Strange Situation and its resulting attachment styles are frequently tested by describing an infant's specific reaction pattern and asking you to classify the attachment style—the key distinguishing detail is almost always how the infant behaves specifically upon the caregiver's return, not just at separation.",
      quickCheck: {
        prompt: "In the Strange Situation, an infant shows significant distress when the caregiver leaves, but upon the caregiver's return, seeks contact while simultaneously pushing them away and remaining difficult to soothe. This pattern is most consistent with which attachment style?",
        options: ["Secure attachment", "Avoidant attachment", "Anxious/ambivalent attachment", "There is no attachment style matching this description"],
        correctIndex: 2,
        explanation: "The combination of high distress at separation with mixed, hard-to-soothe behavior upon return (seeking contact while also resisting it) is the defining pattern of anxious/ambivalent attachment—secure infants are readily comforted upon return, and avoidant infants show little distress and largely ignore the caregiver."
      },
      keyTakeaway: "Attachment theory describes the infant-caregiver emotional bond; the Strange Situation procedure classifies attachment style (secure, avoidant, anxious/ambivalent, disorganized) based primarily on the infant's reaction to the caregiver's return."
    }
  ]
};
