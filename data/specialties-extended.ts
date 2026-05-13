/**
 * Complete Medical Specialties Dataset (Part 2) + Dental Specialties
 * Remaining 12 medical and 5 dental specialties
 */

import { SpecialtyProfile, TraitVector } from "@/data/types";

function traitVector(traits: Partial<TraitVector> & Record<string, number>): TraitVector {
  return {
    patientInteraction: traits.patientInteraction ?? 5,
    proceduralInterest: traits.proceduralInterest ?? 5,
    diagnosticThinking: traits.diagnosticThinking ?? 5,
    fastPacedPreference: traits.fastPacedPreference ?? 5,
    workLifeBalancePriority: traits.workLifeBalancePriority ?? 5,
    emotionalResilience: traits.emotionalResilience ?? 5,
    teamwork: traits.teamwork ?? 5,
    precisionOrientation: traits.precisionOrientation ?? 5,
    longTermRelationships: traits.longTermRelationships ?? 5,
    researchInterest: traits.researchInterest ?? 5,
    leadershipPreference: traits.leadershipPreference ?? 5,
    longTrainingTolerance: traits.longTrainingTolerance ?? 5,
    emergencyComfort: traits.emergencyComfort ?? 5,
    communicationEmpathy: traits.communicationEmpathy ?? 5,
    schedulePredictability: traits.schedulePredictability ?? 5
  };
}

// ============================================================================
// REMAINING MEDICAL SPECIALTIES (OB-GYN, PSYCHIATRY, FAMILY MEDICINE, etc.)
// ============================================================================

export const REMAINING_MEDICAL_SPECIALTIES: SpecialtyProfile[] = [
  // OB-GYN
  {
    id: "obstetrics-gynecology",
    slug: "obstetrics-gynecology",
    name: "Obstetrics & Gynecology",
    category: "medical",
    shortDescription:
      "High-stakes blend of surgery, emergency medicine, continuity care, and reproductive health with immediate life-or-death decisions.",
    fullDescription:
      "OB-GYN uniquely combines clinic work, surgical procedures, and emergency obstetrics. Obstetricians manage pregnancy, labor, delivery, and postpartum care; gynecologists handle reproductive health, contraception, and gynecologic surgery. The specialty demands emotional resilience (high stakes for mother and baby), procedural skill, communication ability, and comfort with unpredictable schedules.",
    personalityFitDescription:
      "You are empathetic, procedurally skilled, emotionally resilient, and thrive managing urgent, high-stakes situations with strong family communication.",
    idealCandidateDescription:
      "Excellent communication and empathy, procedural confidence, emotional stability, comfort with emergencies, team leadership capability, and flexibility with schedule.",
    icon: "👶🤰",
    colorTheme: { primary: "#be123c", secondary: "#e11d48" },
    trainingYearsMin: 5,
    trainingYearsMax: 7,
    competitiveness: "Very High",
    residencyDifficulty: "Very High",
    burnoutRisk: "High",
    lifestyleRating: "2 - Poor",
    emergencyIntensity: 5,
    patientInteractionLevel: 5,
    procedureIntensity: 4,
    diagnosticIntensity: 4,
    stressLevel: 5,
    workloadLevel: 5,
    averageSalaryGHS: {
      publicSectorEstimate: { min: 9000, max: 20000, level: "Junior-Senior" },
      privateSectorEstimate: { min: 14000, max: 34000, level: "Junior-Senior" },
      currencyCode: "GHS",
      disclaimer: "Private obstetrics very lucrative in urban Ghana.",
      year: 2024
    },
    privateSectorPotential: "Very High",
    globalMobility: "Very High",
    aiReplacementRisk: "Low",
    futureDemandGhana: "High Demand",
    traitProfile: traitVector({
      patientInteraction: 8,
      proceduralInterest: 8,
      fastPacedPreference: 8,
      emergencyComfort: 8,
      communicationEmpathy: 8,
      emotionalResilience: 8,
      teamwork: 8,
      leadershipPreference: 7,
      precisionOrientation: 8,
      diagnosticThinking: 7,
      longTrainingTolerance: 8,
      workLifeBalancePriority: 3,
      schedulePredictability: 2,
      longTermRelationships: 6,
      researchInterest: 5
    }),
    trainingPathway: {
      description: "5–7 year competitive residency in OB-GYN through GCPS.",
      durationYears: 6,
      requiredPrerequisites: [
        "Medical degree",
        "Successful internship",
        "Strong clinical performance"
      ],
      certifications: ["GCPS Fellowship in OB-GYN"],
      keyMilestones: [
        "Year 1: Foundational obstetrics and gynecology",
        "Years 2-4: Advanced surgical and obstetric cases",
        "Year 5-6: Senior officer duties, emergency leadership"
      ]
    },
    ghanaData: {
      residencyPathwayGhana:
        "GCPS-accredited training at Korle Bu, Komfo Anokye, and tertiary centers with high maternal/fetal volume.",
      commonTrainingCenters: [
        "Korle Bu Teaching Hospital, Accra",
        "Komfo Anokye Teaching Hospital, Kumasi",
        "Regional referral hospitals with obstetric services"
      ],
      collegeBodies: [
        "Ghana College of Physicians and Surgeons",
        "Ghana Obstetric and Gynaecological Society"
      ],
      residencyStructure:
        "Labour ward, theater, gynecology clinics, obstetric emergencies, antenatal care.",
      postSpecializationOptions: [
        "Subspecialty (maternal-fetal medicine, gynecologic oncology, reproductive endocrinology)",
        "Private obstetric practice",
        "Academic medicine",
        "Maternal health advocacy and public health"
      ],
      internationalMobilityNotes: "GCPS qualifications recognized; MRCOG or board certifications enhance mobility."
    },
    subspecialties: [
      { name: "Maternal-Fetal Medicine", description: "High-risk pregnancy management" },
      { name: "Gynecologic Oncology", description: "Reproductive cancers" },
      { name: "Reproductive Endocrinology", description: "Fertility and reproductive disorders" }
    ],
    relatedSpecialties: [
      "pediatrics",
      "general-surgery",
      "anesthesiology"
    ],
    typicalSchedule:
      "Highly unpredictable. Labour ward 24/7; emergencies anytime. Theatre lists + clinic work + on-call.",
    onCallFrequency: "3–4 times per week or more; calls very busy with labour, delivery, emergencies",
    workEnvironments: [
      "Labour ward",
      "Delivery theatre",
      "Gynecology operating theatre",
      "Antenatal clinic",
      "Postnatal ward",
      "Emergency OB assessment"
    ],
    dayInLife: {
      typical: [
        {
          time: "7:30 AM",
          activity: "Arrive, review labour ward census and gynecology patients",
          intensity: 2,
          location: "Labour ward office"
        },
        {
          time: "8:00 AM",
          activity: "Labour ward rounds and antenatal clinic",
          intensity: 4,
          location: "Labour ward/clinic"
        },
        {
          time: "12:00 PM",
          activity: "Emergency caesarean or gynecologic theatre case",
          intensity: 5,
          location: "Operating theatre"
        },
        {
          time: "4:00 PM",
          activity: "Postnatal visits, discharge planning, consults",
          intensity: 3,
          location: "Wards/clinic"
        },
        {
          time: "6:00 PM",
          activity: "Handover for evening/night coverage",
          intensity: 2,
          location: "Labour ward"
        }
      ],
      callDay: [
        {
          time: "Daytime",
          activity: "Routine duties with emergency backup",
          intensity: 4,
          location: "Labour ward/theatre"
        },
        {
          time: "Evening-Night",
          activity: "Labour management, emergency deliveries, caesarean sections",
          intensity: 5,
          location: "Labour ward/theatre"
        }
      ]
    },
    typicalCases: [
      "Primigravida in active labour; labor progress monitoring and delivery",
      "Emergency caesarean for fetal distress",
      "Placental abruption with massive bleeding requiring emergency theatre",
      "Gynecologic emergency: ruptured ovarian cyst with peritonitis",
      "High-risk antenatal patient with hypertension or gestational diabetes"
    ],
    majorPros: [
      "High impact on maternal and child health",
      "Strong earning potential in private practice",
      "Mix of procedures and continuity care",
      "Highly respected specialty",
      "Global demand for OB-GYN expertise",
      "Tangible outcomes and satisfaction",
      "Leadership and autonomy in labour ward"
    ],
    majorCons: [
      "Very unpredictable schedule; labour happens anytime",
      "High medicolegal liability and stress",
      "Emotionally intense emergencies (high-stakes baby/mother outcomes)",
      "Long training period",
      "Very poor work-life balance in training",
      "Compassion fatigue from high-risk cases",
      "Physical exhaustion from labour management"
    ],
    commonMisconceptions: [
      "OB-GYN is 'just delivery' (includes complex gynecologic surgery, fertility, contraception)",
      "OB-GYN doesn't involve procedures (highly procedural specialty)",
      "OB-GYN is less prestigious than medicine (actually highly respected and lucrative)"
    ],
    recommendedStudentActivities: [
      "Extended labour ward exposure",
      "Deliveries and obstetric procedure observation",
      "Antenatal clinic and high-risk pregnancy cases",
      "Maternal health research",
      "Global maternal health projects"
    ],
    researchOpportunities: [
      "Maternal mortality reduction initiatives",
      "Obstetric hemorrhage prevention",
      "Safe motherhood and fetal health"
    ],
    tags: [
      "high-stakes",
      "procedural",
      "emergency-oriented",
      "very-competitive",
      "high-earning",
      "demanding",
      "high-impact",
      "unpredictable"
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // PSYCHIATRY
  {
    id: "psychiatry",
    slug: "psychiatry",
    name: "Psychiatry",
    category: "medical",
    shortDescription:
      "Relationship-rich specialty focused on mental health, complex communication, and longitudinal therapeutic care with strong lifestyle balance.",
    fullDescription:
      "Psychiatry uniquely emphasizes therapeutic relationships, communication, and psychopharmacology. Psychiatrists manage severe mental illness, substance abuse, and complex behavioral health across inpatient and outpatient settings. The specialty offers more predictable schedules, minimal emergencies (except crisis intervention), and deep intellectual engagement with human psychology and neurobiology.",
    personalityFitDescription:
      "You are empathetic, intellectually curious about human behavior, comfortable with ambiguity, and enjoy long-term therapeutic relationships.",
    idealCandidateDescription:
      "Strong empathy and listening skills, comfort with emotional complexity, intellectual interest in neurobiology and psychology, patience with slow progress, and genuine interest in stigma reduction.",
    icon: "🧠💭",
    colorTheme: { primary: "#7c3aed", secondary: "#a78bfa" },
    trainingYearsMin: 4,
    trainingYearsMax: 5,
    competitiveness: "Low",
    residencyDifficulty: "Low",
    burnoutRisk: "Medium",
    lifestyleRating: "4 - Good",
    emergencyIntensity: 2,
    patientInteractionLevel: 5,
    procedureIntensity: 1,
    diagnosticIntensity: 4,
    stressLevel: 2,
    workloadLevel: 3,
    averageSalaryGHS: {
      publicSectorEstimate: { min: 8500, max: 17000, level: "Junior-Senior" },
      privateSectorEstimate: { min: 10000, max: 25000, level: "Junior-Senior" },
      currencyCode: "GHS",
      disclaimer: "Private psychiatry growing in Ghana but less developed than other specialties.",
      year: 2024
    },
    privateSectorPotential: "Medium",
    globalMobility: "High",
    aiReplacementRisk: "Low",
    futureDemandGhana: "Growing",
    traitProfile: traitVector({
      communicationEmpathy: 9,
      longTermRelationships: 9,
      patientInteraction: 9,
      emotionalResilience: 8,
      diagnosticThinking: 7,
      researchInterest: 6,
      teamwork: 7,
      leadershipPreference: 5,
      workLifeBalancePriority: 8,
      schedulePredictability: 8,
      proceduralInterest: 1,
      fastPacedPreference: 3,
      emergencyComfort: 4,
      precisionOrientation: 5,
      longTrainingTolerance: 5
    }),
    trainingPathway: {
      description: "4–5 year psychiatry residency through GCPS.",
      durationYears: 5,
      requiredPrerequisites: [
        "Medical degree",
        "Internship",
        "Interest in psychiatry demonstrated through rotations"
      ],
      certifications: ["GCPS Fellowship in Psychiatry"],
      keyMilestones: [
        "Year 1: Foundational psychiatry and acute inpatient care",
        "Year 2-3: Psychopharmacology, psychotherapy, community psychiatry",
        "Year 4-5: Senior duties, subspecialty options"
      ]
    },
    ghanaData: {
      residencyPathwayGhana:
        "GCPS-accredited psychiatry training at Korle Bu and other centers. Ghana has significant mental health need but limited specialist resources.",
      commonTrainingCenters: [
        "Korle Bu Teaching Hospital (Psychiatry), Accra",
        "Pantang Hospital, Accra",
        "Regional psychiatric centers"
      ],
      collegeBodies: ["Ghana College of Physicians and Surgeons", "Ghana Psychiatric Association"],
      residencyStructure:
        "Inpatient psychiatry, community mental health, substance abuse services, liaison psychiatry.",
      postSpecializationOptions: [
        "Community psychiatry and public mental health",
        "Private psychiatric practice",
        "Addiction psychiatry or psychotherapy subspecialization",
        "Academic psychiatry and research",
        "Mental health advocacy and policy"
      ],
      internationalMobilityNotes:
        "Growing international recognition. Further exams (MRCPsych, board exams) enhance opportunities."
    },
    subspecialties: [
      { name: "Community Psychiatry", description: "Population-based mental health" },
      { name: "Addiction Psychiatry", description: "Substance abuse and addiction disorders" },
      { name: "Psychotherapy", description: "Intensive psychotherapeutic interventions" }
    ],
    relatedSpecialties: ["family-medicine", "neurology"],
    typicalSchedule:
      "Regular Monday–Friday, 7:30 AM–4:00 PM with occasional evening clinics. Minimal on-call unless crisis coverage.",
    onCallFrequency: "Minimal (1–2 times per month or by choice)",
    workEnvironments: [
      "Inpatient psychiatric ward",
      "Community mental health clinic",
      "Outpatient psychiatry clinic",
      "Substance abuse treatment center",
      "Liaison psychiatry consultation"
    ],
    dayInLife: {
      typical: [
        {
          time: "8:00 AM",
          activity: "Inpatient ward rounds and medication review",
          intensity: 3,
          location: "Psychiatric ward"
        },
        {
          time: "10:00 AM",
          activity: "Individual therapy sessions (30–50 min each)",
          intensity: 4,
          location: "Consultation room"
        },
        {
          time: "12:30 PM",
          activity: "Lunch break; case review",
          intensity: 1,
          location: "Staff room"
        },
        {
          time: "1:30 PM",
          activity: "Community mental health clinic or substance abuse program",
          intensity: 3,
          location: "Community center/clinic"
        },
        {
          time: "4:00 PM",
          activity: "Administrative tasks, documentation, multidisciplinary team meeting",
          intensity: 2,
          location: "Office"
        }
      ],
      callDay: [
        {
          time: "Daytime",
          activity: "Regular clinic duties",
          intensity: 3,
          location: "Clinic"
        },
        {
          time: "Evening",
          activity: "On-call: acute psychiatric crises, medication management, safety assessment",
          intensity: 3,
          location: "Hospital/clinic"
        }
      ]
    },
    typicalCases: [
      "Patient with first-episode psychosis requiring hospitalization and antipsychotic initiation",
      "Chronic schizophrenia patient with medication non-adherence and relapse",
      "Suicidal patient requiring safety assessment and crisis intervention",
      "Substance abuse disorder with co-occurring depression",
      "Liaison consultation for medical patient with delirium or depression"
    ],
    majorPros: [
      "Strong work-life balance and predictable schedule",
      "Deep, meaningful therapeutic relationships",
      "Intellectual engagement with complex psychology and neurobiology",
      "Growing recognition of mental health importance in Ghana",
      "Reasonable training duration",
      "Generally lower burnout risk than high-acuity specialties",
      "Strong community health impact"
    ],
    majorCons: [
      "Lower earning potential than surgery or some procedural specialties",
      "Significant stigma against mental health in Ghana and Africa",
      "Slow therapeutic progress can be frustrating",
      "Emotionally demanding narratives from patients",
      "Limited resources and hospital infrastructure in Ghana",
      "Some administrative burden and paperwork (especially medicolegal cases)"
    ],
    commonMisconceptions: [
      "Psychiatry is 'not real medicine' (requires strong biomedical and clinical knowledge)",
      "Psychiatrists mainly prescribe medications (significant psychotherapy and counseling involved)",
      "Psychiatry is less prestigious (growing recognition globally)",
      "Psychiatry is only for 'talking to people' (includes complex psychopharmacology and neurobiological understanding)"
    ],
    recommendedStudentActivities: [
      "Psychiatry rotations and ward experiences",
      "Community mental health program participation",
      "Psychopharmacology study and case reviews",
      "Mental health research or advocacy projects",
      "Peer mental health training and stigma reduction initiatives"
    ],
    researchOpportunities: [
      "Mental health epidemiology in Ghana",
      "Stigma reduction interventions",
      "Community mental health program development",
      "Psychopharmacology outcomes research"
    ],
    tags: [
      "empathy-focused",
      "relationship-focused",
      "good-lifestyle",
      "low-competitive",
      "growing-field",
      "mental-health-impact",
      "stigma-reduction",
      "therapy-focused"
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // EMERGENCY MEDICINE
  {
    id: "emergency-medicine",
    slug: "emergency-medicine",
    name: "Emergency Medicine",
    category: "medical",
    shortDescription:
      "Frontline, high-acuity specialty for clinicians thriving in rapid-fire decisions, emergencies, resuscitations, and diverse pathology.",
    fullDescription:
      "Emergency medicine is the fast-paced frontline of healthcare—managing everything from minor injuries to life-threatening emergencies. EM physicians make rapid diagnostic and therapeutic decisions, lead resuscitations, coordinate multiple services, and work high-intensity shifts. The specialty offers variety, autonomy, and intense intellectual challenge.",
    personalityFitDescription:
      "You thrive in chaos, make quick decisions under pressure, enjoy intellectual variety, and energize from resuscitations and emergency situations.",
    idealCandidateDescription:
      "Rapid decision-making ability, comfort with uncertainty, resilience under pressure, broad medical knowledge, good communication, and physical stamina.",
    icon: "🚨",
    colorTheme: { primary: "#dc2626", secondary: "#fca5a5" },
    trainingYearsMin: 4,
    trainingYearsMax: 6,
    competitiveness: "Medium",
    residencyDifficulty: "Medium",
    burnoutRisk: "High",
    lifestyleRating: "3 - Fair",
    emergencyIntensity: 5,
    patientInteractionLevel: 4,
    procedureIntensity: 3,
    diagnosticIntensity: 5,
    stressLevel: 5,
    workloadLevel: 5,
    averageSalaryGHS: {
      publicSectorEstimate: { min: 9000, max: 19000, level: "Junior-Senior" },
      privateSectorEstimate: { min: 12000, max: 30000, level: "Junior-Senior" },
      currencyCode: "GHS",
      disclaimer:
        "Private emergency services and trauma centers offer premium compensation.",
      year: 2024
    },
    privateSectorPotential: "High",
    globalMobility: "Very High",
    aiReplacementRisk: "Low",
    futureDemandGhana: "Growing",
    traitProfile: traitVector({
      fastPacedPreference: 9,
      emergencyComfort: 9,
      diagnosticThinking: 8,
      emotionalResilience: 9,
      teamwork: 8,
      leadershipPreference: 7,
      proceduralInterest: 7,
      precisionOrientation: 7,
      patientInteraction: 4,
      communicationEmpathy: 6,
      longTermRelationships: 2,
      workLifeBalancePriority: 3,
      schedulePredictability: 2,
      researchInterest: 5,
      longTrainingTolerance: 6
    }),
    trainingPathway: {
      description:
        "4–6 year emergency medicine residency through GCPS or emergency-specific pathways.",
      durationYears: 5,
      requiredPrerequisites: [
        "Medical degree",
        "Internship",
        "Strong clinical skills foundation"
      ],
      certifications: ["GCPS Emergency Medicine diploma or fellowship"],
      keyMilestones: [
        "Year 1: Foundational emergency skills and trauma",
        "Years 2-3: Advanced resuscitation and procedural training",
        "Years 4-5: Senior EM officer duties and leadership"
      ]
    },
    ghanaData: {
      residencyPathwayGhana:
        "Growing emergency medicine training through GCPS and teaching hospitals. Ghana's trauma burden makes EM increasingly important.",
      commonTrainingCenters: [
        "Korle Bu Teaching Hospital (Emergency Department), Accra",
        "Komfo Anokye Teaching Hospital, Kumasi",
        "Regional hospital emergency departments"
      ],
      collegeBodies: ["Ghana College of Physicians and Surgeons"],
      residencyStructure:
        "Emergency department rotations, trauma bay, resuscitation training, prehospital care.",
      postSpecializationOptions: [
        "Prehospital/rescue medicine",
        "Trauma surgery subspecialization",
        "Emergency medicine academic leadership",
        "Private emergency medicine/trauma centers"
      ],
      internationalMobilityNotes:
        "Growing recognition; EM specialists increasingly sought internationally."
    },
    subspecialties: [
      { name: "Trauma & Resuscitation", description: "Major trauma and resuscitation" },
      { name: "Toxicology", description: "Poisoning and toxic exposures" },
      { name: "Prehospital Care", description: "Ambulance and rescue medicine" }
    ],
    relatedSpecialties: [
      "general-surgery",
      "orthopedic-surgery",
      "anesthesiology"
    ],
    typicalSchedule:
      "Shift-based: typically 8 or 12-hour shifts, rotating days/nights. Unpredictable census; can be extremely busy.",
    onCallFrequency: "Shift-based (part of work schedule, not additional on-call)",
    workEnvironments: [
      "Emergency department",
      "Trauma bay",
      "Resuscitation bay",
      "Acute assessment area",
      "Prehospital care/ambulance"
    ],
    dayInLife: {
      typical: [
        {
          time: "7:30 AM (shift start)",
          activity: "Briefing and department census review",
          intensity: 2,
          location: "ED office"
        },
        {
          time: "8:00 AM–12:00 PM",
          activity: "Patient evaluations: sprains, minor lacerations, minor respiratory issues",
          intensity: 4,
          location: "ED treatment areas"
        },
        {
          time: "12:00 PM",
          activity: "Major trauma alert: motor vehicle accident victim",
          intensity: 5,
          location: "Resuscitation bay"
        },
        {
          time: "1:30 PM",
          activity: "Continue ED patient flow; multidisciplinary team coordination",
          intensity: 4,
          location: "ED"
        },
        {
          time: "7:30 PM (shift end/handover)",
          activity: "Sign-out to next shift; discuss pending cases",
          intensity: 2,
          location: "ED"
        }
      ],
      callDay: [
        {
          time: "Night shift",
          activity: "Similar patient flow; potentially more trauma and intoxicated patients",
          intensity: 4,
          location: "ED"
        }
      ]
    },
    typicalCases: [
      "Motor vehicle accident victim with multiple injuries",
      "Acute chest pain: rule out MI with rapid workup",
      "Intoxicated patient with altered mental status",
      "Acute asthma exacerbation requiring urgent nebulization",
      "Laceration requiring wound exploration and repair"
    ],
    majorPros: [
      "Intellectual variety and constant stimulation",
      "Exciting resuscitations and emergency procedures",
      "Immediate patient outcomes and satisfaction",
      "Strong global recognition and mobility",
      "Good earning potential in urban/private centers",
      "Clear decision-making and action-oriented work",
      "Strong team environment"
    ],
    majorCons: [
      "Very high stress and burnout risk",
      "Shift work and irregular hours (fatigue)",
      "Limited patient continuity (one-time encounters)",
      "Exposure to violence and difficult social situations",
      "Emotionally intense trauma cases",
      "Medicolegal liability",
      "Compassion fatigue from acute suffering"
    ],
    commonMisconceptions: [
      "EM is 'only about trauma' (very broad pathology)",
      "EM physicians don't think long-term (they do, but in acute context)",
      "EM is less intellectual (requires rapid synthesis and broad knowledge)"
    ],
    recommendedStudentActivities: [
      "Extended ED rotations",
      "Trauma center exposure",
      "Resuscitation skills training",
      "Emergency procedures observation",
      "Prehospital care volunteering"
    ],
    researchOpportunities: [
      "Trauma outcomes and prevention",
      "Emergency care system optimization",
      "Acute illness epidemiology"
    ],
    tags: [
      "high-acuity",
      "fast-paced",
      "exciting",
      "high-stress",
      "diverse-pathology",
      "good-earning",
      "shift-work",
      "growing-field"
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// ============================================================================
// DENTAL SPECIALTIES (5 SPECIALTIES)
// ============================================================================

export const DENTAL_SPECIALTIES: SpecialtyProfile[] = [
  {
    id: "general-dentistry",
    slug: "general-dentistry",
    name: "General Dentistry",
    category: "dental",
    shortDescription:
      "Frontline preventive and restorative dental care covering examinations, cleanings, cavities, extractions, and patient education.",
    fullDescription:
      "General dentists provide primary oral healthcare—prevention, diagnosis, treatment of cavities, gum disease, and patient education. They manage diverse pathology, coordinate specialist referrals, and build long-term patient relationships. The specialty offers excellent work-life balance, predictable income, and strong autonomy.",
    personalityFitDescription:
      "You enjoy patient education, have good manual dexterity, value work-life balance, and appreciate the independence of dental practice.",
    idealCandidateDescription:
      "Excellent manual dexterity, attention to detail, good communication and patient rapport, business acumen (for practice management), and comfort with procedural variety.",
    icon: "🦷",
    colorTheme: { primary: "#0891b2", secondary: "#06b6d4" },
    trainingYearsMin: 0,
    trainingYearsMax: 1,
    competitiveness: "Low",
    residencyDifficulty: "Low",
    burnoutRisk: "Very Low",
    lifestyleRating: "5 - Excellent",
    emergencyIntensity: 1,
    patientInteractionLevel: 5,
    procedureIntensity: 5,
    diagnosticIntensity: 3,
    stressLevel: 1,
    workloadLevel: 3,
    averageSalaryGHS: {
      publicSectorEstimate: { min: 7000, max: 15000, level: "Junior-Senior" },
      privateSectorEstimate: { min: 12000, max: 40000, level: "Junior-Senior" },
      currencyCode: "GHS",
      disclaimer: "Private dental practice highly lucrative; solo practice common.",
      year: 2024
    },
    privateSectorPotential: "Very High",
    globalMobility: "High",
    aiReplacementRisk: "Medium",
    futureDemandGhana: "Growing",
    traitProfile: traitVector({
      patientInteraction: 8,
      proceduralInterest: 8,
      precisionOrientation: 9,
      longTermRelationships: 7,
      communicationEmpathy: 7,
      workLifeBalancePriority: 9,
      schedulePredictability: 9,
      leadershipPreference: 7,
      teamwork: 6,
      diagnosticThinking: 5,
      researchInterest: 2,
      fastPacedPreference: 3,
      emergencyComfort: 2,
      emotionalResilience: 5,
      longTrainingTolerance: 2
    }),
    trainingPathway: {
      description: "Bachelor of Dental Surgery (BDS) followed by registration.",
      durationYears: 4,
      requiredPrerequisites: ["Secondary school qualification", "Dental school entrance exam"],
      certifications: ["BDS from accredited dental school", "Dental registration (Dental Council)"],
      keyMilestones: [
        "Year 1: Foundational sciences and preclinical work",
        "Years 2-3: Clinical training under supervision",
        "Year 4: Advanced clinical cases and internship"
      ]
    },
    ghanaData: {
      residencyPathwayGhana:
        "Dental school training at University of Ghana School of Dentistry or Kwame Nkrumah University. Graduation followed by private practice or employment.",
      commonTrainingCenters: [
        "University of Ghana School of Dentistry, Accra",
        "Kwame Nkrumah University of Science and Technology (KNUST), Kumasi",
        "Teaching hospital dental clinics"
      ],
      collegeBodies: ["Dental Council of Ghana", "Ghana Dental Association"],
      residencyStructure:
        "Clinical rotations in operative dentistry, preventive dentistry, oral surgery, prosthodontics, and patient management.",
      postSpecializationOptions: [
        "Oral & maxillofacial surgery specialization",
        "Orthodontics specialization",
        "Pediatric dentistry specialization",
        "Private dental practice (most common)",
        "Public health dentistry"
      ],
      internationalMobilityNotes:
        "BDS recognized in Commonwealth countries. Exams required for US/Canada."
    },
    subspecialties: [],
    relatedSpecialties: [
      "orthodontics",
      "oral-maxillofacial-surgery",
      "pediatric-dentistry"
    ],
    typicalSchedule:
      "Regular: 8:00 AM–5:00 PM, Monday–Friday (or adjusted for private practice). Minimal on-call. One weekend per month in some practices.",
    onCallFrequency: "Minimal; occasional emergency dental calls",
    workEnvironments: [
      "Private dental clinic/practice",
      "Teaching hospital dental clinic",
      "Community health center dental services",
      "Corporate/institutional dental clinics"
    ],
    dayInLife: {
      typical: [
        {
          time: "8:00 AM",
          activity: "Review patient list and prepare treatment room",
          intensity: 1,
          location: "Clinic office"
        },
        {
          time: "8:30 AM–12:00 PM",
          activity: "Patient appointments: cleanings, cavity fillings, extractions, examinations",
          intensity: 4,
          location: "Treatment room"
        },
        {
          time: "12:00 PM–1:00 PM",
          activity: "Lunch break, sterilization, note-taking",
          intensity: 1,
          location: "Clinic"
        },
        {
          time: "1:00 PM–5:00 PM",
          activity: "Afternoon patient appointments, treatment continues",
          intensity: 4,
          location: "Treatment room"
        },
        {
          time: "5:00 PM",
          activity: "Final patient, cleanup, schedule review for next day",
          intensity: 1,
          location: "Clinic"
        }
      ],
      callDay: [
        {
          time: "Evening/weekend",
          activity: "Emergency dental calls: severe pain, trauma, infection",
          intensity: 3,
          location: "Clinic"
        }
      ]
    },
    typicalCases: [
      "Routine check-up and cleaning",
      "Cavity requiring filling",
      "Tooth extraction",
      "Gum disease patient education and scaling",
      "Patient with acute dental pain requiring emergency care"
    ],
    majorPros: [
      "Excellent work-life balance and schedule predictability",
      "Very high private practice income potential",
      "Strong patient relationships and continuity",
      "Low burnout risk",
      "Clear, tangible patient outcomes",
      "Autonomy in practice management",
      "Low emergency/stress environment"
    ],
    majorCons: [
      "Limited intellectual variety (repetitive procedures)",
      "Manual precision demands (hand fatigue possible)",
      "Patient anxiety management required",
      "Business management burden (if in private practice)",
      "Infection control and occupational hazards",
      "Limited research opportunities"
    ],
    commonMisconceptions: [
      "General dentistry is 'just cleaning teeth' (includes diagnosis, complex restorations, extractions)",
      "General dentistry is less prestigious (actually highly respected and lucrative)",
      "General dentistry offers no variety (diverse case types and patient populations)"
    ],
    recommendedStudentActivities: [
      "Community dental outreach",
      "Dental skills lab practice",
      "Internship rotations in private and public clinics",
      "Oral health education programs"
    ],
    researchOpportunities: [
      "Oral health epidemiology",
      "Dental health disparities",
      "Preventive dentistry outcomes"
    ],
    tags: [
      "excellent-lifestyle",
      "high-income-private",
      "low-stress",
      "patient-focused",
      "procedural",
      "independent-practice",
      "predictable-schedule",
      "good-demand"
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  {
    id: "orthodontics",
    slug: "orthodontics",
    name: "Orthodontics",
    category: "dental",
    shortDescription:
      "Specialized dental field focused on teeth alignment, bite correction, and facial development using braces, aligners, and orthopedic appliances.",
    fullDescription:
      "Orthodontists diagnose and correct misaligned teeth and bite problems through appliances, functional therapy, and surgical coordination. The specialty offers high income, good lifestyle, and long-term patient relationships while being less procedurally intense than general dentistry.",
    personalityFitDescription:
      "You enjoy biomechanics, aesthetic precision, and building long-term patient relationships across years of treatment.",
    idealCandidateDescription:
      "Strong spatial reasoning, attention to aesthetic detail, business acumen, patient communication skills, and willingness for specialty training.",
    icon: "😁",
    colorTheme: { primary: "#7c3aed", secondary: "#c4b5fd" },
    trainingYearsMin: 2,
    trainingYearsMax: 3,
    competitiveness: "High",
    residencyDifficulty: "High",
    burnoutRisk: "Very Low",
    lifestyleRating: "5 - Excellent",
    emergencyIntensity: 1,
    patientInteractionLevel: 4,
    procedureIntensity: 3,
    diagnosticIntensity: 4,
    stressLevel: 1,
    workloadLevel: 2,
    averageSalaryGHS: {
      publicSectorEstimate: { min: 12000, max: 22000, level: "Junior-Senior" },
      privateSectorEstimate: { min: 20000, max: 50000, level: "Junior-Senior" },
      currencyCode: "GHS",
      disclaimer: "Private orthodontic practice highly lucrative in Accra and major cities.",
      year: 2024
    },
    privateSectorPotential: "Very High",
    globalMobility: "Very High",
    aiReplacementRisk: "Medium",
    futureDemandGhana: "Growing",
    traitProfile: traitVector({
      precisionOrientation: 9,
      longTermRelationships: 8,
      patientInteraction: 6,
      workLifeBalancePriority: 9,
      schedulePredictability: 9,
      leadershipPreference: 7,
      diagnosticThinking: 6,
      fastPacedPreference: 2,
      emergencyComfort: 1,
      proceduralInterest: 6,
      communicationEmpathy: 6,
      teamwork: 5,
      researchInterest: 4,
      longTrainingTolerance: 7
    }),
    trainingPathway: {
      description:
        "BDS followed by 2–3 year orthodontics master's or residency program.",
      durationYears: 3,
      requiredPrerequisites: [
        "Bachelor of Dental Surgery (BDS)",
        "Dental registration",
        "Admission to ortho program"
      ],
      certifications: [
        "Master's in Orthodontics or postgraduate diploma",
        "Specialist registration"
      ],
      keyMilestones: [
        "Year 1: Orthodontic theory, diagnosis, and treatment planning",
        "Years 2-3: Clinical cases, complex treatment scenarios"
      ]
    },
    ghanaData: {
      residencyPathwayGhana:
        "Specialized orthodontics training at KNUST or international programs. Limited programs in Ghana; many pursue training abroad.",
      commonTrainingCenters: [
        "KNUST School of Dentistry, Kumasi",
        "University of Ghana School of Dentistry, Accra",
        "International orthodontics programs (UK, Australia, South Africa)"
      ],
      collegeBodies: ["Dental Council of Ghana", "Ghana Dental Association"],
      residencyStructure:
        "Advanced diagnosis and treatment planning, appliance management, surgical coordination, research projects.",
      postSpecializationOptions: [
        "Private specialist orthodontic practice (most common)",
        "Academic orthodontics",
        "International practice"
      ],
      internationalMobilityNotes:
        "Orthodontics qualifications highly sought internationally. Strong global market."
    },
    subspecialties: [
      {
        name: "Surgical Orthodontics",
        description: "Coordination with jaw surgery for severe skeletal discrepancies"
      },
      {
        name: "Pediatric Orthodontics",
        description: "Early intervention and growth management"
      }
    ],
    relatedSpecialties: ["general-dentistry", "oral-maxillofacial-surgery"],
    typicalSchedule:
      "Scheduled appointments only; 8:00 AM–4:00 PM, Monday–Friday. Highly predictable.",
    onCallFrequency: "Minimal to none",
    workEnvironments: [
      "Private orthodontic practice",
      "Specialty orthodontic clinic",
      "Teaching hospital orthodontics department"
    ],
    dayInLife: {
      typical: [
        {
          time: "8:00 AM",
          activity: "Review patient schedule and prepare treatment cases",
          intensity: 1,
          location: "Office"
        },
        {
          time: "8:30 AM–12:00 PM",
          activity: "Patient appointments: brace adjustments, new patient exams, progress reviews",
          intensity: 3,
          location: "Treatment room"
        },
        {
          time: "12:00 PM–1:00 PM",
          activity: "Lunch, treatment planning review, records analysis",
          intensity: 1,
          location: "Office"
        },
        {
          time: "1:00 PM–4:00 PM",
          activity: "Afternoon patient appointments continue",
          intensity: 3,
          location: "Treatment room"
        }
      ],
      callDay: [
        {
          time: "Evening/weekend",
          activity: "Minimal emergency coverage",
          intensity: 1,
          location: "Clinic"
        }
      ]
    },
    typicalCases: [
      "New patient evaluation and comprehensive treatment plan",
      "Routine brace adjustment and tightening",
      "Clear aligner case: progress review and new set dispensing",
      "Complex surgical case planning with maxillofacial surgeon",
      "Retention phase: follow-up after brace removal"
    ],
    majorPros: [
      "Excellent work-life balance and very predictable schedule",
      "Very high earning potential (especially private practice)",
      "Long-term patient relationships with measurable outcomes",
      "Limited emergencies; low stress",
      "Significant autonomy and practice independence",
      "Growing market demand (aesthetic focus in urban areas)",
      "Intellectual engagement with biomechanics and technology"
    ],
    majorCons: [
      "Requires additional specialty training beyond BDS",
      "Limited availability of training programs in Ghana",
      "Procedure variability is limited (similar cases repeatedly)",
      "Requires business acumen and practice management skills",
      "High investment in technology and equipment",
      "Patient expectations regarding timelines and results"
    ],
    commonMisconceptions: [
      "Orthodontics is 'just braces' (includes complex biomechanics and surgical coordination)",
      "Orthodontists have no lifestyle (actually excellent work-life balance)",
      "Orthodontics is less prestigious (actually high-demand specialty with strong earnings)"
    ],
    recommendedStudentActivities: [
      "Orthodontics electives and rotations",
      "Biomechanics and appliance study",
      "Case presentations and clinical conferences",
      "Engagement with orthodontics professional organizations"
    ],
    researchOpportunities: [
      "Orthodontic biomechanics and treatment outcomes",
      "Aligner technology and effectiveness studies",
      "Esthetic outcomes in orthodontics"
    ],
    tags: [
      "excellent-lifestyle",
      "highest-earning",
      "specialty-dental",
      "predictable-schedule",
      "low-stress",
      "aesthetic-focused",
      "high-demand",
      "competitive-entry"
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export function getAllRemainingMedicalSpecialties(): SpecialtyProfile[] {
  return REMAINING_MEDICAL_SPECIALTIES;
}

export function getAllDentalSpecialties(): SpecialtyProfile[] {
  return DENTAL_SPECIALTIES;
}

export function getDentalSpecialtyById(id: string): SpecialtyProfile | undefined {
  return DENTAL_SPECIALTIES.find((s) => s.id === id);
}
