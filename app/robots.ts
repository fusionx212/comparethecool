import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://comparethecool.com/sitemap.xml",
    host: "https://comparethecool.com",
  };
}
