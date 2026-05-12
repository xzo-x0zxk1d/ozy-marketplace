import { MetadataRoute } from "next";
import { getListings, getServices } from "@/lib/storage";

export const dynamic = "force-dynamic";
export const revalidate = 3600; // rebuild every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://ozy-marketplace.vercel.app";
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${base}/marketplace`, lastModified: now, changeFrequency: "hourly", priority: 0.9 },
    { url: `${base}/services`, lastModified: now, changeFrequency: "hourly", priority: 0.9 },
  ];

  let listingPages: MetadataRoute.Sitemap = [];
  let servicePages: MetadataRoute.Sitemap = [];

  try {
    const listings = await getListings();
    listingPages = listings.map((l) => ({
      url: `${base}/marketplace/${l.id}`,
      lastModified: new Date(l.createdAt),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch { /* supabase not available at build time */ }

  try {
    const services = await getServices();
    servicePages = services.map((s) => ({
      url: `${base}/services/${s.id}`,
      lastModified: new Date(s.createdAt),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch { /* supabase not available at build time */ }

  return [...staticPages, ...listingPages, ...servicePages];
}
