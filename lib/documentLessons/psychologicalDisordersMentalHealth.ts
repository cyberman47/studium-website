// Document-lesson content for "Psychological Disorders & Mental Health"
// (lib/mcatPath.ts's psychological-disorders-mental-health LessonContent entry).
// See lib/documentLesson.ts for the shared shape.
import { DocumentLessonContent } from "../documentLesson";

export const psychologicalDisordersMentalHealthContent: DocumentLessonContent = {
  lessonIntro: {
    description: "Classifying and understanding mental disorders requires looking at biological, psychological, and social factors together, not any single cause in isolation. This lesson covers the biopsychosocial model of mental illness, the major categories of anxiety and mood disorders, and schizophrenia spectrum disorders.",
    objectives: [
      "Explain the biopsychosocial model as applied to mental disorders",
      "Distinguish generalized anxiety disorder, panic disorder, and specific phobias",
      "Distinguish major depressive disorder from bipolar disorder",
      "Describe the positive and negative symptoms of schizophrenia"
    ]
  },
  bigPicture: {
    flow: ["Biological factors (genetics, neurotransmitters)", "+ Psychological factors (thought patterns, coping)", "+ Social factors (stress, support, environment)", "= Risk and expression of a mental disorder"],
    caption: "No mental disorder on the MCAT is explained by biology, psychology, or environment alone—the biopsychosocial model's whole point is that all three factors combine to produce risk and shape how a disorder actually presents."
  },
  concepts: [
    {
      number: "01",
      id: "biopsychosocial-model",
      title: "Classifying Disorders: The Biopsychosocial Model",
      difficulty: "UNDERSTAND",
      coreIdea: "The biopsychosocial model explains mental disorders as arising from the interaction of biological (genetics, neurochemistry), psychological (thought patterns, coping styles), and social (stress, relationships, culture) factors together, not any one alone.",
      learn: [
        "Biological factors include genetic predisposition and neurotransmitter imbalances (like altered serotonin or dopamine signaling); psychological factors include learned thought patterns, coping mechanisms, and past experiences; social factors include stressful life events, social support (or lack of it), and cultural context—the biopsychosocial model insists that a full explanation for any disorder must draw from all three domains.",
        "This model directly replaced older single-cause explanations of mental illness (purely biological or purely psychological) because in practice, disorders are shaped by the interaction of all three—for example, someone with a genetic predisposition to depression (biological) may remain well until a major stressful life event (social) interacting with a pessimistic thinking style (psychological) triggers an episode."
      ],
      mcatConnection: "When a passage describes multiple contributing factors to a mental health outcome, it's very likely illustrating the biopsychosocial model directly—look for the question to ask you to classify each factor mentioned into its biological, psychological, or social category.",
      quickCheck: {
        prompt: "A researcher explains a patient's depressive episode by pointing to a family history of depression (genetics), a tendency toward negative self-talk, and the recent loss of a job. This explanation best reflects:",
        options: ["A purely biological model of mental illness", "A purely psychological model of mental illness", "The biopsychosocial model, integrating biological, psychological, and social factors", "The biopsychosocial model does not apply to depression specifically"],
        correctIndex: 2,
        explanation: "This explanation combines a biological factor (genetic family history), a psychological factor (negative self-talk), and a social factor (job loss)—drawing on all three domains together is exactly what the biopsychosocial model proposes, rather than attributing the episode to any single cause."
      },
      keyTakeaway: "The biopsychosocial model explains mental disorders as arising from the interaction of biological, psychological, and social factors together, rather than any single cause in isolation."
    },
    {
      number: "02",
      id: "anxiety-mood-disorders",
      title: "Anxiety and Mood Disorders",
      difficulty: "IDENTIFY",
      coreIdea: "Anxiety disorders (generalized anxiety, panic disorder, specific phobias) share excessive fear or worry as a core feature but differ in pattern and trigger; mood disorders split into major depressive disorder (persistent low mood) and bipolar disorder (alternating depressive and manic episodes).",
      learn: [
        "Generalized anxiety disorder involves persistent, excessive worry across many areas of life, not tied to one specific trigger; panic disorder involves recurrent, unexpected panic attacks (sudden, intense episodes of fear with physical symptoms like a racing heart) along with persistent worry about having more attacks; specific phobias involve intense, irrational fear of a specific object or situation.",
        "Major depressive disorder involves a persistently low mood and/or loss of interest in activities, along with other symptoms (sleep/appetite changes, fatigue, difficulty concentrating), lasting at least two weeks; bipolar disorder involves episodes of mania or hypomania (abnormally elevated mood, energy, and impulsivity) alternating with depressive episodes—the presence of manic episodes is what distinguishes bipolar disorder from major depressive disorder, not just mood severity."
      ],
      mcatConnection: "The key distinguishing detail between panic disorder and a specific phobia is whether the fear/panic is tied to a specific trigger (phobia) or occurs unexpectedly, seemingly out of nowhere (panic disorder)—and between depression and bipolar disorder, the deciding factor is always the presence or absence of manic episodes, not simply how depressed someone feels.",
      quickCheck: {
        prompt: "A patient experiences sudden, unexpected episodes of intense fear, heart palpitations, and shortness of breath that occur without any specific trigger, along with persistent worry about when the next episode will happen. This is most consistent with:",
        options: ["A specific phobia", "Panic disorder", "Generalized anxiety disorder", "Bipolar disorder"],
        correctIndex: 1,
        explanation: "Sudden, unexpected panic attacks (not tied to a specific trigger) combined with persistent worry about future attacks is the defining pattern of panic disorder—a specific phobia would instead involve fear tied to a specific, identifiable object or situation."
      },
      keyTakeaway: "Anxiety disorders share excessive fear/worry but differ in pattern (generalized worry, unexpected panic attacks, or a specific trigger); bipolar disorder is distinguished from major depressive disorder specifically by the presence of manic or hypomanic episodes."
    },
    {
      number: "03",
      id: "schizophrenia-spectrum",
      title: "Schizophrenia Spectrum Disorders",
      difficulty: "REASON",
      coreIdea: "Schizophrenia involves positive symptoms (an excess or distortion of normal function, like hallucinations and delusions) and negative symptoms (a deficit or absence of normal function, like flat affect and social withdrawal).",
      learn: [
        "Positive symptoms of schizophrenia add something not normally present: hallucinations (perceiving something that isn't there, most commonly auditory), delusions (fixed, false beliefs held despite clear contrary evidence), and disorganized thinking or speech—these symptoms tend to respond relatively well to antipsychotic medication.",
        "Negative symptoms represent an absence or reduction of normal function: flat affect (reduced emotional expression), avolition (lack of motivation to initiate activities), alogia (reduced speech output), and social withdrawal—negative symptoms tend to respond less well to standard antipsychotic treatment than positive symptoms do."
      ],
      mcatConnection: "'Positive' and 'negative' here describe whether a symptom adds to or subtracts from normal functioning, not whether it's a good or bad symptom—this is the same naming logic as positive/negative reinforcement, and mixing it up is an easy, commonly tested error.",
      quickCheck: {
        prompt: "A patient with schizophrenia shows significantly reduced facial expression, speaks very little, and has lost motivation to engage in previously enjoyed activities, without reporting any hallucinations or delusions. These symptoms are best classified as:",
        options: ["Positive symptoms", "Negative symptoms", "Manic symptoms", "Symptoms of generalized anxiety disorder"],
        correctIndex: 1,
        explanation: "Flat affect, reduced speech, and lost motivation all represent a deficit or absence of normal functioning, which defines negative symptoms of schizophrenia—positive symptoms would instead involve an addition to normal experience, like hallucinations or delusions, neither of which is present here."
      },
      keyTakeaway: "Positive symptoms of schizophrenia add to normal experience (hallucinations, delusions, disorganized thought); negative symptoms subtract from it (flat affect, avolition, social withdrawal), and the two symptom types respond differently to treatment."
    }
  ]
};
