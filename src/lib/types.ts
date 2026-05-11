export interface User {
  email: string;
  username: string;
  discordUsername: string;
  joinedAt: string;
}

export type ListingCategory =
  | "Limiteds"
  | "Accessories"
  | "Faces"
  | "Gear"
  | "Bundles"
  | "Game Passes"
  | "Robux"
  | "Accounts"
  | "Other";

export type ListingCondition = "Mint" | "Good" | "Fair";

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: string;
  category: ListingCategory;
  condition: ListingCondition;
  imageUrl?: string;
  sellerUsername: string;
  sellerDiscord: string;
  createdAt: string;
  tags: string[];
  views: number;
  bumps: number;
}

export const CATEGORIES: ListingCategory[] = [
  "Limiteds",
  "Accessories",
  "Faces",
  "Gear",
  "Bundles",
  "Game Passes",
  "Robux",
  "Accounts",
  "Other",
];

export const CONDITIONS: ListingCondition[] = ["Mint", "Good", "Fair"];

// ── Services ───────────────────────────────────────────────

export type ServiceCategory =
  | "Scripting"
  | "Building"
  | "GFX / Art"
  | "UI Design"
  | "Game Dev"
  | "Thumbnails"
  | "Voice Acting"
  | "Moderation"
  | "Boosting"
  | "Other";

export interface Service {
  id: string;
  title: string;
  description: string;
  price: string;
  category: ServiceCategory;
  deliveryTime: string;
  imageUrl?: string;
  sellerUsername: string;
  sellerDiscord: string;
  createdAt: string;
  tags: string[];
  views: number;
  bumps: number;
  rating: number;
  reviews: number;
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  "Scripting",
  "Building",
  "GFX / Art",
  "UI Design",
  "Game Dev",
  "Thumbnails",
  "Voice Acting",
  "Moderation",
  "Boosting",
  "Other",
];

export const DELIVERY_TIMES = [
  "< 1 hour",
  "1–6 hours",
  "1 day",
  "2–3 days",
  "Up to 1 week",
  "2+ weeks",
  "Negotiable",
];
