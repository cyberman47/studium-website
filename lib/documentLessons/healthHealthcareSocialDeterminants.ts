// Document-lesson content for "Health, Healthcare & Social Determinants"
// (lib/mcatPath.ts's health-healthcare-social-determinants LessonContent entry).
// See lib/documentLesson.ts for the shared shape.
import { DocumentLessonContent } from "../documentLesson";

export const healthHealthcareSocialDeterminantsContent: DocumentLessonContent = {
  lessonIntro: {
    description: "Health outcomes are shaped by far more than individual biology or behavior—where someone lives, works, and how much they earn all measurably affect health. This lesson covers the social determinants of health, healthcare disparities and access, and how sociology understands illness as a social role, not just a biological state.",
    objectives: [
      "Identify the major social determinants of health",
      "Explain healthcare disparities and the barriers that produce unequal access",
      "Explain Parsons' sick role and its expectations",
      "Explain stigma and its effect on health-seeking behavior"
    ]
  },
  bigPicture: {
    flow: ["Social determinants (SES, education, environment)", "Shape access to healthcare and health-related resources", "Produce measurable healthcare disparities in outcomes", "Illness itself is experienced through a social role, shaped by stigma"],
    caption: "Health outcomes trace back to social conditions well before anyone sets foot in a doctor's office—by the time healthcare access even becomes relevant, social determinants have already shaped a huge share of who ends up needing that care in the first place."
  },
  concepts: [
    {
      number: "01",
      id: "social-determinants-of-health",
      title: "Social Determinants of Health",
      difficulty: "UNDERSTAND",
      coreIdea: "Social determinants of health are the non-medical conditions—socioeconomic status, education, neighborhood/environment, and social support—that shape health outcomes, often more powerfully than direct medical care.",
      learn: [
        "Socioeconomic status (SES)—income, occupation, and education combined—is one of the most consistent predictors of health outcomes across nearly every disease and condition studied; lower SES is associated with worse health outcomes through multiple pathways, including reduced access to healthcare, greater chronic stress, and less access to healthy food and safe living conditions.",
        "Neighborhood and physical environment (exposure to pollution, availability of safe housing, access to grocery stores with fresh food) and social support (strength of family/community relationships) also substantially shape health, independent of any individual's personal health behaviors or genetics—these are why public health interventions increasingly target social conditions, not just individual medical treatment."
      ],
      mcatConnection: "The exam frequently asks you to identify social determinants of health within a case description—the key skill is recognizing non-medical factors (income, housing, education, neighborhood conditions) as legitimate, measurable contributors to health outcomes, not just background detail.",
      quickCheck: {
        prompt: "A public health study finds that residents of a low-income neighborhood with limited access to grocery stores selling fresh produce have significantly higher rates of diet-related chronic disease than residents of a nearby higher-income neighborhood. This finding is best explained by:",
        options: ["Genetic differences between the two neighborhoods' populations", "A social determinant of health—limited access to healthy food tied to neighborhood and socioeconomic conditions", "Random chance, unrelated to any social factor", "Differences in fertility rate between the two neighborhoods"],
        correctIndex: 1,
        explanation: "Limited access to healthy food, tied to neighborhood and socioeconomic conditions, is a clear example of a social determinant of health directly shaping a measurable health outcome (diet-related disease rates)—there's no basis here for attributing the difference to genetics or chance."
      },
      keyTakeaway: "Social determinants of health—socioeconomic status, education, neighborhood/environment, and social support—shape health outcomes substantially, often independent of individual behavior or direct medical care."
    },
    {
      number: "02",
      id: "healthcare-disparities-access",
      title: "Healthcare Disparities and Access",
      difficulty: "REASON",
      coreIdea: "Healthcare disparities are differences in health outcomes and healthcare quality between groups, driven by unequal access—financial, geographic, and systemic barriers to care.",
      learn: [
        "Financial barriers (lack of insurance or ability to pay) and geographic barriers (living far from healthcare facilities, especially specialists, in many rural areas) are major, well-documented contributors to unequal healthcare access; systemic barriers include factors like implicit bias among healthcare providers and a lack of culturally competent care, which can reduce the quality of care a patient receives even when they do access the healthcare system.",
        "Healthcare disparities are measurable differences in health outcomes, access to care, and quality of care between different social groups (often defined by race, ethnicity, socioeconomic status, or geography) that aren't explained by differences in the underlying medical need—these disparities reflect unequal access and treatment, not differences in who actually needs care."
      ],
      mcatConnection: "The exam distinguishes healthcare disparities (unequal access/quality/outcomes between groups) from social determinants of health (broader social/economic conditions shaping health generally)—disparities are specifically about unequal treatment within the healthcare system itself, a related but distinct concept.",
      quickCheck: {
        prompt: "A study finds that, even after controlling for insurance status and severity of illness, patients from a particular racial group receive less aggressive pain management than other patients with clinically similar presentations. This finding is best described as evidence of:",
        options: ["A social determinant of health", "A healthcare disparity", "Structural mobility", "The demographic transition"],
        correctIndex: 1,
        explanation: "A measurable difference in the quality of care received between groups, not explained by differences in insurance or clinical need, is specifically a healthcare disparity—this is about unequal treatment within the healthcare system itself, distinct from the broader social/economic conditions that social determinants of health describe."
      },
      keyTakeaway: "Healthcare disparities are unequal health outcomes, access, or quality of care between groups, driven by financial, geographic, and systemic barriers—distinct from the broader social determinants that shape health generally."
    },
    {
      number: "03",
      id: "sick-role-stigma",
      title: "The Sick Role and Stigma",
      difficulty: "IDENTIFY",
      coreIdea: "Parsons' sick role describes illness as a temporary social role with both rights (exemption from normal responsibilities) and obligations (seeking treatment, wanting to get well); stigma attached to certain conditions can discourage people from seeking care.",
      learn: [
        "Parsons' sick role framework describes being sick as a recognized social role, not just a biological state, with two rights (exemption from normal social responsibilities, like work, and not being blamed for the illness) and two obligations (the sick person must want to get well and must seek competent help, such as medical treatment)—failing to meet the obligations can result in a person losing the rights the sick role grants.",
        "Stigma is a negative social label attached to a particular condition, group, or trait, often leading to discrimination, shame, or social exclusion; conditions carrying significant stigma (such as certain mental illnesses or infectious diseases) often see reduced rates of people seeking diagnosis or treatment, specifically because of the social costs associated with being identified as having that condition."
      ],
      mcatConnection: "The sick role's rights-and-obligations structure is worth having memorized as a matched pair (two rights, two obligations)—the exam sometimes tests whether you recognize that the sick role's exemptions aren't unconditional, since they depend on the sick person genuinely trying to get well.",
      quickCheck: {
        prompt: "According to Parsons' sick role, which of the following is one of the obligations placed on a person occupying the sick role, rather than one of its rights?",
        options: ["Exemption from normal work responsibilities", "Not being blamed for their illness", "Seeking competent medical help and wanting to get well", "Receiving unconditional social support regardless of behavior"],
        correctIndex: 2,
        explanation: "Seeking competent help and wanting to get well are the two obligations of the sick role—exemption from normal responsibilities and not being blamed for the illness are the sick role's two rights, not its obligations."
      },
      keyTakeaway: "Parsons' sick role frames illness as a social role with rights (exemption from responsibilities, no blame) and obligations (seeking help, wanting to recover); stigma attached to a condition can discourage people from seeking care."
    }
  ]
};
