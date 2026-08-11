// Real, Studium-authored short articles—same honesty bar as the hand-written
// MCAT biology lessons in lib/mcatPath.ts: genuine educational content with
// a real author byline ("Studium"), not placeholder/lorem text. There is no
// article-authoring UI yet (out of scope for this pass), so this is a fixed
// editorial set rather than a user-generated store—save state for these
// still runs through the real lib/myLibrary.ts reference system, so "Save"
// genuinely persists per student.

export type Article = {
  id: string;
  title: string;
  description: string;
  topic: string;
  readingMinutes: number;
  source: string;       // byline shown on the card, matches spec's "Source/creator"
  publishedAt: string;
  body: string[];       // paragraphs
};

export const articles: Article[] = [
  {
    id: "article-spaced-repetition",
    title: "How Spaced Repetition Actually Works",
    description: "The real cognitive science behind why reviewing a flashcard right before you'd forget it works better than cramming.",
    topic: "Study Skills",
    readingMinutes: 4,
    source: "Studium",
    publishedAt: "2026-06-02",
    body: [
      "Spaced repetition is built on a simple observation from memory research: every time you recall something, the memory gets a little more durable, and the ideal moment to review it again is right before you'd otherwise forget it—not the day after you learned it, and not a month later.",
      "Review too soon and you're wasting time on something you already know cold. Review too late and you've lost the thread entirely, so you're relearning instead of reinforcing. Spaced repetition systems (the same idea behind Studium's flashcard boxes) track how well you know each card and stretch the interval between reviews every time you get it right—1 day, then 2, then 4, then 8—so your review time concentrates on exactly the material sitting on the edge of being forgotten.",
      "This is also why cramming feels productive but doesn't stick: massed practice (studying the same thing repeatedly in one sitting) creates a strong short-term memory that fades fast, because your brain never had to do the work of retrieving it after a gap. Spaced practice is slower to feel mastered but dramatically more durable, which is the entire trade a board exam actually rewards.",
      "The practical takeaway: rate a card honestly. Marking something \"Easy\" when you guessed right pushes it further out than it should go and it'll resurface half-forgotten; marking it \"Again\" when you genuinely knew it just wastes a review slot. The system only works as well as the honesty of your own self-assessment feeds it."
    ]
  },
  {
    id: "article-cars-section",
    title: "Understanding the MCAT CARS Section",
    description: "What Critical Analysis and Reasoning Skills actually tests, and why it can't be studied the way the science sections can.",
    topic: "MCAT",
    readingMinutes: 5,
    source: "Studium",
    publishedAt: "2026-06-09",
    body: [
      "CARS—Critical Analysis and Reasoning Skills—is the one MCAT section with no science content at all. It presents nine passages, drawn from the humanities and social sciences (philosophy, ethics, history, art, cultural studies), each followed by five to seven questions, in 90 minutes total.",
      "What it's actually testing isn't outside knowledge—you're never expected to already know the subject of the passage—it's whether you can extract an author's central argument, distinguish it from supporting details, recognize the author's tone and assumptions, and apply that argument to a new hypothetical scenario the question poses.",
      "This is why CARS resists the flashcard-and-repetition approach that works for Biology or Biochemistry: there's no fact to memorize. The skill that improves it is close, active reading practice—reading a passage and being able to state its argument in one sentence before you even look at the questions—done consistently over weeks, not crammed the week before the exam.",
      "A common trap is treating CARS questions like a vocabulary or trivia check. The correct answer is almost always the one that best represents what the passage's author is actually arguing, not the most factually true statement in a vacuum—an answer choice can be true and still wrong if the passage never claims it."
    ]
  },
  {
    id: "article-enzyme-kinetics",
    title: "Enzyme Kinetics: A Quick Primer",
    description: "Km, Vmax, and how competitive vs. noncompetitive inhibition actually change an enzyme's kinetic curve.",
    topic: "Biochemistry",
    readingMinutes: 4,
    source: "Studium",
    publishedAt: "2026-06-16",
    body: [
      "An enzyme's reaction rate depends on how much substrate is around, but not in a straight line—it follows Michaelis-Menten kinetics, a curve that rises steeply at low substrate concentration and flattens out as the enzyme becomes saturated. Two numbers describe that curve: Vmax, the maximum rate the enzyme can reach once every active site is occupied, and Km, the substrate concentration at which the reaction runs at exactly half of Vmax.",
      "Km is really a proxy for the enzyme's affinity for its substrate: a low Km means the enzyme reaches half-max speed at a low substrate concentration, which means it binds substrate tightly (high affinity). A high Km means it takes a lot of substrate before the enzyme gets going, i.e. weaker affinity.",
      "Inhibitors change this picture in two characteristic ways. A competitive inhibitor competes with the real substrate for the same active site—give the reaction enough substrate and it can out-compete the inhibitor, so Vmax is unchanged, but it takes more substrate to get there, so Km increases. A noncompetitive inhibitor binds somewhere else on the enzyme entirely, so more substrate can't dislodge it—Vmax drops because some fraction of the enzyme is permanently disabled, while Km stays the same since the inhibitor doesn't interfere with substrate binding itself.",
      "The fast way to remember which is which: competitive inhibition moves Km, not Vmax (you can still get there, just need more substrate); noncompetitive inhibition moves Vmax, not Km (you'll never get there, no matter how much substrate you add)."
    ]
  },
  {
    id: "article-central-dogma",
    title: "The Central Dogma: DNA to Protein",
    description: "A tight refresher on transcription and translation—the two-step path from a gene to a working protein.",
    topic: "Molecular Biology",
    readingMinutes: 5,
    source: "Studium",
    publishedAt: "2026-06-23",
    body: [
      "The central dogma of molecular biology describes the one-way flow of genetic information: DNA is transcribed into RNA, and RNA is translated into protein. Each step uses a different molecular machine and a different \"language.\"",
      "Transcription happens in the nucleus. RNA polymerase reads one strand of DNA (the template strand) and builds a complementary strand of messenger RNA (mRNA), swapping thymine for uracil. Eukaryotic pre-mRNA then gets processed before it's ready to leave the nucleus: a 5' cap and poly-A tail are added, and introns (non-coding sequences) are spliced out, leaving only exons joined together.",
      "Translation happens at the ribosome, in the cytoplasm. Transfer RNA (tRNA) molecules, each carrying a specific amino acid and a three-base anticodon, match up against the mRNA's codons three bases at a time. The ribosome walks along the mRNA, and as each tRNA's anticodon pairs with the matching codon, its amino acid gets added to a growing polypeptide chain—until a stop codon is reached and the finished protein is released.",
      "The reason this matters beyond memorization: nearly every category of genetic mutation—point mutations, frameshifts, splice-site mutations—does its damage by disrupting one specific step of this pathway, so understanding the pathway itself is what lets you reason through an unfamiliar mutation question instead of memorizing every mutation type as an isolated fact."
    ]
  },
  {
    id: "article-reading-ecg",
    title: "Reading an ECG: The Absolute Basics",
    description: "What the P wave, QRS complex, and T wave each represent, before you ever try to spot an abnormality.",
    topic: "Physiology",
    readingMinutes: 4,
    source: "Studium",
    publishedAt: "2026-06-30",
    body: [
      "An electrocardiogram (ECG/EKG) records the heart's electrical activity as a wave, and the three main features of a single normal beat each correspond to a distinct part of that cycle.",
      "The P wave is small and comes first—it's the electrical signal spreading across the atria, triggering atrial contraction. The QRS complex is the tall, sharp spike right after it: this is ventricular depolarization, the much larger electrical signal that triggers the ventricles (the heart's main pumping chambers) to contract. It's large because the ventricles have far more muscle mass than the atria. The T wave, a smaller rounded bump after the QRS complex, represents ventricular repolarization—the electrical \"reset\" the ventricles go through before the next beat.",
      "One detail that trips people up: atrial repolarization also happens, but it's a small signal that occurs at the same time as the much larger QRS complex, so it's normally hidden inside it and isn't a separate visible wave.",
      "This basic vocabulary—P wave, QRS complex, T wave—is the foundation every ECG abnormality gets described relative to: a prolonged PR interval, a widened QRS, an elevated ST segment. Learning to recognize a genuinely normal beat first is what makes an abnormal one actually stand out."
    ]
  },
  {
    id: "article-study-schedule",
    title: "What Makes a Good Study Schedule",
    description: "Three real, well-supported principles for structuring study time—not a rigid hour-by-hour template.",
    topic: "Study Skills",
    readingMinutes: 3,
    source: "Studium",
    publishedAt: "2026-07-07",
    body: [
      "A study schedule that actually holds up over months tends to share three traits, regardless of the exact hours someone chooses.",
      "First, it interleaves subjects rather than blocking them into long single-subject stretches. Studying Biology for six straight hours feels efficient in the moment, but switching between two or three related subjects within a session (interleaving) has been shown to improve long-term retention and, more importantly, your ability to tell topics apart under exam conditions—which is exactly the skill a mixed-question exam actually tests.",
      "Second, it treats review time as non-negotiable, not something that only happens \"if there's time left.\" New material is what makes a schedule feel productive, but it's the scheduled review of older material—via spaced repetition—that's actually responsible for what you still remember on exam day.",
      "Third, it's realistic about daily capacity. A schedule that assumes eight focused hours a day, every day, for months tends to collapse the first time real life intrudes, and a collapsed schedule is demoralizing in a way that quietly discourages restarting it. A smaller, sustainable daily target that you can actually hit consistently outperforms an ambitious one you abandon after a week."
    ]
  }
];

export function getArticles(): Article[] {
  return articles.slice().sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function getArticle(id: string): Article | undefined {
  return articles.find(a => a.id === id);
}

export function getArticleTopics(): string[] {
  return Array.from(new Set(articles.map(a => a.topic))).sort();
}
