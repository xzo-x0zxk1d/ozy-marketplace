import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/marketplace", "/services"],
        disallow: ["/dashboard", "/marketplace/new", "/services/new"],
      },
    ],
    sitemap: "https://ozy-marketplace.vercel.app/sitemap.xml",
    host: "https://ozy-marketplace.vercel.app",
  };
}
