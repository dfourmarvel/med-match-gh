export const GHANA_TRAINING_REFERENCES = [
  {
    label: "Ghana College of Physicians and Surgeons",
    url: "https://gcps.edu.gh/",
    note: "Official home for Ghana's postgraduate medical and dental specialist training college."
  },
  {
    label: "GCPS Training Centers",
    url: "https://gcps.edu.gh/training-centers/",
    note: "Official training center listings by faculty, residency type, city/town, and region."
  },
  {
    label: "GCPS Admissions and Training Requirements",
    url: "https://gcps.edu.gh/admissions-and-training-requirements/",
    note: "Official admissions guidance, exam timelines, membership/fellowship eligibility, and application process."
  },
  {
    label: "GCPS Rules & Regulations",
    url: "https://gcps.edu.gh/rules-regulations/",
    note: "Rules governing postgraduate training, registration, residency programmes, and fellowship progression."
  }
];

export const GHANA_INSTITUTIONS = [
  { id: "korle-bu", name: "Korle-Bu Teaching Hospital", city: "Accra", region: "Greater Accra", type: "teaching-hospital" },
  { id: "komfo-anokye", name: "Komfo Anokye Teaching Hospital", city: "Kumasi", region: "Ashanti", type: "teaching-hospital" },
  { id: "tamale-teaching", name: "Tamale Teaching Hospital", city: "Tamale", region: "Northern", type: "teaching-hospital" },
  { id: "cape-coast-teaching", name: "Cape Coast Teaching Hospital", city: "Cape Coast", region: "Central", type: "teaching-hospital" },
  { id: "ho-teaching", name: "Ho Teaching Hospital", city: "Ho", region: "Volta", type: "teaching-hospital" },
  { id: "ugmc", name: "University of Ghana Medical Centre", city: "Accra", region: "Greater Accra", type: "specialist-hospital" },
  { id: "37-military", name: "37 Military Hospital", city: "Accra", region: "Greater Accra", type: "military-teaching-hospital" },
  { id: "greater-accra-regional", name: "Greater Accra Regional Hospital", city: "Accra", region: "Greater Accra", type: "regional-hospital" },
  { id: "eastern-regional", name: "Eastern Regional Hospital", city: "Koforidua", region: "Eastern", type: "regional-hospital" },
  { id: "effia-nkwanta", name: "Effia Nkwanta Regional Hospital", city: "Takoradi", region: "Western", type: "regional-hospital" },
  { id: "focos", name: "FOCOS Orthopaedic Hospital", city: "Accra", region: "Greater Accra", type: "specialist-hospital" },
  { id: "ugms", name: "University of Ghana Medical School", city: "Accra", region: "Greater Accra", type: "medical-school" },
  { id: "knust-sms", name: "KNUST School of Medical Sciences", city: "Kumasi", region: "Ashanti", type: "medical-school" },
  { id: "ug-dental", name: "University of Ghana Dental School", city: "Accra", region: "Greater Accra", type: "dental-school" }
] as const;

export const GHANA_REGIONS = [
  "Ahafo",
  "Ashanti",
  "Bono",
  "Bono East",
  "Central",
  "Eastern",
  "Greater Accra",
  "North East",
  "Northern",
  "Oti",
  "Savannah",
  "Upper East",
  "Upper West",
  "Volta",
  "Western",
  "Western North"
] as const;

export const GHANA_CAREER_CONTEXT = {
  admissionsSummary:
    "GCPS guidance describes postgraduate training routes such as Membership and Fellowship, with eligibility commonly involving house officer rotations, medical officer experience or priority-specialty exceptions, Medical and Dental Council registration in good standing, exams, interviews, and accredited training centers.",
  trainingCenterCaution:
    "Training centers and subspecialty accreditation can change. Production copy should link to the official GCPS training centers page instead of treating app data as definitive.",
  salaryCaution:
    "Salary estimates should be displayed as broad directional ranges, never as guaranteed income. Public salary, call allowance, private work, location, seniority, and ownership all materially change actual earnings.",
  studentAdvice:
    "Students should use MedMatch Ghana as a conversation starter, then verify training requirements with GCPS, school advisors, current residents, consultants, and the Medical and Dental Council where relevant."
};
