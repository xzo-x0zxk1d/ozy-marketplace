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
