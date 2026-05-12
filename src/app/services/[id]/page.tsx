import type { Metadata } from "next";
import ServiceClient from "./ServiceClient";
import { getServiceById } from "@/lib/storage";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const service = await getServiceById(params.id);
  if (!service) return { title: "Service Not Found – Ozy Marketplace" };

  const title = `${service.title} — ${service.price} | Ozy Marketplace`;
  const description = `${service.category} service · Delivery: ${service.deliveryTime} · By ${service.sellerDiscord} on Discord. ${service.description.slice(0, 120)}`;
  const url = `https://ozy-marketplace.vercel.app/services/${params.id}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      siteName: "Ozy Marketplace",
      images: service.imageUrl
        ? [{ url: service.imageUrl, width: 800, height: 800, alt: service.title }]
        : [{ url: "https://www.image2url.com/r2/default/images/1777298691743-e9df5773-13ca-4a33-b269-ff3357c8910a.png", width: 512, height: 512, alt: "Ozy Marketplace" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: service.imageUrl ? [service.imageUrl] : [],
    },
  };
}

export default function ServicePage() {
  return <ServiceClient />;
}
