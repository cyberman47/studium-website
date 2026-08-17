// Document-lesson content for "Memory & Cognition"
// (lib/mcatPath.ts's memory-cognition LessonContent entry).
// See lib/documentLesson.ts for the shared shape.
import { DocumentLessonContent } from "../documentLesson";

export const memoryCognitionContent: DocumentLessonContent = {
  lessonIntro: {
    description: "Memory isn't a single system—it's a sequence of stages and a set of distinct storage types, each with its own capacity, duration, and failure modes. This lesson covers the three stages of memory processing, the different types of long-term memory, and why forgetting happens.",
    objectives: [
      "Describe the three stages of memory: sensory, short-term/working, and long-term",
      "Distinguish explicit (episodic, semantic) from implicit (procedural) long-term memory",
      "Explain encoding, storage, and retrieval as the three memory processes",
      "Distinguish interference and decay as mechanisms of forgetting"
    ]
  },
  bigPicture: {
    flow: ["Sensory memory (brief, high capacity)", "Short-term/working memory (limited capacity, ~20-30 seconds)", "Encoding (often via rehearsal)", "Long-term memory (durable, largely unlimited)", "Retrieval"],
    caption: "Information has to survive a bottleneck at every stage—most of what hits sensory memory never reaches short-term memory, and most of what reaches short-term memory never gets encoded into long-term storage."
  },
  concepts: [
    {
      number: "01",
      id: "stages-of-memory",
      title: "Stages of Memory",
      difficulty: "UNDERSTAND",
      coreIdea: "Information moves through sensory memory (very brief, high capacity), short-term/working memory (limited capacity, brief duration), and long-term memory (durable, essentially unlimited capacity).",
      learn: [
        "Sensory memory holds a nearly complete, high-capacity but extremely brief (well under a second to a few seconds) snapshot of sensory input, mostly filtered out before conscious awareness; short-term memory (or working memory, when actively manipulating information) holds a small amount of information—classically estimated at about 7 ± 2 items—for roughly 20-30 seconds unless actively rehearsed.",
        "Long-term memory has a very large, essentially unlimited capacity and can store information for a lifetime; moving information from short-term to long-term memory (encoding) is helped substantially by rehearsal (repetition) and especially by elaborative rehearsal—connecting new information to existing knowledge, which produces much more durable memories than rote repetition alone."
      ],
      mcatConnection: "The distinct capacity/duration numbers for each stage (sensory: near-instant; short-term: ~7 items, ~30 seconds; long-term: essentially unlimited) are exactly the kind of concrete fact the exam likes to test directly, so having the general order of magnitude for each is worth memorizing precisely.",
      quickCheck: {
        prompt: "A student repeats a phone number to themselves just long enough to dial it, then immediately forgets it. Which memory stage was this information held in?",
        options: ["Sensory memory", "Short-term/working memory", "Long-term memory", "It never entered any memory stage"],
        correctIndex: 1,
        explanation: "Holding a small amount of information for a brief period (tens of seconds) via active rehearsal, without further encoding into durable storage, is the signature of short-term/working memory—sensory memory would last under a second, and long-term memory would persist well beyond the moment of dialing."
      },
      keyTakeaway: "Information flows through sensory memory (brief, high capacity), short-term/working memory (limited capacity, ~20-30 seconds), and long-term memory (durable, essentially unlimited); elaborative rehearsal helps move information into long-term storage."
    },
    {
      number: "02",
      id: "types-of-long-term-memory",
      title: "Types of Long-Term Memory",
      difficulty: "IDENTIFY",
      coreIdea: "Explicit (declarative) memory—episodic and semantic—requires conscious recall; implicit (nondeclarative) memory, especially procedural memory, doesn't and often survives damage that impairs explicit memory.",
      learn: [
        "Explicit (declarative) memory requires conscious, effortful recall and splits into episodic memory (personal experiences and events, tied to a specific time and place) and semantic memory (general facts and knowledge, not tied to when or where they were learned—like knowing the capital of France).",
        "Implicit (nondeclarative) memory doesn't require conscious recall and includes procedural memory (skills and habits, like riding a bicycle) along with priming and classically conditioned associations—implicit memory is famously preserved in some forms of amnesia even when explicit memory is severely impaired, showing the two systems rely on at least partially distinct brain mechanisms."
      ],
      mcatConnection: "Amnesia case studies are a classic MCAT setup for this exact distinction—a patient who can't recall new facts or events (explicit memory impaired) but can still learn new motor skills (procedural/implicit memory intact) is demonstrating that these are separable memory systems, not one unified faculty.",
      quickCheck: {
        prompt: "A patient with severe amnesia cannot remember meeting their therapist each session, yet steadily improves at a mirror-tracing task practiced across sessions, with no conscious memory of having practiced it before. This pattern illustrates:",
        options: ["Both explicit and implicit memory are impaired", "Explicit memory is impaired while implicit (procedural) memory remains intact", "Sensory memory is impaired while short-term memory is intact", "This pattern is impossible and would not actually occur"],
        correctIndex: 1,
        explanation: "Inability to consciously recall meeting the therapist reflects impaired explicit (episodic) memory, while improving at a skill without conscious awareness of having practiced it reflects intact implicit (procedural) memory—this is a real, well-documented dissociation in amnesia patients."
      },
      keyTakeaway: "Explicit memory (episodic and semantic) requires conscious recall; implicit memory (especially procedural) doesn't, and the two can be selectively impaired, showing they rely on distinct memory systems."
    },
    {
      number: "03",
      id: "forgetting",
      title: "Forgetting: Interference and Decay",
      difficulty: "REASON",
      coreIdea: "Interference (proactive and retroactive) and decay are two distinct mechanisms behind forgetting, alongside encoding failure and retrieval failure.",
      learn: [
        "Proactive interference occurs when older memories interfere with learning new information (an old phone number making a new one harder to learn); retroactive interference occurs when newly learned information interferes with recalling older memories (learning a new password making the old one harder to recall)—both describe genuine competition between memories, not a loss of the memory itself.",
        "Decay theory proposes that memories fade simply from disuse over time, independent of interference from other memories; encoding failure (information never got encoded into long-term memory in the first place) and retrieval failure (the memory exists but can't currently be accessed, as in a tip-of-the-tongue state) are two other distinct reasons information can seem forgotten."
      ],
      mcatConnection: "Proactive vs. retroactive interference is easy to keep straight with the direction each name implies: proactive interference reaches forward (old memory interferes with new learning), retroactive interference reaches backward (new memory interferes with old recall).",
      quickCheck: {
        prompt: "After memorizing a new address, a person finds it harder to remember their old address, which they knew well for years. What does this best illustrate?",
        options: ["Proactive interference", "Retroactive interference", "Sensory decay", "Encoding failure"],
        correctIndex: 1,
        explanation: "The newly learned information (new address) is interfering with recall of older information (old address)—new interfering with old is retroactive interference; proactive interference would instead be the old address making the new one harder to learn."
      },
      keyTakeaway: "Proactive interference is old memories disrupting new learning; retroactive interference is new memories disrupting old recall; decay, encoding failure, and retrieval failure are other distinct mechanisms behind apparent forgetting."
    }
  ]
};
