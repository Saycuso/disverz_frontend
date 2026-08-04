import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Keep Google out of private areas and raw API routes
      disallow: ["/dashboard/", "/api/"],
    },
    sitemap: "https://disverz.com/sitemap.xml",
  };
}
