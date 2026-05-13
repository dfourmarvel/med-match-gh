import { QuizQuestion, QuestionTraitMapping, TraitId } from "@/types/dataset";

const likertLabels = ["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"];

function mappings(entries: QuestionTraitMapping[]): QuestionTraitMapping[] {
  return entries;
}

function weightings(entries: QuestionTraitMapping[]): Partial<Record<TraitId, number>> {
  return Object.fromEntries(entries.map((entry) => [entry.trait, entry.weight])) as Partial<Record<TraitId, number>>;
}

function q(question: Omit<QuizQuestion, "answerScale" | "weightings"> & { answerScale?: QuizQuestion["answerScale"] }): QuizQuestion {
  return {
    ...question,
    weightings: weightings(question.traitMappings),
    answerScale: question.answerScale ?? { min: 1, max: 5, labels: likertLabels }
  };
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  q({
    id: 1,
    questionText: "I enjoy solving complex problems with limited information.",
    category: "skills",
    type: "likert",
    description: "Tests comfort with clinical ambiguity and synthesis.",
    // Diagnostic specialties reward uncertainty tolerance; research curiosity often travels with complex problem interest.
    traitMappings: mappings([
      { trait: "diagnosticThinking", weight: 1.45, direction: "positive", rationale: "Core signal for diagnostic reasoning." },
      { trait: "emotionalResilience", weight: 0.45, direction: "positive", rationale: "Uncertainty requires calm persistence." },
      { trait: "researchInterest", weight: 0.55, direction: "positive", rationale: "Complexity often indicates curiosity about mechanisms." }
    ]),
    reverseScoring: false,
    followUpExplanation: "High scores suggest comfort with specialties that require reasoning from incomplete information."
  }),
  q({
    id: 2,
    questionText: "I would enjoy working with my hands during procedures.",
    category: "skills",
    type: "likert",
    description: "Measures motivation for technical and procedural work.",
    // Differentiates surgery, dentistry, anesthesia, and procedure-heavy subspecialties from mainly cognitive fields.
    traitMappings: mappings([
      { trait: "proceduralInterest", weight: 1.55, direction: "positive", rationale: "Direct procedural preference." },
      { trait: "precisionOrientation", weight: 0.65, direction: "positive", rationale: "Procedures usually require fine detail and control." }
    ]),
    reverseScoring: false
  }),
  q({
    id: 3,
    questionText: "I perform well under pressure.",
    category: "coping",
    type: "likert",
    description: "Assesses stress performance in demanding clinical settings.",
    // Acute care fit requires both subjective pressure tolerance and rapid environment comfort.
    traitMappings: mappings([
      { trait: "emotionalResilience", weight: 1.25, direction: "positive", rationale: "Primary marker of stability under strain." },
      { trait: "emergencyComfort", weight: 1.0, direction: "positive", rationale: "Pressure often appears in emergency contexts." },
      { trait: "fastPacedPreference", weight: 0.55, direction: "positive", rationale: "High pressure environments tend to move quickly." }
    ]),
    reverseScoring: false
  }),
  q({
    id: 4,
    questionText: "I prefer long-term relationships with people over short interactions.",
    category: "interaction",
    type: "likert",
    description: "Distinguishes continuity-oriented care from episodic consult work.",
    // Strong for family medicine, psychiatry, pediatrics, internal medicine, and orthodontics.
    traitMappings: mappings([
      { trait: "longTermRelationships", weight: 1.5, direction: "positive", rationale: "Direct continuity preference." },
      { trait: "patientInteraction", weight: 0.65, direction: "positive", rationale: "Continuity requires repeated patient contact." },
      { trait: "communicationEmpathy", weight: 0.6, direction: "positive", rationale: "Long relationships need trust-building communication." }
    ]),
    reverseScoring: false
  }),
  q({
    id: 5,
    questionText: "I am emotionally resilient during stressful situations.",
    category: "coping",
    type: "likert",
    description: "Measures recovery and emotional steadiness.",
    // Separates high-intensity fields from users who may prefer steadier clinical settings.
    traitMappings: mappings([
      { trait: "emotionalResilience", weight: 1.45, direction: "positive", rationale: "Direct resilience signal." },
      { trait: "emergencyComfort", weight: 0.7, direction: "positive", rationale: "Stress resilience supports urgent care work." }
    ]),
    reverseScoring: false
  }),
  q({
    id: 6,
    questionText: "I value work-life balance highly.",
    category: "values",
    type: "likert",
    description: "Captures the importance of sustainability and personal time.",
    // Lifestyle weighting helps avoid recommending intense call-heavy specialties to users who strongly prioritize balance.
    traitMappings: mappings([
      { trait: "workLifeBalancePriority", weight: 1.6, direction: "positive", rationale: "Direct lifestyle priority." },
      { trait: "schedulePredictability", weight: 0.7, direction: "positive", rationale: "Balance often depends on predictable schedules." }
    ]),
    reverseScoring: false
  }),
  q({
    id: 7,
    questionText: "I enjoy fast-paced environments.",
    category: "preferences",
    type: "likert",
    description: "Measures preference for rapid clinical flow and dynamic workload.",
    // Emergency, surgery, obstetrics, and anesthesia score higher when pace is attractive rather than draining.
    traitMappings: mappings([
      { trait: "fastPacedPreference", weight: 1.45, direction: "positive", rationale: "Direct pace preference." },
      { trait: "emergencyComfort", weight: 0.75, direction: "positive", rationale: "Urgent settings are often fast-paced." }
    ]),
    reverseScoring: false
  }),
  q({
    id: 8,
    questionText: "I am fascinated by human anatomy and disease mechanisms.",
    category: "skills",
    type: "likert",
    description: "Tests interest in biomedical mechanisms behind clinical care.",
    // Useful across medicine, surgery, pathology, radiology, and academic tracks.
    traitMappings: mappings([
      { trait: "diagnosticThinking", weight: 0.9, direction: "positive", rationale: "Mechanistic thinking supports diagnosis." },
      { trait: "researchInterest", weight: 0.85, direction: "positive", rationale: "Mechanisms connect to academic curiosity." },
      { trait: "proceduralInterest", weight: 0.3, direction: "positive", rationale: "Anatomy interest can support procedural fields." }
    ]),
    reverseScoring: false
  }),
  q({
    id: 9,
    questionText: "I prefer analytical work over social interaction.",
    category: "preferences",
    type: "forced-choice",
    description: "Compares cognitive/analytical orientation with interpersonal energy.",
    // Positive for lower-patient-contact diagnostic fields; negative for empathy-heavy front-facing specialties.
    traitMappings: mappings([
      { trait: "diagnosticThinking", weight: 1.0, direction: "positive", rationale: "Analytical preference supports cognitive specialties." },
      { trait: "patientInteraction", weight: 0.85, direction: "negative", rationale: "Preference away from social interaction lowers patient-contact fit." },
      { trait: "communicationEmpathy", weight: 0.65, direction: "negative", rationale: "Less social preference may reduce counseling-heavy fit." }
    ]),
    answerScale: { min: 1, max: 5, labels: ["Strongly prefer social interaction", "Somewhat social", "Balanced", "Somewhat analytical", "Strongly analytical"] },
    reverseScoring: false
  }),
  q({
    id: 10,
    questionText: "I would enjoy leading a healthcare team.",
    category: "values",
    type: "likert",
    description: "Assesses leadership appetite in multidisciplinary settings.",
    // Leadership is important in surgery, emergency, public health, obstetrics, and consultant-level practice.
    traitMappings: mappings([
      { trait: "leadershipPreference", weight: 1.45, direction: "positive", rationale: "Direct leadership preference." },
      { trait: "teamwork", weight: 0.75, direction: "positive", rationale: "Healthcare leadership depends on team collaboration." }
    ]),
    reverseScoring: false
  }),
  q({
    id: 11,
    questionText: "I enjoy detailed and precise work.",
    category: "skills",
    type: "likert",
    description: "Measures comfort with detail-heavy tasks and accuracy.",
    // Precision is central in pathology, radiology, dermatology, surgery, anesthesia, and dentistry.
    traitMappings: mappings([
      { trait: "precisionOrientation", weight: 1.55, direction: "positive", rationale: "Direct precision signal." },
      { trait: "proceduralInterest", weight: 0.45, direction: "positive", rationale: "Procedures often require detail." },
      { trait: "diagnosticThinking", weight: 0.35, direction: "positive", rationale: "Accurate diagnosis often depends on details." }
    ]),
    reverseScoring: false
  }),
  q({
    id: 12,
    questionText: "I am comfortable discussing emotionally difficult topics.",
    category: "interaction",
    type: "likert",
    description: "Assesses communication skill in distressing or sensitive conversations.",
    // Strong signal for psychiatry, pediatrics, oncology-adjacent medicine, family medicine, and obstetrics.
    traitMappings: mappings([
      { trait: "communicationEmpathy", weight: 1.35, direction: "positive", rationale: "Direct empathy and counseling signal." },
      { trait: "emotionalResilience", weight: 0.65, direction: "positive", rationale: "Hard conversations require emotional steadiness." },
      { trait: "patientInteraction", weight: 0.5, direction: "positive", rationale: "These conversations occur in direct patient care." }
    ]),
    reverseScoring: false
  }),
  q({
    id: 13,
    questionText: "I prefer variety rather than routine.",
    category: "preferences",
    type: "situational",
    description: "Distinguishes dynamic, unpredictable work from routine clinic/list-based work.",
    // Variety preference is helpful in emergency, family medicine, internal medicine, and surgery; reverse of schedule predictability.
    traitMappings: mappings([
      { trait: "fastPacedPreference", weight: 0.7, direction: "positive", rationale: "Variety often raises clinical pace." },
      { trait: "schedulePredictability", weight: 1.05, direction: "negative", rationale: "Variety usually means less routine." },
      { trait: "emergencyComfort", weight: 0.45, direction: "positive", rationale: "Unpredictable variety overlaps with urgent work." }
    ]),
    answerScale: { min: 1, max: 5, labels: ["Strongly prefer routine", "Prefer routine", "Balanced", "Prefer variety", "Strongly prefer variety"] },
    reverseScoring: false
  }),
  q({
    id: 14,
    questionText: "I enjoy mentoring or teaching others.",
    category: "values",
    type: "likert",
    description: "Captures academic, supervisory, and leadership orientation.",
    // Teaching is a practical part of consultant work in Ghanaian teaching hospitals.
    traitMappings: mappings([
      { trait: "communicationEmpathy", weight: 0.8, direction: "positive", rationale: "Teaching requires clear, patient communication." },
      { trait: "leadershipPreference", weight: 0.8, direction: "positive", rationale: "Mentorship is a leadership behavior." },
      { trait: "teamwork", weight: 0.6, direction: "positive", rationale: "Mentors work through teams and learners." }
    ]),
    reverseScoring: false
  }),
  q({
    id: 15,
    questionText: "I am willing to spend many years in training for mastery.",
    category: "values",
    type: "likert",
    description: "Measures tolerance for long postgraduate pathways.",
    // Helps rank highly competitive subspecialties, surgery, cardiology, maxillofacial surgery, and orthodontics.
    traitMappings: mappings([
      { trait: "longTrainingTolerance", weight: 1.6, direction: "positive", rationale: "Direct signal for long training tolerance." },
      { trait: "leadershipPreference", weight: 0.35, direction: "positive", rationale: "Long training often leads to supervisory roles." }
    ]),
    reverseScoring: false
  }),
  q({
    id: 16,
    questionText: "I would rather diagnose a disease than perform surgery.",
    category: "preferences",
    type: "forced-choice",
    description: "Compares cognitive diagnosis preference with operative intervention preference.",
    // A direct differentiator between diagnostic/cognitive pathways and surgical/procedural pathways.
    traitMappings: mappings([
      { trait: "diagnosticThinking", weight: 1.25, direction: "positive", rationale: "Preference for diagnostic work." },
      { trait: "proceduralInterest", weight: 1.15, direction: "negative", rationale: "Preference away from surgery lowers procedure orientation." }
    ]),
    answerScale: { min: 1, max: 5, labels: ["Strongly prefer surgery", "Prefer surgery", "Either", "Prefer diagnosis", "Strongly prefer diagnosis"] },
    reverseScoring: false
  }),
  q({
    id: 17,
    questionText: "I enjoy interacting with children.",
    category: "interaction",
    type: "forced-choice",
    description: "Measures fit for pediatric medical and dental pathways.",
    // Pediatric specialties need child/family communication and patience with longitudinal development.
    traitMappings: mappings([
      { trait: "patientInteraction", weight: 0.75, direction: "positive", rationale: "Child care is patient-facing." },
      { trait: "communicationEmpathy", weight: 0.85, direction: "positive", rationale: "Children and caregivers need careful communication." },
      { trait: "longTermRelationships", weight: 0.45, direction: "positive", rationale: "Pediatric care often follows growth over time." }
    ]),
    answerScale: { min: 1, max: 5, labels: ["Not really", "Rarely", "Sometimes", "Often", "Definitely"] },
    reverseScoring: false
  }),
  q({
    id: 18,
    questionText: "I am comfortable making rapid decisions.",
    category: "coping",
    type: "likert",
    description: "Assesses tolerance for decisive clinical action.",
    // High weighting for emergency, anesthesia, surgery, and obstetrics.
    traitMappings: mappings([
      { trait: "emergencyComfort", weight: 1.25, direction: "positive", rationale: "Rapid decisions are central to emergencies." },
      { trait: "fastPacedPreference", weight: 0.75, direction: "positive", rationale: "Fast pace demands quick decisions." },
      { trait: "emotionalResilience", weight: 0.5, direction: "positive", rationale: "Decisiveness under pressure requires resilience." }
    ]),
    reverseScoring: false
  }),
  q({
    id: 19,
    questionText: "I prefer structured schedules over unpredictable work.",
    category: "values",
    type: "forced-choice",
    description: "Measures preference for schedule control and predictable work patterns.",
    // Important for lifestyle-sensitive recommendations such as dermatology, radiology, pathology, orthodontics.
    traitMappings: mappings([
      { trait: "schedulePredictability", weight: 1.45, direction: "positive", rationale: "Direct structure preference." },
      { trait: "workLifeBalancePriority", weight: 0.65, direction: "positive", rationale: "Structure supports balance." },
      { trait: "fastPacedPreference", weight: 0.45, direction: "negative", rationale: "Structured work usually contrasts with fast-paced unpredictability." }
    ]),
    answerScale: { min: 1, max: 5, labels: ["Strongly prefer unpredictable", "Somewhat unpredictable", "Balanced", "Somewhat structured", "Strongly structured"] },
    reverseScoring: false
  }),
  q({
    id: 20,
    questionText: "I enjoy communicating and counseling people.",
    category: "interaction",
    type: "likert",
    description: "Assesses motivation for explanatory, counseling-heavy care.",
    // Strong for psychiatry, family medicine, pediatrics, obstetrics, dentistry, and public health education.
    traitMappings: mappings([
      { trait: "communicationEmpathy", weight: 1.4, direction: "positive", rationale: "Direct counseling signal." },
      { trait: "patientInteraction", weight: 0.95, direction: "positive", rationale: "Counseling requires direct patient contact." },
      { trait: "longTermRelationships", weight: 0.45, direction: "positive", rationale: "Counseling often improves with continuity." }
    ]),
    reverseScoring: false
  }),
  q({
    id: 21,
    questionText: "I am interested in technology and imaging tools.",
    category: "skills",
    type: "likert",
    description: "Measures affinity for technology-enabled diagnosis and care.",
    // Useful for radiology, cardiology imaging, pathology digital tools, anesthesia monitors, and modern dentistry.
    traitMappings: mappings([
      { trait: "researchInterest", weight: 0.75, direction: "positive", rationale: "Technology interest often signals innovation curiosity." },
      { trait: "diagnosticThinking", weight: 0.75, direction: "positive", rationale: "Imaging tools support diagnostic reasoning." },
      { trait: "precisionOrientation", weight: 0.55, direction: "positive", rationale: "Technology-heavy work requires precision." }
    ]),
    reverseScoring: false
  }),
  q({
    id: 22,
    questionText: "I prefer community impact over individual patient care.",
    category: "values",
    type: "forced-choice",
    description: "Identifies population-health, prevention, and systems orientation.",
    // Public health rises when community impact matters more than individual bedside continuity.
    traitMappings: mappings([
      { trait: "patientInteraction", weight: 0.55, direction: "negative", rationale: "Community focus may reduce one-to-one patient preference." },
      { trait: "leadershipPreference", weight: 0.55, direction: "positive", rationale: "Population health often requires program leadership." },
      { trait: "researchInterest", weight: 0.55, direction: "positive", rationale: "Community work relies on evidence and data." },
      { trait: "teamwork", weight: 0.45, direction: "positive", rationale: "Systems work is multidisciplinary." }
    ]),
    answerScale: { min: 1, max: 5, labels: ["Individual care", "Mostly individual", "Both equally", "Mostly community", "Community impact"] },
    reverseScoring: false
  }),
  q({
    id: 23,
    questionText: "I enjoy high-intensity environments.",
    category: "coping",
    type: "likert",
    description: "Captures attraction to demanding clinical intensity.",
    // Helps distinguish users energized by surgery/emergency/obstetrics from those who merely tolerate pressure.
    traitMappings: mappings([
      { trait: "fastPacedPreference", weight: 1.2, direction: "positive", rationale: "Intensity typically increases pace." },
      { trait: "emergencyComfort", weight: 1.05, direction: "positive", rationale: "High intensity is common in emergencies." },
      { trait: "emotionalResilience", weight: 0.5, direction: "positive", rationale: "Intensity requires resilience." }
    ]),
    reverseScoring: false
  }),
  q({
    id: 24,
    questionText: "I like balancing science with human interaction.",
    category: "values",
    type: "likert",
    description: "Measures blended cognitive and interpersonal fit.",
    // Strong for internal medicine, pediatrics, family medicine, psychiatry, neurology, and dentistry.
    traitMappings: mappings([
      { trait: "diagnosticThinking", weight: 0.75, direction: "positive", rationale: "Science orientation maps to clinical reasoning." },
      { trait: "patientInteraction", weight: 0.75, direction: "positive", rationale: "Human interaction maps to patient contact." },
      { trait: "communicationEmpathy", weight: 0.55, direction: "positive", rationale: "Balancing science with people requires explanation and empathy." }
    ]),
    reverseScoring: false
  }),
  q({
    id: 25,
    questionText: "I am curious about research and medical discoveries.",
    category: "values",
    type: "likert",
    description: "Assesses academic and evidence-generation motivation.",
    // Helps rank academic, subspecialty, public health, pathology, radiology, and neurology pathways.
    traitMappings: mappings([
      { trait: "researchInterest", weight: 1.6, direction: "positive", rationale: "Direct research curiosity." },
      { trait: "diagnosticThinking", weight: 0.5, direction: "positive", rationale: "Discovery interest often pairs with analytical thinking." }
    ]),
    reverseScoring: false
  })
];

export function getQuestionById(id: number): QuizQuestion | undefined {
  return QUIZ_QUESTIONS.find((question) => question.id === id);
}

export function validateQuestionCoverage(): { valid: boolean; missingIds: number[] } {
  const ids = new Set(QUIZ_QUESTIONS.map((question) => question.id));
  const missingIds = Array.from({ length: 25 }, (_, index) => index + 1).filter((id) => !ids.has(id));
  return { valid: missingIds.length === 0, missingIds };
}
