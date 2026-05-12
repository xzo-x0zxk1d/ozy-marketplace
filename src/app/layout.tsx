import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

const BASE_URL = "https://ozy-marketplace.vercel.app";
const OG_IMAGE = "https://www.image2url.com/r2/default/images/1777298691743-e9df5773-13ca-4a33-b269-ff3357c8910a.png";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Ozy Marketplace – Roblox Items, Nitro, Services & More",
    template: "%s | Ozy Marketplace",
  },
  description:
    "The #1 Roblox community marketplace. Buy, sell & trade Roblox limiteds, Robux, Nitro, in-game items, accounts & hire services — Scripting, GFX, Coaching, Quest Completing and more. All deals via Discord DMs. Made by Ozyrion.",
  keywords: [
    "roblox marketplace","roblox trading","roblox items","roblox limiteds",
    "roblox robux","discord nitro","roblox accounts","roblox scripting",
    "roblox gfx","roblox coaching","blox fruits items","pet simulator x",
    "adopt me pets","roblox services","roblox quest completing",
    "ozy marketplace","ozyrion","roblox discord market",
  ],
  authors: [{ name: "Ozyrion", url: "https://ozy-marketplace.vercel.app" }],
  creator: "Ozyrion",
  publisher: "Ozy Marketplace",
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  alternates: { canonical: BASE_URL },
  icons: {
    icon: [{ url: OG_IMAGE, sizes: "512x512", type: "image/png" }],
    apple: OG_IMAGE,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "Ozy Marketplace",
    title: "Ozy Marketplace – Roblox Items, Nitro & Services",
    description:
      "Buy, sell, trade Roblox limiteds, Robux, Nitro & hire services. Scripting, GFX, coaching, quest completing & more — all via Discord DMs.",
    images: [{ url: OG_IMAGE, width: 512, height: 512, alt: "Ozy Marketplace Logo" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@ozyrion",
    creator: "@ozyrion",
    title: "Ozy Marketplace – Roblox Items, Nitro & Services",
    description: "The best Roblox community marketplace. Trade & hire via Discord DMs.",
    images: [OG_IMAGE],
  },
  verification: {
    // Add your Google Search Console verification token here when you have it:
    // google: "YOUR_VERIFICATION_TOKEN",
  },
};

// JSON-LD structured data for Google rich results
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      "url": BASE_URL,
      "name": "Ozy Marketplace",
      "description": "The #1 Roblox community marketplace for items, services & Discord trading.",
      "potentialAction": {
        "@type": "SearchAction",
        "target": { "@type": "EntryPoint", "urlTemplate": `${BASE_URL}/marketplace?q={search_term_string}` },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      "name": "Ozy Marketplace",
      "url": BASE_URL,
      "logo": { "@type": "ImageObject", "url": OG_IMAGE },
      "founder": { "@type": "Person", "name": "Ozyrion" },
      "sameAs": ["https://discord.com"],
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#0D0D0D" />
        <meta name="color-scheme" content="dark" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
