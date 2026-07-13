import type { MetadataRoute } from "next";
import { specialties } from "@/lib/specialties";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/assessment`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteUrl}/specialties`, lastModified, changeFrequency: "monthly", priority: 0.8 }
  ];

  const specialtyRoutes: MetadataRoute.Sitemap = specialties.map((specialty) => ({
    url: `${siteUrl}/specialties/${specialty.id}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.6
  }));

  return [...staticRoutes, ...specialtyRoutes];
}
