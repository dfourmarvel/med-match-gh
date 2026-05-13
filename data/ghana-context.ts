/**
 * Ghana-Specific Metadata and Context
 * Medical institutions, regions, training centers, and local resources
 */

import { GhanaInstitution, GhanaRegion } from "@/data/types";

/**
 * Major medical and dental institutions in Ghana
 */
export const GHANA_INSTITUTIONS: GhanaInstitution[] = [
  {
    id: "korle-bu",
    name: "Korle Bu Teaching Hospital",
    shortName: "KBTH",
    location: "Accra",
    region: "Greater Accra",
    type: "teaching-hospital",
    website: "https://www.korlebuteach.org",
    specialtiesOffered: [
      "internal-medicine",
      "general-surgery",
      "pediatrics",
      "obstetrics-gynecology",
      "psychiatry",
      "emergency-medicine",
      "orthopedic-surgery",
      "radiology",
      "anesthesiology",
      "neurology",
      "dermatology"
    ]
  },
  {
    id: "komfo-anokye",
    name: "Komfo Anokye Teaching Hospital",
    shortName: "KATH",
    location: "Kumasi",
    region: "Ashanti",
    type: "teaching-hospital",
    website: "https://www.komfoanokye.org",
    specialtiesOffered: [
      "internal-medicine",
      "general-surgery",
      "pediatrics",
      "obstetrics-gynecology",
      "emergency-medicine",
      "orthopedic-surgery",
      "anesthesiology",
      "radiology"
    ]
  },
  {
    id: "uog-medical",
    name: "University of Ghana School of Medicine",
    shortName: "UG Medicine",
    location: "Accra",
    region: "Greater Accra",
    type: "medical-school",
    website: "https://www.ug.edu.gh",
    specialtiesOffered: []
  },
  {
    id: "knust-medical",
    name: "KNUST School of Medical Sciences",
    shortName: "KNUST Medicine",
    location: "Kumasi",
    region: "Ashanti",
    type: "medical-school",
    website: "https://www.knust.edu.gh",
    specialtiesOffered: []
  },
  {
    id: "uog-dental",
    name: "University of Ghana School of Dentistry",
    shortName: "UG Dentistry",
    location: "Accra",
    region: "Greater Accra",
    type: "dental-school",
    website: "https://www.ug.edu.gh",
    specialtiesOffered: [
      "general-dentistry",
      "orthodontics",
      "oral-maxillofacial-surgery",
      "pediatric-dentistry",
      "periodontics"
    ]
  },
  {
    id: "knust-dental",
    name: "KNUST School of Dentistry",
    shortName: "KNUST Dentistry",
    location: "Kumasi",
    region: "Ashanti",
    type: "dental-school",
    website: "https://www.knust.edu.gh",
    specialtiesOffered: [
      "general-dentistry",
      "orthodontics",
      "oral-maxillofacial-surgery"
    ]
  },
  {
    id: "ghana-army-hospital",
    name: "Ghana Army Hospital",
    shortName: "Army Hospital",
    location: "Accra",
    region: "Greater Accra",
    type: "teaching-hospital",
    website: "https://www.armyhosp.mil.gh",
    specialtiesOffered: [
      "internal-medicine",
      "general-surgery",
      "pediatrics",
      "orthopedic-surgery",
      "anesthesiology"
    ]
  },
  {
    id: "police-hospital",
    name: "Police Hospital",
    shortName: "Police Hospital",
    location: "Accra",
    region: "Greater Accra",
    type: "teaching-hospital",
    website: "https://www.police.gov.gh",
    specialtiesOffered: [
      "internal-medicine",
      "general-surgery",
      "pediatrics",
      "emergency-medicine"
    ]
  },
  {
    id: "ridge-hospital",
    name: "Ridge Hospital",
    shortName: "Ridge",
    location: "Accra",
    region: "Greater Accra",
    type: "teaching-hospital",
    website: "https://www.ridgepital.org",
    specialtiesOffered: [
      "general-surgery",
      "obstetrics-gynecology",
      "pediatrics"
    ]
  },
  {
    id: "pantang-hospital",
    name: "Pantang Hospital",
    shortName: "Pantang",
    location: "Accra",
    region: "Greater Accra",
    type: "teaching-hospital",
    website: "https://www.pantanghospital.org",
    specialtiesOffered: ["psychiatry"]
  },
  {
    id: "regional-takoradi",
    name: "Takoradi Teaching Hospital",
    shortName: "Takoradi",
    location: "Takoradi",
    region: "Western",
    type: "teaching-hospital",
    website: "",
    specialtiesOffered: [
      "general-surgery",
      "pediatrics",
      "obstetrics-gynecology",
      "internal-medicine"
    ]
  },
  {
    id: "regional-sekondi",
    name: "Sekondi Regional Hospital",
    shortName: "Sekondi",
    location: "Sekondi",
    region: "Western",
    type: "teaching-hospital",
    website: "",
    specialtiesOffered: [
      "general-surgery",
      "pediatrics",
      "internal-medicine"
    ]
  }
];

/**
 * Ghana's 16 administrative regions with medical centers
 */
export const GHANA_REGIONS: GhanaRegion[] = [
  {
    code: "GA",
    name: "Greater Accra",
    capital: "Accra",
    medicalCenters: [
      "Korle Bu Teaching Hospital",
      "Ridge Hospital",
      "Police Hospital",
      "Ghana Army Hospital",
      "Pantang Hospital"
    ],
    trainingOpportunities:
      "Most diverse specialty training; primary hub for medical education and residency programs"
  },
  {
    code: "AS",
    name: "Ashanti",
    capital: "Kumasi",
    medicalCenters: ["Komfo Anokye Teaching Hospital", "KNUST School of Medical Sciences"],
    trainingOpportunities: "Strong secondary training center; particularly strong in surgery and pediatrics"
  },
  {
    code: "WR",
    name: "Western",
    capital: "Sekondi",
    medicalCenters: ["Takoradi Teaching Hospital", "Sekondi Regional Hospital"],
    trainingOpportunities: "Regional training opportunities; exposure to rural and semi-urban practice"
  },
  {
    code: "CR",
    name: "Central",
    capital: "Cape Coast",
    medicalCenters: ["Cape Coast Regional Hospital"],
    trainingOpportunities: "Limited specialty training; more clinical exposure at district level"
  },
  {
    code: "ER",
    name: "Eastern",
    capital: "Koforidua",
    medicalCenters: ["Koforidua Regional Hospital"],
    trainingOpportunities: "District-level medical experience; exposure to rural healthcare challenges"
  },
  {
    code: "VR",
    name: "Volta",
    capital: "Ho",
    medicalCenters: ["Ho Regional Hospital"],
    trainingOpportunities: "Rural and periurban medical practice"
  },
  {
    code: "NR",
    name: "Northern",
    capital: "Tamale",
    medicalCenters: ["Tamale Teaching Hospital"],
    trainingOpportunities: "Strong regional center; exposure to tropical infectious diseases"
  },
  {
    code: "TR",
    name: "Upper East",
    capital: "Bolgatanga",
    medicalCenters: ["Bolgatanga Regional Hospital"],
    trainingOpportunities: "Rural healthcare and community medicine emphasis"
  },
  {
    code: "UR",
    name: "Upper West",
    capital: "Wa",
    medicalCenters: ["Wa Regional Hospital"],
    trainingOpportunities: "Rural healthcare; limited specialty services"
  },
  {
    code: "SV",
    name: "Savannah",
    capital: "Damongo",
    medicalCenters: ["Damongo District Hospital"],
    trainingOpportunities: "District healthcare; primary care emphasis"
  },
  {
    code: "NE",
    name: "Northeast",
    capital: "Nalerigu",
    medicalCenters: ["Nalerigu District Hospital"],
    trainingOpportunities: "Very limited; largely primary care"
  },
  {
    code: "BO",
    name: "Bono",
    capital: "Sunyani",
    medicalCenters: ["Sunyani Regional Hospital"],
    trainingOpportunities: "Regional training center; secondary care"
  },
  {
    code: "BA",
    name: "Bono East",
    capital: "Techiman",
    medicalCenters: ["Techiman Hospital"],
    trainingOpportunities: "District-level medical services"
  },
  {
    code: "OT",
    name: "Oti",
    capital: "Dambai",
    medicalCenters: ["Dambai District Hospital"],
    trainingOpportunities: "Limited; primary healthcare focus"
  },
  {
    code: "AF",
    name: "Ahafo",
    capital: "Goaso",
    medicalCenters: ["Goaso District Hospital"],
    trainingOpportunities: "District healthcare"
  },
  {
    code: "WN",
    name: "Western North",
    capital: "Sefwi Wiawso",
    medicalCenters: ["Sefwi Wiawso District Hospital"],
    trainingOpportunities: "Limited; primary care emphasis"
  }
];

/**
 * Ghana College of Physicians and Surgeons (GCPS) information
 */
export const GCPS_INFO = {
  name: "Ghana College of Physicians and Surgeons",
  website: "https://gcps.edu.gh",
  description:
    "Professional body regulating postgraduate medical and surgical training in Ghana",
  residencyRequirements:
    "Typically 4-7 years depending on specialty; includes structured rotations, exams, and logbook requirements",
  examStructure:
    "Two-part exams (Part A: written; Part B: clinical/OSCE) conducted annually",
  trainingCenters: [
    "Korle Bu Teaching Hospital",
    "Komfo Anokye Teaching Hospital",
    "Ghana Army Hospital",
    "Police Hospital",
    "Regional teaching hospitals"
  ],
  postgraduatePathways: [
    "Diploma pathway (shorter, practical focus)",
    "Fellowship pathway (longer, academic focus)",
    "Master's programs (select specialties)"
  ]
};

/**
 * Ghana-specific challenges and opportunities in healthcare
 */
export const GHANA_HEALTHCARE_CONTEXT = {
  challenges: [
    "Limited specialist availability outside Accra and Kumasi",
    "Significant urban-rural healthcare disparities",
    "High burden of infectious diseases (malaria, TB, HIV)",
    "Resource constraints in public sector facilities",
    "Brain drain of physicians abroad",
    "Limited access to advanced diagnostic imaging in regions",
    "High maternal and child mortality in remote areas",
    "Medication shortages and supply chain issues"
  ],
  opportunities: [
    "Growing private sector investment in healthcare",
    "International partnerships and research collaborations",
    "Increasing demand for specialists in urban areas",
    "Government focus on health infrastructure expansion",
    "NGO and donor-supported public health programs",
    "Telemedicine and digital health expansion",
    "Medical tourism in high-quality private centers",
    "Fellowship opportunities through international organizations"
  ],
  practiceSettings: {
    public: "Government hospitals and clinics; stable income but often under-resourced",
    private: "Growing private sector; higher income potential but variable equipment/support",
    ngo: "Humanitarian and NGO-supported healthcare; mission-driven work",
    mixed: "Common model combining public duties with private practice"
  }
};

/**
 * Get institution by ID
 */
export function getGhanaInstitutionById(id: string): GhanaInstitution | undefined {
  return GHANA_INSTITUTIONS.find((inst) => inst.id === id);
}

/**
 * Get region by code
 */
export function getGhanaRegionByCode(code: string): GhanaRegion | undefined {
  return GHANA_REGIONS.find((region) => region.code === code);
}

/**
 * Get all institutions in a region
 */
export function getInstitutionsByRegion(regionName: string): GhanaInstitution[] {
  return GHANA_INSTITUTIONS.filter((inst) => inst.region === regionName);
}

/**
 * Get institutions offering a specific specialty
 */
export function getInstitutionsOfferingSpecialty(specialtyId: string): GhanaInstitution[] {
  return GHANA_INSTITUTIONS.filter((inst) =>
    inst.specialtiesOffered.includes(specialtyId)
  );
}

/**
 * Get top training centers for specialty
 */
export function getTopTrainingCentersForSpecialty(specialtyId: string): string[] {
  const centers = getInstitutionsOfferingSpecialty(specialtyId);
  return centers.slice(0, 3).map((c) => c.name);
}

/**
 * Ghana salary ranges context
 */
export const GHANA_SALARY_CONTEXT = {
  disclaimer:
    "Approximate ranges for reference only. Varies significantly by institution, experience level, and public/private mix. Private practice substantially increases earnings.",
  publicSectorNotes:
    "Government salary based on SSSS scale; consistent but modest. Includes benefits and job security.",
  privateSectorNotes:
    "Highly variable; depends on patient volume, procedure fees, specialist reputation. Can be 2-3x public sector.",
  currencyNote: "All amounts in Ghanaian Cedis (GHS)",
  year: 2024
};
