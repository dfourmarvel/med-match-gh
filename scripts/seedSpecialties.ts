import { SPECIALTIES } from "@/data/specialties/index";

export const seedSpecialties = SPECIALTIES.map((specialty) => ({
  id: specialty.id,
  slug: specialty.slug,
  name: specialty.name,
  category: specialty.category,
  short_description: specialty.shortDescription,
  full_description: specialty.fullDescription,
  trait_profile: specialty.traitProfile,
  training_years: specialty.trainingYears,
  competitiveness: specialty.competitiveness,
  burnout_risk: specialty.burnoutRisk,
  lifestyle_rating: specialty.lifestyleRating,
  future_demand: specialty.futureDemand,
  data: specialty
}));

if (require.main === module) {
  console.log(JSON.stringify(seedSpecialties, null, 2));
}
