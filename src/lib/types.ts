export interface User {
  email: string;
  username: string;
  discordUsername: string;
  joinedAt: string;
  bio?: string;
  reputation?: number;
}

export type SupportedGame =
  | "Roblox (General)" | "Blox Fruits" | "Pet Simulator X" | "Adopt Me"
  | "Arsenal" | "Jailbreak" | "Murder Mystery 2" | "Royale High"
  | "Anime Adventures" | "Sols RNG" | "King Legacy" | "Brookhaven"
  | "Da Hood" | "Any Game" | "Not Game-Specific";

export const SUPPORTED_GAMES: SupportedGame[] = [
  "Roblox (General)","Blox Fruits","Pet Simulator X","Adopt Me",
  "Arsenal","Jailbreak","Murder Mystery 2","Royale High",
  "Anime Adventures","Sols RNG","King Legacy","Brookhaven",
  "Da Hood","Any Game","Not Game-Specific",
];

export const GAME_ICONS: Record<string, string> = {
  "Roblox (General)":"🎮","Blox Fruits":"🍈","Pet Simulator X":"🐾",
  "Adopt Me":"🐶","Arsenal":"🔫","Jailbreak":"🚗","Murder Mystery 2":"🔪",
  "Royale High":"👑","Anime Adventures":"⚔️","Sols RNG":"🎲",
  "King Legacy":"🏴‍☠️","Brookhaven":"🏠","Da Hood":"🏙️",
  "Any Game":"🌐","Not Game-Specific":"💼",
};

export type ListingCategory =
  | "Limiteds" | "Accessories" | "Faces" | "Gear" | "Bundles"
  | "Game Passes" | "Robux" | "Nitro" | "In-Game Items"
  | "Accounts" | "Collectibles" | "UGC" | "Other";

export type ListingCondition = "Mint" | "Good" | "Fair";

export type PaymentMethod =
  | "Robux" | "PayPal" | "Cash App" | "Crypto"
  | "Item Trade" | "Discord Nitro" | "Other";

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: string;
  category: ListingCategory;
  condition: ListingCondition;
  game: SupportedGame;
  imageUrl?: string;
  sellerUsername: string;
  sellerDiscord: string;
  createdAt: string;
  tags: string[];
  views: number;
  bumps: number;
  paymentMethods: PaymentMethod[];
  tradeOnly?: boolean;
  negotiable?: boolean;
}

export const CATEGORIES: ListingCategory[] = [
  "Limiteds","Accessories","Faces","Gear","Bundles","Game Passes",
  "Robux","Nitro","In-Game Items","Accounts","Collectibles","UGC","Other",
];

export const CATEGORY_ICONS: Record<string, string> = {
  "Limiteds":"💎","Accessories":"👒","Faces":"😊","Gear":"⚙️",
  "Bundles":"📦","Game Passes":"🎫","Robux":"💵","Nitro":"🚀",
  "In-Game Items":"🗡️","Accounts":"👤","Collectibles":"🏆","UGC":"🎨","Other":"📋",
};

export const CONDITIONS: ListingCondition[] = ["Mint","Good","Fair"];

export const PAYMENT_METHODS: PaymentMethod[] = [
  "Robux","PayPal","Cash App","Crypto","Item Trade","Discord Nitro","Other",
];

export type ServiceCategory =
  | "Scripting" | "Building" | "GFX / Art" | "UI Design" | "Game Dev"
  | "Thumbnails" | "Voice Acting" | "Moderation" | "Boosting"
  | "Coaching" | "Quest Completing" | "Account Services"
  | "Trading Services" | "Discord Services" | "Other";

export interface Service {
  id: string;
  title: string;
  description: string;
  price: string;
  category: ServiceCategory;
  deliveryTime: string;
  game: SupportedGame;
  imageUrl?: string;
  sellerUsername: string;
  sellerDiscord: string;
  createdAt: string;
  tags: string[];
  views: number;
  bumps: number;
  rating: number;
  reviews: number;
  paymentMethods: PaymentMethod[];
  negotiable?: boolean;
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  "Scripting","Building","GFX / Art","UI Design","Game Dev","Thumbnails",
  "Voice Acting","Moderation","Boosting","Coaching","Quest Completing",
  "Account Services","Trading Services","Discord Services","Other",
];

export const SERVICE_CATEGORY_ICONS: Record<string, string> = {
  "Scripting":"⚙️","Building":"🏗️","GFX / Art":"🎨","UI Design":"🖥️",
  "Game Dev":"🎮","Thumbnails":"🖼️","Voice Acting":"🎙️","Moderation":"🛡️",
  "Boosting":"⚡","Coaching":"🏆","Quest Completing":"📜",
  "Account Services":"👤","Trading Services":"🔄","Discord Services":"💬","Other":"📋",
};

export const DELIVERY_TIMES = [
  "< 1 hour","1–6 hours","1 day","2–3 days","Up to 1 week","2+ weeks","Negotiable",
];
