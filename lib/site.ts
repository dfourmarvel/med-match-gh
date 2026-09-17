/** Canonical site URL and identity, used for metadata, sitemap, robots, and manifest. */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/+$/, "");

export const siteName = "MedMatch Ghana";

export const siteDescription =
  "Free medical specialty quiz for Ghanaian medical and dental students. Find the specialties that fit your personality and goals, with GCPS and WACS training pathways, residency length and pay in Ghana.";
