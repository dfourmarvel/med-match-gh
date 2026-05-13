import { TRAITS } from "@/data/traits/index";

export const seedTraits = Object.values(TRAITS).map((trait) => ({
  id: trait.id,
  name: trait.name,
  category: trait.category,
  description: trait.description,
  chart_label: trait.chartLabel,
  icon: trait.icon,
  color_hex: trait.colorHex,
  metadata: trait
}));

if (require.main === module) {
  console.log(JSON.stringify(seedTraits, null, 2));
}
