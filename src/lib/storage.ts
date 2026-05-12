import { User, Listing, Service } from "./types";
import { supabase } from "./supabase";

const CURRENT_USER_KEY = "ozy_current_user";

export function setCurrentUser(user: User | null): void {
  if (typeof window === "undefined") return;
  if (user === null) localStorage.removeItem(CURRENT_USER_KEY);
  else localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;
  try { const r = localStorage.getItem(CURRENT_USER_KEY); return r ? JSON.parse(r) : null; }
  catch { return null; }
}

export async function findUserByEmail(email: string): Promise<User | null> {
  if (!supabase) return null;
  const { data } = await supabase.from("users").select("*").eq("email", email.toLowerCase()).maybeSingle();
  if (!data) return null;
  return { email: data.email, username: data.username, discordUsername: data.discord_username, joinedAt: data.joined_at, bio: data.bio, reputation: data.reputation };
}

export async function saveUser(user: User): Promise<void> {
  if (!supabase) return;
  await supabase.from("users").upsert({ email: user.email.toLowerCase(), username: user.username, discord_username: user.discordUsername, joined_at: user.joinedAt }, { onConflict: "email" });
}

function rowToListing(r: Record<string, unknown>): Listing {
  return {
    id: r.id as string, title: r.title as string, description: r.description as string,
    price: r.price as string, category: r.category as Listing["category"],
    condition: r.condition as Listing["condition"],
    game: (r.game as Listing["game"]) || "Roblox (General)",
    imageUrl: (r.image_url as string) || undefined,
    sellerUsername: r.seller_username as string, sellerDiscord: r.seller_discord as string,
    createdAt: r.created_at as string, tags: (r.tags as string[]) || [],
    views: (r.views as number) || 0, bumps: (r.bumps as number) || 0,
    paymentMethods: (r.payment_methods as Listing["paymentMethods"]) || [],
    tradeOnly: (r.trade_only as boolean) || false,
    negotiable: (r.negotiable as boolean) || false,
  };
}

export async function getListings(): Promise<Listing[]> {
  if (!supabase) return [];
  const { data } = await supabase.from("listings").select("*").order("created_at", { ascending: false });
  return (data || []).map(rowToListing);
}

export async function getListingById(id: string): Promise<Listing | null> {
  if (!supabase) return null;
  const { data } = await supabase.from("listings").select("*").eq("id", id).maybeSingle();
  return data ? rowToListing(data) : null;
}

export async function saveListing(listing: Listing): Promise<void> {
  if (!supabase) return;
  await supabase.from("listings").insert({
    id: listing.id, title: listing.title, description: listing.description,
    price: listing.price, category: listing.category, condition: listing.condition,
    game: listing.game, image_url: listing.imageUrl || null,
    seller_username: listing.sellerUsername, seller_discord: listing.sellerDiscord,
    created_at: listing.createdAt, tags: listing.tags, views: 0, bumps: 0,
    payment_methods: listing.paymentMethods, trade_only: listing.tradeOnly || false,
    negotiable: listing.negotiable || false,
  });
}

export async function deleteListing(id: string, username: string): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from("listings").delete().eq("id", id).eq("seller_username", username);
  return !error;
}

export async function bumpListing(id: string): Promise<void> {
  if (!supabase) return;
  const { data } = await supabase.from("listings").select("bumps").eq("id", id).maybeSingle();
  await supabase.from("listings").update({ bumps: ((data?.bumps as number) || 0) + 1, created_at: new Date().toISOString() }).eq("id", id);
}

export async function incrementViews(id: string): Promise<void> {
  if (!supabase) return;
  const { data } = await supabase.from("listings").select("views").eq("id", id).maybeSingle();
  await supabase.from("listings").update({ views: ((data?.views as number) || 0) + 1 }).eq("id", id);
}

function rowToService(r: Record<string, unknown>): Service {
  return {
    id: r.id as string, title: r.title as string, description: r.description as string,
    price: r.price as string, category: r.category as Service["category"],
    deliveryTime: (r.delivery_time as string) || "Negotiable",
    game: (r.game as Service["game"]) || "Not Game-Specific",
    imageUrl: (r.image_url as string) || undefined,
    sellerUsername: r.seller_username as string, sellerDiscord: r.seller_discord as string,
    createdAt: r.created_at as string, tags: (r.tags as string[]) || [],
    views: (r.views as number) || 0, bumps: (r.bumps as number) || 0,
    rating: (r.rating as number) || 0, reviews: (r.reviews as number) || 0,
    paymentMethods: (r.payment_methods as Service["paymentMethods"]) || [],
    negotiable: (r.negotiable as boolean) || false,
  };
}

export async function getServices(): Promise<Service[]> {
  if (!supabase) return [];
  const { data } = await supabase.from("services").select("*").order("created_at", { ascending: false });
  return (data || []).map(rowToService);
}

export async function getServiceById(id: string): Promise<Service | null> {
  if (!supabase) return null;
  const { data } = await supabase.from("services").select("*").eq("id", id).maybeSingle();
  return data ? rowToService(data) : null;
}

export async function saveService(service: Service): Promise<void> {
  if (!supabase) return;
  await supabase.from("services").insert({
    id: service.id, title: service.title, description: service.description,
    price: service.price, category: service.category, delivery_time: service.deliveryTime,
    game: service.game, image_url: service.imageUrl || null,
    seller_username: service.sellerUsername, seller_discord: service.sellerDiscord,
    created_at: service.createdAt, tags: service.tags, views: 0, bumps: 0,
    rating: 0, reviews: 0, payment_methods: service.paymentMethods,
    negotiable: service.negotiable || false,
  });
}

export async function deleteService(id: string, username: string): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from("services").delete().eq("id", id).eq("seller_username", username);
  return !error;
}

export async function bumpService(id: string): Promise<void> {
  if (!supabase) return;
  const { data } = await supabase.from("services").select("bumps").eq("id", id).maybeSingle();
  await supabase.from("services").update({ bumps: ((data?.bumps as number) || 0) + 1, created_at: new Date().toISOString() }).eq("id", id);
}

export async function incrementServiceViews(id: string): Promise<void> {
  if (!supabase) return;
  const { data } = await supabase.from("services").select("views").eq("id", id).maybeSingle();
  await supabase.from("services").update({ views: ((data?.views as number) || 0) + 1 }).eq("id", id);
}

export async function uploadListingImage(file: File, listingId: string): Promise<string | null> {
  if (!supabase) return null;
  const ext = file.name.split(".").pop() || "jpg";
  const path = `listings/${listingId}.${ext}`;
  const { error } = await supabase.storage.from("listing-images").upload(path, file, { cacheControl: "864000", upsert: true, contentType: file.type });
  if (error) { console.error("Upload error:", error); return null; }
  return supabase.storage.from("listing-images").getPublicUrl(path).data.publicUrl;
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
