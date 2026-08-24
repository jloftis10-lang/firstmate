import type { Metadata } from "next";
import { Archivo, Newsreader, Space_Mono } from "next/font/google";
import { JsonLd } from "@/components/JsonLd";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  // The lede sets "miss" in italic — the one italic in the design.
  style: ["normal", "italic"],
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // The production domain. Canonicals, OG tags and share links all derive
  // from this — keep it in step with the Vercel domain settings.
  metadataBase: new URL("https://cruiseread.com"),
  title: {
    default: "CruiseRead — cruise booking intelligence for travel advisors",
    template: "%s — CruiseRead",
  },
  description:
    "Pre-booking cruise intelligence for travel advisors: cabin, money and expectation traps tied to the ship and client.",
  alternates: { canonical: "/" },
  icons: { icon: "/icon.svg" },
  openGraph: {
    title: "CruiseRead",
    description:
      "Pre-booking cruise intelligence for travel advisors: cabin, money and expectation traps tied to the ship and client.",
    url: "https://cruiseread.com",
    siteName: "CruiseRead",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${newsreader.variable} ${spaceMono.variable} h-full antialiased`}
    >
      {/* Root carries fonts and the stylesheet only. The advisor chrome
          lives in `(app)`; `(client)` stays bare on purpose — see the
          note in (app)/layout.tsx. */}
      <body className="min-h-full flex flex-col">
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebSite",
                "@id": "https://cruiseread.com/#website",
                name: "CruiseRead",
                url: "https://cruiseread.com",
                description:
                  "Pre-booking cruise intelligence for travel advisors.",
              },
              {
                "@type": "WebApplication",
                "@id": "https://cruiseread.com/check#application",
                name: "CruiseRead Booking Check",
                url: "https://cruiseread.com/check",
                applicationCategory: "BusinessApplication",
                operatingSystem: "Web",
                audience: {
                  "@type": "Audience",
                  audienceType: "Travel advisors",
                },
              },
            ],
          }}
        />
        {children}
      </body>
    </html>
  );
}
