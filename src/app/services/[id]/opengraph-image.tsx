import { ImageResponse } from "next/og";
import { getServiceById } from "@/lib/storage";

export const runtime = "edge";
export const alt = "Ozy Marketplace Service";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({ params }: { params: { id: string } }) {
  const service = await getServiceById(params.id);
  const title = service?.title || "Service Not Found";
  const price = service?.price || "";
  const category = service?.category || "";
  const seller = service?.sellerDiscord || "";
  const delivery = service?.deliveryTime || "";

  return new ImageResponse(
    (
      <div style={{ background: "linear-gradient(135deg, #0D0D0D 0%, #1A1A1A 100%)", width: "100%", height: "100%", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, background: "linear-gradient(90deg, #8B1E2D, #B3263B, #8B1E2D)" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(42,42,42,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(42,42,42,0.4) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div style={{ position: "absolute", top: -100, left: -100, width: 500, height: 500, background: "radial-gradient(circle, rgba(114,137,218,0.12), transparent 70%)", borderRadius: "50%" }} />

        <div style={{ display: "flex", flex: 1, padding: "48px 56px", gap: 48, alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: 16 }}>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ background: "rgba(114,137,218,0.15)", border: "1px solid rgba(114,137,218,0.4)", color: "#7289da", fontSize: 14, fontWeight: 700, padding: "4px 14px", borderRadius: 6 }}>SERVICE</div>
              <div style={{ background: "rgba(139,30,45,0.3)", border: "1px solid #8B1E2D", color: "#B3263B", fontSize: 14, fontWeight: 700, padding: "4px 14px", borderRadius: 6 }}>{category}</div>
            </div>
            <div style={{ fontSize: 52, fontWeight: 900, color: "#EAEAEA", lineHeight: 1.1 }}>{title.length > 48 ? title.slice(0, 48) + "…" : title}</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: "#2ecc71" }}>{price}</div>
            {delivery && <div style={{ fontSize: 16, color: "#f1c40f", fontWeight: 700 }}>⏱ Delivery: {delivery}</div>}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
              <div style={{ fontSize: 18, color: "#7289da", fontWeight: 700 }}>💬 {seller}</div>
            </div>
          </div>
          {service?.imageUrl ? (
            <div style={{ width: 260, height: 260, borderRadius: 16, overflow: "hidden", border: "2px solid #2a2a2a", flexShrink: 0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={service.imageUrl} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          ) : (
            <div style={{ width: 220, height: 220, borderRadius: 16, background: "rgba(26,26,26,0.8)", border: "2px solid #2a2a2a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 80, flexShrink: 0 }}>⚙️</div>
          )}
        </div>

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
