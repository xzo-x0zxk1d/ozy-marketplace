import { ImageResponse } from "next/og";
import { getListingById } from "@/lib/storage";

export const runtime = "edge";
export const alt = "Ozy Marketplace Listing";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({ params }: { params: { id: string } }) {
  const listing = await getListingById(params.id);
  const title = listing?.title || "Listing Not Found";
  const price = listing?.price || "";
  const category = listing?.category || "";
  const seller = listing?.sellerDiscord || "";
  const game = listing?.game || "";

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0D0D0D 0%, #1A1A1A 100%)",
          width: "100%", height: "100%",
          display: "flex", flexDirection: "column",
          position: "relative", overflow: "hidden",
        }}
      >
        {/* Red accent top bar */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, background: "linear-gradient(90deg, #8B1E2D, #B3263B, #8B1E2D)" }} />
        {/* Grid bg */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(42,42,42,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(42,42,42,0.4) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        {/* Glow */}
        <div style={{ position: "absolute", top: -100, right: -100, width: 500, height: 500, background: "radial-gradient(circle, rgba(179,38,59,0.2), transparent 70%)", borderRadius: "50%" }} />

        <div style={{ display: "flex", flex: 1, padding: "48px 56px", gap: 48, alignItems: "center" }}>
          {/* Left content */}
          <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: 16 }}>
            {/* Badges */}
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ background: "rgba(139,30,45,0.3)", border: "1px solid #8B1E2D", color: "#B3263B", fontSize: 14, fontWeight: 700, padding: "4px 14px", borderRadius: 6 }}>{category}</div>
              {game && <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid #2a2a2a", color: "#888", fontSize: 14, fontWeight: 700, padding: "4px 14px", borderRadius: 6 }}>{game}</div>}
            </div>
            {/* Title */}
            <div style={{ fontSize: 56, fontWeight: 900, color: "#EAEAEA", lineHeight: 1.1, letterSpacing: -1 }}>{title.length > 45 ? title.slice(0, 45) + "…" : title}</div>
            {/* Price */}
            <div style={{ fontSize: 36, fontWeight: 800, color: "#2ecc71" }}>{price}</div>
            {/* Seller */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(114,137,218,0.2)", border: "1px solid rgba(114,137,218,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>💬</div>
              <div style={{ fontSize: 18, color: "#7289da", fontWeight: 700 }}>{seller}</div>
            </div>
          </div>

          {/* Right image */}
          {listing?.imageUrl && (
            <div style={{ width: 280, height: 280, borderRadius: 16, overflow: "hidden", border: "2px solid #2a2a2a", flexShrink: 0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={listing.imageUrl} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          )}
          {!listing?.imageUrl && (
            <div style={{ width: 240, height: 240, borderRadius: 16, background: "rgba(26,26,26,0.8)", border: "2px solid #2a2a2a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 80, flexShrink: 0 }}>💎</div>
          )}
        </div>

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 56px", borderTop: "1px solid #2a2a2a", background: "rgba(0,0,0,0.3)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#B3263B", letterSpacing: 2 }}>OZY</div>
            <div style={{ fontSize: 14, color: "#555", letterSpacing: 3, fontWeight: 700 }}>MARKETPLACE</div>
          </div>
          <div style={{ fontSize: 14, color: "#555" }}>ozy-marketplace.vercel.app</div>
        </div>
      </div>
    ),
    size
  );
}
