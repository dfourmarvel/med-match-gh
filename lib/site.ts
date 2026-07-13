/** Canonical site URL and identity, used for metadata, sitemap, robots, and manifest. */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/+$/, "");

export const siteName = "MedMatch Ghana";

export const siteDescription =
  "Discover medical and dental specialties that fit your personality, interests, and goals — with Ghana-aware training pathways.";
