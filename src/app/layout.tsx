import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ozy Marketplace – Roblox Marketplace for Items & Services",
  description:
    "Buy, sell, trade Roblox items, hire skilled people, and showcase services on Ozy Marketplace. Connect through Discord DMs. Made by Ozyrion.",

  icons: {
    icon: "https://www.image2url.com/r2/default/images/1777298691743-e9df5773-13ca-4a33-b269-ff3357c8910a.png",
  },
  openGraph: {
    title: "Ozy Marketplace",
    description: "The best Roblox random marketplace. Trade via Discord DMs.",
    images: [
      "https://www.image2url.com/r2/default/images/1777298691743-e9df5773-13ca-4a33-b269-ff3357c8910a.png",
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
