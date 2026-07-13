import type { MetadataRoute } from "next";
import { siteDescription, siteName } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteName,
    short_name: "MedMatch",
    description: siteDescription,
    start_url: "/",
    display: "standalone",
    background_color: "#f7f2e7",
    theme_color: "#12291f",
    icons: [
      { src: "/icon.svg", type: "image/svg+xml", sizes: "any" },
      { src: "/apple-icon", type: "image/png", sizes: "180x180" }
    ]
  };
}
