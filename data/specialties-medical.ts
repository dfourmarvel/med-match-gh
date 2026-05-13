/**
 * Comprehensive Medical Specialties Dataset for MedMatch Ghana
 * 15 major medical specialties with full trait profiles and Ghana metadata
 */

import { SpecialtyProfile, TraitVector } from "@/data/types";

/**
 * Helper to create trait vectors
 */
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

export const MEDICAL_SPECIALTIES: SpecialtyProfile[] = [
  {
    id: "internal-medicine",
    slug: "internal-medicine",
    name: "Internal Medicine",
    category: "medical",
    shortDescription:
      "Comprehensive adult care combining diagnostic reasoning, longitudinal patient relationships, and complex disease management.",
    fullDescription:
      "Internal medicine is the cognitive heart of adult healthcare, balancing diagnostic depth with continuity of care. Internists manage complex comorbidities, coordinate multidisciplinary teams, and develop long-term therapeutic relationships. The field offers broad career flexibility—many subspecialize in cardiology, gastroenterology, nephrology, or rheumatology, while others remain general internists in academic or community settings.",
    personalityFitDescription:
      "You are an analytical, relationship-focused clinician who values diagnostic challenge and intellectual growth. You thrive in complex, ambiguous cases and enjoy mentoring.",
    idealCandidateDescription:
      "Strong foundational science knowledge, comfort with uncertainty, patience for longitudinal care, intellectual curiosity, and good communication skills.",
    icon: "🫀",
    colorTheme: { primary: "#0369a1", secondary: "#0ea5e9" },
    trainingYearsMin: 4,
    trainingYearsMax: 6,
    competitiveness: "High",
    residencyDifficulty: "High",
    burnoutRisk: "Medium",
    lifestyleRating: "3 - Fair",
    emergencyIntensity: 3,
    patientInteractionLevel: 4,
    procedureIntensity: 2,
    diagnosticIntensity: 5,
    stressLevel: 3,
    workloadLevel: 4,
    averageSalaryGHS: {
      publicSectorEstimate: { min: 8500, max: 18000, level: "Junior-Senior" },
      privateSectorEstimate: { min: 12000, max: 28000, level: "Junior-Senior" },
      currencyCode: "GHS",
      disclaimer:
        "Approximate monthly ranges. Private practice income varies widely with consultations and procedures.",
      year: 2024
    },
    privateSectorPotential: "High",
    globalMobility: "Very High",
    aiReplacementRisk: "Low",
    futureDemandGhana: "Growing",
    traitProfile: traitVector({
      patientInteraction: 7,
      diagnosticThinking: 9,
      longTermRelationships: 8,
      communicationEmpathy: 8,
      emotionalResilience: 7,
      researchInterest: 7,
      proceduralInterest: 3,
      fastPacedPreference: 5,
      workLifeBalancePriority: 5,
      teamwork: 7,
      precisionOrientation: 7,
      leadershipPreference: 6,
      longTrainingTolerance: 7,
      emergencyComfort: 5,
      schedulePredictability: 5
    }),
    trainingPathway: {
      description:
        "Post-housemanship residency through Ghana College of Physicians and Surgeons (GCPS) or West African College pathway.",
      durationYears: 5,
      requiredPrerequisites: [
        "Medical degree (MB ChB)",
        "Successful housemanship/internship",
        "Valid medical license"
      ],
      certifications: [
        "GCPS Fellowship in Internal Medicine",
        "Diploma in Internal Medicine (alternative pathway)"
      ],
      keyMilestones: [
        "First year: foundational internal medicine rotations",
        "Years 2-3: specialty rotations and clinical skill development",
        "Year 4: elective/research opportunities",
        "Year 5: senior medical officer responsibilities"
      ]
    },
    ghanaData: {
      residencyPathwayGhana:
        "GCPS-accredited program, typically 4-5 years after internship. Training at Korle Bu Teaching Hospital, Komfo Anokye Teaching Hospital, or other tertiary centers.",
      commonTrainingCenters: [
        "Korle Bu Teaching Hospital, Accra",
        "Komfo Anokye Teaching Hospital, Kumasi",
        "Ghana Army Hospital, Accra",
        "Police Hospital, Accra",
        "Regional referral hospitals (Takoradi, Sekondi)"
      ],
      collegeBodies: ["Ghana College of Physicians and Surgeons", "Medical and Dental Council of Ghana"],
      residencyStructure:
        "Rotating internships through medical wards, ICU, acute assessment units, and subspecialty clinics.",
      postSpecializationOptions: [
        "Subspecialty fellowship (cardiology, nephrology, gastroenterology, rheumatology)",
        "Private specialist practice",
        "Academic medicine",
        "Public health medicine",
        "Medical education and training"
      ],
      internationalMobilityNotes:
        "GCPS qualifications recognized across West Africa. International recognition requires further exams (MRCP, board certifications)."
    },
    subspecialties: [
      { name: "Cardiology", description: "Heart disease and cardiovascular disorders" },
      { name: "Gastroenterology", description: "GI tract, liver, and pancreatic disease" },
      { name: "Nephrology", description: "Kidney disease and renal replacement therapy" },
      { name: "Rheumatology", description: "Autoimmune and musculoskeletal disease" },
      { name: "Pulmonology", description: "Respiratory disease and critical care" },
      { name: "Infectious Diseases", description: "Complex infections and HIV management" }
    ],
    relatedSpecialties: ["family-medicine", "cardiology", "emergency-medicine"],
    typicalSchedule:
      "Monday-Friday, 7:00 AM–5:00 PM ward rounds and clinics. On-call duties 1–2 times weekly (busy urban centers), variable in regional hospitals.",
    onCallFrequency: "1-2 times per week; on-call calls range from busy to moderately busy",
    workEnvironments: [
      "Medical wards",
      "Intensive care units",
      "Outpatient specialty clinics",
      "Acute assessment areas",
      "Academic teaching rounds"
    ],
    dayInLife: {
      typical: [
        {
          time: "6:30 AM",
          activity: "Arrive early to review overnight labs and patient updates",
          intensity: 2,
          location: "Ward office"
        },
        {
          time: "8:00 AM",
          activity: "Ward round with resident team and medical students",
          intensity: 3,
          location: "Medical ward"
        },
        {
          time: "11:00 AM",
          activity: "Subspecialty consults and discharge planning",
          intensity: 3,
          location: "Various clinic areas"
        },
        {
          time: "1:00 PM",
          activity: "Lunch break + administrative tasks",
          intensity: 1,
          location: "Dining hall or office"
        },
        {
          time: "2:00 PM",
          activity: "Outpatient specialty clinic (e.g., hypertension, diabetes follow-up)",
          intensity: 3,
          location: "Specialty clinic"
        },
        {
          time: "5:00 PM",
          activity: "Final rounds, check on sick patients, handover to evening team",
          intensity: 2,
          location: "Ward"
        }
      ],
      callDay: [
        {
          time: "8:00 AM",
          activity: "Day-time ward duties",
          intensity: 4,
          location: "Ward"
        },
        {
          time: "5:00 PM",
          activity: "Take-over; prepare for evening and night calls",
          intensity: 3,
          location: "Ward office"
        },
        {
          time: "6:00 PM–8:00 AM",
          activity: "On-call: emergency consults, admissions, acute care management",
          intensity: 4,
          location: "Ward/ICU/emergency area"
        },
        {
          time: "8:00 AM",
          activity: "Handover and brief rest period",
          intensity: 1,
          location: "On-call room"
        }
      ]
    },
    typicalCases: [
      "50-year-old with newly diagnosed hypertension, pre-diabetes, and chronic lower back pain",
      "35-year-old with acute chest pain, troponin elevation, and ongoing cardiac workup",
      "Complex diabetic patient presenting with foot ulcer, renal dysfunction, and cardiovascular disease",
      "Septic patient with unclear source; broad diagnostics and empiric therapy optimization",
      "Elderly patient with polypharmacy, drug interactions, and syncopal episodes"
    ],
    majorPros: [
      "Diagnostic challenge and intellectual engagement",
      "Strong continuity with patients (rewarding long-term relationships)",
      "Broad scope for career customization (subspecialties, private practice, academia)",
      "Highly respected and recognized specialty",
      "Good private practice income potential in urban centers",
      "Strong mentoring and teaching opportunities"
    ],
    majorCons: [
      "High ward workload and administrative burden",
      "Frequent on-call responsibilities",
      "Patients often have complex, chronic conditions with limited solutions",
      "Moderate stress; compassion fatigue common",
      "Training is long and competitive",
      "Variable work-life balance, especially in academic centers"
    ],
    commonMisconceptions: [
      "Internal medicine is 'just' a generalist field (actually highly specialized)",
      "Internal medicine doesn't involve procedures (many subspecialties are procedure-heavy)",
      "Internal medicine specialists have poor work-life balance (depends on setting and subspecialty)",
      "Internal medicine has limited career growth (actually strong for academics and private practice)"
    ],
    recommendedStudentActivities: [
      "Shadowing on busy medical wards",
      "Participating in internal medicine grand rounds",
      "Presenting case reports at departmental conferences",
      "Completing internal medicine rotation electives early",
      "Joining medical student internal medicine club",
      "Attending specialty clinics (cardiology, GI, nephrology) as observer"
    ],
    researchOpportunities: [
      "Quality improvement projects on medical wards",
      "Clinical trials for cardiovascular disease, diabetes, or hypertension",
      "Epidemiological studies of chronic disease burden in Ghana",
      "Health services research on access to specialist care"
    ],
    tags: [
      "cognitive",
      "diagnostic",
      "high-responsibility",
      "broad-scope",
      "competitive",
      "subspecialty-rich",
      "teaching-hospital"
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // ========================================================================
  // GENERAL SURGERY
  // ========================================================================
  {
    id: "general-surgery",
    slug: "general-surgery",
    name: "General Surgery",
    category: "medical",
    shortDescription:
      "Operative specialty for decisive clinicians who thrive in emergency settings, perform complex procedures, and lead acute teams.",
    fullDescription:
      "General surgery is the flagship operative specialty—where procedures are performed urgently, decisions are made rapidly under pressure, and outcomes are immediately visible. Surgeons manage trauma, emergency abdomens, elective cases, and teach procedural skills. The specialty demands physical stamina, technical precision, and comfort with high stakes and irregular hours.",
    personalityFitDescription:
      "You are action-oriented, technically skilled, and energized by emergencies. You thrive under pressure, enjoy leadership, and value seeing tangible procedural results.",
    idealCandidateDescription:
      "Excellent manual dexterity, strong spatial reasoning, comfort with rapid decision-making, resilience under stress, leadership capability, and willingness to work irregular hours.",
    icon: "🔪",
    colorTheme: { primary: "#dc2626", secondary: "#ef4444" },
    trainingYearsMin: 5,
    trainingYearsMax: 7,
    competitiveness: "Very High",
    residencyDifficulty: "Very High",
    burnoutRisk: "High",
    lifestyleRating: "2 - Poor",
    emergencyIntensity: 5,
    patientInteractionLevel: 3,
    procedureIntensity: 5,
    diagnosticIntensity: 4,
    stressLevel: 5,
    workloadLevel: 5,
    averageSalaryGHS: {
      publicSectorEstimate: { min: 9000, max: 20000, level: "Junior-Senior" },
      privateSectorEstimate: { min: 15000, max: 35000, level: "Junior-Senior" },
      currencyCode: "GHS",
      disclaimer:
        "Private practice surgeons earn significantly more; includes theatre fees, private ward charges, and consultation fees.",
      year: 2024
    },
    privateSectorPotential: "Very High",
    globalMobility: "Very High",
    aiReplacementRisk: "Low",
    futureDemandGhana: "High Demand",
    traitProfile: traitVector({
      proceduralInterest: 9,
      fastPacedPreference: 8,
      emergencyComfort: 9,
      precisionOrientation: 9,
      emotionalResilience: 9,
      teamwork: 8,
      leadershipPreference: 8,
      longTrainingTolerance: 9,
      diagnosticThinking: 7,
      patientInteraction: 5,
      longTermRelationships: 3,
      workLifeBalancePriority: 2,
      schedulePredictability: 2,
      communicationEmpathy: 5
    }),
    trainingPathway: {
      description:
        "Highly competitive surgical residency through GCPS, typically 5–7 years after internship.",
      durationYears: 6,
      requiredPrerequisites: [
        "Medical degree (MB ChB)",
        "Successful internship",
        "Excellent academic record in preclinical and clinical rotations"
      ],
      certifications: [
        "GCPS Fellowship in General Surgery",
        "Primary Surgical Board exams (Part A and B)"
      ],
      keyMilestones: [
        "Year 1: foundational surgical skills and theatre exposure",
        "Year 2: basic operative procedures and responsibility increase",
        "Year 3: complex operative cases, junior consultant duties",
        "Year 4: subspecialty selection (colorectal, vascular, trauma focus)",
        "Years 5–6: senior surgical officer role, research/academic output"
      ]
    },
    ghanaData: {
      residencyPathwayGhana:
        "Competitive GCPS-accredited 5–7 year program. Training at Korle Bu, Komfo Anokye, and other tertiary surgical centers with high case volumes.",
      commonTrainingCenters: [
        "Korle Bu Teaching Hospital, Accra (highest case volume)",
        "Komfo Anokye Teaching Hospital, Kumasi",
        "Ghana Army Hospital, Accra",
        "Police Hospital, Accra"
      ],
      collegeBodies: ["Ghana College of Physicians and Surgeons", "West African College of Surgeons"],
      residencyStructure:
        "Rotating internships through trauma, emergency surgical units, elective theatre, and regional hospital placements. Strong emphasis on operative experience and logbook documentation.",
      postSpecializationOptions: [
        "Subspecialty training (vascular, colorectal, hepatobiliary, trauma surgery)",
        "Private surgical practice",
        "Academic surgery and residency training",
        "Administrative leadership in surgical departments",
        "International fellowships (UK, US, Middle East)"
      ],
      internationalMobilityNotes:
        "GCPS Fellowship recognized in West Africa. MRCS or FRACS further opens international pathways."
    },
    subspecialties: [
      { name: "Vascular Surgery", description: "Aortic, peripheral vascular, and endovascular disease" },
      { name: "Colorectal Surgery", description: "Colon, rectal, and anorectal pathology" },
      { name: "Hepatobiliary Surgery", description: "Liver, bile ducts, pancreas, and gallbladder" },
      { name: "Trauma Surgery", description: "Acute trauma, blast injuries, and emergency surgery" },
      { name: "Surgical Oncology", description: "Cancer surgery and perioperative oncologic care" }
    ],
    relatedSpecialties: [
      "orthopedic-surgery",
      "emergency-medicine",
      "anesthesiology",
      "obstetrics-gynecology"
    ],
    typicalSchedule:
      "Highly irregular. Theatre lists start 7:30 AM, run until afternoon/evening. Frequent emergency calls and trauma alerts. Sleep often interrupted.",
    onCallFrequency: "3–4 times per week or more; calls can be very busy with trauma and emergencies",
    workEnvironments: [
      "Operating theatres",
      "Trauma bays and resuscitation areas",
      "Surgical wards",
      "Emergency departments",
      "ICU"
    ],
    dayInLife: {
      typical: [
        {
          time: "5:30 AM",
          activity: "Arrive early; review theatre list and pre-op patients",
          intensity: 2,
          location: "Theatre prep area"
        },
        {
          time: "7:00 AM",
          activity: "Pre-op rounds, surgeon briefing, team huddle",
          intensity: 3,
          location: "Surgical ward"
        },
        {
          time: "8:00 AM",
          activity: "Begin theatre cases (elective + emergency cases mixed)",
          intensity: 5,
          location: "Operating theatre"
        },
        {
          time: "12:30 PM",
          activity: "Between-cases review, quick lunch",
          intensity: 2,
          location: "Theatre lounge"
        },
        {
          time: "1:30 PM",
          activity: "Afternoon theatre cases continue",
          intensity: 5,
          location: "Operating theatre"
        },
        {
          time: "5:00 PM",
          activity: "Final case closure; post-op reviews",
          intensity: 4,
          location: "Ward/ICU"
        },
        {
          time: "6:30 PM",
          activity: "Administrative tasks, teaching rounds if time allows",
          intensity: 2,
          location: "Surgical office"
        }
      ],
      callDay: [
        {
          time: "7:00 AM–5:00 PM",
          activity: "Regular day duties plus emergency call responsibility",
          intensity: 4,
          location: "Theatre/ward/emergency"
        },
        {
          time: "5:00 PM–8:00 AM",
          activity: "On-call: emergency trauma, acute surgical consults, emergency theatre",
          intensity: 5,
          location: "Emergency theatre/ward"
        },
        {
          time: "Overnight",
          activity: "May perform emergency abdominal, trauma, or other urgent surgical cases",
          intensity: 5,
          location: "Operating theatre"
        }
      ]
    },
    typicalCases: [
      "Acute appendicitis requiring emergency appendectomy",
      "Multi-trauma victim from motor vehicle accident",
      "Perforated peptic ulcer with peritonitis requiring surgery",
      "Elective cholecystectomy for gallstones",
      "Bowel obstruction requiring operative exploration"
    ],
    majorPros: [
      "Tangible, visible procedural results",
      "Highest earning potential in medicine (private practice)",
      "Leadership opportunities and autonomy in theatre",
      "Highly respected and prestigious specialty",
      "Global recognition and mobility",
      "Strong teaching and mentoring roles",
      "Intellectual and technical challenge"
    ],
    majorCons: [
      "Extremely demanding on-call schedule and sleep deprivation",
      "Very poor work-life balance, especially in training",
      "High burnout risk and stress",
      "Long, competitive training period",
      "Physical demands (standing for hours, repetitive strain)",
      "Medicolegal liability and stress",
      "Limited patient continuity"
    ],
    commonMisconceptions: [
      "Surgery is 'only' about procedures (significant diagnostic and clinical judgment involved)",
      "Surgeons don't communicate well (modern surgical teams are highly collaborative)",
      "Surgical training always means poor lifestyle (can improve as consultant)",
      "Surgery is dying due to technology (minimally invasive and robotic surgery expanding, not replacing surgeons)"
    ],
    recommendedStudentActivities: [
      "Extensive surgical rotations and theatre exposure",
      "Surgical skills workshops and simulation labs",
      "Case presentations and journal clubs",
      "Research projects in surgical outcomes",
      "Mentorship from experienced surgical faculty",
      "External electives at busy surgical centers"
    ],
    researchOpportunities: [
      "Trauma outcomes and epidemiology research",
      "Surgical quality improvement and safety initiatives",
      "Minimally invasive surgical technique development",
      "Surgical training program optimization"
    ],
    tags: [
      "procedural",
      "high-stakes",
      "high-pressure",
      "technical",
      "leadership-heavy",
      "very-competitive",
      "high-earning",
      "demanding"
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // ========================================================================
  // PEDIATRICS
  // ========================================================================
  {
    id: "pediatrics",
    slug: "pediatrics",
    name: "Pediatrics",
    category: "medical",
    shortDescription:
      "Child-focused medical specialty combining empathy, family-centered care, preventive medicine, and broad clinical reasoning.",
    fullDescription:
      "Pediatrics is a relationship-rich, prevention-focused specialty where clinicians care for children from infancy through adolescence. Pediatricians manage acute and chronic conditions, coordinate family-centered care, address developmental concerns, and provide anticipatory guidance. The field uniquely blends medical knowledge with child psychology, family dynamics, and public health.",
    personalityFitDescription:
      "You are warm, patient, and genuinely interested in child development and family dynamics. You enjoy teaching and find satisfaction in preventive health and early intervention.",
    idealCandidateDescription:
      "Strong communication with children and families, patience with parental concerns, comfort with developmental uncertainty, genuine affection for children, and commitment to preventive care.",
    icon: "👶",
    colorTheme: { primary: "#ec4899", secondary: "#f472b6" },
    trainingYearsMin: 4,
    trainingYearsMax: 6,
    competitiveness: "Medium",
    residencyDifficulty: "Medium",
    burnoutRisk: "Medium",
    lifestyleRating: "3 - Fair",
    emergencyIntensity: 3,
    patientInteractionLevel: 5,
    procedureIntensity: 2,
    diagnosticIntensity: 4,
    stressLevel: 3,
    workloadLevel: 4,
    averageSalaryGHS: {
      publicSectorEstimate: { min: 8500, max: 17000, level: "Junior-Senior" },
      privateSectorEstimate: { min: 11000, max: 26000, level: "Junior-Senior" },
      currencyCode: "GHS",
      disclaimer:
        "Pediatricians often earn less than surgeons but private practice can be lucrative in urban areas.",
      year: 2024
    },
    privateSectorPotential: "High",
    globalMobility: "Very High",
    aiReplacementRisk: "Low",
    futureDemandGhana: "Growing",
    traitProfile: traitVector({
      patientInteraction: 8,
      communicationEmpathy: 9,
      longTermRelationships: 7,
      teamwork: 8,
      emotionalResilience: 7,
      diagnosticThinking: 7,
      researchInterest: 5,
      leadershipPreference: 5,
      proceduralInterest: 3,
      fastPacedPreference: 5,
      precisionOrientation: 6,
      longTrainingTolerance: 6,
      emergencyComfort: 5,
      workLifeBalancePriority: 5,
      schedulePredictability: 5
    }),
    trainingPathway: {
      description:
        "Post-housemanship pediatric residency through GCPS, typically 4–6 years.",
      durationYears: 5,
      requiredPrerequisites: [
        "Medical degree (MB ChB)",
        "Successful housemanship",
        "Medical license"
      ],
      certifications: [
        "GCPS Fellowship in Pediatrics",
        "Diploma in Pediatrics (alternative pathway)"
      ],
      keyMilestones: [
        "Year 1: foundational pediatric care and neonatal medicine",
        "Year 2: acute pediatrics and emergency cases",
        "Year 3: chronic disease and subspecialty rotations",
        "Year 4: community pediatrics and preventive health",
        "Year 5: senior pediatric officer and teaching responsibilities"
      ]
    },
    ghanaData: {
      residencyPathwayGhana:
        "GCPS-accredited pediatric residency at major teaching hospitals. Strong emphasis on neonatal care, malaria, malnutrition, and childhood infections (common in Ghana context).",
      commonTrainingCenters: [
        "Korle Bu Teaching Hospital (Pediatrics Department), Accra",
        "Komfo Anokye Teaching Hospital (Child Health), Kumasi",
        "Regional referral hospitals with pediatric services"
      ],
      collegeBodies: [
        "Ghana College of Physicians and Surgeons",
        "Ghana Pediatric Association"
      ],
      residencyStructure:
        "Rotations through pediatric wards, neonatal ICU, child emergency department, outpatient clinics, and community health programs.",
      postSpecializationOptions: [
        "Subspecialty pediatrics (neonatology, pediatric cardiology, pediatric oncology, pediatric surgery)",
        "Community pediatrics and child public health",
        "Private pediatric practice",
        "Academic pediatrics and medical education",
        "International pediatric health/humanitarian work"
      ],
      internationalMobilityNotes:
        "GCPS qualifications recognized in West Africa and increasingly internationally. Further exams (MRCP, board certifications) enhance opportunities."
    },
    subspecialties: [
      { name: "Neonatology", description: "Newborn and premature infant care" },
      { name: "Pediatric Cardiology", description: "Congenital and acquired heart disease" },
      { name: "Pediatric Oncology", description: "Childhood cancers and hematologic malignancies" },
      { name: "Pediatric Gastroenterology", description: "GI disorders in children" },
      { name: "Community Pediatrics", description: "Child public health and preventive care" },
      { name: "Pediatric Infectious Diseases", description: "Complex infections in children" }
    ],
    relatedSpecialties: [
      "family-medicine",
      "obstetrics-gynecology",
      "public-health-community-medicine"
    ],
    typicalSchedule:
      "More regular than surgery; typically 7:00 AM–5:00 PM Monday–Friday. On-call 1–2 times weekly varies by center.",
    onCallFrequency: "1–2 times per week; calls moderately busy with neonatal issues and acute admissions",
    workEnvironments: [
      "Pediatric wards",
      "Neonatal ICU",
      "Pediatric emergency department",
      "Outpatient pediatric clinics",
      "Community health centers",
      "School health programs"
    ],
    dayInLife: {
      typical: [
        {
          time: "7:00 AM",
          activity: "Arrival; review overnight admissions and NICU updates",
          intensity: 2,
          location: "Ward office"
        },
        {
          time: "8:00 AM",
          activity: "Pediatric ward round with residents and students",
          intensity: 3,
          location: "Pediatric ward"
        },
        {
          time: "10:00 AM",
          activity: "Neonatal ICU review (routine and sick neonates)",
          intensity: 3,
          location: "NICU"
        },
        {
          time: "12:00 PM",
          activity: "Pediatric outpatient clinic (preventive care, growth monitoring, immunizations)",
          intensity: 3,
          location: "Outpatient clinic"
        },
        {
          time: "2:00 PM",
          activity: "Lunch and case review with team",
          intensity: 1,
          location: "Staff room"
        },
        {
          time: "3:00 PM",
          activity: "Community outreach or school health program",
          intensity: 2,
          location: "Community center/school"
        },
        {
          time: "5:00 PM",
          activity: "Final round and handover",
          intensity: 2,
          location: "Ward"
        }
      ],
      callDay: [
        {
          time: "7:00 AM–5:00 PM",
          activity: "Regular duties with on-call backup",
          intensity: 3,
          location: "Ward/clinic"
        },
        {
          time: "5:00 PM–8:00 AM",
          activity: "On-call: pediatric admissions, NICU emergencies, neonatal resuscitations",
          intensity: 4,
          location: "Ward/NICU/emergency"
        }
      ]
    },
    typicalCases: [
      "Febrile infant with concern for sepsis; rapid workup and empiric antibiotics",
      "Severely malnourished child with kwashiorkor; nutritional rehabilitation",
      "Premature infant in NICU with respiratory distress syndrome",
      "Child with cerebral malaria and seizures requiring urgent management",
      "Newborn with congenital heart disease requiring urgent cardiology consult"
    ],
    majorPros: [
      "Meaningful relationships with families over years",
      "Preventive impact and early intervention satisfaction",
      "Generally good work-life balance compared to surgery",
      "High satisfaction from child development and growth outcomes",
      "Global recognition and strong international mobility",
      "Combination of acute and outpatient work (variety)",
      "Strong teaching and mentoring opportunities"
    ],
    majorCons: [
      "Emotionally demanding cases (critically ill children, parental anxiety)",
      "Communicating with anxious parents can be challenging",
      "Lower earning potential than some other specialties",
      "On-call responsibilities can be demanding",
      "High prevalence of preventable childhood illness in Ghana (compassion fatigue risk)",
      "Resource limitations may frustrate care plans"
    ],
    commonMisconceptions: [
      "Pediatrics is 'less serious' than adult medicine (pediatric emergencies are just as critical)",
      "Pediatricians don't do procedures (significant procedural skills needed)",
      "Pediatrics is only for those who 'like children' (professional skill, not just personality)",
      "Pediatrics has poor career growth (strong opportunities in research, academics, global health)"
    ],
    recommendedStudentActivities: [
      "Extended pediatric rotations including NICU exposure",
      "Participation in immunization campaigns and child health initiatives",
      "Mentorship with pediatricians in community and private settings",
      "Child development and behavior research or projects",
      "School health and preventive medicine programs",
      "International pediatric health or humanitarian work"
    ],
    researchOpportunities: [
      "Childhood malaria prevention and treatment optimization",
      "Malnutrition epidemiology and intervention studies",
      "Vaccine uptake and immunization programs",
      "Developmental screening and early intervention"
    ],
    tags: [
      "empathy-focused",
      "relationship-focused",
      "preventive",
      "family-centered",
      "moderate-intensity",
      "good-lifestyle",
      "moderate-competitive",
      "growing-field"
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

/**
 * Utility: Get specialty by ID
 */
export function getMedicalSpecialtyById(id: string): SpecialtyProfile | undefined {
  return MEDICAL_SPECIALTIES.find((s) => s.id === id);
}

/**
 * Utility: Get all medical specialties
 */
export function getAllMedicalSpecialties(): SpecialtyProfile[] {
  return MEDICAL_SPECIALTIES;
}

/**
 * Utility: Get specialty IDs
 */
export function getMedicalSpecialtyIds(): string[] {
  return MEDICAL_SPECIALTIES.map((s) => s.id);
}
