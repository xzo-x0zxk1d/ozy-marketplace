import type { Metadata } from "next";
import ListingClient from "./ListingClient";
import { getListingById } from "@/lib/storage";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const listing = await getListingById(params.id);
  if (!listing) return { title: "Listing Not Found – Ozy Marketplace" };

  const title = `${listing.title} — ${listing.price} | Ozy Marketplace`;
  const description = `${listing.category} · ${listing.condition} · ${listing.game} · Sold by ${listing.sellerDiscord} on Discord. ${listing.description.slice(0, 120)}`;
  const url = `https://ozy-marketplace.vercel.app/marketplace/${params.id}`;

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
      images: listing.imageUrl
        ? [{ url: listing.imageUrl, width: 800, height: 800, alt: listing.title }]
        : [{ url: "https://www.image2url.com/r2/default/images/1777298691743-e9df5773-13ca-4a33-b269-ff3357c8910a.png", width: 512, height: 512, alt: "Ozy Marketplace" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: listing.imageUrl ? [listing.imageUrl] : [],
    },
  };
}

export default function ListingPage() {
  return <ListingClient />;
}
