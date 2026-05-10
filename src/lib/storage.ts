import { User, Listing } from "./types";
import { supabase } from "./supabase";

// ── Local session only (user stays logged in on this device) ──
const CURRENT_USER_KEY = "ozy_current_user";

export function setCurrentUser(user: User | null): void {
  if (typeof window === "undefined") return;
  if (user === null) localStorage.removeItem(CURRENT_USER_KEY);
  else localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

// ── Users (Supabase) ───────────────────────────────────────

export async function findUserByEmail(email: string): Promise<User | null> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email.toLowerCase())
    .maybeSingle();
  if (error || !data) return null;
  return {
    email: data.email,
    username: data.username,
    discordUsername: data.discord_username,
    joinedAt: data.joined_at,
  };
}

export async function saveUser(user: User): Promise<void> {
  await supabase.from("users").upsert({
    email: user.email.toLowerCase(),
    username: user.username,
    discord_username: user.discordUsername,
    joined_at: user.joinedAt,
  }, { onConflict: "email" });
}

// ── Listings (Supabase) ────────────────────────────────────

function rowToListing(row: Record<string, unknown>): Listing {
  return {
    id: row.id as string,
    title: row.title as string,
    description: row.description as string,
    price: row.price as string,
    category: row.category as Listing["category"],
    condition: row.condition as Listing["condition"],
    imageUrl: (row.image_url as string) || undefined,
    sellerUsername: row.seller_username as string,
    sellerDiscord: row.seller_discord as string,
    createdAt: row.created_at as string,
    tags: (row.tags as string[]) || [],
    views: (row.views as number) || 0,
    bumps: (row.bumps as number) || 0,
  };
}

export async function getListings(): Promise<Listing[]> {
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data.map(rowToListing);
}

export async function saveListing(listing: Listing): Promise<void> {
  await supabase.from("listings").insert({
    id: listing.id,
    title: listing.title,
    description: listing.description,
    price: listing.price,
    category: listing.category,
    condition: listing.condition,
    image_url: listing.imageUrl || null,
    seller_username: listing.sellerUsername,
    seller_discord: listing.sellerDiscord,
    created_at: listing.createdAt,
    tags: listing.tags,
    views: 0,
    bumps: 0,
  });
}

export async function deleteListing(id: string, username: string): Promise<boolean> {
  const { error } = await supabase
    .from("listings")
    .delete()
    .eq("id", id)
    .eq("seller_username", username);
  return !error;
}

export async function bumpListing(id: string): Promise<void> {
  // Increment bumps and update created_at to push to top
  const { data } = await supabase
    .from("listings")
    .select("bumps")
    .eq("id", id)
    .maybeSingle();
  const currentBumps = (data?.bumps as number) || 0;
  await supabase
    .from("listings")
    .update({
      bumps: currentBumps + 1,
      created_at: new Date().toISOString(),
    })
    .eq("id", id);
}

export async function incrementViews(id: string): Promise<void> {
  const { data } = await supabase
    .from("listings")
    .select("views")
    .eq("id", id)
    .maybeSingle();
  const currentViews = (data?.views as number) || 0;
  await supabase
    .from("listings")
    .update({ views: currentViews + 1 })
    .eq("id", id);
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
